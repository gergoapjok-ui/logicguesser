// Shared puzzle generator with rich puzzle types including visual puzzles

export type PuzzleCategory = "math" | "logic" | "patterns" | "visual" | "word";

export interface Puzzle {
  question: string;
  answer: string;
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

function mathHard(): Puzzle {
  const a = Math.floor(Math.random() * 50) + 10;
  const b = Math.floor(Math.random() * 30) + 5;
  const c = Math.floor(Math.random() * 20) + 2;
  const d = Math.floor(Math.random() * 10) + 1;
  const result = a * b - c * d;
  return { question: `What is ${a} × ${b} − ${c} × ${d}?`, answer: String(result), category: "math" };
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
  const bases = [50, 80, 120, 200, 250, 400, 600, 1000];
  const pcts = [10, 15, 20, 25, 33, 50, 75];
  const base = bases[Math.floor(Math.random() * bases.length)];
  const pct = pcts[Math.floor(Math.random() * pcts.length)];
  return { question: `What is ${pct}% of ${base}?`, answer: String(base * pct / 100), category: "math" };
}

function mathSquareRoot(): Puzzle {
  const squares = [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225];
  const n = squares[Math.floor(Math.random() * squares.length)];
  return { question: `What is √${n}?`, answer: String(Math.sqrt(n)), category: "math" };
}

function mathPower(): Puzzle {
  const base = Math.floor(Math.random() * 8) + 2;
  const exp = Math.floor(Math.random() * 3) + 2;
  return { question: `What is ${base}^${exp}?`, answer: String(Math.pow(base, exp)), category: "math" };
}

function mathFraction(): Puzzle {
  const nums = [[1, 2, 1, 4], [2, 3, 1, 6], [3, 4, 1, 4], [1, 3, 1, 3], [2, 5, 3, 5], [1, 8, 3, 8]];
  const [a, b, c, d] = nums[Math.floor(Math.random() * nums.length)];
  if (b === d) {
    const r = a + c;
    const g = gcd(r, b);
    const rn = r / g, rd = b / g;
    return { question: `What is ${a}/${b} + ${c}/${d}? (answer as fraction like 3/4)`, answer: rd === 1 ? String(rn) : `${rn}/${rd}`, category: "math" };
  }
  const lcm = (b * d) / gcd(b, d);
  const r = a * (lcm / b) + c * (lcm / d);
  const g = gcd(r, lcm);
  const rn = r / g, rd = lcm / g;
  return { question: `What is ${a}/${b} + ${c}/${d}? (answer as fraction like 3/4)`, answer: rd === 1 ? String(rn) : `${rn}/${rd}`, category: "math" };
}

function gcd(a: number, b: number): number { return b === 0 ? a : gcd(b, a % b); }

function mathModulo(): Puzzle {
  const a = Math.floor(Math.random() * 100) + 10;
  const b = Math.floor(Math.random() * 12) + 2;
  return { question: `What is the remainder when ${a} is divided by ${b}?`, answer: String(a % b), category: "math" };
}

function mathEquation(): Puzzle {
  const x = Math.floor(Math.random() * 20) + 1;
  const a = Math.floor(Math.random() * 8) + 2;
  const b = a * x + Math.floor(Math.random() * 20);
  return { question: `Solve for x: ${a}x + ${b - a * x} = ${b}`, answer: String(x), category: "math" };
}

// ─── NEW Hard Math ──────────────────────────────────────────────

function mathQuadratic(): Puzzle {
  // x^2 - (a+b)x + ab = 0  →  roots a,b
  const a = Math.floor(Math.random() * 8) + 1;
  const b = a + Math.floor(Math.random() * 6) + 1;
  const sum = a + b;
  const prod = a * b;
  return { question: `x² − ${sum}x + ${prod} = 0. What is the larger root?`, answer: String(b), category: "math" };
}

function mathLogarithm(): Puzzle {
  const pairs: [number, number, number][] = [
    [2, 8, 3], [2, 16, 4], [2, 32, 5], [2, 64, 6],
    [3, 9, 2], [3, 27, 3], [3, 81, 4],
    [5, 25, 2], [5, 125, 3], [10, 100, 2], [10, 1000, 3],
  ];
  const [base, val, ans] = pairs[Math.floor(Math.random() * pairs.length)];
  return { question: `What is log base ${base} of ${val}?`, answer: String(ans), category: "math" };
}

function mathFactorial(): Puzzle {
  const n = Math.floor(Math.random() * 6) + 3; // 3..8
  let f = 1;
  for (let i = 2; i <= n; i++) f *= i;
  return { question: `What is ${n}! (${n} factorial)?`, answer: String(f), category: "math" };
}

function mathGCD(): Puzzle {
  const a = Math.floor(Math.random() * 80) + 12;
  const b = Math.floor(Math.random() * 60) + 8;
  const g = gcd(a, b);
  return { question: `What is the GCD (greatest common divisor) of ${a} and ${b}?`, answer: String(g), category: "math" };
}

function mathCombination(): Puzzle {
  const n = Math.floor(Math.random() * 5) + 4; // 4..8
  const r = Math.floor(Math.random() * (n - 2)) + 1;
  const factorial = (x: number) => { let f = 1; for (let i = 2; i <= x; i++) f *= i; return f; };
  const c = factorial(n) / (factorial(r) * factorial(n - r));
  return { question: `How many ways can you choose ${r} items from ${n}? (${n}C${r})`, answer: String(c), category: "math" };
}

function mathChainedOps(): Puzzle {
  const a = Math.floor(Math.random() * 12) + 2;
  const b = Math.floor(Math.random() * 8) + 2;
  const c = Math.floor(Math.random() * 6) + 1;
  const d = Math.floor(Math.random() * 10) + 1;
  const result = (a * b + c) * d;
  return { question: `What is (${a} × ${b} + ${c}) × ${d}?`, answer: String(result), category: "math" };
}

function mathAbsoluteValue(): Puzzle {
  const a = Math.floor(Math.random() * 30) + 5;
  const b = Math.floor(Math.random() * 50) + 10;
  return { question: `What is |${a} − ${b}|?`, answer: String(Math.abs(a - b)), category: "math" };
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
  for (let i = 2; i < 6; i++) seq.push(seq[i - 1] + seq[i - 2]);
  return { question: `What comes next: ${seq.slice(0, 5).join(", ")}, ...?`, answer: String(seq[5]), category: "patterns" };
}

function patternAlternating(): Puzzle {
  const a = Math.floor(Math.random() * 5) + 1;
  const d1 = Math.floor(Math.random() * 3) + 2;
  const d2 = Math.floor(Math.random() * 3) + 3;
  const seq = [a, a + d1, a + d1 + d2, a + d1 + d2 + d1, a + d1 + d2 + d1 + d2];
  return { question: `What comes next: ${seq.join(", ")}, ...?`, answer: String(seq[4] + d1), category: "patterns" };
}

function patternSquares(): Puzzle {
  const offset = Math.floor(Math.random() * 5);
  const seq = Array.from({ length: 5 }, (_, i) => (i + 1 + offset) ** 2);
  return { question: `What comes next: ${seq.join(", ")}, ...?`, answer: String((6 + offset) ** 2), category: "patterns" };
}

function patternTriangular(): Puzzle {
  const tri = (n: number) => n * (n + 1) / 2;
  const seq = Array.from({ length: 5 }, (_, i) => tri(i + 1));
  return { question: `What comes next: ${seq.join(", ")}, ...?`, answer: String(tri(6)), category: "patterns" };
}

function patternPrimes(): Puzzle {
  const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];
  const start = Math.floor(Math.random() * 5);
  const seq = primes.slice(start, start + 5);
  return { question: `What comes next: ${seq.join(", ")}, ...?`, answer: String(primes[start + 5]), category: "patterns" };
}

