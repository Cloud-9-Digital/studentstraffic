import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeProgramMedium } from '../lib/program-medium';

test('keeps admission test evidence outside the medium label',()=>{
 const raw="English (confirmed on the official program page; IELTS 6.0+/TOEFL iBT 60+)";
 assert.deepEqual(normalizeProgramMedium(raw),{medium:'English',instructionLanguages:['english'],mediumDetails:raw});
});
test('does not mistake translated application guidance for teaching language',()=>{
 for(const raw of ['English application guidance; research language must be confirmed','English instructions; course language varies','Not stated on the cited official admissions page']) assert.equal(normalizeProgramMedium(raw).medium,'Not confirmed');
});
test('does not mistake language-test requirements for teaching languages',()=>{
 assert.equal(normalizeProgramMedium('Italian (English B2 requirement)').medium,'Italian');
 assert.equal(normalizeProgramMedium('German; English is required only at entry').medium,'German');
});
test('retains explicit multilingual and phased teaching',()=>{
 assert.equal(normalizeProgramMedium('English (years 1-3), transitioning to Russian-medium clinical instruction from year 4').medium,'English / Russian');
 assert.equal(normalizeProgramMedium('Catalan and Spanish; confirm current programme profile').medium,'Catalan / Spanish');
});
test('structured languages take precedence over narrative mentions of foreign-language electives',()=>{
 assert.equal(normalizeProgramMedium('English. French and German electives are available',['english']).medium,'English');
});
test('canonical labels are stable across subsequent reads',()=>{
 for(const source of ['English','English / French','Catalan / English / Spanish','Not confirmed','Kyrgyz / Russian']) assert.equal(normalizeProgramMedium(source).medium,source);
});
