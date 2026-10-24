"""Build held programme inventory from captured official ERP pages. No database access."""
from pathlib import Path
import re,csv,html
root=Path(__file__).resolve().parents[2];slug='vels-institute-of-science-technology-and-advanced-studies'
sources=root/'research/india-source-bundles/vistas-20261024'
pages=[('Pallavaram','pallavaram-erp-2026-27.html','applicantRegistration.jsp'),('Adyar','Adyar.html','applicantRegistrationVelsAdyar.jsp'),('Thiruvanmiyur','Thiruvanmiyur.html','applicantRegistrationVelsTvmr.jsp'),('Periyapalayam','Periyapalayam.html','applicantRegistrationVelsPypm.jsp')]
def canon(t):
 l=t.lower()
 if l.startswith('b.com'):return 'bcom'
 if l.startswith('m.b.a'):
  return 'mba-business-analytics' if 'business analytics' in l else 'mba-operations-supply-chain-management' if 'logistic' in l else 'mba'
 if l.startswith('b.b.a'):return 'bba'
 if l.startswith('b.c.a'):return 'bca'
 if l.startswith('m.c.a'):return 'mca'
 if l.startswith('ll.m'):return 'llm'
 if 'll.b' in l:return 'llb'
 if l.startswith('b.tech') or l.startswith('b.e.'):
  if 'computer science' in l or 'cse' in l:return 'be-btech-computer-science-engineering'
  if 'bio-medical' in l:return 'be-btech-biomedical-engineering'
  if 'biotechnology' in l:return 'be-btech-biotechnology'
  if 'electrical' in l:return 'be-btech-electrical-electronics-engineering'
  if 'electronics & communication' in l:return 'be-btech-electronics-communication-engineering'
  if 'mechanical' in l:return 'be-btech-mechanical-engineering'
  if 'it (' in l:return 'be-btech-information-technology'
 if l.startswith('m.tech'):
  if 'computer science' in l or 'artificial intelligence' in l or 'data science' in l:return 'me-mtech-computer-science-engineering'
  if 'structural' in l or 'construction' in l:return 'me-mtech-civil-engineering'
  if 'computer integrated' in l:return 'me-mtech-mechanical-engineering'
 if l.startswith('b.sc'):
  if 'computer science' in l:return 'bsc-computer-science'
  if 'biotechnology' in l:return 'bsc-biotechnology'
  if 'counselling psychology' in l:return 'bachelor-psychology'
  if 'nursing' in l:return 'bsc-nursing'
  if 'visual communication' in l:return 'bachelor-media-communication'
  if 'hotel' in l:return 'bachelor-hospitality-management'
  if 'optometry' in l:return 'bachelor-optometry'
 if l.startswith('m.sc'):
  if 'computer science' in l or 'information technology' in l:return 'msc-computer-science'
  if 'biotechnology' in l:return 'msc-biotechnology'
  if 'biochemistry' in l or 'microbiology' in l:return 'msc-biological-sciences'
  if 'chemistry' in l:return 'msc-chemistry'
  if 'data science' in l:return 'msc-data-science'
  if 'psychology' in l:return 'master-psychology'
  if 'visual communication' in l:return 'master-media-communication'
  if 'hotel' in l:return 'master-hospitality-management'
  if 'optometry' in l:return 'master-optometry'
 if l.startswith('m.a.'):
  if 'english' in l:return 'ma-english-literature'
  if 'economics' in l:return 'master-economics'
 if l.startswith('b.a'):
  if 'english' in l:return 'ba-english-literature'
  if 'economics' in l:return 'bachelor-economics'
 if l.startswith('b.pharm'):return 'bpharm'
 if l.startswith('m.pharm'):return 'mpharm'
 if l.startswith('b.p.t'):return 'bpt'
 return 'GAP:'+re.sub(r'[^a-z0-9]+','-',l).strip('-')
rows=[];seen=set();excluded=[]
for campus,filename,jsp in pages:
 text=(sources/filename).read_text()
 for m in re.finditer(r'<span class="course-title">(.*?)</span>.*?<div class="course-content">(.*?)</ul>',text,re.S):
  school=html.unescape(re.sub('<[^>]+>','',m.group(1))).strip()
  for title in re.findall(r'<li>(.*?)</li>',m.group(2),re.S):
   title=' '.join(html.unescape(re.sub('<[^>]+>','',title)).split())
   if title.startswith('Ph.D.') or school=='School of Research and Development':excluded.append((campus,title));continue
   key=(campus,title)
   if key in seen:continue
   seen.add(key)
   level='diploma' if any(x in title.lower() for x in ['diploma','hnd','gme']) else 'certificate' if title.startswith('Certificate') else 'master' if title.startswith(('M.','LL.M','Pharm.D (PB)')) else 'doctorate' if title.startswith('Pharm.D') else 'bachelor'
   rows.append(dict(university_slug=slug,programme_official_title=title,level=level,discipline=school,duration='Not verified',campus=campus,delivery_mode='on-campus regular; programme mode to verify',intl_status='unknown',intl_evidence_url='',official_source_url='https://erp.vistas.ac.in/velsonline/applicationist/loginManager/'+jsp,other_sources='https://vistas.ac.in/international-admissions/',already_on_site='no',existing_offering_slug='',canonical_course_match=canon(title),notes='HELD: 2026-27 programme title confirmed by official ERP campus list; programme duration, international admission route, complete eligibility, intake and fees need source verification. Main official admissions/fee pages return access denied; no facts inferred from agent marketing sites.'))
with open(root/f'research/india-programme-inventory/{slug}.csv','w') as f:
 w=csv.DictWriter(f,fieldnames=rows[0]);w.writeheader();w.writerows(rows)
from collections import Counter
print('Inventory rows',len(rows),dict(Counter(r['campus'] for r in rows)),'PhD excluded',len(excluded))
