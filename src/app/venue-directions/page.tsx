import Link from 'next/link';
import { ArrowLeft, ExternalLink, MapPin } from 'lucide-react';
import venueDirections from '@/data/venue-directions.json';
import { VenueDirectionCard } from '@/components/venue/VenueDirectionCard';
import { VenueMapEmbed } from '@/components/venue/VenueMapEmbed';
import type { VenueDirectionsData } from '@/types/venue-directions';
import MainFooter from '@/components/layout/MainFooter';

const data = venueDirections as VenueDirectionsData;

export const metadata = {
  title: 'Venue Directions | Beauty of Cloud 2.0',
  description: 'Step-by-step directions from the main entrance to the session conducting hall.',
};

export default function VenueDirectionsPage() {
  const sortedSteps = [...data.steps].sort((a, b) => a.order - b.order);

  return (
    <main className="min-h-screen bg-[#020617] text-white font-sans">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-indigo-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-6 md:py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-mono uppercase tracking-widest mb-6 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-2 text-white">
            {data.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-slate-300">
              <MapPin size={13} className="text-blue-500 shrink-0" />
              <span>{data.map.buildingName}</span>
            </span>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <a
              href={data.map.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
            >
              Open in Google Maps
              <ExternalLink size={12} />
            </a>
          </div>
        </header>

        {/* Building map */}
        <section className="mb-8 md:mb-12">
          <div className="rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/30 h-[500px] sm:h-auto sm:aspect-[16/10] md:aspect-[21/9] w-full bg-[#0f172a]">
            <VenueMapEmbed map={data.map} steps={sortedSteps} />
          </div>
        </section>

        {/* Step-by-step cards */}
        <section aria-labelledby="directions-heading">
          <h2 id="directions-heading" className="text-xl font-black uppercase tracking-tight text-white mb-2">
            Step-by-step directions
          </h2>
          <p className="text-slate-500 text-sm mb-8">
            Start at the main entrance and follow each landmark in order.
          </p>
          <ol className="list-none p-0 m-0">
            {sortedSteps.map((step, index) => (
              <VenueDirectionCard
                key={step.id}
                step={step}
                isLast={index === sortedSteps.length - 1}
              />
            ))}
          </ol>
        </section>
      </div>
      <MainFooter />
    </main>
  );
}
