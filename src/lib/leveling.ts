// XP thresholds: Level 1 = 0, Level 2 = 100, Level 3 = 300, Level 4 = 600, Level 5 = 1000, ...
// Formula: threshold(n) = 50 * n * (n - 1)  →  level = floor((1 + sqrt(1 + xp/25)) / 2)

export function getLevel(xp: number): number {
  if (xp < 0) return 1;
  return Math.max(1, Math.floor((1 + Math.sqrt(1 + xp / 25)) / 2));
}

export function getXpForLevel(level: number): number {
  return 50 * level * (level - 1);
}

export function getLevelProgress(xp: number): { level: number; current: number; needed: number; percent: number } {
  const level = getLevel(xp);
  const currentThreshold = getXpForLevel(level);
  const nextThreshold = getXpForLevel(level + 1);
  const current = xp - currentThreshold;
  const needed = nextThreshold - currentThreshold;
  return { level, current, needed, percent: Math.min(100, Math.round((current / needed) * 100)) };
}
