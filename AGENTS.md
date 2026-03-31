<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# Chinese Vocabulary Training App — Cursor Rules

## Project Identity

A focused, minimalist vocabulary quiz app for learning Chinese (Hanzi) ↔ Bahasa Indonesia.
Stack: **Next.js 14+ (App Router) · TypeScript · Tailwind CSS · shadcn/ui**

---

## Tech Stack Rules

### Framework
- Use **Next.js App Router** (`app/` directory) exclusively. No Pages Router.
- Default to **Server Components**. Only add `"use client"` when the component needs interactivity (quiz state, answer input, button clicks).
- No unnecessary API routes. Read CSV at build time or on the server. Do not expose a REST endpoint just to load vocabulary.

### TypeScript
- **No `any`**. Define explicit types for all data structures.
- Place shared types in `types/` folder.
- Prefer `interface` for object shapes, `type` for unions and aliases.
- All function parameters and return types must be typed.

```ts
// types/vocabulary.ts
export interface VocabItem {
  id: number
  hanzi: string
  pinyin: string
  partOfSpeech: string
  indonesian: string
}

export type TrainingMode = "hanzi-to-id" | "id-to-hanzi"

export interface QuizQuestion {
  item: VocabItem
  choices: VocabItem[]   // always 4 items including correct answer
  correctIndex: number
}

export interface QuizConfig {
  mode: TrainingMode
  totalQuestions: number // user-defined, e.g. 5 / 10 / 15 / 20
}

export interface QuizResult {
  question: QuizQuestion
  selectedIndex: number | null
  isCorrect: boolean
}
```

### Tailwind CSS
- Use Tailwind utility classes only. No custom CSS files unless absolutely necessary.
- Use `cn()` helper from `lib/utils.ts` for conditional class merging.
- Stick to the design token system. Do not hardcode raw hex colors in JSX.
- All spacing must use Tailwind's scale (e.g. `p-4`, `gap-6`, not `p-[17px]`).
- Breakpoints: always design mobile-first. Use `sm:` / `md:` / `lg:` for larger screens.

### shadcn/ui
- Use shadcn/ui components as the base. Do not reinvent: Button, Card, Badge, Progress, RadioGroup, Dialog, etc.
- Customize via `className` prop and Tailwind utilities, not by editing component source.
- Keep shadcn/ui theme tokens consistent with the minimalist design system defined below.

---

## Folder Structure

```
app/
  page.tsx               ← Landing page (Server Component)
  training/
    page.tsx             ← Training setup: mode + question count (Client Component)
    quiz/
      page.tsx           ← Quiz page (Client Component)
  layout.tsx
  globals.css

components/
  landing/
    HeroSection.tsx
    ModeCard.tsx
  quiz/
    QuestionCard.tsx     ← Main card showing prompt
    ChoiceCard.tsx       ← Individual answer option card
    FeedbackBlock.tsx    ← Shows result after answering
    ScoreHeader.tsx      ← Correct / Total counter
    ProgressBar.tsx
  ui/                    ← shadcn/ui components (auto-generated, do not touch)

lib/
  csv.ts                 ← Parse CSV, return VocabItem[]
  quiz.ts                ← Build questions, shuffle choices, validate
  utils.ts               ← cn(), and other shared helpers

types/
  vocabulary.ts

assets/data/
  datamandarin.csv         ← Single source of truth for all quiz content
```

**Rules:**
- One component per file. File name = component name (PascalCase).
- No barrel files (`index.ts`) unless the folder has 3+ exports.
- Do not put business logic inside JSX. Extract to `lib/`.

---

## Data Layer Rules

### CSV Parsing (`lib/csv.ts`)
- Parse CSV on the **server** using Node's `fs` + a lightweight parser (e.g. `papaparse` or manual split). Do not parse CSV in the browser.
- Return typed `VocabItem[]`. Strip the `Unnamed: 0` column after using it as `id`.
- Cache the result — parse once, reuse everywhere.

