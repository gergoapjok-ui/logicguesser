

# Security Fixes & Next Steps for LOGICGUESSER

## Security Issues Found

The security scan flagged **4 issues** — 2 critical, 2 warnings:

1. **CRITICAL — Puzzle answers are publicly readable.** Anyone can query the database directly and see all answers, including future puzzles. This completely breaks the game.
2. **CRITICAL — Leaderboard scores can be faked.** Users can submit any `time_taken` value (even 0 seconds) directly to the database.
3. **Warning — User credits/XP publicly visible.** Anyone can see every user's credit balance.
4. **Warning — Leaked password protection disabled.** Passwords aren't checked against known breach databases.

## Plan to Fix

### Step 1: Protect puzzle answers with an Edge Function

- Create a `validate-answer` Edge Function that:
  - Accepts `{ puzzle_id, answer }` from an authenticated user
  - Looks up the correct answer server-side (using the service role key)
  - Returns `{ correct: true/false }` — never the actual answer
  - If correct, records the leaderboard entry server-side with validated timing
- Remove the `answer` column from client-side queries — only fetch `id, question, difficulty, puzzle_date`
- Restrict the `puzzles` table: create a `puzzles_public` view excluding `answer`, revoke direct SELECT on `puzzles` from anon/authenticated, grant SELECT on the view instead

### Step 2: Server-side score submission

- The same `validate-answer` Edge Function will handle leaderboard inserts using the service role key
- Store a `started_at` timestamp (either client-reported or via a separate `start-challenge` endpoint) and validate that `time_taken` is plausible (e.g., > 3 seconds)
- Add a CHECK constraint: `time_taken > 0`
- Drop the direct INSERT policy on `leaderboard` so clients can't write to it directly
- Add `UNIQUE(user_id, puzzle_id)` constraint if not already present

### Step 3: Restrict profile credits visibility

- Create a public view `profiles_public` exposing only `user_id, username, avatar_url, xp, current_streak` (for leaderboard display)
- Update the RLS on `profiles`: only the owning user can see `credits` and other sensitive fields
- Alternatively, use column-level security via the view for public queries, and direct table access for the authenticated owner

### Step 4: Enable leaked password protection

- Use the Cloud auth settings to enable the HIBP (Have I Been Pwned) password check

### Step 5: Update client code

- Update `DailyChallenge.tsx` to call the Edge Function instead of doing client-side answer comparison and direct DB inserts
- Update `Leaderboard.tsx` to query from `profiles_public` view
- Update puzzle fetching to exclude the `answer` column

## What to Build Next (After Security Fixes)

Here are strong next steps for the app:

- **Profile editing page** — let users change username, bio, and avatar
- **More daily puzzle content** — seed puzzles for the next 30+ days or build an admin panel
- **Sound effects & animations** — enhance game feel with audio feedback on correct/wrong answers
- **Friends & social features** — add the ability to challenge friends or share scores
- **Achievement badges** — unlock badges for milestones (first solve, 7-day streak, etc.)

## Technical Details

**Files to create:**
- `supabase/functions/validate-answer/index.ts` — Edge Function for answer validation + score recording

**Files to modify:**
- `src/pages/DailyChallenge.tsx` — replace client-side answer check with Edge Function call
- `src/pages/Leaderboard.tsx` — query from public view instead of profiles directly
- New SQL migration for: puzzles view, leaderboard constraints, profile view/RLS changes

**Database migration summary:**
```sql
-- Public view for puzzles (no answer column)
CREATE VIEW puzzles_public AS SELECT id, question, puzzle_date, difficulty FROM puzzles;
REVOKE SELECT ON puzzles FROM anon, authenticated;
GRANT SELECT ON puzzles_public TO anon, authenticated;

-- Leaderboard constraints
ALTER TABLE leaderboard ADD CONSTRAINT time_taken_positive CHECK (time_taken > 0);

-- Public view for profiles
CREATE VIEW profiles_public AS SELECT user_id, username, avatar_url, xp, current_streak FROM profiles;
GRANT SELECT ON profiles_public TO anon, authenticated;
```

