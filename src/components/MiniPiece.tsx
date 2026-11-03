import React from 'react';
import { TetrominoType, ThemeId } from '../types/tetris';
import { TETROMINO_SHAPES, THEMES } from '../constants/tetrominoes';

interface MiniPieceProps {
  type: TetrominoType | null;
  themeId: ThemeId;
  size?: 'sm' | 'md';
}

export const MiniPiece: React.FC<MiniPieceProps> = ({ type, themeId, size = 'md' }) => {
  const theme = THEMES[themeId];

  if (!type) {
    return (
      <div className="flex items-center justify-center w-16 h-12 text-xs text-slate-500 font-mono-numbers">
        -
      </div>
    );
  }

  const shape = TETROMINO_SHAPES[type][0];
  const color = theme.tetrominoes[type];
  const cellSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4 sm:w-5 sm:h-5';

  return (
    <div className="flex flex-col items-center justify-center p-1">
      {shape.map((row, rIdx) => {
        // Skip empty rows to keep preview compact
        const hasBlock = row.some((c) => c !== 0);
        if (!hasBlock && type !== 'I') return null;

        return (
          <div key={rIdx} className="flex gap-[2px]">
            {row.map((cell, cIdx) => (
              <div
                key={cIdx}
                className={`${cellSize} rounded-[2px] transition-all`}
                style={{
                  backgroundColor: cell !== 0 ? color.fill : 'transparent',
                  border: cell !== 0 ? `1px solid ${color.border}` : 'none',
                  boxShadow:
                    cell !== 0
                      ? `inset 0 1px 1px ${color.highlight}, inset 0 -1px 2px ${color.shadow}`
                      : 'none',
                }}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
};
