#!/usr/bin/env node
import {readFileSync,mkdtempSync,rmSync} from 'node:fs';
import {dirname,join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {tmpdir} from 'node:os';
import {spawnSync} from 'node:child_process';
export function bodyText(html) {
 const body=html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1];
 if(body===undefined)throw new Error('missing-body');
 return body.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi,'').replace(/<!--[\s\S]*?-->/g,'').replace(/<[^>]*>/g,' ')
  .replace(/&#x([0-9a-f]+);/gi,(_,x)=>String.fromCodePoint(parseInt(x,16))).replace(/&#(\d+);/g,(_,x)=>String.fromCodePoint(Number(x)))
  .replace(/&(amp|lt|gt|quot|apos|nbsp);/g,(_,x)=>({amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:' '})[x]).replace(/\s+/g,' ').trim();
}
export function checkDocs(root) {
 const dir=mkdtempSync(join(tmpdir(),'persona-docs-'));let ok=true;
 try {
  for(const [src,out,title,lang] of [['README.md','README.html','SoDam-Persona — README (한국어)','ko'],['README.en.md','README.en.html','SoDam-Persona — README (English)','en']]) {
   const target=join(dir,out),r=spawnSync('pandoc',[join(root,src),'-f','gfm','--standalone','--include-in-header',join(root,'doc-theme.html'),'--metadata',`title=${title}`,'--metadata',`lang=${lang}`,'-o',target],{encoding:'utf8',timeout:30000});
   if(r.status!==0||r.error){console.error('FAIL: pandoc unavailable or conversion failed');ok=false;continue;}
   const equal=bodyText(readFileSync(target,'utf8'))===bodyText(readFileSync(join(root,out),'utf8'));
   console.log(`${equal?'PASS':'FAIL'}: ${src} / ${out} body text`);ok=ok&&equal;
  }
  const texts=['README.md','README.en.md'].map(f=>readFileSync(join(root,f),'utf8'));
  const shapes=texts.map(s=>JSON.stringify({headings:[...s.matchAll(/^(#{1,6}) /gm)].map(m=>m[1].length),toggles:(s.match(/<details\b/g)||[]).length}));
  const same=shapes[0]===shapes[1];console.log(`${same?'PASS':'FAIL'}: bilingual heading and toggle structure`);
  return ok&&same;
 }finally{rmSync(dir,{recursive:true,force:true});}
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
 try{process.exitCode=checkDocs(dirname(fileURLToPath(import.meta.url)))?0:1;}
 catch{console.error('FAIL: document read/parse error');process.exitCode=1;}
}
