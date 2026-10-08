import {existsSync} from 'node:fs';
import {join,delimiter} from 'node:path';
import {spawnSync} from 'node:child_process';
export function runCodex(args,options={}) {
 if(process.platform!=='win32')return spawnSync('codex',args,{...options,shell:false});
 for(const dir of (process.env.PATH||'').split(delimiter).filter(Boolean)) {
  const exe=join(dir,'codex.exe');
  if(existsSync(exe))return spawnSync(exe,args,{...options,shell:false});
  const js=join(dir,'node_modules','@openai','codex','bin','codex.js');
  if(existsSync(js))return spawnSync(process.execPath,[js,...args],{...options,shell:false});
 }
 return {status:null,error:new Error('codex-executable-not-found')};
}