```ts
// CSV column mapping
"Unnamed: 0"              → id (number)
"詞彙 / Vocabulary"       → hanzi (string)
"漢語拼音 / Pinyin"        → pinyin (string)
"詞類 / Parts of Speech"  → partOfSpeech (string)
"印尼語 Indonesian"        → indonesian (string)
```

### Quiz Logic (`lib/quiz.ts`)
- `buildQuestions(items, config)` — returns `QuizQuestion[]` shuffled from the full dataset, length = `config.totalQuestions`.
- Each question has exactly **4 choices**: 1 correct + 3 random distractors.
- Distractors must be **different from the correct answer** and from each other.
- Shuffle choice order so the correct answer is not always in the same position.
- Deterministic shuffle per session using Fisher-Yates.

```ts
export function buildQuestions(items: VocabItem[], config: QuizConfig): QuizQuestion[]
export function checkAnswer(selected: VocabItem, correct: VocabItem, mode: TrainingMode): boolean
```

### Answer Validation
- Mode A (Hanzi → Indonesian): compare `selected.id === correct.id`. The user picks a card, not types — so exact match by id.
- Mode B (Indonesian → Hanzi): same, card selection.
- Since answers are **card-based (multiple choice)**, there is no text input to normalize. Keep validation simple: `selectedIndex === correctIndex`.

---

## Quiz Flow

```
Landing Page
  └─ "Mulai Latihan" CTA
       └─ Training Setup Page
            ├─ Pick Mode (Mode A or Mode B)
            ├─ Pick Question Count (5 / 10 / 15 / 20)
            └─ "Mulai" button
                 └─ Quiz Page
                      ├─ ScoreHeader (Benar: X / Total: Y)
                      ├─ ProgressBar (question N of total)
                      ├─ QuestionCard (prompt)
                      ├─ 4× ChoiceCard (answer options)
                      ├─ FeedbackBlock (shown after selecting)
                      └─ "Soal Berikutnya" button
                           └─ ... repeat until done
                                └─ Result Summary Page
                                     ├─ Final score
                                     ├─ Breakdown (correct/incorrect per question)
                                     └─ "Ulangi" / "Kembali ke Menu" buttons
```

---

## UI & Design System Rules

### Theme: Refined Minimalism
- Background: near-white `zinc-50` or pure `white`.
- Text: `zinc-900` (primary), `zinc-500` (secondary/muted).
- Accent: single accent color — use `zinc-900` for filled buttons (high contrast, no color noise).
- No gradients, no shadows heavier than `shadow-sm`, no decorative illustrations.
- Border radius: `rounded-xl` for cards, `rounded-lg` for buttons.

### Typography
- Use a single clean font loaded via `next/font`. Suggestion: `Noto Sans` (covers CJK + Latin + Indonesian cleanly).
- Hanzi characters: always render at larger size (`text-3xl` or `text-4xl`) for readability.
- Pinyin: `text-sm text-zinc-500 tracking-wide`.
- Indonesian text: `text-base` or `text-lg`.

### Cards
- `QuestionCard`: large, centered, prominent. White background, `border border-zinc-200`, generous padding (`p-8`).
- `ChoiceCard`: grid of 2×2 on desktop, 1 column on mobile. Each card is a clickable `button` wrapped in a `Card`. States:
  - **Default**: white bg, `border-zinc-200`, hover `border-zinc-400`.
  - **Selected (pending)**: `border-zinc-900 bg-zinc-50`.
  - **Correct**: `border-green-600 bg-green-50 text-green-900`.
  - **Incorrect**: `border-red-500 bg-red-50 text-red-900`.
  - **Revealed correct** (when user got it wrong): `border-green-600 bg-green-50`.
- After an answer is selected, **disable all cards** until "Soal Berikutnya" is clicked.

### Scoring Header
- Always visible at the top of the quiz page.
- Show: `Benar: X` and progress `Soal N dari Y`.
- Use `Badge` from shadcn/ui for the score pill.

