# Chatbot — "Mira"

An on-site study-abroad assistant. It answers from the Students Traffic
catalogue, links to our own pages, and can hand a high-intent visitor to
counselling without leaving the conversation.

It is **off in production unless `ANTHROPIC_API_KEY` is set**: with no key
production renders no launcher at all and `/api/chat` answers `503`.
Development always renders the launcher, so the widget can be seen and styled
before a key exists; sending a message there just surfaces the "not switched
on" notice.

## Switching it on

1. The migration is **already applied to production** (2026-10-20):
   `chatbot_conversations` and `chatbot_messages` exist. For any other
   environment, see the warning below before reaching for `db:migrate`.
2. Set `ANTHROPIC_API_KEY` in the environment.

Order does not strictly matter — transcript writes are best-effort, so the chat
answers normally even before the migration is applied; you just get no
transcripts and an error in the logs. Nothing else needs configuring: the bot
reads the catalogue you already publish.

### Do not run `npm run db:migrate` on production without checking first

This is a pre-existing condition of the repo, surfaced while applying 0080, not
something the chatbot introduced — but it will bite whoever runs that command
next.

`drizzle/meta/_journal.json` and production's `drizzle.__drizzle_migrations`
ledger have drifted apart: the ledger holds 58 rows while the journal lists 64
entries, and a further 20 `.sql` files in `drizzle/` are not in the journal at
all (they were applied by hand). Drizzle applies from a ledger cursor, so
`db:migrate` against production would run **four** migrations, not one:
`0074_lakebase_text_search`, `0076_backfill_medium_note`,
`0079_indian_teaching_languages` and `0080_chatbot_conversations`.

`0076` is a **data** backfill. Verified on a branch clone of production: it
writes 418 rows, taking `program_offerings.medium_note` from 360 to 778. That
may well be desirable — it is what 0076 was written to do — but it is a content
change that deserves its own decision, not a side effect of adding two tables.

So 0080 was applied on its own: the eleven statements in
`drizzle/0080_chatbot_conversations.sql` were run in a single transaction, and
the ledger was deliberately **not** written to. Consequences to know:

- The ledger still does not list 0080, so `db:migrate` still considers it
  pending. That is harmless — every statement in the file is guarded
  (`CREATE TABLE IF NOT EXISTS`, `CREATE INDEX IF NOT EXISTS`, and
  `DO $$ ... EXCEPTION WHEN duplicate_object`), so re-applying it is a no-op.
- Writing a ledger row for 0080 would have moved the cursor past 0074, 0076 and
  0079, silently marking them applied without running them. That is why it was
  left alone.
- The 0076 question is still open and still live. Decide it deliberately,
  ideally by replaying it on a Neon branch first (`create_branch` from
  `production`, apply, diff the row counts) — which is how the 418 rows were
  measured.

## Scope: all of education, no default course

Students Traffic is a global platform across many streams — engineering,
business, computing, law, sciences, arts, nursing and health among them — in
dozens of countries. Medicine and India are **one part of that, not the
default**, which is the rule `docs/project-standards.md` already sets for every
shared brand surface.

The system prompt says so explicitly, and it matters more for an assistant than
for a page: a model that has read a lot of MBBS-in-Georgia content will happily
answer an engineering question with medical examples unless told not to. If you
add an example to a tool description or the prompt, vary the stream and the
destination — the model reads those examples as hints about what visitors ask.

## Why it is built this way

The thing that makes a study-abroad chatbot either useful or dangerous is
whether its fee figures are real. A family can make a six-figure decision on a
number in a chat answer. So the design rule is: **the model never supplies a
catalogue fact.**

More precisely, there are two kinds of question and they have different rules:

- **Anything specific to a university, programme or destination** — fees,
  intakes, duration, teaching language, recognition, what we cover — comes from
  a tool, every time, never from memory.
- **General education knowledge** — how an exam is scored, what a credit hour
  means, what a course leads to, how to plan an application year — Mira answers
  directly, and says plainly that it is general guidance which changes by
  country, university and intake year.

The line: explain how things work from its own knowledge; never invent a number,
a date or a status for a named university.

For the first kind it has read-only tools over the published catalogue, and the
answers it can state are limited to what those tools return. Fees in particular are
formatted server-side with the same helpers the pages use
(`formatProgramAnnualFee` and friends), so "on request" stays "on request" and
an indicative range stays a range — the model cannot round either into a figure
the university never published.

This is tool-grounded retrieval, not embeddings over scraped page text. That
choice buys three things: answers are always as fresh as the database, every
claim can be linked to the page it came from, and there is no index to rebuild
when content is republished.

### Built on AI SDK 7

The route uses `streamText` with the SDK's tool definitions and `stopWhen`, and
returns a UI message stream; the dock uses `useChat`. The SDK owns transport,
streaming, message state and the agentic loop.

