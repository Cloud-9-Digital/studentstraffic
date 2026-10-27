from pathlib import Path
import csv,json,re,hashlib
p=Path(__file__).resolve().parent
root=Path(__file__).resolve().parents[4]
tax=(root/'lib/data/program-taxonomy.ts').read_text()
slugs=set(re.findall(r'(?:"slug"|slug)\s*:\s*"([^"]+)"',tax))
rows=list(csv.DictReader((p/'programme-inventory.csv').open()))
content=json.loads((p/'content-draft.json').read_text())
evidence=json.loads((p/'evidence.json').read_text())
errors=[]
if not rows:errors.append('Empty inventory')
if len({r['programme_official_title'] for r in rows})!=len(rows):errors.append('Duplicate exact inventory titles')
for r in rows:
 if r['university_slug']!=p.name:errors.append('Cross-institution row')
 if r['canonical_course_match'] not in slugs and not r['canonical_course_match'].startswith('GAP:'):errors.append('Unknown canonical: '+r['canonical_course_match'])
 if r['intl_status'] not in ['unknown','not_open','open_to_international']:errors.append('Invalid international state')
 if not r['official_source_url'].startswith('https://'):errors.append('Missing source URL')
 if not r['notes']:errors.append('Missing row disposition')
for e in evidence:
 if e['sourceGrade']=='C' and e['status']=='verified':errors.append('Grade C promoted to verified')
 if e['universitySlug']!=p.name:errors.append('Cross-institution evidence')
 if not re.match(r'^\d{4}-\d{2}-\d{2}$',e['checkedAt']):errors.append('Missing evidence date')
if content['status']!='held_research_draft_not_publishable':errors.append('Held status lost')
if not content['blockingGaps']:errors.append('Evidence hold list missing')
if any(r['level']=='doctorate' and r['notes'].startswith('research_excluded;') for r in rows):errors.append('Doctorate blanket exclusion retained')
if any(d['currentAdmittingAwardVerified'] or not d['missing'] for d in content.get('doctoralResearchAreaDrafts',[])):errors.append('Doctoral evidence hold lost')
if content.get('deliveryStatus',{}).get('researchDeliveryBlockedByCredentials') is not False:errors.append('Research-delivery boundary missing')
if json.loads((p/'dedupe.json').read_text())['claimStatus']!='integrator_local_claim_held':errors.append('Local integrator claim status inaccurate')
result={'validationKind':'offline_research_inventory_taxonomy_evidence_checks','checkedAt':'2026-10-27','passed':not errors,'errors':errors,'inventoryRows':len(rows),'programmeDraftFragments':len(content['programmeDrafts']),'heldGapRows':sum(r['canonical_course_match'].startswith('GAP:') for r in rows),'publiclyPublishable':False,'catalogPayloadSchemaValidation':'not_applicable: content-draft is deliberately incomplete research shape, not a catalog payload','contentMigrationValidation':'production_scoped_not_run: no reserved numbered migration; separate isolated actual-reader result below','ledgerStatus':'integrator_local_claim_held','researchDeliveryBlockedByCredentials':False,'doctoralResearchAreaDrafts':len(content.get('doctoralResearchAreaDrafts',[])),'doctoralInventoryDiscoveryPlaceholders':len(content.get('researchInventoryDiscoveryGaps',[])),'rowStates':dict(__import__('collections').Counter(r['notes'].split(';')[0] for r in rows)),'files':{f.name:hashlib.sha256(f.read_bytes()).hexdigest() for f in p.glob('*') if f.is_file() and f.name!='validation.json' and f.suffix in ['.json','.csv','.md']}}
if (p/'catalogue-reader-validation.json').exists():
 report=json.loads((p/'catalogue-reader-validation.json').read_text())
 payload=p/report['payloadFile']
 actual_hash=hashlib.sha256(payload.read_bytes()).hexdigest()
 if actual_hash!=report['payloadSha256']:errors.append('Isolated-reader payload hash is stale')
 result['isolatedSubsetReader']={k:report[k] for k in ['success','programmeCount','courseCount','evidenceCount','expiredEvidence','payloadSha256','publicationReady','migrationReserved','temporaryFixtureRemoved']}
 result['catalogPayloadSchemaValidation']='PASS for separate ten-UG catalogue-subset-candidate.json; full research draft remains intentionally incomplete'
 result['passed']=not errors
(p/'validation.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps({k:v for k,v in result.items() if k!='files'},indent=2))
raise SystemExit(bool(errors))
