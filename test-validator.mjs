#!/usr/bin/env node
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, cpSync, readFileSync, writeFileSync, rmSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const ROOT = dirname(fileURLToPath(import.meta.url));

function fixture() {
  const dir = mkdtempSync(join(tmpdir(), 'sodam-validator-'));
  cpSync(ROOT, dir, {
    recursive: true,
    filter: (src) => !src.includes(`${join(ROOT, '.git')}`) && !src.includes(`${join(ROOT, 'README.html')}`) && !src.includes(`${join(ROOT, 'README.en.html')}`),
  });
  return dir;
}
function validate(cwd) {
  return spawnSync(process.execPath, ['validate.mjs'], { cwd, encoding: 'utf8', timeout: 20000, maxBuffer: 8 * 1024 * 1024 });
}
function mutate(root, rel, transform) {
  const path = join(root, ...rel.split('/'));
  writeFileSync(path, transform(readFileSync(path, 'utf8')), 'utf8');
}

const cases = [
  ['registry perspective drift', 'plugins/sodam-persona/persona-registry.json', (s) => s.replace('\"name\": \"시니어 개발자', '\"name\": \"잘못된 이름'), /등록부 관점 불일치/],
  ['Codex manifest version drift', 'plugins/sodam-persona/.codex-plugin/plugin.json', (s) => s.replace('"version": "1.10.2"', '"version": "0.0.0"'), /version\(0\.0\.0\)/],
  ['portable manifest version drift', 'plugins/sodam-persona/compat/plugin.portable.json', (s) => s.replace('"version": "1.10.2"', '"version": "0.0.0"'), /version\(0\.0\.0\)/],
  ['Windows hook command removal', 'plugins/sodam-persona/hooks/hooks.json', (s) => s.replaceAll('"commandWindows"', '"commandWindowsMissing"'), /commandWindows 문자열 없음/],
  ['Windows hook event swap', 'plugins/sodam-persona/hooks/hooks.json', (s) => s.replace("'inject-core.js'", "'inject-marker.js'"), /SessionStart Windows 명령.*연결 불일치/],
  ['hook timeout drift', 'plugins/sodam-persona/hooks/hooks.json', (s) => s.replaceAll('"timeout": 30', '"timeout": 5'), /timeout\(5\)/],
  ['domain wiring removal', 'plugins/sodam-persona/hooks/persona_marker.txt', (s) => s.replaceAll('persona-generative-ai-platform-operator', 'persona-missing-platform'), /persona-generative-ai-platform-operator/],
  ['hook size overflow', 'plugins/sodam-persona/hooks/persona_core.md', (s) => `${s}\n${'가'.repeat(16000)}`, /프로젝트 상한/],
  ['unsafe absolute personal path', 'README.md', (s) => `${s}\nC:\\Users\\someone\\secret.txt`, /개인 절대경로/],
];

test('validate.mjs: 현재 저장소 기준선 통과', () => {
  const result = validate(ROOT);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /PASS/);
});

for (const [name, rel, transform, expected] of cases) {
  test(`validate.mjs: ${name} 차단`, () => {
    const dir = fixture();
    try {
      mutate(dir, rel, transform);
      const result = validate(dir);
      assert.equal(result.status, 1, `validator가 실패를 잡지 못함:\n${result.stdout}`);
      assert.match(result.stdout, expected);
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });
}
test('validate.mjs: 루트 plugin.json 재도입 차단', () => {
  const dir = fixture();
  try {
    const pluginRoot = join(dir, 'plugins', 'sodam-persona');
    writeFileSync(join(pluginRoot, 'plugin.json'), readFileSync(join(pluginRoot, 'compat', 'plugin.portable.json')));
    const result = validate(dir);
    assert.equal(result.status, 1, result.stdout);
    assert.match(result.stdout, /플러그인 루트 plugin\.json 존재/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});


test('validate.mjs: unsafe skill folder 차단', () => {
  const dir = fixture();
  try {
    const bad = join(dir, 'plugins', 'sodam-persona', 'skills', 'persona-Bad_Name');
    mkdirSync(bad, { recursive: true });
    writeFileSync(join(bad, 'SKILL.md'), '---\nname: persona-Bad_Name\ndescription: test\n---\n', 'utf8');
    const result = validate(dir);
    assert.equal(result.status, 1, result.stdout);
    assert.match(result.stdout, /안전한 형식/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
