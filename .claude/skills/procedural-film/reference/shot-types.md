# Shot types

An index of shot types harvested from `examples/butterfly-life`, the one finished film in this repo.
Read this during storyboard step 4 (`SKILL.md`) so a new film on a new subject reaches for a proven shot instead of inventing every one from scratch.
Each entry generalizes one or more storyboard shots away from butterflies; open the example file for the concrete numbers, geometry and beat placement.
The last two entries are editing devices the example film does not use; reach for them when a beat needs punctuation the types above do not cover.

## 1. Cold open on the hero

Establishes the protagonist fully formed and centred in one pose that reads as the thumbnail on frame 0, then punches into motion on the first big beat so the hook lands inside the first second.

- Duration: 1.5 s
- Plate: paper
- Camera: locked push-in (zoom 1.00 to 1.05) landing on the beat
- Leans on: `inkPath`, `hatch`, `stipple`, `crossHatch`, `camera`
- Example: `examples/butterfly-life/src/scenes/01-hero-on-milkweed.js`

## 2. Blueprint genesis: a spark becomes a structure

Opens the film's founding structure from nothing: a single spark threads into frame, then the outline, lattice and internal detail build outward in beat-locked stages, ending on the shape the story keeps returning to.

- Duration: 2.5 s
- Plate: blueprint
- Camera: locked at zoom 1; the geometry animates, the camera never moves
- Leans on: `blueprint`, `tracePath`, `glowDot`, `bracket`, `ticks`, `guideCircle`, `arcAnnotation`
- Example: `examples/butterfly-life/src/scenes/02-egg-blueprint.js`

## 3. Breaking out: emergence from a casing

The subject forces its way out of an enclosing structure (a shell, a case, a cocoon); the casing cracks or splits on a beat, then pump or settle beats finish the new form.

- Duration: 1.5 to 2.0 s
- Plate: paper
- Camera: locked, or pulls back mid-shot to widen the frame around the burst
- Leans on: `tracePath`, `guideCircle`, `arcAnnotation`, `camera`
- Example: `examples/butterfly-life/src/scenes/03-egg-hatch.js` (also `09-eclosion.js` for the locked, flash-in variant)

## 4. Developmental journey: travel and grow along a path

The subject moves through a static environment while changing state at fixed intervals, each transition landing on a beat and adding to a persistent tally that stays on screen.

- Duration: 2.5 s
- Plate: paper
- Camera: locked, with a slow push (zoom 1.00 to 1.03) as the subject travels
- Leans on: `inkPath`, `hatch`, `inkLine`, `guideCircle`, `camera`
- Example: `examples/butterfly-life/src/scenes/04-larva-molts.js`

## 5. Growth-stage ladder (blueprint size comparison)

Blueprint comparison of the same subject at several stages, stacked by size and drawn on in order, with a scale axis alongside; use it when growth itself is the point rather than any one stage.

- Duration: 1.5 s
- Plate: blueprint
- Camera: locked at zoom 1
- Leans on: `inkPath`, `glowDot`, `ticks`, `bracket`, `tracePath`, `hexLattice`, `blueprint`
- Example: `examples/butterfly-life/src/scenes/05-instar-ladder.js`

## 6. Silhouette transformation (match-cut into a new form)

The subject contracts or reshapes on camera from one recognizable silhouette into another inside one locked shot, so the match cut on either side lands on an exact outline.

- Duration: 2.0 s
- Plate: paper
- Camera: locked at zoom 1
- Leans on: `inkPath`, `tracePath`, `arcAnnotation`, `bracket`
- Example: `examples/butterfly-life/src/scenes/06-j-hang.js`

## 7. Blueprint schematic of an internal structure (rebuild)

Blueprint cutaway of what is happening inside a sealed structure while the outside stays unchanged: parts break down and rebuild into named components that wire out to labelled node callouts.

- Duration: 1.5 s
- Plate: blueprint
- Camera: locked at zoom 1
- Leans on: `ticks`, `tracePath`, `glowDot`, `bracket`, `hexLattice`, `blueprint`
- Example: `examples/butterfly-life/src/scenes/07-inside-chrysalis.js`

## 8. Time-passage hold with a cycle tally

The camera holds on a mostly still subject while a repeating cycle (day and night, seasons, months) ticks past on a tally overlay, ending on a punctuating event that releases the held time.

