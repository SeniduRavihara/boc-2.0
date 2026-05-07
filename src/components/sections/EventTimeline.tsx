'use client';

import React from 'react';
import { Zap, Cloud, Cpu, Network, Shield, Database } from 'lucide-react';

const SESSIONS = [
  { id: '01', time: '09:00 AM', title: 'AWS_IGNITE',    tag: 'CLOUD_CORE',  desc: 'Architecting serverless ecosystems and lambda-driven cloud rhythm at scale.', icon: Zap,      accent: '#3b82f6' },
  { id: '02', time: '10:30 AM', title: 'GCP_FLOW',      tag: 'DATA_OPS',    desc: 'Mastering BigQuery pipelines and visual data intelligence on Google Cloud.',  icon: Cloud,    accent: '#0ea5e9' },
  { id: '03', time: '12:00 PM', title: 'NEURAL_SYNC',   tag: 'AI_ML',       desc: 'Integrating generative AI models and latent space protocols into cloud infra.',icon: Cpu,     accent: '#6366f1' },
  { id: '04', time: '02:00 PM', title: 'HYPER_SCALE',   tag: 'INFRA',       desc: 'Scaling digital architecture across global multiverse nodes and edge networks.',icon: Network, accent: '#8b5cf6' },
  { id: '05', time: '03:30 PM', title: 'CYBER_SHIELD',  tag: 'SECURITY',    desc: 'Zero-trust cloud security audit systems and hardened node protocols.',         icon: Shield,   accent: '#0ea5e9' },
  { id: '06', time: '05:00 PM', title: 'ORCHESTRATE',   tag: 'OPERATIONS',  desc: 'Linking human logic with cloud randomness to achieve perfect system harmony.', icon: Database, accent: '#3b82f6' },
];

export function EventTimeline() {
  return (
    <div className="w-full h-full bg-[#050812] flex flex-col justify-center relative overflow-hidden px-8 md:px-20">
      {/* Header Overlay */}
      <div className="absolute top-10 left-12 z-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse block" />
          <span className="font-mono text-[10px] tracking-[0.5em] uppercase text-blue-500">
            Event Schedule // Cloud Series 2025
          </span>
        </div>
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] text-white">
          Event<br /><span className="text-blue-500">Timeline</span>
        </h2>
      </div>

      {/* Horizontal Scroll Area (Auto-scrolling or draggable in the portal) */}
      <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-10 pt-32">
        {SESSIONS.map((s, i) => {
          const Icon = s.icon;
          return (
            <React.Fragment key={s.id}>
              {/* Card */}
              <div className="flex-shrink-0 w-[280px] md:w-[320px] h-[380px] md:h-[420px] rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 flex flex-col relative overflow-hidden group hover:border-white/20 hover:bg-white/[0.04] transition-all duration-500">
                <div
                  className="absolute bottom-[-40px] right-[-40px] w-[150px] h-[150px] rounded-full opacity-0 group-hover:opacity-15 transition-opacity duration-500 blur-[60px]"
                  style={{ background: s.accent }}
                />
                <div className="font-mono text-[11px] tracking-[0.4em] text-white/20 mb-auto">// {s.id}</div>
                <div className="font-mono text-[11px] tracking-[0.2em] text-white/30 mb-6">{s.time}</div>
                <div
                  className="w-12 h-12 rounded-[14px] flex items-center justify-center mb-5"
                  style={{ background: `${s.accent}1a` }}
                >
                  <Icon className="w-5 h-5" style={{ color: s.accent }} />
                </div>
                <div
                  className="font-mono text-[9px] tracking-[0.4em] uppercase mb-2"
                  style={{ color: s.accent }}
                >
                  {s.tag}
                </div>
                <div className="text-xl md:text-2xl font-black uppercase tracking-tight text-white mb-3 leading-none">
                  {s.title}
                </div>
                <div className="text-xs text-white/35 leading-relaxed tracking-wide font-mono">
                  {s.desc}
                </div>
              </div>

              {/* Connector */}
              {i < SESSIONS.length - 1 && (
                <div className="flex-shrink-0 w-10 h-px bg-white/[0.06]" />
              )}
            </React.Fragment>
          );
        })}

        {/* Prize Pool Transition */}
        <div className="flex-shrink-0 w-16 h-px" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.06), rgba(245,158,11,0.4))' }} />

        {/* Prize Pool Card */}
        <div className="flex-shrink-0 w-[400px] md:w-[480px] h-[380px] md:h-[420px] rounded-2xl border border-amber-500/30 bg-amber-500/[0.03] p-10 flex flex-col relative overflow-hidden">
          <div className="absolute top-[-60px] right-[-60px] w-[200px] h-[200px] rounded-full bg-amber-500 blur-[80px] opacity-[0.08]" />
          
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse block" />
            <span className="font-mono text-[10px] tracking-[0.5em] uppercase text-amber-500">
              Grand_Finale // Ideathon
            </span>
          </div>

          <div className="text-4xl md:text-5xl font-black uppercase tracking-[-0.04em] text-white leading-[0.9] mb-8">
            Prize<br /><span className="text-amber-500">Pool</span>
          </div>

          <div className="flex items-end gap-3 flex-1">
            <div className="flex-1 rounded-2xl bg-slate-400/[0.06] border border-slate-400/15 p-4 flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-400 flex items-center justify-center text-black font-black text-sm">2</div>
              <div className="font-black text-slate-400 text-lg leading-none">Rs.20K</div>
            </div>
            <div className="flex-1 rounded-2xl bg-amber-500/[0.12] border border-amber-500/30 p-4 flex flex-col items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-black font-black text-sm">1</div>
              <div className="font-black text-amber-500 text-lg leading-none">Rs.30K</div>
            </div>
            <div className="flex-1 rounded-2xl bg-orange-700/[0.10] border border-orange-700/25 p-4 flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-700 flex items-center justify-center text-white font-black text-sm">3</div>
              <div className="font-black text-orange-700 text-lg leading-none">Rs.10K</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
