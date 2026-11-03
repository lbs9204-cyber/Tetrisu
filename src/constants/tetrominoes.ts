import { TetrominoType, RotationState, ThemeId, Position } from '../types/tetris';

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
export const BUFFER_ROWS = 2; // Rows above the visible ceiling
export const TOTAL_ROWS = BOARD_HEIGHT + BUFFER_ROWS;

// Standard Tetromino shapes defined in local coordinate systems
export const TETROMINO_SHAPES: Record<TetrominoType, number[][][]> = {
  I: [
    [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
    ],
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ],
  ],
  O: [
    [
      [1, 1],
      [1, 1],
    ],
    [
      [1, 1],
      [1, 1],
    ],
    [
      [1, 1],
      [1, 1],
    ],
    [
      [1, 1],
      [1, 1],
    ],
  ],
  T: [
    [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 1, 0],
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
    [
      [0, 1, 0],
      [1, 1, 0],
      [0, 1, 0],
    ],
  ],
  S: [
    [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 0, 1],
    ],
    [
      [0, 0, 0],
      [0, 1, 1],
      [1, 1, 0],
    ],
    [
      [1, 0, 0],
      [1, 1, 0],
      [0, 1, 0],
    ],
  ],
  Z: [
    [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 0, 1],
      [0, 1, 1],
      [0, 1, 0],
    ],
    [
      [0, 0, 0],
      [1, 1, 0],
      [0, 1, 1],
    ],
    [
      [0, 1, 0],
      [1, 1, 0],
      [1, 0, 0],
    ],
  ],
  J: [
    [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 1, 1],
      [0, 1, 0],
      [0, 1, 0],
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 1],
    ],
    [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0],
    ],
  ],
  L: [
    [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1],
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [1, 0, 0],
    ],
    [
      [1, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
    ],
  ],
};

// Spawn positions (x, y in matrix including buffer rows)
export const SPAWN_POSITIONS: Record<TetrominoType, Position> = {
  I: { x: 3, y: 0 },
  O: { x: 4, y: 1 },
  T: { x: 3, y: 1 },
  S: { x: 3, y: 1 },
  Z: { x: 3, y: 1 },
  J: { x: 3, y: 1 },
  L: { x: 3, y: 1 },
};

