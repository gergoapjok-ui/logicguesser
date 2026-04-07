// Shared puzzle generator with rich puzzle types including visual puzzles

export type PuzzleCategory = "math" | "logic" | "patterns" | "visual" | "word";

export interface Puzzle {
  question: string;
  answer: string;
  /** SVG markup for visual puzzles */
  visual?: string;
  category: PuzzleCategory;
}

// ─── Math Puzzles ───────────────────────────────────────────────

function mathBasic(): Puzzle {
  const a = Math.floor(Math.random() * 20) + 2;
  const b = Math.floor(Math.random() * 15) + 2;
  const c = Math.floor(Math.random() * 30) + 1;
  const op = Math.random() < 0.5 ? "+" : "-";
  const result = op === "+" ? a * b + c : a * b - c;
  return { question: `What is ${a} × ${b} ${op} ${c}?`, answer: String(result), category: "math" };
}

function mathMissingOperator(): Puzzle {
  const pairs: [number, string, number, number][] = [
    [8, "×", 4, 32], [9, "+", 7, 16], [15, "-", 6, 9],
    [12, "×", 3, 36], [20, "-", 8, 12], [7, "+", 8, 15],
    [6, "×", 7, 42], [100, "-", 45, 55], [25, "+", 17, 42],
  ];
  const [a, op, b, r] = pairs[Math.floor(Math.random() * pairs.length)];
  return { question: `Fill in the blank: ${a} _ ${b} = ${r}`, answer: op, category: "math" };
}

function mathPercentage(): Puzzle {
  const bases = [50, 80, 120, 200, 250, 400];
  const pcts = [10, 20, 25, 50, 75];
  const base = bases[Math.floor(Math.random() * bases.length)];
  const pct = pcts[Math.floor(Math.random() * pcts.length)];
  return { question: `What is ${pct}% of ${base}?`, answer: String(base * pct / 100), category: "math" };
}

function mathSquareRoot(): Puzzle {
  const squares = [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144];
  const n = squares[Math.floor(Math.random() * squares.length)];
  return { question: `What is √${n}?`, answer: String(Math.sqrt(n)), category: "math" };
}

// ─── Pattern Puzzles ────────────────────────────────────────────

function patternArithmetic(): Puzzle {
  const start = Math.floor(Math.random() * 10) + 1;
  const diff = Math.floor(Math.random() * 8) + 2;
  const seq = Array.from({ length: 4 }, (_, i) => start + diff * i);
  return { question: `What comes next: ${seq.join(", ")}, ...?`, answer: String(start + diff * 4), category: "patterns" };
}

function patternGeometric(): Puzzle {
  const base = Math.floor(Math.random() * 4) + 2;
  const seq = Array.from({ length: 4 }, (_, i) => base ** (i + 1));
  return { question: `What comes next: ${seq.join(", ")}, ...?`, answer: String(base ** 5), category: "patterns" };
}

function patternFibLike(): Puzzle {
  const a = Math.floor(Math.random() * 5) + 1;
  const b = Math.floor(Math.random() * 5) + 2;
  const seq = [a, b];
  for (let i = 2; i < 5; i++) seq.push(seq[i - 1] + seq[i - 2]);
  return { question: `What comes next: ${seq.slice(0, 5).join(", ")}, ...?`, answer: String(seq[3] + seq[4]), category: "patterns" };
}

function patternAlternating(): Puzzle {
  const a = Math.floor(Math.random() * 5) + 1;
  const d1 = Math.floor(Math.random() * 3) + 2;
  const d2 = Math.floor(Math.random() * 3) + 3;
  const seq = [a, a + d1, a + d1 + d2, a + d1 + d2 + d1, a + d1 + d2 + d1 + d2];
  return { question: `What comes next: ${seq.join(", ")}, ...?`, answer: String(seq[4] + d1), category: "patterns" };
}

// ─── Logic Puzzles ──────────────────────────────────────────────

