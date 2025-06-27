'use client';

import React, { useState, useEffect } from 'react';
import { ChromeGrid } from "@/components/ui/ChromeGrid";
import { Sparkles, Copy, ArrowLeft } from 'lucide-react';
import { ParticleButton } from "@/components/ui/particle-button";

function App() {
  const [script, setScript] = useState('');
  const [results, setResults] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [platformSelections, setPlatformSelections] = useState<string[]>([]);
  const [overlayFrequency, setOverlayFrequency] = useState<'low' | 'medium' | 'high'>('medium');

  const updatePointerFromEvent = (clientX: number, clientY: number) => {
    setPointer({
      x: (clientX / window.innerWidth) * 2 - 1,
      y: -(clientY / window.innerHeight) * 2 + 1
    });
  };

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

  const handleBack = () => {
    setShowResults(false);
    setResults('');
    setScript('');
  };

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      onMouseMove={(e) => updatePointerFromEvent(e.clientX, e.clientY)}
      onTouchStart={(e) => {
        if (e.touches.length > 0) {
          const touch = e.touches[0];
          updatePointerFromEvent(touch.clientX, touch.clientY);
        }
      }}
      onTouchMove={(e) => {
        if (e.touches.length > 0) {
          const touch = e.touches[0];
          updatePointerFromEvent(touch.clientX, touch.clientY);
        }
      }}
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <ChromeGrid pointer={pointer} />
      </div>

      {/* Script2Stock Title - Landing and Result */}
      <div className={`absolute z-10 w-full left-1/2 -translate-x-1/2 ${showResults ? 'top-8' : 'top-1/2 -translate-y-1/2'} pointer-events-none flex justify-center`}>
        <h1 className="text-4xl md:text-6xl font-light tracking-widest text-white pointer-events-none text-center">
          Script2Stock
        </h1>
      </div>

      {/* Overlay Frequency Selector */}
      {!showResults && (
        <div className="absolute z-10 top-6 right-6 pointer-events-auto">
          <select
            className="bg-black/30 border border-white/20 text-white text-sm px-3 py-1 rounded-md backdrop-blur-md"
            value={overlayFrequency}
            onChange={(e) => setOverlayFrequency(e.target.value as 'low' | 'medium' | 'high')}
          >
            <option value="low">Overlay: Low</option>
            <option value="medium">Overlay: Medium</option>
            <option value="high">Overlay: High</option>
          </select>
        </div>
      )}

      {/* Input Section */}
      {!showResults && (
        <div className="absolute z-10 w-full left-1/2 -translate-x-1/2 top-[55%] -translate-y-1/2 flex flex-col items-center p-4 max-w-2xl pointer-events-auto">
          <p className="text-sm md:text-base text-white/70 font-mono tracking-wide mb-6 text-center max-w-md">
            Turn video scripts into stock footage keywords
          </p>
          <textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="Paste your video script here..."
            className="w-full h-40 p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-white/40 mb-4"
          />
          <ParticleButton
            onClick={handleGenerate}
            disabled={isGenerating}
            size="lg"
            className="!bg-black !text-white !border !border-white/10 !hover:bg-white/10 font-medium rounded-xl shadow-md transition-all duration-300 px-6 py-2 backdrop-blur-sm"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Generating...
              </>
            ) : (
              <>Generate Keywords</>
            )}
          </ParticleButton>
        </div>
      )}

      {/* Results Section */}
      {showResults && (
        <div className="absolute top-[25%] w-full z-10 px-4 flex justify-center">
          <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-6 max-w-4xl w-full text-white space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                Generated Keywords
              </h3>
              <button
                onClick={handleBack}
                className="flex items-center gap-1 text-sm text-white bg-white/10 hover:bg-white/20 border border-white/10 px-3 py-1 rounded-md transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            </div>
            <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
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
                    className="flex flex-col md:flex-row md:justify-between md:items-center bg-white/5 px-4 py-3 rounded-xl border border-white/10 gap-2"
                  >
                    <div className="flex-1 text-white font-mono text-sm break-words min-w-0">
                      {line}
                    </div>
                    <div className="flex flex-wrap gap-2 items-center justify-end min-w-[200px]">
                      <button
                        onClick={() => navigator.clipboard.writeText(keywordsOnly)}
                        className="p-2 rounded-md border border-white/20 transition-all text-white bg-white/10 hover:bg-white/20"
                        title="Copy"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <select
                        className="text-white text-xs bg-black/20 border border-white/20 rounded-md px-2 py-1 backdrop-blur-sm"
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
                        className="text-white text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded-md border border-white/20 transition-all"
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
