import React from 'react';
import { GameMode } from '../types/tetris';
import { Play, Zap, Clock, ShieldCheck, Flame } from 'lucide-react';

interface TitleMenuProps {
  selectedMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  onStartGame: () => void;
  highScore: number;
}

export const TitleMenu: React.FC<TitleMenuProps> = ({
  selectedMode,
  onSelectMode,
  onStartGame,
  highScore,
}) => {
  const modes: {
    id: GameMode;
    title: string;
    sub: string;
    desc: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      id: 'marathon',
      title: '마라톤 (Marathon)',
      sub: '클래식 무한 모드',
      desc: '10줄마다 레벨업! 점진적으로 빨라지는 속도에서 최고 기록을 달성하세요.',
      icon: <Flame className="w-5 h-5 text-amber-400" />,
      color: 'border-amber-500/50 bg-amber-950/20',
    },
    {
      id: 'sprint',
      title: '40줄 스프린트 (Sprint)',
      sub: '타임어택 스피드런',
      desc: '40줄의 라인을 가장 빠른 시간 내에 제거하는 피지컬 스피드 모드입니다.',
      icon: <Zap className="w-5 h-5 text-cyan-400" />,
      color: 'border-cyan-500/50 bg-cyan-950/20',
    },
    {
      id: 'ultra',
      title: '2분 타임어택 (Ultra)',
      sub: '120초 스코어 챌린지',
      desc: '2분의 제한 시간 동안 연속 콤보와 테트리스(4줄)로 최대 점수를 노리세요.',
      icon: <Clock className="w-5 h-5 text-purple-400" />,
      color: 'border-purple-500/50 bg-purple-950/20',
    },
    {
      id: 'zen',
      title: '젠 모드 (Zen)',
      sub: '여유로운 연습 모드',
      desc: '속도 증가와 게임 오버 압박 없이 평온하게 블록 쌓기를 연습할 수 있습니다.',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      color: 'border-emerald-500/50 bg-emerald-950/20',
    },
  ];

  return (
    <div className="flex flex-col items-center max-w-xl mx-auto py-6 sm:py-10 px-4 text-center">
      {/* Title Hero */}
      <div className="mb-8">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-2">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400">
            RETRO TETRIS
          </span>
        </h1>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          표준 가이드라인 회전(SRS), 7-Bag 랜덤, 홀드, 고스트 피스, 그리고 감성 가득한 신디사이저 사운드.
        </p>
      </div>

      {/* Mode Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-8 text-left">
        {modes.map((m) => {
          const isSelected = selectedMode === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelectMode(m.id)}
              className={`p-4 rounded-xl border text-left transition-all relative ${
                isSelected
                  ? `${m.color} ring-1 ring-white/20 shadow-lg scale-[1.01]`
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="p-1.5 rounded-lg bg-slate-950/80 border border-slate-800">
                  {m.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{m.title}</h3>
                  <span className="text-[10px] text-slate-400">{m.sub}</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mt-2">{m.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Start Button & High score */}
      <div className="flex flex-col items-center gap-4 w-full sm:w-auto">
        <button
          type="button"
          onClick={onStartGame}
          className="w-full sm:w-64 py-4 px-6 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 active:scale-95 text-white font-extrabold text-lg rounded-2xl shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2.5 transition-all"
        >
          <Play className="w-5 h-5 fill-current" />
          게임 시작 (SPACE)
        </button>

        {highScore > 0 && (
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <span>마라톤 최고 점수:</span>
            <span className="text-amber-400 font-bold font-mono-numbers">
              {highScore.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Quick Controls Info */}
      <div className="mt-10 pt-6 border-t border-slate-800/80 w-full flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-slate-500">
        <span>← → 이동</span>
        <span>·</span>
        <span>↑ / W 회전</span>
        <span>·</span>
        <span>Space 하드 드롭</span>
        <span>·</span>
        <span>C 홀드</span>
        <span>·</span>
        <span>P 일시정지</span>
      </div>
    </div>
  );
};
