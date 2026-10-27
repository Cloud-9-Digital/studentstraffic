import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../..');
const require = createRequire(path.join(root, 'package.json'));
const { catalogPayloadSchema } = require(path.join(root, 'scripts/lib/catalog-payload-schema.ts'));
const { readContentMigrations } = require(path.join(root, 'scripts/lib/content-migrations.ts'));
const digest = bytes => createHash('sha256').update(bytes).digest('hex');

export function checkSources(manifest, payload) {
  if (manifest.version !== 1 || manifest.universitySlug !== 'easwari-engineering-college') throw new Error('Unexpected preparation manifest.');
  if (payload.universities.length !== 1 || payload.universities[0].slug !== manifest.universitySlug || payload.universities[0].programmes.length !== 15) throw new Error('Unexpected institution/programme scope.');
  if (payload.universities[0].logoUrl || payload.universities[0].coverImageUrl) throw new Error('Source payload must not pretend media is already hosted.');
  if (manifest.approvedSourceAssets.length !== 2 || new Set(manifest.approvedSourceAssets.map(a => a.kind)).size !== 2) throw new Error('Exactly one logo and one cover are required.');
  for (const a of manifest.approvedSourceAssets) {
    const url = new URL(a.sourceUrl);
    if (!['logo', 'cover'].includes(a.kind) || a.status !== 'reviewed-source-ready-for-local-upload') throw new Error('Unreviewed or held media.');
    if (url.protocol !== 'https:' || !['cdn.npfs.co'].includes(url.hostname)) throw new Error('Unexpected media source.');
    if (!/^[a-f0-9]{64}$/.test(a.sha256) || !a.rightsBasis || !a.visualReview) throw new Error('Media provenance is incomplete.');
    if (a.proposedPublicId !== `studentstraffic/universities/${manifest.universitySlug}/${a.kind}-${a.sha256.slice(0, 12)}`) throw new Error('Unexpected upload destination.');
    const attribution = payload.universities[0].mediaAttribution[a.kind];
    if (attribution?.sourceUrl !== a.sourceUrl || attribution?.rights !== a.rightsBasis) throw new Error('Media attribution must match reviewed source provenance.');
  }
  catalogPayloadSchema.parse(payload);
}

export function checkHostedMapping(mapping, asset) {
  if (!mapping || mapping.sourceSha256 !== asset.sha256) throw new Error(`Missing/mismatched ${asset.kind} source checksum.`);
  const u = new URL(mapping.secureUrl);
  if (u.protocol !== 'https:' || u.hostname !== 'res.cloudinary.com' || u.username || u.password || !u.pathname.includes('/image/upload/')) throw new Error('Only actual Cloudinary image-delivery URLs are accepted.');
}

export async function readImage(url, expectedHash, fetcher = fetch) {
  const response = await fetcher(url, { redirect: 'error', signal: AbortSignal.timeout(45000) });
  if (response.status !== 200 || !(response.headers.get('content-type') || '').startsWith('image/')) throw new Error('Media must return HTTP 200 image bytes without a redirect.');
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 500 || bytes.length > 20 * 1024 * 1024 || digest(bytes) !== expectedHash) throw new Error('Media bytes changed or are not the reviewed original. Stop for review; do not replace the checksum to force success.');
  return bytes;
}

export async function validateActualReader(payload) {
  catalogPayloadSchema.parse(payload);
  const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'easwari-preparation-'));
  const id = '9999-isolated-preparation-validation';
  try {
    await fs.mkdir(path.join(temp, id));
    await fs.writeFile(path.join(temp, id, 'manifest.json'), JSON.stringify({ version: 1, id, description: 'Disposable offline preparation check; not a migration reservation.', createdAt: '2026-10-27', payload: 'payload.json' }));
    await fs.writeFile(path.join(temp, id, 'payload.json'), JSON.stringify(payload));
    const rows = await readContentMigrations(temp, { onlyId: id, now: new Date() });
    const expired = rows.flatMap(r => r.expiredEvidence);
    if (expired.length) throw new Error('Evidence has expired; refresh before preparation.');
    return { schemaPass: true, actualReaderPass: true, expiredEvidenceCount: 0, programmes: payload.universities[0].programmes.length, evidenceRows: payload.evidence.length };
  } finally {
    await fs.rm(temp, { recursive: true, force: true });
  }
}

