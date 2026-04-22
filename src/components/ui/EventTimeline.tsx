'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GlassCard } from './GlassCard';
import { Zap, Cloud, Cpu, Database, Shield, Network, Trophy } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const SESSIONS = [
  {
    phase: "PHASE_01",
    title: "Serverless Frontiers",
    platform: "AWS",
    icon: <Zap className="w-10 h-10 text-aws" />,
    time: "OCT 12 / 09:00 AM",
    description: "Architecting global-scale apps with Lambda and Fargate.",
    glow: "aws"
  },
  {
    phase: "PHASE_02",
    title: "BigQuery Mastery",
    platform: "GCP",
    icon: <Database className="w-8 h-8 text-gcp" />,
    time: "OCT 12 / 10:30 AM",
    description: "Unlocking petabyte-scale data insights at speed.",
    glow: "gcp"
  },
  {
    phase: "PHASE_03",
    title: "Kubernetes Ops",
    platform: "GCP",
    icon: <Cpu className="w-8 h-8 text-gcp" />,
    time: "OCT 12 / 12:00 PM",
    description: "Production-grade GKE orchestration and management.",
    glow: "gcp"
  },
  {
    phase: "PHASE_04",
    title: "Zero Trust Cloud",
    platform: "SECURITY",
    icon: <Shield className="w-10 h-10 text-white" />,
    time: "OCT 12 / 01:30 PM",
    description: "Unified security in a multi-cloud serverless world.",
    glow: "white"
  },
  {
    phase: "PHASE_05",
    title: "S3 Intelligence",
    platform: "AWS",
    icon: <Cloud className="w-8 h-8 text-aws" />,
    time: "OCT 12 / 03:00 PM",
    description: "Next-gen storage patterns and automated lifecycle.",
    glow: "aws"
  },
  {
    phase: "PHASE_06",
    title: "Edge Compute",
    platform: "NETWORK",
    icon: <Network className="w-8 h-8 text-accent" />,
    time: "OCT 12 / 04:30 PM",
    description: "Reducing latency to the speed of light with Edge functions.",
    glow: "accent"
  }
];

export const EventTimeline: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const trigger = triggerRef.current;

    if (!section || !trigger) return;

    const pin = gsap.fromTo(
      section,
      { x: 0 },
      {
        x: '-300vw',
        ease: 'none',
        scrollTrigger: {
          trigger: trigger,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: '+=4000',
          invalidateOnRefresh: true,
        },
      }
    );

    return () => {
      pin.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={triggerRef} className="overflow-hidden bg-background">
      <div ref={sectionRef} className="flex h-screen w-[400vw] relative items-center">
        
        {/* Intro Slide */}
        <div className="w-screen h-full flex flex-col justify-center px-12 md:px-32 shrink-0">
          <div className="max-w-4xl">
            <span className="text-accent text-[12px] font-black tracking-[0.8em] uppercase mb-12 block font-mono">
              03 // THE MISSION_ROADMAP
            </span>
            <h2 className="text-7xl md:text-[12rem] font-bold tracking-tighter uppercase leading-[0.75] mb-12">
              Event <br />
              <span className="text-outline italic">Timeline.</span>
            </h2>
            <div className="flex items-center gap-8 opacity-40">
              <div className="h-[1px] w-24 bg-white" />
              <p className="text-sm uppercase tracking-widest font-mono">Scroll to navigate the digital journey</p>
            </div>
          </div>
        </div>

        {/* Sessions Slides */}
        {SESSIONS.map((session, index) => (
          <div key={index} className="w-[50vw] h-full flex items-center justify-center shrink-0 px-8">
            <GlassCard 
              variant="dark"
              className="w-full aspect-square md:aspect-video flex flex-col justify-between p-12 relative group hyper-border overflow-hidden"
            >
              <div className={`absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br ${
                session.glow === 'aws' ? 'from-aws/20' : session.glow === 'gcp' ? 'from-gcp/20' : 'from-white/10'
              } to-transparent blur-[80px] opacity-40 transition-opacity duration-700 group-hover:opacity-60`} />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-12">
                  <div className={`p-5 rounded-2xl bg-white/5 border border-white/10 transition-all duration-500 group-hover:border-white/20 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]`}>
                    {session.icon}
                  </div>
                  <div className="text-right">
                    <span className="text-accent text-[11px] font-black tracking-[0.4em] uppercase block mb-2 font-mono">
                      {session.phase}
                    </span>
                    <span className="text-white/40 text-[10px] font-bold tracking-widest uppercase font-mono">
                      {session.time}
                    </span>
                  </div>
                </div>

                <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 group-hover:text-white transition-colors">
                  {session.title}
                </h3>
                <p className="text-sm md:text-xl text-white/50 leading-relaxed uppercase max-w-lg transition-colors group-hover:text-white/80 font-mono">
                  {session.description}
                </p>
              </div>

              <div className="mt-8 flex items-center gap-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                <div className="h-[2px] w-12 bg-accent/40" />
                <span className="text-[10px] font-black tracking-widest uppercase text-accent font-mono">ACTIVE_PHASE</span>
              </div>
            </GlassCard>
          </div>
        ))}

        {/* Finale Transition Slide */}
        <div className="w-screen h-full flex flex-col justify-center px-12 md:px-32 shrink-0 relative overflow-hidden bg-gradient-to-r from-transparent via-aws/5 to-transparent">
          <div className="max-w-4xl relative z-10">
            <span className="text-accent text-[12px] font-black tracking-[1em] uppercase mb-12 block font-mono">
              THE_JOURNEY_CONTINUES
            </span>
            <h2 className="text-7xl md:text-[12rem] font-bold tracking-tighter uppercase leading-[0.75] mb-8">
              Initiate <br />
              <span className="text-outline italic">Finale.</span>
            </h2>
            <div className="flex items-center gap-8 opacity-40">
              <div className="h-[1px] w-24 bg-white" />
              <p className="text-sm uppercase tracking-widest font-mono">Scroll for Competition Details & Rewards</p>
            </div>
          </div>
        </div>

      </div>

      {/* Persistent Character Overlay (ASCII Texture) */}
      <div className="fixed bottom-10 left-10 text-[8px] font-mono opacity-10 pointer-events-none select-none z-[50]">
        TIMESTAMP // 2026.04.17.10.41 <br />
        PROTOCOL // BOC_2.0_ELITE <br />
        COORDINATES // 6.9271 N, 79.8612 E
      </div>
    </section>
  );
};
