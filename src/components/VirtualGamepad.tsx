import React, { useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  RotateCw,
  RotateCcw,
  ChevronsDown,
  RefreshCw,
} from 'lucide-react';

interface VirtualGamepadProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onSoftDrop: () => void;
  onHardDrop: () => void;
  onRotateCw: () => void;
  onRotateCcw: () => void;
  onHold: () => void;
}

export const VirtualGamepad: React.FC<VirtualGamepadProps> = ({
  onMoveLeft,
  onMoveRight,
  onSoftDrop,
  onHardDrop,
  onRotateCw,
  onRotateCcw,
  onHold,
}) => {
  const repeatTimerRef = useRef<{ initial: number | null; repeat: number | null }>({
    initial: null,
    repeat: null,
  });

  const startRepeating = (action: () => void, initialDelay = 160, repeatInterval = 45) => {
    action();
    stopRepeating();
    repeatTimerRef.current.initial = window.setTimeout(() => {
      repeatTimerRef.current.repeat = window.setInterval(action, repeatInterval);
    }, initialDelay);
  };

  const stopRepeating = () => {
    if (repeatTimerRef.current.initial) clearTimeout(repeatTimerRef.current.initial);
    if (repeatTimerRef.current.repeat) clearInterval(repeatTimerRef.current.repeat);
    repeatTimerRef.current = { initial: null, repeat: null };
  };

  return (
    <div className="w-full max-w-md mx-auto pt-2 pb-3 px-3 flex items-center justify-between select-none touch-none">
      {/* Left side: D-Pad navigation */}
      <div className="grid grid-cols-3 gap-1.5 w-36 sm:w-40">
        <div />
        {/* Hold button */}
        <button
          type="button"
          onClick={onHold}
          className="h-11 sm:h-12 bg-slate-800 active:bg-slate-700 text-slate-300 rounded-lg flex items-center justify-center font-bold text-xs shadow-md border border-slate-700/60"
          title="홀드 (Hold)"
        >
          <RefreshCw className="w-4 h-4 text-amber-400" />
        </button>
        <div />

        {/* Move Left */}
        <button
          type="button"
          onTouchStart={(e) => {
            e.preventDefault();
            startRepeating(onMoveLeft);
          }}
          onTouchEnd={stopRepeating}
          onMouseDown={() => startRepeating(onMoveLeft)}
          onMouseUp={stopRepeating}
          onMouseLeave={stopRepeating}
          className="h-11 sm:h-12 bg-slate-800 active:bg-slate-700 text-slate-200 rounded-lg flex items-center justify-center shadow-md border border-slate-700/60 active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Soft Drop */}
        <button
          type="button"
          onTouchStart={(e) => {
            e.preventDefault();
            startRepeating(onSoftDrop, 100, 45);
          }}
          onTouchEnd={stopRepeating}
          onMouseDown={() => startRepeating(onSoftDrop, 100, 45)}
          onMouseUp={stopRepeating}
          onMouseLeave={stopRepeating}
          className="h-11 sm:h-12 bg-slate-800 active:bg-slate-700 text-slate-200 rounded-lg flex items-center justify-center shadow-md border border-slate-700/60 active:scale-95 transition-transform"
        >
          <ArrowDown className="w-5 h-5 text-cyan-400" />
        </button>

        {/* Move Right */}
        <button
          type="button"
          onTouchStart={(e) => {
            e.preventDefault();
            startRepeating(onMoveRight);
          }}
          onTouchEnd={stopRepeating}
          onMouseDown={() => startRepeating(onMoveRight)}
          onMouseUp={stopRepeating}
          onMouseLeave={stopRepeating}
          className="h-11 sm:h-12 bg-slate-800 active:bg-slate-700 text-slate-200 rounded-lg flex items-center justify-center shadow-md border border-slate-700/60 active:scale-95 transition-transform"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Center: Hard Drop Slam button */}
      <button
        type="button"
        onClick={onHardDrop}
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-cyan-600 active:bg-cyan-500 text-white flex flex-col items-center justify-center shadow-lg active:scale-90 transition-transform border border-cyan-400/40"
        title="하드 드롭 (Space)"
      >
        <ChevronsDown className="w-6 h-6 animate-pulse" />
        <span className="text-[9px] font-bold tracking-tighter">DROP</span>
      </button>

      {/* Right side: Rotation controls */}
      <div className="flex gap-2">
        {/* Rotate CCW */}
        <button
          type="button"
          onClick={onRotateCcw}
          className="w-12 h-12 sm:w-13 sm:h-13 bg-slate-800 active:bg-slate-700 text-purple-300 rounded-full flex flex-col items-center justify-center shadow-md border border-slate-700/60 active:scale-95 transition-transform"
          title="반시계 회전 (Z)"
        >
          <RotateCcw className="w-5 h-5" />
          <span className="text-[8px] font-bold mt-0.5">CCW</span>
        </button>

        {/* Rotate CW */}
        <button
          type="button"
          onClick={() => onRotateCw()}
          className="w-13 h-13 sm:w-14 sm:h-14 bg-indigo-600 active:bg-indigo-500 text-white rounded-full flex flex-col items-center justify-center shadow-md border border-indigo-400/40 active:scale-95 transition-transform"
          title="시계 회전 (Up / W)"
        >
          <RotateCw className="w-6 h-6" />
          <span className="text-[8px] font-bold mt-0.5">ROTATE</span>
        </button>
      </div>
    </div>
  );
};
