# Coordination notes for agents working in this repo

Two agents have worked here concurrently. This file records decisions that
**look wrong out of context** and would be natural to "fix" back into bugs.
Read this before changing caching or data-access code.

---

## 1. `getSuggestionIndex()` runs unfiltered full-table SELECTs on purpose

**File:** `app/api/suggestions/route.ts`

It issues four `SELECT`s with **no `WHERE` on the search term and no `LIMIT`**,
loading the whole catalogue, then filters in memory.

**Do not "optimise" this back into per-query filtered SQL.**

### Why it was changed

The previous version was `getSuggestionSource(query)` with `"use cache"`.
`use cache` derives its key from the function arguments, so the raw search
string became the cache key. Autocomplete fires per keystroke, so typing
"kazakhstan" minted nine cache entries (`ka`, `kaz`, `kaza`, …). Each entry also
embedded `getAllLandingPages()` — a 61 KB static array — so roughly 1.43M cache
writes carried ~60 KB of payload unrelated to the query.

Consequences measured on the Vercel bill for this project:

| Meter | Value (33-day window) |
| --- | --- |
| ISR writes | 1,434,332 |
| ISR read:write ratio | **0.86 : 1** (writes exceeded reads) |
| Fast Origin Transfer | 53.3 GB |
| Fluid Active CPU | 63.5 hours |

Cache writes were *rising* (21k/day → 67k/day) while function invocations were
*falling* (31k/day → 9.6k/day). Cost tracked unique strings typed, not visitors.

### Why the unfiltered reads are not a regression

Measured with `pg_stat_statements` on the production branch:

| Query | Mean | Rows |
| --- | --- | --- |
| OLD `ilike` universities | 2.05 ms | 18 |
| OLD `ilike` india_colleges | 3.88 ms | 2 |
| **NEW** universities (full) | **1.70 ms** | **724** |
| **NEW** india (full) | **1.70 ms** | **1,209** |

The full reads are **faster** than the filtered ones — no `ILIKE '%…%'` scan,
just a sequential read of a small table. The whole catalogue is ~1,933 rows.

Verified after deploy: **40 distinct suggestion queries produced 0 database
queries** (the old code would have run 160). Query volume dropped from
per-unique-search to roughly once per cache period per instance.

### The rule

`getSuggestionIndex()` must stay **argument-free**. If the catalogue outgrows a
single cache entry, the answer is a dedicated search index (Typesense is already
in this repo) — *not* a return to per-query cache keys.

---

## 2. Free-text search deliberately bypasses the cache

**Files:** `lib/search/search.ts`, `lib/data/catalog.ts`, `lib/data/india-mbbs.ts`

`searchCatalogResultSet`, `queryFinderCardProgramsPage` and
`queryIndiaMbbsCollegesPage` are thin wrappers that:

1. normalise facet values (case + whitespace) **before** the cache boundary, and
2. **skip the cache entirely when a free-text `q` is present**, calling the
   executor directly.

Free-text is unbounded user input. Normalising collapses `MBBS`/`mbbs` but
cannot bound the key space, so every novel phrase still mints a write-once,
never-read entry — the pattern that caused the bill above. Facet browsing
(country / city / state / course / level / sort / page) is a small, heavily
reused key space and **stays cached** — that is the path landing pages and
crawlers hit.

Search is backed by Typesense, which is built to answer these directly.

**Do not** move normalisation inside the cached function (too late — the raw
arguments have already formed the key), and **do not** re-add caching for `q`.

---

## 3. Static fallback documents use an in-process memo, not the remote cache

**File:** `lib/search/search.ts` → `getCachedSearchDocuments()`

Built entirely from module constants already in the bundle
(`landing-pages.ts` + `study-abroad-guides.ts`, ~570 KB of source). Caching that
remotely meant writing the payload and reading it back over the network to
reproduce data the process already held.

A module-level memo is correct here: Fluid reuses instances, so it is computed
at most once per warm instance, with nothing to invalidate (inputs only change
on deploy, which replaces the instance).

---

## 4. Working agreement

- **Do not `git add -A`.** Stage only files you changed. Both agents have had
  their work swept into the other's commit.
- **Do not `git reset --hard`.** Two soft resets already removed the wrong
  commit; a hard reset would have destroyed uncommitted work.
- Before `reset --soft HEAD~1`, run `git log -3` and confirm the top commit is
  actually yours.
- Pull before pushing. Local `main` drifted **9 commits** behind `origin/main`
  at one point today.

---

## 5. Known-good verification recipe

To confirm the suggestion cache is still behaving:

1. Record `SUM(calls)` from `pg_stat_statements` for queries matching
   `'%~~*%' OR ILIKE '%ilike%'`.
2. Fire ~40 **distinct** queries at `/api/suggestions?q=…` (confirm each returns
   `x-vercel-cache: MISS` so they reach the function).
3. Re-read the same sum.

**Expected delta: 0.** A delta near 40 means the per-query cache key is back.
