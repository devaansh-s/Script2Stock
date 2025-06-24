'use client'

import React, { useState } from 'react';
import { Clock, Copy, Sparkles } from 'lucide-react';
import { ChromeGrid } from "@/components/ui/ChromeGrid";
import { ParticleButton } from "@/components/ui/particle-button";

function App() {
  const [script, setScript] = useState('');
  const [results, setResults] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [platformSelections, setPlatformSelections] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

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
        body: JSON.stringify({ script }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong.");

      setResults(data.keywords);
      setPlatformSelections(Array(data.keywords.split('\n').length).fill('storyblocks'));
      setShowResults(true);
    } catch (error) {
      console.error("Error generating keywords:", error);
      alert("❌ Something went wrong.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen w-screen relative overflow-hidden">
      {/* 🔮 ChromeGrid Background */}
      <div className="absolute inset-0 z-0">
        <ChromeGrid />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-0" />

      {/* 🌟 Centered UI */}
      <div className="absolute z-10 left-1/2 -translate-x-1/2 top-24 md:top-32 pointer-events-none flex flex-col justify-center items-center px-4 w-full">
        <h1 className="text-5xl md:text-7xl font-light mb-4 tracking-widest text-white whitespace-nowrap">
          Script2Stock
        </h1>
        <p className="text-sm md:text-base text-white/70 font-mono tracking-wide mb-6">
          Turn video scripts into stock keywords
        </p>

        {/* Input & Button */}
        <div className="pointer-events-auto w-full max-w-xl space-y-4 mb-10">
          <div className="relative">
            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              placeholder="Paste your video script here..."
              className="w-full h-48 p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
            />
            <div className="absolute top-4 right-4">
              <Clock className="w-5 h-5 text-white/40" />
            </div>
          </div>

          <ParticleButton
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl py-3 transition-all duration-300 hover:scale-105"
          >
            {isGenerating ? (
              <div className="flex justify-center items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </div>
            ) : (
              <>🎬 Generate Keywords</>
            )}
          </ParticleButton>
        </div>
      </div>

      {/* 🧠 Results Section */}
      {showResults && (
        <div className="absolute z-10 w-full bottom-10 left-1/2 -translate-x-1/2 px-4 max-w-5xl">
          <div className="bg-black/60 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <h3 className="text-lg md:text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              Generated Keywords
            </h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
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
                  const updatedSelections = [...platformSelections];
                  updatedSelections[idx] = newPlatform;
                  setPlatformSelections(updatedSelections);
                };

                return (
                  <div
                    key={idx}
                    className="flex flex-col md:flex-row md:justify-between md:items-center bg-white/10 px-4 py-3 rounded-xl border border-white/10 gap-2"
                  >
                    <div className="flex-1 text-purple-300 font-mono text-sm break-words min-w-0">{line}</div>
                    <div className="flex flex-wrap gap-2 items-center justify-end min-w-[200px]">
                      <button
                        onClick={() => navigator.clipboard.writeText(keywordsOnly)}
                        className="p-2 rounded-md border border-blue-300/20 text-white bg-blue-500/20 hover:bg-blue-500/40 hover:scale-110 transition-all"
                        title="Copy"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <select
                        className="text-black text-xs bg-blue/10 border border-white/20 rounded-md px-2 py-1 backdrop-blur-sm"
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
                        className="text-white text-xs bg-pink-500/20 hover:bg-yellow-500/40 px-3 py-1 rounded-md border border-yellow-300/20 transition-all"
                      >
                        🔍 Search
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