function patternCubes(): Puzzle {
  const offset = Math.floor(Math.random() * 3);
  const seq = Array.from({ length: 4 }, (_, i) => (i + 1 + offset) ** 3);
  return { question: `What comes next: ${seq.join(", ")}, ...?`, answer: String((5 + offset) ** 3), category: "patterns" };
}

function patternDoubleStep(): Puzzle {
  // Each term = prev * 2 + 1
  const start = Math.floor(Math.random() * 4) + 1;
  const seq = [start];
  for (let i = 1; i < 5; i++) seq.push(seq[i - 1] * 2 + 1);
  return { question: `What comes next: ${seq.join(", ")}, ...?`, answer: String(seq[4] * 2 + 1), category: "patterns" };
}

function patternLookAndSay(): Puzzle {
  // 1, 11, 21, 1211, 111221 — but simplified
  const seqs: [string, string][] = [
    ["1, 11, 21, 1211", "111221"],
    ["2, 12, 1112, 3112", "211213112"],
    ["3, 13, 1113, 3113", "211311132113"],
  ];
  const [q, a] = seqs[0]; // keep it to the classic one
  return { question: `Look-and-say sequence: ${q}, ...? (describe what you see)`, answer: a, category: "patterns" };
}

// ─── Logic Puzzles ──────────────────────────────────────────────