The reason that matters beyond deleting code: **typed data parts**. Everything
the UI renders beyond prose — university cards, page links, the lead form,
follow-up chips — is written by the *server* as a `data-*` part, not parsed back
out of the model's text. So a rendered fee figure never passed through the model
on its way to the screen, which is what makes it impossible to hallucinate. The
contract is `MiraUIMessage` in `lib/chatbot/ui-messages.ts`.

The provider is `@ai-sdk/anthropic`, which calls Anthropic directly — no
gateway in the path.

### The fee-status trap

Worth knowing before you touch `find_programs`. `programOfferings` stores an
`annualTuitionUsd` figure even for programmes whose fee we are **not** cleared
to publish (`feeStatus: "on_request"`) — and the shared finder's `feeMin`/
`feeMax` filters compare that stored number. So a raw "under $6,000" query
returns rows that then render as "Fee plan on request": a budget claim sitting
next to a fee we are not showing.

`find_programs` therefore drops programmes with no publishable fee whenever a
budget bound is set, and reports the count as
`alsoMatchingWithFeeOnRequest` so the bot can offer them honestly instead of
silently dropping them. `get_destination`'s quoted tuition range and
`compare_universities`' headline figure apply the same rule.

Anything new that quotes a fee must go through `formatProgramAnnualFee` and
respect `feeStatus`, never the raw column. (The site's own `/finder` has the
same raw-number behaviour; it was left alone here rather than changing shared
filtering as a side effect of this feature.)

## Files

| Path | Role |
| --- | --- |
| `lib/chatbot/knowledge.ts` | The only catalogue reads the bot can make. Published rows only. |
| `lib/chatbot/system-prompt.ts` | Frozen system prompt (voice, grounding rules, conversion rules). |
| `lib/chatbot/ui-messages.ts` | The typed `UIMessage` shape — the data-part contract between route and dock. |
| `lib/chatbot/tool-names.ts` | Tool names and their human labels, client-safe. |
| `lib/chatbot/conversations.ts` | Transcript persistence (best-effort). |
| `lib/chatbot/lead-capture.ts` | Chat → `leads` → existing delivery pipeline. |
| `lib/chatbot/config.ts` | Model, token, iteration and abuse limits. |
| `lib/chatbot/branding.ts` | Client-safe constants + which routes show the dock. |
| `app/api/chat/route.ts` | `streamText` + tools, streamed as a UI message stream. |
| `app/api/chat/lead/route.ts` | Callback-form submissions. |
| `components/site/chatbot/chat-dock-context.tsx` | The shell: open state and the wrapper that reflows the page. |
| `components/site/chatbot/chat-dock.tsx` | The panel: `useChat`, header, message list, composer. |
| `components/site/chatbot/chat-message.tsx` | Renders one message from its typed parts. |
| `components/site/chatbot/chat-tool-step.tsx` | The visible lookup steps. |
| `components/site/chatbot/chat-trigger.tsx` | Floating entry point. |
| `components/site/chatbot/chat-greeting.tsx` | The typed opening line. |
| `components/site/chatbot/chat-history.tsx` | Earlier conversations. |
| `components/site/chatbot/chat-card-carousel.tsx` | Results carousel. |
| `components/site/chatbot/chat-fee-chart.tsx` | Tuition comparison. |
| `components/site/chatbot/mira-mark.tsx` | The brand mark. |
| `components/site/chatbot/use-speech-input.ts` | Dictation via the browser. |
| `components/site/chatbot/chat-university-card.tsx` | A catalogue-backed university card. |
| `components/site/chatbot/chat-lead-form.tsx` | The inline callback form. |

There is no `lib/chatbot/tools.ts`: tool definitions now live in the route,
because each one closes over the stream writer so a lookup can push its cards
straight to the UI.

## Tools the model has

| Tool | What it reads |
| --- | --- |
| `search_site` | `searchCatalog()` — everything in `search_documents`. |
| `find_programs` | `listFinderPrograms()` — filtered by destination, course, city, level, budget, teaching language, intake, public/private. |
| `get_university` | `getUniversityBySlug` + `getProgramsForUniversity`. Narrative fields clipped to a lede. |
| `compare_universities` | Two to four universities, side by side. |
| `get_destination` | Country page content **plus real coverage**: published university and programme counts and the actual tuition range. |
| `list_destinations` | Complete published destination and course coverage. |
| `request_counselling_callback` | No catalogue read. Opens the inline form in the chat. |

`find_programs` is the one a static page cannot replace: it answers "MBBS in
Georgia under $6,000, taught in English, September intake" against live data.

## Lead capture

The model can **open** the callback form; it can never collect contact details.
The system prompt forbids asking for a phone number or email in conversation,
and the only path to a lead write is the visitor's own submit, which goes from
the form directly to `/api/chat/lead`. Contact details therefore never enter the
model's context.