const logicTricks: Puzzle[] = [
  { question: "How many months have 28 days?", answer: "12", category: "logic" },
  { question: "If there are 6 apples and you take away 4, how many do you have?", answer: "4", category: "logic" },
  { question: "How many letters are in 'the alphabet'?", answer: "11", category: "logic" },
  { question: "If you divide 30 by half and add 10, what do you get?", answer: "70", category: "logic" },
  { question: "A farmer has 17 sheep. All but 9 run away. How many are left?", answer: "9", category: "logic" },
  { question: "How many times can you subtract 5 from 25?", answer: "1", category: "logic" },
  { question: "If you have a bowl with six apples and you take away four, how many do you have?", answer: "4", category: "logic" },
  { question: "What has a head and a tail but no body? (Answer the number of letters)", answer: "4", category: "logic" },
  { question: "Three doctors said that Bill was their brother. Bill says he has no brothers. How many brothers does Bill actually have?", answer: "0", category: "logic" },
  { question: "If a rooster lays an egg on top of a barn, which way does it roll? (0 = it doesn't)", answer: "0", category: "logic" },
];

// ─── Word Puzzles ───────────────────────────────────────────────

function wordAnagram(): Puzzle {
  const words: [string, string][] = [
    ["LISTEN", "SILENT"], ["EARTH", "HEART"], ["NIGHT", "THING"],
    ["TASTE", "STATE"], ["BELOW", "ELBOW"], ["STUDY", "DUSTY"],
    ["FIRED", "FRIED"], ["RACES", "CARES"], ["ANGEL", "ANGLE"],
  ];
  const [scrambled, answer] = words[Math.floor(Math.random() * words.length)];
  return { question: `Unscramble this word: ${scrambled}`, answer, category: "word" };
}

function wordMissing(): Puzzle {
  const clues: [string, string][] = [
    ["H_PP_", "HAPPY"], ["BR__N", "BRAIN"], ["_UZZL_", "PUZZLE"],
    ["L_G_C", "LOGIC"], ["SM_RT", "SMART"], ["TH_NK", "THINK"],
    ["QU_CK", "QUICK"], ["FL_SH", "FLASH"],
  ];
  const [pattern, answer] = clues[Math.floor(Math.random() * clues.length)];
  return { question: `Fill in the missing letters: ${pattern}`, answer, category: "word" };
}

// ─── Visual Puzzles ─────────────────────────────────────────────

const COLORS = ["#a855f7", "#22d3ee", "#f59e0b", "#ef4444", "#10b981", "#3b82f6"];

function visualCountShapes(): Puzzle {
  const shapeCount = Math.floor(Math.random() * 8) + 4;
  const targetShape = Math.random() < 0.5 ? "circle" : "rect";
  const targetName = targetShape === "circle" ? "circles" : "squares";
  let targetCount = 0;
  let shapes = "";
  for (let i = 0; i < shapeCount; i++) {
    const x = 30 + (i % 4) * 60;
    const y = 30 + Math.floor(i / 4) * 60;
    const isTarget = Math.random() < 0.5;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    if (isTarget) {
      targetCount++;
      if (targetShape === "circle") {
        shapes += `<circle cx="${x}" cy="${y}" r="18" fill="${color}" opacity="0.85"/>`;
      } else {
        shapes += `<rect x="${x - 18}" y="${y - 18}" width="36" height="36" rx="4" fill="${color}" opacity="0.85"/>`;
      }
    } else {
      if (targetShape === "circle") {
        shapes += `<rect x="${x - 18}" y="${y - 18}" width="36" height="36" rx="4" fill="${color}" opacity="0.85"/>`;
      } else {
        shapes += `<circle cx="${x}" cy="${y}" r="18" fill="${color}" opacity="0.85"/>`;
      }
    }
  }
  if (targetCount === 0) {
    targetCount = 1;
    const color = COLORS[0];
    if (targetShape === "circle") {
      shapes += `<circle cx="30" cy="30" r="18" fill="${color}" opacity="0.85"/>`;
    } else {
      shapes += `<rect x="12" y="12" width="36" height="36" rx="4" fill="${color}" opacity="0.85"/>`;
    }
  }
  const svg = `<svg viewBox="0 0 270 150" xmlns="http://www.w3.org/2000/svg"><rect width="270" height="150" rx="12" fill="#1a1a2e"/>${shapes}</svg>`;
  return { question: `How many ${targetName} are in this image?`, answer: String(targetCount), visual: svg, category: "visual" };
}

