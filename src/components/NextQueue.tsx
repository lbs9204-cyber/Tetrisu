import React from 'react';
import { TetrominoType, ThemeId } from '../types/tetris';
import { MiniPiece } from './MiniPiece';

interface NextQueueProps {
  queue: TetrominoType[];
  themeId: ThemeId;
}

export const NextQueue: React.FC<NextQueueProps> = ({ queue, themeId }) => {
  const visibleNext = queue.slice(0, 4);

  return (
    <div className="flex flex-col items-center bg-slate-900/80 border border-slate-800 rounded-xl p-3 sm:p-4 shadow-md w-full">
      <div className="flex items-center justify-between w-full mb-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          NEXT
        </span>
      </div>

      <div className="flex flex-col gap-2.5 w-full items-center">
        {visibleNext.map((type, idx) => (
          <div
            key={idx}
            className={`w-16 sm:w-20 flex items-center justify-center bg-slate-950/60 rounded-lg border border-slate-800/80 ${
              idx === 0 ? 'h-14 sm:h-16 py-1' : 'h-11 sm:h-12 opacity-80 scale-90'
            }`}
          >
            <MiniPiece type={type} themeId={themeId} size={idx === 0 ? 'md' : 'sm'} />
          </div>
        ))}
      </div>
    </div>
  );
};
