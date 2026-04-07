// Server-side puzzle generator for edge functions (text-only, no SVGs)

export interface ServerPuzzle {
  question: string;
  answer: string;
}

function mathBasic(): ServerPuzzle {
  const a = Math.floor(Math.random() * 20) + 2;
  const b = Math.floor(Math.random() * 15) + 2;
  const c = Math.floor(Math.random() * 30) + 1;
  const op = Math.random() < 0.5 ? "+" : "-";
  const result = op === "+" ? a * b + c : a * b - c;
  return { question: `What is ${a} × ${b} ${op} ${c}?`, answer: String(result) };
}

function mathMissingOp(): ServerPuzzle {
  const pairs: [number, string, number, number][] = [
    [8, "×", 4, 32], [9, "+", 7, 16], [15, "-", 6, 9],
    [12, "×", 3, 36], [20, "-", 8, 12], [7, "+", 8, 15],
    [6, "×", 7, 42], [100, "-", 45, 55],
  ];
  const [a, op, b, r] = pairs[Math.floor(Math.random() * pairs.length)];
  return { question: `Fill in the blank: ${a} _ ${b} = ${r}`, answer: op };
}

function mathPercentage(): ServerPuzzle {
  const bases = [50, 80, 120, 200, 250, 400];
  const pcts = [10, 20, 25, 50, 75];
  const base = bases[Math.floor(Math.random() * bases.length)];
  const pct = pcts[Math.floor(Math.random() * pcts.length)];
  return { question: `What is ${pct}% of ${base}?`, answer: String(base * pct / 100) };
}

function mathSqrt(): ServerPuzzle {
  const squares = [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144];
  const n = squares[Math.floor(Math.random() * squares.length)];
  return { question: `What is √${n}?`, answer: String(Math.sqrt(n)) };
}

function patternArithmetic(): ServerPuzzle {
  const start = Math.floor(Math.random() * 10) + 1;
  const diff = Math.floor(Math.random() * 8) + 2;
  const seq = Array.from({ length: 4 }, (_, i) => start + diff * i);
  return { question: `What comes next: ${seq.join(", ")}, ...?`, answer: String(start + diff * 4) };
}

function patternGeometric(): ServerPuzzle {
  const base = Math.floor(Math.random() * 4) + 2;
  const seq = Array.from({ length: 4 }, (_, i) => base ** (i + 1));
  return { question: `What comes next: ${seq.join(", ")}, ...?`, answer: String(base ** 5) };
}

function patternFibLike(): ServerPuzzle {
  const a = Math.floor(Math.random() * 5) + 1;
  const b = Math.floor(Math.random() * 5) + 2;
  const seq = [a, b];
  for (let i = 2; i < 5; i++) seq.push(seq[i - 1] + seq[i - 2]);
  return { question: `What comes next: ${seq.slice(0, 5).join(", ")}, ...?`, answer: String(seq[3] + seq[4]) };
}

const logicTricks: ServerPuzzle[] = [
  { question: "How many months have 28 days?", answer: "12" },
  { question: "If there are 6 apples and you take away 4, how many do you have?", answer: "4" },
  { question: "How many letters are in 'the alphabet'?", answer: "11" },
  { question: "If you divide 30 by half and add 10, what do you get?", answer: "70" },
  { question: "A farmer has 17 sheep. All but 9 run away. How many are left?", answer: "9" },
  { question: "How many times can you subtract 5 from 25?", answer: "1" },
  { question: "Three doctors said that Bill was their brother. Bill says he has no brothers. How many brothers does Bill actually have?", answer: "0" },
];

export function generateServerPuzzle(): ServerPuzzle {
  const variant = Math.floor(Math.random() * 8);
  switch (variant) {
    case 0: return mathBasic();
    case 1: return mathMissingOp();
    case 2: return mathPercentage();
    case 3: return mathSqrt();
    case 4: return patternArithmetic();
    case 5: return patternGeometric();
    case 6: return patternFibLike();
    case 7: return logicTricks[Math.floor(Math.random() * logicTricks.length)];
    default: return mathBasic();
  }
}
