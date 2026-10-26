import assert from "node:assert/strict";
import test from "node:test";
import vm from "node:vm";

import { WEBMCP_BOOTSTRAP_SCRIPT } from "@/lib/webmcp";

type Tool = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations?: { readOnlyHint?: boolean };
  execute: (input: Record<string, unknown>, options?: { signal?: AbortSignal }) => Promise<unknown>;
};

const ORIGIN = "https://www.studentstraffic.com";
// Objects made inside the vm sandbox have its prototypes, so compare plain copies.
const plain = (value: unknown) => JSON.parse(JSON.stringify(value));

/** Runs the inline script in a fake page with `modelContext` on `document` or `navigator`. */
function runScript(host: "document" | "navigator" | "none" = "document") {
  const registered = new Map<string, Tool>();
  const fetches: Array<{ url: string; accept?: string }> = [];
  const navigations: string[] = [];
  const listeners: Array<() => void> = [];
  const modelContext = {
    registerTool(tool: Tool, options?: { signal?: AbortSignal }) {
      registered.set(tool.name, tool);
      return new Promise((_resolve, reject) => {
        options?.signal?.addEventListener("abort", () => {
          registered.delete(tool.name);
          reject(options.signal?.reason);
        });
      });
    },
  };
  const window: Record<string, unknown> = {};
  const context = vm.createContext({
    window,
    document: {
      ...(host === "document" ? { modelContext } : {}),
      addEventListener: (_event: string, listener: () => void) => listeners.push(listener),
    },
    navigator: host === "navigator" ? { modelContext } : {},
    location: { origin: ORIGIN, assign: (url: string) => navigations.push(url) },
    URL,
    AbortController,
    Error,
    encodeURIComponent,
    fetch: async (url: string, init?: { headers?: Record<string, string> }) => {
      fetches.push({ url, accept: init?.headers?.Accept });
      if (url.includes("/api/suggestions")) {
        return Response.json([{ type: "university", label: "Jamia Millia Islamia", subtitle: "New Delhi, India", href: "/university/jamia-millia-islamia" }]);
      }
      return new Response("# Jamia Millia Islamia", { headers: { "content-type": "text/markdown" } });
    },
  });
  vm.runInContext(WEBMCP_BOOTSTRAP_SCRIPT, context);
  return { registered, fetches, navigations, listeners, window };
}

test("registers three read-only tools as the page loads, on document.modelContext or the preview navigator API", () => {
  for (const host of ["document", "navigator"] as const) {
    const { registered } = runScript(host);
    assert.deepEqual([...registered.keys()], ["search_catalog", "get_university_details", "open_page"]);
    for (const tool of registered.values()) {
      assert.equal(tool.annotations?.readOnlyHint, true);
      assert.equal((tool.inputSchema as { type: string }).type, "object");
      assert.ok(tool.description.length > 20);
    }
  }
});

test("does nothing without a model context, and retries once the DOM is ready", () => {
  const page = runScript("none");
  assert.equal(page.registered.size, 0);
  assert.equal(page.listeners.length, 1);
});

test("search and details read from this site only; aborting unregisters", async () => {
  const { registered, fetches, window } = runScript();
  const search = (await registered.get("search_catalog")!.execute({ query: "jamia" })) as { results: Array<{ url: string }> };
  assert.equal(search.results[0].url, `${ORIGIN}/university/jamia-millia-islamia`);
  assert.equal(fetches[0].url, `${ORIGIN}/api/suggestions?q=jamia`);
  assert.deepEqual(plain(await registered.get("search_catalog")!.execute({ query: "j" })), { results: [] });

  assert.equal(await registered.get("get_university_details")!.execute({ slug: "jamia-millia-islamia" }), "# Jamia Millia Islamia");
  assert.equal(fetches[1].accept, "text/markdown");
  await assert.rejects(registered.get("get_university_details")!.execute({ slug: "../admin" }), /Invalid university slug/);

  (window.__stWebMcp as AbortController).abort();
  assert.equal(registered.size, 0);
});

test("open_page navigates only to public catalogue pages", async () => {
  const { registered, navigations } = runScript();
  const open = registered.get("open_page")!;
  assert.deepEqual(plain(await open.execute({ path: "/university/jamia-millia-islamia" })), { opened: `${ORIGIN}/university/jamia-millia-islamia` });
  for (const path of ["/admin", "/login", "/dashboard", "https://evil.example", "//evil.example", "/api/leads"]) {
    await assert.rejects(open.execute({ path }), /Only university/);
  }
  assert.deepEqual(plain(navigations), [`${ORIGIN}/university/jamia-millia-islamia`]);
});
