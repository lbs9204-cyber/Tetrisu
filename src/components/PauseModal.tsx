import React from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Music, Settings, HelpCircle } from 'lucide-react';
import { sound } from '../audio/soundEngine';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onOpenSettings: () => void;
  sfxOn: boolean;
  musicOn: boolean;
  onToggleSfx: () => void;
  onToggleMusic: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onOpenSettings,
  sfxOn,
  musicOn,
  onToggleSfx,
  onToggleMusic,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl flex flex-col gap-4 text-center">
        <h2 className="text-2xl font-bold text-white tracking-tight">일시 정지</h2>
        <p className="text-xs text-slate-400">게임이 멈춰있습니다. 계속 진행하시겠습니까?</p>

        {/* Quick Sound Toggles */}
        <div className="grid grid-cols-2 gap-2 my-1">
          <button
            type="button"
            onClick={onToggleSfx}
            className={`py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
              sfxOn
                ? 'bg-slate-800 border-cyan-500/50 text-cyan-400'
                : 'bg-slate-950/60 border-slate-800 text-slate-500'
            }`}
          >
            {sfxOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            효과음: {sfxOn ? 'ON' : 'OFF'}
          </button>

          <button
            type="button"
            onClick={onToggleMusic}
            className={`py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
              musicOn
                ? 'bg-slate-800 border-indigo-500/50 text-indigo-400'
                : 'bg-slate-950/60 border-slate-800 text-slate-500'
            }`}
          >
            <Music className="w-4 h-4" />
            배경음: {musicOn ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Key controls reference */}
        <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 text-left text-[11px] text-slate-400 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-slate-300 pb-1 border-b border-slate-800">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>조작 키 안내</span>
          </div>
          <div className="flex justify-between">
            <span>좌/우 이동</span>
            <span className="text-slate-200 font-mono-numbers">← → / A D</span>
          </div>
          <div className="flex justify-between">
            <span>회전 (시계/반시계)</span>
            <span className="text-slate-200 font-mono-numbers">↑ W / Z Ctrl</span>
          </div>
          <div className="flex justify-between">
            <span>소프트 드롭</span>
            <span className="text-slate-200 font-mono-numbers">↓ / S</span>
          </div>
          <div className="flex justify-between">
            <span>하드 드롭</span>
            <span className="text-slate-200 font-mono-numbers">스페이스바 (Space)</span>
          </div>
          <div className="flex justify-between">
            <span>블록 홀드</span>
            <span className="text-slate-200 font-mono-numbers">C / Shift</span>
          </div>
        </div>

        {/* Primary Buttons */}
        <div className="flex flex-col gap-2 pt-2">
          <button
            type="button"
            onClick={onResume}
            className="py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Play className="w-4 h-4 fill-current" />
            계속하기 (P / Esc)
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onRestart}
              className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              다시 시작 (R)
            </button>
            <button
              type="button"
              onClick={onOpenSettings}
              className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5" />
              설정
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
