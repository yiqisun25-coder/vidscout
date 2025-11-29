import React, { useState, useMemo, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, TrendingDown, TrendingUp, Sparkles, Droplets, PawPrint } from 'lucide-react';
import { WeightEntry, AIInsight, DailyStats } from '../types';
import { analyzeWeightTrend } from '../services/geminiService';
import { CAT_ASSETS, WATER_GOAL } from '../constants';

interface DashboardProps {
  data: WeightEntry[];
  onAddEntry: (weight: number, date: string, note: string) => void;
  dailyStats: DailyStats;
  onUpdateWater: (count: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ data, onAddEntry, dailyStats, onUpdateWater }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newNote, setNewNote] = useState('');
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  // Calculate Stats
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data]);

  const currentWeight = sortedData.length > 0 ? sortedData[sortedData.length - 1].weight : 0;
  const startWeight = sortedData.length > 0 ? sortedData[0].weight : 0;
  const totalChange = currentWeight - startWeight;
  const isLoss = totalChange <= 0;

  // Chart Data Preparation
  const minWeight = Math.min(...sortedData.map(d => d.weight)) - 1;
  const maxWeight = Math.max(...sortedData.map(d => d.weight)) + 1;

  // BMI Calculation
  const demoHeightM = 1.65; 
  const bmi = currentWeight / (demoHeightM * demoHeightM);
  const getBmiLabel = (v: number) => {
    if (v < 18.5) return '偏瘦';
    if (v < 24) return '标准';
    return '偏胖';
  }

  const handleAnalysis = async () => {
    if (sortedData.length < 2) return;
    setLoadingInsight(true);
    const result = await analyzeWeightTrend(sortedData);
    setInsight(result);
    setLoadingInsight(false);
  };

  useEffect(() => {
    if (!insight && sortedData.length >= 2 && !loadingInsight) {
      handleAnalysis();
    }
  }, [sortedData.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWeight && newDate) {
      onAddEntry(parseFloat(newWeight), newDate, newNote);
      setIsModalOpen(false);
      setNewWeight('');
      setNewNote('');
    }
  };

  const handleWaterClick = () => {
    if (dailyStats.waterCount < WATER_GOAL) {
      onUpdateWater(dailyStats.waterCount + 1);
    }
  };

  return (
    <div className="space-y-6 pb-32">
      
      {/* Date Header */}
      <div className="flex justify-between items-end px-2">
         <div>
            <h2 className="text-slate-400 font-bold uppercase text-xs tracking-widest">Today</h2>
            <div className="text-3xl font-black text-slate-800 font-hand">{new Date().toDateString()}</div>
         </div>
      </div>

      {/* Main Stats Card */}
      <div className="grid grid-cols-2 gap-4">
        {/* Weight Card */}
        <div className="bg-white p-5 rounded-[2rem] text-rose-900 relative overflow-hidden border border-rose-100 shadow-sm group">
           {/* Decorative Cat (Sticker style) */}
           <div className="absolute -bottom-2 -right-2 w-20 h-20 opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-500">
              <img src={CAT_ASSETS.sleepy} alt="Decor" className="w-full h-full object-contain" />
           </div>
           
           <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider flex items-center">
             Current
           </span>
           <div className="flex items-baseline mt-1 relative z-10">
            <span className="text-4xl font-black tracking-tighter text-slate-800">{currentWeight.toFixed(1)}</span>
            <span className="text-xs font-bold ml-1 text-slate-400">kg</span>
          </div>
          <div className={`mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${isLoss ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
            {isLoss ? <TrendingDown size={10} className="mr-1" /> : <TrendingUp size={10} className="mr-1" />}
            {Math.abs(totalChange).toFixed(1)} kg
          </div>
        </div>

        {/* Water & BMI Grid */}
        <div className="flex flex-col gap-3">
          {/* Water Tracker */}
          <button 
            onClick={handleWaterClick}
            className="flex-1 bg-[#f0f9ff] hover:bg-sky-50 transition-colors rounded-[1.5rem] p-3 flex items-center justify-between group border border-sky-100 relative overflow-hidden"
          >
            <div className="flex items-center gap-3 relative z-10 w-full">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-sky-500 shadow-sm">
                <Droplets size={18} fill="currentColor" className={`transition-transform ${dailyStats.waterCount === WATER_GOAL ? 'animate-bounce' : ''}`} />
              </div>
              <div className="text-left">
                <div className="text-[10px] text-sky-400 font-bold uppercase">Hydration</div>
                <div className="text-sky-900 font-black text-lg font-hand">
                  {dailyStats.waterCount}<span className="text-sky-300 text-sm">/{WATER_GOAL}</span>
                </div>
              </div>
            </div>
            {/* Water Fill Effect */}
            <div 
                className="absolute bottom-0 left-0 right-0 bg-sky-200/30 transition-all duration-500 ease-out"
                style={{ height: `${(dailyStats.waterCount / WATER_GOAL) * 100}%` }}
            ></div>
          </button>

          {/* BMI Mini */}
          <div className="flex-1 bg-white rounded-[1.5rem] p-3 flex flex-col justify-center border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-5">
                <PawPrint />
            </div>
            <div className="flex justify-between items-center mb-1 relative z-10">
               <span className="text-[10px] text-slate-400 font-bold uppercase">BMI</span>
               <span className={`text-[10px] px-2 py-0.5 rounded-sm font-bold ${bmi < 24 ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                 {getBmiLabel(bmi)}
               </span>
            </div>
            <div className="text-slate-700 font-black text-lg relative z-10">{bmi.toFixed(1)}</div>
          </div>
        </div>
      </div>

      {/* Insight "Sticky Note" */}
      <div className="relative mx-2">
         {/* Tape */}
         <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-32 h-6 bg-rose-100/50 -rotate-1 z-10"></div>
         
         <div className="bg-[#fffbeb] p-4 rounded-sm shadow-md border-b-4 border-[#fcd34d]/20 relative">
            <div className="flex gap-3">
               <div className="w-12 h-12 flex-shrink-0">
                   <img src={CAT_ASSETS.curious} alt="Mio" className="w-full h-full object-cover rounded-full border-2 border-white shadow-sm" />
               </div>
               <div>
                   {loadingInsight ? (
                       <div className="flex items-center gap-2 text-slate-400 text-sm h-full">
                           <Sparkles size={14} className="animate-spin" />
                           <span className="font-hand">Thinking...</span>
                       </div>
                   ) : insight ? (
                       <div className="animate-fade-in">
                           <h4 className="font-hand font-bold text-slate-800 text-lg leading-none mb-1">{insight.title}</h4>
                           <p className="font-brush text-slate-600 text-sm">{insight.content}</p>
                       </div>
                   ) : (
                       <div className="flex items-center h-full text-slate-500 font-hand">
                           Waiting for more data to give tips...
                       </div>
                   )}
               </div>
            </div>
         </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            Trend
          </h2>
        </div>
        
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sortedData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                tick={{fontSize: 10, fill: '#cbd5e1', fontFamily: 'Patrick Hand'}} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(val) => val.slice(5)} 
                interval="preserveStartEnd"
              />
              <YAxis 
                domain={[minWeight, maxWeight]} 
                tick={{fontSize: 10, fill: '#cbd5e1', fontFamily: 'Patrick Hand'}} 
                tickLine={false} 
                axisLine={false} 
                tickCount={5}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', backgroundColor: '#fff', padding: '8px 12px', fontFamily: 'M PLUS Rounded 1c' }}
                itemStyle={{ color: '#e11d48', fontWeight: 700, fontSize: '12px' }}
                formatter={(value: number) => [`${value} kg`, '']}
                labelStyle={{ display: 'none' }}
                cursor={{ stroke: '#fb7185', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area 
                type="monotone" 
                dataKey="weight" 
                stroke="#f43f5e" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorWeight)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Floating Add Button */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-28 right-6 w-14 h-14 bg-slate-800 rounded-full shadow-xl flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all z-20 group"
      >
        <Plus size={28} strokeWidth={2} className="group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[2rem] w-full max-w-sm p-8 shadow-2xl relative overflow-hidden">
            
            <h3 className="text-xl font-black text-slate-800 mb-8 text-center flex items-center justify-center gap-2">
               Record Weight
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <input 
                  type="date" 
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-transparent text-slate-700 outline-none font-bold text-center"
                  required
                />
              </div>
              
              <div className="p-4 rounded-xl">
                <div className="relative flex items-baseline justify-center">
                  <input 
                    type="number" 
                    step="0.01"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    placeholder="0.0"
                    className="w-full bg-transparent text-slate-800 outline-none text-6xl font-black text-center placeholder-slate-200 font-hand"
                    autoFocus
                    required
                  />
                  <span className="text-slate-400 font-bold absolute right-4 bottom-4">kg</span>
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <input 
                  type="text" 
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Note..."
                  className="w-full bg-transparent text-slate-700 outline-none font-medium placeholder-slate-300 text-center font-brush"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 rounded-xl text-slate-400 font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-4 rounded-xl bg-slate-800 text-white font-bold shadow-lg transform hover:-translate-y-1 transition-all"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;