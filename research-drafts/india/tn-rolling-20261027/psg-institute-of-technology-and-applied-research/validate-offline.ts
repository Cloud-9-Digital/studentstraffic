import fs from "node:fs/promises";
import path from "node:path";
import {createHash} from "node:crypto";
import {catalogPayloadSchema} from "../../../../scripts/lib/catalog-payload-schema";
import {readContentMigrations} from "../../../../scripts/lib/content-migrations";
async function main() {
 const folder=path.dirname(process.argv[1]);
 for (const name of (await fs.readdir(folder)).filter(n=>n.startsWith("payload.")&&n.endsWith(".json")&&!n.includes(".validation."))) {
  const raw=await fs.readFile(path.join(folder,name),"utf8"), p=JSON.parse(raw), result:any={checkedAt:"2026-10-27",file:name,payloadSha256:createHash("sha256").update(raw).digest("hex"),schemaPass:false,frameworkPass:false,scope:"Offline actual schema/framework only. Not a migration reservation, queue validated state or publication approval."};
  const parsed=catalogPayloadSchema.safeParse(p); result.schemaPass=parsed.success; result.issues=parsed.success?[]:parsed.error.issues;
  if(parsed.success){
   const tmp=await fs.mkdtemp("/tmp/tn-f-review-"), id="9999-validation-only", dir=path.join(tmp,id);await fs.mkdir(dir);
   await fs.writeFile(path.join(dir,"manifest.json"),JSON.stringify({version:1,id,description:"Disposable offline validation fixture, never a reserved content migration.",createdAt:"2026-10-27",payload:"payload.json"}));await fs.writeFile(path.join(dir,"payload.json"),raw);
   try {const out=await readContentMigrations(tmp,{now:new Date("2026-10-27T00:00:00Z")});result.frameworkPass=true;result.expiredEvidence=out[0].expiredEvidence;result.programmes=p.universities.flatMap((u:any)=>u.programmes).length;result.evidence=p.evidence.length;}catch(e){result.frameworkError=String(e)}finally{await fs.rm(tmp,{recursive:true,force:true})}
  }
  await fs.writeFile(path.join(folder,name.replace(".json",".validation.json")),JSON.stringify(result,null,2)+"\n");console.log(JSON.stringify(result)); if(!result.schemaPass || !result.frameworkPass) process.exitCode=1;
 }
}main();
