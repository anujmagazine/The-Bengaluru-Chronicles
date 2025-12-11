import React, { useState } from 'react';
import { fetchPlaceChronicle } from './services/geminiService';
import { ChronicleData, GroundingSource } from './types';
import ChronicleCard from './components/ChronicleCard';
import { IconSearch, IconCoffee, IconTree, IconCpu } from './components/Icons';

function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ChronicleData | null>(null);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);
    setSources([]);

    const response = await fetchPlaceChronicle(query);

    if (response.error) {
      setError(response.error);
    } else {
      setData(response.data);
      setSources(response.sources);
    }
    setLoading(false);
  };

  const suggestions = ["Lavelle Road", "Malleswaram", "Koramangala", "Anil Kumble Circle", "Cubbon Park"];

  return (
    <div className="min-h-screen text-stone-100 pb-12 pt-8">
      
      {/* Hero Section */}
      <header className="py-10 px-4 mb-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4 tracking-tight drop-shadow-lg text-white">
            The Bengaluru Chronicles
          </h1>
          <p className="text-emerald-100 text-xl md:text-2xl font-light max-w-2xl mx-auto drop-shadow-md">
            Swalpa history, swalpa mystery. <br/>
            <span className="text-lg opacity-90 italic">Uncovering the stories behind the street names.</span>
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4">
        
        {/* Search Bar - Glassmorphism */}
        <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl shadow-2xl border border-white/20 mb-10 max-w-2xl mx-auto flex items-center ring-1 ring-black/5">
          <form onSubmit={handleSearch} className="flex-1 flex items-center relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a road, circle, or area..."
              className="w-full pl-6 pr-4 py-3 bg-transparent text-xl text-white placeholder-emerald-100/60 focus:outline-none"
            />
            <button 
              type="submit"
              disabled={loading}
              className="absolute right-0 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white p-3 rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <IconSearch className="w-6 h-6" />
              )}
            </button>
          </form>
        </div>

        {/* Suggestions */}
        {!data && !loading && (
          <div className="text-center mb-16 animate-fade-in-up">
            <p className="text-emerald-200/80 mb-4 text-xs uppercase tracking-[0.2em] font-bold">Curated Searches</p>
            <div className="flex flex-wrap justify-center gap-3">
              {suggestions.map(s => (
                <button 
                  key={s}
                  onClick={() => {
                    setQuery(s);
                  }}
                  className="px-5 py-2 bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-white/10 rounded-full text-emerald-50 transition-all hover:-translate-y-1 shadow-sm text-sm font-medium"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900/80 backdrop-blur border-l-4 border-red-500 text-red-100 p-6 rounded-lg max-w-2xl mx-auto mb-8 shadow-xl">
            <p className="font-bold text-lg mb-1">Yappa!</p>
            <p>{error}</p>
          </div>
        )}

        {/* Loading State Skeleton */}
        {loading && (
          <div className="w-full max-w-3xl mx-auto bg-white/95 rounded-xl shadow-2xl p-8 space-y-8 animate-pulse">
            <div className="h-48 bg-stone-200 rounded-lg w-full mb-6"></div>
            <div className="h-8 bg-stone-200 rounded w-1/3 mx-auto"></div>
            <div className="space-y-4">
              <div className="h-4 bg-stone-200 rounded w-full"></div>
              <div className="h-4 bg-stone-200 rounded w-full"></div>
              <div className="h-4 bg-stone-200 rounded w-3/4"></div>
            </div>
          </div>
        )}

        {/* Result Card */}
        {data && <ChronicleCard data={data} sources={sources} />}

        {/* Footer/Intro when empty - The Essence of Bangalore */}
        {!data && !loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-20 opacity-80">
            <div className="flex flex-col items-center text-center p-4 rounded-xl hover:bg-white/5 transition-colors">
              <IconCoffee className="w-8 h-8 text-amber-300 mb-3" />
              <h3 className="font-serif font-bold text-amber-100 mb-1">Filter Coffee</h3>
              <p className="text-xs text-emerald-100/70">Fueling conversations since forever.</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-xl hover:bg-white/5 transition-colors">
              <IconTree className="w-8 h-8 text-emerald-400 mb-3" />
              <h3 className="font-serif font-bold text-emerald-100 mb-1">Garden City</h3>
              <p className="text-xs text-emerald-100/70">Blooms in every by-lane.</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-xl hover:bg-white/5 transition-colors">
              <IconCpu className="w-8 h-8 text-cyan-300 mb-3" />
              <h3 className="font-serif font-bold text-cyan-100 mb-1">Silicon Plateau</h3>
              <p className="text-xs text-emerald-100/70">Where code meets culture.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;