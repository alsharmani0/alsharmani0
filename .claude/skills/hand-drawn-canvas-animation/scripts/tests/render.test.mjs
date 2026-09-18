import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_RENDER_SCRIPT = path.resolve(TEST_DIR, '..', 'render.mjs');
const RENDER_SCRIPT = process.env.RENDER_SCRIPT
  ? path.resolve(process.env.RENDER_SCRIPT)
  : DEFAULT_RENDER_SCRIPT;

function makeWork(t, label) {
  const root = mkdtempSync(path.join(tmpdir(), `hand-drawn-render-${label}-`));
  const html = path.join(root, 'film.html');
  const out = path.join(root, 'renders');
  t.after(() => rmSync(root, { recursive: true, force: true }));
  return { root, html, out, frames: path.join(out, 'film-frames') };
}

function writeFixture(file, { frames, throwAt = -1 }) {
  writeFileSync(
    file,
    `<!doctype html>
<meta charset="utf-8">
<canvas id="film" width="32" height="32"></canvas>
<script>
  const canvas = document.getElementById('film');
  const ctx = canvas.getContext('2d');
  window.__size = { W: 32, H: 32, w: 32, h: 32 };
  window.__NDRAW = ${frames};
  window.__frame = i => {
    if (i === ${throwAt}) throw new Error('fixture frame ' + i + ' failed');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = 'rgb(' + ((i * 41) % 220 + 20) + ',48,72)';
    ctx.fillRect(0, 0, 32, 32);
    ctx.fillStyle = '#f4f1eb';
    ctx.font = '12px sans-serif';
    ctx.fillText(String(i), 4, 18);
    return canvas.toDataURL('image/png');
  };
  window.__grid = (n, tile) => {
    const sheet = document.createElement('canvas');
    sheet.width = Math.max(1, n) * tile;
    sheet.height = tile;
    const g = sheet.getContext('2d');
    for (let i = 0; i < n; i++) {
      g.fillStyle = 'hsl(' + ((i * 53) % 360) + ' 35% 70%)';
      g.fillRect(i * tile, 0, tile, tile);
    }
    return sheet.toDataURL('image/jpeg', 0.8);
  };
  window.__ready = true;
</script>\n`,
  );
}

function formatRun(result) {
  return [
    result.error ? String(result.error) : '',
    `exit=${result.status} signal=${result.signal || 'none'}`,
    result.stdout || '',
    result.stderr || '',
  ].filter(Boolean).join('\n');
}

function runRenderer(html, args = [], env = {}) {
  return spawnSync(process.execPath, [RENDER_SCRIPT, html, ...args], {
    cwd: path.dirname(html),
    encoding: 'utf8',
    env: { ...process.env, ...env },
    maxBuffer: 10 * 1024 * 1024,
    timeout: 120_000,
  });
}

function probeVideo(file) {
  const result = spawnSync(process.env.FFPROBE || 'ffprobe', [
    '-v', 'error',
    '-select_streams', 'v:0',
    '-count_frames',
    '-show_entries', 'stream=nb_read_frames,avg_frame_rate,duration:format=duration',
    '-of', 'json',
    file,
  ], { encoding: 'utf8', timeout: 30_000 });
  assert.equal(result.status, 0, formatRun(result));
  const data = JSON.parse(result.stdout);
  const stream = data.streams[0];
  return {
    outputFrames: Number(stream.nb_read_frames),
    fps: stream.avg_frame_rate,
    duration: Number(stream.duration ?? data.format.duration),
  };
}

function numberedFrames(dir) {
  return readdirSync(dir).filter(name => /^\d{4}\.png$/.test(name)).sort();
}

function makeFfmpegTrap(root) {
  const bin = path.join(root, 'trap-bin');
  const log = path.join(root, 'ffmpeg-invoked.log');
  mkdirSync(bin);
  const shim = path.join(bin, 'ffmpeg');
  writeFileSync(shim, '#!/bin/sh\nprintf "invoked\\n" >> "$FFMPEG_TRAP_LOG"\nexit 99\n');
  chmodSync(shim, 0o755);
  return {
    log,
    env: {
      FFMPEG_TRAP_LOG: log,
      PATH: [bin, process.env.PATH].filter(Boolean).join(path.delimiter),
    },
  };
}

