import Link from 'next/link';
import { ArrowLeft, ExternalLink, MapPin } from 'lucide-react';
import venueDirections from '@/data/venue-directions.json';
import { VenueDirectionCard } from '@/components/venue/VenueDirectionCard';
import { VenueMapEmbed } from '@/components/venue/VenueMapEmbed';
import type { VenueDirectionsData } from '@/types/venue-directions';

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

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10 md:py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-mono uppercase tracking-widest mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <header className="mb-10 md:mb-14">
          <span className="text-blue-400 font-mono text-xs tracking-[0.4em] uppercase font-bold">
            On-site navigation
          </span>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mt-3 mb-4">
            {data.title}
          </h1>
          <p className="text-slate-400 max-w-2xl text-sm md:text-base leading-relaxed">{data.subtitle}</p>
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 text-sm">
            <MapPin className="w-4 h-4 shrink-0" />
            <span>
              Destination: <strong className="text-white">{data.destination.name}</strong>
            </span>
          </div>
          <p className="mt-2 text-slate-500 text-sm">{data.destination.description}</p>
        </header>

        {/* Building map */}
        <section className="mb-12 md:mb-16" aria-labelledby="venue-map-heading">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-4">
            <div>
              <h2 id="venue-map-heading" className="text-xl font-black uppercase tracking-tight text-white">
                Building location
              </h2>
              <p className="text-slate-400 text-sm mt-1">{data.map.buildingName}</p>
              <p className="text-slate-500 text-xs mt-0.5">{data.map.address}</p>
            </div>
            <a
              href={data.map.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors shrink-0"
            >
              Open in Google Maps
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/30 aspect-[16/10] md:aspect-[21/9] bg-[#0f172a]">
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
    </main>
  );
}
