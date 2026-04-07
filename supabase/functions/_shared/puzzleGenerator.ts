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

function mathHard(): ServerPuzzle {
  const a = Math.floor(Math.random() * 50) + 10;
  const b = Math.floor(Math.random() * 30) + 5;
  const c = Math.floor(Math.random() * 20) + 2;
  const d = Math.floor(Math.random() * 10) + 1;
  return { question: `What is ${a} × ${b} − ${c} × ${d}?`, answer: String(a * b - c * d) };
}

function mathMissingOp(): ServerPuzzle {
  const pairs: [number, string, number, number][] = [
    [8, "×", 4, 32], [9, "+", 7, 16], [15, "-", 6, 9],
    [12, "×", 3, 36], [20, "-", 8, 12], [6, "×", 7, 42],
  ];
  const [a, op, b, r] = pairs[Math.floor(Math.random() * pairs.length)];
  return { question: `Fill in the blank: ${a} _ ${b} = ${r}`, answer: op };
}

function mathPercentage(): ServerPuzzle {
  const bases = [50, 80, 120, 200, 250, 400, 600, 1000];
  const pcts = [10, 15, 20, 25, 33, 50, 75];
  const base = bases[Math.floor(Math.random() * bases.length)];
  const pct = pcts[Math.floor(Math.random() * pcts.length)];
  return { question: `What is ${pct}% of ${base}?`, answer: String(base * pct / 100) };
}

function mathSqrt(): ServerPuzzle {
  const squares = [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225];
  const n = squares[Math.floor(Math.random() * squares.length)];
  return { question: `What is √${n}?`, answer: String(Math.sqrt(n)) };
}

function mathPower(): ServerPuzzle {
  const base = Math.floor(Math.random() * 8) + 2;
  const exp = Math.floor(Math.random() * 3) + 2;
  return { question: `What is ${base}^${exp}?`, answer: String(Math.pow(base, exp)) };
}

function mathModulo(): ServerPuzzle {
  const a = Math.floor(Math.random() * 100) + 10;
  const b = Math.floor(Math.random() * 12) + 2;
  return { question: `What is the remainder when ${a} is divided by ${b}?`, answer: String(a % b) };
}

function mathEquation(): ServerPuzzle {
  const x = Math.floor(Math.random() * 20) + 1;
  const a = Math.floor(Math.random() * 8) + 2;
  const b = a * x + Math.floor(Math.random() * 20);
  return { question: `Solve for x: ${a}x + ${b - a * x} = ${b}`, answer: String(x) };
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
  for (let i = 2; i < 6; i++) seq.push(seq[i - 1] + seq[i - 2]);
  return { question: `What comes next: ${seq.slice(0, 5).join(", ")}, ...?`, answer: String(seq[5]) };
}

function patternSquares(): ServerPuzzle {
  const offset = Math.floor(Math.random() * 5);
  const seq = Array.from({ length: 5 }, (_, i) => (i + 1 + offset) ** 2);
  return { question: `What comes next: ${seq.join(", ")}, ...?`, answer: String((6 + offset) ** 2) };
}

function patternPrimes(): ServerPuzzle {
  const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];
  const start = Math.floor(Math.random() * 5);
  const seq = primes.slice(start, start + 5);
  return { question: `What comes next: ${seq.join(", ")}, ...?`, answer: String(primes[start + 5]) };
}

const logicTricks: ServerPuzzle[] = [
  { question: "How many months have 28 days?", answer: "12" },
  { question: "If there are 6 apples and you take away 4, how many do you have?", answer: "4" },
  { question: "How many letters are in 'the alphabet'?", answer: "11" },
  { question: "If you divide 30 by half and add 10, what do you get?", answer: "70" },
  { question: "A farmer has 17 sheep. All but 9 run away. How many are left?", answer: "9" },
  { question: "How many times can you subtract 5 from 25?", answer: "1" },
  { question: "Three doctors said that Bill was their brother. Bill says he has no brothers. How many brothers does Bill actually have?", answer: "0" },
  { question: "If two's company and three's a crowd, what are four and five?", answer: "9" },
  { question: "Tom's father has three sons: Snap, Crackle, and ___?", answer: "tom" },
  { question: "I am an odd number. Take away a letter and I become even. What number am I?", answer: "seven" },
];

export function generateServerPuzzle(): ServerPuzzle {
  const generators = [
    mathBasic, mathHard, mathMissingOp, mathPercentage, mathSqrt, mathPower,
    mathModulo, mathEquation, patternArithmetic, patternGeometric,
    patternFibLike, patternSquares, patternPrimes,
    () => logicTricks[Math.floor(Math.random() * logicTricks.length)],
  ];
  return generators[Math.floor(Math.random() * generators.length)]();
}
