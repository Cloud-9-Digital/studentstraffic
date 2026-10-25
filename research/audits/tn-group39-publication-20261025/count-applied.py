import json
from pathlib import Path
r=json.load(open('docs/run-reports/tn-grouped39-applied-receipts.json'));ids=set(r['allAppliedIds']);first={};latest={};baseline={}
for p in sorted(Path('content-migrations').glob('*/payload.json')):
 if p.parent.name not in ids:continue
 n=int(p.parent.name[:4])
 for u in json.loads(p.read_text()).get('universities',[]):
  if u['countrySlug']!='india':continue
  s=u['slug'];first.setdefault(s,n);latest[s]={x['slug']for x in u['programmes']}
  if n<170:baseline[s]=latest[s]
new=[s for s,n in first.items()if n>=170]
x={'appliedReceiptCount':len(ids),'newProfiles':len(new),'newProgrammes':sum(len(latest[s])for s in new)+sum(len(latest[s]-v)for s,v in baseline.items()),'method':'Unique offering slugs from explicit applied migration receipts; pre0170 baseline excluded.'}
Path('docs/run-reports/tn-grouped39-applied-counts.json').write_text(json.dumps(x,indent=2)+'\n');print(json.dumps(x,indent=2))
