#!/usr/bin/env node
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, cpSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const ROOT = dirname(fileURLToPath(import.meta.url));
const HOOKS = join(ROOT, 'plugins', 'sodam-persona', 'hooks');

function run(script, input = '{}', cwd = HOOKS) {
  return spawnSync(process.execPath, [join(cwd, script)], {
    input,
    encoding: 'utf8',
    timeout: 10000,
    maxBuffer: 20 * 1024 * 1024,
  });
}

function parseSuccessful(result, event) {
  assert.equal(result.status, 0, result.stderr);
  const value = JSON.parse(result.stdout);
  assert.equal(value.continue, true);
  assert.equal(value.hookSpecificOutput.hookEventName, event);
  assert.equal(typeof value.hookSpecificOutput.additionalContext, 'string');
  assert.ok(value.hookSpecificOutput.additionalContext.trim().length > 0);
  return value.hookSpecificOutput.additionalContext;
}

for (const [script, event, required] of [
  ['inject-core.js', 'SessionStart', ['메타 규칙', '37명', 'persona-triggers']],
  ['inject-marker.js', 'UserPromptSubmit', ['페르소나', '37명', 'persona-triggers']],
]) {
  test(`${script}: 정상·빈·잘못된 JSON 입력에도 유효한 hook JSON`, () => {
    for (const input of ['{}', '', '{broken']) {
      const context = parseSuccessful(run(script, input), event);
      for (const phrase of required) assert.ok(context.includes(phrase), `${phrase} 누락`);
    }
  });

  test(`${script}: 2 MiB stdin을 끝까지 처리`, () => {
    parseSuccessful(run(script, 'x'.repeat(2 * 1024 * 1024)), event);
  });
}

const configuredHooks = JSON.parse(readFileSync(join(HOOKS, 'hooks.json'), 'utf8')).hooks;
for (const event of ['SessionStart', 'UserPromptSubmit']) {
  test(`${event}: commandWindows 설정 명령 실행`, () => {
    const command = configuredHooks[event][0].hooks[0].commandWindows;
    const result = spawnSync(command, {
      input: '{}', encoding: 'utf8', shell: true, timeout: 10000,
      env: { ...process.env, PLUGIN_ROOT: dirname(HOOKS) },
    });
    parseSuccessful(result, event);
  });
}

for (const [script, source, event] of [
  ['inject-core.js', 'persona_core.md', 'SessionStart'],
  ['inject-marker.js', 'persona_marker.txt', 'UserPromptSubmit'],
]) {
  test(`${script}: 원문 누락 시 명시적 복구 문구`, () => {
    const dir = mkdtempSync(join(tmpdir(), 'sodam-hook-'));
    try {
      cpSync(join(HOOKS, script), join(dir, script));
      const context = parseSuccessful(run(script, '{}', dir), event);
      assert.match(context, /찾을 수 없어/);
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });

  test(`${script}: 원문 공백 시 명시적 복구 문구`, () => {
    const dir = mkdtempSync(join(tmpdir(), 'sodam-hook-'));
    try {
      cpSync(join(HOOKS, script), join(dir, script));
      writeFileSync(join(dir, source), '   \n', 'utf8');
      const context = parseSuccessful(run(script, '{}', dir), event);
      assert.match(context, /비어 있어/);
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });
}