const logicTricks: Puzzle[] = [
  { question: "How many months have 28 days?", answer: "12", category: "logic" },
  { question: "If there are 6 apples and you take away 4, how many do you have?", answer: "4", category: "logic" },
  { question: "How many letters are in 'the alphabet'?", answer: "11", category: "logic" },
  { question: "If you divide 30 by half and add 10, what do you get?", answer: "70", category: "logic" },
  { question: "A farmer has 17 sheep. All but 9 run away. How many are left?", answer: "9", category: "logic" },
  { question: "How many times can you subtract 5 from 25?", answer: "1", category: "logic" },
  { question: "Three doctors said that Bill was their brother. Bill says he has no brothers. How many brothers does Bill actually have?", answer: "0", category: "logic" },
  { question: "If a rooster lays an egg on top of a barn, which way does it roll? (0 = it doesn't)", answer: "0", category: "logic" },
  { question: "A clerk at a butcher shop is 5'10\" tall. What does he weigh?", answer: "meat", category: "logic" },
  { question: "How many sides does a circle have?", answer: "2", category: "logic" },
  { question: "If you have 3 apples and take away 2, how many apples do you have?", answer: "2", category: "logic" },
  { question: "What is heavier: a kilogram of steel or a kilogram of feathers?", answer: "neither", category: "logic" },
  { question: "A boy kicks a ball 10 feet. It comes back to him without touching anything. How?", answer: "up", category: "logic" },
  { question: "I am an odd number. Take away a letter and I become even. What number am I?", answer: "seven", category: "logic" },
  { question: "What can you hold in your right hand, but never in your left hand?", answer: "left hand", category: "logic" },
  { question: "If two's company and three's a crowd, what are four and five?", answer: "9", category: "logic" },
  { question: "How many seconds are in a year? (Trick: think differently)", answer: "12", category: "logic" },
  { question: "Tom's father has three sons: Snap, Crackle, and ___?", answer: "tom", category: "logic" },
  // NEW logic puzzles
  { question: "I have 6 eggs. I broke 2, cooked 2, and ate 2. How many eggs do I have left?", answer: "4", category: "logic" },
  { question: "What starts with 'e', ends with 'e', and only has one letter?", answer: "envelope", category: "logic" },
  { question: "If you're running a race and pass the person in 2nd place, what place are you in?", answer: "2", category: "logic" },
  { question: "A sundial has the fewest moving parts. What has the most?", answer: "hourglass", category: "logic" },
  { question: "What occurs once in a minute, twice in a moment, but never in a thousand years?", answer: "m", category: "logic" },
  { question: "How many times does the letter 'a' appear in 'banana'?", answer: "3", category: "logic" },
  { question: "If you rearrange 'CIFAIPC', you get the name of a(n) ___?", answer: "ocean", category: "logic" },
  { question: "Forward I'm heavy, backward I'm not. What am I?", answer: "ton", category: "logic" },
  { question: "What 5-letter word becomes shorter when you add 2 letters?", answer: "short", category: "logic" },
  { question: "What has 4 fingers and a thumb but isn't alive?", answer: "glove", category: "logic" },
  { question: "If a train is heading east and the wind blows west, which way does the smoke blow?", answer: "neither", category: "logic" },
];

// ─── NEW Logic with Deduction ───────────────────────────────────

function logicDeduction(): Puzzle {
  const puzzles: [string, string][] = [
    ["Alice is taller than Bob. Bob is taller than Carol. Who is the shortest?", "carol"],
    ["In a row of 5 houses, the red house is to the left of the blue house. The green house is in the middle. What position is the green house?", "3"],
    ["A is B's sister. B is C's mother. What is A to C?", "aunt"],
    ["If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops Lazzies?", "yes"],
    ["I have a brother. My brother has a brother. But I have no brothers other than him. What am I?", "sister"],
    ["There are 3 switches downstairs. Each controls a lamp upstairs. You can flip switches as much as you want, then go upstairs ONE time. How do you figure out which switch controls which lamp? (answer: the number of trips)", "1"],
  ];
  const [q, a] = puzzles[Math.floor(Math.random() * puzzles.length)];
  return { question: q, answer: a, category: "logic" };
}

function logicCryptarithmetic(): Puzzle {
  // Simple: A + B = C where each letter is a single digit
  const a = Math.floor(Math.random() * 8) + 1;
  const b = Math.floor(Math.random() * (9 - a)) + 1;
  const c = a + b;
  const letters = ["P", "Q", "R", "S", "T"];
  const la = letters[0], lb = letters[1], lc = letters[2];
  return { question: `If ${la}=${a} and ${lb}=${b}, what is ${la}+${lb}+${la}×${lb}?`, answer: String(a + b + a * b), category: "logic" };
}

// ─── Word Puzzles ───────────────────────────────────────────────

