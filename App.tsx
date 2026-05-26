import React, { useState, useEffect, useCallback } from 'react';
import { Project, Platform, WorkflowStep, ShopInfo, ShopType } from './types';
import { APP_NAME, PLATFORMS, PLATFORM_EMOJI, SHOP_TYPES, SHOP_TYPE_EMOJI, STATUS_LABEL, STATUS_COLOR, STEP_META, STORAGE_KEY } from './constants';
import TopicPanel    from './components/TopicPanel';
import SchedulePanel from './components/SchedulePanel';
import ScriptPanel   from './components/ScriptPanel';
import ShootingPanel from './components/ShootingPanel';
import PublishPanel  from './components/PublishPanel';
import { activeProvider, providerLabel } from './services/geminiService';
import { Plus, ArrowLeft, Video, Trash2, Calendar, ChevronRight, Store, Cpu } from 'lucide-react';

const PROVIDER_CLS: Record<ReturnType<typeof activeProvider>, string> = {
  custom:     'text-emerald-300 bg-emerald-500/10 border-emerald-500/30',
  deepseek:   'text-blue-300   bg-blue-500/10   border-blue-500/30',
  openrouter: 'text-violet-300 bg-violet-500/10 border-violet-500/30',
  gemini:     'text-sky-300    bg-sky-500/10    border-sky-500/30',
  mock:       'text-slate-400  bg-slate-500/10  border-slate-500/30',
};

// ── helpers ───────────────────────────────────────────────────────────────────
function newProject(platform: Platform, shopInfo: ShopInfo): Project {
  const now = new Date().toISOString();
  return { id: Date.now().toString(), platform, shopInfo, status: 'idea', step: 'topic', createdAt: now, updatedAt: now };
}
function load(): Project[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'); } catch { return []; }
}
function save(projects: Project[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(projects)); }

