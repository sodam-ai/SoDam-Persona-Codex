import test from 'node:test';
import assert from 'node:assert/strict';
import {cases,score,prompt,scoreFormat,formatCases} from './evaluate.mjs';
test('all 270 fixtures have unique IDs and candidate prompts hide expected values',()=>{
 const data=cases();assert.equal(data.length,270);assert.equal(new Set(data.map(x=>x.case_id)).size,270);
 const p=prompt(data[0]);assert.ok(p.includes(data[0].request));assert.ok(!p.includes('required_role'));assert.ok(!p.includes(data[0].case_id));
});
test('natural indicator and explicit omission have opposite acceptance criteria',()=>{
 assert.equal(scoreFormat(formatCases[0],'[페르소나: L2 · CAD·BIM 관점]\n설명').format,'pass');
 assert.equal(scoreFormat(formatCases[0],'설명').format,'fail');
 assert.equal(scoreFormat(formatCases[1],'설명').format,'pass');
 assert.equal(scoreFormat(formatCases[1],'[페르소나: L1 · 검증 관점]\n설명').format,'fail');
 assert.equal(scoreFormat(formatCases[1],'설명\n[페르소나: L1 · 검증 관점]').format,'fail');
 assert.equal(scoreFormat(formatCases[1],' ').format,'invalid');
 assert.equal(scoreFormat(formatCases[0],null).format,'invalid');
});
test('positive, forbidden, Korean limits and invalid answers are checked honestly',()=>{
 const a=selected_roles=>({selected_roles,reason:'의도에 근거',answer:'실제 답변'});
 assert.equal(score({required_role:42},a([42])).selection,'pass');
 assert.equal(score({required_role:42},a([21])).selection,'fail');
 assert.equal(score({forbidden_role:42},a([42])).selection,'fail');
 assert.equal(score({forbidden_roles:[42],max_selected_roles:2},a([1,2,3])).selection,'fail');
 assert.equal(score({},a([1,1])).selection,'invalid');
 assert.equal(score({},a([46])).selection,'invalid');
 assert.equal(score({},{}).selection,'invalid');
 assert.equal(score({},a([])).quality,'unverified');
 assert.equal(score({},a([])).manualReviewRequired,true);
});