function wordAnagram(): Puzzle {
  const words: [string, string][] = [
    ["LISTEN", "SILENT"], ["EARTH", "HEART"], ["NIGHT", "THING"],
    ["TASTE", "STATE"], ["BELOW", "ELBOW"], ["STUDY", "DUSTY"],
    ["FIRED", "FRIED"], ["RACES", "CARES"], ["ANGEL", "ANGLE"],
    ["PEARS", "SPARE"], ["STREAM", "MASTER"], ["DANGER", "GARDEN"],
    ["PLATES", "STAPLE"], ["LEMONS", "MELONS"], ["ACTORS", "COSTAR"],
    ["RESCUE", "SECURE"], ["DETAIL", "TAILED"], ["OPTION", "POTION"],
    ["DRAWER", "REWARD"], ["DESIGN", "SIGNED"],
  ];
  const [scrambled, answer] = words[Math.floor(Math.random() * words.length)];
  return { question: `Unscramble this word: ${scrambled}`, answer, category: "word" };
}

function wordMissing(): Puzzle {
  const clues: [string, string][] = [
    ["H_PP_", "HAPPY"], ["BR__N", "BRAIN"], ["_UZZL_", "PUZZLE"],
    ["L_G_C", "LOGIC"], ["SM_RT", "SMART"], ["TH_NK", "THINK"],
    ["QU_CK", "QUICK"], ["FL_SH", "FLASH"], ["_NERG_", "ENERGY"],
    ["CH_LL_NGE", "CHALLENGE"], ["STR_T_GY", "STRATEGY"],
    ["M_TH_M_T_CS", "MATHEMATICS"], ["C_MPL_X_TY", "COMPLEXITY"],
    ["ALG_R_THM", "ALGORITHM"], ["_NC_D_NG", "ENCODING"],
  ];
  const [pattern, answer] = clues[Math.floor(Math.random() * clues.length)];
  return { question: `Fill in the missing letters: ${pattern}`, answer, category: "word" };
}

function wordRiddle(): Puzzle {
  const riddles: [string, string][] = [
    ["I have cities but no houses, forests but no trees, and water but no fish. What am I?", "map"],
    ["The more you take, the more you leave behind. What am I?", "footsteps"],
    ["I speak without a mouth and hear without ears. I have no body, but come alive with the wind. What am I?", "echo"],
    ["What has keys but no locks?", "piano"],
    ["What gets wetter the more it dries?", "towel"],
    ["What has a neck but no head?", "bottle"],
    ["What can travel around the world while staying in a corner?", "stamp"],
    ["What has hands but can't clap?", "clock"],
    ["What has teeth but cannot bite?", "comb"],
    ["What building has the most stories?", "library"],
    ["I'm not alive, but I grow. I don't have lungs, but I need air. What am I?", "fire"],
    ["I go all around the world but never leave my corner. What am I?", "stamp"],
    ["What has a head and a tail but no body?", "coin"],
    ["What invention lets you look through a wall?", "window"],
    ["What is full of holes but still holds water?", "sponge"],
  ];
  const [q, a] = riddles[Math.floor(Math.random() * riddles.length)];
  return { question: q, answer: a, category: "word" };
}

function wordAcronym(): Puzzle {
  const acronyms: [string, string][] = [
    ["What does CPU stand for?", "central processing unit"],
    ["What does HTML stand for?", "hypertext markup language"],
    ["What does NASA stand for?", "national aeronautics and space administration"],
    ["What does GPS stand for?", "global positioning system"],
    ["What does RAM stand for?", "random access memory"],
    ["What does URL stand for?", "uniform resource locator"],
    ["What does PDF stand for?", "portable document format"],
    ["What does SSD stand for?", "solid state drive"],
  ];
  const [q, a] = acronyms[Math.floor(Math.random() * acronyms.length)];
  return { question: q, answer: a, category: "word" };
}

function wordCompound(): Puzzle {
  const compounds: [string, string, string][] = [
    ["sun", "flower", "sunflower"],
    ["rain", "bow", "rainbow"],
    ["fire", "fly", "firefly"],
    ["book", "worm", "bookworm"],
    ["star", "fish", "starfish"],
    ["butter", "fly", "butterfly"],
    ["water", "fall", "waterfall"],
    ["snow", "flake", "snowflake"],
    ["tooth", "brush", "toothbrush"],
    ["eye", "brow", "eyebrow"],
  ];
  const [a, b, ans] = compounds[Math.floor(Math.random() * compounds.length)];
  return { question: `Combine these to make one word: "${a}" + "${b}" = ?`, answer: ans, category: "word" };
}

// ─── Visual Puzzles ─────────────────────────────────────────────

const COLORS = ["#a855f7", "#22d3ee", "#f59e0b", "#ef4444", "#10b981", "#3b82f6"];