type AppView = 'list' | 'editor' | 'new';

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [view, setView]         = useState<AppView>('list');
  const [activeId, setActiveId] = useState<string | null>(null);

  // New project form state
  const [newPlatform,  setNewPlatform]  = useState<Platform>('抖音本地生活');
  const [newName,      setNewName]      = useState('');
  const [newType,      setNewType]      = useState<ShopType>('餐饮');
  const [newPrice,     setNewPrice]     = useState('');
  const [newHighlight, setNewHighlight] = useState('');
  const [newArea,      setNewArea]      = useState('');
  const [newErr,       setNewErr]       = useState('');

  useEffect(() => { setProjects(load()); }, []);

  const upsert = useCallback((p: Project) => {
    setProjects(prev => {
      const next = prev.some(x => x.id === p.id) ? prev.map(x => x.id === p.id ? p : x) : [p, ...prev];
      save(next); return next;
    });
  }, []);

  const patchActive = useCallback((patch: Partial<Project>) => {
    setProjects(prev => {
      const next = prev.map(p => p.id !== activeId ? p : { ...p, ...patch, updatedAt: new Date().toISOString() });
      save(next); return next;
    });
  }, [activeId]);

  const deleteProject = useCallback((id: string) => {
    if (!confirm('确认删除这个项目？')) return;
    setProjects(prev => { const next = prev.filter(p => p.id !== id); save(next); return next; });
    if (activeId === id) { setActiveId(null); setView('list'); }
  }, [activeId]);

  const active  = projects.find(p => p.id === activeId) ?? null;
  const stepIdx = active ? STEP_META.findIndex(s => s.id === active.step) : 0;

  function openProject(id: string) { setActiveId(id); setView('editor'); }

  function createProject() {
    if (!newName.trim()) { setNewErr('请填写店名'); return; }
    if (!newPrice.trim()) { setNewErr('请填写人均价格'); return; }
    if (!newHighlight.trim()) { setNewErr('请填写店的特色'); return; }
    const shopInfo: ShopInfo = { name: newName.trim(), type: newType, avgPrice: newPrice.trim(), highlights: newHighlight.trim(), area: newArea.trim() || undefined };
    const p = newProject(newPlatform, shopInfo);
    upsert(p); setActiveId(p.id);
    setNewName(''); setNewPrice(''); setNewHighlight(''); setNewArea(''); setNewErr('');
    setView('editor');
  }

  function goStep(s: WorkflowStep) { patchActive({ step: s }); }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-24">

        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          {view !== 'list' ? (
            <button onClick={() => { setView('list'); setActiveId(null); }} className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors text-sm">
              <ArrowLeft size={16} /> 项目列表
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Store size={20} className="text-violet-400" />
                <span className="font-bold text-slate-100 text-lg tracking-tight">{APP_NAME}</span>
              </div>
              <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border font-medium ${PROVIDER_CLS[activeProvider()]}`}>
                <Cpu size={10} /> {providerLabel()}
              </span>
            </div>
          )}
          {view === 'list' && (
            <button onClick={() => setView('new')} className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm font-semibold text-white shadow-lg shadow-violet-900/40 transition-all">
              <Plus size={15} /> 新项目
            </button>
          )}
          {view === 'editor' && active && (
            <button onClick={() => deleteProject(active.id)} className="p-2 text-slate-600 hover:text-red-400 transition-colors">
              <Trash2 size={16} />
            </button>
          )}
        </header>

        {/* New Project Form */}
        {view === 'new' && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-slate-100">新建探店项目</h2>

            {/* Platform */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">发布平台</label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map(p => (
                  <button key={p} onClick={() => setNewPlatform(p)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${newPlatform === p ? 'bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-900/40' : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'}`}>
                    {PLATFORM_EMOJI[p]} {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Shop name */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">店名</label>
              <input autoFocus className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                placeholder="例：鲜道寿司、快印世界" value={newName} onChange={e => { setNewName(e.target.value); setNewErr(''); }} />
            </div>

            {/* Shop type + price */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">店铺类型</label>
                <div className="flex flex-wrap gap-2">
                  {SHOP_TYPES.map(t => (
                    <button key={t} onClick={() => setNewType(t)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${newType === t ? 'bg-violet-600 border-violet-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'}`}>
                      {SHOP_TYPE_EMOJI[t]} {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">人均消费</label>
                <input className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                  placeholder="例：¥68、¥30-50" value={newPrice} onChange={e => { setNewPrice(e.target.value); setNewErr(''); }} />
              </div>
            </div>

            {/* Highlights */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">特色 / 卖点</label>
              <textarea className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors resize-none" rows={3}
                placeholder="例：老板是日本料理出身，有隐藏菜单，份量大，食材新鲜每天配送" value={newHighlight} onChange={e => { setNewHighlight(e.target.value); setNewErr(''); }} />
            </div>

            {/* Area (optional) */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">区域 / 商圈 <span className="text-slate-600 font-normal normal-case">（选填）</span></label>
              <input className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                placeholder="例：朝阳区三里屯、上海静安寺附近" value={newArea} onChange={e => setNewArea(e.target.value)} onKeyDown={e => e.key === 'Enter' && createProject()} />
            </div>

            {newErr && <p className="text-red-400 text-xs">{newErr}</p>}

            <div className="flex gap-3 pt-2">
              <button onClick={() => setView('list')} className="flex-1 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 text-sm font-medium transition-all">取消</button>
              <button onClick={createProject} className="flex-1 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm shadow-lg shadow-violet-900/40 transition-all">创建并开始 →</button>
            </div>
          </div>
        )}

        {/* Project List */}
        {view === 'list' && (
          <div className="space-y-4">
            {projects.length === 0 ? (
              <div className="text-center py-24 space-y-4">
                <Store size={48} className="mx-auto text-slate-700" />
                <p className="text-slate-500 text-sm">还没有项目</p>
                <p className="text-slate-600 text-xs">点击「新项目」开始第一个探店视频</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-4 gap-2 mb-6">
                  {(['idea','scripting','shooting','published'] as Project['status'][]).map(s => (
                    <div key={s} className={`rounded-xl border p-3 text-center ${STATUS_COLOR[s]}`}>
                      <div className="text-xl font-bold">{projects.filter(p => p.status === s).length}</div>
                      <div className="text-xs opacity-70 mt-0.5">{STATUS_LABEL[s]}</div>
                    </div>
                  ))}
                </div>
                {[...projects].sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).map(p => (
                  <ProjectCard key={p.id} project={p} onOpen={() => openProject(p.id)} onDelete={() => deleteProject(p.id)} />
                ))}
              </>
            )}
          </div>
        )}

        {/* Editor */}
        {view === 'editor' && active && (
          <div className="space-y-6">
            {/* Project header */}
            <div className="flex items-center gap-3">
              <span className="text-2xl">{SHOP_TYPE_EMOJI[active.shopInfo.type]}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-100 truncate">{active.shopInfo.name}</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {PLATFORM_EMOJI[active.platform]} {active.platform} · 人均 {active.shopInfo.avgPrice}
                  {active.publishDate && <span className="ml-2 text-violet-400"><Calendar size={10} className="inline mr-0.5" />{active.publishDate}</span>}
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLOR[active.status]}`}>
                {STATUS_LABEL[active.status]}
              </span>
            </div>

            {/* Step tabs */}
            <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
              {STEP_META.map((s, i) => {
                const isCurrent = active.step === s.id;
                const isDone    = i < stepIdx;
                return (
                  <button key={s.id} onClick={() => goStep(s.id)}
                    className={`flex-1 flex flex-col items-center py-2 px-1 rounded-lg text-xs font-medium transition-all ${isCurrent ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/40' : isDone ? 'text-emerald-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'}`}>
                    <span className="text-base leading-none mb-0.5">{isDone && !isCurrent ? '✅' : s.emoji}</span>
                    <span className="hidden sm:block">{s.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="text-xs text-slate-500 -mt-2">{STEP_META[stepIdx]?.desc}</div>

            {/* Panel */}
            <div>
              {active.step === 'topic'    && <TopicPanel    project={active} onChange={patchActive} />}
              {active.step === 'schedule' && <SchedulePanel project={active} onChange={patchActive} />}
              {active.step === 'script'   && <ScriptPanel   project={active} onChange={patchActive} />}
              {active.step === 'shooting' && <ShootingPanel project={active} onChange={patchActive} />}
              {active.step === 'publish'  && <PublishPanel  project={active} onChange={patchActive} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Project Card ──────────────────────────────────────────────────────────────
const ProjectCard: React.FC<{ project: Project; onOpen: () => void; onDelete: () => void }> = ({ project, onOpen, onDelete }) => {
  const step     = STEP_META.find(s => s.id === project.step);
  const stepIdx  = STEP_META.findIndex(s => s.id === project.step);
  const progress = Math.round((stepIdx / (STEP_META.length - 1)) * 100);

  return (
    <div className="group bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-2xl p-5 cursor-pointer transition-all" onClick={onOpen}>
      <div className="flex items-start gap-3">
        <div className="text-2xl flex-shrink-0 mt-0.5">{SHOP_TYPE_EMOJI[project.shopInfo.type]}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="font-semibold text-slate-100 text-sm leading-snug">
              {project.topic?.title ?? <span className="text-slate-300">{project.shopInfo.name}</span>}
            </div>
            <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLOR[project.status]}`}>
              {STATUS_LABEL[project.status]}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
            <span>{PLATFORM_EMOJI[project.platform]} {project.platform}</span>
            <span>人均 {project.shopInfo.avgPrice}</span>
            {project.publishDate && <span className="text-violet-400"><Calendar size={10} className="inline mr-0.5" />{project.publishDate}</span>}
          </div>
          {!project.published ? (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-500">{step?.emoji} {step?.label}</span>
                <span className="text-xs text-slate-600">{progress}%</span>
              </div>
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-violet-600 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>
          ) : (
            <div className="mt-3 text-xs text-emerald-400 font-medium">✅ 已发布 {project.publishDate}</div>
          )}
        </div>
        <ChevronRight size={16} className="flex-shrink-0 text-slate-600 group-hover:text-slate-400 mt-0.5 transition-colors" />
      </div>
    </div>
  );
};