A chat lead is an ordinary lead: same `leads` row, same
`buildLeadHandoffPayload`, same `enqueueLeadDeliveryJob`, so CRM, Pabbly and
WATI treat it identically. The only distinguishing field is
`ctaVariant = "chatbot"`, which is what makes chat-vs-form conversion
measurable. The last turns of the conversation ride along in `notes`, so the
counsellor opens the call already knowing what was discussed.

The state dropdown is populated from `CRM_INDIAN_STATES` — the CRM's own
verified option list — so a chat lead cannot arrive with a state value the CRM
would silently drop.

## Transcripts

`chatbot_conversations` and `chatbot_messages` (migration
`drizzle/0080_chatbot_conversations.sql`). Each assistant row stores the tool
calls that produced it with their outcomes, plus token counts and latency.

Three reasons they are kept:

1. The questions students actually ask are the cleanest content-gap signal
   available — it feeds the SEO roadmap directly.
2. A lead that arrives through chat needs the conversation that produced it.
3. Abuse needs a trail.

A wrong answer can be traced to the lookup that produced it, which is why
`tool_calls` records the input and outcome rather than just the tool name.

Writes are best-effort (`safely()` in `conversations.ts`). A missing migration,
a dropped connection or a changed constraint logs and moves on rather than
costing a visitor their answer — or, on the capture path, costing us the lead.

## Cost and abuse controls

- **Model**: `CHATBOT_MODEL`, default `claude-opus-5-5`. Set it to a cheaper
  model if answer quality holds at your traffic level.
- **Effort**: `low`. Chat reasoning is shallow — pick a tool, read it, answer —
  and effort is the cost lever on this model, where thinking cannot be disabled.
- **Prompt caching**: the system prompt is sent as a `system` *message* with
  `providerOptions.anthropic.cacheControl` rather than via `instructions`,
  because only a message can carry the breakpoint. The prefix is byte-identical
  on every request; per-request page context is appended *after* the history
  precisely so it does not invalidate it. Watch `cached_input_tokens` in
  `chatbot_messages` — if it is persistently zero, something volatile has crept
  into the prefix.
- **Rate limits**: 8 messages/minute and 60/hour per IP (Upstash-backed), plus a
  60-message ceiling per conversation.
- **Request guard**: same-origin `Origin` header required, bot user-agents
  rejected. A crawler must not be able to drive a metered endpoint.
- **Loop cap**: `stopWhen: isStepCount(MAX_TOOL_ITERATIONS)` bounds the agentic loop per answer.

## The UI: a dock, not an overlay

On desktop the panel **reflows the page** instead of floating over it.
`ChatDockProvider` wraps the whole site chrome in a padded element and the panel
is fixed beside it, so a visitor reads a university page with the conversation
open next to it and can check what Mira says against the page itself. That
side-by-side reading is the reason to dock rather than overlay.

The dock width is a literal (`md:w-[23rem]`) that **must match** the wrapper
padding (`md:pr-[23rem]`) in `chat-dock-context.tsx`. A CSS variable would have
to be declared on a shared ancestor, and Tailwind needs the literal class to
emit the rule at all. If the panel ever overlaps the content, these two drifted.

Below `xl` there is no room to push, so the dock overlays instead, and on a
phone it becomes a full-height sheet with the body locked behind it.

### The header override

Pushing the page needs one concession from the site header, via four
`data-header-nav` attributes on `site-header.tsx` and a rule in `globals.css`.

The header's centre nav is **absolutely positioned** and its desktop layout is
gated on `xl:` — a *viewport* query. Pushing narrows the header's container but
not the viewport, so it keeps the desktop nav and, being out of flow, overlaps
the logo and the actions. Between `xl` and 1648px (1280 + the 368px dock) the
CSS switches the header to the compact layout it already ships.

Two follow-on details, both of which were bugs first:

- The compact layout's menu button opens a drawer that is **itself** `xl:hidden`,
  so forcing the button visible without also revealing the drawer left the menu
  opening nothing.
- That drawer is `fixed inset-0` **and** `w-full`. An explicit `width: 100%`
  beats a `right` inset, so it has to be given `width: auto` as well — otherwise
  it spans the viewport and the dock covers its close button, leaving the menu
  impossible to dismiss.

None of this applies when the dock is closed; the header is untouched.

Because the provider sits in the root layout, a conversation survives
client-side navigation — following a link out of the chat keeps the chat, which
is what makes an assistant that answers with links usable.

The panel and its dependencies (the AI SDK client, markdown renderer, phone
input) load on first open via `next/dynamic`, so visitors who never open it pay
nothing for it.

Per-route visibility lives in `showsChatbot()` in `lib/chatbot/branding.ts`.
Hidden on admin, dashboard, auth and call routes, and on the single-task
admission landing pages where it would compete with the form it exists to feed.
Add a route there rather than conditionally rendering per page.