function visualCountShapes(): Puzzle {
  const shapeCount = Math.floor(Math.random() * 10) + 6;
  const targetShape = Math.random() < 0.5 ? "circle" : "rect";
  const targetName = targetShape === "circle" ? "circles" : "squares";
  let targetCount = 0;
  let shapes = "";
  for (let i = 0; i < shapeCount; i++) {
    const x = 25 + (i % 5) * 50;
    const y = 25 + Math.floor(i / 5) * 50;
    const isTarget = Math.random() < 0.45;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    if (isTarget) {
      targetCount++;
      shapes += targetShape === "circle"
        ? `<circle cx="${x}" cy="${y}" r="16" fill="${color}" opacity="0.85"/>`
        : `<rect x="${x - 16}" y="${y - 16}" width="32" height="32" rx="4" fill="${color}" opacity="0.85"/>`;
    } else {
      shapes += targetShape === "circle"
        ? `<rect x="${x - 16}" y="${y - 16}" width="32" height="32" rx="4" fill="${color}" opacity="0.85"/>`
        : `<circle cx="${x}" cy="${y}" r="16" fill="${color}" opacity="0.85"/>`;
    }
  }
  if (targetCount === 0) { targetCount = 1; shapes += `<circle cx="25" cy="25" r="16" fill="${COLORS[0]}" opacity="0.85"/>`; }
  const svg = `<svg viewBox="0 0 275 160" xmlns="http://www.w3.org/2000/svg"><rect width="275" height="160" rx="12" fill="#1a1a2e"/>${shapes}</svg>`;
  return { question: `How many ${targetName} are in this image?`, answer: String(targetCount), visual: svg, category: "visual" };
}

function visualPatternGrid(): Puzzle {
  const fills = ["#a855f7", "#22d3ee", "#f59e0b"];
  const pattern = Array.from({ length: 3 }, () => fills[Math.floor(Math.random() * fills.length)]);
  const missingIdx = Math.floor(Math.random() * 9);
  const missingColor = pattern[missingIdx % 3];
  const colorMap: Record<string, string> = { "#a855f7": "purple", "#22d3ee": "cyan", "#f59e0b": "yellow" };
  let cells = "";
  for (let i = 0; i < 9; i++) {
    const col = i % 3;
    const x = 20 + col * 80;
    const y = 10 + Math.floor(i / 3) * 55;
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
  const questionType = Math.random() < 0.33 ? "value" : Math.random() < 0.5 ? "sum" : "diff";
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
  if (questionType === "sum") {
    return { question: `What is the total sum of all bars?`, answer: String(values.reduce((a, b) => a + b, 0)), visual: svg, category: "visual" };
  }
  const max = Math.max(...values);
  const min = Math.min(...values);
  return { question: `What is the difference between the tallest and shortest bar?`, answer: String(max - min), visual: svg, category: "visual" };
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
    const dots: [number, number][] = [];
    const cx = dx + 32.5, cy = dy + 32.5;
    if ([1, 3, 5].includes(val)) dots.push([cx, cy]);
    if (val >= 2) { dots.push([cx - 16, cy - 16]); dots.push([cx + 16, cy + 16]); }
    if (val >= 4) { dots.push([cx + 16, cy - 16]); dots.push([cx - 16, cy + 16]); }
    if (val === 6) { dots.push([cx - 16, cy]); dots.push([cx + 16, cy]); }
    for (const [px, py] of dots) svgDice += `<circle cx="${px}" cy="${py}" r="5" fill="#1a1a2e"/>`;
  }
  const total = diceValues.reduce((a, b) => a + b, 0);
  const w = 20 + numDice * 85 + 10;
  const qType = Math.random() < 0.6 ? "sum" : "product";
  const svg = `<svg viewBox="0 0 ${w} 115" xmlns="http://www.w3.org/2000/svg"><rect width="${w}" height="115" rx="12" fill="#1a1a2e"/>${svgDice}</svg>`;
  if (qType === "sum") {
    return { question: `What is the total shown on the dice?`, answer: String(total), visual: svg, category: "visual" };
  }
  const prod = diceValues.reduce((a, b) => a * b, 1);
  return { question: `What is the product of the dice values?`, answer: String(prod), visual: svg, category: "visual" };
}

function visualClockAngle(): Puzzle {
  const hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const h = hours[Math.floor(Math.random() * hours.length)];
  const hRad = (h * 30 - 90) * Math.PI / 180;
  const hx = 75 + Math.cos(hRad) * 30;
  const hy = 75 + Math.sin(hRad) * 30;
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
  return { question: `The minute hand (cyan) points to 12. What number does the hour hand (yellow) point to?`, answer: String(h), visual: svg, category: "visual" };
}

