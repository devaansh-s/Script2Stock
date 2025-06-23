import React, { useState, useEffect } from 'react';
import { Film, Sparkles, Clock } from 'lucide-react';

function App() {
  const [script, setScript] = useState('');
  const [results, setResults] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ script }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setResults(data.keywords);
      setShowResults(true);
    } catch (error: any) {
      console.error("Error generating keywords:", error);
      alert("Error generating keywords. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop)',
        }}
      />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Animated Lights */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400/30 rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-3 h-3 bg-purple-400/20 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-1/4 w-1 h-1 bg-pink-400/40 rounded-full animate-ping" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-cyan-400/25 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Main Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className={`w-full max-w-4xl transition-all duration-1000 ease-out ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl" />

            {/* Header */}
            <div className="relative z-10 text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl backdrop-blur-sm border border-white/20">
                  <Film className="w-8 h-8 text-white" />
                </div>
                <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl backdrop-blur-sm border border-white/20">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Script2Stock
                </span>
              </h1>
              <h2 className="text-xl md:text-2xl text-white/90 mb-4 font-medium">
                Turn Video Scripts into Stock Footage Keywords
              </h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
                Paste your video script below. Our AI will generate timestamped keywords to match stock assets faster.
              </p>
            </div>

            {/* Input */}
            <div className="relative z-10 space-y-6">
              <div className="relative">
                <textarea
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  placeholder="Paste your video script here..."
                  className="w-full h-64 p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all duration-300"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                />
                <div className="absolute top-4 right-4">
                  <Clock className="w-5 h-5 text-white/40" />
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className={`w-full md:w-auto mx-auto block px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                  !isGenerating ? 'animate-pulse hover:animate-none' : ''
                }`}
              >
                <span className="flex items-center justify-center gap-2 text-lg">
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>🎬 Generate Keywords</>
                  )}
                </span>
              </button>
            </div>

            {/* Results */}
            {showResults && (
              <div className="relative z-10 mt-8 transition-all duration-500 ease-out opacity-100 translate-y-0">
                <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    Generated Keywords
                  </h3>
                  <div className="space-y-2">
                    {results.split('\n').map((line, idx) => {
                      const keywordsOnly = line.split(']').slice(1).join(']').trim();
                      const encodedSearch = encodeURIComponent(keywordsOnly);

                      return (
                        <div
                          key={idx}
                          className="flex flex-col md:flex-row md:justify-between md:items-center bg-white/10 px-4 py-3 rounded-xl border border-white/10 gap-2"
                        >
                          <span className="text-green-300 font-mono text-sm break-words">{line}</span>
                          <div className="flex gap-2 flex-wrap">
                            <button
                              onClick={() => navigator.clipboard.writeText(keywordsOnly)}
                              className="text-white text-xs bg-blue-500/20 hover:bg-blue-500/40 px-3 py-1 rounded-md border border-blue-300/20 transition-all"
                            >
                              📋 Copy
                            </button>

                            <a
                              href={`https://www.storyblocks.com/all-video/search/${encodedSearch}?search-origin=search_bar`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white text-xs bg-yellow-500/20 hover:bg-yellow-500/40 px-3 py-1 rounded-md border border-yellow-300/20 transition-all"
                            >
                              🎞️ Storyblocks
                            </a>

                            <a
                              href={`https://www.pexels.com/search/videos/${encodedSearch}/`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white text-xs bg-green-500/20 hover:bg-green-500/40 px-3 py-1 rounded-md border border-green-300/20 transition-all"
                            >
                              📽️ Pexels
                            </a>

                            <a
                              href={`https://pixabay.com/videos/search/${encodedSearch}/`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white text-xs bg-red-500/20 hover:bg-red-500/40 px-3 py-1 rounded-md border border-red-300/20 transition-all"
                            >
                              🎬 Pixabay
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Feature Section */}
            <div className="relative z-10 mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: <Clock className="w-6 h-6 text-blue-300" />, title: "Timestamped", desc: "Keywords matched to specific moments in your script" },
                { icon: <Sparkles className="w-6 h-6 text-purple-300" />, title: "AI-Powered", desc: "Smart keyword generation using advanced AI" },
                { icon: <Film className="w-6 h-6 text-pink-300" />, title: "Stock-Ready", desc: "Keywords optimized for stock footage searches" },
              ].map(({ icon, title, desc }, i) => (
                <div key={i} className="text-center p-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-3">{icon}</div>
                  <h4 className="text-white font-semibold mb-2">{title}</h4>
                  <p className="text-white/60 text-sm">{desc}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
