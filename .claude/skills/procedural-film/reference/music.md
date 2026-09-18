# Music

How the score works and how to compose one.

## Architecture — keep

- `FILM.audio.render(ctx, { start, dest, mix? })` schedules the whole piece into any `BaseAudioContext`: the player passes a live `AudioContext`, the render tool an `OfflineAudioContext` at 48 kHz stereo, and both hear the same piece.
- The score is scheduled **one bar at a time**: `render()` calls `score(E, I)` once per bar with a window `[E.w0, E.w1)`. Schedule at absolute global times; the engine clips each call to its bar. Output equals scheduling everything at once.
- `LAT = 0.006`: the compressor's measured 6 ms look-ahead. Every pre-compressor event is scheduled that early, so it leaves the master exactly on its cue.
- Envelopes are seek-correct: when a voice started before the render window, its envelope value is recomputed at the skip point — a seek hears the same envelope as a full render.
- Randomness comes only from `E.rng(...)` / `lib.rng`, seeded per event (`lib.hash('film-…', key)`), so any start time schedules the same notes at the same global times.
- Master chain: master gain (`MIX.ride` section automation) → highpass 26 Hz → tilt EQ (lowshelf 140, presence 3 kHz, air 8 kHz) → glue compressor → trim → tanh soft limiter (ceiling 0.66 ≈ −3.6 dBFS) → click-free output fades.
- FX: three convolver reverbs on generated impulse responses (room 0.9 s, hall 2.8 s, cave 6 s) and a ping-pong delay, a dotted 8th per side. Per-voice sends pass through per-bus taps, so a bus fader moves its reverb too.
- Buses: `drums` (tanh saturator so the kick reads on phone speakers), `perc`, `bass` (ducked), `pad` (ducked, HPF 180), `keys`, `bells`, `lead`, `sfx`, `amb`. `E.duck(t, depth)` sidechains pad and bass. Adding a bus means adding it to the `BUSES` list in `tools/audio/render-audio.cjs` as well.
- Instruments (~33): `kick` (felt/full/heart/thud), `brush`, `hat`, `shaker`, `crash`, `tock`, `marimba`, `kalimba`, `glock`, `glass`, `fmBell`, `gong`, `ting`, `pad`, `sub`, `subDrop`, `pluck`, `boop`, `stab`, `lead`, `horn`, `nz` (generic filtered noise with envelope-shaped frequency, amp and pan), `play` (generated-buffer playback), `flutter`, `chew`, `plip`, `glide`, `whump`, `whistle`, `bleep`, `buzz`, `revSwell`, `wind`. Buffer-synth helpers: `noiseBuffer`, `grainBuffer`, `flapGrains`/`clickGrains`, `creakBuffer`, `periodic` waves (`warmSaw`, `softSquare`, `brassSaw`). `hz('F#4')` parses note names.
- The shipped `score()` is a demo — kick on every beat, a pad and sub per bar, a kalimba motif on offbeats, all derived from `FILM.TIMELINE`. It gives the stub pass a pulse and shows the idiom. It is not the film's music.

## Compose — replace

Per film, the music agent replaces exactly three things in `src/music.js`:

1. **`CH`** — the chord table for the film's key.
2. **`MIX.ride`** — section fader rides in dB at global times, pre-compressor: hush the quiet acts, full level at the hinge, and match the level across the loop seam so the cycle restarts cleanly.
3. **`score(E, I)`** — the composition.

The cues are the spec: `FILM.TIMELINE.cues`, collected from the storyboard's Sound sections. `music.js` does not parse the cues — it implements each one, by hand, at the same time. Hits land on cuts; motif entries land on their notated 8ths and 16ths. Compose section by section against the acts. SFX and music differ only by routing (`sfx`/`amb` buses) and by grain-buffer pre-rendering — both schedule identically.

## Verify — the loop that caught real bugs

```bash
node tools/audio/render-audio.cjs                          # .tmp/audio/score.wav, 48 kHz stereo float
node tools/audio/analyze.cjs .tmp/audio/score.wav --cues   # onsets matched to TIMELINE.cues within 10 ms
node tools/audio/analyze.cjs .tmp/audio/score.wav --bars   # per-bar RMS profile
node tools/audio/analyze.cjs .tmp/audio/score.wav --seam   # loop-seam click analysis
node tools/audio/peaks.cjs .tmp/audio/score.wav            # clip windows and histogram
node tools/audio/render-audio.cjs --solo drums,bass        # bus isolation (also --mute, --mix)
node tools/audio/cost.cjs                                  # render() time and node count
```

Then measure the phone codec, not just the WAV: a 128k AAC encode overshoots true peak by about +0.2 dB. Encode one (`ffmpeg -i .tmp/audio/score.wav -c:a aac -b:a 128k .tmp/audio/score-128k.m4a`) and measure both (`ffmpeg -i <file> -af ebur128 -f null -`). The limiter ceiling of 0.66 exists to leave that headroom — keep it at or below.

Done when: onsets match cues within 10 ms, no clipping in WAV or AAC, and the gate is green.
