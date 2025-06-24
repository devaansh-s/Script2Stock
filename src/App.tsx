'use client';

import React, { useState } from 'react';
import { Film, Sparkles, Clock, Copy } from 'lucide-react';
import { ChromeGrid } from '@/components/ui/ChromeGrid';

export default function App() {
  const [script, setScript] = useState('');
  const [results, setResults] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [platformSelections, setPlatformSelections] = useState<string[]>([]);
  const [overlayFrequency, setOverlayFrequency] = useState<'low' | 'medium' | 'high'>('medium');

  const handleGenerate = async () => {
    if (!script.trim()) {
      alert("Please paste a script first.");
      return;
    }

    setIsGenerating(true);
    setResults('');
    setShowResults(false);

    try {
      const response = await fetch("https://script2stock-backend.onrender.com/generate-keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script, overlayFrequency }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong.");

      setResults(data.keywords);
      setPlatformSelections(Array(data.keywords.split('\n').length).fill('storyblocks'));
      setShowResults(true);
    } catch (error: any) {
      console.error("Error generating keywords:", error);
      alert("Error generating keywords. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden text-white font-sans">
      {/* 🔮 3D ChromeGrid Background */}
      <div className="absolute inset-0 z-0">
        <ChromeGrid />
      </div>

      {/* Optional overlay tint */}
      <div className="absolute inset-0 bg-black/50 z-0" />

      {/* 🌟 Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="absolute z-10 left-1/2 -translate-x-1/2 top-[15%] pointer-events-none flex flex-col justify-center items-center">
          <h1 className="text-4xl md:text-6xl font-light mb-4 tracking-widest text-white whitespace-nowrap">
            Script2Stock
          </h1>
          <p className="text-sm md:text-base text-white/70 font-mono tracking-wide pointer-events-none">
            Turn video scripts into stock footage keywords
          </p>
        </div>

        {/* Input Box + Button */}
        <div className="w-full max-w-2xl mt-48 space-y-6 z-10">
          <textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="Paste your video script here..."
            className="w-full h-56 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all"
          />

          <div className="flex justify-between items-center">
            <select
              value={overlayFrequency}
              onChange={(e) => setOverlayFrequency(e.target.value as 'low' | 'medium' | 'high')}
              className="bg-white/10 border border-white/30 rounded-md px-3 py-2 backdrop-blur-sm text-white"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition-all text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? "Generating..." : "🎬 Generate Keywords"}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {showResults && (
          <div className="w-full max-w-4xl mt-12 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              Generated Keywords
            </h2>

            {results.split('\n').map((line, idx) => {
              const keywordsOnly = line.split(']').slice(1).join(']').trim();
              const encodedSearch = encodeURIComponent(keywordsOnly);
              const selectedPlatform = platformSelections[idx] || 'storyblocks';

              const platformUrls: Record<string, string> = {
                storyblocks: `https://www.storyblocks.com/all-video/search/${encodedSearch}?search-origin=search_bar`,
                pexels: `https://www.pexels.com/search/videos/${encodedSearch}/`,
                pixabay: `https://pixabay.com/videos/search/${encodedSearch}/`,
              };

              const handlePlatformChange = (newPlatform: string) => {
                const updated = [...platformSelections];
                updated[idx] = newPlatform;
                setPlatformSelections(updated);
              };

              return (
                <div key={idx} className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 bg-white/10 px-4 py-3 rounded-xl border border-white/10">
                  <div className="flex-1 text-purple-300 font-mono text-sm break-words">{line}</div>
                  <div className="flex flex-wrap gap-2 items-center justify-end min-w-[200px]">
                    <button
                      onClick={() => navigator.clipboard.writeText(keywordsOnly)}
                      className="p-2 rounded-md border border-blue-300/20 transition-all text-white bg-blue-500/20 hover:bg-blue-500/40 hover:scale-110 active:scale-95"
                      title="Copy"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <select
                      className="text-black text-xs bg-blue/10 border border-white/20 rounded-md px-2 py-1"
                      value={selectedPlatform}
                      onChange={(e) => handlePlatformChange(e.target.value)}
                    >
                      <option value="storyblocks">🎞️ Storyblocks</option>
                      <option value="pexels">📽️ Pexels</option>
                      <option value="pixabay">🎬 Pixabay</option>
                    </select>
                    <a
                      href={platformUrls[selectedPlatform]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white text-xs bg-pink-500/20 hover:bg-yellow-500/40 px-3 py-1 rounded-md border border-yellow-300/20"
                    >
                      🔍 Search
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
