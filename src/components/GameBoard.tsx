import React from 'react';
import { ActivePiece, BoardMatrix, Particle, ThemeId } from '../types/tetris';
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  BUFFER_ROWS,
  TETROMINO_SHAPES,
  THEMES,
} from '../constants/tetrominoes';

interface GameBoardProps {
  board: BoardMatrix;
  activePiece: ActivePiece | null;
  ghostY: number | null;
  isGrounded?: boolean;
  clearingRows: number[];
  particles: Particle[];
  shake: boolean;
  comboMessage: string | null;
  themeId: ThemeId;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  activePiece,
  ghostY,
  isGrounded = false,
  clearingRows,
  particles,
  shake,
  comboMessage,
  themeId,
}) => {
  const theme = THEMES[themeId];

  // Prepare a 20x10 visual grid of cell styles
  // board has TOTAL_ROWS = 22, visible are BUFFER_ROWS (2) to 21
  const renderCells = () => {
    // Clone visible portion of board
    const grid: {
      type: string | null;
      isGhost: boolean;
      isActive: boolean;
      isClearing: boolean;
    }[][] = [];

    for (let r = BUFFER_ROWS; r < BUFFER_ROWS + BOARD_HEIGHT; r++) {
      const row = [];
      const isClearing = clearingRows.includes(r);
      for (let c = 0; c < BOARD_WIDTH; c++) {
        row.push({
          type: board[r]?.[c] || null,
          isGhost: false,
          isActive: false,
          isClearing,
        });
      }
      grid.push(row);
    }

    // Overlay Ghost Piece
    if (activePiece && ghostY !== null && ghostY !== activePiece.position.y) {
      const shape = TETROMINO_SHAPES[activePiece.type][activePiece.rotation];
      const size = shape.length;
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (shape[r][c] !== 0) {
            const boardY = ghostY + r - BUFFER_ROWS;
            const boardX = activePiece.position.x + c;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              // Only put ghost if cell is empty on static board
              if (!grid[boardY][boardX].type) {
                grid[boardY][boardX] = {
                  type: activePiece.type,
                  isGhost: true,
                  isActive: false,
                  isClearing: false,
                };
              }
            }
          }
        }
      }
    }

    // Overlay Active Piece
    if (activePiece) {
      const shape = TETROMINO_SHAPES[activePiece.type][activePiece.rotation];
      const size = shape.length;
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (shape[r][c] !== 0) {
            const boardY = activePiece.position.y + r - BUFFER_ROWS;
            const boardX = activePiece.position.x + c;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              grid[boardY][boardX] = {
                type: activePiece.type,
                isGhost: false,
                isActive: true,
                isClearing: false,
              };
            }
          }
        }
      }
    }

    return grid;
  };

  const visibleGrid = renderCells();

  return (
    <div
      className={`relative rounded-xl border p-2 transition-transform duration-100 shadow-2xl select-none ${
        shake ? 'shake-screen' : ''
      }`}
      style={{
        backgroundColor: theme.boardBg,
        borderColor: theme.border,
      }}
    >
      {/* Combo / Special Notification Popup */}
      {comboMessage && (
        <div className="absolute inset-x-0 top-1/4 z-30 flex justify-center pointer-events-none">
          <div className="bg-slate-900/90 text-amber-400 font-extrabold px-4 py-1.5 rounded-lg border border-amber-500/40 shadow-lg text-sm sm:text-base animate-bounce tracking-wider">
            {comboMessage}
          </div>
        </div>
      )}

      {/* Main 10x20 Grid Container */}
      <div
        className="grid grid-cols-10 grid-rows-20 gap-[1.5px] sm:gap-[2px] bg-slate-950/60 rounded-lg p-1 overflow-hidden"
        style={{
          width: 'min(70vw, 290px)',
          height: 'min(140vw, 580px)',
        }}
      >
        {visibleGrid.map((row, rIdx) =>
          row.map((cell, cIdx) => {
            const cellType = cell.type as keyof typeof theme.tetrominoes;
            const pieceColor = cellType ? theme.tetrominoes[cellType] : null;

            if (cell.isClearing) {
              return (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className="w-full h-full rounded-[2px] bg-white animate-row-clear shadow-md"
                />
              );
            }

            if (cell.isActive && pieceColor) {
              return (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className={`w-full h-full rounded-[2px] sm:rounded relative transition-all ${
                    isGrounded ? 'ring-1 ring-white/70 brightness-110' : ''
                  }`}
                  style={{
                    backgroundColor: pieceColor.fill,
                    boxShadow: isGrounded
                      ? `0 0 6px ${pieceColor.highlight}, inset 0 1px 2px ${pieceColor.highlight}, inset 0 -1px 2px ${pieceColor.shadow}`
                      : `inset 0 1px 1px ${pieceColor.highlight}, inset 0 -1px 2px ${pieceColor.shadow}`,
                    border: `1px solid ${isGrounded ? '#ffffff' : pieceColor.border}`,
                  }}
                >
                  <div
                    className="absolute inset-[15%] rounded-[1px] opacity-40 pointer-events-none"
                    style={{ backgroundColor: pieceColor.highlight }}
                  />
                </div>
              );
            }

            if (cell.isGhost && pieceColor) {
              return (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className="w-full h-full rounded-[2px] border border-dashed transition-opacity"
                  style={{
                    borderColor: pieceColor.border,
                    backgroundColor: pieceColor.fill,
                    opacity: theme.ghostOpacity,
                  }}
                />
              );
            }

            if (cell.type && pieceColor) {
              // Placed locked piece
              return (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className="w-full h-full rounded-[2px] sm:rounded relative"
                  style={{
                    backgroundColor: pieceColor.fill,
                    boxShadow: `inset 0 1px 1px ${pieceColor.highlight}, inset 0 -2px 2px ${pieceColor.shadow}`,
                    border: `1px solid ${pieceColor.border}`,
                  }}
                >
                  <div
                    className="absolute top-0.5 left-0.5 right-0.5 h-[25%] rounded-[1px] opacity-30 pointer-events-none"
                    style={{ backgroundColor: pieceColor.highlight }}
                  />
                </div>
              );
            }

            // Empty Grid Cell
            return (
              <div
                key={`${rIdx}-${cIdx}`}
                className="w-full h-full rounded-[1px]"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: `0.5px solid ${theme.gridLine}`,
                }}
              />
            );
          })
        )}
      </div>

      {/* Particle Canvas / Overlay */}
      {particles.length > 0 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
          {particles.map((p) => {
            const leftPercent = (p.x / BOARD_WIDTH) * 100;
            const topPercent = (p.y / BOARD_HEIGHT) * 100;
            return (
              <div
                key={p.id}
                className="absolute rounded-full"
                style={{
                  left: `${leftPercent}%`,
                  top: `${topPercent}%`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  backgroundColor: p.color,
                  opacity: p.opacity,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