function visualPatternGrid(): Puzzle {
  // 3x3 grid with a pattern, one cell is "?" 
  const fills = ["#a855f7", "#22d3ee", "#f59e0b"];
  // Simple row-repeating pattern
  const pattern = Array.from({ length: 3 }, () => fills[Math.floor(Math.random() * fills.length)]);
  const missingIdx = Math.floor(Math.random() * 9);
  const missingColor = pattern[missingIdx % 3];
  // Map color to number answer
  const colorMap: Record<string, string> = { "#a855f7": "purple", "#22d3ee": "cyan", "#f59e0b": "yellow" };

  let cells = "";
  for (let i = 0; i < 9; i++) {
    const row = Math.floor(i / 3);
    const col = i % 3;
    const x = 20 + col * 80;
    const y = 10 + row * 55;
    if (i === missingIdx) {
      cells += `<rect x="${x}" y="${y}" width="60" height="40" rx="8" fill="#333" stroke="#666" stroke-width="2" stroke-dasharray="4"/>`;
      cells += `<text x="${x + 30}" y="${y + 26}" text-anchor="middle" fill="#888" font-size="18" font-weight="bold">?</text>`;
    } else {
      cells += `<rect x="${x}" y="${y}" width="60" height="40" rx="8" fill="${pattern[col]}" opacity="0.85"/>`;
    }
  }
  const svg = `<svg viewBox="0 0 280 180" xmlns="http://www.w3.org/2000/svg"><rect width="280" height="180" rx="12" fill="#1a1a2e"/>${cells}</svg>`;
  return { question: `What color should replace the "?" (purple, cyan, or yellow)?`, answer: colorMap[missingColor], visual: svg, category: "visual" };
}

function visualBarChart(): Puzzle {
  const labels = ["A", "B", "C", "D", "E"];
  const values = labels.map(() => Math.floor(Math.random() * 8) + 1);
  const maxVal = Math.max(...values);
  const targetIdx = Math.floor(Math.random() * labels.length);
  const questionType = Math.random() < 0.5 ? "value" : "sum";

  let bars = "";
  for (let i = 0; i < labels.length; i++) {
    const x = 30 + i * 50;
    const h = (values[i] / maxVal) * 100;
    const y = 130 - h;
    const color = i === targetIdx && questionType === "value" ? "#f59e0b" : COLORS[i % COLORS.length];
    bars += `<rect x="${x}" y="${y}" width="30" height="${h}" rx="4" fill="${color}" opacity="0.85"/>`;
    bars += `<text x="${x + 15}" y="148" text-anchor="middle" fill="#aaa" font-size="12">${labels[i]}</text>`;
    bars += `<text x="${x + 15}" y="${y - 5}" text-anchor="middle" fill="#eee" font-size="11">${values[i]}</text>`;
  }
  const svg = `<svg viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="160" rx="12" fill="#1a1a2e"/>${bars}</svg>`;

  if (questionType === "value") {
    return { question: `What is the value of the highlighted bar (${labels[targetIdx]})?`, answer: String(values[targetIdx]), visual: svg, category: "visual" };
  }
  const total = values.reduce((a, b) => a + b, 0);
  return { question: `What is the total sum of all bars?`, answer: String(total), visual: svg, category: "visual" };
}

