---
name: procedural-film
description: Procedural film — turn a subject into a short vertical animated film drawn and scored entirely in JavaScript. Use when the user asks for a procedural film, or a short hand-drawn animated film about a subject.
---

# Procedural film

Turn a topic into a **film**: roughly 30 seconds, vertical 1080×1920 at 24 fps, hand-inked **paper plate** shots cut against navy **blueprint plate** shots, every event on a **beat grid** (bpm → beats → frames), every pixel and every audio sample computed in plain browser JavaScript. The deliverable is `dist/<slug>.html` (a self-contained player) plus `exports/<slug>.mp4` and its phone and preview transcodes.

This skill packages a proven pipeline. It ships three things:

- `foundation/` — the engine and tools, copied into the new project: `src/core.js`, `src/lib.js`, `src/player.js`, `src/music.js` (engine plus a demo score), and `tools/` (build, check, snap, render, stubgen, audio analysis, fixtures). Everything is driven by `src/timeline.js`, so no tool code changes per film.
- `templates/` — the four planning documents every film starts from.
- `reference/` — read when a step below points at one; the three example images first.

Look first: `reference/example-contact-sheet.jpg` (the whole example film, 24 labelled frames), `reference/example-paper-frame.jpg` and `reference/example-blueprint-frame.jpg` (one full frame of each plate). That density and that finish are the bar.

## The gate

`node tools/check.cjs` is the gate: six checks (media scan, determinism, source scan, timeline, draw, frame cost), and exit 0 means green. From the stub pass onward, no step is done while the gate is red. On real scenes it takes under a minute — let it finish.

## Worked example

`butterfly-life` is a finished film from this pipeline, at `../../examples/butterfly-life/` from this skill folder, or online at https://github.com/kuhnhomeuk-cell/procedural-film/tree/main/examples/butterfly-life when that folder is absent. When a template leaves the shape of a filled document unclear, read its counterpart there: `docs/art-bible.md`, `docs/storyboard.md`, `src/timeline.js`, `src/scenes/`, `src/music.js`. Take its structure; the subject comes from step 2's research.

## Pipeline

### 0. Brief

Ask one round of questions: the subject, what the film must include about it, and the length if it differs from 30 seconds. Invent the rest and say what you invented.

Done when: the subject is one written sentence the user has seen.

### 1. Setup

Create the project folder named for the film's slug and copy `foundation/` into it. Run `npm install` in `tools/` (Playwright; add `npx playwright install chromium` there if the browser is missing) and confirm ffmpeg is on the PATH, or set `FFMPEG` to its binary. Copy the templates into `docs/` and set the subject in `docs/CONTRACT.md`'s Goal.

Done when: `node tools/smoke.cjs` passes, `node tools/check.cjs --fixtures` is green and `node tools/render.cjs --fixtures --scale 0.5` yields `exports/fixtures.mp4` with sound. The **fixtures** mini-film proves the toolchain before the film invests in planning.

### 2. Research

List the phases of the subject's story, then run one web search per open question and capture two to four authoritative full-text sources into `.tmp/research/`. Research lands in exactly two places downstream: the art bible's subject reference and each shot's Subject section.

Done when: every phase of the story traces to a captured source.

### 3. Art bible

Fill `docs/art-bible.md` from the template. Sections 1–9 are the house style — already decided. Only the two marked subject sections change: 2.2 (the subject palette, every colour a named hex, mirrored into the marked block in `src/lib.js`) and 10 (the subject reference built from the captured sources — one subsection per drawable element with sizes, ratios, counts, poses, sequences — ending in Mistakes to avoid, each mistake paired with the correct drawing).

If the user wants a different look than the house style, run a reference analysis first — `templates/reference-analysis.md` shows the method (step through one reference video, written notes only, end with numbered style rules) — then update art-bible sections 1–9 to match before continuing.

Done when: every element the storyboard will draw has a drawing rule and a palette name, `src/lib.js` holds the same values as section 2.2, the mistakes list exists, and `node tools/snap.cjs --fixtures --shot palette --samples 5 --sheet` has been looked at: every swatch named, each colour judged against its neighbours on both plates. Every scene agent copies this palette, so a wrong hue costs every scene file.

### 4. Storyboard

