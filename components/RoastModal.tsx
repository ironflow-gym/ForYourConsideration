
import React from 'react';

interface RoastModalProps {
  roast: string;
  onClose: () => void;
  isLoading: boolean;
}

const RoastModal: React.FC<RoastModalProps> = ({ roast, onClose, isLoading }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-500 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-stone-900 to-stone-950 border border-fuchsia-500/30 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(255,0,255,0.1)] ring-2 ring-white/5 flex flex-col max-h-[90vh]">
        {/* Spotlight Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-white/5 blur-[80px] rounded-full -translate-y-1/2 pointer-events-none" />
        
        {/* Close Button Top Right */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-stone-500 hover:text-white z-20 p-2 rounded-full transition-all bg-white/5 hover:bg-white/10"
          aria-label="Close roast"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <div className="overflow-y-auto p-8 md:p-10 flex-1 relative custom-scrollbar">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
               <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-tr from-fuchsia-600 to-pink-500 flex items-center justify-center shadow-lg ring-4 ring-pink-500/20">
                  <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z"/>
                  </svg>
               </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-black serif italic tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-fuchsia-300 to-white">
              The Red Carpet Roast
            </h2>
            <p className="text-[10px] uppercase font-black tracking-[0.3em] text-fuchsia-500/80 mb-8">Fashion Police Assessment</p>

            {isLoading ? (
              <div className="py-12 flex flex-col items-center gap-6">
                 <div className="flex gap-2">
                   <div className="w-3 h-3 bg-fuchsia-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                   <div className="w-3 h-3 bg-fuchsia-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                   <div className="w-3 h-3 bg-fuchsia-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                 </div>
                 <p className="text-stone-400 font-bold italic serif text-lg animate-pulse">"Sharpening the tongue, darling..."</p>
              </div>
            ) : (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-700">
                <p className="text-lg md:text-2xl text-stone-100 leading-relaxed font-serif italic py-6 px-2 border-y border-white/5">
                  "{roast}"
                </p>
                
                <div className="pt-6 pb-2">
                  <button 
                    onClick={onClose}
                    className="bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white font-black uppercase tracking-[0.2em] px-8 py-4 rounded-full text-[10px] md:text-xs shadow-xl transition-all transform hover:scale-105 active:scale-95 border border-white/10"
                  >
                    Dismiss Critique
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Glamour Accents */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent" />
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(217, 70, 239, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(217, 70, 239, 0.4);
        }
      `}</style>
    </div>
  );
};

export default RoastModal;
