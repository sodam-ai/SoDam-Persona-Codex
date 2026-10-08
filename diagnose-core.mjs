import {readFileSync,readdirSync,lstatSync,existsSync} from 'node:fs';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {runCodex} from './codex-launch.mjs';
export function selectInstalled(data) {
 if(!Array.isArray(data?.installed))throw new Error('catalog-schema');
 const rows=data.installed.filter(r=>r.pluginId==='sodam-persona@sodam-persona');
 if(rows.length!==1)return null;
 const r=rows[0];
 if(r.name!=='sodam-persona'||r.marketplaceName!=='sodam-persona'||!/^\d+\.\d+\.\d+(?:\+[a-zA-Z0-9.-]+)?$/.test(r.version))throw new Error('catalog-entry');
 return r;
}
export function fingerprint(root) {
 const entries=new Map();
 function walk(dir,prefix='') {
  for(const name of readdirSync(dir).sort()) {
   const p=join(dir,name),s=lstatSync(p),rel=prefix+name;
   if(s.isSymbolicLink())throw new Error('unsafe-link');
   if(s.isDirectory())walk(p,rel+'/');
   else if(s.isFile())entries.set(rel,createHash('sha256').update(readFileSync(p)).digest('hex'));
   else throw new Error('unsupported-file');
  }
 }
 walk(root);return entries;
}
export function generatedCommandSkill(source,name) {
 if(!['create','edit'].includes(name))return null;
 const file=join(source,'commands',name+'.md');
 if(!existsSync(file))return null;
 const match=readFileSync(file,'utf8').match(/^---\r?\ndescription: ("[^\r\n]*")\r?\n---\r?\n([\s\S]*)$/);
 if(!match)return null;
 let description;try{description=JSON.parse(match[1]);}catch{return null;}
 const slug='source-command-'+name;
 return '---\nname: '+JSON.stringify(slug)+'\ndescription: '+JSON.stringify(description)+'\n---\n\n# '+slug+
  '\n\nUse this skill when the user asks to run the migrated source command `'+name+'`.\n\n## Command Template\n\n'+match[2].trim()+'\n';
}
export function compareTrees(source,installed) {
 const a=fingerprint(source),b=fingerprint(installed);
 // Codex 0.160.1 synthesizes these two skills from legacy commands on install.
 // Accept only byte-exact generated content; never ignore the containing directory.
 const derived=new Map();
 for(const name of ['create','edit']){
  const text=generatedCommandSkill(source,name);
  if(text!==null)derived.set('.codex-plugin/migrated-command-skills/source-command-'+name+'/SKILL.md',
   createHash('sha256').update(text).digest('hex'));
 }
 const generated=[...b.keys()].filter(k=>!a.has(k)&&derived.get(k)===b.get(k));
 const result={files:a.size,missing:[...a.keys()].filter(k=>!b.has(k)).length,
  changed:[...a.keys()].filter(k=>b.has(k)&&a.get(k)!==b.get(k)).length,
  extra:[...b.keys()].filter(k=>!a.has(k)&&!generated.includes(k)).length};
 if(generated.length)result.generated=generated.length;
 return result;
}
export function validHook(data,event,cap=12000,size=0) {
 return data?.continue===true&&data.hookSpecificOutput?.hookEventName===event&&
  typeof data.hookSpecificOutput?.additionalContext==='string'&&data.hookSpecificOutput.additionalContext.trim().length>0&&size<=cap;
}
function probe(root,name,event) {
 const r=spawnSync(process.execPath,[join(root,'hooks',name)],{input:'{}',encoding:'utf8',timeout:10000,maxBuffer:1024*1024});
 if(r.status!==0||r.error)return false;
 try{return validHook(JSON.parse(r.stdout),event,12000,r.stdout.length);}catch{return false;}
}
export function diagnose(root,home,run=spawnSync,runCli=runCodex) {
 const source=join(root,'plugins','sodam-persona');
 const version=JSON.parse(readFileSync(join(source,'.codex-plugin','plugin.json'),'utf8')).version;
 const result={sourceVersion:version,catalog:'unverified',enabled:false,versionMatch:false,contentMatch:false,
  installedHooks:'not-run',repository:'not-run',automaticHostExecution:'unverified',behavior:'unverified',ok:false};
 const validation=run(process.execPath,[join(root,'validate.mjs')],{cwd:root,encoding:'utf8',timeout:30000});
 result.repository=validation.status===0?'pass':'fail';
 const r=runCli(['plugin','list','--json'],
  {encoding:'utf8',timeout:20000,maxBuffer:20*1024*1024,env:{...process.env,CODEX_HOME:home}});
 if(r.status!==0||r.error){result.catalog='unavailable';return result;}
 let row;
 try{row=selectInstalled(JSON.parse(r.stdout));}catch{result.catalog='invalid-json-or-schema';return result;}
 if(!row){result.catalog='missing-or-ambiguous';return result;}
 result.catalog='found';result.installedVersion=row.version;result.enabled=row.installed===true&&row.enabled===true;
 result.versionMatch=row.version===version;
 // Cache layout is verified by existence, not assumed to prove installation.
 const cache=join(home,'plugins','cache',row.marketplaceName,row.name,row.version);
 if(!existsSync(cache)){result.cache='missing';return result;}
 try{
  result.content=compareTrees(source,cache);
  result.contentMatch=result.content.missing===0&&result.content.changed===0&&result.content.extra===0;
 }catch{result.cache='unreadable-or-unsafe';return result;}
 if(result.contentMatch&&result.enabled&&result.versionMatch)
  result.installedHooks=probe(cache,'inject-core.js','SessionStart')&&probe(cache,'inject-marker.js','UserPromptSubmit')?'pass':'fail';
 result.ok=result.repository==='pass'&&result.enabled&&result.versionMatch&&result.contentMatch&&result.installedHooks==='pass';
 return result;
}
