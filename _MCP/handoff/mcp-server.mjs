#!/usr/bin/env node
// session-bridge MCP: 跨工具会话读取 + 双向增量上下文同步
// 工具: list_sessions / read_session(id, source?, since?, max_chars?) / current_session
// 零依赖 Node ESM。适配器化: 加新 agent 工具 = 加一个 adapter + 注册一行。
import { createInterface } from 'node:readline';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const HOME = os.homedir();
const CLAUDE_PROJECTS = path.join(HOME, '.claude', 'projects');
const CODEX_SESSIONS = path.join(HOME, '.codex', 'sessions');
// TODO(性能): codex 有 ~/.codex/session_index.jsonl 索引，字段格式确认后可加速 list；本轮先用流式读取，避免格式猜测。

// 运行时状态目录(XDG 风格)，与源码分离 —— P0-1
const STATE_DIR = process.env.SB_STATE_DIR || path.join(HOME, '.cache', 'session-bridge');
const WATERMARK = path.join(STATE_DIR, 'watermark.json');
const LEGACY_WATERMARK = path.join(HOME, '.codex', 'handoff', 'watermark.json');

const MAX_OUTPUT_CHARS = 60000; // read_session 默认输出上限 —— P1-1
let lastError = null; // 模块级错误记录，便于排查 —— P1-3

// 调试日志门控: 默认关闭，SB_DEBUG=1 启用 —— P0-3
const SB_DEBUG = !!process.env.SB_DEBUG;
const SB_LOG = process.env.SB_DEBUG_LOG || '/tmp/sb.log';
function dbg(tag, s) { if (SB_DEBUG) { try { fs.appendFileSync(SB_LOG, `[${tag}] ${String(s).slice(0, 300)}\n`); } catch {} } }

