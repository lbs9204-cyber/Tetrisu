import { useEffect, useRef } from 'react';
import { GameState } from '../types/tetris';

interface UseTetrisControlsProps {
  gameState: GameState;
  moveHorizontal: (dir: -1 | 1) => boolean;
  softDrop: () => boolean;
  hardDrop: () => void;
  rotatePiece: (dir: 1 | -1) => void;
  hold: () => void;
  togglePause: () => void;
  onRestart: () => void;
}

const DAS_DELAY = 140; // milliseconds before auto-repeat kicks in
const ARR_INTERVAL = 38; // repeat interval while key is held
const SOFT_DROP_INTERVAL = 40;

export function useTetrisControls({
  gameState,
  moveHorizontal,
  softDrop,
  hardDrop,
  rotatePiece,
  hold,
  togglePause,
  onRestart,
}: UseTetrisControlsProps) {
  // Store timers for auto-repeat
  const leftTimerRef = useRef<{ initial: number | null; repeat: number | null }>({ initial: null, repeat: null });
  const rightTimerRef = useRef<{ initial: number | null; repeat: number | null }>({ initial: null, repeat: null });
  const downTimerRef = useRef<number | null>(null);

  const clearTimers = () => {
    if (leftTimerRef.current.initial) clearTimeout(leftTimerRef.current.initial);
    if (leftTimerRef.current.repeat) clearInterval(leftTimerRef.current.repeat);
    leftTimerRef.current = { initial: null, repeat: null };

    if (rightTimerRef.current.initial) clearTimeout(rightTimerRef.current.initial);
    if (rightTimerRef.current.repeat) clearInterval(rightTimerRef.current.repeat);
    rightTimerRef.current = { initial: null, repeat: null };

    if (downTimerRef.current) clearInterval(downTimerRef.current);
    downTimerRef.current = null;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent browser default scroll for game keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      // Pause toggle
      if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        togglePause();
        return;
      }

      // Quick restart
      if (e.key === 'r' || e.key === 'R') {
        if (gameState === 'PLAYING' || gameState === 'GAME_OVER' || gameState === 'PAUSED') {
          onRestart();
          return;
        }
      }

      if (gameState !== 'PLAYING') return;

      // Repeat prevention for single actions (Rotate, Hard Drop, Hold)
      if (e.repeat && [' ', 'ArrowUp', 'w', 'W', 'x', 'X', 'z', 'Z', 'c', 'C', 'Shift'].includes(e.key)) {
        return;
      }

      // Move Left with DAS
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        if (!leftTimerRef.current.initial && !leftTimerRef.current.repeat) {
          moveHorizontal(-1);
          leftTimerRef.current.initial = window.setTimeout(() => {
            leftTimerRef.current.repeat = window.setInterval(() => {
              moveHorizontal(-1);
            }, ARR_INTERVAL);
          }, DAS_DELAY);
        }
        return;
      }

      // Move Right with DAS
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        if (!rightTimerRef.current.initial && !rightTimerRef.current.repeat) {
          moveHorizontal(1);
          rightTimerRef.current.initial = window.setTimeout(() => {
            rightTimerRef.current.repeat = window.setInterval(() => {
              moveHorizontal(1);
            }, ARR_INTERVAL);
          }, DAS_DELAY);
        }
        return;
      }

      // Soft drop
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        if (!downTimerRef.current) {
          softDrop();
          downTimerRef.current = window.setInterval(() => {
            softDrop();
          }, SOFT_DROP_INTERVAL);
        }
        return;
      }

      // Hard drop
      if (e.key === ' ') {
        hardDrop();
        return;
      }

      // Rotate Clockwise
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === 'x' || e.key === 'X') {
        rotatePiece(1);
        return;
      }

      // Rotate Counter-Clockwise
      if (e.key === 'z' || e.key === 'Z' || e.key === 'Control') {
        rotatePiece(-1);
        return;
      }

      // Hold piece
      if (e.key === 'c' || e.key === 'C' || e.key === 'Shift') {
        hold();
        return;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        if (leftTimerRef.current.initial) clearTimeout(leftTimerRef.current.initial);
        if (leftTimerRef.current.repeat) clearInterval(leftTimerRef.current.repeat);
        leftTimerRef.current = { initial: null, repeat: null };
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        if (rightTimerRef.current.initial) clearTimeout(rightTimerRef.current.initial);
        if (rightTimerRef.current.repeat) clearInterval(rightTimerRef.current.repeat);
        rightTimerRef.current = { initial: null, repeat: null };
      }
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        if (downTimerRef.current) {
          clearInterval(downTimerRef.current);
          downTimerRef.current = null;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', clearTimers);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', clearTimers);
      clearTimers();
    };
  }, [gameState, moveHorizontal, softDrop, hardDrop, rotatePiece, hold, togglePause, onRestart]);
}
