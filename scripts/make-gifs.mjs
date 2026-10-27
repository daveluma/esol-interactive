// Draws the original animated GIFs for "THE GOOD NEWS" (2 per verse) into src/assets/gifs/.
// Each frame is an SVG drawing; resvg turns it into pixels and gifenc writes the GIF.
//
// Run:  npm i --no-save gifenc@1.0.3 @resvg/resvg-js@2.6.2
//       node scripts/make-gifs.mjs            (or: node scripts/make-gifs.mjs sunrise)

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import gifenc from 'gifenc';

const { GIFEncoder, quantize, applyPalette } = gifenc;

const W = 360;
const H = 270;
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'assets', 'gifs');

// ---------- helpers ----------

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
// Progress of t inside [a, b] → 0..1 (eased).
const seg = (t, a, b) => ease(clamp((t - a) / (b - a)));
const lerp = (a, b, p) => a + (b - a) * p;
const pts = (list) => list.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
const svg = (body, bg = '#fdf8ee') =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="${bg}"/>${body}</svg>`;

// Points along a curve f(s), s in 0..1; `p` = how much of it to keep.
function curve(f, p = 1, n = 60) {
  const out = [];
  const last = Math.max(1, Math.round(n * clamp(p)));
  for (let i = 0; i <= last; i++) out.push(f((i / n) * 1));
  return out;
}

function leaf(x, y, angle, scale, fill = '#4f9a4a') {
  if (scale <= 0.01) return '';
  return `<g transform="translate(${x} ${y}) rotate(${angle}) scale(${scale})"><path d="M0 0 C 8 -14, 26 -14, 34 0 C 26 14, 8 14, 0 0 Z" fill="${fill}"/><path d="M2 0 L30 0" stroke="#2f6b33" stroke-width="1.5"/></g>`;
}

function grapes(x, y, scale) {
  if (scale <= 0.01) return '';
  const rows = [[-12, 0], [0, 0], [12, 0], [-6, 10], [6, 10], [0, 20], [-18, -10], [-6, -10], [6, -10], [18, -10]];
  const balls = rows
    .map(([dx, dy]) => `<circle cx="${dx}" cy="${dy}" r="7" fill="#6b3fa0"/><circle cx="${dx - 2}" cy="${dy - 2}" r="2" fill="#b79be0"/>`)
    .join('');
  return `<g transform="translate(${x} ${y}) scale(${scale})"><path d="M0 -14 L0 -22" stroke="#6b4a2b" stroke-width="3"/>${balls}</g>`;
}

// ---------- the vine (John 15:5) ----------

const stem = (s) => [180 + 16 * Math.sin(s * Math.PI * 2.2), 250 - 205 * s];
const BRANCHES = [
  { s: 0.3, dir: -1, len: 110 },
  { s: 0.42, dir: 1, len: 115 },
  { s: 0.6, dir: -1, len: 95 },
  { s: 0.72, dir: 1, len: 90 },
  { s: 0.88, dir: -1, len: 60 },
];
const branchFn = (b) => {
  const [x0, y0] = stem(b.s);
  return (u) => [x0 + b.dir * b.len * u, y0 - 26 * Math.sin(u * Math.PI * 0.8) + 10 * u * u];
};

function vine({ grow = 1, branches = 1, leaves = 1, fruit = 0, sway = 0 }) {
  let body = `<rect y="240" width="${W}" height="30" fill="#c9b48a"/>`;
  body += `<polyline points="${pts(curve(stem, grow))}" fill="none" stroke="#6b4a2b" stroke-width="9" stroke-linecap="round"/>`;
  BRANCHES.forEach((b, i) => {
    const start = i * 0.12;
    const p = clamp((branches - start) / 0.5);
    if (p <= 0) return;
    const f = branchFn(b);
    body += `<polyline points="${pts(curve(f, p, 30))}" fill="none" stroke="#7a5532" stroke-width="5" stroke-linecap="round"/>`;
    const ls = clamp((leaves - start) / 0.5);
    [0.45, 0.8, 1].forEach((u, j) => {
      const [x, y] = f(u);
      const ang = (b.dir < 0 ? 180 : 0) + (j % 2 ? -35 : 35) + sway * (j % 2 ? 1 : -1);
      body += leaf(x, y, ang, ls * (u === 1 ? 1 : 0.85));
    });
    const fs = clamp((fruit - i * 0.15) / 0.35);
    const [gx, gy] = f(0.62);
    body += grapes(gx, gy + 24, fs < 1 ? fs * 1.12 : 1);
  });
  return body;
}

function vineGrows(t) {
  const sway = 6 * Math.sin(t * Math.PI * 4) * seg(t, 0.75, 0.85);
  return svg(
    vine({ grow: seg(t, 0, 0.35), branches: seg(t, 0.25, 0.7), leaves: seg(t, 0.4, 0.85), sway }),
    '#eef6ff',
  );
}

function vineFruit(t) {
  const sway = 4 * Math.sin(t * Math.PI * 2);
  const glow = seg(t, 0.75, 0.9) * (1 - seg(t, 0.9, 1));
  return svg(
    `<circle cx="180" cy="110" r="${150}" fill="#fff3c4" opacity="${0.6 * glow}"/>` +
      vine({ fruit: seg(t, 0.05, 0.8) * 1.6, sway }),
    '#eef6ff',
  );
}

// ---------- peace (Philippians 4:6-7) ----------

function dove(x, y, flap, scale = 1) {
  const wing = -30 * flap;
  return `<g transform="translate(${x} ${y}) scale(${scale})">
    <path d="M-34 4 L-58 -6 L-56 12 Z" fill="#e8eef5"/>
    <ellipse cx="0" cy="4" rx="36" ry="14" fill="#ffffff"/>
    <circle cx="32" cy="-4" r="10" fill="#ffffff"/>
    <path d="M41 -5 L52 -2 L41 0 Z" fill="#e5a33b"/>
    <circle cx="35" cy="-6" r="1.8" fill="#333"/>
    <g transform="rotate(${wing} -4 0)"><path d="M-14 0 C -10 -40, 20 -44, 22 -2 Z" fill="#f2f6fa" stroke="#d5dee8" stroke-width="1.5"/></g>
    <path d="M44 0 C 56 -6, 64 -2, 70 -10" stroke="#5f9b4f" stroke-width="3" fill="none"/>
    ${leaf(58, -6, -30, 0.45)}${leaf(64, -9, 20, 0.4)}
  </g>`;
}

function peaceDove(t) {
  const x = lerp(-70, W + 70, t);
  const y = 95 + 12 * Math.sin(t * Math.PI * 2);
  const flap = (Math.sin(t * Math.PI * 12) + 1) / 2;
  let waves = '';
  for (let r = 0; r < 4; r++) {
    const yy = 200 + r * 16;
    const shift = (t * 60 + r * 20) % 60;
    const line = [];
    for (let xx = -60; xx <= W + 60; xx += 6) line.push([xx + shift - 30, yy + 3 * Math.sin((xx / 60) * Math.PI * 2)]);
    waves += `<polyline points="${pts(line)}" fill="none" stroke="#ffffff" stroke-opacity="0.55" stroke-width="2"/>`;
  }
  return svg(
    `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe0f7"/><stop offset="1" stop-color="#f6efe0"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#sky)"/>
    <circle cx="290" cy="60" r="28" fill="#fff6cf"/>
    <rect y="185" width="${W}" height="85" fill="#7fb5d6"/>${waves}
    ${dove(x, y, flap)}`,
  );
}

// ---------- prayer (Philippians 4:6-7) ----------

function prayerCandle(t) {
  const flick = Math.sin(t * Math.PI * 8) * 0.5 + Math.sin(t * Math.PI * 14) * 0.3;
  const glowR = 90 + 10 * flick;
  const fh = 30 + 4 * flick;
  return svg(
    `<defs><radialGradient id="g" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffd27a" stop-opacity="0.85"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient></defs>
    <circle cx="250" cy="110" r="${glowR}" fill="url(#g)"/>
    <rect x="236" y="130" width="28" height="110" rx="4" fill="#f4ead6"/>
    <rect x="236" y="130" width="8" height="110" fill="#ffffff" opacity="0.5"/>
    <path d="M250 130 L250 120" stroke="#333" stroke-width="2"/>
    <path d="M250 ${120 - fh} C ${262 + 2 * flick} ${110 - fh / 2}, 258 118, 250 121 C 242 118, ${238 + 2 * flick} ${110 - fh / 2}, 250 ${120 - fh} Z" fill="#ffb627"/>
    <path d="M250 ${122 - fh * 0.6} C 255 112, 254 119, 250 121 C 246 119, 245 112, 250 ${122 - fh * 0.6} Z" fill="#fff1b8"/>
    <rect x="200" y="240" width="100" height="10" rx="3" fill="#8a6a45"/>
    <g transform="translate(110 140)">
      <path d="M-30 60 L -70 130 L -20 130 L 4 76 Z" fill="#5a3d91"/>
      <path d="M30 60 L 70 130 L 20 130 L -4 76 Z" fill="#4a3178"/>
      <path d="M0 -90 C -8 -78, -30 -30, -34 4 C -37 30, -28 56, -8 74 L 0 74 Z" fill="#d9a77c"/>
      <path d="M0 -90 C 8 -78, 30 -30, 34 4 C 37 30, 28 56, 8 74 L 0 74 Z" fill="#c8946a"/>
      <path d="M-5 -70 C -14 -44, -22 -16, -24 6 M-3 -50 C -10 -28, -15 -6, -16 12" stroke="#b07f58" stroke-width="2" fill="none"/>
      <path d="M5 -70 C 14 -44, 22 -16, 24 6 M3 -50 C 10 -28, 15 -6, 16 12" stroke="#9c6c48" stroke-width="2" fill="none"/>
      <ellipse cx="-8" cy="24" rx="7" ry="20" transform="rotate(14 -8 24)" fill="#e4b48b"/>
      <ellipse cx="8" cy="24" rx="7" ry="20" transform="rotate(-14 8 24)" fill="#d39f76"/>
      <path d="M0 -88 L0 72" stroke="#a87652" stroke-width="2"/>
    </g>`,
    '#2d2438',
  );
}

// ---------- sunrise (Psalm 107:1) ----------

function mix(c1, c2, p) {
  const a = c1.match(/\w\w/g).map((h) => parseInt(h, 16));
  const b = c2.match(/\w\w/g).map((h) => parseInt(h, 16));
  return `#${a.map((v, i) => Math.round(lerp(v, b[i], p)).toString(16).padStart(2, '0')).join('')}`;
}

