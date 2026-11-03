export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export type RotationState = 0 | 1 | 2 | 3; // 0: 0°, 1: 90°, 2: 180°, 3: 270°

export interface Position {
  x: number;
  y: number;
}

export interface ActivePiece {
  type: TetrominoType;
  position: Position;
  rotation: RotationState;
}

export type CellValue = TetrominoType | null;

export type BoardMatrix = CellValue[][]; // 20 rows x 10 cols visible (plus buffer rows)

export type GameMode = 'marathon' | 'sprint' | 'ultra' | 'zen';

export type GameState = 'TITLE_MENU' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export type ThemeId = 'cyber' | 'arcade' | 'gameboy' | 'minimal';

export interface GameStats {
  score: number;
  lines: number;
  level: number;
  singles: number;
  doubles: number;
  triples: number;
  tetrises: number;
  maxCombo: number;
  currentCombo: number;
  backToBack: boolean;
  timeElapsed: number; // in seconds
  piecesPlaced: number;
}

export interface HighScoreEntry {
  id: string;
  score: number;
  lines: number;
  level: number;
  timeElapsed: number;
  date: string;
  mode: GameMode;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  opacity: number;
  life: number;
}
