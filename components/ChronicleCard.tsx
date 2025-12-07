import React from 'react';
import { ChronicleData, GroundingSource } from '../types';
import { IconMapPin, IconBookOpen, IconSparkles, IconActivity, IconKey } from './Icons';

interface ChronicleCardProps {
  data: ChronicleData;
  sources: GroundingSource[];
}

const ChronicleCard: React.FC<ChronicleCardProps> = ({ data, sources }) => {
  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden border border-stone-200 animate-fade-in-up">
      {/* Header Image (Abstract/Pattern) */}
      <div className="h-48 bg-emerald-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute bottom-0 left-0 p-6 text-white w-full">
          <div className="flex items-center space-x-2 text-emerald-200 mb-1">
             <IconMapPin className="w-5 h-5" />
             <span className="uppercase tracking-widest text-xs font-bold">Bangalore Coordinates</span>
          </div>
          <h2 className="text-4xl font-serif font-bold text-white drop-shadow-md break-words">{data.placeName}</h2>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-8">
        
        {data.isGeneric && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 text-amber-800 rounded-r text-sm">
            <strong>Chronicler's Note:</strong> That sounds like a navigational name! Here's the scoop on the neighborhood instead.
          </div>
        )}

        {/* Named After */}
        <section>
          <div className="flex items-center space-x-2 mb-3">
             <div className="bg-orange-100 p-2 rounded-full text-orange-600">
               <span className="text-xl">🗣️</span>
             </div>
             <h3 className="text-lg font-bold text-stone-800 uppercase tracking-wide">Named After</h3>
          </div>
          <p className="text-xl font-serif text-stone-900 border-l-4 border-orange-200 pl-4 italic">
            {data.namedAfter}
          </p>
        </section>

        {/* The Secret Section - Highlighting the "interesting" part */}
        <section className="bg-stone-900 text-amber-50 p-6 rounded-lg relative overflow-hidden shadow-md">
           <div className="absolute -top-4 -right-4 text-stone-700 opacity-20 transform rotate-12">
              <IconKey className="w-32 h-32" />
           </div>
           <div className="relative z-10">
              <div className="flex items-center space-x-2 mb-2">
                <IconKey className="w-5 h-5 text-amber-400" />
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest">The Hidden Chronicle</h3>
              </div>
              <p className="text-lg font-serif italic text-amber-50 leading-relaxed">
                "{data.secret}"
              </p>
           </div>
        </section>

        {/* The Backstory */}
        <section>
          <div className="flex items-center space-x-2 mb-3">
             <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                <IconBookOpen className="w-5 h-5" />
             </div>
             <h3 className="text-lg font-bold text-stone-800 uppercase tracking-wide">The Backstory</h3>
          </div>
          <p className="text-stone-700 leading-relaxed text-lg">
            {data.backstory}
          </p>
        </section>

        {/* The Vibe */}
        <section>
          <div className="flex items-center space-x-2 mb-3">
             <div className="bg-purple-100 p-2 rounded-full text-purple-600">
                <IconSparkles className="w-5 h-5" />
             </div>
             <h3 className="text-lg font-bold text-stone-800 uppercase tracking-wide">The Vibe</h3>
          </div>
          <p className="text-stone-700 text-lg">
            {data.vibe}
          </p>
        </section>

        {/* Fun Things To Do */}
        <section>
          <div className="flex items-center space-x-2 mb-5">
             <div className="bg-emerald-100 p-2 rounded-full text-emerald-600">
                <IconActivity className="w-5 h-5" />
             </div>
             <h3 className="text-lg font-bold text-stone-800 uppercase tracking-wide">Curated Local Picks</h3>
          </div>
          
          <div className="grid gap-4 md:grid-cols-3">
            {data.activities.map((activity, idx) => (
              <div key={idx} className="bg-stone-50 rounded-lg p-5 border border-stone-200 hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="text-3xl mb-3 opacity-90">
                  {idx === 0 ? '☕' : idx === 1 ? '🏛️' : '🛍️'}
                </div>
                <h4 className="font-bold text-stone-900 mb-2 text-sm uppercase tracking-wide border-b border-stone-200 pb-2">{activity.title}</h4>
                <p className="text-stone-600 text-sm leading-snug">{activity.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Sources */}
        {sources.length > 0 && (
          <div className="border-t border-stone-200 pt-4 mt-8">
            <h4 className="text-xs font-bold text-stone-400 uppercase mb-2">Sources from the Archives</h4>
            <div className="flex flex-wrap gap-2">
              {sources.map((source, idx) => (
                <a 
                  key={idx} 
                  href={source.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-emerald-600 hover:underline bg-emerald-50 px-2 py-1 rounded"
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