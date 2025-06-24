'use client';

import React, { useState, useEffect } from 'react';
import { ChromeGrid } from "@/components/ui/ChromeGrid";
import { Sparkles, Clock, Copy } from 'lucide-react';
import { ParticleButton } from "@/components/ui/particle-button";

function App() {
  const [script, setScript] = useState('');
  const [results, setResults] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
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
    <div
      className="relative min-h-screen w-full overflow-hidden"
      onMouseMove={(e) => {
        setPointer({
          x: (e.clientX / window.innerWidth) * 2 - 1,
          y: -(e.clientY / window.innerHeight) * 2 + 1
        });
      }}
    >
      <div className="absolute inset-0 z-0">
        <ChromeGrid pointer={pointer} />
      </div>

      <div className="absolute z-10 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 pointer-events-none flex flex-col justify-center items-center">
        <h1 className="text-5xl md:text-7xl font-light tracking-widest text-white pointer-events-none mb-6">
          Script2Stock
        </h1>
        <p className="text-sm md:text-base text-white/70 font-mono tracking-wide pointer-events-none mb-6">
          Turn Video Scripts into Stock Footage Keywords
        </p>
        <div className="w-full max-w-2xl pointer-events-auto">
          <textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="Paste your video script here..."
            className="w-full h-40 p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400/50"
          />
          <div className="flex justify-center mt-4">
            <ParticleButton
              onClick={handleGenerate}
              disabled={isGenerating}
              variant="default"
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-md transition-all duration-300"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>🎬 Generate Keywords</>
              )}
            </ParticleButton>
          </div>
        </div>
      </div>

      {showResults && (
        <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <div className="max-w-4xl mx-auto text-white">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              Generated Keywords
            </h3>
            <div className="space-y-2">
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
                  <div key={idx} className="flex flex-col md:flex-row md:justify-between md:items-center bg-white/10 px-4 py-3 rounded-xl border border-white/10 gap-2">
                    <div className="flex-1 text-purple-300 font-mono text-sm break-words min-w-0">{line}</div>
                    <div className="flex flex-wrap gap-2 items-center justify-end min-w-[200px]">
                      <button
                        onClick={() => navigator.clipboard.writeText(keywordsOnly)}
                        className="p-2 rounded-md border border-blue-300/20 transition-all text-white bg-blue-500/20 hover:bg-blue-500/40"
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
                      <a href={platformUrls[selectedPlatform]} target="_blank" rel="noopener noreferrer" className="text-white text-xs bg-pink-500/20 hover:bg-yellow-500/40 px-3 py-1 rounded-md border border-yellow-300/20 transition-all">🔍 Search</a>
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
