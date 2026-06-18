#!/usr/bin/env node
// 会话读取 MCP server: codex ↔ Claude Code 双向增量上下文同步
// 工具: list_sessions / read_session(id, source?, since?) / current_session
// 零依赖 Node ESM。增量锚点用 ISO timestamp(codex 无稳定uuid)。
import { createInterface } from 'node:readline';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const HOME = os.homedir();
const CLAUDE_PROJECTS = path.join(HOME, '.claude', 'projects');
const CODEX_SESSIONS = path.join(HOME, '.codex', 'sessions');
const WATERMARK = path.join(HOME, '.codex', 'handoff', 'watermark.json');

const encodeProject = (cwd) => cwd.replace(/\//g, '-');
function readJsonl(file) {
  if (!fs.existsSync(file)) return [];
  const out = [];
  for (const l of fs.readFileSync(file, 'utf8').split('\n')) {
    if (!l.trim()) continue;
    try { out.push(JSON.parse(l)); } catch {}
  }
  return out;
}
const loadWM = () => { try { return JSON.parse(fs.readFileSync(WATERMARK, 'utf8')); } catch { return {}; } };
function saveWM(wm) { try { fs.mkdirSync(path.dirname(WATERMARK), { recursive: true }); fs.writeFileSync(WATERMARK, JSON.stringify(wm, null, 2)); } catch {} }

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

// ---------- 定位/list ----------
function findFile(dir, re) {
  if (!fs.existsSync(dir)) return null;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) { const r = findFile(p, re); if (r) return r; }
    else if (re.test(p)) return p;
  }
  return null;
}
const findCodexFile = (id) => findFile(CODEX_SESSIONS, new RegExp(id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
function findClaudeFile(id, project) {
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
function listCodexSessions(project, limit) {
  const out = [];
  for (const f of listFilesDeep(CODEX_SESSIONS, '.jsonl')) {
    const rows = readJsonl(f);
    const sm = rows.find(r => r.type === 'session_meta');
    if (!sm) continue;
    const cwd = sm.payload?.cwd;
    if (project && cwd !== project) continue;
    const sid = sm.payload?.id || path.basename(f).match(/([0-9a-f-]{36})/)?.[1];
    const firstUser = rows.find(r => r.type === 'event_msg' && r.payload?.type === 'user_message');
    out.push({ id: sid, source: 'codex', cwd, ts: sm.timestamp, summary: (firstUser?.payload?.message || '').slice(0, 80), file: f, size: fs.statSync(f).size });
  }
  out.sort((a, b) => (b.ts || '').localeCompare(a.ts || ''));
  return out.slice(0, limit || 50);
}
function listClaudeSessions(project, limit) {
  const dirs = project && fs.existsSync(path.join(CLAUDE_PROJECTS, encodeProject(project)))
    ? [path.join(CLAUDE_PROJECTS, encodeProject(project))]
    : (fs.existsSync(CLAUDE_PROJECTS) ? fs.readdirSync(CLAUDE_PROJECTS, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => path.join(CLAUDE_PROJECTS, d.name)) : []);
  const out = [];
  for (const d of dirs) {
    for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
      if (!ent.isFile() || !ent.name.endsWith('.jsonl')) continue;
      const f = path.join(d, ent.name);
      const rows = readJsonl(f);
      const first = rows.find(r => r.timestamp);
      const firstUser = rows.find(r => r.type === 'user');
      let summary = '';
      if (firstUser) {
        const c = firstUser.message?.content;
        summary = (Array.isArray(c) ? (c.find(x => x.type === 'text') || {}).text : c) || '';
      }
      out.push({ id: path.basename(f, '.jsonl'), source: 'claude', cwd: firstUser?.cwd, ts: first?.timestamp, summary: String(summary).slice(0, 80), file: f, size: fs.statSync(f).size });
    }
  }
  out.sort((a, b) => (b.ts || '').localeCompare(a.ts || ''));
  return out.slice(0, limit || 50);
}

// ---------- 渲染 ----------
function briefArgs(name, args) {
  if (!args) return '';
  if (['shell', 'exec_command', 'Bash'].includes(name)) return args.command || args.cmd || JSON.stringify(args).slice(0, 120);
  if (['Edit', 'Write', 'apply_patch', 'update_plan'].includes(name)) return args.file_path || args.path || '';
  return JSON.stringify(args).slice(0, 120);
}
function render({ meta, msgs, files }, since) {
  const L = [];
  L.push(`# Session ${meta.sessionId || '?'}  (source=${meta.source})`);
  if (meta.cwd) L.push(`- cwd: ${meta.cwd}`);
  if (meta.git) L.push(`- git: ${JSON.stringify(meta.git)}`);
  if (meta.tsRange[0]) L.push(`- time: ${meta.tsRange[0]} → ${meta.tsRange[1]}`);
  if (since) L.push(`- **incremental since: ${since}** (只含此时间之后)`);
  L.push(`- messages: ${msgs.length}, files changed: ${files.length}`);
  L.push('');
  if (msgs.length) {
    L.push('## Messages');
    for (const m of msgs) {
      const tag = m.role === 'tool' ? `tool:${m.name}` : m.role;
      L.push(`### [${m.ts}] ${tag}`);
      if (m.role === 'tool') {
        L.push(`**${m.name}** ${briefArgs(m.name, m.args)}`);
        if (m.isError) L.push(`> ERROR: ${String(m.result || '').slice(0, 1500)}`);
      } else {
        L.push(m.text || '');
      }
      L.push('');
    }
  } else {
    L.push('_(无新增消息)_');
  }
  if (files.length) {
    L.push('## Files Changed');
    for (const f of files) {
      L.push(`### ${f.path} (${f.type})`);
      if (f.diff) L.push('```diff\n' + f.diff + '\n```');
      else if (f.content != null) L.push('```\n' + String(f.content).slice(0, 4000) + '\n```');
    }
  }
  return L.join('\n');
}

// ---------- 工具 ----------
function tool_list_sessions({ source, project, limit }) {
  limit = limit || 20;
  let out = [];
  if (!source || source === 'codex') out = out.concat(listCodexSessions(project, limit));
  if (!source || source === 'claude') out = out.concat(listClaudeSessions(project, limit));
  out.sort((a, b) => (b.ts || '').localeCompare(a.ts || ''));
  return out.slice(0, limit).map(o => ({ id: o.id, source: o.source, cwd: o.cwd, ts: o.ts, summary: (o.summary || '').replace(/\n/g, ' ').slice(0, 80), sizeK: Math.round((o.size || 0) / 1024) }));
}
function tool_read_session({ id, source, since }) {
  let file = null, parsed = null;
  if (source === 'codex') { file = findCodexFile(id); parsed = file && parseCodex(file); }
  else if (source === 'claude') { file = findClaudeFile(id); parsed = file && parseClaude(file); }
  else {
    file = findClaudeFile(id); if (file) { source = 'claude'; parsed = parseClaude(file); }
    else { file = findCodexFile(id); if (file) { source = 'codex'; parsed = parseCodex(file); } }
  }
  if (!parsed) return { error: 'session not found: ' + id };
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
  const text = render({ meta: parsed.meta, msgs, files }, since);
  return { content: [{ type: 'text', text }], session_id: parsed.meta.sessionId, source, returned: msgs.length, last_ts: lastTs };
}
function tool_current_session(args = {}) {
  const id = process.env.CLAUDE_CODE_SESSION_ID;
  if (id) return { source: 'claude', id, note: 'from CLAUDE_CODE_SESSION_ID env' };
  const codexMeta = args._meta?.['x-codex-turn-metadata'];
  const codexId = codexMeta?.session_id || codexMeta?.thread_id;
  if (codexId) return { source: 'codex', id: codexId, note: 'from x-codex-turn-metadata' };
  return { source: 'unknown', id: null, note: '未收到 Claude 环境变量或 Codex turn metadata，请用 list_sessions 指认' };
}

// ---------- MCP 协议 ----------
const tools = [
  { name: 'list_sessions', description: '列出 codex/claude 会话(id+摘要+时间+项目)，供指认要继承的会话', inputSchema: { type: 'object', properties: { source: { enum: ['codex', 'claude'] }, project: { type: 'string', description: '按项目 cwd 过滤' }, limit: { type: 'number' } } } },
  { name: 'read_session', description: '读取指定会话内容；since=ISO timestamp 则只返回该时间之后的消息(增量)', inputSchema: { type: 'object', properties: { id: { type: 'string' }, source: { enum: ['codex', 'claude'] }, since: { type: 'string', description: 'ISO timestamp，增量起点' } }, required: ['id'] } },
  { name: 'current_session', description: '返回当前调用方会话ID(ClaudeCode 读环境变量; Codex 读 turn metadata)', inputSchema: { type: 'object', properties: {} } },
];
async function handle(req) {
  const { id, method, params } = req;
  if (method === 'initialize') return { id, result: { protocolVersion: (params && params.protocolVersion) || '2025-06-18', capabilities: { tools: {} }, serverInfo: { name: 'session-bridge', version: '0.1.0' } } };
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
try{fs.appendFileSync("/tmp/sb.log","\n[START] "+new Date().toISOString()+" pid="+process.pid+" exec="+process.execPath+" argv="+JSON.stringify(process.argv)+"\n");}catch(e){}
const rl = createInterface({ input: process.stdin, terminal: false });
rl.on('line', (line) => {
  try{fs.appendFileSync('/tmp/sb.log','[RECV] '+line.slice(0,300)+'\n');}catch(e){}
  if (!line.trim()) return;
  let req; try { req = JSON.parse(line); } catch { return; }
  const res = handle(req);
  if (res && res.then) res.then(r => { if (r){const __o={jsonrpc:'2.0',...r};try{fs.appendFileSync('/tmp/sb.log','[SENT] '+JSON.stringify(__o).slice(0,200)+'\n');}catch(e){}process.stdout.write(JSON.stringify(__o)+'\n');} });
  else if (res){const __o={jsonrpc:'2.0',...res};try{fs.appendFileSync('/tmp/sb.log','[SENT] '+JSON.stringify(__o).slice(0,200)+'\n');}catch(e){}process.stdout.write(JSON.stringify(__o)+'\n');}
});

// 命令行测试入口
if (process.argv[2]) {
  const cmd = process.argv[2];
  if (cmd === '--list') console.log(JSON.stringify(tool_list_sessions({ source: process.argv[3] && process.argv[3].startsWith('--') ? undefined : process.argv[3], project: process.env.PWD, limit: 10 }), null, 2));
  else if (cmd === '--read') { const r = tool_read_session({ id: process.argv[3], source: process.argv[4], since: process.argv[5] }); console.log(r.content ? r.content[0].text : JSON.stringify(r)); }
  else if (cmd === '--current') console.log(JSON.stringify(tool_current_session()));
}
