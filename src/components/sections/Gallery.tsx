'use client';

import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { GlassCard } from '../ui/GlassCard';
import { X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  {
    id: 'neural-convergence',
    title: 'Neural Convergence',
    category: 'CLOUD_ARCHITECTURE',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop',
    description: 'Visualizing the density of university cloud collaborations across Sri Lanka.',
    tech: ['Next.js', 'Firebase', 'Terraform'],
    span: 'lg:col-span-2 lg:row-span-2'
  },
  {
    id: 'data-nebula',
    title: 'Data Nebula',
    category: 'STUDENT_INNOVATION',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?q=80&w=1000&auto=format&fit=crop',
    description: 'A study on the latent potential of student ideation in the cloud space.',
    tech: ['AWS Lambda', 'GCP Functions'],
    span: ''
  },
  {
    id: 'infinite-shard',
    title: 'Infinite Shard',
    category: 'PROCEDURAL_MAPPING',
    year: '2023',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop',
    description: 'Mapping the digital infrastructure of Beauty of Cloud 1.0.',
    tech: ['React', 'D3.js'],
    span: ''
  },
  {
    id: 'digital-monolith',
    title: 'Digital Monolith',
    category: 'STRUCTURAL_DESIGN',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1000&auto=format&fit=crop',
    description: 'The geometric foundation of our elite tech event branding.',
    tech: ['Framer Motion', 'Three.js'],
    span: 'lg:col-span-2 lg:row-span-1'
  },
  {
    id: 'cloud-pulse',
    title: 'Cloud Pulse',
    category: 'VIRTUAL_PRESENCE',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop',
    description: 'Real-time telemetry of delegate engagement across 7 universities.',
    tech: ['WebSockets', 'Go'],
    span: ''
  },
  {
    id: 'spectral-array',
    title: 'Spectral Array',
    category: 'LIGHT_DYNAMICS',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1000&auto=format&fit=crop',
    description: 'Exploring the spectrum of cloud solutions for social impact.',
    tech: ['GraphQL', 'Apollo'],
    span: ''
  },
  {
    id: 'vortex-core',
    title: 'Vortex Core',
    category: 'FLUID_LOGIC',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
    description: 'Simulating the flow of knowledge through the ideathon pipeline.',
    tech: ['Rust', 'WebAssembly'],
    span: 'lg:col-span-1'
  },
  {
    id: 'prism-void',
    title: 'Prism Void',
    category: 'ABSTRACT_VISION',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop',
    description: 'Looking beyond the horizon of traditional computing into the serverless void.',
    tech: ['AI Engine', 'Python'],
    span: 'lg:col-span-1'
  }
];

export const Gallery: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<typeof PROJECTS[0] | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Reveal grid items on scroll
    const items = gridRef.current?.children;
    if (items) {
      gsap.fromTo(items, 
        { opacity: 0, scale: 0.95 },
        { 
          opacity: 1, scale: 1,
          duration: 0.6,
          stagger: 0.05,
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 80%',
            once: true
          }
        }
      );
    }
  }, { scope: containerRef });

  return (
    <section id="gallery" ref={containerRef} className="py-40 px-6 bg-[#050812]">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-12">
          <div className="max-w-2xl">
            <span className="text-blue-500 text-[12px] font-bold tracking-[0.5em] uppercase mb-10 block font-mono">02 // The Visual Intelligence</span>
            <h2 className="text-6xl md:text-[9rem] font-bold tracking-tighter uppercase leading-[0.75] mb-12">
              Our <br />
              <span className="text-outline italic">Memories.</span>
            </h2>
          </div>
          <p className="text-[11px] uppercase tracking-[0.4em] opacity-40 max-w-[300px] md:text-right leading-relaxed font-mono text-white">
            Capturing the pulse of Sri Lanka&apos;s cloud revolution. Evolution from 1.0 to 2.0.
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROJECTS.map((project) => (
            <div
              key={project.id}
              className={`relative overflow-hidden group cursor-pointer bg-black aspect-[4/5] rounded-3xl border border-white/5 ${project.span} transition-all duration-500 hover:border-white/20`}
              onClick={() => setSelectedProject(project)}
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col justify-end p-10">
                <p className="text-[10px] text-blue-400 font-black tracking-[0.4em] mb-4 uppercase font-mono">
                  {project.category} // {project.year}
                </p>
                <h3 className="text-3xl font-black uppercase tracking-tighter leading-none text-white">
                  {project.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Case Study Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-12 bg-black/95 transition-opacity duration-300">
          <button 
            onClick={() => setSelectedProject(null)}
            className="absolute top-10 right-10 text-white/40 hover:text-white transition-colors z-[2010]"
          >
            <X className="w-12 h-12" />
          </button>

          <div className="container max-w-7xl h-full flex flex-col md:flex-row gap-16 items-center overflow-y-auto custom-scrollbar py-24 px-6">
            <div className="relative w-full md:w-1/2 aspect-[4/5] shrink-0 rounded-3xl overflow-hidden border border-white/10">
              <Image
                src={selectedProject.image}
                alt={selectedProject.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="w-full md:w-1/2 flex flex-col items-start">
              <p className="text-blue-400 text-[11px] font-black tracking-[0.6em] uppercase mb-10 flex items-center gap-6">
                <span className="w-16 h-[1px] bg-blue-400/40"></span>
                Visual Snapshot // {selectedProject.year}
              </p>
              <h2 className="text-7xl md:text-[8rem] font-black uppercase tracking-tighter leading-[0.7] mb-16 text-white">
                {selectedProject.title.split(' ')[0]} <br />
                <span className="text-outline italic">{selectedProject.title.split(' ')[1] || ''}</span>
              </h2>
              <p className="text-2xl font-light opacity-60 uppercase leading-relaxed mb-16 font-mono text-white">
                {selectedProject.description}
              </p>

              <div className="grid grid-cols-2 gap-6 w-full mb-16">
                <GlassCard className="p-8 border-white/5 bg-white/[0.01]">
                  <span className="text-[10px] uppercase tracking-[0.4em] opacity-40 block mb-6 font-mono text-white">Tech Stack</span>
                  <div className="flex flex-wrap gap-3">
                    {selectedProject.tech.map(t => (
                      <span key={t} className="text-[10px] px-4 py-1.5 border border-white/10 rounded-full font-mono uppercase bg-white/5 text-white/80">{t}</span>
                    ))}
                  </div>
                </GlassCard>
                <GlassCard className="p-8 border-white/5 bg-white/[0.01]">
                  <span className="text-[10px] uppercase tracking-[0.4em] opacity-40 block mb-6 font-mono text-white">Archive Code</span>
                  <p className="text-sm uppercase font-black tracking-widest font-mono text-white">BOC-1.0-{selectedProject.id.slice(0, 3).toUpperCase()}</p>
                </GlassCard>
              </div>

              <button 
                onClick={() => setSelectedProject(null)}
                className="px-16 py-6 bg-white text-black text-[12px] font-black uppercase tracking-[0.4em] hover:bg-blue-500 hover:text-white transition-all duration-500 rounded-2xl glow-accent"
              >
                Back to Timeline
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
