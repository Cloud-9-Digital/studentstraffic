import assert from "node:assert/strict";
import test from "node:test";

import {
  formatProgramDisplayName,
  getProgramDisplayLabel,
  type ProgramVariantSource,
} from "@/lib/program-variant";
import { buildProgramMetadata, TITLE_MAX_CHARS } from "@/lib/university-metadata";

const presidency: ProgramVariantSource[] = [
  {
    slug: "presidency-aece1",
    title: "B.A. Economics",
    medium: "English",
    overview: "B.A. Economics is a three-year regular undergraduate programme at Presidency College, Chepauk, Chennai, ShiftI.",
    restrictions: ["Presidency College, Chepauk, Chennai; ShiftI"],
  },
  {
    slug: "presidency-aect1",
    title: "B.A. Economics",
    medium: "Tamil",
    overview: "B.A. Economics is a three-year regular undergraduate programme at Presidency College, Chepauk, Chennai, ShiftI.",
    restrictions: ["Presidency College, Chepauk, Chennai; ShiftI"],
  },
  {
    slug: "presidency-aect2",
    title: "B.A. Economics",
    medium: "Tamil",
    overview: "B.A. Economics is a three-year regular undergraduate programme at Presidency College, Chepauk, Chennai, ShiftII.",
    restrictions: ["Presidency College, Chepauk, Chennai; ShiftII"],
  },
];

const label = (slug: string, group: ProgramVariantSource[], shortName = "Bachelor's Economics") =>
  getProgramDisplayLabel(group.find((item) => item.slug === slug)!, group, shortName);

test("shift and medium siblings get distinct, minimal labels", () => {
  const names = presidency.map((item) => formatProgramDisplayName(label(item.slug, presidency)));
  assert.deepEqual(names, [
    "B.A. Economics (English medium)",
    "B.A. Economics (Tamil medium, Shift I)",
    "B.A. Economics (Tamil medium, Shift II)",
  ]);
});

test("a programme without siblings keeps the course short name", () => {
  assert.deepEqual(label("presidency-aece1", [presidency[0]]), {
    courseLabel: "Bachelor's Economics",
  });
});

test("aided/self-financed and campus siblings are told apart", () => {
  const group: ProgramVariantSource[] = [
    { slug: "a", title: "B.Com.", medium: "Not confirmed", overview: "B.Com. is a three-year regular aided degree at The American College’s Tallakkulam main campus." },
    { slug: "b", title: "B.Com.", medium: "Not confirmed", overview: "B.Com. is a three-year regular self-financed degree at The American College’s Tallakkulam main campus." },
    { slug: "c", title: "B.Com.", medium: "Not confirmed", overview: "B.Com. is a three-year regular self-financed degree at The American College’s Chatrappati satellite campus." },
    { slug: "d", title: "B.Com. Computer Applications", medium: "Not confirmed", overview: "B.Com. Computer Applications is a three-year regular self-financed degree at The American College’s Tallakkulam main campus." },
  ];
  const names = group.map((item) => formatProgramDisplayName(label(item.slug, group, "B.Com")));
  assert.deepEqual(names, [
    "B.Com. (Aided)",
    "B.Com. (Self-financed, Tallakkulam campus)",
    "B.Com. (Self-financed, Chatrappati campus)",
    "B.Com. Computer Applications",
  ]);
});

test("extension-centre siblings use the place named in the overview", () => {
  const group: ProgramVariantSource[] = [
    { slug: "msu-m-a-english", title: "M.A. English", medium: "English", overview: "M.A. English is a regular 2-year university programme at Abishekapatti, Tirunelveli. Selection uses marks." },
    { slug: "msu-m-a-english-nagercoil", title: "M.A. English", medium: "English", overview: "M.A. English is a regular 2-year university programme at University PG Extension Centre, Nagercoil. Selection uses marks." },
  ];
  assert.equal(formatProgramDisplayName(label("msu-m-a-english-nagercoil", group, "M.A. English")), "M.A. English (Nagercoil)");
});

test("programme titles for siblings differ and stay within budget", () => {
  const titles = presidency.map((item) =>
    buildProgramMetadata({
      program: {
        offering: { slug: item.slug, annualTuitionUsd: 0 } as never,
        course: { shortName: "Bachelor's Economics", stream: "economics-commerce", level: "bachelors" },
      },
      university: { name: "Presidency College", city: "Chennai" },
      country: { name: "India", slug: "india" },
      section: null,
      displayLabel: label(item.slug, presidency),
    }).title,
  );
  assert.equal(new Set(titles).size, titles.length);
  for (const title of titles) assert.ok(title.length <= TITLE_MAX_CHARS, title);
});

test("main and recognition pages never share a title", () => {
  const titles = presidency.flatMap((item) =>
    (["recognition", null] as const).map(
      (section) =>
        buildProgramMetadata({
          program: {
            offering: { slug: item.slug, annualTuitionUsd: 0 } as never,
            course: { shortName: "Bachelor's Economics", stream: "economics-commerce", level: "bachelors" },
          },
          university: { name: "Presidency College", city: "Chennai" },
          country: { name: "India", slug: "india" },
          section,
          displayLabel: label(item.slug, presidency),
        }).title,
    ),
  );
  const main = titles.filter((_, index) => index % 2 === 1);
  const recognition = titles.filter((_, index) => index % 2 === 0);
  assert.equal(new Set(main).size, main.length, main.join("\n"));
  for (const title of recognition) assert.ok(!main.includes(title), title);
  for (const title of titles) assert.ok(title.length <= TITLE_MAX_CHARS, title);
});
