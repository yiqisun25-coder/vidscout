// Deprecated — replaced by script generator
export default function VisionBoard() { return null; }
import { generateVisionQuote } from '../services/geminiService';

interface VisionBoardProps {
  items: VisionItem[];
  onAddItem: (item: VisionItem) => void;
  onRemoveItem: (id: string) => void;
}

const VisionBoard: React.FC<VisionBoardProps> = ({ items, onAddItem, onRemoveItem }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [loadingQuote, setLoadingQuote] = useState(false);

  const handleGenerateQuote = async () => {
    if (!newTitle) return;
    setLoadingQuote(true);
    const quote = await generateVisionQuote(newTitle);
    setNewDesc(quote);
    setLoadingQuote(false);
  };

  const handleAdd = () => {
    if (!newTitle) return;
    const newItem: VisionItem = {
      id: Date.now().toString(),
      title: newTitle,
      description: newDesc || 'Better me!',
      imageUrl: `https://picsum.photos/400/400?random=${Date.now()}&blur=1`,
      rotation: Math.random() * 10 - 5, // Random rotation between -5 and 5
      size: Math.random() > 0.6 ? 'large' : 'medium'
    };
    onAddItem(newItem);
    setIsAdding(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="pb-32 px-4 relative min-h-screen overflow-hidden">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full opacity-5 pointer-events-none z-0">
         <div className="absolute top-20 left-10 w-64 h-64 bg-rose-300 rounded-full blur-[100px]"></div>
         <div className="absolute bottom-40 right-10 w-80 h-80 bg-orange-200 rounded-full blur-[80px]"></div>
      </div>

      {/* Header Area */}
      <div className="text-center py-8 relative z-10">
        <h2 className="font-hand text-5xl text-slate-800 tracking-wide relative inline-block">
          2025
          <span className="block font-sans text-xs font-bold tracking-[0.4em] uppercase text-rose-400 mt-2">Vision Board</span>
          
          {/* Decorative Sparkles */}
          <span className="absolute -top-4 -right-8 text-3xl text-yellow-400 animate-pulse">✨</span>
          <span className="absolute bottom-2 -left-6 text-2xl text-rose-300">✦</span>
        </h2>
      </div>

      {/* Collage Grid */}
      <div className="columns-2 md:columns-3 gap-4 space-y-6 relative z-10 mx-auto max-w-2xl">
        {/* Add Button as a Card */}
        <div 
          onClick={() => setIsAdding(true)}
          className="break-inside-avoid mb-6 cursor-pointer group"
        >
          <div className="bg-white/50 border-2 border-dashed border-rose-300 rounded-xl p-8 flex flex-col items-center justify-center text-rose-400 hover:bg-rose-50 transition-colors aspect-square">
            <Plus size={32} />
            <span className="font-hand text-lg mt-2">Add Dream</span>
          </div>
        </div>

        {items.map((item, index) => (
          <div 
            key={item.id} 
            className="break-inside-avoid mb-8 relative group"
            style={{ 
              transform: `rotate(${item.rotation || (index % 2 === 0 ? -2 : 2)}deg)`,
            }}
          >
            {/* Tape */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-yellow-100/80 backdrop-blur-sm shadow-sm rotate-1 z-20"></div>

            {/* Polaroid Body */}
            <div className="bg-white p-3 pb-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-transform hover:scale-105 hover:rotate-0 hover:z-30 duration-300 rounded-sm">
              <div className="aspect-[4/5] overflow-hidden bg-slate-100 mb-3 relative">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover"
                />
                <button 
                  onClick={(e) => { e.stopPropagation(); onRemoveItem(item.id); }}
                  className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
              
              <div className="text-center px-1">
                <h3 className="font-hand text-2xl text-slate-800 mb-1 leading-none">{item.title}</h3>
                <p className="font-brush text-slate-500 text-sm">{item.description}</p>
              </div>
            </div>

            {/* Sticker Decor (Randomly applied) */}
            {index % 3 === 0 && (
              <div className="absolute -bottom-4 -right-2 text-4xl transform rotate-12 z-30 drop-shadow-md">
                🌿
              </div>
            )}
            {index % 3 === 1 && (
              <div className="absolute -top-4 -left-2 text-3xl transform -rotate-12 z-30 drop-shadow-md">
                ✨
              </div>
            )}
          </div>
        ))}
      </div>

      {isAdding && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
           <div className="bg-[#fffaf0] rounded-sm w-full max-w-sm p-1 shadow-2xl relative rotate-1">
             <div className="border border-slate-200 p-6 h-full rounded-sm border-dashed">
                <button 
                    onClick={() => setIsAdding(false)}
                    className="absolute top-2 right-2 text-slate-400 hover:text-slate-600"
                >
                <X size={24} />
                </button>
                
                <h3 className="font-hand text-3xl text-slate-800 mb-6 text-center">New Dream</h3>
                
                <div className="space-y-4">
                <div>
                    <input 
                        type="text" 
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Title (e.g. Travel)"
                        className="font-hand text-xl w-full px-2 py-2 bg-transparent border-b-2 border-slate-200 focus:border-rose-400 outline-none placeholder-slate-300 text-slate-700 text-center"
                        autoFocus
                    />
                </div>
                <div>
                    <div className="flex justify-end mb-1">
                    <button 
                        onClick={handleGenerateQuote}
                        disabled={!newTitle || loadingQuote}
                        className="text-xs text-rose-500 font-bold flex items-center hover:bg-rose-50 px-2 py-1 rounded"
                    >
                        <Wand2 size={12} className="mr-1" />
                        Generate Quote
                    </button>
                    </div>
                    <textarea 
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                        placeholder="What's your vision..."
                        className="font-brush w-full p-3 rounded-lg bg-white/50 border border-slate-200 focus:border-rose-400 outline-none h-24 resize-none text-slate-600 text-lg leading-relaxed"
                    />
                </div>
                <button 
                    onClick={handleAdd}
                    disabled={!newTitle}
                    className="w-full py-3 bg-slate-800 text-white font-hand text-xl rounded-sm hover:bg-slate-700 transition-colors shadow-lg mt-2"
                    >
                    Pin It
                    </button>
                </div>
             </div>
           </div>
         </div>
      )}
    </div>
  );
};

export default VisionBoard;