function visualDiceCount(): Puzzle {
  const numDice = Math.floor(Math.random() * 3) + 2;
  const diceValues: number[] = [];
  let svgDice = "";
  
  for (let d = 0; d < numDice; d++) {
    const val = Math.floor(Math.random() * 6) + 1;
    diceValues.push(val);
    const dx = 20 + d * 85;
    const dy = 25;
    svgDice += `<rect x="${dx}" y="${dy}" width="65" height="65" rx="10" fill="#f5f5f5" stroke="#888" stroke-width="2"/>`;
    // Dot positions for a die face
    const dots: [number, number][] = [];
    const cx = dx + 32.5, cy = dy + 32.5;
    if ([1, 3, 5].includes(val)) dots.push([cx, cy]); // center
    if (val >= 2) { dots.push([cx - 16, cy - 16]); dots.push([cx + 16, cy + 16]); }
    if (val >= 4) { dots.push([cx + 16, cy - 16]); dots.push([cx - 16, cy + 16]); }
    if (val === 6) { dots.push([cx - 16, cy]); dots.push([cx + 16, cy]); }
    for (const [px, py] of dots) {
      svgDice += `<circle cx="${px}" cy="${py}" r="5" fill="#1a1a2e"/>`;
    }
  }
  const total = diceValues.reduce((a, b) => a + b, 0);
  const w = 20 + numDice * 85 + 10;
  const svg = `<svg viewBox="0 0 ${w} 115" xmlns="http://www.w3.org/2000/svg"><rect width="${w}" height="115" rx="12" fill="#1a1a2e"/>${svgDice}</svg>`;
  return { question: `What is the total shown on the dice?`, answer: String(total), visual: svg, category: "visual" };
}

function visualClockAngle(): Puzzle {
  const hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const h = hours[Math.floor(Math.random() * hours.length)];
  const angle = h * 30; // degrees from 12
  const hRad = (angle - 90) * Math.PI / 180;
  const hx = 75 + Math.cos(hRad) * 30;
  const hy = 75 + Math.sin(hRad) * 30;
  // Minute hand at 12
  const svg = `<svg viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">
    <rect width="150" height="150" rx="12" fill="#1a1a2e"/>
    <circle cx="75" cy="75" r="55" fill="none" stroke="#a855f7" stroke-width="3"/>
    <circle cx="75" cy="75" r="4" fill="#eee"/>
    <line x1="75" y1="75" x2="75" y2="30" stroke="#22d3ee" stroke-width="2" stroke-linecap="round"/>
    <line x1="75" y1="75" x2="${hx.toFixed(1)}" y2="${hy.toFixed(1)}" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/>
    ${[12,3,6,9].map(n => {
      const a2 = (n * 30 - 90) * Math.PI / 180;
      return `<text x="${(75 + Math.cos(a2) * 45).toFixed(1)}" y="${(75 + Math.sin(a2) * 45 + 4).toFixed(1)}" text-anchor="middle" fill="#aaa" font-size="11">${n}</text>`;
    }).join("")}
  </svg>`;
  const angleBetween = h * 30; // angle between hands when minute is at 12
  return { question: `The minute hand (cyan) points to 12. What number does the hour hand (yellow) point to?`, answer: String(h), visual: svg, category: "visual" };
}

// ─── Generator ──────────────────────────────────────────────────

const allGenerators: Record<PuzzleCategory, (() => Puzzle)[]> = {
  math: [mathBasic, mathMissingOperator, mathPercentage, mathSquareRoot],
  patterns: [patternArithmetic, patternGeometric, patternFibLike, patternAlternating],
  logic: [() => logicTricks[Math.floor(Math.random() * logicTricks.length)]],
  word: [wordAnagram, wordMissing],
  visual: [visualCountShapes, visualPatternGrid, visualBarChart, visualDiceCount, visualClockAngle],
};

export function generatePuzzle(category?: PuzzleCategory): Puzzle {
  let cats: PuzzleCategory[];
  if (category) {
    cats = [category];
  } else {
    cats = ["math", "logic", "patterns", "visual", "word"];
  }
  const cat = cats[Math.floor(Math.random() * cats.length)];
  const generators = allGenerators[cat];
  const gen = generators[Math.floor(Math.random() * generators.length)];
  return gen();
}

/** Server-side puzzle generator (no visual SVGs — text only for edge functions) */
export function generateServerPuzzle(): { question: string; answer: string } {
  const variant = Math.floor(Math.random() * 8);
  switch (variant) {
    case 0: return mathBasic();
    case 1: return mathMissingOperator();
    case 2: return mathPercentage();
    case 3: return mathSquareRoot();
    case 4: return patternArithmetic();
    case 5: return patternGeometric();
    case 6: return patternFibLike();
    case 7: return logicTricks[Math.floor(Math.random() * logicTricks.length)];
    default: return mathBasic();
  }
}
