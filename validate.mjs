#!/usr/bin/env node
// v6 release validation uses the registry and its routed resources, not obsolete v5 trigger tables.
import {readFileSync,readdirSync,lstatSync,existsSync} from 'node:fs';
import {dirname,join,resolve,relative,isAbsolute} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const ROOT=dirname(fileURLToPath(import.meta.url));
const PLUGIN=join(ROOT,'plugins','sodam-persona');
const errors=[];
const err=(label)=>errors.push(label);
const text=(p)=>readFileSync(p,'utf8').replace(/\r\n/g,'\n');
const json=(p)=>JSON.parse(text(p));
const files=[];
function walk(dir){
  for(const name of readdirSync(dir)){
    if(['.git','node_modules','.omx'].includes(name))continue;
    const p=join(dir,name),s=lstatSync(p);
    if(s.isSymbolicLink()){err('심볼릭 링크 금지: '+relative(ROOT,p));continue;}
    if(s.isDirectory())walk(p);else files.push(p);
  }
}
function requireReference(base,ref){
  const p=resolve(base,ref),r=relative(ROOT,p);
  if(r.startsWith('..')||isAbsolute(r)||!existsSync(p))err('깨진 문서 참조: '+ref);
}
try{
  walk(PLUGIN);
  for(const name of ['validate.mjs','test-hooks.mjs','test-validator.mjs','test-supplemental.mjs','README.md','README.en.md','LICENSE','NOTICE','build-docs.mjs','doc-theme.html','diagnose.mjs','diagnose-core.mjs','codex-launch.mjs','evaluate.mjs','check-docs.mjs','test-diagnose.mjs','test-evaluate.mjs','test-docs.mjs','QUICKSTART.md','QUICKSTART.en.md','DEVELOPMENT.md','DEVELOPMENT.en.md'])if(existsSync(join(ROOT,name)))files.push(join(ROOT,name));
  const reg=json(join(PLUGIN,'persona-registry.json'));
  if(reg.schemaVersion!==1||!/^\d+\.\d+\.\d+$/.test(reg.pluginVersion||'')||reg.hookSerializedCap!==12000)err('등록부 기본 형식 오류');
  if(!Array.isArray(reg.perspectives)||reg.perspectives.length!==45)err('등록부 관점 수 오류');
  if(!Array.isArray(reg.domainSkills)||reg.domainSkills.length!==34||new Set(reg.domainSkills).size!==34)err('등록부 도메인 스킬 오류');
  const full=text(join(PLUGIN,'reference','persona_full_core.md'));
  if(reg.routingContract!=='reference/role_activation_contract.md'||reg.routingCases!=='reference/routing_cases.json')err('활성 계약·시험 등록 오류');
  const routing=text(join(PLUGIN,'reference','role_activation_contract.md'));
  const cases=json(join(PLUGIN,'reference','routing_cases.json'));
  if(cases.schemaVersion!==1||cases.roles?.length!==45||cases.cases?.length!==180)err('활성 시험 범위 오류');
  for(const [i,role] of reg.perspectives.entries()){
    const row=cases.roles?.[i];
    if(!row||row.id!==role.id||row.name!==role.name||!row.candidates?.length||!row.positive||!row.negative||!row.input_output||!row.boundary||!routing.includes(`### #${role.id} ${role.name.replaceAll('**','')}`))err('활성 계약 역할 누락 #'+role.id);
  }
  const ids=new Set();
  for(const c of cases.cases||[]){
    if(ids.has(c.case_id)||!Number.isInteger(c.role_id)||c.role_id<1||c.role_id>45||!c.request||!['positive','different_intent','quoted','excluded'].includes(c.kind))err('활성 시험 형식 오류');
    ids.add(c.case_id);
    if(c.kind==='positive'?(c.required_role!==c.role_id||c.forbidden_role!==null):(c.forbidden_role!==c.role_id||c.required_role!==null))err('활성 시험 기대값 오류');
  }
  for(let id=1;id<=45;id++)for(const kind of ['positive','different_intent','quoted','excluded'])if(!ids.has(`R${String(id).padStart(2,'0')}-${kind}`))err('활성 시험 종류 누락');
  for(const [i,role] of reg.perspectives.entries()){
    if(role.id!==i+1||typeof role.name!=='string'||!full.includes(`- #${role.id} ${role.name}\n`))err('등록부 관점 불일치 #'+(i+1));
  }
  for(const slug of reg.domainSkills){
    if(typeof slug!=='string'||!/^persona-[a-z0-9-]+$/.test(slug)){err('도메인 스킬 안전한 형식 오류');continue;}
    if(!existsSync(join(PLUGIN,'skills',slug,'SKILL.md'))||!full.includes(`../skills/${slug}/SKILL.md`))err('도메인 배선 누락: '+slug);
  }
  const skillDirs=readdirSync(join(PLUGIN,'skills'));
  for(const slug of skillDirs){
    if(!/^persona-[a-z0-9-]+$/.test(slug)){err('스킬 폴더 안전한 형식 오류');continue;}
    const p=join(PLUGIN,'skills',slug,'SKILL.md');
    if(!existsSync(p)){err('SKILL.md 누락: '+slug);continue;}
    const s=text(p),front=s.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if(!front||!front[1].includes(`name: ${slug}`)||!/^description:\s*\S/m.test(front[1]))err('스킬 메타데이터 오류: '+slug);
    if(!s.includes('operating_contract.md'))err('공통 정본 누락: '+slug);
    if(/^(?:- Revit.*단독 언급도 활성화한다\.|투자·법률·회계세무 복합 맥락은 해당 도메인 모두 동시 활성\.|전략·법률·비용·데이터 복합 맥락은 해당 도메인 동시 활성\.|(?:투자|법률) 트리거와 동시 감지 시 .*함께 활성\.|도메인 기능 구현은 #6, 실제 연결은 #39에 인계한다\.)/m.test(s))err('활성·인계 정본 충돌: '+slug);
    if(s.includes('37관점 기본 검토')||s.includes('키링/DPAPI 강제')||s.includes('자본시장법 경계 회피')||s.includes('정본은 `hooks/persona_core.md`다')||s.includes('정본은 항상켜짐 코어'))err('이전 전문 지침 충돌: '+slug);
    for(const ref of s.matchAll(/\.\.\/\.\.\/reference\/[a-z_]+\.md/g))requireReference(dirname(p),ref[0]);
  }
  for(const rel of ['.codex-plugin/plugin.json','.claude-plugin/plugin.json','compat/plugin.portable.json']){
    const manifest=json(join(PLUGIN,rel));
    if(manifest.version!==reg.pluginVersion)err(`${rel} version(${manifest.version}) 불일치`);
    if(manifest.name!=='sodam-persona')err('manifest name 불일치');
  }
  const portable=json(join(PLUGIN,'compat','plugin.portable.json'));
  if(existsSync(join(PLUGIN,'plugin.json')))err('루트 호환 manifest 불일치: Codex hook discovery 충돌');
  if(portable.name!=='sodam-persona'||portable.version!==reg.pluginVersion||!portable.extensions)err('루트 호환 manifest 불일치');
  const config=json(join(PLUGIN,'hooks','hooks.json'));
  for(const [event,script] of [['SessionStart','inject-core.js'],['UserPromptSubmit','inject-marker.js']]){
    const groups=config.hooks?.[event];
    if(!Array.isArray(groups)||groups.length!==1||groups[0].hooks?.length!==1){err(event+' hook 구조 오류');continue;}
    const h=groups[0].hooks[0];
    if(typeof h.commandWindows!=='string')err(event+' commandWindows 문자열 없음');
    else if(!h.commandWindows.includes(`join(process.env.PLUGIN_ROOT,'hooks','${script}')`))err(event+' Windows 명령 연결 불일치');
    if(h.type!=='command'||h.command!==`node "${'${PLUGIN_ROOT}'}/hooks/${script}"`)err(event+' hook 명령 오류');
    if(h.timeout!==30)err(`timeout(${h.timeout}) 불일치`);
    if(h.additionalContextLimit!==0)err('additionalContextLimit 불일치');
    const run=spawnSync(process.execPath,[join(PLUGIN,'hooks',script)],{input:'{}',encoding:'utf8',timeout:10000,maxBuffer:1048576});
    if(run.status!==0){err(script+' 실행 실패');continue;}
    try{
      const out=JSON.parse(run.stdout),ctx=out.hookSpecificOutput?.additionalContext;
      if(out.continue!==true||out.hookSpecificOutput?.hookEventName!==event||typeof ctx!=='string'||!ctx.trim())err(script+' 출력 형식 오류');
      if(run.stdout.length>reg.hookSerializedCap)err(script+' 프로젝트 상한 초과');
      if(!ctx.includes('reference/operating_contract.md'))err(script+' 판단 정본 경로 누락');
    }catch{err(script+' 출력 JSON 오류');}
  }
  for(const f of files){
    const rel=relative(ROOT,f);
    if(/(?:^|[\\/])\.env(?:\.|$)|\.(?:pem|p12|pfx|key)$/i.test(rel))err('비밀정보 파일 금지: '+rel);
    if(!/\.(?:md|txt|json|js|mjs|html|yml|yaml)$/.test(f))continue;
    const s=text(f);
    if(f.startsWith(PLUGIN)){
      for(const match of s.matchAll(/(?:^|[\s`(])reference\/([a-z_]+\.md)/g))requireReference(PLUGIN,'reference/'+match[1]);
    }
    // Print only file and rule, never the potentially sensitive match.
    const rules=[
      ['개인 절대경로',/[A-Za-z]:\\(?:Users|Documents)\\[^\s`]+|\/(?:Users|home)\/[A-Za-z0-9_.-]+/],
      ['private-key',/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
      ['provider-token',/\b(?:sk-[A-Za-z0-9_-]{24,}|ghp_[A-Za-z0-9]{30,}|AKIA[A-Z0-9]{16})\b/],
      ['credential-uri',/\b(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?)\:\/\/[^\s:]+:[^\s@]+@/]
    ];
    for(const [label,re] of rules)if(re.test(s))err(label+' 노출 의심: '+rel);
    if(/\.(?:js|mjs)$/.test(f)){
      const syntax=spawnSync(process.execPath,['--check',f],{encoding:'utf8',timeout:10000});
      if(syntax.status!==0)err('JS 문법 오류: '+rel);
    }
    for(const match of s.matchAll(/\]\(([^)]+)\)/g)){
      const ref=match[1];
      if(ref.startsWith('#')||/^[a-z]+:\/\//i.test(ref))continue;
      const target=ref.split('#')[0];if(target)requireReference(dirname(f),target);
    }
  }
  for(const file of ['README.md','README.en.md']){
    const s=text(join(ROOT,file));
    if(!s.includes(reg.pluginVersion)||!s.includes('45')||!s.includes(String(skillDirs.length)))err(file+' 현행 수치 불일치');
  }
  for(const slug of reg.domainSkills.slice(26)){
    const s=text(join(PLUGIN,'skills',slug,'SKILL.md'));
    if(!s.includes('operating_contract.md')||!s.includes('test_scenarios.md'))err(slug+' 기준·시험 인계 누락');
  }
}catch{err('필수 파일 읽기·JSON·권한·등록부 형식 오류');}
console.log(errors.length?`FAIL — ${errors.length}건\n`+errors.map(e=>' - '+e).join('\n'):'PASS — v6 registry, skills, hooks, references, privacy, syntax');
process.exitCode=errors.length?1:0;
