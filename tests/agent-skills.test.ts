import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";

import {
  AGENT_SKILLS_SCHEMA,
  buildAgentSkillsIndex,
  getAgentSkill,
  getAgentSkills,
} from "@/lib/agent-skills";
import { absoluteUrl } from "@/lib/metadata";

test("index follows the Agent Skills Discovery v0.2.0 shape", () => {
  const index = buildAgentSkillsIndex();
  assert.equal(index.$schema, AGENT_SKILLS_SCHEMA);
  assert.equal(index.$schema, "https://schemas.agentskills.io/discovery/0.2.0/schema.json");
  assert.ok(index.skills.length > 0);
  for (const skill of index.skills) {
    assert.match(skill.name, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(skill.name.length <= 64);
    assert.equal(skill.type, "skill-md");
    assert.ok(skill.description.length > 0 && skill.description.length <= 1024);
    assert.equal(skill.url, absoluteUrl(`/.well-known/agent-skills/${skill.name}/SKILL.md`));
    assert.match(skill.digest, /^sha256:[0-9a-f]{64}$/);
  }
});

test("each digest is the SHA-256 of the bytes the SKILL.md route serves", () => {
  for (const entry of buildAgentSkillsIndex().skills) {
    const skill = getAgentSkill(entry.name);
    assert.ok(skill);
    const hex = createHash("sha256").update(Buffer.from(skill.body, "utf8")).digest("hex");
    assert.equal(entry.digest, `sha256:${hex}`);
  }
});

test("SKILL.md frontmatter names the skill and matches the index description", () => {
  for (const skill of getAgentSkills()) {
    const match = skill.body.match(/^---\nname: (.+)\ndescription: (.+)\n---\n/);
    assert.ok(match, "frontmatter");
    assert.equal(match[1], skill.name);
    assert.equal(match[2], skill.description);
    // A ": " in a plain YAML scalar would break the frontmatter.
    assert.ok(!skill.description.includes(": "));
  }
});

test("catalogue skill links only to the site origin and documents the fee labels", () => {
  const skill = getAgentSkill("studentstraffic-catalog");
  assert.ok(skill);
  const origin = absoluteUrl("/");
  for (const path of ["llms.txt", "llms-full.txt", "index.md", "contact"]) {
    assert.ok(skill.body.includes(`${origin}${path}`), path);
  }
  assert.match(skill.body, /Accept: text\/markdown/);
  assert.match(skill.body, /\*\*Indian students\*\*/);
  assert.match(skill.body, /\*\*NRI & international\*\*/);
  assert.match(skill.body, /Government quota/);
  assert.match(skill.body, /\*\*Approx\. fees\*\*/);
  assert.equal(getAgentSkill("missing"), null);
});