const encodeProject = (cwd) => cwd.replace(/\//g, '-');

// ---------- 基础读取 ----------
function readJsonl(file) {
  if (!fs.existsSync(file)) return [];
  const out = [];
  for (const l of fs.readFileSync(file, 'utf8').split('\n')) {
    if (!l.trim()) continue;
    try { out.push(JSON.parse(l)); } catch (e) { lastError = `readJsonl parse fail @ ${file}: ${e.message}`; }
  }
  return out;
}
// 流式读 jsonl 前 maxLines 行，命中 predicate(返回 truthy) 即停 —— P1-2: list 不全量读
function readJsonlUntil(file, maxLines, predicate) {
  if (!fs.existsSync(file)) return null;
  let fd;
  try {
    fd = fs.openSync(file, 'r');
    const buf = Buffer.alloc(65536);
    let pending = '', lineNo = 0;
    while (lineNo < maxLines) {
      const n = fs.readSync(fd, buf, 0, buf.length, null);
      if (n === 0) {
        if (pending.trim()) { try { const obj = JSON.parse(pending); const hit = predicate(obj, lineNo); if (hit) return hit; } catch {} }
        break;
      }
      pending += buf.slice(0, n).toString('utf8');
      const parts = pending.split('\n');
      pending = parts.pop();
      for (const l of parts) {
        if (!l.trim()) continue;
        lineNo++;
        try { const obj = JSON.parse(l); const hit = predicate(obj, lineNo); if (hit) return hit; } catch {}
        if (lineNo >= maxLines) break;
      }
    }
    return null;
  } catch (e) { lastError = `readJsonlUntil @ ${file}: ${e.message}`; return null; }
  finally { if (fd) try { fs.closeSync(fd); } catch {} }
}

// ---------- watermark(含旧路径迁移) ---------- P0-1
let _migrated = false;
function migrateLegacyWatermark() {
  if (_migrated) return;
  _migrated = true;
  try {
    if (!fs.existsSync(WATERMARK) && fs.existsSync(LEGACY_WATERMARK)) {
      fs.mkdirSync(STATE_DIR, { recursive: true });
      const old = JSON.parse(fs.readFileSync(LEGACY_WATERMARK, 'utf8'));
      fs.writeFileSync(WATERMARK, JSON.stringify(old, null, 2));
      dbg('MIGRATE', `迁移水印 ${Object.keys(old).length} 条 → ${WATERMARK} (旧文件保留)`);
    }
  } catch (e) { lastError = `watermark 迁移失败: ${e.message}`; }
}
function loadWM() {
  migrateLegacyWatermark();
  try { return JSON.parse(fs.readFileSync(WATERMARK, 'utf8')); }
  catch (e) { lastError = `loadWM fail: ${e.message}`; return {}; }
}
function saveWM(wm) {
  try { fs.mkdirSync(STATE_DIR, { recursive: true }); fs.writeFileSync(WATERMARK, JSON.stringify(wm, null, 2)); }
  catch (e) { lastError = `saveWM fail: ${e.message}`; console.error(`[session-bridge] saveWM: ${e.message}`); }
}

// ---------- codex 解析 ----------
function parseCodex(file) {
  const meta = { source: 'codex', cwd: null, git: null, sessionId: null, tsRange: [null, null] };
  const msgs = [], files = [];
  const calls = new Map();
  for (const r of readJsonl(file)) {
    const ts = r.timestamp;
    if (ts) { if (!meta.tsRange[0]) meta.tsRange[0] = ts; meta.tsRange[1] = ts; }
    const t = r.type, p = r.payload || {};
    if (t === 'session_meta') {
      meta.sessionId = p.id || p.session_id || path.basename(file).match(/([0-9a-f-]{36})/)?.[1];
      meta.cwd = p.cwd; meta.git = p.git; continue;
    }
    if (t === 'turn_context') continue;
    if (t === 'event_msg') {
      if (p.type === 'user_message') msgs.push({ ts, role: 'user', text: extractCodexReq(p.message) });
      else if (p.type === 'agent_message') msgs.push({ ts, role: 'assistant', text: p.message || '' });
      else if (p.type === 'patch_apply_end') {
        for (const [fp, c] of Object.entries(p.changes || {})) files.push({ ts, path: fp, type: c.type, diff: c.unified_diff || '' });
      }
      continue;
    }
    if (t === 'response_item') {
      if (p.type === 'message') {
        if (p.role === 'developer' || p.role === 'user') continue;
        if (p.role === 'assistant' && p.phase !== 'commentary') {
          const text = (p.content || []).map(c => c.text || c.output_text || '').join('');
          msgs.push({ ts, role: 'assistant', text });
        }
      } else if (p.type === 'function_call') {
        let args = {}; try { args = JSON.parse(p.arguments || '{}'); } catch {}
        calls.set(p.call_id, { ts, name: p.name, args });
      } else if (p.type === 'function_call_output') {
        const c = calls.get(p.call_id);
        if (c) { msgs.push({ ts, role: 'tool', name: c.name, args: c.args, result: p.output }); calls.delete(p.call_id); }
      }
    }
  }
  return { meta, msgs, files };
}
function extractCodexReq(msg) {
  if (!msg) return '';
  const m = msg.split(/## My request for Codex:?/i);
  return (m[1] || msg).trim();
}

// ---------- claude 解析 ----------
function parseClaude(file) {
  const meta = { source: 'claude', cwd: null, git: null, sessionId: null, tsRange: [null, null] };
  const msgs = [], files = [];
  const toolUses = new Map();
  for (const r of readJsonl(file)) {
    if (r.isSidechain) continue;
    const ts = r.timestamp;
    if (ts) { if (!meta.tsRange[0]) meta.tsRange[0] = ts; meta.tsRange[1] = ts; }
    if (!meta.sessionId && r.sessionId) meta.sessionId = r.sessionId;
    if (!meta.cwd && r.cwd) meta.cwd = r.cwd;
    if (!meta.git && r.gitBranch) meta.git = { branch: r.gitBranch };
    if (r.type !== 'user' && r.type !== 'assistant') continue;
    const content = r.message?.content;
    for (const c of (Array.isArray(content) ? content : [])) {
      if (c.type === 'text') msgs.push({ ts, role: r.type, text: c.text });
      else if (c.type === 'tool_use') toolUses.set(c.id, { name: c.name, input: c.input });
      else if (c.type === 'tool_result') {
        const tu = toolUses.get(c.tool_use_id);
        if (tu) {
          const result = typeof c.content === 'string' ? c.content : JSON.stringify(c.content);
          msgs.push({ ts, role: 'tool', name: tu.name, args: tu.input, result, isError: c.is_error });
          if (tu.name === 'Edit' && tu.input?.file_path) files.push({ ts, path: tu.input.file_path, type: 'edit', diff: renderEdit(tu.input) });
          else if (tu.name === 'Write' && tu.input?.file_path) files.push({ ts, path: tu.input.file_path, type: 'write', content: tu.input.content });
          toolUses.delete(c.tool_use_id);
        }
      }
    }
  }
  return { meta, msgs, files };
}
function renderEdit(inp) {
  const o = (inp.old_string || '').split('\n').map(l => '-' + l).join('\n');
  const n = (inp.new_string || '').split('\n').map(l => '+' + l).join('\n');
  return `--- ${inp.file_path}\n+++ ${inp.file_path}\n@@ @@\n${o}\n${n}`;
}

// ---------- 定位/list 通用 ----------
function findFile(dir, re) {
  if (!fs.existsSync(dir)) return null;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) { const r = findFile(p, re); if (r) return r; }
    else if (re.test(p)) return p;
  }
  return null;
}
function listFilesDeep(dir, ext, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) listFilesDeep(p, ext, out);
    else if (ent.name.endsWith(ext)) out.push(p);
  }
  return out;
}

