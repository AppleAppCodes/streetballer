import React, { useState } from 'react';
import { Trophy, Play, RotateCcw, Loader2 } from 'lucide-react';
import { Game } from './components/Game';
import { getCoachComment } from './services/geminiService';
import { GameState } from './types';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [lastScore, setLastScore] = useState(0);
  const [coachComment, setCoachComment] = useState("");
  const [loadingComment, setLoadingComment] = useState(false);

  const startGame = () => {
    setGameState(GameState.PLAYING);
    setCoachComment("");
  };

  const handleGameOver = async (score: number, shotsTaken: number) => {
    setLastScore(score);
    setGameState(GameState.GAME_OVER);

    // Fetch AI comment
    setLoadingComment(true);
    const comment = await getCoachComment(score, shotsTaken);
    setCoachComment(comment);
    setLoadingComment(false);
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-[#2c0e37] via-[#4a1c40] to-[#fd7e14] text-white overflow-hidden relative font-[family-name:var(--font-body)]">
      <div className="noise-overlay"></div>

      {gameState === GameState.MENU && (
        <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 space-y-12 animate-in fade-in zoom-in duration-500">
          <div className="text-center space-y-2">
            <h1 className="text-8xl font-[family-name:var(--font-display)] tracking-wider text-transparent bg-clip-text bg-gradient-to-t from-orange-300 to-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] transform -rotate-2">
              STREET HOOPS
            </h1>
            <p className="text-orange-200/80 tracking-[0.2em] font-bold text-sm uppercase">Telegram Mini Game Edition</p>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full animate-pulse"></div>
            <div className="w-56 h-56 bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 shadow-2xl relative overflow-hidden transition-transform duration-500 hover:scale-105">
              <Trophy size={100} className="text-orange-400 drop-shadow-[0_0_15px_rgba(251,146,60,0.6)] z-10 animate-float" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
          </div>

          <button
            onClick={startGame}
            className="group relative px-10 py-5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-2xl font-[family-name:var(--font-display)] text-3xl tracking-wide transition-all active:scale-95 shadow-[0_0_30px_rgba(234,88,12,0.4)] hover:shadow-[0_0_50px_rgba(234,88,12,0.6)] hover:-translate-y-1 w-full max-w-xs flex items-center justify-center gap-4 overflow-hidden border border-white/20"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <Play fill="currentColor" size={28} />
            JETZT SPIELEN
          </button>

          <div className="text-sm text-white/50 font-medium tracking-wide bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm">
            Wische nach oben, um den Ball zu werfen!
          </div>
        </div>
      )}

      {/* Game Layer */}
      {gameState === GameState.PLAYING && (
        <Game gameState={gameState} onGameOver={handleGameOver} />
      )}

      {gameState === GameState.GAME_OVER && (
        <div className="h-full flex flex-col items-center justify-center p-6 space-y-8 animate-in slide-in-from-bottom duration-500 bg-black/80 backdrop-blur-xl absolute inset-0 z-50">
          <div className="text-center relative">
            <div className="absolute -inset-10 bg-orange-500/20 blur-3xl rounded-full"></div>
            <p className="relative text-white/60 font-[family-name:var(--font-display)] tracking-widest text-2xl mb-2">Runde Beendet</p>
            <h2 className="relative text-[10rem] leading-none font-[family-name:var(--font-display)] text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 drop-shadow-2xl font-black">{lastScore}</h2>
            <p className="relative text-orange-500 font-[family-name:var(--font-display)] text-4xl tracking-widest">PUNKTE</p>
          </div>

          {/* AI Coach Card */}
          <div className="w-full max-w-sm bg-white/5 border border-white/10 p-6 rounded-3xl relative overflow-hidden backdrop-blur-md shadow-2xl">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-400 to-purple-500"></div>
            <p className="text-xs font-bold text-blue-300 mb-3 uppercase flex items-center gap-2 tracking-wider">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse box-shadow-[0_0_10px_rgba(96,165,250,0.8)]"></span>
              Coach Gemini sagt:
            </p>
            {loadingComment ? (
              <div className="flex items-center gap-3 text-white/50 text-sm animate-pulse py-2">
                <Loader2 className="animate-spin text-blue-400" size={20} />
                Analysiere Wurftechnik...
              </div>
            ) : (
              <p className="text-white/90 italic text-lg font-medium leading-relaxed">
                "{coachComment}"
              </p>
            )}
          </div>

          <button
            onClick={startGame}
            className="px-8 py-4 bg-white text-black hover:bg-gray-200 rounded-xl font-[family-name:var(--font-display)] text-2xl tracking-wide transition-all hover:scale-105 active:scale-95 w-full max-w-xs flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            <RotateCcw size={24} />
            Nochmal spielen
          </button>
        </div>
      )}
    </div>
  );
}