function sunrise(t) {
  const p = seg(t, 0, 0.75);
  const sunY = lerp(250, 105, p);
  const top = mix('1d2a5a', '8fc8f0', p);
  const bottom = mix('5a3d7a', 'ffd9a0', p);
  let rays = '';
  const rayP = seg(t, 0.45, 0.8);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 + t * 1.2;
    const r1 = 44;
    const r2 = 44 + 30 * rayP;
    rays += `<line x1="${180 + r1 * Math.cos(a)}" y1="${sunY + r1 * Math.sin(a)}" x2="${180 + r2 * Math.cos(a)}" y2="${sunY + r2 * Math.sin(a)}" stroke="#ffd34d" stroke-width="5" stroke-linecap="round" opacity="${rayP}"/>`;
  }
  return svg(
    `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#sky)"/>
    ${rays}<circle cx="180" cy="${sunY}" r="38" fill="#ffcf3f"/>
    <path d="M0 200 C 60 160, 120 170, 180 195 C 240 165, 300 160, 360 190 L360 270 L0 270 Z" fill="${mix('243b2a', '4f8a4a', p)}"/>
    <path d="M0 230 C 80 205, 160 215, 220 232 C 280 210, 330 214, 360 225 L360 270 L0 270 Z" fill="${mix('1b2e20', '3d7a3c', p)}"/>`,
  );
}

