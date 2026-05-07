'use client';

import React from 'react';
import Image from 'next/image';

const TEAM_DATA = {
  executives: [
    { name: 'Rusira Sandul',        role: 'Event Co-Chair', image: 'https://i.pravatar.cc/400?u=rusira' },
    { name: 'Manuja Wimalarathne',  role: 'Event Co-Chair', image: 'https://i.pravatar.cc/400?u=manuja' },
  ],
  categories: [
    {
      title:   'Programming & Web',
      accent:  '#3b82f6',
      lead:    { name: 'Lead Dev',          image: 'https://i.pravatar.cc/200?u=dev' },
      members: Array.from({ length: 8 }).map((_, i) => `https://i.pravatar.cc/80?u=dev${i}`),
    },
    {
      title:   'Design & Marketing',
      accent:  '#8b5cf6',
      lead:    { name: 'Lead Designer',     image: 'https://i.pravatar.cc/200?u=design' },
      members: Array.from({ length: 8 }).map((_, i) => `https://i.pravatar.cc/80?u=design${i}`),
    },
    {
      title:   'Logistics',
      accent:  '#0ea5e9',
      lead:    { name: 'Logistics Lead',    image: 'https://i.pravatar.cc/200?u=logistics' },
      members: Array.from({ length: 8 }).map((_, i) => `https://i.pravatar.cc/80?u=logistics${i}`),
    },
    {
      title:   'Industry Relations',
      accent:  '#10b981',
      lead:    { name: 'Relations Lead',    image: 'https://i.pravatar.cc/200?u=relations' },
      members: Array.from({ length: 8 }).map((_, i) => `https://i.pravatar.cc/80?u=relations${i}`),
    },
  ],
};

/* ─── Category card ─────────────────────────────────────────────────────── */
const CategoryCard: React.FC<{ cat: typeof TEAM_DATA.categories[0] }> = ({ cat }) => (
  <div
    className="flex flex-col gap-3 p-4 rounded-2xl border border-white/[0.07] bg-white/[0.02]"
    style={{ '--accent': cat.accent } as React.CSSProperties}
  >
    {/* Lead */}
    <div className="flex items-center gap-3">
      <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 shrink-0"
           style={{ borderColor: `${cat.accent}60` }}>
        <Image src={cat.lead.image} alt={cat.lead.name} fill sizes="40px" className="object-cover" />
      </div>
      <div>
        <p className="text-white text-xs font-bold leading-none mb-0.5">{cat.lead.name}</p>
        <p className="font-mono text-[9px] uppercase tracking-widest" style={{ color: cat.accent }}>
          {cat.title}
        </p>
      </div>
    </div>

    {/* Member avatars — overlap stack */}
    <div className="flex flex-wrap gap-1">
      {cat.members.map((src, i) => (
        <div
          key={i}
          className="relative w-7 h-7 rounded-full overflow-hidden border border-black"
          style={{ zIndex: cat.members.length - i }}
        >
          <Image
            src={src}
            alt=""
            fill
            sizes="28px"
            className="object-cover grayscale opacity-60"
            // Only load images that are in the viewport (lazy by default in Next.js)
            loading="lazy"
          />
        </div>
      ))}
    </div>
  </div>
);

/* ─── Executive card ────────────────────────────────────────────────────── */
const ExecCard: React.FC<{ exec: typeof TEAM_DATA.executives[0] }> = ({ exec }) => (
  <div className="flex flex-col items-center gap-3">
    <div className="relative w-20 h-24 sm:w-28 sm:h-32 rounded-2xl overflow-hidden border border-white/10">
      <Image
        src={exec.image}
        alt={exec.name}
        fill
        sizes="(max-width:640px) 80px, 112px"
        className="object-cover grayscale"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050812]/80 to-transparent" />
    </div>
    <div className="text-center">
      <p className="text-white font-bold text-sm leading-tight">{exec.name}</p>
      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-blue-400 mt-0.5">{exec.role}</p>
    </div>
  </div>
);

/* ─── Main component ────────────────────────────────────────────────────── */
export const Team: React.FC = () => (
  <section
    id="team"
    className="
      w-full h-full bg-[#050812]
      flex flex-col justify-start
      overflow-y-auto overflow-x-hidden
      px-4 sm:px-8 md:px-12
      /* top padding keeps content below any header */
      pt-10 pb-8
    "
  >
    {/* ── Heading ── */}
    <div className="mb-6 shrink-0">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
        <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-blue-500">
          People // Core Team
        </span>
      </div>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter text-white leading-none">
        Our <span className="text-blue-500">Team</span>
      </h2>
    </div>

    {/* ── Co-Chairs ── */}
    <div className="flex justify-center gap-8 sm:gap-12 mb-6 shrink-0">
      {TEAM_DATA.executives.map((e, i) => <ExecCard key={i} exec={e} />)}
    </div>

    {/* ── Divider ── */}
    <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6 shrink-0" />

    {/* ── Department grid
         Mobile  : 1 col  (full width cards)
         Tablet  : 2 cols
         Desktop : 4 cols
    ── */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {TEAM_DATA.categories.map((cat, i) => (
        <CategoryCard key={i} cat={cat} />
      ))}
    </div>
  </section>
);