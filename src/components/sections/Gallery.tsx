'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { GlassCard } from '../ui/GlassCard';
import { X } from 'lucide-react';

const PROJECTS = [
  {
    id: 'neural-convergence',
    title: 'Neural Convergence',
    category: 'CLOUD_ARCHITECTURE',
    year: '2024',
    image: '/gallery/535402715_122240866520212355_8124034634747307157_n 1.png',
    description: 'Visualizing the density of university cloud collaborations across Sri Lanka.',
    tech: ['Next.js', 'Firebase', 'Terraform'],
    span: 'lg:col-span-2 lg:row-span-2'
  },
  {
    id: 'data-nebula',
    title: 'Data Nebula',
    category: 'STUDENT_INNOVATION',
    year: '2024',
    image: '/gallery/535554370_122240866814212355_5298821791634180236_n 1.png',
    description: 'A study on the latent potential of student ideation in the cloud space.',
    tech: ['AWS Lambda', 'GCP Functions'],
    span: ''
  },
  {
    id: 'infinite-shard',
    title: 'Infinite Shard',
    category: 'PROCEDURAL_MAPPING',
    year: '2023',
    image: '/gallery/536284330_122240866082212355_6148099243555502993_n 1.png',
    description: 'Mapping the digital infrastructure of Beauty of Cloud 1.0.',
    tech: ['React', 'D3.js'],
    span: ''
  },
  {
    id: 'digital-monolith',
    title: 'Digital Monolith',
    category: 'STRUCTURAL_DESIGN',
    year: '2024',
    image: '/gallery/536502129_122240864120212355_2064198593439261121_n 1.png',
    description: 'The geometric foundation of our elite tech event branding.',
    tech: ['Framer Motion', 'Three.js'],
    span: 'lg:col-span-2 lg:row-span-1'
  },
  {
    id: 'cloud-pulse',
    title: 'Cloud Pulse',
    category: 'VIRTUAL_PRESENCE',
    year: '2024',
    image: '/gallery/537424474_122240865374212355_3166245579080254582_n 3.png',
    description: 'Real-time telemetry of delegate engagement across 7 universities.',
    tech: ['WebSockets', 'Go'],
    span: ''
  },
  {
    id: 'spectral-array',
    title: 'Spectral Array',
    category: 'LIGHT_DYNAMICS',
    year: '2024',
    image: '/gallery/537483229_122240864276212355_3196250950373039991_n 2.png',
    description: 'Exploring the spectrum of cloud solutions for social impact.',
    tech: ['GraphQL', 'Apollo'],
    span: ''
  },
  {
    id: 'vortex-core',
    title: 'Vortex Core',
    category: 'FLUID_LOGIC',
    year: '2024',
    image: '/gallery/538341720_122240863028212355_4189567101984455264_n 1.png',
    description: 'Simulating the flow of knowledge through the ideathon pipeline.',
    tech: ['Rust', 'WebAssembly'],
    span: 'lg:col-span-1'
  },
  {
    id: 'prism-void',
    title: 'Prism Void',
    category: 'ABSTRACT_VISION',
    year: '2024',
    image: '/gallery/fffff 2.png',
    description: 'Looking beyond the horizon of traditional computing into the serverless void.',
    tech: ['AI Engine', 'Python'],
    span: 'lg:col-span-1'
  }
];

export const Gallery: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<typeof PROJECTS[0] | null>(null);

  return (
    <section id="gallery" className="py-40 px-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-12">
          <div className="max-w-2xl">
            <span className="text-accent text-[12px] font-bold tracking-[0.5em] uppercase mb-10 block font-mono">02 // The Visual Intelligence</span>
            <h2 className="text-6xl md:text-[9rem] font-bold tracking-tighter uppercase leading-[0.75] mb-12">
              Our <br />
              <span className="text-outline italic">Memories.</span>
            </h2>
          </div>
          <p className="text-[11px] uppercase tracking-[0.4em] opacity-40 max-w-[300px] md:text-right leading-relaxed font-mono">
            Capturing the pulse of Sri Lanka's cloud revolution. Evolution from 1.0 to 2.0.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROJECTS.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className={`relative overflow-hidden group cursor-pointer bg-black aspect-[4/5] rounded-3xl border border-white/5 ${project.span}`}
              onClick={() => setSelectedProject(project)}
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col justify-end p-10">
                <p className="text-[10px] text-accent font-black tracking-[0.4em] mb-4 uppercase font-mono">
                  {project.category} // {project.year}
                </p>
                <h3 className="text-3xl font-black uppercase tracking-tighter leading-none">
                  {project.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Case Study Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-12 bg-black/95"
          >
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
                <p className="text-accent text-[11px] font-black tracking-[0.6em] uppercase mb-10 flex items-center gap-6">
                  <span className="w-16 h-[1px] bg-accent/40"></span>
                  Visual Snapshot // {selectedProject.year}
                </p>
                <h2 className="text-7xl md:text-[8rem] font-black uppercase tracking-tighter leading-[0.7] mb-16">
                  {selectedProject.title.split(' ')[0]} <br />
                  <span className="text-outline italic">{selectedProject.title.split(' ')[1] || ''}</span>
                </h2>
                <p className="text-2xl font-light opacity-60 uppercase leading-relaxed mb-16 font-mono">
                  {selectedProject.description}
                </p>

                <div className="grid grid-cols-2 gap-6 w-full mb-16">
                  <GlassCard className="p-8 border-white/5 bg-white/[0.01]">
                    <span className="text-[10px] uppercase tracking-[0.4em] opacity-40 block mb-6 font-mono">Tech Stack</span>
                    <div className="flex flex-wrap gap-3">
                      {selectedProject.tech.map(t => (
                        <span key={t} className="text-[10px] px-4 py-1.5 border border-white/10 rounded-full font-mono uppercase bg-white/5 text-white/80">{t}</span>
                      ))}
                    </div>
                  </GlassCard>
                  <GlassCard className="p-8 border-white/5 bg-white/[0.01]">
                    <span className="text-[10px] uppercase tracking-[0.4em] opacity-40 block mb-6 font-mono">Archive Code</span>
                    <p className="text-sm uppercase font-black tracking-widest font-mono">BOC-1.0-{selectedProject.id.slice(0, 3).toUpperCase()}</p>
                  </GlassCard>
                </div>

                <button className="px-16 py-6 bg-white text-black text-[12px] font-black uppercase tracking-[0.4em] hover:bg-accent hover:text-white transition-all duration-500 rounded-2xl glow-accent">
                  Back to Timeline
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
