'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { Cloud, Zap, Shield, Database, Cpu, Network } from 'lucide-react';

const SESSIONS = [
  {
    id: 1,
    title: "Serverless Frontiers",
    platform: "AWS",
    icon: <Zap className="w-8 h-8 text-aws" />,
    time: "09:00 AM",
    description: "Architecting global-scale apps with Lambda and Fargate.",
    size: "large",
    gradient: "from-aws/20 to-transparent"
  },
  {
    id: 2,
    title: "BigQuery Mastery",
    platform: "GCP",
    icon: <Database className="w-6 h-6 text-gcp" />,
    time: "10:30 AM",
    description: "Unlocking petabyte-scale data insights.",
    size: "small",
    gradient: "from-gcp/20 to-transparent"
  },
  {
    id: 3,
    title: "Kubernetes Ops",
    platform: "GCP",
    icon: <Cpu className="w-6 h-6 text-gcp" />,
    time: "12:00 PM",
    description: "Production-grade GKE orchestration.",
    size: "small",
    gradient: "from-gcp/20 to-transparent"
  },
  {
    id: 4,
    title: "Zero Trust Cloud",
    platform: "Cloud",
    icon: <Shield className="w-8 h-8 text-white" />,
    time: "01:30 PM",
    description: "Unified security in a multi-cloud world.",
    size: "medium",
    gradient: "from-white/10 to-transparent"
  },
  {
    id: 5,
    title: "S3 Intelligence",
    platform: "AWS",
    icon: <Cloud className="w-6 h-6 text-aws" />,
    time: "03:00 PM",
    description: "Next-gen storage patterns.",
    size: "small",
    gradient: "from-aws/20 to-transparent"
  },
  {
    id: 6,
    title: "Edge Compute",
    platform: "Network",
    icon: <Network className="w-6 h-6 text-accent" />,
    time: "04:30 PM",
    description: "Reducing latency to the speed of light.",
    size: "medium",
    gradient: "from-accent/20 to-transparent"
  }
];

export const BentoSchedule: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-7xl mx-auto px-6">
      {SESSIONS.map((session, index) => (
        <motion.div
          key={session.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className={`${
            session.size === 'large' ? 'md:col-span-2 md:row-span-2' : 
            session.size === 'medium' ? 'md:col-span-2' : ''
          }`}
        >
          <GlassCard 
            hover 
            variant="dark"
            className={`h-full relative p-8 flex flex-col justify-between group overflow-hidden border-white/5`}
          >
            {/* Background Gradient Glow */}
            <div className={`absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br ${session.gradient} blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity duration-700`} />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  {session.icon}
                </div>
                <span className="text-[10px] tracking-[0.3em] font-mono text-white/40 uppercase">
                  {session.platform} // {session.time}
                </span>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold tracking-tighter uppercase mb-4 leading-none">
                {session.title}
              </h3>
              <p className="text-sm text-white/50 leading-relaxed uppercase max-w-xs transition-colors group-hover:text-white/80">
                {session.description}
              </p>
            </div>

            <div className="mt-8 flex items-center gap-2 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
              <span className="text-[10px] font-bold tracking-widest uppercase text-accent">Explore Session</span>
              <div className="h-[1px] w-12 bg-accent/40" />
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
};
