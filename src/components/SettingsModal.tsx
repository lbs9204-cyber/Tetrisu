import React from 'react';
import { ThemeId } from '../types/tetris';
import { THEMES } from '../constants/tetrominoes';
import { X, Volume2, Music, Palette, Keyboard } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeId: ThemeId;
  onChangeTheme: (theme: ThemeId) => void;
  sfxOn: boolean;
  onToggleSfx: () => void;
  musicOn: boolean;
  onToggleMusic: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  themeId,
  onChangeTheme,
  sfxOn,
  onToggleSfx,
  musicOn,
  onToggleMusic,
}) => {
  if (!isOpen) return null;

  const themes: { id: ThemeId; name: string; desc: string; sampleColors: string[] }[] = [
    {
      id: 'cyber',
      name: '사이버 네온 (Cyber)',
      desc: '선명한 형광 네온과 딥 옵시디언 테마',
      sampleColors: ['#06b6d4', '#a855f7', '#f43f5e', '#10b981'],
    },
    {
      id: 'arcade',
      name: '클래식 아케이드 (Arcade)',
      desc: '80년대 레트로 오락실 캐비닛 감성',
      sampleColors: ['#00d2d3', '#feca57', '#9b59b6', '#ff6b6b'],
    },
    {
      id: 'gameboy',
      name: '게임보이 1989 (GameBoy)',
      desc: '원조 4단계 도트 매트릭스 올리브 그린',
      sampleColors: ['#0f380f', '#306230', '#8bac0f', '#9bbc0f'],
    },
    {
      id: 'minimal',
      name: '미니멀 다크 (Minimal)',
      desc: '세련된 무광 다크 슬레이트와 모던 파스텔',
      sampleColors: ['#38bdf8', '#c084fc', '#f87171', '#4ade80'],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            게임 설정
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audio Section */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-cyan-400" />
            오디오 및 음향
          </span>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onToggleSfx}
              className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                sfxOn
                  ? 'bg-cyan-950/30 border-cyan-500/50 text-cyan-200'
                  : 'bg-slate-950/50 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold">효과음 (SFX)</span>
                <span className="text-[11px] font-mono-numbers px-2 py-0.5 rounded bg-slate-800">
                  {sfxOn ? 'ON' : 'OFF'}
                </span>
              </div>
              <span className="text-[11px] text-slate-400">블록 회전, 드롭, 라인 클리어 효과음</span>
            </button>

            <button
              type="button"
              onClick={onToggleMusic}
              className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                musicOn
                  ? 'bg-indigo-950/30 border-indigo-500/50 text-indigo-200'
                  : 'bg-slate-950/50 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold flex items-center gap-1">
                  <Music className="w-3.5 h-3.5" />
                  테트리스 BGM
                </span>
                <span className="text-[11px] font-mono-numbers px-2 py-0.5 rounded bg-slate-800">
                  {musicOn ? 'ON' : 'OFF'}
                </span>
              </div>
              <span className="text-[11px] text-slate-400">8비트 신디사이저 테마 멜로디 재생</span>
            </button>
          </div>
        </div>

        {/* Visual Theme Section */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-purple-400" />
            비주얼 테마
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {themes.map((t) => {
              const isSelected = themeId === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onChangeTheme(t.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-purple-950/30 border-purple-500/60 ring-1 ring-purple-500/50 text-white'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold">{t.name}</span>
                    <div className="flex gap-1">
                      {t.sampleColors.map((c, i) => (
                        <div
                          key={i}
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400">{t.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Controls Info */}
        <div className="flex flex-col gap-2 pt-1 border-t border-slate-800 text-xs text-slate-400">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 mb-1">
            <Keyboard className="w-4 h-4 text-amber-400" />
            키보드 조작법
          </span>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <div className="flex justify-between">
              <span>좌/우 이동</span>
              <span className="text-white font-mono-numbers">← → / A D</span>
            </div>
            <div className="flex justify-between">
              <span>시계방향 회전</span>
              <span className="text-white font-mono-numbers">↑ / W / X</span>
            </div>
            <div className="flex justify-between">
              <span>반시계 회전</span>
              <span className="text-white font-mono-numbers">Z / Ctrl</span>
            </div>
            <div className="flex justify-between">
              <span>소프트 드롭</span>
              <span className="text-white font-mono-numbers">↓ / S</span>
            </div>
            <div className="flex justify-between">
              <span>하드 드롭</span>
              <span className="text-white font-mono-numbers">Space</span>
            </div>
            <div className="flex justify-between">
              <span>블록 홀드</span>
              <span className="text-white font-mono-numbers">C / Shift</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-colors text-sm"
        >
          설정 완료
        </button>
      </div>
    </div>
  );
};
