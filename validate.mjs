#!/usr/bin/env node
/**
 * SoDam-Persona 정합성 검사기 (자기완결 — Node 내장만 사용, 의존성 0)
 *
 * 목적: 관점 수(20→22 같은) 드리프트·스킬 수 불일치·도메인 배선 누락·
 *       JSON 오류를 push 전에 기계적으로 잡는다. (AGENTS.md 하네스 원칙: 골든 룰을 규칙으로 인코딩)
 *
 * 사용: node validate.mjs   (저장소 루트에서. 종료코드 0=통과, 1=실패)
 *
 * 설계 주의:
 *  - "15년(경력)"과 "15명/개/관점(관점 수)"은 다르다 → 년(年)은 절대 매칭하지 않는다.
 *  - reference/ 백로그 카드는 과거 스냅샷이라 엄격검사에서 제외(경고만).
 *  - 스크립트 위치 기준 상대경로 → 새 PC/다른 경로에서도 작동(자기완결).
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = dirname(fileURLToPath(import.meta.url));
const P = (...p) => join(ROOT, ...p);
const read = (rel) => readFileSync(P(rel), 'utf8');

const errors = [];
const err = (m) => errors.push(m);

// ── 1) 관점 수 N = B 테이블 행 수 (source of truth) ───────────────────────
const PLUGIN_ROOT = 'plugins/sodam-persona';
const pluginPath = (...parts) => [PLUGIN_ROOT, ...parts].join('/');
const triggers = read(pluginPath('skills/persona-triggers/SKILL.md'));
const bSection = triggers.slice(
  triggers.indexOf('## B.'),
  triggers.indexOf('복수 관점 명시')
);
const rows = [...bSection.matchAll(/^\|\s*(\d+)\s*\|/gm)].map((m) => +m[1]);
const N = rows.length;
// 연속성: 1..N 이어야 함
for (let i = 0; i < N; i++) {
  if (rows[i] !== i + 1) err(`B테이블 관점 번호 불연속: ${i + 1}번 위치에 ${rows[i]}`);
}
if (N < 1) err('B테이블에서 관점 행을 찾지 못함');

// ── 2) 관점 수 표기 일관성 (모든 핵심 파일이 N과 일치해야 함) ────────────
const KEY_FILES = [
  pluginPath('hooks/persona_core.md'),
  pluginPath('hooks/persona_marker.txt'),
  pluginPath('skills/persona-format/SKILL.md'),
  pluginPath('skills/persona-triggers/SKILL.md'),
  pluginPath('skills/persona-investor/SKILL.md'),
  pluginPath('skills/persona-lawyer/SKILL.md'),
  pluginPath('skills/persona-accountant/SKILL.md'),
  pluginPath('skills/persona-marketer/SKILL.md'),
  pluginPath('reference/persona_full_core.md'),
  pluginPath('reference/test_scenarios.md'),
  'README.md',
  'README.en.md',
];
// 관점 수를 뜻하는 표현만 (년 제외). 캡처된 모든 숫자는 N과 같아야 한다.
const COUNT_PATTERNS = [
  /(\d+)\s*명/g,               // N명 (모든 명 = 관점 인원수)
  /(\d+)\s*관점/g,             // N관점
  /다관점 판단 \((\d+)개\)/g,  // format "(N개)"
  /(\d+)개 관점/g,             // README "N개 관점"
  /(\d+)개 도메인 관점/g,      // core "N개 도메인 관점"
  /(\d+)\s*perspectives/gi,    // README.en/GUIDE.en "N perspectives"
];
for (const f of KEY_FILES) {
  if (!existsSync(P(f))) { err(`핵심 파일 없음: ${f}`); continue; }
  const text = read(f);
  for (const re of COUNT_PATTERNS) {
    for (const m of text.matchAll(re)) {
      if (+m[1] !== N) err(`관점 수 불일치 (${f}): "${m[0]}" ≠ ${N}명 기준`);
    }
  }
}

// ── 3) 패턴 수 (A~AA 이상) 일관성 ──────────────────────────────────────────────
const patternIds = [...triggers.matchAll(/^## ([A-Z]+)\. /gm)].map((m) => m[1]);
const patternOrdinal = (id) => [...id].reduce((n, ch) => n * 26 + ch.charCodeAt(0) - 64, 0);
const uniqLetters = [...new Set(patternIds)].sort((a, b) => patternOrdinal(a) - patternOrdinal(b));
if (uniqLetters.some((id, index) => patternOrdinal(id) !== index + 1))
  err(`pattern IDs are not contiguous from A: ${uniqLetters.join(', ')}`);
const descMatch = triggers.match(/A~([A-Z]+)\s*(\d+)패턴/);
if (!descMatch) err('트리거 description에서 "A~X N패턴" 표기를 못 찾음');
else {
  const [, lastLetter, patCount] = descMatch;
  if (+patCount !== uniqLetters.length)
    err(`패턴 수 불일치: 표기 ${patCount} ≠ 실제 섹션 ${uniqLetters.length}개`);
  if (uniqLetters.at(-1) !== lastLetter)
    err(`패턴 마지막 글자 불일치: 표기 A~${lastLetter} ≠ 실제 A~${uniqLetters.at(-1)}`);
}

// ── 4) 스킬 수 일관성 (실제 폴더 = 문서 표기) + frontmatter name=폴더명 ──
const skillsDir = P(PLUGIN_ROOT, 'skills');
const skillFolders = readdirSync(skillsDir).filter((d) =>
  statSync(join(skillsDir, d)).isDirectory()
);
const nSkills = skillFolders.length;
for (const folder of skillFolders) {
  const skillPath = join(skillsDir, folder, 'SKILL.md');
  if (!existsSync(skillPath)) { err(`스킬 폴더에 SKILL.md 없음: ${folder}`); continue; }
  const fm = readFileSync(skillPath, 'utf8');
  const nameMatch = fm.match(/^name:\s*(\S+)/m);
  if (!nameMatch) err(`frontmatter name 없음: ${folder}/SKILL.md`);
  else if (nameMatch[1] !== folder)
    err(`frontmatter name(${nameMatch[1]}) ≠ 폴더명(${folder})`);
  if (!/^description:\s*.+/m.test(fm)) err(`frontmatter description 없음: ${folder}/SKILL.md`);
}
const readme = read('README.md');
const readmeSkill = readme.match(/상황별 \((\d+)개\)/);
if (readmeSkill && +readmeSkill[1] !== nSkills)
  err(`README 스킬 수(${readmeSkill[1]}) ≠ 실제(${nSkills})`);

// ── 4-1) 영문 문서(README.en) 스킬 수 + 트리거 패턴 수 표기 (2026-07-26 추가, 2026-07-27 GUIDE 제거 반영) ──
// 근거: validate.mjs가 기존엔 한글 README.md만 검사 → 영문 문서는 수치가
// 어긋나도 CI가 못 잡음(실측 확인). "Skills (N)" 표기와 "N patterns" 표기를 교차검사.
for (const f of ['README.en.md']) {
  const text = read(f);
  const skillMatch = text.match(/Skills? ?\((\d+)\)/);
  if (skillMatch && +skillMatch[1] !== nSkills)
    err(`${f} 스킬 수(${skillMatch[1]}) ≠ 실제(${nSkills})`);
  const patternMatchEn = text.match(/(\d+)\s*patterns/i);
  if (patternMatchEn && +patternMatchEn[1] !== uniqLetters.length)
    err(`${f} 패턴 수(${patternMatchEn[1]}) ≠ 실제(${uniqLetters.length})`);
}
// 한글 문서의 "트리거 패턴 20개(A~T)" 표기도 동일 기준으로 교차검사 (기존엔 미검사였음)
for (const f of ['README.md']) {
  const text = read(f);
  const patternMatchKo = text.match(/트리거 패턴 (\d+)개/);
  if (patternMatchKo && +patternMatchKo[1] !== uniqLetters.length)
    err(`${f} 패턴 수(${patternMatchKo[1]}) ≠ 실제(${uniqLetters.length})`);
}

// ── 5) 도메인 페르소나 배선 (core 파일맵 · marker 파일맵에 모두 존재) ────
const DOMAINS = ['persona-investor', 'persona-lawyer', 'persona-accountant', 'persona-marketer', 'persona-architectural-designer', 'persona-interior-designer', 'persona-construction-expert', 'persona-cost-estimator', 'persona-design-director', 'persona-spatial-3d-modeling-expert', 'persona-rendering-visualization-expert'];
const core = read(pluginPath('hooks/persona_core.md'));
const marker = read(pluginPath('hooks/persona_marker.txt'));
for (const d of DOMAINS) {
  if (!existsSync(P(PLUGIN_ROOT, 'skills', d, 'SKILL.md'))) err(`도메인 스킬 없음: ${d}`);
  if (!core.includes(d)) err(`persona_core.md 파일맵에 ${d} 누락`);
  if (!marker.includes(d)) err(`persona_marker.txt 파일맵에 ${d} 누락`);
}

// ── 6) JSON 유효성 + Codex 매니페스트/마켓플레이스 배선 ───────────────
const EXPECTED_PLUGIN_VERSION = '1.5.0';
const EXPECTED_REPOSITORY = 'https://github.com/sodam-ai/SoDam-Persona-Codex';
const manifestPaths = [
  pluginPath('plugin.json'),                         // Agent Plugins 1.0 정본
  pluginPath('.codex-plugin/plugin.json'),           // 구형 Codex 호환 fallback
  pluginPath('.claude-plugin/plugin.json'),          // 이전 호스트 호환
];
for (const manifestPath of manifestPaths) {
  try {
    const manifest = JSON.parse(read(manifestPath));
    if (manifest.name !== 'sodam-persona') err(`${manifestPath} name(${manifest.name}) ≠ sodam-persona`);
    if (manifest.version !== EXPECTED_PLUGIN_VERSION)
      err(`${manifestPath} version(${manifest.version}) ≠ ${EXPECTED_PLUGIN_VERSION}`);
    if (manifest.repository !== EXPECTED_REPOSITORY)
      err(`${manifestPath} repository(${manifest.repository}) ≠ ${EXPECTED_REPOSITORY}`);
    if (manifest.license !== 'Apache-2.0') err(`${manifestPath} license(${manifest.license}) ≠ Apache-2.0`);
  } catch (e) { err(`${manifestPath} 파싱 실패: ${e.message}`); }
}
try {
  const portable = JSON.parse(read(pluginPath('plugin.json')));
  if (portable.$schema !== 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json')
    err(`plugin.json Agent Plugins 1.0 schema 누락/불일치: ${portable.$schema}`);
  if (portable.extensions?.['com.openai']?.hooks !== './hooks/hooks.json')
    err(`plugin.json OpenAI hooks 경로 불일치: ${portable.extensions?.['com.openai']?.hooks}`);
} catch (e) { err(`Agent Plugins 1.0 plugin.json 검사 실패: ${e.message}`); }
try {
  const mkt = JSON.parse(read('.agents/plugins/marketplace.json'));
  const p0 = mkt.plugins?.[0];
  const sourcePath = typeof p0?.source === 'string' ? p0.source : p0?.source?.path;
  if (p0?.name !== 'sodam-persona') err(`Codex marketplace plugins[0].name(${p0?.name}) ≠ sodam-persona`);
  if (!sourcePath || !existsSync(P(sourcePath))) err(`Codex marketplace source 경로 없음: ${sourcePath}`);
} catch (e) { err(`Codex marketplace.json 파싱 실패: ${e.message}`); }
try {
  const legacyMkt = JSON.parse(read('.claude-plugin/marketplace.json'));
  const p0 = legacyMkt.plugins?.[0];
  if (p0?.name !== 'sodam-persona') err(`legacy marketplace plugins[0].name(${p0?.name}) ≠ sodam-persona`);
  if (typeof p0?.source === 'string' && !existsSync(P(p0.source)))
    err(`legacy marketplace source 경로 없음: ${p0.source}`);
} catch (e) { err(`legacy marketplace.json 파싱 실패: ${e.message}`); }

// ── 7) 면책(disclaimer) 강제 존재 — #14 회계세무·#11 법률·#13 투자자 안전 필수 ──
// 라이브 검증에서 #14 세무 답변이 면책을 누락(2026-07-11) → 항상-주입 레이어에
// "면책 강제" 규칙이 실제로 존재하는지 기계 검사(드리프트 재발 차단).
// 2026-08-09 법률/저작권 감사: #13 투자자만 이 검사 밖에 있던 것을 발견해 편입.
const DISCLAIMER_CHECKS = [
  [pluginPath('hooks/persona_core.md'), '면책 강제'],
  [pluginPath('hooks/persona_marker.txt'), '면책 강제'],
  [pluginPath('skills/persona-accountant/SKILL.md'), '면책'],
  [pluginPath('skills/persona-lawyer/SKILL.md'), '면책'],
  [pluginPath('skills/persona-investor/SKILL.md'), '면책'],
  [pluginPath('skills/persona-architectural-designer/SKILL.md'), '최종 확인'],
  [pluginPath('skills/persona-interior-designer/SKILL.md'), '최종 확인'],
  [pluginPath('skills/persona-construction-expert/SKILL.md'), '최종 확인'],
  [pluginPath('skills/persona-cost-estimator/SKILL.md'), '확정 금액'],
  [pluginPath('skills/persona-design-director/SKILL.md'), '자격자 확인'],
  [pluginPath('skills/persona-spatial-3d-modeling-expert/SKILL.md'), '확정하지 않는다'],
  [pluginPath('skills/persona-rendering-visualization-expert/SKILL.md'), '법정 설계도서'],
];
for (const [f, kw] of DISCLAIMER_CHECKS) {
  if (!existsSync(P(f))) { err(`면책 검사 대상 파일 없음: ${f}`); continue; }
  if (!read(f).includes(kw)) err(`면책 강제 누락 (${f}): "${kw}" 문자열 없음`);
}

// ── 8) HTML 4개 동기화 경고 (소프트 — exit code에 영향 없음, 2026-07-26 추가) ──
// 근거: HTML은 build-docs.mjs(pandoc)로 md에서 재생성되는 산출물이라 정본이 아님.
// 재생성을 잊고 md만 고치면 배포 문서가 옛 수치로 남는 것을 "경고"로만 알린다.
const warnings = [];
const HTML_FILES = ['README.html', 'README.en.html'];
for (const f of HTML_FILES) {
  if (!existsSync(P(f))) continue;
  const text = read(f);
  const nums = new Set();
  for (const re of [/(\d+)\s*명/g, /(\d+)\s*관점/g, /(\d+)개 관점/g, /(\d+)\s*perspectives/gi]) {
    for (const m of text.matchAll(re)) nums.add(+m[1]);
  }
  for (const n of nums) if (n !== N) warnings.push(`${f}: 관점 수 "${n}" ≠ 실제(${N}) — build-docs.mjs 재생성 필요 의심`);
  const skillMatch = text.match(/Skills? ?\((\d+)\)/);
  if (skillMatch && +skillMatch[1] !== nSkills)
    warnings.push(`${f}: 스킬 수 "${skillMatch[1]}" ≠ 실제(${nSkills}) — build-docs.mjs 재생성 필요 의심`);
}
if (warnings.length) {
  console.log(`⚠️  HTML 동기화 경고 ${warnings.length}건 (실패 아님, node build-docs.mjs로 해결):`);
  for (const w of warnings) console.log(`  · ${w}`);
}

// ── 9) 깨진 문서 참조 검사 (2026-08-04 추가) ──────────────────────────────
// 근거: PR #8(GUIDE.md 폐지)이 create.md의 GUIDE.md 참조 2곳을 못 지운 채 CI를
// 통과한 실사고(2026-08-04 실측). 1~8번 검사 중 "참조된 파일이 실제로 있는가"를
// 보는 게 없어서 못 잡았다 — 그 빈틈만 메운다.
// 설계: 이 저장소 자신의 파일(README·persona_core.md·skills/persona-*/SKILL.md 등)만
// 검사 대상으로 삼는다. feedback_*.md·reference_*.md·user_persona*.md 같은 사용자
// 개인 메모리 파일은 이 저장소 밖에 있는 게 정상이라 대상에서 제외(외부 참조 오탐 방지).
const REPO_KNOWN_BASENAMES = new Set([
  'persona_core.md', 'persona_marker.txt', 'hooks.json', 'plugin.json',
  'marketplace.json', 'README.md', 'README.en.md', 'LICENSE', 'NOTICE',
  'validate.mjs', 'build-docs.mjs', 'doc-theme.html', 'GUIDE.md', 'GUIDE.en.md',
]);
const isCheckableRepoRef = (ref) => {
  if (!/^[A-Za-z0-9_./-]+\.(md|mjs|js|json|html|txt)$/.test(ref)) return false;
  if (REPO_KNOWN_BASENAMES.has(ref)) return true;
  if (/^persona-[a-z0-9-]+\/SKILL\.md$/.test(ref)) return true;
  if (ref.startsWith('plugins/sodam-persona/')) return true;
  if (ref.startsWith('reference/')) return true;
  if (ref.startsWith('.claude-plugin/') || ref.startsWith('.codex-plugin/') || ref.startsWith('.agents/')) return true;
  if (ref.startsWith('.github/')) return true;
  return false;
};
const refCandidates = (ref) => [
  P(ref), P(PLUGIN_ROOT, ref), P(PLUGIN_ROOT, 'skills', ref), P(PLUGIN_ROOT, 'hooks', ref),
];
const GITIGNORED_BACKLOG = new Set(['v5_candidates.md', 'v5_decision_gates.md', 'v5_project_assets.md', 'v5_quick_wins.md']);
function listFiles(dir, exts, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) { listFiles(full, exts, out); continue; }
    if (!exts.some((e) => name.endsWith(e))) continue;
    if (GITIGNORED_BACKLOG.has(name)) continue; // 과거 스냅샷, 배포 제외(.gitignore 동일 목록)
    out.push(full);
  }
  return out;
}
const DOC_SCAN_FILES = [P('README.md'), P('README.en.md'), ...listFiles(P(PLUGIN_ROOT), ['.md'])];
for (const file of DOC_SCAN_FILES) {
  const text = readFileSync(file, 'utf8');
  const rel = file.slice(ROOT.length + 1);
  for (const m of text.matchAll(/`([^`\n]+)`/g)) {
    const ref = m[1];
    if (isCheckableRepoRef(ref) && !refCandidates(ref).some(existsSync)) {
      err(`깨진 문서 참조 (${rel}): "${ref}" 파일 없음`);
    }
  }
}

// ── 10) 개인 절대경로 노출 검사 (2026-08-04 추가) ─────────────────────────
// 근거: 커밋 9722404("개인 절대경로 노출 제거")가 reference/만 훑고, 실제 배포되는
// skills/persona-triggers/SKILL.md의 개인 스크린샷 폴더 경로는 놓쳤다(2026-08-04 실측).
// 실제 배포 플러그인과 공개 README를 검사한다. 자리표시자가 필요하면
// `<plugin-creator-dir>`처럼 운영체제 절대경로가 아닌 표현을 사용한다.
const PERSONAL_PATH_PATTERNS = [/[A-Za-z]:\\[^`\s]*/g, /\/(?:Users|home)\/[A-Za-z0-9_.-]+/g];
const PERSONAL_PATH_SCAN_FILES = [
  P('README.md'),
  P('README.en.md'),
  ...listFiles(P(PLUGIN_ROOT), ['.md', '.js', '.json', '.txt']),
];
function checkPersonalPaths(text, rel) {
  for (const re of PERSONAL_PATH_PATTERNS) {
    for (const m of text.matchAll(re)) {
      err(`개인 절대경로 노출 의심 (${rel}): "${m[0]}"`);
    }
  }
}
for (const file of PERSONAL_PATH_SCAN_FILES) {
  const text = readFileSync(file, 'utf8');
  const rel = file.slice(ROOT.length + 1);
  checkPersonalPaths(text, rel);
}
// 정규식 구현 자체의 문자열은 오탐이므로, validator는 설명 주석만 자체 검사한다.
const validatorComments = readFileSync(P('validate.mjs'), 'utf8')
  .split(/\r?\n/)
  .filter(line => line.trimStart().startsWith('//'))
  .join('\n');
