import React from 'react';
import { ChronicleData, GroundingSource } from '../types';
import { IconMapPin, IconBookOpen, IconSparkles, IconActivity, IconKey } from './Icons';

interface ChronicleCardProps {
  data: ChronicleData;
  sources: GroundingSource[];
}

const ChronicleCard: React.FC<ChronicleCardProps> = ({ data, sources }) => {
  return (
    <div className="w-full max-w-3xl mx-auto bg-[#fdfbf7] text-stone-800 rounded-sm shadow-2xl overflow-hidden relative">
      {/* Paper texture overlay effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cardboard.png')] mix-blend-multiply z-10"></div>
      
      {/* Header Image (Abstract/Pattern) */}
      <div className="h-56 bg-stone-900 relative overflow-hidden group">
         {/* Background pattern */}
        <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 p-4 opacity-20">
            <div className="w-24 h-24 border-4 border-white rounded-full"></div>
        </div>

        <div className="absolute bottom-0 left-0 p-8 w-full z-20">
          <div className="flex items-center space-x-2 text-amber-400 mb-2">
             <IconMapPin className="w-4 h-4" />
             <span className="uppercase tracking-[0.2em] text-xs font-bold">Bangalore Coordinates</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white drop-shadow-lg leading-tight">{data.placeName}</h2>
        </div>
      </div>

      <div className="p-8 md:p-10 space-y-10 relative z-20">
        
        {data.isGeneric && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 text-amber-900 text-sm italic rounded-r shadow-sm">
            <strong>Chronicler's Note:</strong> That sounds like a navigational name! Here's the scoop on the neighborhood instead.
          </div>
        )}

        {/* Named After - The Main Highlight */}
        <section className="border-b border-stone-200 pb-8">
          <div className="flex items-center space-x-3 mb-4">
             <span className="text-2xl">🗣️</span>
             <h3 className="text-sm font-bold text-stone-500 uppercase tracking-widest">Named After</h3>
          </div>
          <p className="text-2xl md:text-3xl font-serif text-stone-900 italic leading-snug">
            {data.namedAfter}
          </p>
        </section>

        {/* The Secret Section - Styled like a classified file */}
        <section className="bg-stone-100 p-6 rounded-sm border border-stone-300 relative transform rotate-1 hover:rotate-0 transition-transform duration-300 shadow-md">
           {/* Tape effect */}
           <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-yellow-100/50 backdrop-blur border-l border-r border-white/40 rotate-1 shadow-sm"></div>

           <div className="flex items-center space-x-2 mb-3">
             <IconKey className="w-4 h-4 text-stone-500" />
             <h3 className="text-xs font-bold text-stone-500 uppercase tracking-[0.2em]">Classified Trivia</h3>
           </div>
           <p className="text-lg font-serif text-stone-800 leading-relaxed border-l-2 border-stone-400 pl-4">
             {data.secret}
           </p>
        </section>

        {/* The Backstory */}
        <section>
          <div className="flex items-center space-x-3 mb-4">
             <div className="text-stone-400">
                <IconBookOpen className="w-5 h-5" />
             </div>
             <h3 className="text-sm font-bold text-stone-500 uppercase tracking-widest">The History</h3>
          </div>
          <p className="text-stone-700 leading-relaxed text-lg font-light text-justify">
            {data.backstory}
          </p>
        </section>

        {/* The Vibe */}
        <section>
          <div className="flex items-center space-x-3 mb-4">
             <div className="text-stone-400">
                <IconSparkles className="w-5 h-5" />
             </div>
             <h3 className="text-sm font-bold text-stone-500 uppercase tracking-widest">Current Vibe</h3>
          </div>
          <p className="text-stone-700 text-lg italic">
            "{data.vibe}"
          </p>
        </section>

        {/* Fun Things To Do */}
        <section>
          <div className="flex items-center space-x-3 mb-6">
             <div className="text-stone-400">
                <IconActivity className="w-5 h-5" />
             </div>
             <h3 className="text-sm font-bold text-stone-500 uppercase tracking-widest">Local's Guide</h3>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            {data.activities.map((activity, idx) => (
              <div key={idx} className="group">
                <div className="text-4xl mb-3 opacity-80 group-hover:scale-110 transition-transform duration-300 origin-left">
                  {idx === 0 ? '☕' : idx === 1 ? '🏛️' : '🛍️'}
                </div>
                <h4 className="font-bold text-stone-900 mb-2 text-sm uppercase tracking-wide decoration-amber-400 underline decoration-2 underline-offset-4">{activity.title}</h4>
                <p className="text-stone-600 text-sm leading-relaxed">{activity.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Sources */}
        {sources.length > 0 && (
          <div className="border-t border-stone-200 pt-6 mt-8">
            <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3">Archived Sources</h4>
            <div className="flex flex-wrap gap-3">
              {sources.map((source, idx) => (
                <a 
                  key={idx} 
                  href={source.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-stone-500 hover:text-stone-900 transition-colors border-b border-stone-300 hover:border-stone-900 pb-0.5 truncate max-w-xs"
                >
                  {source.title}
                </a>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ChronicleCard;