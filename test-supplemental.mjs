import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';

const root=new URL('./plugins/sodam-persona/',import.meta.url);
const read=(name)=>readFileSync(new URL(name,root),'utf8');
test('90 Korean fixtures cover quotation and explicit exclusion for every role',()=>{
 const data=JSON.parse(read('reference/routing_cases_ko.json'));
 assert.equal(data.cases.length,90);
 assert.equal(new Set(data.cases.map(c=>c.case_id)).size,90);
 for(let role=1;role<=45;role++)for(const kind of ['quoted','excluded']){
  const found=data.cases.filter(c=>c.case_id===`KO-R${String(role).padStart(2,'0')}-${kind}`);
  assert.equal(found.length,1);
  assert.deepEqual(found[0].forbidden_roles,[role]);
  assert.match(found[0].request,/[가-힣]/);
  assert.equal(found[0].max_selected_roles,2);
 }
});
test('existing skill management and portable extensions and Codex discovery remain available',()=>{
 for(const slug of ['persona-create','persona-edit'])assert.ok(existsSync(new URL(`skills/${slug}/SKILL.md`,root)));
 const portable=JSON.parse(read('compat/plugin.portable.json'));
 const codex=JSON.parse(read('.codex-plugin/plugin.json'));
 assert.equal(portable.version,codex.version);
 assert.ok(portable.extensions);
 assert.equal(existsSync(new URL('plugin.json',root)),false);
});
