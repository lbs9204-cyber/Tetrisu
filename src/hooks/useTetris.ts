import { useState, useEffect, useRef, useCallback } from 'react';
import {
  ActivePiece,
  BoardMatrix,
  CellValue,
  GameMode,
  GameState,
  GameStats,
  Particle,
  Position,
  RotationState,
  TetrominoType,
} from '../types/tetris';
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  BUFFER_ROWS,
  TOTAL_ROWS,
  TETROMINO_SHAPES,
  SPAWN_POSITIONS,
  SRS_KICKS_JLSTZ,
  SRS_KICKS_I,
  generate7Bag,
  getDropSpeed,
} from '../constants/tetrominoes';
import { sound } from '../audio/soundEngine';

// Create empty board matrix
export function createEmptyBoard(): BoardMatrix {
  return Array.from({ length: TOTAL_ROWS }, () =>
    Array.from({ length: BOARD_WIDTH }, () => null)
  );
}

// Check collision
export function checkCollision(
  board: BoardMatrix,
  type: TetrominoType,
  pos: Position,
  rotation: RotationState
): boolean {
  const shape = TETROMINO_SHAPES[type][rotation];
  const size = shape.length;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (shape[r][c] !== 0) {
        const boardX = pos.x + c;
        const boardY = pos.y + r;

        // Wall collisions
        if (boardX < 0 || boardX >= BOARD_WIDTH || boardY >= TOTAL_ROWS) {
          return true;
        }

        // Cell collisions (ignore if above top buffer rows, but inside matrix check filled)
        if (boardY >= 0 && board[boardY][boardX] !== null) {
          return true;
        }
      }
    }
  }
  return false;
}