checkPersonalPaths(validatorComments, 'validate.mjs (comments)');

// ── 11) Codex hooks.json 변수·스크립트·컨텍스트 한도 검사 (2026-09-16 조정) ──
// Codex 플러그인 hook은 ${PLUGIN_ROOT}를 사용한다. additionalContextLimit=0은
// 내장 잘라내기를 끄므로, 아래 #13의 저장소 자체 10,000자 상한 검사와 반드시 함께 유지한다.
try {
  const hooksConfig = JSON.parse(read(pluginPath('hooks/hooks.json')));
  const commandHandlers = [];
  (function walk(node) {
    if (Array.isArray(node)) { node.forEach(walk); return; }
    if (!node || typeof node !== 'object') return;
    if (node.type === 'command') commandHandlers.push(node);
    Object.values(node).forEach(walk);
  })(hooksConfig);
  if (commandHandlers.length !== 2) err(`hooks.json command handler 수(${commandHandlers.length}) ≠ 2`);
  for (const handler of commandHandlers) {
    const command = handler.command;
    if (typeof command !== 'string') { err('hooks.json command handler에 command 문자열 없음'); continue; }
    if (command.includes('${CLAUDE_PLUGIN_ROOT}'))
      err(`hooks.json 이전 호스트 변수 사용 (Codex는 \${PLUGIN_ROOT} 사용): "${command}"`);
    if (!command.includes('${PLUGIN_ROOT}/'))
      err(`hooks.json Codex 플러그인 루트 변수 누락: "${command}"`);
    for (const m of command.matchAll(/\$\{PLUGIN_ROOT\}\/([^"']+)/g)) {
      if (!existsSync(P(PLUGIN_ROOT, m[1]))) err(`hooks.json 참조 스크립트 없음: ${m[1]}`);
    }
    if (handler.additionalContextLimit !== 0)
      err(`hooks.json additionalContextLimit(${handler.additionalContextLimit}) ≠ 0 — #13의 프로젝트 상한과 함께 써야 함`);
  }
} catch (e) { err(`hooks.json 파싱 실패: ${e.message}`); }

// ── 12) 도메인 스킬 "트리거 단어군" 문자열이 persona-triggers와 그대로 동기화되어 있는가 ──
// 근거: commands/create.md 3-1단계 자신이 "실제 라이브 테스트에서 17건 누락 발견됨"이라고
// 기록할 만큼, 같은 트리거 단어 목록이 여러 파일에 손으로 복사돼 있다가 한쪽만 고쳐 어긋나는
// 사고가 이미 실제로 있었다. persona-accountant/persona-marketer SKILL.md는 persona-triggers의
// 해당 도메인 "트리거 단어군:" 줄을 그대로 복사해 두는 것이 기존 관례(실측 확인)이므로, 그
// 줄이 서로 다르면 어느 한쪽이 갱신 없이 어긋난 것 — 이 관례를 지키는 도메인만 검사한다.
// (investor·lawyer는 skill 파일에 별도 단어 목록을 두지 않는 설계라 검사 대상에서 자연히 제외됨 —
// 형식이 다른 파일끼리 억지로 비교해 오탐을 만들지 않기 위함)
for (const d of DOMAINS) {
  const skillPath = pluginPath('skills', d, 'SKILL.md');
  if (!existsSync(P(skillPath))) continue;
  const m = read(skillPath).match(/트리거 단어군:\s*([^\n]+)/);
  if (!m) continue;
  const line = m[1].trim();
  if (!triggers.includes(line))
    err(`도메인 트리거 단어 동기화 어긋남 (${d}/SKILL.md): persona-triggers/SKILL.md에 동일한 "트리거 단어군" 줄이 없음`);
}

// ── 13) Codex hook 출력 프로젝트 상한 검사 (2026-09-16 조정) ──────────
// hooks.json의 additionalContextLimit=0은 Codex 내장 잘라내기를 끈다. 페르소나 코어가
// 중간에서 잘리지 않게 하면서도 출력이 무제한으로 커지지 않도록, 실제 JSON 직렬화 결과에
// 저장소 자체 10,000자 상한을 적용한다. 정적 파일을 그대로 내보내는 hook이라 빌드 시 검증으로 충분하다.
const HOOK_OUTPUT_PROJECT_CAP = 10000;
const HOOK_OUTPUT_WARN_AT = 9000;
const serializedHookLength = (eventName, text) => JSON.stringify({
  continue: true,
  hookSpecificOutput: { hookEventName: eventName, additionalContext: text },
}).length;
const HOOK_OUTPUTS = [
  ['persona_core.md (SessionStart)', serializedHookLength('SessionStart', core)],
  ['persona_marker.txt (UserPromptSubmit)', serializedHookLength('UserPromptSubmit', marker)],
];
const hookSizeWarnings = [];
for (const [label, length] of HOOK_OUTPUTS) {
  if (length >= HOOK_OUTPUT_PROJECT_CAP)
    err(`hook 직렬화 출력 프로젝트 상한 초과 (${label}): ${length}자 ≥ ${HOOK_OUTPUT_PROJECT_CAP}자`);
  else if (length >= HOOK_OUTPUT_WARN_AT)
    hookSizeWarnings.push(`${label}: ${length}자 — 프로젝트 상한(${HOOK_OUTPUT_PROJECT_CAP}자)의 90% 이상, 여유 ${HOOK_OUTPUT_PROJECT_CAP - length}자`);
}
if (hookSizeWarnings.length) {
  console.log(`⚠️  hook 출력 프로젝트 상한 근접 경고 ${hookSizeWarnings.length}건 (실패 아님, 여유 있을 때 내용 정리 권장):`);
  for (const w of hookSizeWarnings) console.log(`  · ${w}`);
}

// ── 14) persona_core.md 도메인 트리거 목록이 persona-triggers 정본을 온전히 포함하는가 ──
// 근거: persona-investor/lawyer/accountant/marketer SKILL.md는 스스로 "트리거 단어·관점
// 활성 판단의 정본은 persona_core.md"라 선언하지만, 실제로는 persona_core.md가
// persona-triggers/SKILL.md의 J/K/S/T 절보다 단어 수가 적은 드리프트가 있었음(2026-08-31
// 발견: #13 "페이퍼 모드/라이브 모드" 등 누락). 12번 검사는 persona-triggers ↔ 도메인
// skill(accountant/marketer)끼리만 비교해 이 방향(core → triggers)은 사각지대였다 —
// 그 빈틈만 메운다. investor·lawyer도 여기서 함께 검사(12번은 형식이 달라 제외했지만,
// 이 검사는 core의 "트리거 단어" 줄만 보므로 형식 문제 없음).
const DOMAIN_CORE_HEADINGS = [
  ['J', '전문 투자자 페르소나'],
  ['K', '전문 변호사 페르소나'],
  ['S', '회계·세무 전문가 페르소나'],
  ['T', '마케팅·세일즈 전문가 페르소나'],
  ['U', '건축 설계 전문가 페르소나'],
  ['V', '인테리어 설계 전문가 페르소나'],
  ['W', '건축·인테리어 시공 전문가 페르소나'],
  ['X', '건축·인테리어 견적 전문가 페르소나'],
  ['Y', '건축·인테리어 디자인 디렉터 페르소나'],
  ['Z', '건축·인테리어 3D 모델링 전문가 페르소나'],
  ['AA', '건축·인테리어 렌더링·시각화 전문가 페르소나'],
];
function extractSection(text, marker, endRe) {
  const start = text.indexOf(marker);
  if (start === -1) return null;
  const rest = text.slice(start + marker.length);
  const nextMatch = rest.match(endRe);
  const end = nextMatch ? start + marker.length + nextMatch.index : text.length;
  return text.slice(start, end);
}
function wordsFromList(line) {
  return line
    .replace(/\([^)]*\)/g, '') // 괄호 각주 제거 (※ ... 같은 예외 설명)
    .split(',')
    .map((w) => w.trim().replace(/[.]+$/, '')) // 문장 끝 마침표 제거(단어 자체엔 마침표 없음)
    .filter(Boolean);
}
for (const [letter, coreHeading] of DOMAIN_CORE_HEADINGS) {
  const triggerSection = extractSection(triggers, `## ${letter}. `, /\n## [A-Z]+\. /);
  const triggerWordLine = triggerSection && triggerSection.match(/트리거 단어군:\s*([^\n]+)/);
  if (!triggerWordLine) { err(`persona-triggers ${letter}절에서 "트리거 단어군:" 줄을 못 찾음`); continue; }
  const canonicalWords = wordsFromList(triggerWordLine[1]);

  const coreSection = extractSection(core, coreHeading, /\n### /);
  const coreWordLine = coreSection && coreSection.match(/\*\*트리거 단어\*\*:\s*([^\n]+)/);
  if (!coreWordLine) { err(`persona_core.md에서 "${coreHeading}" 절의 트리거 단어 줄을 못 찾음`); continue; }
  // persona_core.md는 (※ ...) 각주가 같은 줄에 붙고 그 안에 중첩 괄호(예: "(회계감사)")가
  // 있어 단순 /\([^)]*\)/g 로는 못 지운다 — 첫 " (" 앞까지만 단어 목록으로 취급해 우회.
  const coreWordsRaw = coreWordLine[1].split(/\s\(/)[0];
  const coreWords = new Set(wordsFromList(coreWordsRaw));

  for (const w of canonicalWords) {
    if (!coreWords.has(w)) err(`persona_core.md "${coreHeading}" 트리거 누락: "${w}" (persona-triggers ${letter}절엔 있음, 정본이라던 core엔 없음)`);
  }
}

// ── 14-1) 건축·인테리어 계열의 경계·협업·오발동 안전성 ────────────────
const BUILT_ENVIRONMENT_DOMAINS = [
  ['U', 'persona-architectural-designer'],
  ['V', 'persona-interior-designer'],
  ['W', 'persona-construction-expert'],
  ['X', 'persona-cost-estimator'],
  ['Y', 'persona-design-director'],
  ['Z', 'persona-spatial-3d-modeling-expert'],
  ['AA', 'persona-rendering-visualization-expert'],
];
const BUILT_COLLAB_REF = 'reference/built_environment_collaboration.md';
const OVERBROAD_BUILT_TRIGGERS = new Set(['건축', '인테리어', '설계', '시공', '견적', '디자인', '공간', '공사']);
for (const [letter, skillName] of BUILT_ENVIRONMENT_DOMAINS) {
  const skillPath = pluginPath(`skills/${skillName}/SKILL.md`);
  if (!existsSync(P(skillPath))) { err(`건축·인테리어 도메인 skill 누락: ${skillName}`); continue; }
  const skillText = read(skillPath);
  if (!skillText.includes(BUILT_COLLAB_REF)) err(`${skillName}에 공통 협업 프로토콜 참조 누락`);
  if (!skillText.includes('15년+')) err(`${skillName}에 15년+ 경력 기준 누락`);

  const triggerSection = extractSection(triggers, `## ${letter}. `, /\n## [A-Z]+\. /);
  const triggerWordLine = triggerSection && triggerSection.match(/트리거 단어군:\s*([^\n]+)/);
  if (!triggerWordLine) continue; // 14번 검사가 상세 오류를 이미 보고한다.
  const overbroad = wordsFromList(triggerWordLine[1]).filter((w) => OVERBROAD_BUILT_TRIGGERS.has(w));
  if (overbroad.length) err(`${skillName}의 단독 일반어 트리거가 오발동 위험: ${overbroad.join(', ')}`);
}
for (const target of [core, marker]) {
  if (!target.includes(BUILT_COLLAB_REF)) err(`건축·인테리어 공통 협업 프로토콜이 core/marker에 연결되지 않음`);
}
const modelingSkill = read(pluginPath('skills/persona-spatial-3d-modeling-expert/SKILL.md'));
const renderingSkill = read(pluginPath('skills/persona-rendering-visualization-expert/SKILL.md'));
for (const phrase of ['데이터 모델링', 'DB 모델링', 'AI 모델']) {
  if (!modelingSkill.includes(phrase)) err(`3D 모델링 충돌 제외 규칙 누락: ${phrase}`);
}
for (const phrase of ['React 렌더링', '웹 렌더링', '브라우저 렌더']) {
  if (!renderingSkill.includes(phrase)) err(`렌더링 충돌 제외 규칙 누락: ${phrase}`);
}
for (const phrase of ['Revit', '레빗', 'Rhino', '라이노']) {
  if (!modelingSkill.includes(phrase)) err(`확정 3D 도구 트리거 누락: ${phrase}`);
}

// ── 15) 페르소나 스킬 폴더명 안전성 검사 (2026-09-01 추가) ──────────────────
// 근거: commands/create.md 2단계의 slug 검증("^[a-z][a-z0-9-]*$"만 허용, 경로 조작 방지)은
// 코드가 아니라 AI에게 "이렇게 확인하라"고 지시하는 문장뿐이라, AI가 그 지시를 놓치면
// 아무 것도 못 막는 구조였다. 폴더명이 이미 만들어진 뒤에라도 이 검사(및 create.md 4단계가
// 이미 강제하는 "PASS할 때까지 반복")가 있으면, 경로 조작 문자가 섞인 폴더명은 절대
// "완료" 상태에 도달할 수 없고 혹시 놓쳐도 다음 push 때 CI가 기계적으로 잡는다.
const SAFE_SKILL_FOLDER_RE = /^persona-[a-z][a-z0-9-]*$/;
for (const folder of skillFolders) {
  if (!SAFE_SKILL_FOLDER_RE.test(folder)) err(`페르소나 스킬 폴더명이 안전한 형식(persona-[a-z][a-z0-9-]*)이 아님: "${folder}" — 경로 조작 문자 포함 가능성`);
}

// ── 결과 ────────────────────────────────────────────────────────────────
console.log(`SoDam-Persona 정합성 검사 — 관점 ${N}명 · 패턴 ${uniqLetters.length}개 · 스킬 ${nSkills}개`);
if (errors.length === 0) {
  console.log('✅ PASS — 불일치 0건');
  process.exit(0);
} else {
  console.log(`❌ FAIL — ${errors.length}건`);
  for (const e of errors) console.log(`  · ${e}`);
  process.exit(1);
}