// ---------- forever (Psalm 107:1) ----------

function lemniscate(s, a = 120) {
  const th = s * Math.PI * 2;
  const d = 1 + Math.sin(th) ** 2;
  return [180 + (a * Math.cos(th)) / d, 135 + (a * Math.sin(th) * Math.cos(th)) / d];
}

function foreverHeart(t) {
  const loop = curve(lemniscate, 1, 120);
  const trail = [];
  for (let i = 0; i < 14; i++) {
    const [x, y] = lemniscate((t - i * 0.012 + 1) % 1);
    trail.push(`<circle cx="${x}" cy="${y}" r="${8 - i * 0.5}" fill="#ffcf3f" opacity="${1 - i / 14}"/>`);
  }
  const beat = 1 + 0.12 * Math.max(0, Math.sin(t * Math.PI * 4)) ** 3;
  return svg(
    `<polyline points="${pts(loop)}" fill="none" stroke="#5a3d91" stroke-opacity="0.35" stroke-width="10" stroke-linejoin="round"/>
    ${trail.join('')}
    <g transform="translate(180 132) scale(${beat})"><path d="M0 18 C -30 -2, -26 -26, -12 -26 C -5 -26, 0 -20, 0 -14 C 0 -20, 5 -26, 12 -26 C 26 -26, 30 -2, 0 18 Z" fill="#d6455d"/></g>`,
    '#fbf3ff',
  );
}

