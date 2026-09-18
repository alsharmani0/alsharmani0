# Provenance

This skill is vendored from
[alesha-pro/tools](https://github.com/alesha-pro/tools/tree/main/skills/hand-drawn-canvas-animation)
at commit `cf1191e838fa89a1b4b869e1ba2dcff72097447d`.

Author: Alexey Fateev. Licensed MIT — the upstream licence is kept here as
`LICENSE.upstream`.

This copy intentionally carries the local renderer correction documented
below, a link to these notes in `SKILL.md`, and explicit sound/no-sound
deliverable names in the brief template. It is therefore not byte-for-byte
upstream.

## Local renderer correction

`scripts/render.mjs` protects a full render from numbered PNGs left by an
older, longer version of the same film:

- before a full render only (neither `--only` nor `--grid`), it removes only
  regular files or symlinks with renderer-named numbered PNG basenames from
  `<film>-frames`; it does not clear the directory recursively or remove
  unrelated files;
- ffmpeg is limited to `2 * window.__NDRAW` output frames, matching the 12 fps
  drawn sequence duplicated to 24 fps.

The regression coverage lives in `scripts/tests/render.test.mjs` and is run by
`npm test` from `scripts/`.

## Operational notes

- **Choose one base runtime.** This skill and `procedural-film` have overlapping
  descriptions. Choose this skill for its five named visual systems, one-file
  `defineFilm` runtime, or photo-doodle workflow. Choose `procedural-film` for
  its multi-file, gated production pipeline. Do not load both cores into one
  film; borrowing a look requires an explicit port onto the selected base.
- **Output names distinguish sound.** A full render always writes
  `<film>.mp4`, which is silent video. When the page exposes `window.__wav`, it
  also writes `<film>-score.wav` and the scored `<film>-final.mp4`; deliver the
  latter when sound is required.
- **Fast inspection needs no ffmpeg.** `--grid` and `--only` exit before any
  ffmpeg call. They still require Node, `puppeteer-core`, and a launchable
  Chrome/Chromium.
- **Aspect ratios still require an audit.** The core supports `W`, `H`, `CX`,
  `CY`, and render-time `--ar`, but several shipped examples use literal
  centres such as `540` or `960`; `examples/four-looks.html` explicitly targets
  a square canvas. `examples/fly-style.html` also contains raw
  `setTransform(1,0,0,1,0,0)` calls, which bypass the core's output scale `S`.
  For adapted formats use relative geometry and the core's scale-aware
  `resetT(c)` or `cam(...)`, then inspect the requested aspect ratio.
- **Chrome sandbox support is platform-specific.** The renderer launches Chrome
  without a sandbox override. A host or container where Chrome cannot
  initialise its sandbox may fail to launch; use an environment with working
  sandbox support rather than weakening the host sandbox globally.

## Runtime requirements

Rendering shells out to tooling that must already be installed:

- a Node version accepted by the resolved `puppeteer-core`; the current
  lockfile resolves `puppeteer-core` 25.11.0, which declares Node `>=22.12.0`;
- Google Chrome or Chromium on PATH, or `CHROME=/path/to/chrome`;
- `ffmpeg` on PATH for a full render (not for `--grid` or `--only`);
- optional, doodle look only: `rembg` (`pip install "rembg[cpu,cli]"`).

## Updating from upstream

Stage an upstream refresh separately and compare it with this copy before
replacing files. Record the new upstream commit, then preserve or deliberately
reapply the full-render frame cleanup and the `2 * __NDRAW` ffmpeg limit.
Preserve `scripts/tests/render.test.mjs` and the `test` command in
`scripts/package.json`, plus the provenance link and sound-deliverable guidance.
Run `npm ci` and `npm test` from `scripts/`; do not
accept the refresh if the stale-frame regression test fails. Update the commit
above only after the retained local delta has been verified.
