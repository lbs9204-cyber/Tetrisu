import React from 'react';
import { TetrominoType, ThemeId } from '../types/tetris';
import { MiniPiece } from './MiniPiece';

interface HoldQueueProps {
  holdPiece: TetrominoType | null;
  canHold: boolean;
  themeId: ThemeId;
  onHoldClick?: () => void;
}

export const HoldQueue: React.FC<HoldQueueProps> = ({
  holdPiece,
  canHold,
  themeId,
  onHoldClick,
}) => {
  return (
    <div
      onClick={canHold ? onHoldClick : undefined}
      className={`flex flex-col items-center bg-slate-900/80 border border-slate-800 rounded-xl p-3 sm:p-4 shadow-md transition-all ${
        canHold ? 'cursor-pointer hover:border-slate-700' : 'opacity-60 cursor-not-allowed'
      }`}
    >
      <div className="flex items-center justify-between w-full mb-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          HOLD (C)
        </span>
      </div>

      <div className="w-16 h-14 sm:w-20 sm:h-16 flex items-center justify-center bg-slate-950/60 rounded-lg border border-slate-800/80">
        <MiniPiece type={holdPiece} themeId={themeId} />
      </div>
    </div>
  );
};
