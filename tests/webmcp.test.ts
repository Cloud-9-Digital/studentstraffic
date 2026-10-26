import assert from "node:assert/strict";
import test from "node:test";

import {
  createSiteTools,
  getModelContext,
  registerSiteTools,
  type ModelContextLike,
  type WebMcpTool,
} from "@/lib/webmcp";

function mockContext() {
  const registered = new Map<string, WebMcpTool>();
  const context: ModelContextLike = {
    registerTool(tool, options) {
      registered.set(tool.name, tool);
      return new Promise((_resolve, reject) => {
        options?.signal?.addEventListener("abort", () => {
          registered.delete(tool.name);
          reject(options.signal?.reason);
        });
      });
    },
  };
  return { context, registered };
}

function deps(overrides: Partial<Parameters<typeof createSiteTools>[0]> = {}) {
  const calls: Array<{ url: string; init?: RequestInit }> = [];
  const navigations: string[] = [];
  return {
    calls,
    navigations,
    deps: {
      origin: "https://www.studentstraffic.com",
      fetch: (async (url: string, init?: RequestInit) => {
        calls.push({ url, init });
        if (url.includes("/api/suggestions")) {
          return Response.json([
            { type: "university", label: "Jamia Millia Islamia", subtitle: "New Delhi, India", href: "/university/jamia-millia-islamia" },
          ]);
        }
        return new Response("# Jamia Millia Islamia\n", { headers: { "Content-Type": "text/markdown" } });
      }) as typeof fetch,
      navigate: (url: string) => navigations.push(url),
      ...overrides,
    },
  };
}

test("does nothing without a model context", () => {
  assert.equal(getModelContext(undefined, undefined), null);
  assert.equal(getModelContext({}, {}), null);
  assert.equal(getModelContext({ modelContext: {} }, {}), null);
});

test("finds document.modelContext (spec) and navigator.modelContext (preview)", () => {
  const { context } = mockContext();
  assert.equal(getModelContext({ modelContext: context }, {}), context);
  assert.equal(getModelContext({}, { modelContext: context }), context);
});

test("registers three read-only tools and unregisters them on abort", async () => {
  const { context, registered } = mockContext();
  const controller = new AbortController();
  registerSiteTools(context, deps().deps, controller.signal);

  assert.deepEqual([...registered.keys()].sort(), ["get_university_details", "open_page", "search_catalog"]);
  for (const tool of registered.values()) {
    assert.equal(tool.annotations?.readOnlyHint, true);
    assert.equal((tool.inputSchema as { type: string }).type, "object");
  }

  controller.abort();
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(registered.size, 0);
});

test("honours the preview API's unregister() handle and survives a throwing registerTool", () => {
  let unregistered = 0;
  const controller = new AbortController();
  registerSiteTools(
    { registerTool: () => ({ unregister: () => { unregistered += 1; } }) },
    deps().deps,
    controller.signal,
  );
  controller.abort();
  assert.equal(unregistered, 3);

  assert.doesNotThrow(() =>
    registerSiteTools({ registerTool: () => { throw new Error("nope"); } }, deps().deps, new AbortController().signal),
  );
});

test("tools only read from and navigate within the site", async () => {
  const { deps: siteDeps, calls, navigations } = deps();
  const tools = new Map(createSiteTools(siteDeps).map((tool) => [tool.name, tool]));

  const search = (await tools.get("search_catalog")!.execute({ query: "jamia" })) as { results: Array<{ url: string }> };
  assert.equal(calls[0].url, "https://www.studentstraffic.com/api/suggestions?q=jamia");
  assert.equal(calls[0].init?.method, undefined);
  assert.equal(search.results[0].url, "https://www.studentstraffic.com/university/jamia-millia-islamia");

  const markdown = await tools.get("get_university_details")!.execute({ slug: "jamia-millia-islamia" });
  assert.equal(calls[1].url, "https://www.studentstraffic.com/university/jamia-millia-islamia");
  assert.deepEqual(calls[1].init?.headers, { Accept: "text/markdown" });
  assert.equal(markdown, "# Jamia Millia Islamia\n");
  await assert.rejects(tools.get("get_university_details")!.execute({ slug: "../admin" }));

  await tools.get("open_page")!.execute({ path: "/countries/georgia" });
  assert.deepEqual(navigations, ["https://www.studentstraffic.com/countries/georgia"]);
  for (const path of ["https://evil.example", "//evil.example", "/admin/leads", "/api/chat/lead", "/dashboard", "/login"]) {
    await assert.rejects(tools.get("open_page")!.execute({ path }), path);
  }
  assert.equal(navigations.length, 1);
});
