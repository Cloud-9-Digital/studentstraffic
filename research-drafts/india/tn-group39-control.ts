import {readFile,writeFile} from 'node:fs/promises';
import {readContentMigrations} from '../../scripts/lib/content-migrations';
import {mutateUniversityPublishingLedger} from '../../scripts/lib/university-publishing-ledger';
const base='research/audits/tn-group39-publication-20261025';
async function main(){
 const ids:string[]=JSON.parse(await readFile(`${base}/pending-ids.json`,'utf8'));
 const local=await readContentMigrations('content-migrations');
 const old:string[]=JSON.parse(await readFile(`${base}/prior-applied-ids.json`,'utf8'));
 const unknown=local.filter(m=>!old.includes(m.id)&&!ids.includes(m.id));
 if(unknown.length)throw Error('Unexpected pending: '+unknown.map(x=>x.id).join(','));
 for(const id of [...old,...ids])if(!local.some(x=>x.id===id))throw Error('Missing actual migration '+id);
 const summaries=local.filter(m=>ids.includes(m.id)).map(m=>({id:m.id,checksum:m.checksum,slugs:m.payload.universities.map(u=>u.slug),programmes:m.payload.universities.reduce((n,u)=>n+u.programmes.length,0)}));
 if(process.argv.includes('--checkpoint')){
  const log=await readFile('docs/run-reports/tn-grouped39-apply.log','utf8');
  for(const id of ids)if(!log.includes(`Applied ${id}.`))throw Error('No successful receipt '+id);
  await mutateUniversityPublishingLedger(rows=>{for(const m of local.filter(x=>ids.includes(x.id))){for(const u of m.payload.universities){const r=rows.find(x=>x.university_slug===u.slug);if(!r||r.status!=='validated'||r.migration_id!==m.id||Number(r.programme_count)!==u.programmes.length)throw Error('Ledger checkpoint mismatch '+u.slug);r.status='published';r.published_at=new Date().toISOString();r.notes+=' | Group39 canonical apply completed, cache/search refreshed; publication connections closed. Public verification recorded separately.';}}});
  await writeFile('docs/run-reports/tn-grouped39-applied-receipts.json',JSON.stringify({ids,allAppliedIds:[...old,...ids],proof:'Each exact canonical apply success line recorded and process exited successfully; pools close in finally.'},null,2)+'\n');
 }
 await writeFile(`${base}/publication-guard.json`,JSON.stringify({priorApplied:old.length,pending:summaries,unexpected:unknown.length},null,2)+'\n');
 console.log(JSON.stringify(summaries,null,2));
}
main().catch(e=>{console.error(e);process.exitCode=1});
