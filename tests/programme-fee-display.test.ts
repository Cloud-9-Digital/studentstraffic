import assert from 'node:assert/strict';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {ProgramsDirectory, type ProgramDirectoryRow} from '../components/site/university/programs-directory';
import {programFees, UniversityProgramsSection} from '../components/site/university/programs-section';
import {getProgramSectionSummary as getSectionSummary} from '../lib/program-section-summary';
import type {FinderProgram} from '../lib/data/types';

const offering = {
 annualTuitionUsd:0,feeStatus:'on_request',reportedFeeQuote:{currency:'INR',minAmount:12820,status:'confirmed',period:'semester',componentBasis:'First semester combined admission charges; tuition not isolated.',category:'Domestic HSC route',academicYear:'2026-27',sourceUrl:'https://example.edu/fees.pdf',sourceLabel:'Current university semester notice',verifiedAt:'2026-10-25'},
} as FinderProgram['offering'];
const program={offering,country:{slug:'india'}} as FinderProgram;
const row=(fees:ProgramDirectoryRow['fees']):ProgramDirectoryRow=>({slug:'example-programme',href:'/example-programme',title:'BA English',level:'bachelors',levelLabel:'Bachelor',duration:'3 years',fees});
const render=(fees:ProgramDirectoryRow['fees'])=>renderToStaticMarkup(createElement(ProgramsDirectory,{rows:[row(fees)],levels:[{level:'bachelors',label:'Bachelor'}]}));

test('actual shared web directory renders semester and whole-course quote amounts without annual suffix',()=>{
 for(const period of ['semester','full_course'] as const){
  const fees=programFees({...program,offering:{...offering,reportedFeeQuote:{...offering.reportedFeeQuote!,period}}});
  assert.equal(fees[0].label,'Fees');assert.equal(fees[0].isAnnual,false);
  const html=render(fees);assert.match(html,/₹12,820/);assert.doesNotMatch(html,/\/\s*year|\/yr|a year/);
 }
});

test('actual shared web directory preserves explicit annual tuition including confirmed native zero',()=>{
 for(const amount of [0,20000]){
  const fees=programFees({...program,offering:{...offering,feeStatus:'confirmed',officialAnnualTuitionAmount:amount,officialFeeCurrency:'INR'}});
  assert.equal(fees[0].isAnnual,true);assert.match(render(fees),/\/ year/);
 }
});

test('shared web directory fails closed for old numeric rows without billing classification',()=>{
 assert.doesNotMatch(render([{label:'Fees',amount:'₹12,820'}]),/\/\s*year|\/yr/);
});

test('quote-only fees hero describes available fees without year-wise annual or USD claims',()=>{
 const summary=getSectionSummary('fees',{courseShortName:'BA English',universityName:'Example College',hasFee:true,feeIsAnnual:false});
 assert.match(summary,/Available programme fees/);assert.doesNotMatch(summary,/year-wise|annual|USD|total program cost/i);
 const annual=getSectionSummary('fees',{courseShortName:'BA English',universityName:'Example College',hasFee:true,feeIsAnnual:true});
 assert.match(annual,/annual tuition/);
});


test('actual university programmes section carries quote classification through compact and small-card paths',()=>{
 const make=(i:number)=>({...program,university:{name:'Example College'},course:{level:'bachelors'},offering:{...offering,slug:`example-${i}`,title:`BA English ${i}`,durationYears:3,medium:'English',intakeCodes:[],livingUsd:0}} as unknown as FinderProgram);
 for(const count of [1,9]){
  const html=renderToStaticMarkup(createElement(UniversityProgramsSection,{programs:Array.from({length:count},(_,i)=>make(i))}));
  assert.match(html,/₹12,820/);assert.match(html,/>Fees</);assert.doesNotMatch(html,/\/\s*year|\/yr|a year/);
 }
});
