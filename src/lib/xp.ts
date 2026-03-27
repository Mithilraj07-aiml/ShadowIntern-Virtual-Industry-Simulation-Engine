export type Level = 'Junior' | 'Mid-Level' | 'Senior';

export interface LevelInfo {
  level: Level;
  currentXP: number;
  minXP: number;
  maxXP: number;
  progress: number; // 0-100
  color: string;
  nextLevel: Level | null;
}

export function getLevel(xp: number): Level {
  if (xp >= 121) return 'Senior';
  if (xp >= 51) return 'Mid-Level';
  return 'Junior';
}

export function getLevelInfo(xp: number): LevelInfo {
  if (xp >= 121) {
    return {
      level: 'Senior',
      currentXP: xp,
      minXP: 121,
      maxXP: 200,
      progress: Math.min(100, ((xp - 121) / 79) * 100),
      color: '#f59e0b',
      nextLevel: null,
    };
  }
  if (xp >= 51) {
    return {
      level: 'Mid-Level',
      currentXP: xp,
      minXP: 51,
      maxXP: 120,
      progress: ((xp - 51) / 70) * 100,
      color: '#8b5cf6',
      nextLevel: 'Senior',
    };
  }
  return {
    level: 'Junior',
    currentXP: xp,
    minXP: 0,
    maxXP: 50,
    progress: (xp / 50) * 100,
    color: '#06b6d4',
    nextLevel: 'Mid-Level',
  };
}

export function getLevelBadgeColor(level: Level): string {
  switch (level) {
    case 'Senior': return 'from-amber-500 to-yellow-400';
    case 'Mid-Level': return 'from-violet-500 to-purple-400';
    case 'Junior': return 'from-cyan-500 to-blue-400';
  }
}