// ---------- codex 适配器 ----------
const codexAdapter = {
  source: 'codex',
  find(id) { return findFile(CODEX_SESSIONS, new RegExp(id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))); },
  parse: parseCodex,
  currentSession(env, meta) {
    const cm = meta?.['x-codex-turn-metadata'];
    const cid = cm?.session_id || cm?.thread_id;
    return cid ? { source: 'codex', id: cid, note: 'from x-codex-turn-metadata' } : null;
  },
  list(project, limit) {
    const out = [];
    for (const f of listFilesDeep(CODEX_SESSIONS, '.jsonl')) {
      const sm = readJsonlUntil(f, 8, r => r.type === 'session_meta' ? r : null);
      if (!sm) continue;
      const cwd = sm.payload?.cwd;
      if (project && cwd !== project) continue;
      const sid = sm.payload?.id || path.basename(f).match(/([0-9a-f-]{36})/)?.[1];
      const firstUser = readJsonlUntil(f, 200, r => (r.type === 'event_msg' && r.payload?.type === 'user_message') ? r : null);
      out.push({ id: sid, source: 'codex', cwd, ts: sm.timestamp, summary: (firstUser?.payload?.message || '').slice(0, 80), file: f, size: fs.statSync(f).size });
    }
    out.sort((a, b) => (b.ts || '').localeCompare(a.ts || ''));
    return out.slice(0, limit || 50);
  },
};

// ---------- claude 适配器 ----------
const claudeAdapter = {
  source: 'claude',
  find(id, project) {
    const tryDirs = project ? [path.join(CLAUDE_PROJECTS, encodeProject(project)), CLAUDE_PROJECTS] : [CLAUDE_PROJECTS];
    for (const d of tryDirs) {
      if (!fs.existsSync(d)) continue;
      const direct = path.join(d, id + '.jsonl');
      if (fs.existsSync(direct)) return direct;
      for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
        if (ent.isDirectory()) { const f = path.join(d, ent.name, id + '.jsonl'); if (fs.existsSync(f)) return f; }
      }
    }
    return null;
  },
  parse: parseClaude,
  currentSession(env) {
    const id = env.CLAUDE_CODE_SESSION_ID;
    return id ? { source: 'claude', id, note: 'from CLAUDE_CODE_SESSION_ID env' } : null;
  },
  list(project, limit) {
    const dirs = project && fs.existsSync(path.join(CLAUDE_PROJECTS, encodeProject(project)))
      ? [path.join(CLAUDE_PROJECTS, encodeProject(project))]
      : (fs.existsSync(CLAUDE_PROJECTS) ? fs.readdirSync(CLAUDE_PROJECTS, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => path.join(CLAUDE_PROJECTS, d.name)) : []);
    const out = [];
    for (const d of dirs) {
      for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
        if (!ent.isFile() || !ent.name.endsWith('.jsonl')) continue;
        const f = path.join(d, ent.name);
        const st = fs.statSync(f);
        const firstUser = readJsonlUntil(f, 60, r => (r.type === 'user' && !r.isSidechain) ? r : null);
        let summary = '', cwd = null;
        if (firstUser) {
          const c = firstUser.message?.content;
          summary = (Array.isArray(c) ? (c.find(x => x.type === 'text') || {}).text : c) || '';
          cwd = firstUser.cwd;
        }
        out.push({ id: path.basename(f, '.jsonl'), source: 'claude', cwd, ts: firstUser?.timestamp || st.mtime.toISOString(), summary: String(summary).slice(0, 80), file: f, size: st.size });
      }
    }
    out.sort((a, b) => (b.ts || '').localeCompare(a.ts || ''));
    return out.slice(0, limit || 50);
  },
};