function visualMaze(): Puzzle {
  const turns = Math.floor(Math.random() * 4) + 2;
  let cx = 20, cy = 140;
  const segments: { x1: number; y1: number; x2: number; y2: number }[] = [];
  let dir: "right" | "up" = "right";
  for (let i = 0; i < turns + 1; i++) {
    const len = 30 + Math.floor(Math.random() * 40);
    let nx = cx, ny = cy;
    if (dir === "right") nx = Math.min(cx + len, 270);
    else ny = Math.max(cy - len, 20);
    segments.push({ x1: cx, y1: cy, x2: nx, y2: ny });
    cx = nx; cy = ny;
    dir = dir === "right" ? "up" : "right";
  }
  let lines = segments.map(s => `<line x1="${s.x1}" y1="${s.y1}" x2="${s.x2}" y2="${s.y2}" stroke="#22d3ee" stroke-width="3" stroke-linecap="round"/>`).join("");
  lines += `<circle cx="20" cy="140" r="6" fill="#10b981"/><text x="20" y="155" text-anchor="middle" fill="#10b981" font-size="10">S</text>`;
  lines += `<circle cx="${cx}" cy="${cy}" r="6" fill="#ef4444"/><text x="${cx}" y="${cy > 130 ? cy + 15 : cy - 10}" text-anchor="middle" fill="#ef4444" font-size="10">E</text>`;
  const svg = `<svg viewBox="0 0 290 170" xmlns="http://www.w3.org/2000/svg"><rect width="290" height="170" rx="12" fill="#1a1a2e"/>${lines}</svg>`;
  return { question: `How many turns does the path from S to E make?`, answer: String(turns), visual: svg, category: "visual" };
}

function visualPieChart(): Puzzle {
  const slices = Math.floor(Math.random() * 3) + 3;
  const values: number[] = [];
  let remaining = 100;
  for (let i = 0; i < slices - 1; i++) {
    const v = Math.floor(Math.random() * (remaining / (slices - i))) + 5;
    values.push(v);
    remaining -= v;
  }
  values.push(remaining);
  const labels = ["A", "B", "C", "D", "E"].slice(0, slices);
  let startAngle = 0;
  let paths = "";
  let legend = "";
  const cx = 90, cy = 85, r = 60;
  for (let i = 0; i < slices; i++) {
    const angle = (values[i] / 100) * 360;
    const endAngle = startAngle + angle;
    const x1 = cx + r * Math.cos((startAngle - 90) * Math.PI / 180);
    const y1 = cy + r * Math.sin((startAngle - 90) * Math.PI / 180);
    const x2 = cx + r * Math.cos((endAngle - 90) * Math.PI / 180);
    const y2 = cy + r * Math.sin((endAngle - 90) * Math.PI / 180);
    const large = angle > 180 ? 1 : 0;
    paths += `<path d="M${cx},${cy} L${x1.toFixed(1)},${y1.toFixed(1)} A${r},${r} 0 ${large} 1 ${x2.toFixed(1)},${y2.toFixed(1)} Z" fill="${COLORS[i]}" opacity="0.85"/>`;
    legend += `<rect x="195" y="${20 + i * 22}" width="14" height="14" rx="3" fill="${COLORS[i]}"/>`;
    legend += `<text x="215" y="${31 + i * 22}" fill="#ccc" font-size="11">${labels[i]}: ${values[i]}%</text>`;
    startAngle = endAngle;
  }
  const svg = `<svg viewBox="0 0 290 175" xmlns="http://www.w3.org/2000/svg"><rect width="290" height="175" rx="12" fill="#1a1a2e"/>${paths}${legend}</svg>`;
  const largest = labels[values.indexOf(Math.max(...values))];
  return { question: `Which segment is the largest?`, answer: largest.toLowerCase(), category: "visual" };
}

// ─── NEW Visual Puzzles ─────────────────────────────────────────

function visualSymmetry(): Puzzle {
  // Show a 4x4 grid, left half filled, ask what the right half should be
  const colors = ["#a855f7", "#22d3ee", "#f59e0b", "#1a1a2e"];
  const leftCols: string[][] = [];
  for (let r = 0; r < 4; r++) {
    leftCols.push([
      colors[Math.floor(Math.random() * 3)],
      colors[Math.floor(Math.random() * 3)],
    ]);
  }
  // Count filled cells on left
  let filled = 0;
  let cells = "";
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const x = 20 + c * 60;
      const y = 10 + r * 40;
      if (c < 2) {
        const col = leftCols[r][c];
        cells += `<rect x="${x}" y="${y}" width="50" height="32" rx="4" fill="${col}" opacity="0.85"/>`;
        if (col !== "#1a1a2e") filled++;
      } else {
        // Mirror side: c=2 mirrors c=1, c=3 mirrors c=0
        const mirrorC = 3 - c;
        const col = leftCols[r][mirrorC];
        if (col !== "#1a1a2e") filled++;
        cells += `<rect x="${x}" y="${y}" width="50" height="32" rx="4" fill="#333" stroke="#555" stroke-width="1" stroke-dasharray="3"/>`;
        cells += `<text x="${x+25}" y="${y+20}" text-anchor="middle" fill="#666" font-size="14">?</text>`;
      }
    }
  }
  // Divider line
  cells += `<line x1="140" y1="5" x2="140" y2="170" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4"/>`;
  const svg = `<svg viewBox="0 0 280 175" xmlns="http://www.w3.org/2000/svg"><rect width="280" height="175" rx="12" fill="#1a1a2e"/>${cells}</svg>`;
  return { question: `If the right side mirrors the left, how many colored (non-black) cells are there in total?`, answer: String(filled), visual: svg, category: "visual" };
}

