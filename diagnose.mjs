#!/usr/bin/env node
import {dirname,resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {homedir} from 'node:os';
import {diagnose} from './diagnose-core.mjs';
let home=process.env.CODEX_HOME||join(homedir(),'.codex'),asJson=false;
try {
 const args=process.argv.slice(2);
 for(let i=0;i<args.length;i++) {
  if(args[i]==='--json')asJson=true;
  else if(args[i]==='--home'&&args[i+1]&&!args[i+1].startsWith('--'))home=resolve(args[++i]);
  else if(args[i]==='--help'){console.log('node diagnose.mjs [--home <Codex home>] [--json]');process.exit(0);}
  else throw new Error('arguments');
 }
 const r=diagnose(dirname(fileURLToPath(import.meta.url)),home);
 console.log(asJson?JSON.stringify(r,null,2):'SoDam-Persona 진단\n'+JSON.stringify(r,null,2)+'\n자동 훅 실행·실제 AI 응답은 별도 미검증입니다.');
 process.exitCode=r.ok?0:1;
}catch{console.error('진단 실패: 인수·파일·권한을 확인하세요. 민감한 오류 원문은 출력하지 않습니다.');process.exitCode=1;}
