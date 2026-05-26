import React, { useState } from 'react';
import { Project } from '../types';
import { genShootingGuide, mockShootingGuide } from '../services/geminiService';
import { Sparkles, RefreshCw, Camera, Lightbulb, Scissors, Package } from 'lucide-react';

interface Props { project: Project; onChange: (p: Partial<Project>) => void; }

export default function ShootingPanel({ project, onChange }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleGen() {
    if (!project.script) return;
    setLoading(true);
    try {
      const g = await genShootingGuide(project.script, project.shopInfo);
      onChange({ shootingGuide: g, checkedGear: [], checkedShots: [] });
    } catch {
      onChange({ shootingGuide: mockShootingGuide(project.shopInfo), checkedGear: [], checkedShots: [] });
    } finally { setLoading(false); }
  }

  function toggleGear(item: string) {
    const curr = project.checkedGear ?? [];
    onChange({ checkedGear: curr.includes(item) ? curr.filter(g => g !== item) : [...curr, item] });
  }

  function toggleShot(order: number) {
    const curr = project.checkedShots ?? [];
    onChange({ checkedShots: curr.includes(order) ? curr.filter(n => n !== order) : [...curr, order] });
  }

  const guide = project.shootingGuide;
  const gearDone = (project.checkedGear ?? []).length;
  const shotsDone = (project.checkedShots ?? []).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={handleGen} disabled={loading || !project.script}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 rounded-lg text-white text-sm font-semibold transition-all shadow-lg shadow-violet-900/40">
          {loading ? <><RefreshCw size={13} className="animate-spin" />生成中</> : <><Sparkles size={13} />{guide ? '重新生成' : 'AI 生成拍摄指南'}</>}
        </button>
        {!project.script && <span className="text-xs text-slate-500">请先完成脚本步骤</span>}
        {guide && (
          <div className="ml-auto flex gap-4 text-xs text-slate-400">
            <span className={gearDone === guide.gear.length ? 'text-emerald-400' : ''}>器材 {gearDone}/{guide.gear.length}</span>
            <span className={shotsDone === guide.shots.length ? 'text-emerald-400' : ''}>分镜 {shotsDone}/{guide.shots.length}</span>
          </div>
        )}
      </div>

      {guide ? (
        <div className="space-y-5">
          {/* Gear */}
          <section>
            <h3 className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              <Package size={13} className="text-orange-400" /> 器材准备
              {gearDone === guide.gear.length && <span className="text-emerald-400 font-medium">✓ 全部就绪</span>}
            </h3>
            <div className="space-y-2">
              {guide.gear.map(item => {
                const checked = (project.checkedGear ?? []).includes(item);
                return (
                  <label key={item} className="flex items-start gap-3 cursor-pointer group" onClick={() => toggleGear(item)}>
                    <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${checked ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600 group-hover:border-slate-400'}`}>
                      {checked && <span className="text-white text-xs">✓</span>}
                    </div>
                    <span className={`text-sm transition-colors ${checked ? 'text-slate-500 line-through' : 'text-slate-300'}`}>{item}</span>
                  </label>
                );
              })}
            </div>
          </section>

          {/* Shots */}
          <section>
            <h3 className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              <Camera size={13} className="text-sky-400" /> 分镜清单
              {shotsDone === guide.shots.length && <span className="text-emerald-400 font-medium">✓ 全部拍完</span>}
            </h3>
            <div className="space-y-3">
              {guide.shots.map(shot => {
                const done = (project.checkedShots ?? []).includes(shot.order);
                return (
                  <div key={shot.order} onClick={() => toggleShot(shot.order)}
                    className={`rounded-xl border p-4 cursor-pointer transition-all group ${done ? 'border-emerald-800/50 bg-emerald-950/20' : 'border-slate-700 bg-slate-800/60 hover:border-slate-500'}`}>
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-all ${done ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-600 text-slate-400'}`}>
                        {done ? '✓' : shot.order}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-slate-400 bg-slate-700 px-2 py-0.5 rounded font-mono">{shot.ref}</span>
                          <span className="text-xs text-sky-400">📐 {shot.angle}</span>
                          <span className="text-xs text-slate-500">⏱ {shot.duration}</span>
                        </div>
                        <p className={`text-sm transition-colors ${done ? 'text-slate-500' : 'text-slate-300'}`}>{shot.notes}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Lighting */}
          <section>
            <h3 className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              <Lightbulb size={13} className="text-yellow-400" /> 打光建议
            </h3>
            <div className="space-y-2">
              {guide.lighting.map((tip, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-slate-400">
                  <span className="text-yellow-500 mt-0.5 flex-shrink-0">•</span>{tip}
                </div>
              ))}
            </div>
          </section>

          {/* Editing */}
          <section>
            <h3 className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              <Scissors size={13} className="text-pink-400" /> 剪辑建议
            </h3>
            <div className="space-y-2">
              {guide.editing.map((tip, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-slate-400">
                  <span className="text-pink-500 mt-0.5 flex-shrink-0">•</span>{tip}
                </div>
              ))}
            </div>
          </section>

          <button onClick={() => onChange({ status: 'editing', step: 'publish' })}
            className="w-full py-3 bg-violet-600 hover:bg-violet-500 rounded-xl text-white font-semibold text-sm transition-all shadow-lg shadow-violet-900/40">
            拍摄完成，去配置发布 →
          </button>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-700 p-10 text-center">
          <Camera size={32} className="mx-auto text-slate-600 mb-3" />
          <p className="text-slate-500 text-sm">{project.script ? '点击 AI 生成探店拍摄指南' : '请先完成脚本步骤'}</p>
        </div>
      )}
    </div>
  );
}