function visualCountColor(): Puzzle {
  // Grid of colored dots, count specific color
  const targetColor = COLORS[Math.floor(Math.random() * 4)];
  const colorNames: Record<string, string> = { "#a855f7": "purple", "#22d3ee": "cyan", "#f59e0b": "yellow", "#ef4444": "red" };
  let count = 0;
  let dots = "";
  const total = 16 + Math.floor(Math.random() * 9);
  for (let i = 0; i < total; i++) {
    const x = 20 + (i % 6) * 45;
    const y = 20 + Math.floor(i / 6) * 38;
    const col = COLORS[Math.floor(Math.random() * 5)];
    if (col === targetColor) count++;
    dots += `<circle cx="${x}" cy="${y}" r="12" fill="${col}" opacity="0.9"/>`;
  }
  if (count === 0) { count = 1; dots += `<circle cx="20" cy="20" r="12" fill="${targetColor}" opacity="0.9"/>`; }
  const svg = `<svg viewBox="0 0 290 170" xmlns="http://www.w3.org/2000/svg"><rect width="290" height="170" rx="12" fill="#1a1a2e"/>${dots}</svg>`;
  return { question: `How many ${colorNames[targetColor] || "highlighted"} dots are there?`, answer: String(count), visual: svg, category: "visual" };
}

function visualNumberGrid(): Puzzle {
  // 3x3 grid where rows/cols sum to a value, find missing number
  const grid = [
    [Math.floor(Math.random() * 8) + 1, Math.floor(Math.random() * 8) + 1, 0],
    [Math.floor(Math.random() * 8) + 1, Math.floor(Math.random() * 8) + 1, 0],
    [0, 0, 0],
  ];
  // Fill row 3 so column sums match a target
  const colSums = [15, 15, 15];
  grid[0][2] = colSums[0] - grid[0][0] - grid[1][0]; // no, let's simplify
  // Actually: each row sums to 15
  grid[0][2] = 15 - grid[0][0] - grid[0][1];
  grid[1][2] = 15 - grid[1][0] - grid[1][1];
  grid[2][0] = 15 - grid[0][0] - grid[1][0];
  grid[2][1] = 15 - grid[0][1] - grid[1][1];
  grid[2][2] = 15 - grid[2][0] - grid[2][1];
  
  const missingR = Math.floor(Math.random() * 3);
  const missingC = Math.floor(Math.random() * 3);
  const missingVal = grid[missingR][missingC];
  
  let cells = "";
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const x = 50 + c * 65;
      const y = 20 + r * 50;
      if (r === missingR && c === missingC) {
        cells += `<rect x="${x}" y="${y}" width="55" height="40" rx="6" fill="#333" stroke="#f59e0b" stroke-width="2"/>`;
        cells += `<text x="${x+27}" y="${y+26}" text-anchor="middle" fill="#f59e0b" font-size="18" font-weight="bold">?</text>`;
      } else {
        cells += `<rect x="${x}" y="${y}" width="55" height="40" rx="6" fill="#2a2a4e"/>`;
        cells += `<text x="${x+27}" y="${y+26}" text-anchor="middle" fill="#eee" font-size="16" font-weight="bold">${grid[r][c]}</text>`;
      }
    }
  }
  cells += `<text x="265" y="55" fill="#888" font-size="11">= 15</text>`;
  cells += `<text x="265" y="105" fill="#888" font-size="11">= 15</text>`;
  cells += `<text x="265" y="155" fill="#888" font-size="11">= 15</text>`;
  
  const svg = `<svg viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="180" rx="12" fill="#1a1a2e"/>${cells}</svg>`;
  return { question: `Each row sums to 15. What number replaces the "?"?`, answer: String(missingVal), visual: svg, category: "visual" };
}

