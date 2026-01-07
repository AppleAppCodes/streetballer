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
    <div className="w-full h-screen bg-slate-900 text-white font-sans overflow-hidden">
      
      {gameState === GameState.MENU && (
        <div className="h-full flex flex-col items-center justify-center p-6 space-y-8 animate-in fade-in zoom-in duration-300">
          <div className="text-center space-y-2">
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-orange-600 drop-shadow-sm">
              STREET HOOPS
            </h1>
            <p className="text-slate-400">Telegram Mini Game Edition</p>
          </div>
          
          <div className="w-48 h-48 bg-slate-800 rounded-full flex items-center justify-center border-4 border-slate-700 shadow-2xl relative overflow-hidden group">
             <div className="absolute inset-0 bg-orange-500/10 rounded-full animate-pulse"></div>
             <Trophy size={80} className="text-yellow-500 drop-shadow-lg z-10" />
          </div>

          <button 
            onClick={startGame}
            className="group relative px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-bold text-xl transition-all active:scale-95 shadow-[0_10px_0_0_rgba(194,65,12,1)] hover:shadow-[0_6px_0_0_rgba(194,65,12,1)] hover:translate-y-1 active:translate-y-[4px] active:shadow-none w-full max-w-xs flex items-center justify-center gap-3"
          >
            <Play fill="currentColor" />
            JETZT SPIELEN
          </button>
          
          <div className="text-xs text-slate-500 max-w-xs text-center">
            Ziehe den Ball nach unten, ziele und lasse los, um zu werfen!
          </div>
        </div>
      )}

      {/* Game Layer - Always mounted when Playing to keep state fresh, or unmounted to reset? 
          For simplicity, we conditionally render. */}
      {gameState === GameState.PLAYING && (
        <Game gameState={gameState} onGameOver={handleGameOver} />
      )}

      {gameState === GameState.GAME_OVER && (
        <div className="h-full flex flex-col items-center justify-center p-6 space-y-6 animate-in slide-in-from-bottom duration-500 bg-slate-900/90 backdrop-blur-md absolute inset-0 z-50">
           <div className="text-center">
             <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-2">Runde Beendet</p>
             <h2 className="text-7xl font-black text-white drop-shadow-xl">{lastScore}</h2>
             <p className="text-orange-500 font-bold">PUNKTE</p>
           </div>

           {/* AI Coach Card */}
           <div className="w-full max-w-sm bg-slate-800/80 border border-slate-700 p-6 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
              <p className="text-xs font-bold text-blue-400 mb-2 uppercase flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                 Coach Gemini sagt:
              </p>
              {loadingComment ? (
                <div className="flex items-center gap-2 text-slate-400 text-sm animate-pulse">
                  <Loader2 className="animate-spin" size={16} />
                  Analysiere Wurftechnik...
                </div>
              ) : (
                <p className="text-slate-200 italic font-medium leading-relaxed">
                  "{coachComment}"
                </p>
              )}
           </div>

           <button 
            onClick={startGame}
            className="px-8 py-4 bg-white text-slate-900 hover:bg-slate-200 rounded-xl font-bold text-lg transition-colors w-full max-w-xs flex items-center justify-center gap-2 shadow-lg"
          >
            <RotateCcw size={20} />
            Nochmal spielen
          </button>
        </div>
      )}
    </div>
  );
}