// ---------- gates (Psalm 100:4-5) ----------

function gatesOpen(t) {
  const p = seg(t, 0.15, 0.6);
  const doorW = 70 * (1 - p * 0.85);
  const light = seg(t, 0.2, 0.7);
  const door = (x, w, flip) => {
    let bars = '';
    for (let i = 1; i < 5; i++) {
      const bx = flip ? x - (w * i) / 5 : x + (w * i) / 5;
      bars += `<line x1="${bx}" y1="88" x2="${bx}" y2="230" stroke="#5c3b1e" stroke-width="2"/>`;
    }
    const left = flip ? x - w : x;
    return `<rect x="${left}" y="80" width="${w}" height="150" fill="#9c6a3c" stroke="#5c3b1e" stroke-width="3"/>${bars}`;
  };
  return svg(
    `<defs><radialGradient id="g" cx="0.5" cy="0.55" r="0.5"><stop offset="0" stop-color="#fff7d6"/><stop offset="1" stop-color="#ffd977"/></radialGradient></defs>
    <rect x="0" y="230" width="${W}" height="40" fill="#b9a57c"/>
    <rect x="40" y="40" width="280" height="190" fill="#c9b893"/>
    <path d="M110 230 L110 100 A 70 70 0 0 1 250 100 L250 230 Z" fill="url(#g)" opacity="${0.25 + 0.75 * light}"/>
    <path d="M150 270 L170 230 L190 230 L210 270 Z" fill="#fff1c0" opacity="${light}"/>
    ${door(110, doorW, false)}${door(250, doorW, true)}
    <path d="M100 100 A 80 80 0 0 1 260 100" fill="none" stroke="#8a7650" stroke-width="10"/>
    <rect x="96" y="96" width="14" height="134" fill="#8a7650"/><rect x="250" y="96" width="14" height="134" fill="#8a7650"/>`,
    '#e8f1fa',
  );
}

// ---------- generations (Psalm 100:4-5) ----------

function person(x, ground, h, color, hair, p) {
  if (p <= 0.01) return '';
  const head = h * 0.18;
  const lift = 14 * (1 - p);
  return `<g opacity="${p}" transform="translate(0 ${lift})">
    <path d="M${x - h * 0.2} ${ground} L${x - h * 0.16} ${ground - h * 0.62} Q${x} ${ground - h * 0.74} ${x + h * 0.16} ${ground - h * 0.62} L${x + h * 0.2} ${ground} Z" fill="${color}"/>
    <circle cx="${x}" cy="${ground - h * 0.62 - head * 1.15}" r="${head}" fill="#d9a77c"/>
    <path d="M${x - head} ${ground - h * 0.62 - head * 1.2} A ${head} ${head} 0 0 1 ${x + head} ${ground - h * 0.62 - head * 1.2}" fill="${hair}"/>
  </g>`;
}

