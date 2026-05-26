import React, { useState } from 'react';
import { Project, ScriptLine } from '../types';
import { genScript, mockScript } from '../services/geminiService';
import { Sparkles, RefreshCw, Clock, Eye, Mic } from 'lucide-react';

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

interface Props { project: Project; onChange: (p: Partial<Project>) => void; }

export default function ScriptPanel({ project, onChange }: Props) {
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState('60秒');
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editCopy, setEditCopy] = useState('');
  const [editVisual, setEditVisual] = useState('');

  async function handleGen() {
    if (!project.topic) return;
    setLoading(true);
    try {
      const script = await genScript(project.topic, project.shopInfo, project.platform, duration);
      onChange({ script, status: 'scripting' });
    } catch {
      onChange({ script: mockScript(project.topic, project.shopInfo), status: 'scripting' });
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="space-y-5">
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
        <button onClick={handleGen} disabled={loading || !project.topic}
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
            <button onClick={handleGen} disabled={loading} className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">
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
    </div>
  );
}
