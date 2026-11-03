import React from 'react';
import { GameMode, GameStats } from '../types/tetris';
import { Trophy, RefreshCw, Home } from 'lucide-react';

interface GameOverModalProps {
  stats: GameStats;
  mode: GameMode;
  isNewHighScore: boolean;
  onRestart: () => void;
  onMainMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  stats,
  mode,
  isNewHighScore,
  onRestart,
  onMainMenu,
}) => {
  const isSprintVictory = mode === 'sprint' && stats.lines >= 40;

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl flex flex-col gap-5 text-center">
        {/* Title */}
        <div>
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-800/90 border border-slate-700/60 mb-3 shadow-inner">
            <Trophy className={`w-7 h-7 ${isSprintVictory || isNewHighScore ? 'text-amber-400' : 'text-slate-400'}`} />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {isSprintVictory ? '스프린트 완주 성공!' : '게임 오버'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isSprintVictory
              ? `40줄을 ${formatTime(stats.timeElapsed)}만에 클리어했습니다!`
              : '수고하셨습니다! 결과를 확인하세요.'}
          </p>

          {isNewHighScore && (
            <div className="mt-2 inline-block bg-amber-500/20 text-amber-300 font-semibold text-xs px-3 py-1 rounded-full border border-amber-500/30">
              최고 기록 달성!
            </div>
          )}
        </div>

        {/* Highlight Score */}
        <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-4 flex flex-col items-center">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
            최종 점수 (FINAL SCORE)
          </span>
          <span className="text-3xl sm:text-4xl font-extrabold text-cyan-400 font-mono-numbers">
            {stats.score.toLocaleString()}
          </span>
        </div>

        {/* Detailed Stats Grid */}
        <div className="grid grid-cols-2 gap-2 text-left text-xs bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
          <div className="flex justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-400">클리어 라인</span>
            <span className="text-white font-mono-numbers font-medium">{stats.lines}줄</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-400">도달 레벨</span>
            <span className="text-white font-mono-numbers font-medium">Lv. {stats.level}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-400">테트리스 (4줄)</span>
            <span className="text-emerald-400 font-mono-numbers font-medium">{stats.tetrises}회</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-400">최대 콤보</span>
            <span className="text-amber-400 font-mono-numbers font-medium">
              {stats.maxCombo > 0 ? `${stats.maxCombo}x` : '0'}
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-400">배치된 블록</span>
            <span className="text-white font-mono-numbers font-medium">{stats.piecesPlaced}개</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-400">플레이 타임</span>
            <span className="text-white font-mono-numbers font-medium">{formatTime(stats.timeElapsed)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
          <button
            type="button"
            onClick={onRestart}
            className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <RefreshCw className="w-4 h-4" />
            다시 플레이 (R)
          </button>
          <button
            type="button"
            onClick={onMainMenu}
            className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Home className="w-4 h-4" />
            메인 메뉴
          </button>
        </div>
      </div>
    </div>
  );
};
