import React, { useState, useEffect, useCallback, useTransition } from 'react';
import { GameMode, HighScoreEntry, ThemeId } from './types/tetris';
import { useTetris } from './hooks/useTetris';
import { useTetrisControls } from './hooks/useTetrisControls';
import { GameBoard } from './components/GameBoard';
import { HoldQueue } from './components/HoldQueue';
import { NextQueue } from './components/NextQueue';
import { GameHUD } from './components/GameHUD';
import { MiniPiece } from './components/MiniPiece';
import { VirtualGamepad } from './components/VirtualGamepad';
import { Header } from './components/Header';
import { TitleMenu } from './components/TitleMenu';
import { GameOverModal } from './components/GameOverModal';
import { PauseModal } from './components/PauseModal';
import { SettingsModal } from './components/SettingsModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { sound } from './audio/soundEngine';

const STORAGE_KEY_HIGH_SCORES = 'tetris_high_scores_v1';
const STORAGE_KEY_THEME = 'tetris_theme_v1';
const STORAGE_KEY_SFX = 'tetris_sfx_v1';
const STORAGE_KEY_MUSIC = 'tetris_music_v1';

export default function App() {
  const [selectedMode, setSelectedMode] = useState<GameMode>('marathon');
  const [themeId, setThemeId] = useState<ThemeId>('cyber');
  const [sfxOn, setSfxOn] = useState<boolean>(true);
  const [musicOn, setMusicOn] = useState<boolean>(false);
  const [highScores, setHighScores] = useState<HighScoreEntry[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);
  const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);

  // Load preferences & high scores from localStorage
  useEffect(() => {
    try {
      const savedScores = localStorage.getItem(STORAGE_KEY_HIGH_SCORES);
      if (savedScores) {
        setHighScores(JSON.parse(savedScores));
      }

      const savedTheme = localStorage.getItem(STORAGE_KEY_THEME) as ThemeId;
      if (savedTheme && ['cyber', 'arcade', 'gameboy', 'minimal'].includes(savedTheme)) {
        setThemeId(savedTheme);
      }

      const savedSfx = localStorage.getItem(STORAGE_KEY_SFX);
      if (savedSfx !== null) {
        const isSfx = savedSfx === 'true';
        setSfxOn(isSfx);
        sound.setSfxEnabled(isSfx);
      }

      const savedMusic = localStorage.getItem(STORAGE_KEY_MUSIC);
      if (savedMusic !== null) {
        const isMusic = savedMusic === 'true';
        setMusicOn(isMusic);
        sound.setMusicEnabled(isMusic);
      }
    } catch {
      // Fallback silently if localStorage is restricted
    }
  }, []);

  // Tetris game state hook
  const {
    mode,
    setMode,
    gameState,
    setGameState,
    board,
    activePiece,
    ghostY,
    isGrounded,
    holdPiece,
    canHold,
    nextQueue,
    clearingRows,
    particles,
    shake,
    comboMessage,
    stats,
    startGame,
    moveHorizontal,
    softDrop,
    hardDrop,
    rotatePiece,
    hold,
    togglePause,
  } = useTetris(selectedMode);

  // Highest score for the active mode
  const currentModeHighScore = React.useMemo(() => {
    const modeScores = highScores.filter((s) => s.mode === mode);
    if (modeScores.length === 0) return 0;
    return Math.max(...modeScores.map((s) => s.score));
  }, [highScores, mode]);

  // Handle game over: update high scores
  useEffect(() => {
    if (gameState === 'GAME_OVER') {
      sound.stopMusic();

      const isHigh = stats.score > currentModeHighScore && stats.score > 0;
      setIsNewHighScore(isHigh);

      if (stats.score > 0 || (mode === 'sprint' && stats.lines >= 40)) {
        const newEntry: HighScoreEntry = {
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          score: stats.score,
          lines: stats.lines,
          level: stats.level,
          timeElapsed: stats.timeElapsed,
          date: new Date().toLocaleDateString('ko-KR', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          mode,
        };

        setHighScores((prev) => {
          const updated = [...prev, newEntry];
          try {
            localStorage.setItem(STORAGE_KEY_HIGH_SCORES, JSON.stringify(updated));
          } catch {
            // ignore
          }
          return updated;
        });
      }
    }
  }, [gameState, stats, currentModeHighScore, mode]);

  // Restart handler
  const handleRestart = useCallback(() => {
    setIsNewHighScore(false);
    startGame(mode);
    if (musicOn) {
      sound.startMusic();
    }
  }, [startGame, mode, musicOn]);

  // Keyboard controls
  useTetrisControls({
    gameState,
    moveHorizontal,
    softDrop,
    hardDrop,
    rotatePiece,
    hold,
    togglePause,
    onRestart: handleRestart,
  });

  // Mode select handler
  const handleSelectMode = (newMode: GameMode) => {
    setSelectedMode(newMode);
    setMode(newMode);
    if (gameState === 'PLAYING' || gameState === 'PAUSED') {
      startGame(newMode);
    }
  };

  // Sound toggles
  const handleToggleSfx = () => {
    const nextVal = sound.toggleSfx();
    setSfxOn(nextVal);
    try {
      localStorage.setItem(STORAGE_KEY_SFX, String(nextVal));
    } catch {
      // ignore
    }
  };

  const handleToggleMusic = () => {
    const nextVal = sound.toggleMusic();
    setMusicOn(nextVal);
    try {
      localStorage.setItem(STORAGE_KEY_MUSIC, String(nextVal));
    } catch {
      // ignore
    }
  };

  const handleChangeTheme = (newTheme: ThemeId) => {
    setThemeId(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY_THEME, newTheme);
    } catch {
      // ignore
    }
  };

  const handleClearScores = () => {
    setHighScores([]);
    try {
      localStorage.removeItem(STORAGE_KEY_HIGH_SCORES);
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none antialiased">
      {/* Universal Top Bar */}
      <Header
        currentMode={mode}
        gameState={gameState}
        onSelectMode={handleSelectMode}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onTogglePause={togglePause}
        sfxOn={sfxOn}
        onToggleSfx={handleToggleSfx}
        musicOn={musicOn}
        onToggleMusic={handleToggleMusic}
        onStartGame={() => handleRestart()}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 w-full max-w-6xl mx-auto">
        {gameState === 'TITLE_MENU' ? (
          <TitleMenu
            selectedMode={selectedMode}
            onSelectMode={handleSelectMode}
            onStartGame={handleRestart}
            highScore={currentModeHighScore}
          />
        ) : (
          <div className="flex flex-col items-center w-full">
            {/* Desktop / Tablet 3-Column Layout */}
            <div className="flex flex-row items-start justify-center gap-3 sm:gap-6 md:gap-8 w-full max-w-4xl">
              {/* Left Column: Hold Queue & Controls Hint */}
              <div className="hidden sm:flex flex-col gap-4 w-32 md:w-36 shrink-0">
                <HoldQueue
                  holdPiece={holdPiece}
                  canHold={canHold}
                  themeId={themeId}
                  onHoldClick={hold}
                />

                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-xs text-slate-400 flex flex-col gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    단축키
                  </span>
                  <div className="flex justify-between">
                    <span>하드 드롭</span>
                    <span className="text-slate-300 font-mono-numbers">Space</span>
                  </div>
                  <div className="flex justify-between">
                    <span>홀드</span>
                    <span className="text-slate-300 font-mono-numbers">C / Shift</span>
                  </div>
                  <div className="flex justify-between">
                    <span>일시정지</span>
                    <span className="text-slate-300 font-mono-numbers">P / Esc</span>
                  </div>
                </div>
              </div>

              {/* Center Column: Game Board (and Mobile Hold/Next compact bar) */}
              <div className="flex flex-col items-center">
                {/* Mobile top compact bar for Hold, Stats, and Next preview */}
                <div className="sm:hidden flex items-center justify-between w-full max-w-[290px] mb-2 px-1">
                  {/* Mobile Hold Box */}
                  <div
                    onClick={canHold ? hold : undefined}
                    className={`flex flex-col items-center bg-slate-900/90 border border-slate-800 rounded-lg px-2 py-1 shadow cursor-pointer transition-opacity ${
                      canHold ? 'hover:border-slate-700' : 'opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <span className="text-[9px] font-semibold text-slate-400">HOLD</span>
                    <div className="w-9 h-8 flex items-center justify-center bg-slate-950/60 rounded">
                      <MiniPiece type={holdPiece} themeId={themeId} size="sm" />
                    </div>
                  </div>

                  {/* Mobile Score & Level */}
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-mono-numbers font-bold text-white tracking-tight">
                      {stats.score.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono-numbers">
                      Lv.{stats.level} · {stats.lines}줄
                    </span>
                  </div>

                  {/* Mobile Next Box */}
                  <div className="flex flex-col items-center bg-slate-900/90 border border-slate-800 rounded-lg px-2 py-1 shadow">
                    <span className="text-[9px] font-semibold text-slate-400">NEXT</span>
                    <div className="w-9 h-8 flex items-center justify-center bg-slate-950/60 rounded">
                      <MiniPiece type={nextQueue[0] || null} themeId={themeId} size="sm" />
                    </div>
                  </div>
                </div>

                <GameBoard
                  board={board}
                  activePiece={activePiece}
                  ghostY={ghostY}
                  isGrounded={isGrounded}
                  clearingRows={clearingRows}
                  particles={particles}
                  shake={shake}
                  comboMessage={comboMessage}
                  themeId={themeId}
                />
              </div>

              {/* Right Column: Next Queue & HUD */}
              <div className="hidden sm:flex flex-col gap-4 w-36 md:w-44 shrink-0">
                <NextQueue queue={nextQueue} themeId={themeId} />
                <GameHUD stats={stats} mode={mode} highScore={currentModeHighScore} />
              </div>
            </div>

            {/* Mobile Touch Virtual Gamepad */}
            <div className="w-full mt-3 sm:hidden">
              <VirtualGamepad
                onMoveLeft={() => moveHorizontal(-1)}
                onMoveRight={() => moveHorizontal(1)}
                onSoftDrop={() => softDrop()}
                onHardDrop={hardDrop}
                onRotateCw={() => rotatePiece(1)}
                onRotateCcw={() => rotatePiece(-1)}
                onHold={hold}
              />
            </div>
          </div>
        )}
      </main>

      {/* Modals & Overlays */}
      {gameState === 'GAME_OVER' && (
        <GameOverModal
          stats={stats}
          mode={mode}
          isNewHighScore={isNewHighScore}
          onRestart={handleRestart}
          onMainMenu={() => setGameState('TITLE_MENU')}
        />
      )}

      {gameState === 'PAUSED' && (
        <PauseModal
          onResume={togglePause}
          onRestart={handleRestart}
          onOpenSettings={() => setIsSettingsOpen(true)}
          sfxOn={sfxOn}
          musicOn={musicOn}
          onToggleSfx={handleToggleSfx}
          onToggleMusic={handleToggleMusic}
        />
      )}

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        themeId={themeId}
        onChangeTheme={handleChangeTheme}
        sfxOn={sfxOn}
        onToggleSfx={handleToggleSfx}
        musicOn={musicOn}
        onToggleMusic={handleToggleMusic}
      />

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        highScores={highScores}
        onClearScores={handleClearScores}
      />
    </div>
  );
}
