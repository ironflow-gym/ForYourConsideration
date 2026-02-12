
import React, { useEffect, useState, useCallback } from 'react';
import { fetchMovieDetails } from '../services/geminiService';
import { MovieDetails } from '../types';

interface MovieDetailModalProps {
  title: string;
  yearHint?: number;
  countryHint?: string;
  onClose: () => void;
}

const MovieDetailModal: React.FC<MovieDetailModalProps> = ({ title, yearHint, countryHint, onClose }) => {
  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchMovieDetails(title, yearHint, countryHint);
        setDetails(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [title, yearHint, countryHint]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto cursor-pointer"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-stone-900 border border-stone-800 w-full max-w-4xl rounded-3xl overflow-hidden relative animate-in fade-in zoom-in duration-300 cursor-default shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-stone-400 hover:text-white hover:bg-white/10 z-10 p-2 rounded-full transition-all"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        {loading ? (
          <div className="h-[600px] flex flex-col items-center justify-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
            <p className="text-stone-400 text-xs font-black uppercase tracking-widest">Retrieving Movie Data...</p>
          </div>
        ) : details ? (
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-2/5 relative group">
              <img 
                src={details.posterUrl} 
                alt={details.title} 
                className="w-full h-full object-cover aspect-[2/3] md:aspect-auto" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent md:hidden" />
            </div>
            
            <div className="p-8 md:p-12 md:w-3/5 flex flex-col">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xs font-black px-2.5 py-1 bg-yellow-600/10 text-yellow-500 rounded border border-yellow-600/30 uppercase tracking-tighter">
                  {details.rating}
                </span>
                <span className="text-stone-400 text-sm font-semibold tracking-wide uppercase">{details.year}</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-black mb-8 serif text-white leading-tight tracking-tight">
                {details.title}
              </h2>
              
              <div className="mb-8">
                <h3 className="text-xs uppercase tracking-widest text-stone-500 font-black mb-3.5">The Premise</h3>
                <p className="text-stone-200 italic leading-relaxed text-xl font-serif">
                  "{details.summary}"
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-stone-500 font-black mb-2.5">Director</h4>
                  <p className="text-white font-bold tracking-wide">{details.director}</p>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-stone-500 font-black mb-2.5">Main Cast</h4>
                  <ul className="text-stone-200 space-y-1 font-semibold tracking-wide text-sm">
                    {details.cast.map(c => <li key={c}>{c}</li>)}
                  </ul>
                </div>
              </div>
              
              <div className="mt-auto pt-8 border-t border-stone-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-3">
                  <a 
                    href={`https://www.google.com/search?q=${encodeURIComponent(details.title + ' movie')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-white px-5 py-2.5 rounded-xl text-sm font-black tracking-wide uppercase transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    Search Web
                  </a>

                  <a 
                    href={`https://www.justwatch.com/us/search?q=${encodeURIComponent(details.title + ' ' + details.year)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-white px-5 py-2.5 rounded-xl text-sm font-black tracking-wide uppercase transition-all border border-stone-700 hover:border-yellow-600/30"
                  >
                    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    JustWatch
                  </a>
                </div>

                <button 
                  onClick={onClose}
                  className="inline-flex items-center gap-2 text-stone-400 hover:text-white px-5 py-2.5 rounded-xl text-sm font-black tracking-wide uppercase transition-all border border-stone-800 hover:border-stone-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                  </svg>
                  Back
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-20 text-center">
            <p className="text-stone-400 mb-6 font-medium">We couldn't find the details for this entry.</p>
            <button 
              onClick={onClose}
              className="bg-stone-800 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-stone-700 transition-all"
            >
              Return to Ceremony
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetailModal;
