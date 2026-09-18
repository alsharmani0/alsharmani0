# Provenance

Vendored from [kuhnhomeuk-cell/procedural-film](https://github.com/kuhnhomeuk-cell/procedural-film/tree/main/skills/procedural-film)
at commit `ec29e23474860e83ab5b4d0131bd6e6b92e12a48`.

Author: Dean Kuhn. Licensed MIT — the upstream licence is kept here as
`LICENSE.upstream`.

## What was left out

Upstream ships a worked example at `examples/butterfly-life/` (16 MB, mostly a
13 MB MP4). It is **not** vendored here. `SKILL.md` already handles its
absence: it falls back to reading the example on GitHub at
<https://github.com/kuhnhomeuk-cell/procedural-film/tree/main/examples/butterfly-life>.

The three reference frames `SKILL.md` tells the agent to look at first
(`reference/example-contact-sheet.jpg`, `example-paper-frame.jpg`,
`example-blueprint-frame.jpg`) are part of the skill folder and are included,
so the visual target survives.

To update, re-copy the upstream `skills/procedural-film` folder and bump the
commit above. Do not edit files in place.

## Runtime requirements

- Node.js 20 or newer
- `ffmpeg` on PATH
- Chromium for Playwright (`npx playwright install chromium` in the film's `tools/`)
- An agent that dispatches parallel subagents — the pipeline runs one agent per
  shot plus critic waves, and upstream warns a single film "spends a large
  share of a usage plan"
