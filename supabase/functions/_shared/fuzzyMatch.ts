// Fuzzy answer matching for edge functions (Deno)

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

export function isAnswerCorrect(userAnswer: string, correctAnswer: string): boolean {
  const u = userAnswer.trim().toLowerCase();
  const c = correctAnswer.trim().toLowerCase();
  if (u === c) return true;
  if (/^-?\d+(\.\d+)?$/.test(c)) return u === c;
  if (c.length === 1) {
    const aliases: Record<string, string[]> = { "×": ["x", "*", "×"], "+": ["+"], "-": ["-"] };
    if (aliases[c]) return aliases[c].includes(u);
    return u === c;
  }
  const maxDist = c.length <= 4 ? 1 : c.length <= 8 ? 2 : 3;
  return levenshtein(u, c) <= maxDist;
}