test('a shorter full rerender removes only stale numbered frames and rebuilds exact video duration', { timeout: 120_000 }, t => {
  const work = makeWork(t, 'shorten');
  writeFixture(work.html, { frames: 12 });
  const first = runRenderer(work.html, ['--out', work.out]);
  assert.equal(first.status, 0, formatRun(first));

  const keep = {
    sentinel: path.join(work.frames, 'sentinel.keep'),
    poster: path.join(work.frames, 'poster.png'),
    notes: path.join(work.out, 'render-notes.txt'),
    otherFrame: path.join(work.out, 'another-film-frames', '0009.png'),
  };
  mkdirSync(path.dirname(keep.otherFrame));
  for (const [name, file] of Object.entries(keep)) writeFileSync(file, `keep-${name}`);

  writeFixture(work.html, { frames: 6 });
  const second = runRenderer(work.html, ['--out', work.out]);
  assert.equal(second.status, 0, formatRun(second));

  const video = probeVideo(path.join(work.out, 'film.mp4'));
  assert.deepEqual({
    numbered: numberedFrames(work.frames),
    ...video,
  }, {
    numbered: ['0000.png', '0001.png', '0002.png', '0003.png', '0004.png', '0005.png'],
    outputFrames: 12,
    fps: '24/1',
    duration: 0.5,
  });
  for (const [name, file] of Object.entries(keep)) {
    assert.equal(readFileSync(file, 'utf8'), `keep-${name}`, `${name} must survive target-frame cleanup`);
  }
});

test('--only and --grid preserve full-render artifacts and never invoke ffmpeg', { timeout: 120_000 }, t => {
  const work = makeWork(t, 'spot');
  writeFixture(work.html, { frames: 6 });
  mkdirSync(work.frames, { recursive: true });
  const frameNames = ['0000.png', '0001.png', '0002.png', '0003.png', '0004.png', '0005.png'];
  for (const name of frameNames) writeFileSync(path.join(work.frames, name), `old-${name}`);
  const sentinel = path.join(work.frames, 'sentinel.keep');
  const mp4 = path.join(work.out, 'film.mp4');
  writeFileSync(sentinel, 'keep-sentinel');
  writeFileSync(mp4, 'keep-mp4');
  const trap = makeFfmpegTrap(work.root);

  const only = runRenderer(work.html, ['--out', work.out, '--only', '2'], trap.env);
  assert.equal(only.status, 0, formatRun(only));
  assert.deepEqual(numberedFrames(work.frames), frameNames);
  assert.equal(readFileSync(path.join(work.frames, '0000.png'), 'utf8'), 'old-0000.png');
  assert.equal(readFileSync(mp4, 'utf8'), 'keep-mp4');
  assert.equal(readFileSync(sentinel, 'utf8'), 'keep-sentinel');
  assert.equal(existsSync(trap.log), false, '--only must not invoke ffmpeg');

  const afterOnly = new Map(frameNames.map(name => [name, readFileSync(path.join(work.frames, name))]));
  const grid = runRenderer(work.html, ['--out', work.out, '--grid', '3'], trap.env);
  assert.equal(grid.status, 0, formatRun(grid));
  for (const [name, bytes] of afterOnly) assert.deepEqual(readFileSync(path.join(work.frames, name)), bytes);
  assert.equal(readFileSync(mp4, 'utf8'), 'keep-mp4');
  assert.equal(readFileSync(sentinel, 'utf8'), 'keep-sentinel');
  assert.ok(readFileSync(path.join(work.out, 'film-grid.jpg')).length > 0);
  assert.equal(existsSync(trap.log), false, '--grid must not invoke ffmpeg');
});

test('a frame drawing error exits nonzero without encoding an old frame set', { timeout: 120_000 }, t => {
  const work = makeWork(t, 'draw-error');
  writeFixture(work.html, { frames: 6, throwAt: 3 });
  mkdirSync(work.frames, { recursive: true });
  for (let i = 0; i < 12; i++) writeFileSync(path.join(work.frames, `${String(i).padStart(4, '0')}.png`), `old-${i}`);
  const trap = makeFfmpegTrap(work.root);

  const result = runRenderer(work.html, ['--out', work.out], trap.env);
  assert.notEqual(result.status, 0, formatRun(result));
  assert.match(result.stderr, /drawn frame 3 .*fixture frame 3 failed/);
  assert.equal(existsSync(trap.log), false, 'ffmpeg must not run after a draw error');
  assert.equal(existsSync(path.join(work.out, 'film.mp4')), false, 'a failed render must not create an mp4');
});