// ---------- 适配器注册表 ---------- 结构性重构
// 加新工具(opencode/pi 等) = 在此 push 一个 adapter 对象 { source, find, parse, currentSession, list }，主干零改动。
const adapters = [
  codexAdapter,
  claudeAdapter,
  // adapter: opencode  (会话格式待探明后实现)
  // adapter: pi        (同上)
];
const adapterBySource = (source) => adapters.find(a => a.source === source);

// ---------- 渲染 ----------
function briefArgs(name, args) {
  if (!args) return '';
  if (['shell', 'exec_command', 'Bash'].includes(name)) return args.command || args.cmd || JSON.stringify(args).slice(0, 120);
  if (['Edit', 'Write', 'apply_patch', 'update_plan'].includes(name)) return args.file_path || args.path || '';
  return JSON.stringify(args).slice(0, 120);
}
function renderMsgBlock(m) {
  const tag = m.role === 'tool' ? `tool:${m.name}` : m.role;
  const lines = [`### [${m.ts}] ${tag}`];
  if (m.role === 'tool') {
    lines.push(`**${m.name}** ${briefArgs(m.name, m.args)}`);
    if (m.isError) lines.push(`> ERROR: ${String(m.result || '').slice(0, 1500)}`);
  } else {
    lines.push(m.text || '');
  }
  return lines.join('\n');
}
function render({ meta, msgs, files }, since, maxChars) { // P1-1: 体积上限 + 截断
  const limit = maxChars || MAX_OUTPUT_CHARS;
  const L = [];
  let len = 0;
  const push = (s) => { L.push(s); len += s.length + 1; return len <= limit; };
  push(`# Session ${meta.sessionId || '?'}  (source=${meta.source})`);
  if (meta.cwd) push(`- cwd: ${meta.cwd}`);
  if (meta.git) push(`- git: ${JSON.stringify(meta.git)}`);
  if (meta.tsRange[0]) push(`- time: ${meta.tsRange[0]} → ${meta.tsRange[1]}`);
  if (since) push(`- **incremental since: ${since}** (只含此时间之后)`);
  push(`- messages: ${msgs.length}, files changed: ${files.length}`);
  push('');
  let shown = 0, truncated = false;
  if (msgs.length) {
    push('## Messages');
    for (const m of msgs) {
      const block = renderMsgBlock(m);
      if (len + block.length + 1 > limit) { truncated = true; break; }
      push(block);
      shown++;
    }
  } else {
    push('_(无新增消息)_');
  }
  if (truncated) {
    push(`\n…[truncated: 共 ${msgs.length} 条消息，已显示前 ${shown} 条；可用 since 增量或缩小范围，或加大 max_chars]`);
  } else if (files.length) {
    push('## Files Changed');
    for (const f of files) {
      const body = f.diff ? ('```diff\n' + f.diff + '\n```') : (f.content != null ? ('```\n' + String(f.content).slice(0, 4000) + '\n```') : '');
      const block = `### ${f.path} (${f.type})\n${body}`;
      if (len + block.length + 1 > limit) { push(`\n…[files 段已截断，共 ${files.length} 个]`); break; }
      push(block);
    }
  }
  return L.join('\n');
}

// ---------- 工具 ----------
function tool_list_sessions({ source, project, limit }) {
  limit = limit || 20;
  let out = [];
  for (const a of adapters) {
    if (source && a.source !== source) continue;
    try { out = out.concat(a.list(project, limit)); } catch (e) { lastError = `list ${a.source} fail: ${e.message}`; }
  }
  out.sort((a, b) => (b.ts || '').localeCompare(a.ts || ''));
  return out.slice(0, limit).map(o => ({ id: o.id, source: o.source, cwd: o.cwd, ts: o.ts, summary: (o.summary || '').replace(/\n/g, ' ').slice(0, 80), sizeK: Math.round((o.size || 0) / 1024) }));
}
function tool_read_session({ id, source, since, max_chars }) {
  let adapter = source ? adapterBySource(source) : null, file = null;
  if (!adapter) { // 自动探测: 按注册表顺序找首个命中的文件
    for (const a of adapters) { const f = a.find(id); if (f) { adapter = a; file = f; break; } }
  } else {
    file = adapter.find(id);
  }
  if (!adapter || !file) return { error: 'session not found: ' + id };
  const parsed = adapter.parse(file);
  parsed.meta.source = adapter.source;
  let msgs = parsed.msgs, files = parsed.files;
  if (since) {
    msgs = msgs.filter(m => m.ts && m.ts > since);
    files = files.filter(f => f.ts && f.ts > since);
  }
  const cur = process.env.CLAUDE_CODE_SESSION_ID;
  const lastTs = msgs.length ? msgs[msgs.length - 1].ts : null;
  if (cur && parsed.meta.sessionId && lastTs) {
    const wm = loadWM(); wm[`${cur}:${parsed.meta.sessionId}`] = lastTs; saveWM(wm);
  }
  const text = render({ meta: parsed.meta, msgs, files }, since, max_chars);
  return { content: [{ type: 'text', text }], session_id: parsed.meta.sessionId, source: adapter.source, returned: msgs.length, last_ts: lastTs };
}
function tool_current_session(args = {}) { // 探测式: 遍历适配器，返回首个命中
  for (const a of adapters) {
    try {
      const r = a.currentSession(process.env, args._meta);
      if (r) return r;
    } catch (e) { lastError = `currentSession ${a.source} fail: ${e.message}`; }
  }
  return { source: 'unknown', id: null, note: '未识别调用方会话(Claude 环境变量 / Codex turn metadata 均未命中)，请用 list_sessions 指认' };
}

