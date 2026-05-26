import React, { useState } from 'react';
import { Project } from '../types';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

const QUICK_TIMES = ['07:00', '12:00', '18:00', '20:00', '21:30'];

interface Props {
  project: Project;
  onChange: (p: Partial<Project>) => void;
}

export default function SchedulePanel({ project, onChange }: Props) {
  const [shootDate, setShootDate] = useState(project.shootDate ?? '');
  const [publishDate, setPublishDate] = useState(project.publishDate ?? '');
  const [publishTime, setPublishTime] = useState(project.publishTime ?? '20:00');

  function save() {
    onChange({
      shootDate: shootDate || undefined,
      publishDate: publishDate || undefined,
      publishTime,
      step: 'script',
    });
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">

      {/* Selected topic recap */}
      {project.topic && (
        <div className="bg-violet-950/40 border border-violet-800/50 rounded-xl p-4">
          <div className="text-xs text-violet-400 font-semibold uppercase tracking-wider mb-1">已选选题</div>
          <div className="text-slate-100 text-sm font-medium">{project.topic.title}</div>
        </div>
      )}

      {/* Date pickers */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            <Calendar size={13} className="text-orange-400" /> 拍摄日期
          </label>
          <input
            type="date"
            min={today}
            value={shootDate}
            onChange={e => setShootDate(e.target.value)}
            className="w-full bg-transparent text-slate-100 text-sm focus:outline-none"
          />
          {shootDate && (
            <div className="mt-2 text-xs text-orange-400 font-medium">
              🎬 {new Date(shootDate + 'T00:00').toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' })}
            </div>
          )}
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            <Calendar size={13} className="text-violet-400" /> 发布日期
          </label>
          <input
            type="date"
            min={shootDate || today}
            value={publishDate}
            onChange={e => setPublishDate(e.target.value)}
            className="w-full bg-transparent text-slate-100 text-sm focus:outline-none"
          />
          {publishDate && (
            <div className="mt-2 text-xs text-violet-400 font-medium">
              🚀 {new Date(publishDate + 'T00:00').toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' })}
            </div>
          )}
        </div>
      </div>

      {/* Publish time */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          <Clock size={13} className="text-emerald-400" /> 发布时间
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {QUICK_TIMES.map(t => (
            <button
              key={t}
              onClick={() => setPublishTime(t)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all border ${
                publishTime === t
                  ? 'bg-emerald-600 border-emerald-500 text-white'
                  : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-500'
              }`}
            >
              {t}
            </button>
          ))}
          <input
            type="time"
            value={publishTime}
            onChange={e => setPublishTime(e.target.value)}
            className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1 text-sm text-slate-300 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <p className="text-xs text-slate-500">建议选平台流量高峰时段，发布后30分钟内密集互动</p>
      </div>

      {/* Gap calculator */}
      {shootDate && publishDate && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center justify-between">
          <div className="text-sm text-slate-400">
            拍摄 → 发布间隔
          </div>
          <div className="text-sm font-semibold text-slate-200">
            {Math.max(0, Math.round((new Date(publishDate).getTime() - new Date(shootDate).getTime()) / 86400000))} 天
            <span className="text-slate-500 font-normal ml-1">（包含剪辑时间）</span>
          </div>
        </div>
      )}

      {/* Save */}
      <button
        onClick={save}
        className="w-full flex items-center justify-center gap-2 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl text-white font-semibold text-sm transition-all shadow-lg shadow-violet-900/40"
      >
        确认排期，去写脚本 <ArrowRight size={15} />
      </button>
    </div>
  );
}
