# Provenance

Vendored from [kuhnhomeuk-cell/procedural-film](https://github.com/kuhnhomeuk-cell/procedural-film/tree/main/skills/procedural-film)
at commit `ec29e23474860e83ab5b4d0131bd6e6b92e12a48`.

Author: Dean Kuhn. Licensed MIT — the upstream licence is kept here as
`LICENSE.upstream`.

This copy intentionally carries the narrowed frontmatter description documented
below. Everything else is upstream as vendored.

## Narrowed description

Upstream offers "a short hand-drawn animated film about a subject" as a trigger
phrase, which is a plain description of `hand-drawn-canvas-animation`, vendored
in the same repository — and that skill in turn claimed "a procedural or
generative short film". Each skill advertised the other's job, so a request
phrased either way could land on either one, and they differ by roughly an
order of magnitude in cost.

The local frontmatter therefore drops that phrase, names what actually
distinguishes this pipeline (vertical 1080x1920, roughly 30 seconds, one agent
per shot, a six-check gate, paper against blueprint), and ends with a pointer to
`hand-drawn-canvas-animation` for short single-file films and for the riso,
screen-print, graphite and doodle looks. That skill carries the mirror-image
edit. Nothing outside the `description:` line changed, and the pipeline itself
is untouched.

## What was left out

Upstream ships a worked example at `examples/butterfly-life/` (16 MB, mostly a
13 MB MP4). It is **not** vendored here. `SKILL.md` already handles its
absence: it falls back to reading the example on GitHub at
<https://github.com/kuhnhomeuk-cell/procedural-film/tree/main/examples/butterfly-life>.

The three reference frames `SKILL.md` tells the agent to look at first
(`reference/example-contact-sheet.jpg`, `example-paper-frame.jpg`,
`example-blueprint-frame.jpg`) are part of the skill folder and are included,
so the visual target survives.

## Updating from upstream

Stage an upstream refresh separately and compare it with this copy before
replacing files. Record the new upstream commit, then reapply the narrowed
`description:` line — a plain re-copy reintroduces the "short hand-drawn
animated film" trigger phrase and with it the collision. Do not edit anything
else in place.

## Runtime requirements

- Node.js 20 or newer
- `ffmpeg` on PATH
- Chromium for Playwright (`npx playwright install chromium` in the film's `tools/`)
- An agent that dispatches parallel subagents — the pipeline runs one agent per
  shot plus critic waves, and upstream warns a single film "spends a large
  share of a usage plan"
