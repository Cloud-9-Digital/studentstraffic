const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '../../../..');
const {catalogPayloadSchema} = require(path.join(root, 'scripts/lib/catalog-payload-schema.ts'));
const {readContentMigrations} = require(path.join(root, 'scripts/lib/content-migrations.ts'));
(async () => {
  const raw = fs.readFileSync(path.join(__dirname, 'payload.draft.json'), 'utf8');
  const parsed = catalogPayloadSchema.safeParse(JSON.parse(raw));
  if (!parsed.success) { console.error(JSON.stringify(parsed.error.issues, null, 2)); process.exitCode = 1; return; }
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'gct-offline-'));
  const id = '9999-gct-isolated-validation';
  try {
    const folder = path.join(tmp, id); fs.mkdirSync(folder);
    fs.writeFileSync(path.join(folder, 'payload.json'), raw);
    fs.writeFileSync(path.join(folder, 'manifest.json'), JSON.stringify({version:1,id,description:'Temporary isolated GCT reader test, not a reserved migration',createdAt:'2026-10-27',payload:'payload.json'}));
    const result = await readContentMigrations(tmp, {onlyId:id, now:new Date('2026-10-27T00:00:00.000Z')});
    const report = {checkedAt:new Date().toISOString(), payloadSha256:crypto.createHash('sha256').update(raw).digest('hex'),schema:'scripts/lib/catalog-payload-schema.ts',schemaPass:true,reader:'scripts/lib/content-migrations.ts readContentMigrations',readerPass:true,expiredEvidence:result.flatMap(x=>x.expiredEvidence),counts:{universities:parsed.data.universities.length,programmes:parsed.data.universities.flatMap(x=>x.programmes).length,courses:parsed.data.courses.length,evidence:parsed.data.evidence.length},isolation:'Temporary OS directory, removed after validation. No content-migration reservation, database access, uploads or publication.',editorialStatus:'Offline schema/reader validated; integrator editorial review and media delivery remain pending.'};
    fs.writeFileSync(path.join(__dirname,'validation-report.json'),JSON.stringify(report,null,2)+'\n'); console.log(JSON.stringify(report,null,2));
  } finally { fs.rmSync(tmp,{recursive:true,force:true}); }
})().catch(e=>{ console.error(e.stack); process.exitCode=1; });
