import React, { useState } from 'react';
import { Project, ScriptLine, ScriptFormat } from '../types';
import { genScript, mockScript, genFormatScript, FORMAT_FIELDS } from '../services/geminiService';
import { Sparkles, RefreshCw, Clock, Eye, Mic, FileText } from 'lucide-react';

const DURATIONS = ['30秒', '60秒', '90秒', '3分钟'];

const TYPE_CONFIG: Record<ScriptLine['type'], { label: string; color: string; icon: string }> = {
  hook:        { label: 'HOOK',  color: 'bg-orange-500/20 border-orange-500/40 text-orange-300',   icon: '🎣' },
  arrival:     { label: '到店',  color: 'bg-sky-500/20 border-sky-500/40 text-sky-300',            icon: '📍' },
  environment: { label: '环境',  color: 'bg-teal-500/20 border-teal-500/40 text-teal-300',         icon: '🏪' },
  product:     { label: '产品',  color: 'bg-violet-500/20 border-violet-500/40 text-violet-300',   icon: '⭐' },
  price:       { label: '价格',  color: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300',   icon: '💰' },
  verdict:     { label: '总结',  color: 'bg-pink-500/20 border-pink-500/40 text-pink-300',         icon: '📊' },
  cta:         { label: 'CTA',   color: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',icon: '📣' },
};

const FORMAT_META: { id: ScriptFormat; label: string; tag: string; desc: string; color: string }[] = [
  { id: 'explore', label: '探店测评',   tag: '到店实拍 → 种草/测评', desc: '探店博主视角，有个人观点，适合真人出镜', color: 'violet' },
  { id: 'cloud',   label: '② 云剪型',  tag: '素材包 → 批量分发',    desc: '商家提供素材，达人套模板，低成本矩阵铺量', color: 'indigo' },
  { id: 'qa',      label: '④ 痛点问答', tag: '搜索流量 → 决策转化',  desc: '瞄准用户真实疑虑，字幕驱动，承接主动搜索', color: 'amber' },
  { id: 'bts',     label: '⑤ 幕后制作', tag: '过程即内容 → 品牌信任', desc: '展示生产流程，印刷/定制类视觉天然适合',  color: 'emerald' },
];

const COLOR_MAP: Record<string, { tab: string; border: string; text: string; btn: string }> = {
  violet:  { tab: 'bg-violet-600 text-white',  border: 'border-violet-500', text: 'text-violet-400',  btn: 'bg-violet-600 hover:bg-violet-500 shadow-violet-900/40' },
  indigo:  { tab: 'bg-indigo-600 text-white',  border: 'border-indigo-500', text: 'text-indigo-400',  btn: 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-900/40' },
  amber:   { tab: 'bg-amber-600 text-white',   border: 'border-amber-500',  text: 'text-amber-400',   btn: 'bg-amber-600 hover:bg-amber-500 shadow-amber-900/40' },
  emerald: { tab: 'bg-emerald-600 text-white', border: 'border-emerald-500',text: 'text-emerald-400', btn: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/40' },
};

interface Props { project: Project; onChange: (p: Partial<Project>) => void; }

export default function ScriptPanel({ project, onChange }: Props) {
  const [loading,    setLoading]    = useState(false);
  const [duration,   setDuration]   = useState('60秒');
  const [editIdx,    setEditIdx]    = useState<number | null>(null);
  const [editCopy,   setEditCopy]   = useState('');
  const [editVisual, setEditVisual] = useState('');

  const fmt     = (project.scriptFormat ?? 'explore') as ScriptFormat;
  const fmtMeta = FORMAT_META.find(f => f.id === fmt)!;
  const colors  = COLOR_MAP[fmtMeta.color];
  const inputs  = project.formatInputs ?? {};

  function setFmt(f: ScriptFormat) { onChange({ scriptFormat: f }); }
  function setInput(k: string, v: string) { onChange({ formatInputs: { ...inputs, [k]: v } }); }

  // ── Explore ────────────────────────────────────────────────────────────────
  async function handleGenExplore() {
    if (!project.topic) return;
    setLoading(true);
    try {
      const script = await genScript(project.topic, project.shopInfo, project.platform, duration, project.brandVoice);
      onChange({ script, rawScript: undefined, status: 'scripting' });
    } catch {
      onChange({ script: mockScript(project.topic, project.shopInfo), rawScript: undefined, status: 'scripting' });
    } finally { setLoading(false); }
  }

  function startEdit(idx: number) {
    const line = project.script!.lines[idx];
    setEditIdx(idx); setEditCopy(line.copy); setEditVisual(line.visual);
  }
  function saveEdit() {
    if (editIdx === null || !project.script) return;
    const lines = [...project.script.lines];
    lines[editIdx] = { ...lines[editIdx], copy: editCopy, visual: editVisual };
    onChange({ script: { ...project.script, lines } });
    setEditIdx(null);
  }

  // ── Brand formats ──────────────────────────────────────────────────────────
  async function handleGenFormat() {
    if (fmt === 'explore') return;
    setLoading(true);
    try {
      const raw = await genFormatScript(fmt as 'cloud'|'qa'|'bts', inputs, project.shopInfo);
      onChange({ rawScript: raw, script: undefined, status: 'scripting' });
    } finally { setLoading(false); }
  }

  return (
    <div className="space-y-5">

      {/* Format selector */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">视频类型</div>
        <div className="grid grid-cols-2 gap-2">
          {FORMAT_META.map(f => (
            <button key={f.id} onClick={() => setFmt(f.id)}
              className={`text-left px-3 py-2.5 rounded-xl border transition-all ${fmt === f.id ? `${COLOR_MAP[f.color].tab} border-transparent shadow-lg` : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}`}>
              <div className="text-xs font-semibold">{f.label}</div>
              <div className={`text-[10px] mt-0.5 ${fmt === f.id ? 'text-white/70' : 'text-slate-600'}`}>{f.tag}</div>
            </button>
          ))}
        </div>
        <div className={`text-xs px-3 py-2 rounded-lg bg-slate-800/60 border ${colors.border}/30 ${colors.text}`}>
          {fmtMeta.desc}
        </div>
      </div>

      {/* ── EXPLORE ── */}
      {fmt === 'explore' && (
        <>
          <div className="flex flex-wrap items-center gap-3">
            {project.topic && (
              <div className="flex-1 min-w-0 text-xs text-slate-400 truncate bg-slate-800 border border-slate-700 rounded-lg px-3 py-2">
                📌 {project.topic.title}
              </div>
            )}
            <div className="flex gap-2">
              {DURATIONS.map(d => (
                <button key={d} onClick={() => setDuration(d)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${duration === d ? 'bg-violet-600 border-violet-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                  {d}
                </button>
              ))}
            </div>
            <button onClick={handleGenExplore} disabled={loading || !project.topic}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 rounded-lg text-white text-sm font-semibold transition-all shadow-lg shadow-violet-900/40">
              {loading ? <><RefreshCw size={13} className="animate-spin" />生成中</> : <><Sparkles size={13} />AI 写脚本</>}
            </button>
          </div>

          {project.script ? (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Clock size={12} /> 预计 {project.script.duration} · {project.script.lines.length} 个分镜
                </div>
                <button onClick={handleGenExplore} disabled={loading} className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">
                  <RefreshCw size={11} /> 重新生成
                </button>
              </div>

              <div className="space-y-2">
                {project.script.lines.map((line, idx) => {
                  const cfg = TYPE_CONFIG[line.type] ?? TYPE_CONFIG.cta;
                  const isEditing = editIdx === idx;
                  return (
                    <div key={idx} className={`rounded-xl border p-4 transition-all ${cfg.color} ${isEditing ? 'ring-1 ring-violet-500' : ''}`}>
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 text-center w-14">
                          <div className="text-base mb-0.5">{cfg.icon}</div>
                          <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${cfg.color}`}>{cfg.label}</div>
                          <div className="text-[10px] text-slate-500 mt-1 font-mono">{line.ts}</div>
                        </div>
                        <div className="flex-1 min-w-0">
                          {isEditing ? (
                            <div className="space-y-2">
                              <div>
                                <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-1"><Mic size={9} /> 口播</div>
                                <textarea className="w-full bg-slate-900/60 border border-slate-600 rounded-lg p-2 text-slate-100 text-sm resize-none focus:outline-none focus:border-violet-500" rows={3} value={editCopy} onChange={e => setEditCopy(e.target.value)} />
                              </div>
                              <div>
                                <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-1"><Eye size={9} /> 画面</div>
                                <textarea className="w-full bg-slate-900/60 border border-slate-600 rounded-lg p-2 text-slate-400 text-sm resize-none focus:outline-none focus:border-violet-500" rows={2} value={editVisual} onChange={e => setEditVisual(e.target.value)} />
                              </div>
                              <div className="flex gap-2">
                                <button onClick={saveEdit} className="px-3 py-1 bg-violet-600 hover:bg-violet-500 rounded-lg text-white text-xs font-medium">保存</button>
                                <button onClick={() => setEditIdx(null)} className="px-3 py-1 bg-slate-700 rounded-lg text-slate-300 text-xs">取消</button>
                              </div>
                            </div>
                          ) : (
                            <div className="cursor-pointer group" onClick={() => startEdit(idx)} title="点击编辑">
                              <div className="text-sm leading-relaxed mb-2">
                                <span className="flex items-center gap-1 text-[10px] text-slate-500 mb-0.5"><Mic size={9} /> 口播</span>
                                {line.copy}
                              </div>
                              <div className="text-xs text-slate-500">
                                <span className="flex items-center gap-1 mb-0.5"><Eye size={9} /> 画面</span>
                                {line.visual}
                              </div>
                              <div className="text-[10px] text-slate-600 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">点击编辑 ✏️</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button onClick={() => onChange({ step: 'shooting' })}
                className="w-full py-3 bg-violet-600 hover:bg-violet-500 rounded-xl text-white font-semibold text-sm transition-all shadow-lg shadow-violet-900/40">
                脚本确认，去拍摄指南 →
              </button>
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-700 p-10 text-center">
              <Sparkles size={32} className="mx-auto text-slate-600 mb-3" />
              <p className="text-slate-500 text-sm">
                {project.topic ? '点击 AI 写脚本，生成探店分镜文案' : '请先在「选题」步骤选择一个方向'}
              </p>
            </div>
          )}
        </>
      )}

      {/* ── BRAND formats ── */}
      {fmt !== 'explore' && (
        <>
          <div className="space-y-3">
            {FORMAT_FIELDS[fmt as 'cloud'|'qa'|'bts'].map(field => (
              <div key={field.key}>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">{field.label}</label>
                {field.multiline ? (
                  <textarea rows={3} value={inputs[field.key] ?? ''}
                    onChange={e => setInput(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors resize-none" />
                ) : (
                  <input type="text" value={inputs[field.key] ?? ''}
                    onChange={e => setInput(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors" />
                )}
              </div>
            ))}
          </div>

          <button onClick={handleGenFormat} disabled={loading}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold text-sm transition-all shadow-lg ${colors.btn} disabled:opacity-40`}>
            {loading ? <><RefreshCw size={13} className="animate-spin" />生成中…</> : <><Sparkles size={13} />AI 生成脚本</>}
          </button>

          {project.rawScript && (
            <div className="rounded-xl border border-slate-700 bg-slate-800/60 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700">
                <FileText size={13} className={colors.text} />
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{fmtMeta.label} 脚本</span>
                <button onClick={handleGenFormat} disabled={loading} className={`ml-auto text-xs ${colors.text} flex items-center gap-1`}>
                  <RefreshCw size={10} /> 重新生成
                </button>
              </div>
              <div className="p-4 leading-relaxed whitespace-pre-wrap font-mono text-xs">
                {project.rawScript.split('\n').map((line, i) => {
                  const isHeader = line.startsWith('【');
                  return (
                    <div key={i} className={isHeader ? `${colors.text} font-semibold mt-3 mb-1` : line === '' ? 'h-1' : 'text-slate-300'}>
                      {line || null}
                    </div>
                  );
                })}
              </div>
              <div className="px-4 pb-4">
                <button onClick={() => navigator.clipboard.writeText(project.rawScript!)}
                  className="w-full py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 text-xs font-medium transition-colors">
                  复制全文
                </button>
              </div>
            </div>
          )}

          {!project.rawScript && (
            <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center">
              <Sparkles size={28} className="mx-auto text-slate-600 mb-2" />
              <p className="text-slate-500 text-sm">填写上方信息，点击 AI 生成脚本</p>
            </div>
          )}

          {project.rawScript && (
            <button onClick={() => onChange({ step: 'shooting' })}
              className={`w-full py-3 rounded-xl text-white font-semibold text-sm transition-all shadow-lg ${colors.btn}`}>
              脚本确认，去拍摄指南 →
            </button>
          )}
        </>
      )}
    </div>
  );
}
