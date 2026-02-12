
import React, { useState, useEffect, useMemo } from 'react';
import { AwardData, ViewMode, FilterMode, Nominee, AwardStatus } from './types';
import MovieDetailModal from './components/MovieDetailModal';
import AwardSearch from './components/AwardSearch';
import RoastModal from './components/RoastModal';
import { fetchAwardData, generateRedCarpetRoast } from './services/geminiService';
import { LATEST_VERIFIED_AWARDS } from './constants';

const getPosterUrl = (title: string, size: 'small' | 'large' = 'small') => {
  const seed = encodeURIComponent(title.toLowerCase().trim());
  const dimensions = size === 'small' ? '80/120' : '240/360';
  return `https://picsum.photos/seed/${seed}/${dimensions}`;
};

const App: React.FC = () => {
  const [currentAward, setCurrentAward] = useState<AwardData | null>(LATEST_VERIFIED_AWARDS);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.CATEGORY);
  const [filterMode, setFilterMode] = useState<FilterMode>(FilterMode.ALL);
  const [selectedMovie, setSelectedMovie] = useState<{title: string, year?: number, country?: string} | null>(null);
  const [categorySearch, setCategorySearch] = useState('');
  const [expandedMovies, setExpandedMovies] = useState<Set<string>>(new Set());
  const [showSearch, setShowSearch] = useState(false);
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const [now, setNow] = useState(Date.now());
  
  // Roast States
  const [showRoastModal, setShowRoastModal] = useState(false);
  const [roastText, setRoastText] = useState('');
  const [isRoasting, setIsRoasting] = useState(false);
  const [hasRoastedIds, setHasRoastedIds] = useState<Set<string>>(new Set());

  // Robust check for API key replacement from Vite
  const isApiKeyMissing = (() => {
    try {
      const key = process.env.API_KEY;
      return !key || key === "undefined" || key === "MISSING";
    } catch {
      return true;
    }
  })();

  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(() => {
    if (LATEST_VERIFIED_AWARDS) {
      return new Set(LATEST_VERIFIED_AWARDS.categories.map(c => c.id));
    }
    return new Set();
  });

  // Countdown and Lockdown logic
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isLocked = useMemo(() => {
    if (!currentAward || !currentAward.ceremonyDate) return false;
    try {
        const ceremonyTime = new Date(currentAward.ceremonyDate).getTime();
        return now >= ceremonyTime;
    } catch {
        return false;
    }
  }, [currentAward, now]);

  const timeLeft = useMemo(() => {
    if (!currentAward || !currentAward.ceremonyDate) return null;
    try {
        const diff = new Date(currentAward.ceremonyDate).getTime() - now;
        if (diff <= 0) return null;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds };
    } catch {
        return null;
    }
  }, [currentAward, now]);

  // Load Saved State with Error Boundaries
  useEffect(() => {
    if (!currentAward) return;

    try {
        const saved = localStorage.getItem('fyc_interactions_v2');
        if (saved) {
          const interactions = JSON.parse(saved);
          const newData = { ...currentAward };
          let changed = false;
          newData.categories.forEach(cat => {
            cat.nominees.forEach(nom => {
              const key = `${currentAward.year}_${nom.movieTitle}_${cat.name}`;
              if (interactions[key]) {
                nom.seen = interactions[key].seen || false;
                nom.predictionRank = interactions[key].rank || 0;
                nom.userResult = interactions[key].result || 'pending';
                changed = true;
              }
            });
          });
          if (changed) setCurrentAward(newData);
        }
    } catch (e) {
        console.warn("Failed to parse interactions from local storage", e);
    }
    
    try {
        const savedRoasts = localStorage.getItem('fyc_roasts_v2');
        if (savedRoasts) {
            const { text, ids } = JSON.parse(savedRoasts);
            setRoastText(text || '');
            setHasRoastedIds(new Set(ids || []));
        }
    } catch (e) {
        console.warn("Failed to parse roasts from local storage", e);
    }
  }, [currentAward?.id]);

  // Save State
  useEffect(() => {
    if (currentAward) {
      try {
          const interactions: Record<string, any> = JSON.parse(localStorage.getItem('fyc_interactions_v2') || '{}');
          currentAward.categories.forEach(cat => {
            cat.nominees.forEach(nom => {
              if (nom.seen || nom.predictionRank > 0 || (nom.userResult && nom.userResult !== 'pending')) {
                const key = `${currentAward.year}_${nom.movieTitle}_${cat.name}`;
                interactions[key] = {
                  seen: nom.seen,
                  rank: nom.predictionRank,
                  result: nom.userResult
                };
              }
            });
          });
          localStorage.setItem('fyc_interactions_v2', JSON.stringify(interactions));
      } catch (e) {
          console.error("Critical: Failed to save interactions", e);
      }
    }
  }, [currentAward]);

  const predictions = useMemo(() => {
    if (!currentAward) return [];
    return currentAward.categories.map(cat => ({
      category: cat,
      pick: cat.nominees.find(n => n.predictionRank === 1)
    })).filter(p => !!p.pick);
  }, [currentAward]);

  const stats = useMemo(() => {
    const totalAnnounced = predictions.filter(p => p.pick?.userResult === 'correct' || p.pick?.userResult === 'incorrect').length;
    const totalWins = predictions.filter(p => p.pick?.userResult === 'correct').length;
    const totalPredictions = predictions.length;
    return { totalWins, totalAnnounced, totalPredictions };
  }, [predictions]);

  // Roast Trigger Logic
  useEffect(() => {
    if (stats.totalPredictions > 0 && stats.totalAnnounced === stats.totalPredictions && currentAward) {
      const roastId = `${currentAward.id}_${stats.totalWins}_${stats.totalAnnounced}`;
      if (!hasRoastedIds.has(roastId)) {
        handleTriggerRoast();
      }
    }
  }, [stats.totalAnnounced, stats.totalPredictions, currentAward?.id]);

  const handleTriggerRoast = async () => {
    if (!currentAward) return;
    setIsRoasting(true);
    setShowRoastModal(true);
    
    const hits = predictions.filter(p => p.pick?.userResult === 'correct').map(p => p.pick!.movieTitle);
    const misses = predictions.filter(p => p.pick?.userResult === 'incorrect').map(p => p.pick!.movieTitle);

    try {
      const roast = await generateRedCarpetRoast(
        currentAward.name,
        currentAward.year,
        stats.totalWins,
        stats.totalAnnounced,
        hits,
        misses
      );
      setRoastText(roast);
      const roastId = `${currentAward.id}_${stats.totalWins}_${stats.totalAnnounced}`;
      const newIds = new Set(hasRoastedIds).add(roastId);
      setHasRoastedIds(newIds);
      localStorage.setItem('fyc_roasts_v2', JSON.stringify({ text: roast, ids: Array.from(newIds) }));
    } catch (error) {
      console.error("Roast failed:", error);
      setRoastText("Oh grow up! Your internet connection is as flimsy as a starlet's excuses. Come back when you're online, darling!");
    } finally {
      setIsRoasting(false);
    }
  };

  const handleSearch = async (awardName: string, year: number) => {
    if (isApiKeyMissing) {
      alert("API Key is missing. Please add API_KEY to your Secrets for this feature to work.");
      return;
    }
    setIsGlobalLoading(true);
    try {
      const data = await fetchAwardData(awardName, year);
      setCurrentAward(data);
      setCollapsedCategories(new Set(data.categories.map(c => c.id)));
      setShowSearch(false);
      setViewMode(ViewMode.CATEGORY);
    } catch (error) {
      console.error("Failed to fetch award data:", error);
      alert("Search failed. Ensure your API Key is valid and has Google Search grounding enabled.");
    } finally {
      setIsGlobalLoading(false);
    }
  };

  const toggleSeen = (categoryId: string, nomineeId: string) => {
    if (!currentAward) return;
    const newData = { ...currentAward };
    const category = newData.categories.find(c => c.id === categoryId);
    if (category) {
      const nominee = category.nominees.find(n => n.id === nomineeId);
      if (nominee) {
        const targetState = !nominee.seen;
        newData.categories.forEach(cat => {
          cat.nominees.forEach(n => {
            if (n.movieTitle === nominee.movieTitle) n.seen = targetState;
          });
        });
        setCurrentAward({ ...newData });
      }
    }
  };

  const toggleSeenByTitle = (title: string) => {
    if (!currentAward) return;
    const newData = { ...currentAward };
    let targetState = true;
    for (const cat of newData.categories) {
        const nom = cat.nominees.find(n => n.movieTitle === title);
        if (nom) {
            targetState = !nom.seen;
            break;
        }
    }
    newData.categories.forEach(cat => {
      cat.nominees.forEach(n => {
        if (n.movieTitle === title) n.seen = targetState;
      });
    });
    setCurrentAward({ ...newData });
  };

  const handleRank = (categoryId: string, nomineeId: string, rank: number) => {
    if (!currentAward || isLocked) return;
    const newData = { ...currentAward };
    const category = newData.categories.find(c => c.id === categoryId);
    if (category) {
      const nominee = category.nominees.find(n => n.id === nomineeId);
      if (!nominee) return;
      const isAlreadyThisRank = nominee.predictionRank === rank;
      category.nominees.forEach(n => {
        if (n.predictionRank === rank) n.predictionRank = 0;
      });
      nominee.predictionRank = isAlreadyThisRank ? 0 : rank;
      setCurrentAward({ ...newData });
    }
  };

  const handleSetResult = (categoryId: string, nomineeId: string, result: 'correct' | 'incorrect') => {
    if (!currentAward) return;
    const newData = { ...currentAward };
    const category = newData.categories.find(c => c.id === categoryId);
    if (category) {
      const nominee = category.nominees.find(n => n.id === nomineeId);
      if (nominee) {
        nominee.userResult = nominee.userResult === result ? 'pending' : result;
        setCurrentAward({ ...newData });
      }
    }
  };

  const toggleCategoryCollapse = (id: string) => {
    setCollapsedCategories(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const jumpToCategory = (categoryId: string, movieTitle: string) => {
    setCollapsedCategories(prev => {
      const next = new Set(prev);
      next.delete(categoryId);
      return next;
    });
    setViewMode(ViewMode.CATEGORY);
    setTimeout(() => {
      const el = document.getElementById(categoryId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const filteredCategories = useMemo(() => {
    if (!currentAward) return [];
    return currentAward.categories
      .filter(cat => cat.name.toLowerCase().includes(categorySearch.toLowerCase()))
      .map(cat => ({
        ...cat,
        nominees: cat.nominees.filter(nom => {
          if (filterMode === FilterMode.ALL) return true;
          if (filterMode === FilterMode.SEEN) return nom.seen;
          if (filterMode === FilterMode.UNSEEN) return !nom.seen;
          return true;
        })
      }))
      .filter(cat => cat.nominees.length > 0);
  }, [currentAward, filterMode, categorySearch]);

  const moviesGrouped = useMemo(() => {
    if (!currentAward) return [];
    const groups: Record<string, { title: string, nominations: { categoryId: string, categoryName: string, nominee: Nominee }[] }> = {};
    
    currentAward.categories.forEach(cat => {
      cat.nominees.forEach(nom => {
        if (filterMode === FilterMode.SEEN && !nom.seen) return;
        if (filterMode === FilterMode.UNSEEN && nom.seen) return;
        const matchesTitle = nom.movieTitle.toLowerCase().includes(categorySearch.toLowerCase());
        const matchesCategory = cat.name.toLowerCase().includes(categorySearch.toLowerCase());
        if (categorySearch && !matchesTitle && !matchesCategory) return;
        if (!groups[nom.movieTitle]) groups[nom.movieTitle] = { title: nom.movieTitle, nominations: [] };
        groups[nom.movieTitle].nominations.push({ categoryId: cat.id, categoryName: cat.name, nominee: nom });
      });
    });

    return Object.values(groups).sort((a, b) => b.nominations.length - a.nominations.length);
  }, [currentAward, filterMode, categorySearch]);

  const getStatusBadge = (status: AwardStatus) => {
    switch (status) {
      case 'official': return <span className="bg-yellow-600/20 text-yellow-500 border border-yellow-600/30 px-2.5 py-1 rounded text-[11px] font-bold tracking-tight">OFFICIAL</span>;
      case 'shortlist': return <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-2.5 py-1 rounded text-[11px] font-bold tracking-tight">SHORTLIST</span>;
      case 'contender': return <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-2.5 py-1 rounded text-[11px] font-bold tracking-tight uppercase">Contenders</span>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 pb-32">
      {isApiKeyMissing && (
        <div className="bg-red-900/50 border-b border-red-500/30 p-2 text-center text-[10px] font-bold uppercase tracking-widest text-red-200">
          Warning: API Key is not configured. Features will be limited.
        </div>
      )}
      <header className="sticky top-0 z-40 bg-stone-950/90 backdrop-blur-md border-b border-stone-800 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => { setShowSearch(false); setViewMode(ViewMode.CATEGORY); }}>
             <div className="w-10 h-10 md:w-11 md:h-11 bg-gradient-to-br from-yellow-400 via-yellow-600 to-yellow-800 rounded-full flex items-center justify-center shadow-lg ring-1 ring-yellow-500/20 flex-shrink-0">
                <svg className="w-6 h-6 text-stone-950" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
             </div>
             <div className="min-w-0">
                <h1 className="text-xl md:text-2xl font-black tracking-tighter text-white leading-none serif gold-gradient uppercase truncate">For Your Consideration</h1>
                {currentAward && (
                  <div className="mt-2 space-y-1.5 flex flex-col items-start">
                    <p className="text-stone-400 text-[11px] md:text-xs uppercase font-bold tracking-[0.15em] truncate">{currentAward.name} {currentAward.year}</p>
                    {getStatusBadge(currentAward.status)}
                  </div>
                )}
             </div>
          </div>
          
          {/* Timer Section */}
          {!showSearch && currentAward && currentAward.ceremonyDate && (
            <div className="hidden md:flex flex-col items-end text-right">
              {isLocked ? (
                <div className="flex items-center gap-2 bg-red-950/30 border border-red-900/50 px-3 py-1.5 rounded-lg">
                  <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-400">Picks Locked</span>
                </div>
              ) : timeLeft && (
                <div className="flex flex-col items-end">
                   <p className="text-[9px] uppercase font-black tracking-widest text-stone-500 mb-1">T-Minus Ceremony</p>
                   <div className="flex gap-2 font-mono text-sm font-bold text-yellow-500/90">
                      <span>{String(timeLeft.days).padStart(2, '0')}d</span>
                      <span className="animate-pulse">:</span>
                      <span>{String(timeLeft.hours).padStart(2, '0')}h</span>
                      <span className="animate-pulse">:</span>
                      <span>{String(timeLeft.minutes).padStart(2, '0')}m</span>
                      <span className="animate-pulse">:</span>
                      <span>{String(timeLeft.seconds).padStart(2, '0')}s</span>
                   </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Mobile Timer Bar */}
        {!showSearch && currentAward && currentAward.ceremonyDate && (
          <div className="md:hidden mt-4 pt-3 border-t border-stone-800 flex items-center justify-between">
            {isLocked ? (
              <div className="flex items-center gap-2 text-red-500">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Ballot Closed</span>
              </div>
            ) : timeLeft && (
              <div className="flex items-center justify-between w-full">
                <span className="text-[9px] uppercase font-black tracking-[0.2em] text-stone-500">T-Minus</span>
                <div className="flex gap-1.5 font-mono text-[10px] font-bold text-yellow-500/90">
                  <span>{timeLeft.days}d</span>
                  <span className="opacity-50">:</span>
                  <span>{String(timeLeft.hours).padStart(2, '0')}h</span>
                  <span className="opacity-50">:</span>
                  <span>{String(timeLeft.minutes).padStart(2, '0')}m</span>
                  <span className="opacity-50">:</span>
                  <span>{String(timeLeft.seconds).padStart(2, '0')}s</span>
                </div>
              </div>
            )}
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-6 py-4">
        {isGlobalLoading ? (
          <div className="py-32 flex flex-col items-center justify-center gap-6 animate-pulse">
            <div className="w-16 h-16 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="gold-gradient font-black uppercase tracking-[0.3em] text-sm text-center px-8">Gemini is scouring the industry archives...</p>
          </div>
        ) : showSearch ? (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <AwardSearch onSearch={handleSearch} isLoading={isGlobalLoading} />
            <div className="max-w-2xl mx-auto flex justify-center">
               <button onClick={() => { setCurrentAward(LATEST_VERIFIED_AWARDS); setShowSearch(false); }} className="text-stone-500 hover:text-stone-300 text-[11px] font-black uppercase tracking-widest transition-colors">
                 Reset to 98th Oscars (2026)
               </button>
            </div>
          </div>
        ) : currentAward ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-stone-800">
               <div className="flex flex-wrap items-center gap-4">
                 <div className="flex items-center gap-1">
                   {([FilterMode.ALL, FilterMode.SEEN, FilterMode.UNSEEN] as FilterMode[]).map(mode => (
                     <button
                      key={mode}
                      onClick={() => setFilterMode(mode)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-black transition-all tracking-widest uppercase ${filterMode === mode ? 'bg-stone-800 text-yellow-500 border border-yellow-600/30' : 'text-stone-400 hover:text-white'}`}
                     >
                       {mode}
                     </button>
                   ))}
                 </div>
                 <div className="relative">
                    <input 
                        type="text" 
                        placeholder={viewMode === ViewMode.MOVIE ? "Search movie..." : "Search category..."}
                        value={categorySearch}
                        onChange={(e) => setCategorySearch(e.target.value)}
                        className="bg-stone-900 border border-stone-800 rounded-full px-4 py-2 text-[11px] md:text-xs focus:outline-none focus:border-yellow-600 transition-colors w-40 md:w-56 text-white font-medium"
                    />
                 </div>
               </div>
            </div>

            {viewMode === ViewMode.CATEGORY && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-500">
                {filteredCategories.map(cat => {
                  const isCollapsed = collapsedCategories.has(cat.id);
                  const isInternational = cat.name.toLowerCase().includes('international');
                  return (
                    <div key={cat.id} id={cat.id} className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden hover:border-stone-700 transition-all flex flex-col h-fit scroll-mt-24">
                      <button 
                        onClick={() => toggleCategoryCollapse(cat.id)}
                        className="w-full text-left p-4 border-b border-stone-800 bg-stone-900/50 flex items-center justify-between group"
                      >
                        <h3 className="text-sm font-bold serif text-white tracking-tight leading-tight">{cat.name}</h3>
                        <div className={`transform transition-transform duration-300 text-stone-400 group-hover:text-yellow-500 ${isCollapsed ? '' : 'rotate-180'}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"/></svg>
                        </div>
                      </button>
                      {!isCollapsed && (
                        <div className="p-3 space-y-2 flex-1 animate-in slide-in-from-top-2 duration-300">
                          {cat.nominees.map(nom => (
                            <div key={nom.id} className={`p-2.5 rounded-xl border transition-all ${nom.seen ? 'bg-stone-950 border-stone-800/50' : 'bg-stone-950 border-stone-800 hover:border-stone-600'}`}>
                              <div className="flex gap-3">
                                <div 
                                  className="w-12 h-16 bg-stone-900 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer ring-1 ring-white/5 shadow-lg hover:ring-yellow-500/50 transition-all"
                                  onClick={() => setSelectedMovie({
                                    title: nom.movieTitle,
                                    year: currentAward.year,
                                    country: isInternational ? nom.individualName : undefined
                                  })}
                                >
                                  <img src={getPosterUrl(nom.movieTitle)} alt="" className="w-full h-full object-cover" loading="lazy" />
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                  <div className="flex justify-between items-start gap-2">
                                    <div className="flex-1 cursor-pointer min-w-0" onClick={() => setSelectedMovie({
                                      title: nom.movieTitle,
                                      year: currentAward.year,
                                      country: isInternational ? nom.individualName : undefined
                                    })}>
                                      <h4 className={`font-bold text-[13px] hover:text-yellow-500 transition-colors leading-tight break-normal ${nom.seen ? 'text-stone-500' : 'text-stone-100'}`}>
                                        {nom.movieTitle} {nom.isWinner && '🏆'}
                                      </h4>
                                      {nom.individualName && <p className="text-[11px] text-stone-400 mt-1 line-clamp-1 font-bold uppercase tracking-wider">{nom.individualName}</p>}
                                    </div>
                                    <button 
                                      onClick={() => toggleSeen(cat.id, nom.id)}
                                      className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${nom.seen ? 'text-green-500 bg-green-500/10' : 'text-stone-400 bg-stone-900 hover:text-stone-200'}`}
                                    >
                                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                                    </button>
                                  </div>
                                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/5">
                                    <span className="text-[11px] uppercase font-black text-stone-500 tracking-widest">
                                      {isLocked ? 'Closed' : 'Predict'}
                                    </span>
                                    <div className="flex gap-1.5">
                                      {[1, 2, 3].map(r => (
                                        <button 
                                          key={r}
                                          disabled={isLocked}
                                          onClick={() => handleRank(cat.id, nom.id, r)}
                                          className={`w-6 h-6 rounded flex items-center justify-center text-[11px] font-black transition-all ${isLocked && nom.predictionRank !== r ? 'opacity-20 pointer-events-none' : ''} ${nom.predictionRank === r ? 'bg-yellow-600 text-stone-950 shadow-sm' : 'bg-stone-800 text-stone-400 hover:text-white disabled:hover:text-stone-400'}`}
                                        >
                                          {r}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {viewMode === ViewMode.MOVIE && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-500">
                {moviesGrouped.map(movie => {
                  const isExpanded = expandedMovies.has(movie.title);
                  const isSeen = movie.nominations[0].nominee.seen;
                  const movieSlug = movie.title.replace(/\s+/g, '-');
                  return (
                    <div key={movie.title} id={`movie-${movieSlug}`} className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden hover:border-stone-700 transition-all scroll-mt-32 flex flex-col h-fit">
                      <div className="flex cursor-pointer hover:bg-stone-800/30 transition-colors" onClick={() => setExpandedMovies(prev => {
                          const next = new Set(prev);
                          if (next.has(movie.title)) next.delete(movie.title);
                          else next.add(movie.title);
                          return next;
                        })}>
                        <div className="w-24 h-36 flex-shrink-0 bg-stone-950 shadow-inner">
                          <img src={getPosterUrl(movie.title, 'large')} alt="" className="w-full h-full object-cover" loading="lazy" />
                        </div>
                        <div className="flex-1 p-4 flex flex-col justify-between">
                          <div className="min-w-0">
                            <h3 className={`text-base md:text-lg font-bold serif transition-colors tracking-tight leading-tight mb-2 ${isSeen ? 'text-stone-500' : 'text-white'}`}>
                              {movie.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2">
                              <div className={`px-2.5 py-1 rounded-md text-[11px] font-black transition-colors border ${isSeen ? 'bg-green-600/10 text-green-500 border-green-600/20' : 'bg-stone-800 text-yellow-500 border-stone-700'}`}>
                                {movie.nominations.length} NOM{movie.nominations.length > 1 ? 'S' : ''}
                              </div>
                              <button onClick={(e) => { e.stopPropagation(); toggleSeenByTitle(movie.title); }} className={`p-2 rounded-md transition-all border ${isSeen ? 'text-green-500 bg-green-500/10 border-green-600/20' : 'text-stone-400 bg-stone-800 border-stone-800 hover:text-stone-100'}`}>
                                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-2">
                            <button onClick={(e) => { e.stopPropagation(); setSelectedMovie({ title: movie.title, year: currentAward.year }); }} className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-[11px] font-black uppercase tracking-widest text-stone-300 rounded-lg transition-all border border-stone-700">Cast & Crew</button>
                            <div className={`transform transition-all duration-300 ${isExpanded ? 'rotate-180 text-yellow-500' : 'text-stone-400'}`}>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"/></svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      {isExpanded && (
                        <div className="bg-stone-950/50 p-3 border-t border-stone-800 grid grid-cols-1 gap-2 animate-in slide-in-from-top-1">
                          {movie.nominations.map((nom, i) => (
                            <button key={i} onClick={() => jumpToCategory(nom.categoryId, movie.title)} className={`p-3 rounded-xl border transition-all text-left group min-w-0 ${isSeen ? 'bg-stone-900/10 border-stone-900' : 'bg-stone-900/30 border-stone-800 hover:border-stone-700'}`}>
                              <p className="text-[11px] uppercase font-black text-stone-500 tracking-widest mb-1 group-hover:text-yellow-600 transition-colors">{nom.categoryName}</p>
                              <p className={`text-[12px] font-semibold leading-snug truncate ${isSeen ? 'text-stone-500' : 'text-stone-200'}`}>{nom.nominee.individualName || movie.title}</p>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {viewMode === ViewMode.PREDICTIONS && (
              <div className="max-w-4xl mx-auto space-y-4 animate-in fade-in duration-500">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-black serif text-white mb-2 tracking-tight">The Winners Circle</h2>
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-stone-400 text-[11px] md:text-xs font-bold uppercase tracking-widest">Your Predictions for {currentAward.name}</p>
                    {stats.totalAnnounced > 0 && (
                      <div className="flex flex-col items-center gap-3 mt-2">
                        <div className="bg-yellow-600/10 border border-yellow-600/30 px-4 py-1.5 rounded-full">
                          <span className="text-xs font-black uppercase tracking-[0.2em] gold-gradient">
                            Score: {stats.totalWins} / {stats.totalAnnounced}
                          </span>
                        </div>
                        {roastText && !isRoasting && (
                          <button 
                            onClick={() => setShowRoastModal(true)}
                            className="bg-gradient-to-r from-fuchsia-600/20 to-pink-600/20 hover:from-fuchsia-600/40 hover:to-pink-600/40 border border-fuchsia-500/30 px-5 py-2 rounded-full transition-all group shadow-lg"
                          >
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-fuchsia-400 group-hover:text-white transition-colors">
                              Review Red Carpet Roast
                            </span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {predictions.length === 0 ? (
                  <div className="py-20 text-center border-2 border-dashed border-stone-800 rounded-3xl">
                    <svg className="w-12 h-12 text-stone-800 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <p className="text-stone-400 text-[11px] font-bold uppercase tracking-widest px-8">Select your #1 picks in Category view to build your ballot.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {predictions.map(pred => (
                      <div key={pred.category.id} className="bg-stone-900 border border-stone-800 rounded-2xl p-4 hover:border-yellow-600/30 transition-all flex flex-col gap-4 shadow-xl">
                        <div className="flex gap-4">
                          <div className="w-16 h-24 bg-stone-950 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
                            <img src={getPosterUrl(pred.pick!.movieTitle)} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 flex flex-col justify-center min-w-0">
                             <h3 className="text-[11px] uppercase tracking-[0.2em] text-stone-400 font-black mb-2.5 truncate">{pred.category.name}</h3>
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-yellow-600/10 border border-yellow-600/30 rounded-full flex items-center justify-center text-yellow-500 font-black text-sm italic flex-shrink-0 shadow-inner">1</div>
                                <div className="min-w-0">
                                  <p className="text-white font-bold text-base leading-tight serif truncate">{pred.pick!.movieTitle}</p>
                                  <p className="text-[11px] text-stone-400 mt-1 font-bold uppercase tracking-wider truncate">{pred.pick!.individualName || 'Official Candidate'}</p>
                                </div>
                             </div>
                          </div>
                        </div>
                        <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest text-stone-500">Result</span>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleSetResult(pred.category.id, pred.pick!.id, 'correct')}
                              className={`px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all ${pred.pick?.userResult === 'correct' ? 'bg-green-600 text-stone-950 border-green-500' : 'bg-stone-800 text-stone-400 border-stone-700 hover:text-green-400'}`}
                            >
                              Winner
                            </button>
                            <button 
                              onClick={() => handleSetResult(pred.category.id, pred.pick!.id, 'incorrect')}
                              className={`px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all ${pred.pick?.userResult === 'incorrect' ? 'bg-red-600 text-stone-950 border-red-500' : 'bg-stone-800 text-stone-400 border-stone-700 hover:text-red-400'}`}
                            >
                              Lost
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="py-32 text-center">
            <h2 className="text-2xl font-black serif text-white mb-4">No Award Selected</h2>
            <button onClick={() => setShowSearch(true)} className="bg-yellow-600 text-stone-950 px-8 py-3 rounded-full font-black uppercase tracking-widest hover:bg-yellow-500 transition-all">
              Search for a Ceremony
            </button>
          </div>
        )}
      </main>

      {selectedMovie && (
        <MovieDetailModal 
          title={selectedMovie.title} 
          yearHint={selectedMovie.year} 
          countryHint={selectedMovie.country} 
          onClose={() => setSelectedMovie(null)} 
        />
      )}

      {showRoastModal && (
        <RoastModal 
          roast={roastText} 
          isLoading={isRoasting} 
          onClose={() => setShowRoastModal(false)} 
        />
      )}

      {!showSearch && currentAward && (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-stone-900/90 backdrop-blur-xl border border-stone-800 py-3.5 px-8 flex justify-between items-center z-40 w-[calc(100%-2.5rem)] max-w-sm rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/10">
            <button onClick={() => setViewMode(ViewMode.CATEGORY)} className={`flex flex-col items-center gap-2 transition-all flex-1 ${viewMode === ViewMode.CATEGORY ? 'text-yellow-500 scale-105' : 'text-stone-400 hover:text-stone-200'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 10h16M4 14h16"/></svg>
              <span className="text-[11px] font-black uppercase tracking-[0.2em]">Ballot</span>
            </button>
            <button onClick={() => setViewMode(ViewMode.MOVIE)} className={`flex flex-col items-center gap-2 transition-all flex-1 ${viewMode === ViewMode.MOVIE ? 'text-yellow-500 scale-105' : 'text-stone-400 hover:text-stone-200'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18"/></svg>
              <span className="text-[11px] font-black uppercase tracking-[0.2em]">Movies</span>
            </button>
            <button onClick={() => setViewMode(ViewMode.PREDICTIONS)} className={`flex flex-col items-center gap-2 transition-all flex-1 ${viewMode === ViewMode.PREDICTIONS ? 'text-yellow-500 scale-105' : 'text-stone-400 hover:text-stone-200'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <span className="text-[11px] font-black uppercase tracking-[0.2em]">Picks</span>
            </button>
        </nav>
      )}
    </div>
  );
};

export default App;
