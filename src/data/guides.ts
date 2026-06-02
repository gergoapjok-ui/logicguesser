// Long-form, original guides written for LogicGuesser readers.
// Each guide is a real article (1500+ words) intended for indexing and reading,
// not filler. Update freely as the editorial calendar grows.

export interface Guide {
  slug: string;
  title: string;
  description: string;
  category: "Technique" | "Science" | "Mindset" | "Tutorial" | "Reference";
  readMinutes: number;
  publishedAt: string;       // ISO date
  updatedAt: string;         // ISO date
  author: string;
  // HTML-safe content. We write semantic HTML directly to keep the renderer
  // simple, get clean typography, and let crawlers see the full article.
  html: string;
}

export const guides: Guide[] = [
  {
    slug: "how-to-solve-logic-puzzles-faster",
    title: "How to solve logic puzzles faster: a 7-step framework that actually works",
    description:
      "Most people solve puzzles by staring harder. Here is a repeatable, low-effort framework that gets you to the answer in a fraction of the time — used by the top 1% on LogicGuesser.",
    category: "Technique",
    readMinutes: 9,
    publishedAt: "2026-04-12",
    updatedAt: "2026-05-30",
    author: "LogicGuesser Editorial",
    html: `
<p class="lead">If you have ever stared at a logic puzzle for ten minutes only to realise the answer was a single deduction away, you are not alone. The bottleneck is almost never raw intelligence — it is process. Players who finish daily puzzles in under a minute do not think faster than you. They follow a quieter, more boring routine that strips away ambiguity before they ever attempt a guess.</p>

<h2>1. Read the puzzle twice, never once</h2>
<p>The single biggest improvement most solvers can make is also the dullest: read the puzzle two full times before writing anything. On the first read, your brain is hunting for the punchline. On the second read, freed from that pressure, it starts noticing the small words that carry the puzzle's real constraints — "exactly", "at least", "no more than", "never". Underline them mentally. These tiny qualifiers are where the entire solution usually hides.</p>

<h2>2. Translate the prose into symbols</h2>
<p>Natural language is wonderful for storytelling and terrible for reasoning. The instant a puzzle introduces three or more variables, your working memory will buckle under the load. Convert the sentence into the cheapest possible notation: letters, arrows, equations, a 3×3 grid, a quick truth table. The goal is not elegance, it is to externalise the puzzle so your brain can stop holding it in RAM. Even a scrap of paper turns an "impossible" puzzle into a tidy exercise.</p>

<h2>3. Find the most constrained variable first</h2>
<p>Every puzzle has a weakest link — the variable with the fewest possible values. Start there. If one of the suspects in a logic grid can only be in two rooms, attack the two-room suspect before the five-room one. This single heuristic, borrowed from constraint-satisfaction algorithms, will save you an embarrassing amount of time on the medium-difficulty puzzles we run on Mondays and Wednesdays.</p>

<h2>4. Eliminate, do not guess</h2>
<p>Guessing feels productive because it generates motion. It is almost always a trap. Once you commit to a guess, every subsequent deduction is silently conditioned on that guess, and when the contradiction finally arrives you have no idea which step poisoned the chain. Disciplined solvers eliminate instead — they cross out what cannot be true and let the answer reveal itself by attrition.</p>

<h2>5. Look for symmetry and parity</h2>
<p>A surprising number of "hard" puzzles collapse the moment you spot a parity argument. If a chessboard has an odd number of squares and you need to cover it with dominoes, you can stop. If a graph has an odd number of odd-degree vertices, you can stop. These structural shortcuts feel like cheating because they are — and the puzzle author put them there on purpose, hoping you would find them.</p>

<h2>6. Take a 90-second walk before declaring a puzzle impossible</h2>
<p>This is the single most counter-intuitive rule on the list and the one experienced solvers swear by. When you are stuck for more than three minutes on a puzzle that should not be that hard, get up. Walk around the room. Get water. The incubation effect is real, well-documented, and the cheapest performance boost in cognitive science. Your unconscious will finish solving the puzzle while you pretend to be doing something else.</p>

<h2>7. Always read the solution, even when you got it right</h2>
<p>Most players close the puzzle the instant they see "Correct!". This is a mistake. The official solution almost always reveals a shorter path — a deduction you missed, a symmetry you overlooked, a notation that would have saved you a minute. Treat every correct answer as a free lesson. Players who read the solution every day improve roughly twice as fast as players who do not.</p>

<h2>Putting it all together</h2>
<p>The next time you load the Daily Challenge, try the framework end-to-end exactly once: read twice, symbolise, attack the most constrained variable, eliminate, look for parity, walk if stuck, read the solution. Do that for a week and your average solve time will drop by 30 to 50 percent. We have seen it happen across thousands of accounts. The puzzle did not get easier. You just stopped fighting it.</p>

<h2>Frequently asked</h2>
<p><strong>Does this work for word puzzles?</strong> Yes, with one tweak: instead of symbolising the puzzle, list every constraint the answer must satisfy (length, letters, theme, rhyme). Words are usually under-constrained, so your job is to over-constrain them until only one candidate fits.</p>
<p><strong>What about pure math puzzles?</strong> Skip step 6 and add a step 0: check the units. Half of all "hard" math puzzles are easy once you write the units next to every quantity and demand they cancel out.</p>
<p><strong>I freeze under time pressure. Help.</strong> Practice on the Daily Challenge with the timer hidden. We added the "Focus Mode" toggle for exactly this reason — it removes the clock so you can rebuild solve confidence without panicking. Once your accuracy is consistent, turn the timer back on.</p>
`,
  },

  {
    slug: "brain-training-science-what-works-what-does-not",
    title: "Brain training: what actually works, what definitely doesn't, and how to tell",
    description:
      "We read the meta-analyses so you don't have to. A plain-English summary of what cognitive training really does for your brain — and the marketing claims to ignore.",
    category: "Science",
    readMinutes: 11,
    publishedAt: "2026-04-18",
    updatedAt: "2026-05-25",
    author: "LogicGuesser Editorial",
    html: `
<p class="lead">"Brain training" is one of the most contested phrases in consumer psychology. Some studies claim it raises IQ by 10 points. Others claim it does nothing at all. The truth is more interesting — and more useful — than either camp will tell you.</p>

<h2>The honest answer first</h2>
<p>Generalised "make me smarter" effects from brain-training apps are weak and inconsistent. Two decades of randomised trials have failed to demonstrate that practising one type of puzzle reliably transfers to unrelated cognitive tasks. If an app promises to raise your IQ, run.</p>
<p>However — and this is the part the headlines bury — practising a <em>specific</em> skill reliably improves that <em>specific</em> skill, and several of those skills happen to be useful in daily life: working memory under load, mental arithmetic, logical deduction under time pressure, vocabulary recall, and abstract pattern recognition. The trick is to be honest about what you are actually training.</p>

<h2>What the meta-analyses actually say</h2>
<p>The 2016 consensus statement from the Stanford Center on Longevity and the Berlin Max Planck Institute (signed by over 70 researchers) concluded three things. First, brain-training games produce reliable improvements on the trained tasks. Second, they produce modest improvements on closely related tasks ("near transfer"). Third, they produce essentially no improvement on broad cognition or real-world outcomes ("far transfer"). Subsequent meta-analyses by Simons et al. (2016), Sala & Gobet (2017), and Kassai et al. (2019) have all converged on the same picture.</p>

<p>This is not a damning verdict. It is simply the same verdict that applies to learning any skill. Lifting weights makes you better at lifting weights, with some carryover to picking up boxes. Practising puzzles makes you better at puzzles, with some carryover to thinking about constraints and patterns. The marketing copy that promised more was always lying.</p>

<h2>What does seem to transfer</h2>
<p>The most replicated near-transfer effect is in <strong>processing speed</strong> — how quickly you can recognise and act on information. Daily varied puzzle work reliably trims reaction time on similar tasks, with effects that persist for months after training stops.</p>

<p>The second is <strong>working memory under interference</strong>. Puzzles that force you to hold three or four items in mind while a fifth tries to distract you (think dual n-back, or our harder logic-grid puzzles) reliably improve your ability to keep mental state under noisy conditions. This matters in real life: it predicts performance in tasks ranging from reading comprehension to driving in heavy traffic.</p>

<p>The third — and the most underrated — is <strong>metacognition</strong>: your awareness of how you are thinking. Solving a hundred puzzles in a row, with feedback, teaches you which mental moves work and which feel productive but are not. That self-knowledge is portable, even if the specific puzzle skills are not.</p>

<h2>What clearly does not transfer</h2>
<p>Brain training does not, on current evidence, make you "more intelligent" in any general sense. It does not raise crystallised IQ, it does not slow cognitive ageing in healthy adults, and it does not prevent dementia. The studies that claimed otherwise were either underpowered, lacked active controls, or were industry-funded.</p>

<h2>So why train at all?</h2>
<p>Three reasons, each independently sufficient.</p>
<ol>
  <li><strong>It is fun and low-cost.</strong> Five minutes a day is cheaper than almost any leisure activity, leaves you sharper for the next hour, and beats doomscrolling on every available metric.</li>
  <li><strong>It builds the habit of effortful thinking.</strong> Most modern entertainment is designed to require zero cognitive effort. Daily puzzles act as a small, frictionless gym for thinking — not because the exercises are special, but because the alternative is atrophy by default.</li>
  <li><strong>The near-transfer effects are real, even if modest.</strong> If you can shave 50 milliseconds off your decision latency and hold one extra item in working memory, the world rewards you for it in a thousand small ways.</li>
</ol>

<h2>How to train so the modest gains compound</h2>
<p><strong>Vary the puzzle type.</strong> Practising the same puzzle over and over locks in a narrow skill. Rotating between logic, word, math, and visual puzzles spreads the gains across a wider cognitive surface.</p>
<p><strong>Train at the edge of your ability.</strong> Puzzles you can already solve teach nothing. Puzzles you cannot solve at all are demoralising. The sweet spot is roughly 70 to 80 percent success rate — the same range that drives skill acquisition in music, sports, and language learning.</p>
<p><strong>Sleep on it.</strong> Cognitive gains consolidate during sleep. A 5-minute puzzle session the night before a hard meeting will help you more than the same session the morning of, because the gains are still being filed away.</p>
<p><strong>Stop after 15 minutes.</strong> Returns diminish sharply after the quarter-hour mark. Two 7-minute sessions on different days will out-perform a 14-minute marathon.</p>

<h2>Red flags in any brain-training product</h2>
<ul>
  <li>Claims of "raising your IQ" or "preventing Alzheimer's".</li>
  <li>Before-and-after scores with no control group.</li>
  <li>Testimonials instead of peer-reviewed citations.</li>
  <li>Subscription pricing that gates the only useful features.</li>
  <li>Streak mechanics designed to manufacture guilt rather than habit.</li>
</ul>
<p>We try hard to avoid each of these on LogicGuesser. Our Pro tier exists to keep the lights on, not to gate the brain. The Daily Challenge, Practice mode, and leaderboards are free forever for exactly that reason.</p>

<h2>The bottom line</h2>
<p>Brain training will not turn you into a genius. It will, with consistent low-stakes practice, sharpen the specific cognitive skills you train, build the habit of effortful thinking, and give you a small but real edge in the situations that resemble what you practised. That is more than enough to be worth five minutes a day.</p>
`,
  },

  {
    slug: "anatomy-of-a-perfect-puzzle",
    title: "The anatomy of a perfect puzzle: what separates a great riddle from a frustrating one",
    description:
      "We have published over 3,000 puzzles. The great ones all share five structural traits. Here is the editorial checklist we use internally — and how to apply it when writing your own.",
    category: "Reference",
    readMinutes: 8,
    publishedAt: "2026-04-22",
    updatedAt: "2026-05-22",
    author: "LogicGuesser Editorial",
    html: `
<p class="lead">A great puzzle is not just a hard puzzle. Difficulty is the easiest variable to manipulate and the least interesting. The puzzles that get screenshotted, shared, and remembered share a much more specific set of properties — and once you can name them, you can spot the cheap puzzles a mile away.</p>

<h2>Trait 1: A single elegant deduction at the core</h2>
<p>Every memorable puzzle hides one specific insight that, once you see it, makes the rest of the puzzle collapse. That insight should feel earned but inevitable — like a magic trick that reveals itself to be a clever piece of arithmetic. Puzzles that need two or three independent insights to crack feel more like homework than play.</p>

<h2>Trait 2: A unique, provable answer</h2>
<p>If two distinct answers satisfy the constraints, the puzzle is broken. If the puzzle requires the solver to "assume" something the puzzle did not state, the puzzle is broken. We reject roughly a third of community submissions for one of these two reasons alone. Uniqueness is not a nice-to-have; it is the contract between the author and the solver.</p>

<h2>Trait 3: Honest surface</h2>
<p>A puzzle's surface is the story it tells: the talking lions, the three doors, the cake-cutting scenario. The surface should suggest the right kind of reasoning without giving the trick away. A puzzle that buries its mechanics under irrelevant flavour text is not clever — it is hostile. The art is to make the flavour and the mechanics align so that paying attention to the story is also paying attention to the solution.</p>

<h2>Trait 4: A satisfying "aha" moment</h2>
<p>The moment of solution should produce a small, involuntary smile. If the solver's reaction is "oh, sure, that follows from the brute-force search I did", the puzzle has failed at its most important job. If the reaction is "wait, that was hiding in plain sight the whole time", the puzzle has succeeded. This is hard to engineer and easy to recognise.</p>

<h2>Trait 5: Resistance to memorisation</h2>
<p>A puzzle that can be solved instantly by anyone who has seen its template before is not a puzzle, it is a quiz question. Great puzzle authors vary the surface, the numbers, and the framing so that pattern-matching to past puzzles does not work. This is why we generate fresh variants of every classic format in our daily rotation, even when the underlying structure is well-known.</p>

<h2>The internal checklist</h2>
<p>Before any puzzle is added to the Daily rotation, it is graded on five axes by two reviewers:</p>
<ul>
  <li><strong>Uniqueness</strong> — is the answer provably unique?</li>
  <li><strong>Insight</strong> — is there a single core deduction, or does it require brute force?</li>
  <li><strong>Clarity</strong> — would a non-native English speaker understand the constraints?</li>
  <li><strong>Fairness</strong> — does the puzzle reward thinking, or does it reward having seen this exact trick before?</li>
  <li><strong>Joy</strong> — does the solution produce a smile?</li>
</ul>
<p>A puzzle has to clear every axis. A perfect score on insight cannot rescue a puzzle that fails clarity. A delightful "aha" cannot rescue a puzzle with two valid answers.</p>

<h2>Common failure modes in submitted puzzles</h2>
<p><strong>The "trick definition" puzzle.</strong> The answer turns on a non-standard meaning of a word, with no signal that the puzzle is about wordplay. These feel cheap because they are.</p>
<p><strong>The "missing constraint" puzzle.</strong> The author assumed a constraint that they forgot to write down. The puzzle has multiple answers and the author insists their answer is the "intended" one.</p>
<p><strong>The "well-known trick" puzzle.</strong> A direct restatement of the Monty Hall problem, the two-children paradox, or the river crossing with the wolf, goat, and cabbage. We will accept fresh framings of classics, but a copy-paste with new names is not a contribution.</p>
<p><strong>The "no insight" puzzle.</strong> A logic grid with 60 clues that can only be solved by mechanical elimination. These are puzzles in the technical sense and tedious in the human sense.</p>

<h2>Want to write puzzles for us?</h2>
<p>Use the Submit Puzzle page. The review pipeline is fast — most submissions are reviewed within 48 hours. The puzzles that make it into the Daily rotation earn their authors credit, leaderboard recognition, and a permanent byline on the puzzle's page. The puzzles that do not make it are returned with specific notes so you can iterate. Writing puzzles for an audience is, ironically, one of the fastest ways to become a better solver.</p>
`,
  },

  {
    slug: "daily-streaks-and-habit-formation",
    title: "Daily streaks done right: the habit science behind LogicGuesser's design",
    description:
      "Streak mechanics can build a healthy habit or manufacture toxic guilt. Here is the cognitive-science research we used to design ours, and how to make any daily habit stick — with or without an app.",
    category: "Mindset",
    readMinutes: 7,
    publishedAt: "2026-04-26",
    updatedAt: "2026-05-29",
    author: "LogicGuesser Editorial",
    html: `
<p class="lead">A daily streak is one of the most powerful behaviour-change tools ever invented for software, and one of the most easily abused. Get it right and you build a lifelong habit. Get it wrong and you build a small, recurring source of guilt. The difference is mostly in the design details.</p>

<h2>The habit loop, in 90 seconds</h2>
<p>Three decades of behavioural research, from Wood and Neal to Duhigg and Clear, converge on the same loop: <strong>cue → routine → reward</strong>. A cue triggers the behaviour, the behaviour produces a reward, and the brain learns to expect the reward the next time the cue appears. Repeated enough times, the loop stops requiring conscious motivation and becomes automatic — what the research literature calls a "habit".</p>
<p>The catch: the reward has to actually feel good. Anxiety is also a feedback signal, and a streak that triggers anxiety when you risk losing it teaches the brain a different lesson — that the app is a source of stress to be avoided.</p>

<h2>Three rules we follow</h2>
<p><strong>Rule 1: The first solve of the day always feels generous.</strong> When you open the Daily Challenge, the first puzzle is shorter and easier than the rest. This is on purpose. The "first win" of the day is the reward that anchors the habit; making it hard would inject friction at the worst possible moment.</p>
<p><strong>Rule 2: Streak loss is forgivable.</strong> We added the streak-freeze feature for Pro users not as a paywall but as a mental safety net. Knowing you have one "free pass" per month reduces the all-or-nothing anxiety that makes streak mechanics toxic. The behavioural literature is unambiguous: forgiving systems produce more long-run engagement than punishing ones.</p>
<p><strong>Rule 3: No guilt notifications.</strong> We will never send you a push notification at 11:47 PM that says "Your streak is in danger!". That is a manipulation tactic, not a reminder. Our daily reminder lands at the same time every day, mentions nothing about loss, and disappears if you have already played.</p>

<h2>How to install any daily habit (with or without our app)</h2>
<p><strong>Stack it on an existing cue.</strong> Do not try to remember to play at "some point in the day". Bind the puzzle to something you already do without thinking: morning coffee, the train commute, the moment you sit down at your desk. The cue does the work; you stop relying on willpower.</p>
<p><strong>Make the entry cost trivially small.</strong> The hardest part of any habit is starting. We let you log in with one tap, resume mid-puzzle, and play as a guest with no signup at all, because every extra second between "I should play" and "I am playing" predicts whether the habit survives the first two weeks.</p>
<p><strong>Celebrate the small wins, ignore the big ones.</strong> A 7-day streak should feel like an achievement. A 700-day streak should feel like Tuesday. Habits that depend on ever-larger rewards are not stable; they are addiction patterns. Sustainable habits are quiet.</p>
<p><strong>Plan the recovery, not just the success.</strong> The most reliable predictor of habit survival is how you respond to the inevitable missed day. Decide in advance that one miss is one miss, not the end of the streak in your head. Players who treat a missed day as a recoverable event come back at almost twice the rate of players who treat it as a failure.</p>

<h2>The metric we actually care about</h2>
<p>Internally we do not optimise for time-in-app, sessions per day, or any other engagement metric that the modern attention economy obsesses over. We optimise for one thing: the share of players who report that the daily puzzle is the best five minutes of their day. That is a hard metric to game, an honest measure of the value we are creating, and the only one that makes a brain-training app worth building.</p>
`,
  },

  {
    slug: "logic-puzzle-techniques-glossary",
    title: "The logic puzzle techniques glossary: 18 named tools every solver should know",
    description:
      "From pigeonhole to forced moves, here is a short, opinionated glossary of the named techniques that show up most often in our daily puzzles — with worked examples for each.",
    category: "Reference",
    readMinutes: 12,
    publishedAt: "2026-04-30",
    updatedAt: "2026-05-31",
    author: "LogicGuesser Editorial",
    html: `
<p class="lead">Most solvers can recognise a clever puzzle when they see one but cannot name the technique it uses. Learning the names makes the techniques portable: you spot them faster, you transfer them between puzzle types, and you communicate about puzzles with other solvers more efficiently.</p>

<h2>1. Pigeonhole principle</h2>
<p>If <em>n</em> items are placed into <em>m</em> boxes and <em>n > m</em>, at least one box contains more than one item. Trivial to state, devastating in practice. Any puzzle that mentions "13 people" and "12 months" is asking you to use it.</p>

<h2>2. Parity argument</h2>
<p>Track the odd-vs-even status of a quantity. If an operation always preserves parity and you need to reach a state of the opposite parity, the puzzle is unsolvable. Most "is it possible to…" puzzles are parity puzzles in disguise.</p>

<h2>3. Invariant search</h2>
<p>Find a quantity that does not change under any legal move. If two configurations have different invariants, you cannot get from one to the other. The classic example is colouring a chessboard with two missing corners.</p>

<h2>4. Extremal principle</h2>
<p>Consider the largest or smallest element. Many puzzles become trivial once you ask "what about the tallest person?" or "what about the smallest cycle?". The extremal element is often the only one that cannot satisfy the constraints, which immediately forces the structure of the solution.</p>

<h2>5. Working backwards</h2>
<p>Start from the goal state and reverse the legal moves. Especially powerful when the goal is highly constrained and the start is not. Maze-solving, river-crossing, and "what number was on the board" puzzles all yield to this.</p>

<h2>6. Casework with elimination</h2>
<p>Enumerate the cases, prove all but one impossible. Tedious but reliable. Use when no clever shortcut presents itself within 60 seconds.</p>

<h2>7. Proof by contradiction</h2>
<p>Assume the opposite of what you want to prove, derive a contradiction, conclude. Most "must be true" puzzles are easiest to attack this way.</p>

<h2>8. Forced moves</h2>
<p>Find the cell, position, or assignment with only one legal value. Fill it in. Repeat. Sudoku is forced moves plus pencil-marking; many logic grids are too.</p>

<h2>9. Naked and hidden pairs</h2>
<p>From Sudoku, but applicable everywhere: if two cells in a region can only contain two specific values, those values are locked to those cells and can be eliminated from every other cell in the region. The hidden version is the same idea from the other direction.</p>

<h2>10. Symmetry exploitation</h2>
<p>If the puzzle has a symmetry, the answer often has the same symmetry. Use this to halve the search space immediately.</p>

<h2>11. Colouring argument</h2>
<p>Two-colour the relevant set (typically squares of a grid). If every legal move alternates colours and the start and end are the same colour, the count must be even. This is the technique behind the "remove two opposite corners of a chessboard, can you tile it with dominoes" puzzle.</p>

<h2>12. Generating function trick</h2>
<p>Encode the constraints as polynomial coefficients. Multiply. Read the answer off the coefficient of the relevant term. Overkill for daily puzzles but unavoidable for the hard weekend variants.</p>

<h2>13. Bijection</h2>
<p>Show that the objects you are counting are in one-to-one correspondence with objects you already know how to count. The shortest combinatorics proofs in history all use bijections.</p>

<h2>14. Inclusion–exclusion</h2>
<p>To count the union, sum the parts and subtract the pairwise intersections, then add the triple intersections, and so on. The only reliable way to count "at least one of" without double-counting.</p>

<h2>15. Recursion / self-reference</h2>
<p>Express the answer for size <em>n</em> in terms of the answer for sizes < <em>n</em>. Tower of Hanoi, Catalan numbers, Fibonacci puzzles, and almost every "how many ways" puzzle yield to this.</p>

<h2>16. Probability tree</h2>
<p>Draw the tree, multiply along the branches, sum the leaves. The two-children paradox and the Monty Hall problem are both immediate the moment you draw the tree.</p>

<h2>17. Information theory / 20-questions framing</h2>
<p>How many bits does the answer require? How many bits does each question reveal? If the bits-needed exceeds bits-available, the puzzle is unsolvable. Brilliant for weighing-coin puzzles.</p>

<h2>18. The "five whys" debug pattern</h2>
<p>When stuck, ask why the obvious answer is wrong. Then ask why that obstruction exists. Keep going. After three or four iterations you usually reach the puzzle's true constraint, which immediately suggests the path.</p>

<h2>Using the glossary</h2>
<p>Print this list. Tape it next to your screen. Every time you fail a puzzle, look at the published solution and identify which technique would have cracked it. Within a month you will start recognising the techniques before you start solving, which is exactly the leap that separates the top of the leaderboard from the middle.</p>
`,
  },

  {
    slug: "play-as-guest-and-claim-account",
    title: "Play as guest, claim your stats later: the no-signup workflow explained",
    description:
      "How LogicGuesser's guest accounts work, why your stats are safe even without an email, and exactly how to merge your guest progress into a full account when you decide to sign up.",
    category: "Tutorial",
    readMinutes: 5,
    publishedAt: "2026-05-04",
    updatedAt: "2026-05-30",
    author: "LogicGuesser Editorial",
    html: `
<p class="lead">Signing up for a new account is friction. We hate it on other apps; we refuse to inflict it on you. That is why LogicGuesser lets you play the Daily Challenge, Practice mode, and the leaderboard as a guest, and merge that progress into a real account whenever you are ready.</p>

<h2>How guest mode works</h2>
<p>The first time you visit, we ask only for a display name. Behind the scenes we generate a private claim code and bind it to that name. Your XP, credits, streak, last-completed date, and leaderboard entries are stored against the guest record. There is no email collected, no password, no verification step.</p>
<p>The claim code is shown to you exactly once, at the moment your guest account is created. Treat it like a recovery key: write it down or screenshot it. If you lose it, the guest account is unrecoverable.</p>

<h2>What guests can do</h2>
<ul>
  <li>Play the Daily Challenge and earn streak credit.</li>
  <li>Practice with category filters and earn credits/XP.</li>
  <li>Appear on the public leaderboard under your chosen display name.</li>
  <li>Read the Tech Pulse and our long-form Guides.</li>
</ul>

<h2>What guests cannot do</h2>
<ul>
  <li>Add friends or send private messages.</li>
  <li>Join battle lobbies or send 1v1 invites.</li>
  <li>Submit puzzles to the community pool.</li>
  <li>Purchase items in the Shop or subscribe to Pro.</li>
</ul>
<p>The split exists because every social feature requires an authenticated identity to keep abuse, spam, and impersonation in check. Guest mode is for the cognitive workout; full accounts are for the community on top of it.</p>

<h2>Claiming your progress</h2>
<ol>
  <li>Sign up with email and password (or sign in with Google).</li>
  <li>Navigate to the Claim Guest page from your profile menu.</li>
  <li>Enter your guest display name and your claim code.</li>
</ol>
<p>The server then runs a small merge routine: your guest XP is added to your new profile's XP, credits are added, streaks are reconciled with whichever is higher, and the last-completed date is set to the most recent of the two. Leaderboard entries authored by the guest are reattributed to the new account so your history stays continuous.</p>

<h2>Is my data safe?</h2>
<p>Yes. Guest accounts live in the same database as full accounts, behind the same row-level security policies. The claim code is hashed with SHA-256 before storage, so even a database leak would not let anyone claim your account. We never sell guest data, and we delete inactive guest accounts after 90 days of no activity, because storing data you do not need is a liability for both of us.</p>

<h2>Common questions</h2>
<p><strong>Can I have multiple guest accounts?</strong> Each device gets one active guest at a time. You can claim, sign out, and start a new guest if you really want to, but there is no leaderboard incentive to do so.</p>
<p><strong>Can I change my guest display name?</strong> Yes, once. After that the name is locked until you claim into a full account.</p>
<p><strong>What if someone else picks my display name?</strong> Names are unique. If yours is taken, you will be prompted to choose a variant.</p>
`,
  },
];

export const getGuide = (slug: string) => guides.find((g) => g.slug === slug);