- Duration: 1.5 to 3.0 s
- Plate: paper
- Camera: locked at zoom 1
- Leans on: `tracePath`, `hatch`, `inkLine`, `arcAnnotation`
- Example: `examples/butterfly-life/src/scenes/08-chrysalis-days.js` (also `15-oyamel-winter.js` for the population variant)

## 9. Blueprint schematic of a working mechanism

Blueprint diagram of a system at work, plumbing, wiring, a sensory or steering mechanism, built from a locked or near-locked camera with labelled nodes and moving indicators that show the mechanism operating rather than an object at rest.

- Duration: 1.5 s
- Plate: blueprint
- Camera: locked, or easing a few percent toward a push-in target that sets up the next shot
- Leans on: `glowDot`, `tracePath`, `guideCircle`, `hexLattice`, `bracket`, `arcAnnotation`, `blueprint`, `camera`
- Example: `examples/butterfly-life/src/scenes/10-wing-veins.js` (also `12-sun-compass.js` for the fully locked variant)

## 10. Macro push-in to surface texture

One continuous push from a normal establishing view down into the subject's surface until individual texture elements fill the frame, each zoom step landing on a beat.

- Duration: 2.5 s
- Plate: paper
- Camera: continuous exponential push-in (zoom 1.08 to 40x), steps landing on the beats
- Leans on: `hatch`, `stipple`, `camera`, `arcAnnotation`
- Example: `examples/butterfly-life/src/scenes/11-scale-mosaic.js`

## 11. Pull-back to reveal scale

One continuous zoom out through several nested layers of context, each layer its own drawing at its own scale, showing how small the opening frame was against the wider world.

- Duration: 3.0 s
- Plate: paper
- Camera: one log-linear zoom-out, each layer landing on its own beat with its own anchor
- Leans on: `guideCircle`
- Example: `examples/butterfly-life/src/scenes/13-pull-back-continent.js`

## 12. Population/column shot

A stream of many small instances of the subject moving together across the frame, density and scale increasing toward the camera, with one lead instance called out.

- Duration: 1.5 s
- Plate: paper
- Camera: locked, with a slow drift or tilt across the shot
- Leans on: `inkPath`, `hatch`, `inkLine`, `arcAnnotation`
- Example: `examples/butterfly-life/src/scenes/14-migration-column.js`

## 13. Snap zoom-in to a match-cut

The subject performs one last action, then the camera snap-zooms from normal scale up to tens of times that scale, landing exactly on the shape the next shot, or the loop, expects.

- Duration: 1.0 s
- Plate: paper
- Camera: snap zoom (1x to tens of x) with an eased arrival, keeping one screen point fixed
- Leans on: `inkPath`, `hatch`, `stipple`, `crossHatch`
- Example: `examples/butterfly-life/src/scenes/16-spring-egg.js`

## 14. Loop-closing repeat of the opening

A near-duplicate of the film's founding structure, fully drawn on its first frame, that hands its last frame straight into frame 0 of the opening shot so the loop is invisible.
The one shot in the film that carries a wordmark.

- Duration: 1.5 s
- Plate: blueprint
- Camera: locked at zoom 1
- Leans on: `ticks`, `bracket`, `tracePath`, `guideCircle`, `glowDot`, `text`, `blueprint`
- Example: `examples/butterfly-life/src/scenes/17-egg-loop.js`

## 15. Macro insert (editing device)

A 3-frame cutaway to one extreme close-up, used to punctuate a bite, a click, a spark, anything that needs one sharp beat of detail without slowing the shot around it.

- Duration: 3 frames, one 16th note at 120 bpm (0.125 s)
- Plate: paper or blueprint, matching the shot it cuts into
- Camera: locked, at extreme zoom on the one detail
- No example file in this repo yet; build it with the same draw helpers as the surrounding shot's plate

## 16. Montage (editing device)

A rapid sequence of cards used to compress a list or a sequence of steps into one beat-driven flourish, faster than any single shot in the example film.

- Duration: about 4 cards per second, 6 frames per card at 24 fps, for as long as the list runs
- Plate: paper or blueprint, matching the shot it cuts into
- Camera: locked, or one small push per card
- No example file in this repo yet; build it with the same draw helpers as the surrounding shot's plate
