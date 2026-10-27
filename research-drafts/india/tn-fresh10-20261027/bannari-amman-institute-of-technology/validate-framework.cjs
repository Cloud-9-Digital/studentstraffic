/* Actual repository reader against disposable, isolated research fixtures. No reservations, DB or network. */
const fs=require('fs'),path=require('path');
const {readContentMigrations}=require(path.join(process.cwd(),'scripts/lib/content-migrations.ts'));
const dir=__dirname, id='9999-research-fixture-only', temp=path.join(dir,'.framework-fixture');
const payload=JSON.parse(fs.readFileSync(path.join(dir,'catalogue-subset-candidate.json'),'utf8'));
const now=new Date('2026-10-27T00:00:00Z');
async function check(p){
 fs.mkdirSync(path.join(temp,id),{recursive:true});
 fs.writeFileSync(path.join(temp,id,'manifest.json'),JSON.stringify({version:1,id,description:'Disposable research-only fixture; no migration sequence reservation or publication authority.',createdAt:'2026-10-27',payload:'payload.json'}));
 fs.writeFileSync(path.join(temp,id,'payload.json'),JSON.stringify(p));
 try {const result=await readContentMigrations(temp,{onlyId:id,now});return {passed:true,readMigrations:result.length,expiredEvidenceCount:result.reduce((n,x)=>n+x.expiredEvidence.length,0)};}catch(e){return {passed:false,error:String(e.message||e)};}
}
(async()=>{try{
 const full=await check(payload), programmes=[];
 for(const u of payload.universities)for(const p of u.programmes){const only={...payload,courses:payload.courses.filter(c=>c.slug===p.canonicalCourseSlug),universities:[{...u,programmes:[p]}],evidence:payload.evidence.filter(e=>e.entity!=='programme'||(e.universitySlug===u.slug&&e.programmeSlug===p.slug))};programmes.push({slug:p.slug,...await check(only)});}
 const report={checkedAt:now.toISOString(),validator:'scripts/lib/content-migrations.ts::readContentMigrations',command:'node --import tsx '+path.relative(process.cwd(),__filename),isolatedResearchFixture:true,actualContentMigrationsDirectoryTouched:false,fullSpecimen:full,totalProgrammeFragments:programmes.length,programmePassCount:programmes.filter(p=>p.passed).length,programmeFailCount:programmes.filter(p=>!p.passed).length,programmes,publishReady:false,warning:'Reader success checks source-link structure, not editorial truth or audience/media readiness. Existing row holds remain binding.'};
 const file=process.argv.includes('--baseline')?'framework-validation.before.json':'framework-validation.json';fs.writeFileSync(path.join(dir,file),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({slug:path.basename(dir),report:file,total:report.totalProgrammeFragments,passed:report.programmePassCount,failed:report.programmeFailCount,firstError:programmes.find(x=>!x.passed)?.error},null,2));if(!full.passed||report.programmeFailCount)process.exitCode=1;
 }finally{fs.rmSync(temp,{recursive:true,force:true});}})().catch(e=>{console.error(e);process.exitCode=1});
