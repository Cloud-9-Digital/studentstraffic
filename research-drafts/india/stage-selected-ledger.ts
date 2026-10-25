import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {parseUniversityPublishingLedger,serializeUniversityPublishingLedger} from '../../scripts/lib/university-publishing-ledger';
const path='research/university-publishing-ledger.csv',slugs=new Set(process.argv.slice(2));
const head=parseUniversityPublishingLedger(execFileSync('git',['show',`HEAD:${path}`],{encoding:'utf8'})).rows;
const current=parseUniversityPublishingLedger(readFileSync(path,'utf8')).rows;
for(const row of current){if(!slugs.has(row.university_slug))continue;const i=head.findIndex(x=>x.university_slug===row.university_slug);if(i<0)head.push(row);else head[i]=row;slugs.delete(row.university_slug);}
if(slugs.size)throw Error('Missing selected rows '+[...slugs]);
const hash=execFileSync('git',['hash-object','-w','--stdin'],{input:serializeUniversityPublishingLedger(head),encoding:'utf8'}).trim();
execFileSync('git',['update-index','--cacheinfo',`100644,${hash},${path}`]);
console.log('Staged only selected ledger rows');
