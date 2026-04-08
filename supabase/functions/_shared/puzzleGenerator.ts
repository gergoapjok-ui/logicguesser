// Server-side puzzle generator for edge functions (text-only, no SVGs)

export interface ServerPuzzle {
  question: string;
  answer: string;
}

function gcd(a: number, b: number): number { return b === 0 ? a : gcd(b, a % b); }

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

function mathQuadratic(): ServerPuzzle {
  const a = Math.floor(Math.random() * 8) + 1;
  const b = a + Math.floor(Math.random() * 6) + 1;
  return { question: `x² − ${a + b}x + ${a * b} = 0. What is the larger root?`, answer: String(b) };
}

function mathLogarithm(): ServerPuzzle {
  const pairs: [number, number, number][] = [
    [2, 8, 3], [2, 16, 4], [2, 32, 5], [3, 9, 2], [3, 27, 3], [5, 25, 2], [10, 100, 2], [10, 1000, 3],
  ];
  const [base, val, ans] = pairs[Math.floor(Math.random() * pairs.length)];
  return { question: `What is log base ${base} of ${val}?`, answer: String(ans) };
}

function mathFactorial(): ServerPuzzle {
  const n = Math.floor(Math.random() * 6) + 3;
  let f = 1;
  for (let i = 2; i <= n; i++) f *= i;
  return { question: `What is ${n}! (${n} factorial)?`, answer: String(f) };
}

function mathGCD(): ServerPuzzle {
  const a = Math.floor(Math.random() * 80) + 12;
  const b = Math.floor(Math.random() * 60) + 8;
  return { question: `What is the GCD of ${a} and ${b}?`, answer: String(gcd(a, b)) };
}

