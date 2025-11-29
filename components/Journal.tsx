import React, { useState } from 'react';
import { JournalEntry } from '../types';
import { Camera, Send, X, Image as ImageIcon, Smile } from 'lucide-react';

interface JournalProps {
  entries: JournalEntry[];
  onAddEntry: (entry: JournalEntry) => void;
}

const Journal: React.FC<JournalProps> = ({ entries, onAddEntry }) => {
  const [isComposing, setIsComposing] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [isFlashing, setIsFlashing] = useState(false);
  const [justPosted, setJustPosted] = useState<string | null>(null);

  const handlePost = async () => {
    if (!newContent.trim()) return;

    // Trigger Camera Flash Effect
    setIsFlashing(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 800)); // Flash duration
    
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      content: newContent,
      // Random mock image for demo
      imageUrl: Math.random() > 0.3 ? `https://picsum.photos/400/400?random=${Date.now()}` : undefined,
      mood: 'happy'
    };

    onAddEntry(newEntry);
    setNewContent('');
    setIsFlashing(false);
    setIsComposing(false);
    setJustPosted(newEntry.id);
    
    // Remove "fresh" status after animation
    setTimeout(() => setJustPosted(null), 2000);
  };

  return (
    <div className="pb-32 min-h-screen bg-grid-paper relative">
      {/* Header */}
      <div className="sticky top-20 z-20 px-6 py-4 bg-[#fffaf9]/90 backdrop-blur-sm border-b border-dashed border-slate-200 flex justify-between items-center">
        <div>
           <h2 className="font-hand text-3xl text-slate-800">Daily Log</h2>
           <p className="font-brush text-slate-400 text-sm">记录闪光的生活碎片</p>
        </div>
        <button 
          onClick={() => setIsComposing(true)}
          className="bg-slate-800 text-white p-3 rounded-full shadow-lg hover:scale-105 transition-transform"
        >
          <Camera size={24} />
        </button>
      </div>

      {/* Timeline */}
      <div className="px-4 py-6 max-w-lg mx-auto space-y-12">
        {entries.map((entry, index) => (
          <div 
            key={entry.id} 
            className={`relative pl-8 animate-slide-down ${justPosted === entry.id ? 'animate-develop' : ''}`}
          >
            {/* Timeline Line */}
            <div className="absolute left-[11px] top-8 bottom-[-48px] w-[2px] bg-slate-200 last:hidden"></div>
            
            {/* Timeline Dot */}
            <div className="absolute left-0 top-2 w-6 h-6 bg-white border-2 border-slate-300 rounded-full flex items-center justify-center text-[10px] text-slate-400 font-bold z-10 shadow-sm">
              {entries.length - index}
            </div>

            {/* Card */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 rotate-1 group hover:rotate-0 transition-transform duration-300">
               <div className="flex justify-between items-start mb-3 border-b border-slate-50 pb-2">
                 <span className="font-mono text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded">{entry.date}</span>
                 {entry.mood && <span className="text-lg grayscale group-hover:grayscale-0 transition-all">🐱</span>}
               </div>

               {entry.imageUrl && (
                 <div className="mb-4 p-2 bg-white border border-slate-100 shadow-inner rounded-sm">
                   <div className="aspect-square bg-slate-100 overflow-hidden rounded-sm">
                     <img src={entry.imageUrl} alt="Memory" className="w-full h-full object-cover filter contrast-[1.1] hover:contrast-100 transition-all" />
                   </div>
                 </div>
               )}

               <p className="font-brush text-lg text-slate-700 leading-relaxed whitespace-pre-wrap">
                 {entry.content}
               </p>
            </div>
            
            {/* Tape Decor */}
            <div className="absolute -top-2 right-8 w-16 h-6 bg-rose-100/50 rotate-3 z-20 mix-blend-multiply"></div>
          </div>
        ))}
        
        {entries.length === 0 && (
          <div className="text-center py-20 opacity-40 font-hand text-xl">
             No memories yet...
          </div>
        )}
      </div>

      {/* Camera/Compose Modal */}
      {isComposing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center">
           
           {/* Camera Flash Overlay */}
           {isFlashing && (
             <div className="absolute inset-0 bg-white z-[60] animate-[fadeOut_0.8s_ease-out_forwards]" style={{animationName: 'fadeOut', pointerEvents: 'none'}}></div>
           )}
           <style>{`@keyframes fadeOut { 0% { opacity: 1; } 100% { opacity: 0; } }`}</style>

           <div className="bg-white w-full max-w-lg rounded-t-[2rem] sm:rounded-[2rem] p-6 relative animate-slide-up">
              <button 
                onClick={() => setIsComposing(false)}
                className="absolute top-4 right-4 text-slate-300 hover:text-slate-800"
              >
                <X size={24} />
              </button>

              <h3 className="text-center font-bold text-slate-800 mb-6 flex items-center justify-center gap-2">
                <Camera className="text-rose-500" />
                Capture Moment
              </h3>

              <div className="space-y-4">
                <textarea 
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Today's little happiness..."
                  className="w-full h-32 p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-rose-200 outline-none resize-none font-brush text-lg"
                  autoFocus
                />
                
                <div className="flex gap-2 overflow-x-auto pb-2">
                   {/* Mock Tools */}
                   <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:bg-slate-100"><ImageIcon size={20} /></button>
                   <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:bg-slate-100"><Smile size={20} /></button>
                </div>

                <button 
                  onClick={handlePost}
                  disabled={!newContent.trim()}
                  className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl shadow-lg shadow-rose-200 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  Print Memory
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Journal;