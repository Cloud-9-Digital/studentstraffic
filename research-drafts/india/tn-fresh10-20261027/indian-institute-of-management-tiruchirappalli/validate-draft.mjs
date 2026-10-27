import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// Run with: node --import tsx <this-file>. No DB or network access.
process.chdir(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..'));
import {createRequire} from 'node:module';
const require = createRequire(process.cwd()+'/package.json');
const {catalogPayloadSchema} = require(process.cwd()+'/scripts/lib/catalog-payload-schema.ts');
const {checkOfferingLanguageFields} = require(process.cwd()+'/scripts/lib/programme-medium.ts');
const {assertReportedFeeQuoteEvidence} = require(process.cwd()+'/scripts/lib/reported-fee-quote-evidence.ts');
const dir='research-drafts/india/tn-fresh10-20261027/indian-institute-of-management-tiruchirappalli';
const raw=JSON.parse(fs.readFileSync(dir+'/payload.draft.json','utf8'));
const parsed=catalogPayloadSchema.safeParse(raw);let checks=[];
checks.push({name:'canonical_catalogue_schema',pass:parsed.success,...(!parsed.success?{issues:parsed.error.issues}:{})});
if(parsed.success){
 const p=parsed.data;
 for(const u of p.universities){
  checks.push({name:'single_badge_grade_a_regulator_evidence',pass:p.evidence.some(e=>e.entity==='university'&&e.universitySlug===u.slug&&e.publicField==='recognition'&&e.status==='verified'&&e.sourceGrade==='A'&&u.recognitionLinks.some(l=>l.url===e.sourceUrl))});
  for(const x of u.programmes){
   const e=p.evidence.filter(e=>e.programmeSlug===x.slug);
   checks.push({name:x.slug+':language',...checkOfferingLanguageFields({...x,allowUnknown:true})});
   let fee=true,error='';try{assertReportedFeeQuoteEvidence(x.admissionsContent.reportedFeeQuote,e,x.slug)}catch(err){fee=false;error=String(err)}
   checks.push({name:x.slug+':reported_fee_grade_a_provenance',pass:fee,...(error?{error}:{})});
   for(const field of ['eligibility','admissions','fee'])checks.push({name:x.slug+':'+field+'_evidence',pass:e.some(v=>v.publicField===field&&v.status==='verified'&&v.sourceGrade==='A')});
   for(const field of ['medium','intake'])checks.push({name:x.slug+':'+field+'_explicit_omission',pass:e.some(v=>v.publicField===field&&v.status==='omit')});
  }
 }
}
const report={checkedAt:new Date().toISOString(),scope:'Offline draft schema and selected evidence checks only. No numbered content migration; no DB connection. This is not content:validate or publish readiness.',checks,machineChecksPassed:checks.every(c=>c.pass===true||c.ok===true),editorialAndPublicationStatus:'HELD',hardGates:['Complete the two MBAs domestic qualification/document crosswalk; overseas restrictions are route-specific','Mandatory rights-cleared media not approved or Cloudinary-hosted','Approved production credentials unavailable; Vercel metadata listing denied403','15 programme inventory rows held for explicit audience verification','No numbered committed executable migration or full pipeline validation'],priorRegressionTests:{passed:23,failed:0,scope:'Existing university-publishing-ledger and content-migrations test suites, not tests of this generated payload'}};
fs.writeFileSync(dir+'/validation-report.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));if(!report.machineChecksPassed)process.exitCode=1;
