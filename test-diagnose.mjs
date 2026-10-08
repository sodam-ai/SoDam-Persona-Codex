import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,mkdirSync,rmSync,cpSync,readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {selectInstalled,compareTrees,validHook,diagnose,generatedCommandSkill} from './diagnose-core.mjs';
const row={pluginId:'sodam-persona@sodam-persona',name:'sodam-persona',marketplaceName:'sodam-persona',version:'1.11.2',installed:true,enabled:true};
test('catalog: exact identity, disabled, missing, duplicates and malformed data',()=>{
 assert.equal(selectInstalled({installed:[{...row,enabled:false}]}).enabled,false);
 assert.equal(selectInstalled({installed:[]}),null);
 assert.equal(selectInstalled({installed:[row,row]}),null);
 assert.equal(selectInstalled({installed:[{...row,pluginId:'other@other'}]}),null);
 assert.throws(()=>selectInstalled({}));
 assert.throws(()=>selectInstalled({installed:[{...row,version:'../../other'}]}));
});
test('matching registered cache runs installed hooks; changed/disabled/missing caches fail',()=>{
 const root=dirname(fileURLToPath(import.meta.url)),home=mkdtempSync(join(tmpdir(),'persona-home-'));
 const version=JSON.parse(readFileSync(join(root,'plugins','sodam-persona','.codex-plugin','plugin.json'),'utf8')).version;
 const cache=join(home,'plugins','cache','sodam-persona','sodam-persona',version);
 const entry={...row,version};
 const run=()=>({status:0}),catalog=r=>()=>({status:0,stdout:JSON.stringify({installed:[r]})});
 try{
  assert.equal(diagnose(root,home,run,catalog(entry)).cache,'missing');
  cpSync(join(root,'plugins','sodam-persona'),cache,{recursive:true});
  const good=diagnose(root,home,run,catalog(entry));
  assert.equal(good.ok,true);assert.equal(good.installedHooks,'pass');
  assert.equal(good.automaticHostExecution,'unverified');
  const off=diagnose(root,home,run,catalog({...entry,enabled:false}));assert.equal(off.ok,false);assert.equal(off.installedHooks,'not-run');
  writeFileSync(join(cache,'hooks','persona_marker.txt'),'changed');
  const changed=diagnose(root,home,run,catalog(entry));assert.equal(changed.ok,false);assert.equal(changed.content.changed,1);assert.equal(changed.installedHooks,'not-run');
 }finally{rmSync(home,{recursive:true,force:true});}
});
test('same version cannot hide missing, altered or extra installed files',()=>{
 const dir=mkdtempSync(join(tmpdir(),'persona-diagnose-'));
 try{
  const a=join(dir,'a'),b=join(dir,'b');mkdirSync(a);mkdirSync(b);
  writeFileSync(join(a,'one.md'),'original');writeFileSync(join(b,'one.md'),'original');
  assert.deepEqual(compareTrees(a,b),{files:1,missing:0,changed:0,extra:0});
  writeFileSync(join(b,'one.md'),'changed');writeFileSync(join(b,'extra.md'),'extra');writeFileSync(join(a,'missing.md'),'missing');
  assert.deepEqual(compareTrees(a,b),{files:2,missing:1,changed:1,extra:1});
 }finally{rmSync(dir,{recursive:true,force:true});}
});
test('Codex migrated command skills require byte-exact source-derived content',()=>{
 const source=join(dirname(fileURLToPath(import.meta.url)),'plugins','sodam-persona');
 const dir=mkdtempSync(join(tmpdir(),'persona-migrated-'));
 try{
  cpSync(source,dir,{recursive:true});
  for(const name of ['create','edit']){
   const folder=join(dir,'.codex-plugin','migrated-command-skills','source-command-'+name);
   mkdirSync(folder,{recursive:true});writeFileSync(join(folder,'SKILL.md'),generatedCommandSkill(source,name));
  }
  let result=compareTrees(source,dir);assert.equal(result.extra,0);assert.equal(result.generated,2);
  writeFileSync(join(dir,'.codex-plugin','migrated-command-skills','source-command-create','SKILL.md'),'untrusted instructions');
  result=compareTrees(source,dir);assert.equal(result.extra,1);assert.equal(result.generated,1);
  writeFileSync(join(dir,'.codex-plugin','migrated-command-skills','unexpected.md'),'unknown');
  assert.equal(compareTrees(source,dir).extra,2);
  assert.equal(generatedCommandSkill(source,'../../other'),null);
 }finally{rmSync(dir,{recursive:true,force:true});}
});
test('unsupported source command format cannot authorize extra cached skills',()=>{
 const dir=mkdtempSync(join(tmpdir(),'persona-command-'));
 try{
  assert.equal(generatedCommandSkill(dir,'create'),null);
  mkdirSync(join(dir,'commands'));writeFileSync(join(dir,'commands','create.md'),'unsupported');
  assert.equal(generatedCommandSkill(dir,'create'),null);
 }finally{rmSync(dir,{recursive:true,force:true});}
});
test('valid JSON alone is not proof of correct hook output',()=>{
 assert.equal(validHook({},'SessionStart'),false);
 const data={continue:true,hookSpecificOutput:{hookEventName:'SessionStart',additionalContext:'context'}};
 assert.equal(validHook(data,'SessionStart'),true);
 assert.equal(validHook(data,'UserPromptSubmit'),false);
 assert.equal(validHook(data,'SessionStart',12000,12001),false);
 data.hookSpecificOutput.additionalContext=' ';assert.equal(validHook(data,'SessionStart'),false);
});
test('CLI failures and invalid JSON fail closed without printing stderr',()=>{
 for(const cli of [{status:1,stderr:'DO-NOT-PRINT'},{status:0,stdout:'bad-json'}]) {
  const result=diagnose(dirname(fileURLToPath(import.meta.url)),tmpdir(),()=>({status:0}),()=>cli);
  assert.equal(result.ok,false);assert.equal(result.installedHooks,'not-run');
  assert.ok(!JSON.stringify(result).includes('DO-NOT-PRINT'));
 }
});