export function useTetris(initialMode: GameMode = 'marathon') {
  const [mode, setMode] = useState<GameMode>(initialMode);
  const [gameState, setGameState] = useState<GameState>('TITLE_MENU');
  const [board, setBoard] = useState<BoardMatrix>(createEmptyBoard);
  const [activePiece, setActivePiece] = useState<ActivePiece | null>(null);
  const [holdPiece, setHoldPiece] = useState<TetrominoType | null>(null);
  const [canHold, setCanHold] = useState<boolean>(true);
  const [nextQueue, setNextQueue] = useState<TetrominoType[]>([]);
  const [clearingRows, setClearingRows] = useState<number[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [shake, setShake] = useState<boolean>(false);
  const [comboMessage, setComboMessage] = useState<string | null>(null);

  const [stats, setStats] = useState<GameStats>({
    score: 0,
    lines: 0,
    level: 1,
    singles: 0,
    doubles: 0,
    triples: 0,
    tetrises: 0,
    maxCombo: 0,
    currentCombo: -1,
    backToBack: false,
    timeElapsed: 0,
    piecesPlaced: 0,
  });

  // Bag of pieces
  const bagRef = useRef<TetrominoType[]>([]);
  const activePieceRef = useRef<ActivePiece | null>(null);
  const boardRef = useRef<BoardMatrix>(board);
  const lockTimeoutRef = useRef<number | null>(null);
  const lockResetCountRef = useRef<number>(0);
  const statsRef = useRef<GameStats>(stats);
  const gameStateRef = useRef<GameState>(gameState);
  const modeRef = useRef<GameMode>(mode);
  const isClearingRef = useRef<boolean>(false);

  // Sync refs
  activePieceRef.current = activePiece;
  boardRef.current = board;
  statsRef.current = stats;
  gameStateRef.current = gameState;
  modeRef.current = mode;

  // Get next tetromino from bag
  const getNextTetromino = useCallback((): TetrominoType => {
    if (bagRef.current.length < 7) {
      bagRef.current = [...bagRef.current, ...generate7Bag()];
    }
    const next = bagRef.current.shift()!;
    // Keep nextQueue filled with 5 pieces
    setNextQueue(bagRef.current.slice(0, 5));
    return next;
  }, []);

  // Calculate Ghost Piece position
  const getGhostY = useCallback((piece: ActivePiece, currentBoard: BoardMatrix): number => {
    let ghostY = piece.position.y;
    while (!checkCollision(currentBoard, piece.type, { x: piece.position.x, y: ghostY + 1 }, piece.rotation)) {
      ghostY++;
    }
    return ghostY;
  }, []);

  // Trigger screen shake
  const triggerShake = useCallback(() => {
    setShake(true);
    setTimeout(() => setShake(false), 160);
  }, []);

  // Spawn particle explosions
  const createParticles = useCallback((rows: number[], colors: string[]) => {
    const newParticles: Particle[] = [];
    const now = Date.now();
    rows.forEach((rowIdx) => {
      for (let i = 0; i < 24; i++) {
        newParticles.push({
          id: now + Math.random(),
          x: Math.random() * BOARD_WIDTH,
          y: rowIdx - BUFFER_ROWS + Math.random(),
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.7) * 5,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 4 + 2,
          opacity: 1,
          life: 1,
        });
      }
    });

    setParticles((prev) => [...prev, ...newParticles]);
  }, []);

  // Start new game
  const startGame = useCallback((selectedMode?: GameMode) => {
    const currentMode = selectedMode || mode;
    setMode(currentMode);
    modeRef.current = currentMode;

    const freshBoard = createEmptyBoard();
    setBoard(freshBoard);
    boardRef.current = freshBoard;

    // Reset bag
    bagRef.current = [...generate7Bag(), ...generate7Bag()];
    const firstPieceType = bagRef.current.shift()!;
    setNextQueue(bagRef.current.slice(0, 5));

    const initialSpawn = {
      type: firstPieceType,
      position: { ...SPAWN_POSITIONS[firstPieceType] },
      rotation: 0 as RotationState,
    };

    setActivePiece(initialSpawn);
    activePieceRef.current = initialSpawn;
    setHoldPiece(null);
    setCanHold(true);
    setClearingRows([]);
    setParticles([]);
    setComboMessage(null);

    const initialStats: GameStats = {
      score: 0,
      lines: 0,
      level: 1,
      singles: 0,
      doubles: 0,
      triples: 0,
      tetrises: 0,
      maxCombo: 0,
      currentCombo: -1,
      backToBack: false,
      timeElapsed: 0,
      piecesPlaced: 0,
    };
    setStats(initialStats);
    statsRef.current = initialStats;

    setGameState('PLAYING');
    gameStateRef.current = 'PLAYING';
    isClearingRef.current = false;
  }, [mode]);

  // Lock active piece onto board
  const lockPiece = useCallback(() => {
    const piece = activePieceRef.current;
    if (!piece || isClearingRef.current) return;

    if (lockTimeoutRef.current !== null) {
      clearTimeout(lockTimeoutRef.current);
      lockTimeoutRef.current = null;
    }

    const currentBoard = boardRef.current;
    const newBoard = currentBoard.map((row) => [...row]);
    const shape = TETROMINO_SHAPES[piece.type][piece.rotation];
    const size = shape.length;

    let lockedAboveBuffer = true;

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (shape[r][c] !== 0) {
          const x = piece.position.x + c;
          const y = piece.position.y + r;
          if (y >= 0 && y < TOTAL_ROWS && x >= 0 && x < BOARD_WIDTH) {
            newBoard[y][x] = piece.type;
            if (y >= BUFFER_ROWS) {
              lockedAboveBuffer = false;
            }
          }
        }
      }
    }

    // Top out check: if all blocks locked strictly in buffer rows -> Game Over
    if (lockedAboveBuffer) {
      sound.playGameOver();
      setGameState('GAME_OVER');
      return;
    }

    // Check for completed rows
    const fullRows: number[] = [];
    for (let y = 0; y < TOTAL_ROWS; y++) {
      if (newBoard[y].every((cell) => cell !== null)) {
        fullRows.push(y);
      }
    }

    const linesCleared = fullRows.length;
    const currentStats = statsRef.current;

    if (linesCleared > 0) {
      isClearingRef.current = true;
      setClearingRows(fullRows);
      sound.playLineClear(linesCleared);

      if (linesCleared === 4) {
        triggerShake();
      }

      // Collect colors for particles
      const colors = ['#06b6d4', '#eab308', '#a855f7', '#10b981', '#f43f5e', '#3b82f6', '#f97316'];
      createParticles(fullRows, colors);

      // Scoring
      const isB2B = linesCleared === 4 && currentStats.backToBack;
      let lineBaseScore = 0;
      if (linesCleared === 1) lineBaseScore = 100 * currentStats.level;
      else if (linesCleared === 2) lineBaseScore = 300 * currentStats.level;
      else if (linesCleared === 3) lineBaseScore = 500 * currentStats.level;
      else if (linesCleared === 4) {
        lineBaseScore = 800 * currentStats.level;
        if (isB2B) lineBaseScore = Math.floor(lineBaseScore * 1.5);
      }

      const nextCombo = currentStats.currentCombo + 1;
      const comboBonus = nextCombo > 0 ? 50 * nextCombo * currentStats.level : 0;
      const totalScoreGain = lineBaseScore + comboBonus;

      if (nextCombo > 0) {
        sound.playCombo(nextCombo);
        setComboMessage(`${nextCombo} COMBO!`);
        setTimeout(() => setComboMessage(null), 1200);
      } else if (linesCleared === 4) {
        setComboMessage(isB2B ? 'B2B TETRIS!' : 'TETRIS!');
        setTimeout(() => setComboMessage(null), 1200);
      }

      const newTotalLines = currentStats.lines + linesCleared;
      const newLevel = modeRef.current === 'zen' ? 1 : Math.floor(newTotalLines / 10) + 1;

      if (newLevel > currentStats.level) {
        sound.playLevelUp();
      }

      // Sprint mode check (40 lines sprint)
      const isSprintFinished = modeRef.current === 'sprint' && newTotalLines >= 40;

      // Update stats
      setStats((prev) => ({
        ...prev,
        score: prev.score + totalScoreGain,
        lines: newTotalLines,
        level: newLevel,
        singles: prev.singles + (linesCleared === 1 ? 1 : 0),
        doubles: prev.doubles + (linesCleared === 2 ? 1 : 0),
        triples: prev.triples + (linesCleared === 3 ? 1 : 0),
        tetrises: prev.tetrises + (linesCleared === 4 ? 1 : 0),
        maxCombo: Math.max(prev.maxCombo, nextCombo),
        currentCombo: nextCombo,
        backToBack: linesCleared === 4,
        piecesPlaced: prev.piecesPlaced + 1,
      }));

      // Delay to show clear animation
      setTimeout(() => {
        // Remove rows
        const collapsedBoard = newBoard.filter((_, idx) => !fullRows.includes(idx));
        while (collapsedBoard.length < TOTAL_ROWS) {
          collapsedBoard.unshift(Array(BOARD_WIDTH).fill(null));
        }

        setBoard(collapsedBoard);
        boardRef.current = collapsedBoard;
        setClearingRows([]);
        isClearingRef.current = false;

        if (isSprintFinished) {
          sound.playLevelUp();
          setGameState('GAME_OVER');
          return;
        }

        // Spawn next piece
        spawnNextPiece(collapsedBoard);
      }, 200);
    } else {
      // No lines cleared
      setStats((prev) => ({
        ...prev,
        currentCombo: -1,
        piecesPlaced: prev.piecesPlaced + 1,
      }));
      setBoard(newBoard);
      boardRef.current = newBoard;
      spawnNextPiece(newBoard);
    }
  }, [createParticles, triggerShake]);

  // Spawn next piece
  const spawnNextPiece = useCallback((currentBoard: BoardMatrix) => {
    const nextType = getNextTetromino();
    const spawnPos = { ...SPAWN_POSITIONS[nextType] };

    // Check if spawn position is immediately colliding (Lock out)
    if (checkCollision(currentBoard, nextType, spawnPos, 0)) {
      sound.playGameOver();
      setGameState('GAME_OVER');
      return;
    }

    const newPiece: ActivePiece = {
      type: nextType,
      position: spawnPos,
      rotation: 0,
    };

    setActivePiece(newPiece);
    activePieceRef.current = newPiece;
    setCanHold(true);
    lockResetCountRef.current = 0;
  }, [getNextTetromino]);

  const LOCK_DELAY_MS = 2000; // 2 seconds grace period as requested by user

  // Handle movement
  const moveHorizontal = useCallback((dir: -1 | 1): boolean => {
    const piece = activePieceRef.current;
    if (!piece || gameStateRef.current !== 'PLAYING' || isClearingRef.current) return false;

    const newPos = { ...piece.position, x: piece.position.x + dir };
    if (!checkCollision(boardRef.current, piece.type, newPos, piece.rotation)) {
      const updated = { ...piece, position: newPos };
      setActivePiece(updated);
      activePieceRef.current = updated;
      sound.playMove();

      // Check if grounded after movement
      const isGrounded = checkCollision(
        boardRef.current,
        piece.type,
        { x: newPos.x, y: newPos.y + 1 },
        piece.rotation
      );

      if (isGrounded) {
        // Reset 2-second lock timer
        if (lockTimeoutRef.current !== null) {
          clearTimeout(lockTimeoutRef.current);
        }
        if (lockResetCountRef.current < 20) {
          lockResetCountRef.current += 1;
          lockTimeoutRef.current = window.setTimeout(() => {
            lockPiece();
          }, LOCK_DELAY_MS);
        }
      } else {
        // Piece is now suspended in mid-air (e.g. moved over a hole)
        if (lockTimeoutRef.current !== null) {
          clearTimeout(lockTimeoutRef.current);
          lockTimeoutRef.current = null;
        }
      }
      return true;
    }
    return false;
  }, [lockPiece]);

  // Soft drop (move down 1 step)
  const softDrop = useCallback((): boolean => {
    const piece = activePieceRef.current;
    if (!piece || gameStateRef.current !== 'PLAYING' || isClearingRef.current) return false;

    const newPos = { ...piece.position, y: piece.position.y + 1 };
    if (!checkCollision(boardRef.current, piece.type, newPos, piece.rotation)) {
      const updated = { ...piece, position: newPos };
      setActivePiece(updated);
      activePieceRef.current = updated;
      setStats((prev) => ({ ...prev, score: prev.score + 1 }));
      sound.playSoftDrop();

      // Check if it reached bottom on this step
      const reachedBottom = checkCollision(
        boardRef.current,
        piece.type,
        { x: piece.position.x, y: newPos.y + 1 },
        piece.rotation
      );

      if (reachedBottom) {
        if (lockTimeoutRef.current === null) {
          lockTimeoutRef.current = window.setTimeout(() => {
            lockPiece();
          }, LOCK_DELAY_MS);
        }
      } else if (lockTimeoutRef.current !== null) {
        clearTimeout(lockTimeoutRef.current);
        lockTimeoutRef.current = null;
      }
      return true;
    } else {
      // Piece is already at the bottom: do NOT immediately lock!
      // Provide the full 2 seconds to move/rotate
      if (lockTimeoutRef.current === null) {
        lockTimeoutRef.current = window.setTimeout(() => {
          lockPiece();
        }, LOCK_DELAY_MS);
      }
      return false;
    }
  }, [lockPiece]);

  // Hard drop (instantly slam to bottom)
  const hardDrop = useCallback(() => {
    const piece = activePieceRef.current;
    if (!piece || gameStateRef.current !== 'PLAYING' || isClearingRef.current) return;

    const ghostY = getGhostY(piece, boardRef.current);
    const dropDistance = ghostY - piece.position.y;

    const droppedPiece = {
      ...piece,
      position: { ...piece.position, y: ghostY },
    };

    setActivePiece(droppedPiece);
    activePieceRef.current = droppedPiece;

    setStats((prev) => ({ ...prev, score: prev.score + dropDistance * 2 }));
    sound.playHardDrop();
    triggerShake();

    lockPiece();
  }, [getGhostY, lockPiece, triggerShake]);

  // Rotate with SRS Wall Kicks
  const rotatePiece = useCallback((direction: 1 | -1) => {
    const piece = activePieceRef.current;
    if (!piece || gameStateRef.current !== 'PLAYING' || isClearingRef.current) return;

    if (piece.type === 'O') return; // O-piece does not rotate

    const nextRotation = ((piece.rotation + direction + 4) % 4) as RotationState;
    const kickKey = `${piece.rotation}->${nextRotation}`;
    const kicks = piece.type === 'I' ? SRS_KICKS_I[kickKey] || [[0, 0]] : SRS_KICKS_JLSTZ[kickKey] || [[0, 0]];

    for (const [dx, dy] of kicks) {
      const testPos: Position = {
        x: piece.position.x + dx,
        // In screen coordinates, y increases downward, so kick dy is inverted
        y: piece.position.y - dy,
      };

      if (!checkCollision(boardRef.current, piece.type, testPos, nextRotation)) {
        const rotatedPiece: ActivePiece = {
          type: piece.type,
          position: testPos,
          rotation: nextRotation,
        };
        setActivePiece(rotatedPiece);
        activePieceRef.current = rotatedPiece;
        sound.playRotate();

        // Check if grounded after rotation
        const isGrounded = checkCollision(
          boardRef.current,
          piece.type,
          { x: testPos.x, y: testPos.y + 1 },
          nextRotation
        );

        if (isGrounded) {
          // Reset 2-second lock timer
          if (lockTimeoutRef.current !== null) {
            clearTimeout(lockTimeoutRef.current);
          }
          if (lockResetCountRef.current < 20) {
            lockResetCountRef.current += 1;
            lockTimeoutRef.current = window.setTimeout(() => {
              lockPiece();
            }, LOCK_DELAY_MS);
          }
        } else {
          // Suspended in air after rotation
          if (lockTimeoutRef.current !== null) {
            clearTimeout(lockTimeoutRef.current);
            lockTimeoutRef.current = null;
          }
        }
        return;
      }
    }
  }, [lockPiece]);

  // Hold piece
  const hold = useCallback(() => {
    const piece = activePieceRef.current;
    if (!piece || !canHold || gameStateRef.current !== 'PLAYING' || isClearingRef.current) return;

    sound.playHold();
    if (lockTimeoutRef.current !== null) {
      clearTimeout(lockTimeoutRef.current);
      lockTimeoutRef.current = null;
    }

    const currentType = piece.type;
    if (holdPiece === null) {
      // First hold: store current and spawn next from bag
      setHoldPiece(currentType);
      const nextType = getNextTetromino();
      const spawnPos = { ...SPAWN_POSITIONS[nextType] };
      const newPiece: ActivePiece = {
        type: nextType,
        position: spawnPos,
        rotation: 0,
      };
      setActivePiece(newPiece);
      activePieceRef.current = newPiece;
    } else {
      // Swap held piece with active piece
      const nextType = holdPiece;
      setHoldPiece(currentType);
      const spawnPos = { ...SPAWN_POSITIONS[nextType] };
      const newPiece: ActivePiece = {
        type: nextType,
        position: spawnPos,
        rotation: 0,
      };
      setActivePiece(newPiece);
      activePieceRef.current = newPiece;
    }

    setCanHold(false);
    lockResetCountRef.current = 0;
  }, [canHold, holdPiece, getNextTetromino]);

  // Pause / Resume
  const togglePause = useCallback(() => {
    if (gameStateRef.current === 'PLAYING') {
      setGameState('PAUSED');
      sound.stopMusic();
    } else if (gameStateRef.current === 'PAUSED') {
      setGameState('PLAYING');
      if (sound.getMusicEnabled()) {
        sound.startMusic();
      }
    }
  }, []);

  // Natural gravity drop loop
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const intervalMs = getDropSpeed(stats.level);

    const interval = setInterval(() => {
      const piece = activePieceRef.current;
      if (!piece || isClearingRef.current) return;

      const nextY = piece.position.y + 1;
      const willCollide = checkCollision(
        boardRef.current,
        piece.type,
        { x: piece.position.x, y: nextY },
        piece.rotation
      );

      if (!willCollide) {
        // Can fall freely
        const updated = {
          ...piece,
          position: { ...piece.position, y: nextY },
        };
        setActivePiece(updated);
        activePieceRef.current = updated;

        // If previously scheduled a lock, clear it because piece moved
        if (lockTimeoutRef.current !== null) {
          clearTimeout(lockTimeoutRef.current);
          lockTimeoutRef.current = null;
        }
      } else {
        // Piece hit floor or stack! Start lock delay (2000ms grace period)
        if (lockTimeoutRef.current === null) {
          lockTimeoutRef.current = window.setTimeout(() => {
            lockPiece();
          }, LOCK_DELAY_MS);
        }
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [gameState, stats.level, lockPiece]);

  // Timer loop for timeElapsed & Ultra mode (120s countdown)
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const timer = setInterval(() => {
      setStats((prev) => {
        const nextTime = prev.timeElapsed + 1;

        // Ultra mode time attack (120 seconds limit)
        if (modeRef.current === 'ultra' && nextTime >= 120) {
          sound.playGameOver();
          setGameState('GAME_OVER');
        }

        return {
          ...prev,
          timeElapsed: nextTime,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Particle physics loop
  useEffect(() => {
    if (particles.length === 0) return;

    const particleInterval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx * 0.1,
            y: p.y + p.vy * 0.1,
            vy: p.vy + 0.3, // gravity
            opacity: p.opacity - 0.04,
            life: p.life - 0.04,
          }))
          .filter((p) => p.life > 0 && p.opacity > 0)
      );
    }, 16);

    return () => clearInterval(particleInterval);
  }, [particles.length]);

  const isGrounded = activePiece
    ? checkCollision(
        board,
        activePiece.type,
        { x: activePiece.position.x, y: activePiece.position.y + 1 },
        activePiece.rotation
      )
    : false;

  return {
    mode,
    setMode,
    gameState,
    setGameState,
    board,
    activePiece,
    ghostY: activePiece ? getGhostY(activePiece, board) : null,
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
  };
}
