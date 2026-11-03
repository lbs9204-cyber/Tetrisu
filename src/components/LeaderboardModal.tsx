import React, { useState } from 'react';
import { GameMode, HighScoreEntry } from '../types/tetris';
import { Trophy, X, Trash2 } from 'lucide-react';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  highScores: HighScoreEntry[];
  onClearScores: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  highScores,
  onClearScores,
}) => {
  const [activeTab, setActiveTab] = useState<GameMode>('marathon');

  if (!isOpen) return null;

  const filteredScores = highScores
    .filter((entry) => entry.mode === activeTab)
    .sort((a, b) => {
      if (activeTab === 'sprint') {
        // Sprint is ranked by fastest time
        return a.timeElapsed - b.timeElapsed;
      }
      // Marathon and Ultra are ranked by highest score
      return b.score - a.score;
    });

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            명예의 전당 (Leaderboard)
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Tabs */}
        <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('marathon')}
            className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'marathon'
                ? 'bg-slate-800 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            마라톤
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sprint')}
            className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'sprint'
                ? 'bg-slate-800 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            40줄 스프린트
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ultra')}
            className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'ultra'
                ? 'bg-slate-800 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            2분 타임어택
          </button>
        </div>

        {/* Scores List */}
        <div className="flex flex-col gap-2 min-h-56 max-h-72 overflow-y-auto pr-1">
          {filteredScores.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 py-12 text-slate-500 text-xs">
              <Trophy className="w-8 h-8 opacity-20 mb-2" />
              아직 기록이 없습니다. 새로운 기록을 세워보세요!
            </div>
          ) : (
            filteredScores.map((entry, idx) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                      idx === 0
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : idx === 1
                        ? 'bg-slate-400/20 text-slate-300 border border-slate-400/40'
                        : idx === 2
                        ? 'bg-amber-700/20 text-amber-600 border border-amber-700/40'
                        : 'text-slate-500 font-mono-numbers'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div>
                    <div className="text-white font-semibold font-mono-numbers">
                      {activeTab === 'sprint'
                        ? formatTime(entry.timeElapsed)
                        : entry.score.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {entry.lines}줄 클리어 · Lv.{entry.level} · {entry.date}
                    </div>
                  </div>
                </div>

                <div className="text-right text-[11px] text-slate-400 font-mono-numbers">
                  {activeTab !== 'sprint' && formatTime(entry.timeElapsed)}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          {filteredScores.length > 0 ? (
            <button
              type="button"
              onClick={onClearScores}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              기록 초기화
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