function mathChainedOps(): ServerPuzzle {
  const a = Math.floor(Math.random() * 12) + 2;
  const b = Math.floor(Math.random() * 8) + 2;
  const c = Math.floor(Math.random() * 6) + 1;
  const d = Math.floor(Math.random() * 10) + 1;
  return { question: `What is (${a} × ${b} + ${c}) × ${d}?`, answer: String((a * b + c) * d) };
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

function patternCubes(): ServerPuzzle {
  const offset = Math.floor(Math.random() * 3);
  const seq = Array.from({ length: 4 }, (_, i) => (i + 1 + offset) ** 3);
  return { question: `What comes next: ${seq.join(", ")}, ...?`, answer: String((5 + offset) ** 3) };
}

function patternDoubleStep(): ServerPuzzle {
  const start = Math.floor(Math.random() * 4) + 1;
  const seq = [start];
  for (let i = 1; i < 5; i++) seq.push(seq[i - 1] * 2 + 1);
  return { question: `What comes next: ${seq.join(", ")}, ...?`, answer: String(seq[4] * 2 + 1) };
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
  { question: "I have 6 eggs. I broke 2, cooked 2, and ate 2. How many eggs do I have left?", answer: "4" },
  { question: "What starts with 'e', ends with 'e', and only has one letter?", answer: "envelope" },
  { question: "If you're running a race and pass the person in 2nd place, what place are you in?", answer: "2" },
  { question: "What occurs once in a minute, twice in a moment, but never in a thousand years?", answer: "m" },
  { question: "Forward I'm heavy, backward I'm not. What am I?", answer: "ton" },
  { question: "What 5-letter word becomes shorter when you add 2 letters?", answer: "short" },
  { question: "What has 4 fingers and a thumb but isn't alive?", answer: "glove" },
  { question: "What has a head and a tail but no body?", answer: "coin" },
  { question: "What invention lets you look through a wall?", answer: "window" },
  { question: "What is full of holes but still holds water?", answer: "sponge" },
];

function logicDeduction(): ServerPuzzle {
  const puzzles: [string, string][] = [
    ["Alice is taller than Bob. Bob is taller than Carol. Who is the shortest?", "carol"],
    ["If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops Lazzies?", "yes"],
    ["I have a brother. My brother has a brother. But I have no brothers other than him. What am I?", "sister"],
  ];
  const [q, a] = puzzles[Math.floor(Math.random() * puzzles.length)];
  return { question: q, answer: a };
}

function wordAnagram(): ServerPuzzle {
  const words: [string, string][] = [
    ["LISTEN", "SILENT"], ["EARTH", "HEART"], ["NIGHT", "THING"],
    ["TASTE", "STATE"], ["BELOW", "ELBOW"], ["STUDY", "DUSTY"],
    ["FIRED", "FRIED"], ["PEARS", "SPARE"], ["STREAM", "MASTER"],
    ["DANGER", "GARDEN"], ["LEMONS", "MELONS"], ["RESCUE", "SECURE"],
    ["DRAWER", "REWARD"], ["OPTION", "POTION"],
  ];
  const [scrambled, answer] = words[Math.floor(Math.random() * words.length)];
  return { question: `Unscramble this word: ${scrambled}`, answer };
}

function wordRiddle(): ServerPuzzle {
  const riddles: [string, string][] = [
    ["I have cities but no houses, forests but no trees. What am I?", "map"],
    ["The more you take, the more you leave behind. What am I?", "footsteps"],
    ["What has keys but no locks?", "piano"],
    ["What gets wetter the more it dries?", "towel"],
    ["What has hands but can't clap?", "clock"],
    ["What has teeth but cannot bite?", "comb"],
    ["What building has the most stories?", "library"],
    ["I'm not alive, but I grow. I don't have lungs, but I need air. What am I?", "fire"],
    ["What has a head and a tail but no body?", "coin"],
    ["What is full of holes but still holds water?", "sponge"],
  ];
  const [q, a] = riddles[Math.floor(Math.random() * riddles.length)];
  return { question: q, answer: a };
}

function wordCompound(): ServerPuzzle {
  const compounds: [string, string, string][] = [
    ["sun", "flower", "sunflower"], ["rain", "bow", "rainbow"],
    ["fire", "fly", "firefly"], ["book", "worm", "bookworm"],
    ["star", "fish", "starfish"], ["butter", "fly", "butterfly"],
    ["water", "fall", "waterfall"], ["snow", "flake", "snowflake"],
  ];
  const [a, b, ans] = compounds[Math.floor(Math.random() * compounds.length)];
  return { question: `Combine these to make one word: "${a}" + "${b}" = ?`, answer: ans };
}

// ─── Cipher Puzzles ─────────────────────────────────────────────

function cipherCaesar(): ServerPuzzle {
  const words = ["HELLO", "WORLD", "LOGIC", "BRAIN", "SMART", "PUZZLE", "TIGER", "CROWN"];
  const word = words[Math.floor(Math.random() * words.length)];
  const shift = Math.floor(Math.random() * 5) + 1;
  const encrypted = word.split("").map(c => String.fromCharCode(((c.charCodeAt(0) - 65 + shift) % 26) + 65)).join("");
  return { question: `Caesar cipher (shift ${shift}): "${encrypted}" decodes to?`, answer: word.toLowerCase() };
}

function cipherMorse(): ServerPuzzle {
  const morseMap: Record<string, string> = {
    A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.",
    H: "....", I: "..", J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.",
    O: "---", P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-",
    U: "..-", V: "...-", W: ".--", X: "-..-", Y: "-.--", Z: "--..",
  };
  const words = ["SOS", "HI", "OK", "GO", "RUN", "CAT", "DOG", "SUN", "WIN", "ACE"];
  const word = words[Math.floor(Math.random() * words.length)];
  const morse = word.split("").map(c => morseMap[c]).join(" / ");
  return { question: `Decode this Morse code: ${morse}`, answer: word.toLowerCase() };
}

function cipherSubstitution(): ServerPuzzle {
  const pairs: [string, string][] = [
    ["1=A, 2=B, 3=C ... What is 8-5-12-12-15?", "hello"],
    ["1=A, 2=B, 3=C ... What is 23-15-18-12-4?", "world"],
    ["1=A, 2=B, 3=C ... What is 3-15-4-5?", "code"],
    ["1=A, 2=B, 3=C ... What is 7-1-13-5?", "game"],
  ];
  const [q, a] = pairs[Math.floor(Math.random() * pairs.length)];
  return { question: q, answer: a };
}

function cipherReverse(): ServerPuzzle {
  const words = ["ALGORITHM", "COMPUTER", "FUNCTION", "VARIABLE", "DATABASE", "KEYBOARD"];
  const word = words[Math.floor(Math.random() * words.length)];
  const reversed = word.split("").reverse().join("");
  return { question: `This word is written backwards: "${reversed}". What is it?`, answer: word.toLowerCase() };
}

// ─── Spatial Puzzles ────────────────────────────────────────────

function spatialMirrorLetter(): ServerPuzzle {
  const pairs: [string, string][] = [["b", "d"], ["d", "b"], ["p", "q"], ["q", "p"]];
  const [letter, mirror] = pairs[Math.floor(Math.random() * pairs.length)];
  return { question: `What letter appears when "${letter}" is mirrored horizontally?`, answer: mirror };
}

function spatialFolding(): ServerPuzzle {
  const folds = Math.floor(Math.random() * 2) + 1;
  const holes = Math.pow(2, folds);
  return { question: `A paper is folded ${folds} time${folds > 1 ? "s" : ""} in half, then a hole is punched. How many holes when unfolded?`, answer: String(holes) };
}

function spatialBlocks(): ServerPuzzle {
  const bottom = Math.floor(Math.random() * 4) + 2;
  const top = Math.floor(Math.random() * bottom) + 1;
  return { question: `A stack has ${bottom} blocks on the bottom row and ${top} on top. How many blocks total?`, answer: String(bottom + top) };
}

export function generateServerPuzzle(): ServerPuzzle {
  const generators = [
    mathBasic, mathHard, mathMissingOp, mathPercentage, mathSqrt, mathPower,
    mathModulo, mathEquation, mathQuadratic, mathLogarithm, mathFactorial,
    mathGCD, mathChainedOps,
    patternArithmetic, patternGeometric, patternFibLike, patternSquares,
    patternPrimes, patternCubes, patternDoubleStep,
    () => logicTricks[Math.floor(Math.random() * logicTricks.length)],
    logicDeduction, wordAnagram, wordRiddle, wordCompound,
    cipherCaesar, cipherMorse, cipherSubstitution, cipherReverse,
    spatialMirrorLetter, spatialFolding, spatialBlocks,
  ];
  return generators[Math.floor(Math.random() * generators.length)]();
}
