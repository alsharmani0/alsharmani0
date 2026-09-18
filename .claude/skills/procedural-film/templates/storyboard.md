# Storyboard: <FILM TITLE>

The plan every agent works from. Fill each section; the guidance in *italics* is replaced by content.

## Logline

*One sentence of story, one sentence of method.*

## Numbers

*Pick the bpm first; everything else follows. The example film: 120 bpm → beat 0.5 s = 12 frames → 32 s = 16 bars of 4/4 = 768 frames at 24 fps, 1080×1920, 17 shots.*

- bpm, beat (60/bpm s), bar (240/bpm s)
- duration in whole bars, total frames at 24 fps
- shot count, every shot 1 to 3 s

## Summary

| Order | Id | Start | End | Mode | Title |
|---|---|---|---|---|---|
| 01 | *hero-shot* | 0 | 1.5 | illustrated | *Cold open* |

*Ids are kebab-case; files are `src/scenes/NN-<id>.js`. Modes: illustrated (paper plate) or schematic (blueprint plate). Alternate the plates; a run of two schematic shots works at the opening. Boundaries sit on the beat grid.*

## Structure

*Acts mapped to bars: "Act 1, bars 1 to 4 (0 to 8 s)". The story's hinge lands on the midpoint downbeat. Then:*

- *Match cuts: which shot pairs share a shape ("06 to 07 to 08: the pupa").*
- *Push-ins and pull-backs, with zoom factors ("11: 40x into the surface").*
- *Time devices: how the film shows time passing — sun arcs, tally rings, counters, moons.*
- *The ending loops back to the opening composition, so the film plays as a cycle.*

## Conventions

- `T` is global seconds, `t` is shot-local seconds. Every timestamp in a shot entry is global T; convert to shot-local t (t = T − start) when animating, and check the beat arithmetic twice.
- Camera moves use `lib.camera(ctx, { x, y, zoom, rot }, fn)`: the world point (x, y) maps to the frame centre.
- Palette names come from the art bible.
- Hard cuts are the default; a shot declares `transitionIn` when it needs more, and the incoming shot owns it.
- Scenes clamp `t` past their duration during transitions.

## Shared geometry

*Exact pixel tables for every shape that survives a match cut. Scenes copy these numbers exactly, or the match cuts jump.*

### G1: *<shape name>*

*e.g. the egg profile as half-widths by y, a polyline, an arc with centre and radius, a map projection with named anchor points.*

## Shots

*One entry per shot, identical structure, separated by `---`:*

## NN <id>: <Title>

T <start> to <end>, <mode>, <transition in>.

### Composition

*What is on screen, where, how big.*

### Forms

*The shapes drawn, with sizes and the palette names they use.*

### Overlays

*On every illustrated shot (usually omitted on schematic): rings, arcs, rulers, brackets — what each shows.*

### Motion

*Timestamped on the grid: "T 0.500 (beat 2): the wings slam down, outBack over 3 frames". Lead each event so it is visible ON its beat frame.*

### Camera

*Static, push-in, pull-back, with zoom factors and easing.*

### Enter and exit

*What the cut matches into; what the outgoing frame leaves behind.*

### Subject

*The researched facts this shot must truthfully show — pulled from art-bible section 10.*

### Sound

*Timestamped cues on the grid, with exact pitches and synthesis descriptions: "T 0.5: the hook hit — a downward whoosh with a sub drop — and the four-note kalimba motif D5, F#5, A5, E5 starts on 8ths". These become FILM.TIMELINE.cues.*

---

## Appendix: from doc to code — `src/timeline.js`

*The timeline is the storyboard as data. One flat cue list, collected from the Sound sections:*

```js
FILM.TIMELINE = {
  title: '<film title>',
  bpm: 120, duration: 32, fps: 24, width: 1080, height: 1920,
  shots: [
    {
      id: 'eclosion',
      file: '09-eclosion.js',
      start: 16,
      end: 18,
      mode: 'illustrated',            // or 'schematic'
      title: 'Emergence',
      transitionIn: { kind: 'flash', dur: 0.125 },   // omit for a hard cut; kinds: cut, fade, flash, iris, wipe
      brief: 'On the midpoint downbeat a cream flash reveals the adult sliding out…',
    },
    // …one entry per storyboard shot, boundaries on the beat grid, tiling [0, duration]
  ],
  cues: [
    { t: 0.5, kind: 'hit', note: 'Wing slam: downward whoosh and sub drop; motif D5 F#5 A5 E5 starts on 8ths' },
    // kinds: hit | sfx | cut | swell — the human-readable score spec; music.js implements them at these times
  ],
};
```
