from pathlib import Path
import json,csv,hashlib,collections
B=Path(__file__).parent;receipt=Path('/private/tmp/tn-applied-ids.json');raw=json.loads(receipt.read_text());ids=set(raw);assert not any(x.startswith('0310-')for x in ids)
files={p.parent.name:p for p in Path('content-migrations').glob('*/payload.json')};missing=sorted(ids-set(files));assert not missing,missing
current={};baseline={};first={};history=collections.defaultdict(list);duplicates=[]
for mid in sorted(ids):
 for u in json.loads(files[mid].read_text()).get('universities',[]):
  if u.get('countrySlug')!='india':continue
  s=u['slug'];ps=[x['slug']for x in u['programmes']];dup=[x for x,n in collections.Counter(ps).items()if n>1]
  if dup:duplicates.append({'migration':mid,'profile':s,'slugs':dup})
  first.setdefault(s,mid);current[s]={'migration':mid,'profile':u,'programmeSlugs':set(ps)};history[s].append(mid)
  if int(mid[:4])<170:baseline[s]=set(ps)
new={s for s in current if s not in baseline};additions={s:current[s]['programmeSlugs']-baseline.get(s,set())for s in current};removed={s:sorted(v-current[s]['programmeSlugs'])for s,v in baseline.items()if v-current[s]['programmeSlugs']}
ledger={r['university_slug']:r for r in csv.DictReader(open('research/university-publishing-ledger.csv'))if r['country_slug']=='india'}
unexplained=[];expected=[];matches=0
for s,x in current.items():
 r=ledger.get(s)
 if not r:unexplained.append({'slug':s,'reason':'Applied India profile has no India ledger row','applied':x['migration']});continue
 count=len(x['programmeSlugs']);issues=[]
 if r['migration_id']!=x['migration']:issues.append('pointer')
 if r['payload_file']!='content-migrations/'+x['migration']+'/payload.json':issues.append('payload_path')
 if int(r['programme_count']or 0)!=count:issues.append('count')
 if issues:
  item={'slug':s,'issues':issues,'applied':x['migration'],'appliedCount':count,'ledgerPointer':r['migration_id'],'ledgerCount':r['programme_count'],'ledgerStatus':r['status']}
  mid=r['migration_id'];pendingfile=files.get(mid)
  if mid and mid not in ids and pendingfile and r['status']in ['validated','researching','claimed','published']:
   pending=[u for u in json.loads(pendingfile.read_text()).get('universities',[])if u['slug']==s]
   if pending and len({p['slug']for p in pending[0]['programmes']})==int(r['programme_count']or 0):item['classification']='Expected source-backed pending forward, not applied';expected.append(item);continue
  unexplained.append(item)
 else:matches+=1
# Extra ledger published/validated India entries not in receipts are separately classified, never silently included.
extra=[]
for s,r in ledger.items():
 if s not in current and r['status']in ['published','validated']:
  extra.append({'slug':s,'status':r['status'],'pointer':r['migration_id'],'classification':'pending executable'if r['migration_id']not in ids and r['migration_id']in files else'not reconstructed from explicit receipts'})
collisions=collections.defaultdict(list)
for s,x in current.items():
 for p in x['programmeSlugs']:collisions[p].append(s)
collisions={k:v for k,v in collisions.items()if len(v)>1}
snapshot={s:{'latestAppliedMigration':x['migration'],'profileName':x['profile']['name'],'programmeCount':len(x['programmeSlugs']),'programmeSlugs':sorted(x['programmeSlugs']),'pre0170Baseline':sorted(baseline.get(s,set())),'newProgrammeSlugs':sorted(additions[s]),'firstAppliedMigration':first[s]}for s,x in sorted(current.items())}
prior=json.load(open('docs/run-reports/tn-grouped33-applied-counts.json'));report={'checkedAt':'2026-10-25','receiptSource':str(receipt),'receiptSha256':hashlib.sha256(receipt.read_bytes()).hexdigest(),'explicitReceiptCount':len(ids),'duplicateReceiptIds':len(raw)-len(ids),'excludedUnapplied0310':True,'method':'Latest complete India profile/programme snapshot per unique university slug, traversing only explicit applied receipt IDs. Programme sets use unique slugs within profile; pre0170baseline is last RECEIPTED snapshot before0170. No numeric maximum/all-files inference, no DB.','baselineIndiaProfiles':len(baseline),'baselineIndiaProgrammePairs':sum(map(len,baseline.values())),'currentIndiaProfiles':len(current),'currentIndiaProgrammePairs':sum(len(x['programmeSlugs'])for x in current.values()),'currentGloballyUniqueProgrammeSlugs':len(set(collisions)|{p for x in current.values()for p in x['programmeSlugs']}),'newProfilesVsPre0170':len(new),'newProgrammeAdditionsVsPre0170':sum(map(len,additions.values())),'newProfilesProgrammePairs':sum(len(current[s]['programmeSlugs'])for s in new),'existingBaselineProfileProgrammeAdditions':sum(len(additions[s])for s in baseline),'baselineProgrammeRemovals':removed,'historicalReceiptDuplicateProgrammeSlugs':duplicates,'currentCrossProfileProgrammeSlugCollisions':collisions,'ledgerExactAppliedCheckpointMatches':matches,'expectedPendingForwards':expected,'unexplainedAppliedLedgerMismatches':unexplained,'ledgerOnlyPublishedOrValidatedProfiles':extra,'group33SavedCountComparison':{'newProfilesMatch':prior['newProfiles']==len(new),'newProgrammesMatch':prior['newProgrammes']==sum(map(len,additions.values())),'receiptCountMatch':prior['appliedReceiptCount']==len(ids)}}
(B/'latest-applied-india-snapshot.json').write_text(json.dumps(snapshot,indent=2)+'\n');(B/'audit.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({k:v for k,v in report.items()if k not in ['baselineProgrammeRemovals','historicalReceiptDuplicateProgrammeSlugs']},indent=2));print('REMOVED',removed,'HISTDUPS',duplicates)