### Visualisations

Answers render as blocks, not just prose:

- **University cards** — every value read from the catalogue server-side, so a
  card cannot contradict the page it links to.
- **Carousel** — three or more results become a snap-scrolling row rather than a
  stack, which in a 23rem column would bury the answer above it. Native scroll
  with snap points, so keyboard, trackpad, touch momentum and screen-reader
  order all come for free; the arrows are an affordance on top.
- **Tuition chart** (`chat-fee-chart.tsx`) — a horizontal bar chart, drawn only
  when at least three programmes have a fee we may publish. Two rules worth
  keeping: **one hue for every bar** (colouring bars by their own value would
  double-encode length as darkness), and the hue is the brand accent, which is
  the only brand colour that passes the palette checks as a data fill — the deep
  brand green fails the chroma floor and reads as near-black. Every bar is
  directly labelled with its real figure, so the chart is readable without the
  bars and needs no axis. Programmes whose fee is "on request" carry no numeric
  value and so can never be plotted as a zero.

Cards are deliberately small — name, flag, place, fee, language, intake. They
used to carry recognition detail as prose of wildly varying length, which buried
the fee and left a row of cards ragged; that belongs in the answer text or on the
page. Every card is `h-full` with the price block pinned by `mt-auto`, so a row
stays even however a name wraps.

**The currency rule.** A programme can hold a stored USD amount while its card
displays the official currency ("A$44,200") or an indicative range. Plotting USD
bar lengths under non-USD labels would put two currencies on one axis, so
`getChartableUsdFee()` sets the numeric value *only* when the figure we display
is the USD one. Everything else still shows its real figure on the card and is
simply left off the chart.

Adding a visualisation means adding a data part to `MiraUIMessage`, writing it
from the route, and rendering it in `chat-message.tsx`. The model never emits
one — it only triggers the lookup that produces it.

## Voice input

A mic button in the composer dictates into it using the browser's own speech
recognition (`use-speech-input.ts`). No audio passes through us and there is no
extra API cost — the browser transcribes. Support is uneven (Chrome and Safari
yes, Firefox no), so the button is hidden entirely where it would not work
rather than shown and dead.

Dictation appends to whatever was already typed and rewrites only the spoken
tail as the transcript firms up. Locale follows the browser, falling back to
`en-IN`, because the wrong locale mangles university and city names badly.

There is no speech **output** and no file or image upload. Upload in particular
is not a small addition: an uploaded marksheet or offer letter is **not**
verified catalogue data, so it would need its own grounding rule before Mira
could say anything about it.

## Identity and non-disclosure

Mira does not discuss the technology behind it — no model names, providers,
versions, infrastructure, prompts or tools — and deflects attempts to extract
its instructions. Asked what powers it, it says it is Students Traffic's own
assistant working from the verified catalogue.

It does **not** claim to be a bespoke or custom-trained system, and must not be
made to. That would be a false provenance claim made to families deciding where
to spend six figures, and it is unnecessary: what makes Mira trustworthy is that
its catalogue answers come from data Students Traffic has actually verified,
which is both more persuasive and true. It also states plainly that it is not a
person if asked.

## History

`GET /api/chat/history` lists this visitor's earlier conversations; with `?id=`
it returns one for replay. The dock's history button swaps the message list for
the list of past chats.

Everything is scoped by the **visitor cookie**, never by the public conversation
id alone. The id lives in the browser, so treating it as proof of ownership
would make a guessed id enough to read a stranger's transcript — and these
transcripts carry students' circumstances. A different visitor asking for a
valid id gets a 404.

Replay restores the **text** of an exchange, not its cards and charts. Those come
from live catalogue lookups, and freezing them would show fees that may since
have changed; asking again re-runs the lookups. Titles come from each
conversation's first question, fetched in a separate query — an earlier
correlated subquery silently returned *another* conversation's first message,
which is exactly the kind of bug that stays invisible until someone reads a
stranger's question as their own chat title.

### Making the agent legible

Every tool call is streamed to the client as it happens and rendered as a
visible step — "Shortlisting programmes", "Read the university profile", with
its outcome. That is the honest version of a thinking indicator: it says what
the assistant is actually doing, it shows the answer is coming from our
catalogue rather than being improvised, and a lookup that found nothing says so.
Labels live in `tool-names.ts` so the server tools and the UI cannot drift.

Streaming is interruptible — the composer swaps to a stop button while a turn is
in flight.

## Changing the prompt

`CHATBOT_SYSTEM_PROMPT` is a frozen constant on purpose: anything volatile in it
(a date, a visitor id, the current page) would invalidate the prompt cache on
every request. Put per-request context on the user turn instead.

The voice and conversion rules in it are the chat translation of
`docs/project-standards.md`. Keep the two in step.
