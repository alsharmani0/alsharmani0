# Provenance

This skill is vendored, unmodified, from
[alesha-pro/tools](https://github.com/alesha-pro/tools/tree/main/skills/hand-drawn-canvas-animation)
at commit `cf1191e838fa89a1b4b869e1ba2dcff72097447d`.

Author: Alexey Fateev. Licensed MIT — the upstream licence is kept here as
`LICENSE.upstream`.

To update, re-copy the upstream folder and bump the commit above. Do not edit
files in place; local changes will be lost on the next sync.

## Runtime requirements

Rendering is not self-contained — the skill shells out to tooling that must
already be installed:

- Node 18+ (`npm i` in each film folder pulls `puppeteer-core`)
- Google Chrome or Chromium on PATH, or `CHROME=/path/to/chrome`
- `ffmpeg` on PATH
- optional, doodle look only: `rembg` (`pip install "rembg[cpu,cli]"`)
