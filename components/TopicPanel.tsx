import React, { useState } from 'react';
import { Project, TopicIdea } from '../types';
import { genTopics, mockTopics } from '../services/geminiService';
import { Sparkles, Check, Users, TrendingUp, RefreshCw, Zap, Store } from 'lucide-react';
import { SHOP_TYPE_EMOJI } from '../constants';

interface Props { project: Project; onChange: (p: Partial<Project>) => void; }

export default function TopicPanel({ project, onChange }: Props) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const shop = project.shopInfo;

  async function handleGen() {
    setErr('');
    setLoading(true);
    try {
      const topics = await genTopics(shop, project.platform, project.brandVoice);
      onChange({ topics, topic: undefined });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setErr(`AI 调用失败：${msg}`);
      onChange({ topics: mockTopics(shop), topic: undefined });
    } finally {
      setLoading(false);
    }
  }

  function selectTopic(t: TopicIdea) {
    onChange({ topic: t, status: 'scripting', step: 'schedule' });
  }

  return (
    <div className="space-y-5">

      {/* Shop info card */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{SHOP_TYPE_EMOJI[shop.type]}</span>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-slate-100">{shop.name}</div>
            <div className="text-xs text-slate-400 mt-0.5">
              {shop.type} · 人均 {shop.avgPrice}
              {shop.area && ` · ${shop.area}`}
            </div>
            <div className="text-xs text-slate-500 mt-1 line-clamp-1">{shop.highlights}</div>
          </div>
          <button
            onClick={handleGen}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 rounded-lg text-white text-xs font-semibold transition-all shadow-lg shadow-violet-900/40 whitespace-nowrap"
          >
            {loading ? <><RefreshCw size={12} className="animate-spin" />生成中</> : <><Sparkles size={12} />AI 生成选题</>}
          </button>
        </div>
        {err && <p className="text-red-400 text-xs mt-2">{err}</p>}
      </div>

      {/* Topic cards */}
      {project.topics && project.topics.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {project.topics.length} 个选题方案
            </span>
            <button onClick={handleGen} disabled={loading} className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">
              <RefreshCw size={11} /> 重新生成
            </button>
          </div>

          {project.topics.map(t => {
            const chosen = project.topic?.id === t.id;
            return (
              <div
                key={t.id}
                onClick={() => selectTopic(t)}
                className={`rounded-xl border p-4 cursor-pointer transition-all group ${
                  chosen ? 'border-violet-500 bg-violet-950/40 shadow-lg shadow-violet-900/20' : 'border-slate-700 bg-slate-800/60 hover:border-slate-500'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-100 text-sm leading-snug mb-1.5">{t.title}</div>
                    <div className="text-xs text-slate-400 italic mb-2">「{t.hook}」</div>
                    <div className="text-xs text-violet-400/80 mb-2">{t.angle}</div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1 text-slate-500"><Users size={10} />{t.audience}</span>
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold"><TrendingUp size={10} />{t.potential}</span>
                    </div>
                  </div>
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${chosen ? 'border-violet-500 bg-violet-500' : 'border-slate-600 group-hover:border-slate-400'}`}>
                    {chosen && <Check size={12} className="text-white" />}
                  </div>
                </div>
                {chosen && (
                  <div className="mt-3 pt-3 border-t border-violet-800/40 flex items-center gap-1.5 text-xs text-violet-400 font-medium">
                    <Zap size={11} /> 已选择 · 点击下一步排期
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-700 p-10 text-center">
          <Store size={32} className="mx-auto text-slate-600 mb-3" />
          <p className="text-slate-500 text-sm">点击「AI 生成选题」，生成 4 个探店切入角度</p>
        </div>
      )}
    </div>
  );
}