### Progress Bar
- Use shadcn/ui `Progress` component.
- Value = `(currentIndex / totalQuestions) * 100`.

### Feedback Block
Shown below the choice cards after answering. Contains:
- ✓ or ✗ icon + "Benar!" / "Kurang tepat"
- Hanzi, Pinyin, Part of Speech, Indonesian meaning
- Keep it compact — a single `Card` with a muted background.

### Buttons
- Primary action: filled, `bg-zinc-900 text-white hover:bg-zinc-700`.
- Secondary: outlined, `border border-zinc-300 text-zinc-700 hover:bg-zinc-100`.
- No color-coded buttons (no green/blue/purple CTAs).

---

## State Management Rules

- Use **React `useState` + `useReducer`** only. No Zustand, no Redux, no Context unless data needs to cross 3+ component layers.
- Quiz state lives in the Quiz page component. Pass down only what each child needs.
- Do not store quiz state in `localStorage` for MVP. Add persistence only after core flow works.

```ts
// Suggested quiz state shape
interface QuizState {
  questions: QuizQuestion[]
  currentIndex: number
  results: QuizResult[]
  status: "idle" | "answering" | "feedback" | "done"
  selectedIndex: number | null
}
```

---

## Performance Rules

- Load vocabulary CSV once at the server level using `async` server component or `generateStaticParams`.
- Keep the client bundle small. Do not import heavy libraries on the client.
- Images: none needed for MVP. If added later, use `next/image`.
- Fonts: load via `next/font/google`, subset to Latin + Chinese (`subset: ['latin', 'chinese-simplified']`).

---

## Accessibility Rules

- All interactive elements must be `<button>` or have `role="button"` with `tabIndex`.
- Color is never the only indicator of state — always pair color with an icon or label.
- Minimum touch target: `min-h-[48px] min-w-[48px]` for choice cards on mobile.
- `aria-label` on icon-only buttons.
- Correct/incorrect states must be announced — use `aria-live="polite"` on the feedback block.

---

## Code Quality Rules

- No `console.log` in production code.
- No commented-out code blocks.
- Extract any logic longer than 5 lines out of JSX into a named function or `lib/` helper.
- Keep component files under **150 lines**. If longer, split into subcomponents.
- Name booleans with `is` / `has` prefix: `isCorrect`, `hasAnswered`, `isLoading`.
- Event handlers named `handle*`: `handleSelectChoice`, `handleNextQuestion`.

---

## What NOT to Build (MVP Scope)

Do not implement these until the core quiz flow is fully working:

- ❌ Keyboard shortcut to submit (add after MVP)
- ❌ Timer per question
- ❌ Streak counter / gamification badges
- ❌ Sound effects
- ❌ Animation between questions (simple show/hide is fine)
- ❌ User accounts or backend
- ❌ Multiple CSV sources or dynamic dataset upload
- ❌ Dark mode (add later via Tailwind `dark:` classes)

---

## Definition of Done

A feature is complete when:

1. It works correctly on mobile (375px) and desktop (1280px).
2. TypeScript compiles with zero errors (`tsc --noEmit`).
3. No `any` types in non-generated code.
4. Correct/incorrect feedback is clearly visible.
5. Score updates correctly after each question.
6. The result summary shows final score and a way to restart.
7. Code is readable — another developer can understand each file in under 2 minutes.

---

## Summary of Key Decisions

| Decision | Choice | Reason |
|---|---|---|
| Answer format | Multiple choice cards (4 options) | No text normalization needed, better UX |
| Quiz config | Mode + question count picker on setup page | Simple, explicit, no hidden state |
| Data loading | Server-side CSV parse | No client bundle cost, simpler security |
| State | Local useState/useReducer | No over-engineering for MVP |
| Styling | Minimalist zinc palette, single font | Clean, readable, fast to implement |
| Routing | App Router pages | Modern Next.js, no layout complexity |

<!-- END:nextjs-agent-rules -->
