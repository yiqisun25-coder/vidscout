import React, { useState } from 'react';
import { Project } from '../types';
import { genPublishKit, mockPublishKit } from '../services/geminiService';
import { Sparkles, RefreshCw, Copy, Check, Clock, Image, Zap, Trophy } from 'lucide-react';

interface Props {
  project: Project;
  onChange: (p: Partial<Project>) => void;
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }
  return (
    <button
      onClick={copy}
      className={`flex-shrink-0 p-1 rounded transition-all ${copied ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
      title="复制"
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
    </button>
  );
}

export default function PublishPanel({ project, onChange }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleGen() {
    if (!project.topic) return;
    setLoading(true);
    try {
      const kit = await genPublishKit(project.topic, project.platform);
      onChange({ publishKit: kit });
    } catch {
      onChange({ publishKit: mockPublishKit(project.topic, project.platform) });
    } finally {
      setLoading(false);
    }
  }

  function updateTitle(v: string) {
    if (!project.publishKit) return;
    onChange({ publishKit: { ...project.publishKit, title: v } });
  }
  function updateCaption(v: string) {
    if (!project.publishKit) return;
    onChange({ publishKit: { ...project.publishKit, caption: v } });
  }
  function markPublished() {
    onChange({ status: 'published', published: true, publishDate: project.publishDate ?? new Date().toISOString().split('T')[0] });
  }

  const kit = project.publishKit;

  return (
    <div className="space-y-5">

      {/* Generate / re-generate */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleGen}
          disabled={loading || !project.topic}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 rounded-lg text-white text-sm font-semibold transition-all shadow-lg shadow-violet-900/40"
        >
          {loading
            ? <><RefreshCw size={13} className="animate-spin" />生成中</>
            : <><Sparkles size={13} />{kit ? '重新生成' : 'AI 生成发布配置'}</>}
        </button>
        {!project.topic && <span className="text-xs text-slate-500">请先完成选题步骤</span>}
      </div>

      {kit ? (
        <div className="space-y-4">

          {/* Title */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">发布标题</span>
              <CopyBtn text={kit.title} />
            </div>
            <input
              className="w-full bg-transparent text-slate-100 text-base font-semibold focus:outline-none"
              value={kit.title}
              onChange={e => updateTitle(e.target.value)}
            />
            <div className="text-xs text-slate-600 mt-1">{kit.title.length} 字</div>
          </div>

          {/* Caption */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">正文文案</span>
              <CopyBtn text={kit.caption} />
            </div>
            <textarea
              className="w-full bg-transparent text-slate-300 text-sm resize-none focus:outline-none leading-relaxed"
              rows={5}
              value={kit.caption}
              onChange={e => updateCaption(e.target.value)}
            />
          </div>

          {/* Hashtags */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">话题标签</span>
              <CopyBtn text={kit.hashtags.map(h => `#${h}`).join(' ')} />
            </div>
            <div className="flex flex-wrap gap-2">
              {kit.hashtags.map(tag => (
                <button
                  key={tag}
                  onClick={() => navigator.clipboard.writeText(`#${tag}`)}
                  className="px-3 py-1 bg-violet-950/60 border border-violet-800/50 rounded-full text-xs text-violet-300 hover:bg-violet-900/60 transition-colors"
                  title="点击复制"
                >
                  #{tag}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-600 mt-2">点击单个标签复制</p>
          </div>

          {/* Best time + Cover tip */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <Clock size={12} className="text-emerald-400" /> 最佳发布时段
              </div>
              <p className="text-sm text-emerald-300 font-medium">{kit.bestTime}</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <Image size={12} className="text-sky-400" /> 封面建议
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">{kit.coverTip}</p>
            </div>
          </div>

          {/* Platform tips */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              <Zap size={12} className="text-yellow-400" /> 运营建议
            </div>
            <div className="space-y-2">
              {kit.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-slate-400">
                  <span className="text-yellow-500 mt-0.5 flex-shrink-0">•</span> {tip}
                </div>
              ))}
            </div>
          </div>

          {/* Mark published */}
          {!project.published ? (
            <button
              onClick={markPublished}
              className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-900/40"
            >
              <Trophy size={16} /> 标记为已发布 🎉
            </button>
          ) : (
            <div className="w-full py-3 bg-emerald-950/40 border border-emerald-800/50 rounded-xl text-emerald-400 font-semibold text-sm text-center">
              ✅ 已发布 {project.publishDate && `· ${project.publishDate}`}
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-700 p-10 text-center">
          <Sparkles size={32} className="mx-auto text-slate-600 mb-3" />
          <p className="text-slate-500 text-sm">
            {project.topic ? '点击 AI 生成优化好的标题、文案、话题标签' : '请先完成选题步骤'}
          </p>
        </div>
      )}
    </div>
  );
}
