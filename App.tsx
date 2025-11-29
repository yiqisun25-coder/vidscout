import React, { useState, useEffect } from 'react';
import { ViewState, WeightEntry, VisionItem, DailyStats, JournalEntry } from './types';
import Dashboard from './components/Dashboard';
import VisionBoard from './components/VisionBoard';
import Journal from './components/Journal';
import { MOCK_WEIGHT_DATA, INITIAL_VISION_BOARD, MOCK_JOURNAL, APP_NAME } from './constants';
import { LayoutGrid, Image, Settings, BookHeart } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [weights, setWeights] = useState<WeightEntry[]>([]);
  const [visionItems, setVisionItems] = useState<VisionItem[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats>({ waterCount: 0, lastWaterDate: '' });
  const [mounted, setMounted] = useState(false);

  // Initialize Data
  useEffect(() => {
    const savedWeights = localStorage.getItem('weights');
    const savedVision = localStorage.getItem('vision');
    const savedJournal = localStorage.getItem('journal');
    const savedStats = localStorage.getItem('dailyStats');

    if (savedWeights) setWeights(JSON.parse(savedWeights));
    else setWeights(MOCK_WEIGHT_DATA);

    if (savedVision) setVisionItems(JSON.parse(savedVision));
    else setVisionItems(INITIAL_VISION_BOARD);

    if (savedJournal) setJournalEntries(JSON.parse(savedJournal));
    else setJournalEntries(MOCK_JOURNAL);

    const today = new Date().toISOString().split('T')[0];
    if (savedStats) {
      const parsed = JSON.parse(savedStats);
      if (parsed.lastWaterDate === today) {
        setDailyStats(parsed);
      } else {
        setDailyStats({ waterCount: 0, lastWaterDate: today });
      }
    } else {
      setDailyStats({ waterCount: 0, lastWaterDate: today });
    }

    setMounted(true);
  }, []);

  // Persistence
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('weights', JSON.stringify(weights));
      localStorage.setItem('vision', JSON.stringify(visionItems));
      localStorage.setItem('journal', JSON.stringify(journalEntries));
      localStorage.setItem('dailyStats', JSON.stringify(dailyStats));
    }
  }, [weights, visionItems, journalEntries, dailyStats, mounted]);

  const handleAddWeight = (weight: number, date: string, note: string) => {
    const newEntry: WeightEntry = {
      id: Date.now().toString(),
      weight,
      date,
      note
    };
    setWeights(prev => {
      const existingIndex = prev.findIndex(p => p.date === date);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], weight, note };
        return updated;
      }
      return [...prev, newEntry];
    });
  };

  const handleAddVision = (item: VisionItem) => {
    setVisionItems(prev => [item, ...prev]);
  };

  const handleRemoveVision = (id: string) => {
    setVisionItems(prev => prev.filter(item => item.id !== id));
  };

  const handleAddJournal = (entry: JournalEntry) => {
    setJournalEntries(prev => [entry, ...prev]);
  };

  const handleUpdateWater = (count: number) => {
    const today = new Date().toISOString().split('T')[0];
    setDailyStats({ waterCount: count, lastWaterDate: today });
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#fffaf9] text-slate-800 font-rounded selection:bg-rose-200">
      
      {/* Header (Minimal) */}
      <header className="fixed top-0 left-0 right-0 z-30 pt-6 px-6 pb-2 pointer-events-none">
        <div className="max-w-lg mx-auto flex items-center justify-between pointer-events-auto">
          <h1 className="text-xl font-black text-rose-400 tracking-tight flex items-center gap-2 opacity-0">
             {/* Hidden title for spacing */}
            {APP_NAME}
          </h1>
          <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors bg-white/50 backdrop-blur rounded-full shadow-sm border border-slate-100">
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-lg mx-auto pt-24 min-h-screen">
        <div className="animate-fade-in">
          {view === 'dashboard' && (
            <div className="px-6">
               <div className="mb-6 flex items-center gap-2 text-rose-500">
                  <span className="text-2xl">🐾</span>
                  <span className="font-black text-xl tracking-tight">{APP_NAME}</span>
               </div>
               <Dashboard 
                data={weights} 
                onAddEntry={handleAddWeight} 
                dailyStats={dailyStats}
                onUpdateWater={handleUpdateWater}
              />
            </div>
          )}
          {view === 'vision' && (
            <VisionBoard 
              items={visionItems} 
              onAddItem={handleAddVision} 
              onRemoveItem={handleRemoveVision}
            />
          )}
          {view === 'journal' && (
            <Journal 
              entries={journalEntries}
              onAddEntry={handleAddJournal}
            />
          )}
        </div>
      </main>

      {/* Bottom Navigation (Floating) */}
      <nav className="fixed bottom-6 left-6 right-6 z-40">
        <div className="max-w-xs mx-auto bg-slate-800/90 backdrop-blur-lg rounded-full shadow-2xl border border-slate-700/50 p-1.5 flex justify-between items-center relative">
          
          {/* Active Indicator Background */}
          <div 
            className="absolute top-1.5 bottom-1.5 w-[calc(33.33%-4px)] bg-white/10 rounded-full transition-all duration-300 ease-spring"
            style={{ 
              left: view === 'dashboard' ? '4px' : view === 'vision' ? 'calc(50% - (33.33%/2) + 2px)' : 'calc(100% - 33.33%)' 
            }}
          ></div>

          <button 
            onClick={() => setView('dashboard')}
            className={`flex-1 flex flex-col items-center justify-center py-3 rounded-full relative z-10 transition-all duration-300 ${view === 'dashboard' ? 'text-rose-400 scale-105' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <LayoutGrid size={20} strokeWidth={view === 'dashboard' ? 3 : 2} />
          </button>
          
          <button 
            onClick={() => setView('vision')}
            className={`flex-1 flex flex-col items-center justify-center py-3 rounded-full relative z-10 transition-all duration-300 ${view === 'vision' ? 'text-rose-400 scale-105' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Image size={20} strokeWidth={view === 'vision' ? 3 : 2} />
          </button>

          <button 
            onClick={() => setView('journal')}
            className={`flex-1 flex flex-col items-center justify-center py-3 rounded-full relative z-10 transition-all duration-300 ${view === 'journal' ? 'text-rose-400 scale-105' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <BookHeart size={20} strokeWidth={view === 'journal' ? 3 : 2} />
          </button>
        </div>
      </nav>

      {/* Global Styles */}
      <style>{`
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        .animate-slide-up {
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .ease-spring {
          transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
};

export default App;