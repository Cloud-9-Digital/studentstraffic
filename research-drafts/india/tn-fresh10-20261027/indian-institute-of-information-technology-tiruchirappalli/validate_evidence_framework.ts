import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { readContentMigrations } from '../../../../scripts/lib/content-migrations';

const base='research-drafts/india/tn-fresh10-20261027';
const names=['indian-institute-of-information-technology-tiruchirappalli','great-lakes-institute-of-management-chennai','thiagarajar-college-of-engineering'];
const sha=(value:string|Buffer)=>createHash('sha256').update(value).digest('hex');
async function main(){for(const slug of names) {
 const dir=path.join(base,slug);
 const raw=fs.readFileSync(path.join(dir,'structurally-complete-subset.json'),'utf8');
 const payload=JSON.parse(raw);
 // A disposable reader fixture, never a real content-migrations reservation.
 const fixture=fs.mkdtempSync(path.join(dir,'.isolated-framework-'));
 const id='9999-local-offline-evidence-test';
 const child=path.join(fixture,id);fs.mkdirSync(child);
 fs.writeFileSync(path.join(child,'manifest.json'),JSON.stringify({version:1,id,description:'DISPOSABLE OFFLINE TEST FIXTURE ONLY. Not a reserved or executable catalogue migration; no publication approval.',createdAt:'2026-10-27',payload:'payload.json'},null,2)+'\n');
 fs.writeFileSync(path.join(child,'payload.json'),raw);
 let report:any={checkedAt:new Date().toISOString(),validator:'scripts/lib/content-migrations.ts:readContentMigrations',validatorSha256:sha(fs.readFileSync('scripts/lib/content-migrations.ts')),input:'structurally-complete-subset.json',inputSha256:sha(raw),testMode:'Actual isolated migration reader and complete assertContentFramework; no DB, shared migration directory, ledger, media, network or remote writes',fixtureId:id,fixtureIsNotReservation:true,fixtureRemoved:false,programmeCount:payload.universities[0].programmes.length,publicationReady:false,editorialApproval:false};
 try {
  const results=await readContentMigrations(fixture,{onlyId:id,now:new Date('2026-10-27T12:00:00.000Z')});
  if(results.length!==1)throw new Error(`Expected exactly one test fixture; received ${results.length}`);
  report={...report,success:true,result:'PASS',migrationCount:results.length,checksum:results[0].checksum,expiredEvidence:results[0].expiredEvidence,errors:[]};
 } catch(error) {
  report={...report,success:false,result:'FAIL',errors:[String(error)]};
 } finally {fs.rmSync(fixture,{recursive:true,force:true});report.fixtureRemoved=true;}
 fs.writeFileSync(path.join(dir,'framework-validation.json'),JSON.stringify(report,null,2)+'\n');
 const crosswalk=JSON.parse(fs.readFileSync(path.join(dir,'evidence-crosswalk-validation.json'),'utf8'));crosswalk.frameworkResult=report.result;crosswalk.frameworkReport='framework-validation.json';fs.writeFileSync(path.join(dir,'evidence-crosswalk-validation.json'),JSON.stringify(crosswalk,null,2)+'\n');
 const validation=JSON.parse(fs.readFileSync(path.join(dir,'validation.json'),'utf8'));validation.actualEvidenceFramework={result:report.result,validator:report.validator,input:report.input,programmeCount:report.programmeCount,expiredEvidence:report.expiredEvidence?.length,publicationReady:false};fs.writeFileSync(path.join(dir,'validation.json'),JSON.stringify(validation,null,2)+'\n');
 console.log(slug,report.result,JSON.stringify(report.errors));
}}
main().catch(error=>{console.error(error);process.exitCode=1;});
