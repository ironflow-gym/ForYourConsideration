
import React, { useState } from 'react';

interface AwardSearchProps {
  onSearch: (award: string, year: number) => void;
  isLoading: boolean;
}

const AwardSearch: React.FC<AwardSearchProps> = ({ onSearch, isLoading }) => {
  const [award, setAward] = useState('Oscars');
  const [year, setYear] = useState(2026); // Default to upcoming 98th Oscars year

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (award && year) {
      onSearch(award, year);
    }
  };

  return (
    <div className="bg-stone-900/50 p-8 rounded-2xl border border-stone-800 backdrop-blur-sm max-w-2xl mx-auto mb-12">
      <h2 className="text-3xl font-bold mb-6 text-center gold-gradient">Find an Award Ceremony</h2>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-5">
        <div className="flex-1">
          <label className="block text-[11px] font-black uppercase tracking-[0.15em] text-stone-400 mb-2.5">Award Name</label>
          <input
            type="text"
            value={award}
            onChange={(e) => setAward(e.target.value)}
            placeholder="e.g. Oscars, Golden Globes"
            className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-3.5 focus:outline-none focus:border-yellow-600 transition-colors text-white"
          />
        </div>
        <div className="w-full md:w-32">
          <label className="block text-[11px] font-black uppercase tracking-[0.15em] text-stone-400 mb-2.5">Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-3.5 focus:outline-none focus:border-yellow-600 transition-colors text-white"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full md:w-auto bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-stone-950 font-bold px-8 py-3.5 rounded-lg transition-all transform active:scale-95 disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : 'Fetch List'}
          </button>
        </div>
      </form>
      <p className="mt-5 text-[11px] text-stone-500 text-center uppercase font-bold tracking-[0.1em]">
        The system will verify official status vs industry contenders using Google Search.
      </p>
    </div>
  );
};

export default AwardSearch;
