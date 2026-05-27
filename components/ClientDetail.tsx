import React, { useState } from 'react';
import { Client, Project } from '../types';
import { SHOP_TYPE_EMOJI, PLATFORM_EMOJI, STATUS_LABEL, STATUS_COLOR, STEP_META } from '../constants';
import { Plus, Calendar, ChevronRight, Phone, StickyNote, Mic2, ChevronDown, ChevronUp } from 'lucide-react';

// ── Project Card (mini, within client workspace) ──────────────────────────────
const ProjectCard: React.FC<{ project: Project; onOpen: () => void }> = ({ project, onOpen }) => {
  const step     = STEP_META.find(s => s.id === project.step);
  const stepIdx  = STEP_META.findIndex(s => s.id === project.step);
  const progress = Math.round((stepIdx / (STEP_META.length - 1)) * 100);

  return (
    <div className="group bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-xl p-4 cursor-pointer transition-all" onClick={onOpen}>
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="text-sm font-medium text-slate-100 leading-snug">
              {project.topic?.title ?? <span className="text-slate-400 italic">未选选题</span>}
            </div>
            <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLOR[project.status]}`}>
              {STATUS_LABEL[project.status]}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
            <span>{PLATFORM_EMOJI[project.platform]} {project.platform}</span>
            {project.publishDate && <span className="text-violet-400"><Calendar size={10} className="inline mr-0.5" />{project.publishDate}</span>}
          </div>
          {!project.published ? (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-slate-500">{step?.emoji} {step?.label}</span>
                <span className="text-[10px] text-slate-600">{progress}%</span>
              </div>
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-violet-600 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>
          ) : (
            <div className="mt-2 text-xs text-emerald-400 font-medium">✅ 已发布 {project.publishDate}</div>
          )}
        </div>
        <ChevronRight size={14} className="flex-shrink-0 text-slate-600 group-hover:text-slate-400 mt-1 transition-colors" />
      </div>
    </div>
  );
};

// ── Main ClientDetail ─────────────────────────────────────────────────────────
interface Props {
  client: Client;
  projects: Project[];
  onNewProject: () => void;
  onOpenProject: (id: string) => void;
}

export default function ClientDetail({ client, projects, onNewProject, onOpenProject }: Props) {
  const [infoOpen, setInfoOpen] = useState(false);
  const shop = client.shopInfo;
  const active    = projects.filter(p => !p.published);
  const published = projects.filter(p => p.published);

  return (
    <div className="space-y-5">

      {/* Client header card */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-4 p-4">
          <div className="text-4xl">{SHOP_TYPE_EMOJI[shop.type]}</div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-slate-100 text-lg">{shop.name}</div>
            <div className="text-xs text-slate-400 mt-0.5">
              {shop.type} · 人均 {shop.avgPrice}
              {shop.area && ` · ${shop.area}`}
            </div>
          </div>
          <button onClick={() => setInfoOpen(v => !v)} className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors px-2 py-1">
            档案 {infoOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>

        {infoOpen && (
          <div className="border-t border-slate-700 p-4 space-y-3">
            {shop.highlights && (
              <div className="text-sm text-slate-400">
                <span className="text-xs text-slate-600 block mb-0.5">特色/卖点</span>
                {shop.highlights}
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              {client.contact && (
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Phone size={12} className="text-slate-600" />
                  {client.contact} {client.phone && `· ${client.phone}`}
                </div>
              )}
              {client.notes && (
                <div className="flex items-start gap-2 text-sm text-slate-400">
                  <StickyNote size={12} className="text-slate-600 mt-0.5 flex-shrink-0" />
                  {client.notes}
                </div>
              )}
            </div>
            {client.brandVoice && (
              <div className="flex items-start gap-2 bg-violet-950/30 border border-violet-800/30 rounded-lg p-3">
                <Mic2 size={12} className="text-violet-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-[10px] text-violet-400 font-semibold mb-0.5">品牌调性 · AI 参考</div>
                  <div className="text-xs text-slate-300">{client.brandVoice}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* New project button */}
      <button onClick={onNewProject}
        className="w-full flex items-center justify-center gap-2 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl text-white font-semibold text-sm shadow-lg shadow-violet-900/40 transition-all">
        <Plus size={15} /> 为 {shop.name} 新建视频项目
      </button>

      {/* Active projects */}
      {active.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">进行中 · {active.length} 个</div>
          {active.map(p => <ProjectCard key={p.id} project={p} onOpen={() => onOpenProject(p.id)} />)}
        </div>
      )}

      {/* Published projects */}
      {published.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">已发布 · {published.length} 个</div>
          {published.map(p => <ProjectCard key={p.id} project={p} onOpen={() => onOpenProject(p.id)} />)}
        </div>
      )}

      {projects.length === 0 && (
        <div className="text-center py-12 text-slate-500 text-sm">
          还没有项目，点上方按钮开始第一个视频 👆
        </div>
      )}
    </div>
  );
}