async function main() {
  const args = process.argv.slice(2);
  const value = flag => { const i = args.indexOf(flag); return i < 0 ? null : args[i + 1]; };
  const upload = args.includes('--upload-media');
  const mapFile = value('--media-map');
  if (args.includes('--validate') && (upload || mapFile)) throw new Error('Validate-only cannot be combined with media preparation.');
  if (upload && mapFile) throw new Error('Choose upload-media OR an existing media map.');
  if (args.some((a, i) => a.startsWith('--') && !['--validate', '--upload-media', '--media-map', '--output'].includes(a))) throw new Error('Unknown option.');
  const manifest = JSON.parse(await fs.readFile(path.join(here, 'media-sources.json'), 'utf8'));
  const payload = JSON.parse(await fs.readFile(path.join(here, manifest.payload), 'utf8'));
  checkSources(manifest, payload);
  const validation = await validateActualReader(payload);
  if (!upload && !mapFile) {
    console.log(JSON.stringify({ ...validation, readyForLocalMediaPreparation: true, readyForDirectApply: false, uploads: 0, databaseAccess: false, note: 'Source links are reviewed. Explicit local upload or verified existing mappings are still required before a real migration.' }, null, 2));
    return;
  }
  const outputArg = value('--output');
  if (!outputArg || outputArg.startsWith('--')) throw new Error('--output is required.');
  const output = path.resolve(outputArg);
  if (output.startsWith(path.join(root, 'content-migrations') + path.sep)) throw new Error('Prepare outside content-migrations, then use the locked reservation workflow.');
  try { await fs.access(output); throw new Error('Output already exists; refusing to overwrite.'); } catch (e) { if (e.code !== 'ENOENT') throw e; }
  let mappings = mapFile ? JSON.parse(await fs.readFile(path.resolve(mapFile), 'utf8')) : {};
  if (upload) {
    // Never overwrite another file as a checkpoint. An interrupted run can use a new
    // output basename: the same immutable Cloudinary IDs are reconciled, not duplicated.
    try { await fs.access(output + '.media-map.json'); throw new Error('Media checkpoint already exists. Review it; use --media-map if complete, or a new output basename to reconcile an interrupted upload.'); } catch (e) { if (e.code !== 'ENOENT') throw e; }
    // This branch is invoked ONLY by the local operator's explicit --upload-media command.
    // No database package, queue operation, migration reservation or cache operation is imported.
    await import(path.join(root, 'scripts/lib/load-script-env.mjs'));
    for (const key of ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET']) if (!process.env[key]) throw new Error(`Local environment is missing ${key}; never paste secrets into chat.`);
    const { v2: cloudinary } = await import('cloudinary');
    cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET, secure: true });
    for (const a of manifest.approvedSourceAssets) {
      // Deterministic checksum-qualified IDs and a read-before-create reconcile interrupted uploads.
      let result;
      try { result = await cloudinary.api.resource(a.proposedPublicId, { resource_type: 'image', context: true }); }
      catch (e) { if ((e.http_code ?? e.error?.http_code) !== 404) throw new Error('Cloudinary resource check failed. No automatic upload retry.'); }
      if (result && result.context?.custom?.source_sha256 !== a.sha256) throw new Error('Existing asset provenance differs. Refusing overwrite.');
      if (!result) {
        const bytes = await readImage(a.sourceUrl, a.sha256);
        result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream({ public_id: a.proposedPublicId, resource_type: 'image', overwrite: false, unique_filename: false, context: { source_sha256: a.sha256 } }, (error, data) => error ? reject(new Error('Upload outcome may be uncertain. Rerun reconciles the exact public ID; do not change IDs to retry.')) : resolve(data));
          stream.end(bytes);
        });
      }
      mappings[a.kind] = { secureUrl: result.secure_url, sourceSha256: a.sha256, publicId: result.public_id };
      await fs.writeFile(output + '.media-map.json', JSON.stringify(mappings, null, 2) + '\n');
    }
  }
  const finalPayload = structuredClone(payload);
  for (const a of manifest.approvedSourceAssets) {
    const mapping = mappings[a.kind];
    checkHostedMapping(mapping, a);
    await readImage(mapping.secureUrl, a.sha256);
    finalPayload.universities[0][a.kind === 'logo' ? 'logoUrl' : 'coverImageUrl'] = mapping.secureUrl;
  }
  const finalValidation = await validateActualReader(finalPayload);
  await fs.writeFile(output, JSON.stringify(finalPayload, null, 2) + '\n', { flag: 'wx' });
  console.log(JSON.stringify({ output, ...finalValidation, verifiedHostedMedia: 2, readyForLockedMigrationPackaging: true, databaseAccess: false, next: 'Recheck remote claims; reserve through content:reserve; link the complete payload in the queue; run scoped/full offline validation and commit before user-owned apply.' }, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(error => { console.error(error.message); process.exitCode = 1; });
