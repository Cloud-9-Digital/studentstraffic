import {readFileSync,writeFileSync} from 'node:fs';
const ids=JSON.parse(readFileSync(process.argv[2],'utf8'));
const results=[];
for (const id of ids){
 const p=JSON.parse(readFileSync(`content-migrations/${id}/payload.json`,'utf8'));
 for(const u of p.universities){
  const r=await fetch(`https://www.studentstraffic.com/api/mobile/v1/universities/${u.slug}`,{signal:AbortSignal.timeout(45000)});
  const a=(await r.json()).university; const failures=[];
  if(a?.programCount!==u.programmes.length)failures.push('count');
  if(!a?.logoUrl||!a?.coverImageUrl)failures.push('media');
  const quotes=u.programmes.filter(x=>x.admissionsContent?.reportedFeeQuote); const n=new Intl.NumberFormat('en-IN');
  for(const x of quotes){const q=x.admissionsContent.reportedFeeQuote,found=a?.offerings?.find(o=>o.slug===x.slug);const label=q.maxAmount!==undefined&&q.maxAmount!==q.minAmount?`₹${n.format(q.minAmount)}–₹${n.format(q.maxAmount)}`:`₹${n.format(q.minAmount)}`;
   if(found?.feeLabel!==label||found?.feeIsAnnual!==false)failures.push({slug:x.slug,expected:label,actual:found?.feeLabel,annual:found?.feeIsAnnual});
  }
  const pages=[]; const sample=u.programmes.find(x=>x.admissionsContent?.reportedFeeQuote?.minAmount===0)??u.programmes[0];
  for(const path of [`/university/${u.slug}`,`/${sample.slug}`]){const rr=await fetch(`https://www.studentstraffic.com${path}`,{signal:AbortSignal.timeout(45000)});const text=await rr.text();const h1=/<h1[\s>]/.test(text)&&!/<h1[^>]*>[^<]*(?:Not Found|not found)/.test(text);const zeroCheck=path===`/${sample.slug}`&&sample.admissionsContent?.reportedFeeQuote?.minAmount===0?{amountRendered:text.includes('₹0'),noStructuredOffer:!text.includes('"@type":"Offer"')}:undefined;if(zeroCheck&&(!zeroCheck.amountRendered||!zeroCheck.noStructuredOffer))failures.push({path,zeroCheck});pages.push({path,status:rr.status,h1,zeroCheck});}
  const media=[];for(const url of [a?.logoUrl,a?.coverImageUrl].filter(Boolean)){const rr=await fetch(url,{method:'HEAD',signal:AbortSignal.timeout(20000)});media.push({url,status:rr.status,type:rr.headers.get('content-type')});}
  results.push({id,slug:u.slug,status:r.status,expectedCount:u.programmes.length,actualCount:a?.programCount,quotes:quotes.length,zeroQuotes:quotes.filter(x=>x.admissionsContent.reportedFeeQuote.minAmount===0).length,failures,pages,media,pass:r.ok&&!failures.length&&pages.every(x=>x.status===200&&x.h1)&&media.length===2&&media.every(x=>x.status===200&&x.type?.startsWith('image/'))});
 }
}
writeFileSync('docs/run-reports/tn-grouped39-public-checks.json',JSON.stringify(results,null,2)+'\n');
console.log(JSON.stringify(results.map(({media,...x})=>x),null,2));if(results.some(x=>!x.pass))process.exitCode=1;
