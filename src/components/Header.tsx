import React from 'react';
import { GameMode, GameState } from '../types/tetris';
import { Volume2, VolumeX, Music, Settings, Trophy, Pause, Play } from 'lucide-react';

interface HeaderProps {
  currentMode: GameMode;
  gameState: GameState;
  onSelectMode: (mode: GameMode) => void;
  onOpenSettings: () => void;
  onOpenLeaderboard: () => void;
  onTogglePause: () => void;
  sfxOn: boolean;
  onToggleSfx: () => void;
  musicOn: boolean;
  onToggleMusic: () => void;
  onStartGame: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  gameState,
  onSelectMode,
  onOpenSettings,
  onOpenLeaderboard,
  onTogglePause,
  sfxOn,
  onToggleSfx,
  musicOn,
  onToggleMusic,
  onStartGame,
}) => {
  return (
    <header className="w-full flex items-center justify-between gap-4 sm:gap-8 px-4 sm:px-8 py-3.5 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 select-none">
      {/* Zone 1: Brand wordmark (single line text element) */}
      <div className="flex items-center gap-2">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onSelectMode('marathon');
          }}
          className="text-lg sm:text-xl font-extrabold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-1.5"
        >
          <span className="text-cyan-400">TETRIS</span>
          <span className="text-indigo-400">ARCADE</span>
        </a>
      </div>

      {/* Zone 2: Concise navigation links (single line) */}
      <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-400">
        <button
          type="button"
          onClick={() => onSelectMode('marathon')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            currentMode === 'marathon' ? 'text-cyan-400 font-semibold' : ''
          }`}
        >
          마라톤
        </button>
        <button
          type="button"
          onClick={() => onSelectMode('sprint')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            currentMode === 'sprint' ? 'text-cyan-400 font-semibold' : ''
          }`}
        >
          40줄 스프린트
        </button>
        <button
          type="button"
          onClick={() => onSelectMode('ultra')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            currentMode === 'ultra' ? 'text-cyan-400 font-semibold' : ''
          }`}
        >
          2분 타임어택
        </button>
        <button
          type="button"
          onClick={onOpenLeaderboard}
          className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 text-amber-400"
        >
          <Trophy className="w-3.5 h-3.5" />
          랭킹
        </button>
      </nav>

      {/* Zone 3: Primary action & controls */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Quick audio toggles */}
        <button
          type="button"
          onClick={onToggleSfx}
          className={`p-2 rounded-lg border text-xs transition-colors ${
            sfxOn
              ? 'bg-slate-900 border-slate-700 text-cyan-400'
              : 'bg-slate-950 border-slate-800 text-slate-600'
          }`}
          title={`효과음: ${sfxOn ? 'ON' : 'OFF'}`}
        >
          {sfxOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        <button
          type="button"
          onClick={onToggleMusic}
          className={`p-2 rounded-lg border text-xs transition-colors ${
            musicOn
              ? 'bg-slate-900 border-indigo-700 text-indigo-400'
              : 'bg-slate-950 border-slate-800 text-slate-600'
          }`}
          title={`BGM: ${musicOn ? 'ON' : 'OFF'}`}
        >
          <Music className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          className="p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
          title="설정"
        >
          <Settings className="w-4 h-4" />
        </button>

        {gameState === 'PLAYING' ? (
          <button
            type="button"
            onClick={onTogglePause}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 border border-slate-700"
          >
            <Pause className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">일시정지</span>
          </button>
        ) : gameState === 'PAUSED' ? (
          <button
            type="button"
            onClick={onTogglePause}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>계속하기</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onStartGame}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
          >
            게임 시작
          </button>
        )}
      </div>
    </header>
  );
};