function visualCompareAreas(): Puzzle {
  // Two shapes, which has larger area?
  const rectW = Math.floor(Math.random() * 6) + 3;
  const rectH = Math.floor(Math.random() * 6) + 3;
  const circR = Math.floor(Math.random() * 4) + 2;
  const rectArea = rectW * rectH;
  const circArea = Math.round(Math.PI * circR * circR);
  
  let shapes = "";
  // Rectangle
  const rw = rectW * 12, rh = rectH * 12;
  shapes += `<rect x="${70 - rw/2}" y="${80 - rh/2}" width="${rw}" height="${rh}" rx="3" fill="#a855f7" opacity="0.8"/>`;
  shapes += `<text x="70" y="145" text-anchor="middle" fill="#a855f7" font-size="11">${rectW}×${rectH}</text>`;
  shapes += `<text x="70" y="158" text-anchor="middle" fill="#888" font-size="10">Rectangle</text>`;
  
  // Circle
  const cr = circR * 12;
  shapes += `<circle cx="210" cy="80" r="${cr}" fill="#22d3ee" opacity="0.8"/>`;
  shapes += `<text x="210" y="145" text-anchor="middle" fill="#22d3ee" font-size="11">r=${circR}</text>`;
  shapes += `<text x="210" y="158" text-anchor="middle" fill="#888" font-size="10">Circle</text>`;
  
  const svg = `<svg viewBox="0 0 280 170" xmlns="http://www.w3.org/2000/svg"><rect width="280" height="170" rx="12" fill="#1a1a2e"/>${shapes}</svg>`;
  const answer = rectArea > circArea ? "rectangle" : circArea > rectArea ? "circle" : "equal";
  return { question: `Which shape has a larger area? (Use π ≈ 3.14)`, answer, visual: svg, category: "visual" };
}

function visualLineGraph(): Puzzle {
  const points = Array.from({ length: 6 }, () => Math.floor(Math.random() * 8) + 1);
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const maxVal = Math.max(...points);
  let pathD = "";
  let dots = "";
  let labelsSvg = "";
  for (let i = 0; i < points.length; i++) {
    const x = 35 + i * 45;
    const y = 130 - (points[i] / maxVal) * 100;
    if (i === 0) pathD += `M${x},${y}`;
    else pathD += ` L${x},${y}`;
    dots += `<circle cx="${x}" cy="${y}" r="4" fill="#22d3ee"/>`;
    dots += `<text x="${x}" y="${y - 8}" text-anchor="middle" fill="#eee" font-size="10">${points[i]}</text>`;
    labelsSvg += `<text x="${x}" y="148" text-anchor="middle" fill="#888" font-size="9">${labels[i]}</text>`;
  }
  const svg = `<svg viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="160" rx="12" fill="#1a1a2e"/><path d="${pathD}" fill="none" stroke="#22d3ee" stroke-width="2"/>${dots}${labelsSvg}</svg>`;
  
  const qType = Math.random();
  if (qType < 0.33) {
    const maxDay = labels[points.indexOf(Math.max(...points))];
    return { question: `On which day was the value highest?`, answer: maxDay.toLowerCase(), visual: svg, category: "visual" };
  } else if (qType < 0.66) {
    const avg = Math.round(points.reduce((a, b) => a + b, 0) / points.length);
    return { question: `What is the average value (rounded)?`, answer: String(avg), visual: svg, category: "visual" };
  } else {
    let maxIncrease = 0;
    let maxIncDay = 1;
    for (let i = 1; i < points.length; i++) {
      const diff = points[i] - points[i - 1];
      if (diff > maxIncrease) { maxIncrease = diff; maxIncDay = i; }
    }
    return { question: `What is the biggest increase between consecutive days?`, answer: String(maxIncrease), visual: svg, category: "visual" };
  }
}

// ─── Generator ──────────────────────────────────────────────────

const allGenerators: Record<PuzzleCategory, (() => Puzzle)[]> = {
  math: [mathBasic, mathHard, mathMissingOperator, mathPercentage, mathSquareRoot, mathPower, mathFraction, mathModulo, mathEquation, mathQuadratic, mathLogarithm, mathFactorial, mathGCD, mathCombination, mathChainedOps, mathAbsoluteValue],
  patterns: [patternArithmetic, patternGeometric, patternFibLike, patternAlternating, patternSquares, patternTriangular, patternPrimes, patternCubes, patternDoubleStep, patternLookAndSay],
  logic: [() => logicTricks[Math.floor(Math.random() * logicTricks.length)], logicDeduction, logicCryptarithmetic],
  word: [wordAnagram, wordMissing, wordRiddle, wordAcronym, wordCompound],
  visual: [visualCountShapes, visualPatternGrid, visualBarChart, visualDiceCount, visualClockAngle, visualMaze, visualPieChart, visualSymmetry, visualCountColor, visualNumberGrid, visualCompareAreas, visualLineGraph],
};

export function generatePuzzle(category?: PuzzleCategory): Puzzle {
  const cats: PuzzleCategory[] = category ? [category] : ["math", "logic", "patterns", "visual", "word"];
  const cat = cats[Math.floor(Math.random() * cats.length)];
  const generators = allGenerators[cat];
  return generators[Math.floor(Math.random() * generators.length)]();
}
