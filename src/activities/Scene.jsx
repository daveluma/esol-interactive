import React from 'react';

// Draws a simple piece of furniture with objects in / on / under it.
// Each furniture type lists the places it supports and where objects sit (x center, y baseline).

const WOOD = 'var(--wood)';
const WOOD_DARK = 'var(--wood-dark)';
const METAL = 'var(--metal)';
const INSIDE = 'var(--inside)';

export const FURNITURE = {
  table: {
    label: 'table',
    slots: { on: [160, 97], under: [160, 196] },
    draw: () => (
      <>
        <rect x="40" y="100" width="240" height="14" rx="3" fill={WOOD} />
        <rect x="56" y="114" width="12" height="86" fill={WOOD_DARK} />
        <rect x="252" y="114" width="12" height="86" fill={WOOD_DARK} />
      </>
    ),
  },
  desk: {
    label: 'desk',
    slots: { on: [160, 97], under: [125, 196] },
    draw: () => (
      <>
        <rect x="40" y="100" width="240" height="14" rx="3" fill={WOOD} />
        <rect x="56" y="114" width="12" height="86" fill={WOOD_DARK} />
        <rect x="200" y="114" width="72" height="86" fill={WOOD_DARK} />
        <rect x="208" y="124" width="56" height="30" rx="2" fill={WOOD} />
        <rect x="208" y="160" width="56" height="30" rx="2" fill={WOOD} />
        <rect x="228" y="136" width="16" height="4" rx="2" fill={METAL} />
        <rect x="228" y="172" width="16" height="4" rx="2" fill={METAL} />
      </>
    ),
  },
  chair: {
    label: 'chair',
    slots: { on: [172, 127], under: [168, 196] },
    draw: () => (
      <>
        <rect x="110" y="40" width="14" height="100" rx="3" fill={WOOD_DARK} />
        <rect x="110" y="130" width="120" height="12" rx="3" fill={WOOD} />
        <rect x="114" y="142" width="10" height="58" fill={WOOD_DARK} />
        <rect x="216" y="142" width="10" height="58" fill={WOOD_DARK} />
      </>
    ),
  },
  shelf: {
    label: 'shelf',
    slots: { on: [160, 77], under: [160, 150] },
    draw: () => (
      <>
        <rect x="0" y="0" width="320" height="200" fill="var(--wall)" />
        <rect x="70" y="80" width="180" height="10" rx="2" fill={WOOD} />
        <path d="M90 90 L90 110 L110 90 Z M230 90 L230 110 L210 90 Z" fill={WOOD_DARK} />
      </>
    ),
  },
  cabinet: {
    label: 'cabinet',
    slots: { on: [160, 37], in: [160, 150] },
    draw: (place) => (
      <>
        <rect x="95" y="40" width="130" height="160" rx="4" fill={WOOD_DARK} />
        {place === 'in' ? (
          <>
            <rect x="103" y="50" width="114" height="140" fill={INSIDE} />
            <rect x="103" y="118" width="114" height="5" fill={WOOD_DARK} />
            <path d="M95 44 L70 54 L70 196 L95 200 Z" fill={WOOD} />
            <path d="M225 44 L250 54 L250 196 L225 200 Z" fill={WOOD} />
          </>
        ) : (
          <>
            <rect x="103" y="50" width="54" height="140" fill={WOOD} />
            <rect x="163" y="50" width="54" height="140" fill={WOOD} />
            <circle cx="150" cy="120" r="3" fill={METAL} />
            <circle cx="170" cy="120" r="3" fill={METAL} />
          </>
        )}
      </>
    ),
  },
  drawer: {
    label: 'drawer',
    slots: { in: [160, 120] },
    draw: () => (
      <>
        <rect x="90" y="60" width="140" height="140" rx="4" fill={WOOD_DARK} />
        <rect x="64" y="96" width="192" height="40" fill={INSIDE} />
        <rect x="64" y="122" width="192" height="26" rx="2" fill={WOOD} />
        <rect x="146" y="132" width="28" height="5" rx="2" fill={METAL} />
        <rect x="98" y="160" width="124" height="30" rx="2" fill={WOOD} />
      </>
    ),
    front: () => <rect x="64" y="122" width="192" height="26" rx="2" fill={WOOD} />,
  },
  box: {
    label: 'box',
    slots: { in: [160, 162], on: [160, 107] },
    draw: (place) => (
      <>
        <rect x="100" y="110" width="120" height="90" fill="var(--cardboard-dark)" />
        {place === 'in' && (
          <path d="M100 110 L80 92 L140 92 L150 110 Z M220 110 L240 92 L180 92 L170 110 Z" fill="var(--cardboard)" />
        )}
      </>
    ),
    front: (place) => (place === 'in' ? <rect x="100" y="140" width="120" height="60" fill="var(--cardboard)" /> : null),
  },
  bag: {
    label: 'bag',
    slots: { in: [160, 152], on: [160, 107] },
    draw: () => (
      <>
        <path d="M130 110 Q130 70 160 70 Q190 70 190 110" stroke="var(--bag-dark)" strokeWidth="8" fill="none" />
        <rect x="100" y="110" width="120" height="90" rx="14" fill="var(--bag-dark)" />
      </>
    ),
    front: (place) => (place === 'in' ? <rect x="100" y="132" width="120" height="68" rx="14" fill="var(--bag)" /> : null),
  },
  wall: {
    label: 'wall',
    slots: { on: [160, 112] },
    draw: () => <rect x="0" y="0" width="320" height="200" fill="var(--wall)" />,
  },
};

export default function Scene({ furniture, place, emoji, count = 1, label }) {
  const f = FURNITURE[furniture];
  const [cx, baseline] = f.slots[place];
  const n = Math.min(count, 4);
  const size = n > 2 ? 30 : 36;
  const xs = Array.from({ length: n }, (_, i) => cx + (i - (n - 1) / 2) * (size * 0.9));

  return (
    <svg className="scene" viewBox="0 0 320 210" role="img" aria-label={label}>
      <rect x="0" y="200" width="320" height="10" fill="var(--floor)" />
      {f.draw(place)}
      {xs.map((x, i) => (
        <text key={i} x={x} y={baseline} fontSize={size} textAnchor="middle">
          {emoji}
        </text>
      ))}
      {f.front?.(place)}
    </svg>
  );
}
