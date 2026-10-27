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
test('actual isolated reader validates seven offerings without DB or reservation', async () => {
  const result = await validateActualReader(payload);
  assert.equal(result.programmes, 7); assert.equal(result.expiredEvidenceCount, 0);
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
  const d = await fs.mkdtemp(path.join(os.tmpdir(), 'mse-output-test-'));
  try {
    const output = path.join(d, 'keep.json'); await fs.writeFile(output, 'preserve my edits');
    const r = spawnSync(process.execPath, ['--import', 'tsx', path.join(here, 'prepare-local.mjs'), '--media-map', path.join(d, 'missing-map.json'), '--output', output], { encoding: 'utf8' });
    assert.equal(r.status, 1); assert.match(r.stderr, /Output already exists/);
    assert.equal(await fs.readFile(output, 'utf8'), 'preserve my edits');
  } finally { await fs.rm(d, { recursive: true, force: true }); }
});

test('foreign routes keep programme-specific evidence and native stage-specific fees', () => {
  const u=payload.universities[0]; assert.equal(u.programmes.length,7);
  assert.ok(u.recognitionLinks.some(x=>x.url.includes('ugc.gov.in/oldpdf/annualreport/')));
  const i=u.programmes.find(x=>x.slug==='integrated-ma-economics');
  assert.equal(i.admissionsContent.reportedFeeQuote.minAmount,3025);
  assert.equal(i.admissionsContent.reportedFeeQuote.period,'semester');
  assert.match(i.admissionsContent.reportedFeeQuote.category,/BA stage/);
  assert.equal(i.fee.status,'on_request');
  assert.ok(u.programmes.every(x=>x.audienceEligibility.restrictions.some(y=>y.includes('not automatically'))));
});
