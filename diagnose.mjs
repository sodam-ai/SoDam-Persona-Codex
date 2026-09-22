#!/usr/bin/env node
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const ROOT = dirname(fileURLToPath(import.meta.url));
const manifest = JSON.parse(readFileSync(join(ROOT, 'plugins', 'sodam-persona', '.codex-plugin', 'plugin.json'), 'utf8'));
const hookDir = join(ROOT, 'plugins', 'sodam-persona', 'hooks');
function runHook(name) {
  const result = spawnSync(process.execPath, [join(hookDir, name)], { input: '{}', encoding: 'utf8', timeout: 10000 });
  if (result.status !== 0) return { ok: false, error: result.stderr.trim() || `exit ${result.status}` };
  try {
    const data = JSON.parse(result.stdout);
    return { ok: true, event: data.hookSpecificOutput?.hookEventName, chars: result.stdout.length };
  } catch (error) { return { ok: false, error: error.message }; }
}
function installedVersion() {
  const result = spawnSync('codex', ['plugin', 'list'], { encoding: 'utf8', timeout: 15000, shell: process.platform === 'win32', maxBuffer: 20 * 1024 * 1024 });
  if (result.status !== 0) return { status: 'unknown', reason: result.stderr.trim() || 'codex plugin list 실행 실패' };
  const text = result.stdout.replace(/\x1b\[[0-9;]*m/g, '');
  const row = text.match(/^\s*sodam-persona@sodam-persona\s+(.+?)\s+(\d+\.\d+\.\d+(?:\+[^\s]+)?)\s+.+$/mi);
  if (!row) return { status: 'not-found' };
  return { status: 'found', version: row[2], enabled: /enabled/i.test(row[1]) };
}

const validation = spawnSync(process.execPath, ['validate.mjs'], { cwd: ROOT, encoding: 'utf8', timeout: 30000 });
const installed = installedVersion();
const core = runHook('inject-core.js');
const marker = runHook('inject-marker.js');
const mismatch = installed.status === 'found' && installed.version.split('+')[0] !== manifest.version;
const installedOk = installed.status === 'found' && installed.enabled && !mismatch;

console.log('SoDam-Persona 진단');
console.log(`- 소스 버전: ${manifest.version}`);
console.log(`- 설치본: ${installed.status === 'found' ? `${installed.version} (${installed.enabled ? 'enabled' : 'disabled'})` : installed.status === 'not-found' ? '찾지 못함' : `확인 불가 — ${installed.reason}`}`);
console.log(`- 버전 일치: ${installed.status === 'found' ? (mismatch ? '아니오' : '예') : '판정 불가'}`);
console.log(`- SessionStart 스크립트 직접 실행: ${core.ok ? `정상 (${core.chars}자)` : `실패 — ${core.error}`}`);
console.log(`- UserPromptSubmit 스크립트 직접 실행: ${marker.ok ? `정상 (${marker.chars}자)` : `실패 — ${marker.error}`}`);
console.log(`- 저장소 정합성: ${validation.status === 0 ? 'PASS' : 'FAIL'}`);
process.exit(validation.status === 0 && core.ok && marker.ok && installedOk ? 0 : 1);
