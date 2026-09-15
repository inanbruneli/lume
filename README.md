# Lume

**habits, on track** — a personal habit tracker that measures *how long*, not just *whether*.

<!-- Drop a screenshot of the grid here: ![Lume](docs/screenshot.png) -->

## Why

Most habit trackers ask one question: **did you do it?** You tick a box, the streak survives,
and the day is filed away as a success.

But the habits that actually compound are the ones you give *time* to. Ten minutes of guitar and
two hours of guitar are not the same day. A checkbox flattens them into the same mark, and after a
few months your history tells you that you showed up — without telling you whether you showed up
with anything.

Lume records the duration. Every habit gets its own scale, a stopwatch logs real sessions, and a
year of days is laid out as a heatmap where color means intensity. The result is a history you can
read at a glance: not just the days you turned up, but the ones you went deep.

It is deliberately small and local. No account, no sync, no server but your own — a single JSON
file on your machine.

## How it works

### Levels are yours to define

A habit is not "done" or "not done" — it has **2 to 5 levels**, and you decide what each one costs
in minutes:

| Level | Minutes | Meaning |
|---|---|---|
| 1 | 0 | nothing today |
| 2 | 15 | showed up |
| 3 | 30 | a real session |
| 4 | 60 | a deep one |

**Level 1 always means "nothing"** and always renders as an empty cell, so an unfilled grid reads
honestly. Minutes must not decrease as levels go up.

Because you set the thresholds, a demanding habit and a gentle one can share the same grid without
lying about either. Thirty minutes of stretching might be your top level; thirty minutes of writing
might barely clear level 2.

### The grid shows the last 365 days

One column per week, one cell per day, colored by the level reached. Hover any day to see the date
and the minutes behind it. Click a day to set or clear its level by hand.

### Sessions add up

Start the stopwatch, stop it, hit **Finish** — the minutes are added to today's total and the level
is recomputed from the new sum. Run the timer twice in one day and you get one entry holding the
total, not two competing records. The accumulation happens on the server, inside a serialized
write, so two sessions finishing at once cannot overwrite each other.

## Getting started

**Requirements:** Node `^20.19` or `>=22.12` (Vite 8's floor), and npm.

```bash
git clone <your-repo-url> lume
cd lume
npm install
npm run dev
```

That starts both processes:

| Process | URL |
|---|---|
| Web app | http://localhost:5173 |
| API | http://localhost:3001 |

Open http://localhost:5173. Vite proxies `/api` to the API, so you only ever visit the first URL.

## Using it

**1. Create a habit.** Click **New habit**, name it, and set the minutes for each level. Start with
three: `0` for nothing, something easy for level 2, something ambitious for level 3. You can add up
to five and change them later.

**2. Time a session.** With a habit selected, press play in the header. Pause and resume as needed;
the clock counts from a timestamp, so pausing never drifts. Press **Finish** and the session is
written to today. Finish a second session later and it adds to the first.

**3. Log a day by hand.** For days you did not time — or days already past — use **Log day** to pick
a habit, a date and the level reached. You can also click any cell in the grid directly. Manual
logging records the level only; it clears any measured minutes for that day, because no time was
actually measured.

**4. Edit or delete.** The kebab menu (⋮) next to the habit selector holds **Edit habit** and
**Delete habit**. Editing the levels recalculates the days you have already recorded: days with a
measured duration get their level re-derived on the new scale, and days without one are clamped so
they stay in range. Deleting asks for confirmation and takes that habit's entries with it.

**5. Switch language.** The **PT / EN** toggle in the top right switches the whole interface between
Portuguese and English. Your choice is remembered in the browser; the first visit follows your
browser's language.

## Where your data lives

Everything is in one file:

```
apps/api/data/db.json
```

Two arrays — `habits` and `entries` — in plain JSON. Back it up by copying the file; move to another
machine by copying it across.

> **Before pushing to GitHub:** this file is *not* in `.gitignore`. If you have been using the app,
> your habit history will be committed along with the code. Add
> `apps/api/data/db.json` to `.gitignore` first if you would rather keep it private.

There is no authentication and no multi-user support — Lume assumes one person on one machine. The
API trusts every request it receives and, like any bare `listen(PORT)`, accepts connections on every
network interface, so keep it off untrusted networks or bind it explicitly.

## Project layout

```
apps/api/         Express API — routes, services, repositories, JSON store
apps/web/         React app — components, Redux store, i18n
packages/shared/  Types and helpers used by both sides
```

The API is layered **route → service → repository → store**. Nothing above the repository knows the
data is JSON, so swapping in SQLite or Postgres means writing one new `HabitRepository`
implementation and changing a single line of wiring.

## API

Base path `/api`. Errors come back as `{ error, code }`, where `code` is a stable identifier the
client translates into the selected language.

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/health` | liveness check |
| `GET` | `/habits` | list habits |
| `POST` | `/habits` | create a habit |
| `PUT` | `/habits/:id` | replace name and levels; returns the habit plus reconciled entries |
| `DELETE` | `/habits/:id` | delete a habit and its entries |
| `GET` | `/entries?habitId&from&to` | list entries |
| `PUT` | `/habits/:id/entries/:date` | **set** a day to an exact level |
| `POST` | `/habits/:id/entries/:date/sessions` | **add** timed minutes to a day |
| `DELETE` | `/habits/:id/entries/:date` | clear a day |

The distinction between the last three matters: `PUT` declares what a day *is*, `POST .../sessions`
adds to what is already there.

## Development

```bash
npm run dev              # both processes
npm run build            # typecheck every workspace, then build the web bundle
npm -w apps/api run dev  # API only
npm -w apps/web run dev  # web only
```

Conventions worth knowing before you send a patch:

- **No semicolons** at end of line.
- **No comments** — the code is meant to explain itself through naming.
- **Code and API messages are English.** Every string a user can see lives in
  `apps/web/src/i18n/translations.ts`, in both dictionaries. The Portuguese dictionary is typed
  against the English one, so a missing translation fails the typecheck rather than the interface.

## Tech

TypeScript throughout. Express 5 on the API, React 19 + Vite 8 on the front end, Redux Toolkit for
state, Tailwind CSS v4 with shadcn/ui over Radix for the interface, react-hook-form and yup for
forms. npm workspaces tie the three packages together.

## Limitations

- The running stopwatch is not persisted — reloading the page loses the clock, though finished
  sessions are already saved.
- Switching habits does not reset a running stopwatch, so **Finish** writes to whichever habit is
  selected at that moment.
- No streaks, averages, or aggregate statistics yet.
- No tests, linter, or CI.