// ---------- MCP 协议 ----------
const tools = [
  { name: 'list_sessions', description: '列出 codex/claude 会话(id+摘要+时间+项目)，供指认要继承的会话', inputSchema: { type: 'object', properties: { source: { enum: ['codex', 'claude'] }, project: { type: 'string', description: '按项目 cwd 过滤' }, limit: { type: 'number' } } } },
  { name: 'read_session', description: '读取指定会话内容；since=ISO timestamp 则只返回该时间之后的消息(增量)；max_chars 控制输出上限(默认60000)', inputSchema: { type: 'object', properties: { id: { type: 'string' }, source: { enum: ['codex', 'claude'] }, since: { type: 'string', description: 'ISO timestamp，增量起点' }, max_chars: { type: 'number', description: '输出字符上限' } }, required: ['id'] } },
  { name: 'current_session', description: '返回当前调用方会话ID(ClaudeCode 读环境变量; Codex 读 turn metadata)', inputSchema: { type: 'object', properties: {} } },
];
async function handle(req) {
  const { id, method, params } = req;
  if (method === 'initialize') return { id, result: { protocolVersion: (params && params.protocolVersion) || '2025-06-18', capabilities: { tools: {} }, serverInfo: { name: 'session-bridge', version: '0.2.0' } } };
  if (method === 'notifications/initialized') return null;
  if (method === 'tools/list') return { id, result: { tools } };
  if (method === 'tools/call') {
    const name = params.name, args = params.arguments || {};
    try {
      let result;
      if (name === 'list_sessions') result = tool_list_sessions(args);
      else if (name === 'read_session') result = tool_read_session(args);
      else if (name === 'current_session') result = tool_current_session({ ...args, _meta: params._meta });
      else return { id, error: { code: -32601, message: 'unknown tool ' + name } };
      if (name === 'read_session' && result.content) return { id, result };
      return { id, result: { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] } };
    } catch (e) {
      return { id, error: { code: -32603, message: String(e && e.stack || e) } };
    }
  }
  return { id, error: { code: -32601, message: 'unknown method ' + method } };
}

dbg('START', `pid=${process.pid} exec=${process.execPath} argv=${JSON.stringify(process.argv)}`);
const rl = createInterface({ input: process.stdin, terminal: false });
rl.on('line', (line) => {
  dbg('RECV', line);
  if (!line.trim()) return;
  let req; try { req = JSON.parse(line); } catch { return; }
  const res = handle(req);
  if (res && res.then) res.then(r => { if (r) { dbg('SENT', JSON.stringify(r)); process.stdout.write(JSON.stringify({ jsonrpc: '2.0', ...r }) + '\n'); } });
  else if (res) { dbg('SENT', JSON.stringify(res)); process.stdout.write(JSON.stringify({ jsonrpc: '2.0', ...res }) + '\n'); }
});

// 命令行测试入口
if (process.argv[2]) {
  const cmd = process.argv[2];
  if (cmd === '--list') console.log(JSON.stringify(tool_list_sessions({ source: process.argv[3] && process.argv[3].startsWith('--') ? undefined : process.argv[3], project: process.env.PWD, limit: 10 }), null, 2));
  else if (cmd === '--read') { const r = tool_read_session({ id: process.argv[3], source: process.argv[4], since: process.argv[5] }); console.log(r.content ? r.content[0].text : JSON.stringify(r)); }
  else if (cmd === '--current') console.log(JSON.stringify(tool_current_session()));
}
