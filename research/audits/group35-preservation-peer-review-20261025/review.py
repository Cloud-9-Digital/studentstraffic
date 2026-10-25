from pathlib import Path
import json,hashlib
B=Path(__file__).parent;rows=[]
def dif(a,b,path=''):
 if isinstance(a,dict)and isinstance(b,dict):return[v for k in set(a)|set(b)for v in dif(a.get(k),b.get(k),path+'.'+k)]
 if isinstance(a,list)and isinstance(b,list):
  if len(a)!=len(b):return[path]
  return[v for i,(x,y)in enumerate(zip(a,b))for v in dif(x,y,path+f'[{i}]')]
 return[]if a==b else[path]
for pre,base in [('0337','0211'),('0338','0263'),('0339','0207')]:
 f=next(Path('content-migrations').glob(pre+'*/payload.json'));g=next(Path('content-migrations').glob(base+'*/payload.json'));a=json.loads(g.read_text());d=json.loads(f.read_text());u=a['universities'][0];v=d['universities'][0];p={x['slug']:x for x in u['programmes']};q={x['slug']:x for x in v['programmes']};changed={s:dif(p[s],q[s])for s in p if p[s]!=q[s]};fees=[]
 for s in p:
  assert s in q
  for k in ['fee','feeNotes','feeVerifiedAt','additionalFees']:assert p[s].get(k)==q[s].get(k),(pre,s,k)
  assert p[s]['admissionsContent'].get('reportedFeeQuote')==q[s]['admissionsContent'].get('reportedFeeQuote'),(pre,s,'quote')
  for k in ['officialTitle','durationYears','canonicalCourseSlug','audienceEligibility']:assert p[s].get(k)==q[s].get(k),(pre,s,k)
 if pre=='0338':
  assert set(changed)=={'tvu-b-sc-computer-science','tvu-b-sc-data-science'}
  for s in changed:
   assert set(p[s]['instructionLanguages'])==set(q[s]['instructionLanguages'])=={'english','tamil'}
   z=json.loads(json.dumps(q[s]));z['medium']=p[s]['medium'];z['instructionLanguages']=p[s]['instructionLanguages'];z['teachingPhases']=p[s]['teachingPhases'];assert z==p[s]
 else:assert not changed
 hosted={}
 for k in set(u)|set(v):
  if any(w in k.lower()for w in ['imageurl','logourl','coverurl']):assert u.get(k)==v.get(k);hosted[k]='unchanged'
 rows.append({'baseline':g.parent.name,'appliedForward':f.parent.name,'baselineSha256':hashlib.sha256(g.read_bytes()).hexdigest(),'forwardSha256':hashlib.sha256(f.read_bytes()).hexdigest(),'slug':v['slug'],'beforeCount':len(p),'afterCount':len(q),'removedSlugs':sorted(p.keys()-q.keys()),'addedSlugs':sorted(q.keys()-p.keys()),'originalProgrammeChangedPaths':changed,'oldFeeObjectsNotesDatesQuotesAdditionalFeesExact':True,'oldAwardFamilyDurationAudienceExact':True,'hostedURLKeysPreserved':True,'universityChangedFields':[k for k in set(u)|set(v)if k!='programmes'and u.get(k)!=v.get(k)],'nonemptySourceAttribution':bool(v['mediaAttribution'])})
(B/'assertions.json').write_text(json.dumps(rows,indent=2)+'\n');print(json.dumps(rows,indent=2))
