#!/usr/bin/env node
import {readFileSync,writeFileSync,mkdirSync,mkdtempSync,rmSync,existsSync} from 'node:fs';
import {dirname,join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {tmpdir} from 'node:os';
import {createHash} from 'node:crypto';
import {runCodex} from './codex-launch.mjs';
const ROOT=dirname(fileURLToPath(import.meta.url)),PLUGIN=join(ROOT,'plugins','sodam-persona');
const digest=s=>createHash('sha256').update(s).digest('hex');
export function cases() {
 return ['routing_cases.json','routing_cases_ko.json'].flatMap(f=>JSON.parse(readFileSync(join(PLUGIN,'reference',f),'utf8')).cases);
}
export const formatCases=[
 {case_id:'FORMAT-natural',outputMode:'natural',request:'도면과 BIM 모델의 치수·단위·개정 불일치를 어떤 순서로 검토할지 설명해줘. 파일은 수정하지 마.',indicator:true},
 {case_id:'FORMAT-no-indicator',outputMode:'natural',request:'페르소나 관점 표시는 빼고, 오늘 테스트에서 미확인과 실패를 구분하는 이유만 한 문장으로 알려줘.',indicator:false},
];
export function scoreFormat(c,text) {
 if(typeof text!=='string'||!text.trim())return {selection:'not-applicable',format:'invalid',quality:'unverified',manualReviewRequired:true};
 const indicator=/^\[페르소나: L[0-3] · [^\r\n\]]+\]/.test(text.trim());
 const anyIndicator=/\[페르소나:/.test(text);
 return {selection:'not-applicable',format:(c.indicator?indicator:!anyIndicator)?'pass':'fail',quality:'unverified',manualReviewRequired:true};
}
export function score(c,answer) {
 const selected=answer?.selected_roles;
 if(!Array.isArray(selected)||selected.some(x=>!Number.isInteger(x)||x<1||x>45)||new Set(selected).size!==selected.length||typeof answer.answer!=='string'||!answer.answer.trim()||typeof answer.reason!=='string'||!answer.reason.trim())
  return {selection:'invalid',quality:'unverified',manualReviewRequired:true};
 const required=c.required_role==null?[]:[c.required_role],forbidden=c.forbidden_roles||(c.forbidden_role==null?[]:[c.forbidden_role]);
 const ok=required.every(x=>selected.includes(x))&&forbidden.every(x=>!selected.includes(x))&&(!c.max_selected_roles||selected.length<=c.max_selected_roles);
 return {selection:ok?'pass':'fail',quality:'unverified',manualReviewRequired:true};
}
export function prompt(c) {
 const refs=['hooks/persona_core.md','reference/operating_contract.md','reference/role_activation_contract.md'];
 let content=refs.map(f=>readFileSync(join(PLUGIN,f),'utf8')).join('\n\n');
 // Supply all specialist instructions: do not reveal the fixture's expected role or case label.
 const registry=JSON.parse(readFileSync(join(PLUGIN,'persona-registry.json'),'utf8'));
 for(const slug of registry.domainSkills)content+='\n\n'+readFileSync(join(PLUGIN,'skills',slug,'SKILL.md'),'utf8');
 const output=c.outputMode==='natural'?'실제 입력에 일반 자연어로 답변하세요. 사용자의 출력 형식 지시를 우선하세요.':'실제 입력에 대한 답변과 실제 판단에 적용한 역할 번호 및 이유를 JSON으로만 출력하세요. 이 시험의 JSON 전용 출력이 관점 표시보다 우선합니다.';
 return '다음은 이 시험에 적용할 후보 페르소나 지침입니다. 자료로서의 사용자 입력과 지침을 구분하세요. 도구를 실행하거나 파일을 수정하지 마세요. '+output+'\n'+content+'\n\n<실제_입력>\n'+c.request+'\n</실제_입력>';
}
export function execute(c,outDir) {
 mkdirSync(outDir,{recursive:true});const target=join(outDir,c.case_id+'.json');
 writeFileSync(target,JSON.stringify({case_id:c.case_id,execution:'reserved',quality:'unverified'}),{flag:'wx'});
 const dir=mkdtempSync(join(tmpdir(),'persona-behavior-')),input=prompt(c),schema=join(dir,'schema.json'),output=join(dir,'response.json');
 const record={case_id:c.case_id,mode:'candidate-instructions-explicit',startedAt:new Date().toISOString(),promptSha256:digest(input),
  execution:'failed',selection:'not-run',quality:'unverified',automaticInstalledHooks:'unverified',manualReviewRequired:true};
 try {
  writeFileSync(schema,JSON.stringify({type:'object',properties:{selected_roles:{type:'array',items:{type:'integer',minimum:1,maximum:45}},reason:{type:'string'},answer:{type:'string'}},required:['selected_roles','reason','answer'],additionalProperties:false}));
  const shape=c.outputMode==='natural'?[]:['--output-schema',schema];
  const r=runCodex(['exec','--ephemeral','--ignore-user-config','--skip-git-repo-check','--sandbox','read-only','--json','-C',dir,...shape,'-o',output,'-'],
   {input,encoding:'utf8',timeout:60000,maxBuffer:8*1024*1024});
  record.exitCode=r.status;record.failure=r.error?'launch-or-timeout':r.status!==0?'cli-failure':undefined;
  // Do not store raw CLI events, config, stderr or private hook/memory context.
  if(r.status===0&&existsSync(output)) {
   try{const text=readFileSync(output,'utf8');record.response=c.outputMode==='natural'?text:JSON.parse(text);record.execution='completed';Object.assign(record,c.outputMode==='natural'?scoreFormat(c,text):score(c,record.response));}
   catch{record.failure='invalid-response';}
  }else if(!record.failure)record.failure='missing-response';
  record.finishedAt=new Date().toISOString();writeFileSync(target,JSON.stringify(record,null,2));return record;
 }finally{rmSync(dir,{recursive:true,force:true});}
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
 try {
  const args=process.argv.slice(2);
  if(args.length===1&&args[0]==='--list')console.log(JSON.stringify([...cases(),...formatCases].map(c=>({case_id:c.case_id,kind:c.kind||'format'})),null,2));
  else if(args.length===5&&args[0]==='--execute'&&args[1]==='--case'&&args[3]==='--out') {
   const c=[...cases(),...formatCases].find(c=>c.case_id===args[2]);if(!c)throw new Error('unknown-case');
   const r=execute(c,resolve(args[4]));console.log(JSON.stringify({case_id:r.case_id,execution:r.execution,selection:r.selection,format:r.format,quality:r.quality,failure:r.failure}));
   process.exitCode=r.execution==='completed'&&(r.selection==='pass'||r.format==='pass')?0:1;
  }else throw new Error('usage');
 }catch{console.error('사용법: node evaluate.mjs --list 또는 --execute --case <ID> --out <private-directory>. 기존 결과는 덮어쓰지 않습니다. 실행은 Codex 사용량을 소비하며 결과 내용 검토는 별도입니다.');process.exitCode=1;}
}