Read `reference/shot-types.md` for the shot types the example film proves, then fill `docs/storyboard.md` from the template: logline; numbers (pick a bpm, then beat = 60/bpm seconds and the duration lands in whole bars); summary table; acts mapped to bars; a shared-geometry table for every shape that survives a **match cut**; then one entry per shot — 1 to 3 seconds each, boundaries on the beat grid, plates alternating — with all eight subsections, the Sound cues timestamped on the grid.

Done when: the shots tile [0, duration] exactly, with no gaps or overlaps, every shot has all eight subsections, every match-cut shape has a shared-geometry table, and the doc survives a self-review with a critic's eye: every number in the prose matches the tables (beat arithmetic, act boundaries), and no must-read content sits outside the safe area (x 60–940, y 220–1540) — arithmetic included. Storyboard errors compound into every scene; this is the cheapest moment to catch them.

### 5. Timeline

Write `src/timeline.js` from the storyboard (shape in the storyboard template): title, bpm, duration, the shots array (id, file, start, end, mode, title, transitionIn, brief), and the flat cues list collected from the Sound sections. The stub pass is this step's test — it fails loudly on a malformed timeline.

### 6. Stub pass

Run `node tools/stubgen.cjs` to generate a placeholder scene per shot, run the gate, then `node tools/render.cjs --scale 0.5 --out exports/draft-stubs.mp4` and watch the draft end to end. This is the tracer bullet: timeline, scenes, gate, render and audio all proven before any real scene is drawn.

Done when: the gate is green and the draft MP4 shows every shot in order, every cut on the grid.

### 7. Scenes

One agent per scene file — file ownership is law (docs/CONTRACT.md). Each scene agent reads `reference/scene-anatomy.md`, its storyboard entry, the art bible and the shared geometry, then writes `src/scenes/NN-<id>.js`, snaps a contact sheet (`node tools/snap.cjs --shot <id> --samples 6 --sheet`) and looks at every frame, iterating until the sheet is on-brief. `snap --only` renders one shot while sibling files are half-written, so scene agents run in parallel freely.

Each scene brief names the files the agent owns, the shared-geometry tables that bind it, and the scene file that owns the canonical progress glyph.

Done when: every shot's contact sheet has been eyeballed and judged on-brief, and the gate is green.

### 8. Music

Compose `src/music.js` per `reference/music.md`: keep the engine, replace the CH chord table, the MIX.ride automation and the whole score() function, implementing every cue in `FILM.TIMELINE.cues` at its exact time so the hits land on the cuts.

Done when: `node tools/audio/render-audio.cjs` then `node tools/audio/analyze.cjs .tmp/audio/score.wav --cues` matches onsets to cues within 10 ms, `node tools/audio/peaks.cjs .tmp/audio/score.wav` shows headroom under the limiter ceiling, and the gate is green.

### 9. Critic waves

Start with the whole film on one sheet: `node tools/snap.cjs --samples 24 --sheet --scale 0.25`. A shot that fails to read at that size is a P1 — the fix is composition, not more detail.

Then review every shot on rendered frames: fresh contact sheets, critic subagents scoring composition, faithfulness to the storyboard, motion and density. Critics **measure** ratio-critical geometry in pixels against the art bible (band fractions, thirds, safe-area arithmetic, shared-geometry positions) rather than judging by eye alone, and snap both sides of every match cut to compare.

Fix in waves — prioritised briefs (P1 first, each citing evidence frames), file ownership (resume the owning agent rather than spawning a fresh one), re-snap after every fix. The director spot-checks every P1 fix on fresh frames. Spot-check determinism by snapping the same frames in two different orders and comparing file hashes.

Done when: every P1 and P2 fix is verified on fresh frames and the gate is green.

### 10. Deliver

`node tools/render.cjs` writes the master (crf 16; a 30 s film renders in minutes). Then the transcodes:

```bash
ffmpeg -i exports/<slug>.mp4 -vf scale=720:1280 -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k exports/<slug>-phone.mp4
ffmpeg -i exports/<slug>.mp4 -c:v libx264 -crf 23 -preset medium -c:a copy exports/<slug>-preview.mp4
```

`node tools/build.cjs` writes `dist/<slug>.html`. Then watch the master end to end with sound, and open the HTML player once (click or space to play, arrow keys step frames, `?shot=<id>` loops one shot).

Write `exports/<slug>-shots.md` last: one line per shot saying what it shows, so whoever shares the film can caption it.

Done when: master, phone transcode, the HTML file and `exports/<slug>-shots.md` exist, the gate is green, and the final watch-through found nothing to fix.
