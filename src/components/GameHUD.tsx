import React from 'react';
import { GameMode, GameStats } from '../types/tetris';

interface GameHUDProps {
  stats: GameStats;
  mode: GameMode;
  highScore: number;
}

export const GameHUD: React.FC<GameHUDProps> = ({ stats, mode, highScore }) => {
  // Format seconds into MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerDisplay = () => {
    if (mode === 'ultra') {
      const remaining = Math.max(0, 120 - stats.timeElapsed);
      return {
        label: '남은 시간 (REMAINING)',
        value: formatTime(remaining),
        isAlert: remaining <= 20,
      };
    }
    return {
      label: '경과 시간 (TIME)',
      value: formatTime(stats.timeElapsed),
      isAlert: false,
    };
  };

  const timerInfo = getTimerDisplay();

  const getModeTitle = () => {
    switch (mode) {
      case 'marathon':
        return '마라톤 (Marathon)';
      case 'sprint':
        return '40줄 스프린트 (Sprint)';
      case 'ultra':
        return '2분 타임어택 (Ultra)';
      case 'zen':
        return '젠 모드 (Zen)';
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Mode Tag */}
      <div className="text-xs font-medium text-slate-400 flex items-center justify-between">
        <span>{getModeTitle()}</span>
        <span className="text-slate-500 font-mono-numbers">{timerInfo.value}</span>
      </div>

      {/* Main Score Cards */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 sm:p-4 shadow-md flex flex-col gap-2">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
            SCORE
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-white font-mono-numbers tracking-tight">
            {stats.score.toLocaleString()}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400">최고 기록</span>
          <span className="text-amber-400 font-bold font-mono-numbers">
            {highScore.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Secondary Meters: Level & Lines */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 shadow-md flex flex-col">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
            LEVEL
          </span>
          <span className="text-xl sm:text-2xl font-bold text-cyan-400 font-mono-numbers">
            {stats.level}
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 shadow-md flex flex-col">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
            LINES
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono-numbers">
              {stats.lines}
            </span>
            {mode === 'sprint' && (
              <span className="text-xs text-slate-500 font-mono-numbers">/ 40</span>
            )}
          </div>
        </div>
      </div>

      {/* Statistics breakdown preview */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 shadow-md hidden sm:flex flex-col gap-1.5 text-xs text-slate-400">
        <div className="flex justify-between">
          <span>테트리스 (4줄)</span>
          <span className="text-slate-200 font-mono-numbers font-medium">{stats.tetrises}</span>
        </div>
        <div className="flex justify-between">
          <span>최대 콤보</span>
          <span className="text-slate-200 font-mono-numbers font-medium">{stats.maxCombo > 0 ? `${stats.maxCombo}x` : '0'}</span>
        </div>
        <div className="flex justify-between">
          <span>배치된 블록</span>
          <span className="text-slate-200 font-mono-numbers font-medium">{stats.piecesPlaced}</span>
        </div>
      </div>
    </div>
  );
};
