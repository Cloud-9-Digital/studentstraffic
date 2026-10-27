import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { checkSources, checkHostedMapping, readImage, validateActualReader } from './prepare-local.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
const manifest = JSON.parse(await fs.readFile(path.join(here, 'media-sources.json'), 'utf8'));
const payload = JSON.parse(await fs.readFile(path.join(here, 'payload.source.json'), 'utf8'));
const asset = manifest.approvedSourceAssets[0];

test('complete source payload has reviewed links, not fake public image URLs', () => checkSources(manifest, payload));
test('actual isolated reader validates nine offerings without DB or reservation', async () => {
  const result = await validateActualReader(payload);
  assert.equal(result.programmes, 9); assert.equal(result.expiredEvidenceCount, 0);
});
test('held media cannot be promoted by preparation', () => {
  const m = structuredClone(manifest); m.approvedSourceAssets[0].status = 'hold';
  assert.throws(() => checkSources(m, payload), /held media/);
});
test('source payload rejects public hotlinks', () => {
  const p = structuredClone(payload); p.universities[0].logoUrl = asset.sourceUrl;
  assert.throws(() => checkSources(manifest, p), /already hosted/);
});
test('source host and checksum-qualified destination are constrained', () => {
  const m = structuredClone(manifest); m.approvedSourceAssets[0].sourceUrl = 'http://127.0.0.1/private';
  assert.throws(() => checkSources(m, payload), /Unexpected media source/);
});
test('public provenance retains the reviewed official source basis', () => {
  const p = structuredClone(payload); p.universities[0].mediaAttribution.cover.rights = 'invented open licence';
  assert.throws(() => checkSources(manifest, p), /Media attribution must/);
});
test('non-Cloudinary mappings and wrong-source mappings fail closed', () => {
  assert.throws(() => checkHostedMapping({ secureUrl: asset.sourceUrl, sourceSha256: asset.sha256 }, asset), /Cloudinary/);
  assert.throws(() => checkHostedMapping({ secureUrl: 'https://res.cloudinary.com/test/image/upload/test.png', sourceSha256: '0'.repeat(64) }, asset), /checksum/);
});
test('reviewed byte verification accepts exact mocked image bytes', async () => {
  const bytes = Buffer.alloc(1000, 1), hash = createHash('sha256').update(bytes).digest('hex');
  const result = await readImage('https://example.invalid/test', hash, async () => new Response(bytes, { status: 200, headers: { 'content-type': 'image/png' } }));
  assert.deepEqual(result, bytes);
});
test('changed image bytes and HTML error pages fail closed', async () => {
  await assert.rejects(readImage('https://example.invalid/test', '0'.repeat(64), async () => new Response(Buffer.alloc(1000), { headers: { 'content-type': 'image/png' } })), /changed/);
  await assert.rejects(readImage('https://example.invalid/test', '0'.repeat(64), async () => new Response('error', { headers: { 'content-type': 'text/html' } })), /HTTP 200 image/);
});
test('validate-only flag cannot accidentally upload', () => {
  const r = spawnSync(process.execPath, ['--import', 'tsx', path.join(here, 'prepare-local.mjs'), '--validate', '--upload-media'], { encoding: 'utf8' });
  assert.equal(r.status, 1); assert.match(r.stderr, /Validate-only cannot/);
});
test('existing output is never overwritten', async () => {
  const d = await fs.mkdtemp(path.join(os.tmpdir(), 'psg-output-test-'));
  try {
    const output = path.join(d, 'keep.json'); await fs.writeFile(output, 'preserve my edits');
    const r = spawnSync(process.execPath, ['--import', 'tsx', path.join(here, 'prepare-local.mjs'), '--media-map', path.join(d, 'missing-map.json'), '--output', output], { encoding: 'utf8' });
    assert.equal(r.status, 1); assert.match(r.stderr, /Output already exists/);
    assert.equal(await fs.readFile(output, 'utf8'), 'preserve my edits');
  } finally { await fs.rm(d, { recursive: true, force: true }); }
});

test('all nine routes preserve exact restricted TNEA audience without B.Des or PG substitution', () => {
  assert.equal(payload.universities[0].programmes.length, 9);
  for (const p of payload.universities[0].programmes) {
    assert.equal(p.audienceEligibility.availability, 'restricted');
    assert.ok(p.audienceEligibility.restrictions.some(x => x.includes('4 March 2021')));
    assert.ok(p.admissionsContent.documentsRequired.application.some(x => x.includes('Headquarters Tahsildar')));
    assert.ok(!p.canonicalCourseSlug.includes('bdes'));
  }
});