function generations(t) {
  const people = [
    { x: 70, h: 150, color: '#5a3d91', hair: '#d8d8d8', at: 0.0 },
    { x: 160, h: 165, color: '#1f7a4d', hair: '#3b2a1a', at: 0.18 },
    { x: 240, h: 110, color: '#d6455d', hair: '#6b4a2b', at: 0.36 },
    { x: 300, h: 70, color: '#e5a33b', hair: '#6b4a2b', at: 0.54 },
  ];
  const ground = 235;
  const glow = seg(t, 0.7, 0.85);
  let hearts = '';
  for (let i = 0; i < 3; i++) {
    const a = people[i];
    const b = people[i + 1];
    const p = seg(t, 0.62 + i * 0.06, 0.75 + i * 0.06);
    if (p <= 0) continue;
    const mx = (a.x + b.x) / 2;
    hearts += `<g transform="translate(${mx} ${ground - 175 + 10 * (1 - p)}) scale(${0.45 * p})" opacity="${p}"><path d="M0 18 C -30 -2, -26 -26, -12 -26 C -5 -26, 0 -20, 0 -14 C 0 -20, 5 -26, 12 -26 C 26 -26, 30 -2, 0 18 Z" fill="#d6455d"/></g>`;
  }
  return svg(
    `<rect y="${ground}" width="${W}" height="${H - ground}" fill="#c9b48a"/>
    <path d="M30 ${ground - 200} Q 180 ${ground - 250} 330 ${ground - 200}" fill="none" stroke="#ffcf3f" stroke-width="6" stroke-linecap="round" opacity="${glow}"/>
    ${people.map((pp) => person(pp.x, ground, pp.h, pp.color, pp.hair, seg(t, pp.at, pp.at + 0.15))).join('')}
    ${hearts}`,
    '#f3f8ef',
  );
}

// ---------- write the GIFs ----------

const GIFS = {
  'vine-grows': { draw: vineGrows, frames: 48, delay: 70, hold: 1600 },
  'vine-fruit': { draw: vineFruit, frames: 44, delay: 70, hold: 1400 },
  'peace-dove': { draw: peaceDove, frames: 60, delay: 70, hold: 0 },
  'prayer-candle': { draw: prayerCandle, frames: 30, delay: 80, hold: 0 },
  sunrise: { draw: sunrise, frames: 48, delay: 70, hold: 1600 },
  'forever-heart': { draw: foreverHeart, frames: 48, delay: 60, hold: 0 },
  'gates-open': { draw: gatesOpen, frames: 44, delay: 70, hold: 1600 },
  generations: { draw: generations, frames: 48, delay: 70, hold: 1800 },
};

function render(svgText) {
  const img = new Resvg(svgText, { fitTo: { mode: 'width', value: W } }).render();
  return new Uint8Array(img.pixels);
}

mkdirSync(OUT, { recursive: true });
const only = process.argv[2];

// PREVIEW_DIR=some/folder → also save one PNG per GIF with 4 frames side by side, to check the drawings.
if (process.env.PREVIEW_DIR) {
  mkdirSync(process.env.PREVIEW_DIR, { recursive: true });
  for (const [name, g] of Object.entries(GIFS)) {
    if (only && only !== name) continue;
    const frames = [0.15, 0.4, 0.7, 1].map((t) => g.draw(g.hold ? t : t * 0.999).replace(/^<svg[^>]*>|<\/svg>$/g, ''));
    const sheet = `<svg xmlns="http://www.w3.org/2000/svg" width="${W * 4}" height="${H}">${frames
      .map((f, i) => `<svg x="${i * W}" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${f}</svg>`)
      .join('')}</svg>`;
    writeFileSync(join(process.env.PREVIEW_DIR, `${name}.png`), new Resvg(sheet).render().asPng());
  }
}

for (const [name, g] of Object.entries(GIFS)) {
  if (only && only !== name) continue;
  const gif = GIFEncoder();
  for (let i = 0; i < g.frames; i++) {
    // Looping animations use t in [0, 1); one-way animations end exactly at 1 and then hold.
    const t = g.hold ? i / (g.frames - 1) : i / g.frames;
    const rgba = render(g.draw(t));
    const palette = quantize(rgba, 256);
    const index = applyPalette(rgba, palette);
    const delay = i === g.frames - 1 && g.hold ? g.hold : g.delay;
    gif.writeFrame(index, W, H, { palette, delay, repeat: 0 });
  }
  gif.finish();
  const file = join(OUT, `${name}.gif`);
  writeFileSync(file, gif.bytes());
  console.log(`${name}.gif  ${(gif.bytes().length / 1024).toFixed(0)} KB`);
}