// SRS Kick data for JLSTZ pieces
// Key: 'fromRotation->toRotation'
export const SRS_KICKS_JLSTZ: Record<string, [number, number][]> = {
  '0->1': [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
  '1->0': [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
  '1->2': [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
  '2->1': [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
  '2->3': [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
  '3->2': [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
  '3->0': [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
  '0->3': [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
};

// SRS Kick data for I piece
export const SRS_KICKS_I: Record<string, [number, number][]> = {
  '0->1': [[0, 0], [-2, 0], [1, 0], [-2, 1], [1, -2]],
  '1->0': [[0, 0], [2, 0], [-1, 0], [2, -1], [-1, 2]],
  '1->2': [[0, 0], [-1, 0], [2, 0], [-1, -2], [2, 1]],
  '2->1': [[0, 0], [1, 0], [-2, 0], [1, 2], [-2, -1]],
  '2->3': [[0, 0], [2, 0], [-1, 0], [2, -1], [-1, 2]],
  '3->2': [[0, 0], [-2, 0], [1, 0], [-2, 1], [1, -2]],
  '3->0': [[0, 0], [1, 0], [-2, 0], [1, 2], [-2, -1]],
  '0->3': [[0, 0], [-1, 0], [2, 0], [-1, -2], [2, 1]],
};

export interface ThemeColors {
  name: string;
  boardBg: string;
  gridLine: string;
  border: string;
  ghostOpacity: number;
  tetrominoes: Record<TetrominoType, {
    fill: string;
    border: string;
    shadow: string;
    highlight: string;
  }>;
}

export const THEMES: Record<ThemeId, ThemeColors> = {
  cyber: {
    name: '사이버 네온 (Cyber)',
    boardBg: '#090d16',
    gridLine: 'rgba(56, 189, 248, 0.08)',
    border: '#1e293b',
    ghostOpacity: 0.22,
    tetrominoes: {
      I: { fill: '#06b6d4', border: '#22d3ee', shadow: '#0891b2', highlight: '#67e8f9' },
      O: { fill: '#eab308', border: '#facc15', shadow: '#ca8a04', highlight: '#fef08a' },
      T: { fill: '#a855f7', border: '#c084fc', shadow: '#9333ea', highlight: '#e9d5ff' },
      S: { fill: '#10b981', border: '#34d399', shadow: '#059669', highlight: '#a7f3d0' },
      Z: { fill: '#f43f5e', border: '#fb7185', shadow: '#e11d48', highlight: '#fecdd3' },
      J: { fill: '#3b82f6', border: '#60a5fa', shadow: '#2563eb', highlight: '#bfdbfe' },
      L: { fill: '#f97316', border: '#fb923c', shadow: '#ea580c', highlight: '#fed7aa' },
    },
  },
  arcade: {
    name: '클래식 아케이드 (Arcade)',
    boardBg: '#121214',
    gridLine: 'rgba(255, 255, 255, 0.06)',
    border: '#27272a',
    ghostOpacity: 0.25,
    tetrominoes: {
      I: { fill: '#00d2d3', border: '#54a0ff', shadow: '#01a3a4', highlight: '#ffffff' },
      O: { fill: '#feca57', border: '#ff9f43', shadow: '#e67e22', highlight: '#fff2a7' },
      T: { fill: '#9b59b6', border: '#8e44ad', shadow: '#6c5ce7', highlight: '#d1ccc0' },
      S: { fill: '#1dd1a1', border: '#10ac84', shadow: '#00d2d3', highlight: '#c8d6e5' },
      Z: { fill: '#ff6b6b', border: '#ee5253', shadow: '#c0392b', highlight: '#ffeaa7' },
      J: { fill: '#2e86de', border: '#0984e3', shadow: '#1e3799', highlight: '#ffffff' },
      L: { fill: '#ff9f43', border: '#ee5253', shadow: '#d35400', highlight: '#f8c291' },
    },
  },
  gameboy: {
    name: '게임보이 1989 (GameBoy)',
    boardBg: '#8bac0f',
    gridLine: 'rgba(48, 98, 48, 0.2)',
    border: '#306230',
    ghostOpacity: 0.35,
    tetrominoes: {
      I: { fill: '#0f380f', border: '#306230', shadow: '#0f380f', highlight: '#9bbc0f' },
      O: { fill: '#1b4a1b', border: '#306230', shadow: '#0f380f', highlight: '#9bbc0f' },
      T: { fill: '#0f380f', border: '#306230', shadow: '#0f380f', highlight: '#9bbc0f' },
      S: { fill: '#215621', border: '#306230', shadow: '#0f380f', highlight: '#9bbc0f' },
      Z: { fill: '#1a4f1a', border: '#306230', shadow: '#0f380f', highlight: '#9bbc0f' },
      J: { fill: '#0f380f', border: '#306230', shadow: '#0f380f', highlight: '#9bbc0f' },
      L: { fill: '#285e28', border: '#306230', shadow: '#0f380f', highlight: '#9bbc0f' },
    },
  },
  minimal: {
    name: '미니멀 다크 (Minimal)',
    boardBg: '#18181b',
    gridLine: 'rgba(255, 255, 255, 0.04)',
    border: '#27272a',
    ghostOpacity: 0.18,
    tetrominoes: {
      I: { fill: '#38bdf8', border: '#0284c7', shadow: '#0369a1', highlight: '#e0f2fe' },
      O: { fill: '#facc15', border: '#ca8a04', shadow: '#a16207', highlight: '#fef9c3' },
      T: { fill: '#c084fc', border: '#9333ea', shadow: '#7e22ce', highlight: '#f3e8ff' },
      S: { fill: '#4ade80', border: '#16a34a', shadow: '#15803d', highlight: '#dcfce7' },
      Z: { fill: '#f87171', border: '#dc2626', shadow: '#b91c1c', highlight: '#fee2e2' },
      J: { fill: '#60a5fa', border: '#2563eb', shadow: '#1d4ed8', highlight: '#dbeafe' },
      L: { fill: '#fb923c', border: '#ea580c', shadow: '#c2410c', highlight: '#ffedd5' },
    },
  },
};

// Drop interval in milliseconds per level (classic curve)
export function getDropSpeed(level: number): number {
  const speeds: Record<number, number> = {
    1: 800,
    2: 715,
    3: 630,
    4: 550,
    5: 470,
    6: 390,
    7: 310,
    8: 230,
    9: 160,
    10: 120,
    11: 95,
    12: 75,
    13: 58,
    14: 45,
    15: 35,
  };
  if (level in speeds) {
    return speeds[level];
  }
  return Math.max(25, 35 - (level - 15) * 3);
}

// 7-Bag generator function
export function generate7Bag(): TetrominoType[] {
  const pieces: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
  // Fisher-Yates shuffle
  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
  }
  return pieces;
}
