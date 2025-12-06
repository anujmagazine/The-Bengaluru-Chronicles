import React, { useState } from 'react';
import { fetchPlaceChronicle } from './services/geminiService';
import { ChronicleData, GroundingSource } from './types';
import ChronicleCard from './components/ChronicleCard';
import { IconSearch } from './components/Icons';

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
    <div className="min-h-screen bg-[#fdfbf7] text-stone-800 pb-12">
      {/* Hero Section */}
      <header className="bg-emerald-900 text-emerald-50 py-12 px-4 shadow-lg border-b-4 border-orange-500">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 tracking-tight">
            The Bengaluru Chronicles
          </h1>
          <p className="text-emerald-200 text-lg md:text-xl font-light max-w-2xl mx-auto">
            Uncovering the stories, secrets, and savvy of Namma Bengaluru's streets.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 -mt-8">
        
        {/* Search Bar */}
        <div className="bg-white p-2 rounded-xl shadow-xl border border-stone-200 mb-8 max-w-2xl mx-auto flex items-center">
          <form onSubmit={handleSearch} className="flex-1 flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter a road, circle, or locality (e.g. Indiranagar)"
              className="w-full px-4 py-3 bg-transparent text-lg focus:outline-none placeholder-stone-400"
            />
            <button 
              type="submit"
              disabled={loading}
              className="bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-lg transition-colors flex-shrink-0 disabled:opacity-50"
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
          <div className="text-center mb-12">
            <p className="text-stone-500 mb-3 text-sm uppercase tracking-widest font-bold">Try asking about</p>
            <div className="flex flex-wrap justify-center gap-2">
              {suggestions.map(s => (
                <button 
                  key={s}
                  onClick={() => {
                    setQuery(s);
                    // Slight timeout to allow state update before potential auto-submit logic if we added it
                  }}
                  className="px-4 py-2 bg-white border border-stone-300 rounded-full text-stone-600 hover:border-emerald-500 hover:text-emerald-700 transition-colors shadow-sm text-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded max-w-2xl mx-auto mb-8">
            <p className="font-bold">Oops!</p>
            <p>{error}</p>
          </div>
        )}

        {/* Loading State Skeleton */}
        {loading && (
          <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-6 animate-pulse">
            <div className="h-8 bg-stone-200 rounded w-1/3 mx-auto"></div>
            <div className="space-y-3">
              <div className="h-4 bg-stone-200 rounded w-full"></div>
              <div className="h-4 bg-stone-200 rounded w-5/6"></div>
            </div>
            <div className="h-40 bg-stone-100 rounded"></div>
          </div>
        )}

        {/* Result Card */}
        {data && <ChronicleCard data={data} sources={sources} />}

        {/* Footer/Intro when empty */}
        {!data && !loading && !error && (
          <div className="text-center mt-12 opacity-60">
            <img 
              src="https://picsum.photos/seed/bangalore_vidhana/400/200" 
              alt="City Vibe" 
              className="mx-auto rounded-lg mb-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500"
            />
            <p className="text-sm">
              Discover the history behind the name. <br/>
              From British residents to local legends.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
