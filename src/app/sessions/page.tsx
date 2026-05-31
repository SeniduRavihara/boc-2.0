"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Calendar, Clock, Video, User, ArrowLeft } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Header } from '@/components/layout/Header';
import MainFooter from '@/components/layout/MainFooter';

// Video placeholder
const currentSession = {
  id: 1,
  title: "Getting Into the Cloud with AWS – Workshop Series | Session 01",
  description: "Step into the world of cloud computing with AWS in the first session of the workshop series. This session provides a clear and beginner-friendly introduction to AWS fundamentals, helping participants build the knowledge needed to confidently explore cloud technologies and stay ahead throughout the series.",
  speaker: "Mr. Tharindu Kalhara",
  date: "April 26, 2026",
  duration: "2h 20m 24s",
  videoId: "HyHeBfZtIzg", // Placeholder YouTube ID
};

export default function PastSessionsPage() {
  return (
    <main className="min-h-screen bg-[#050812] flex flex-col relative overflow-hidden">
      {/* <Header /> */}

      {/* Background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] bg-blue-500/10 rounded-full blur-[120px] mix-blend-screen opacity-50" />
        <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] bg-purple-500/10 rounded-full blur-[120px] mix-blend-screen opacity-30" />
      </div>

      <div className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 pt-10 pb-24 relative z-10 flex flex-col gap-16">
        {/* Header Section */}
        <div className="flex flex-col gap-4">
          <Link href="/">
            <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-mono uppercase tracking-widest mb-4 group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </button>
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase"
          >
            Past <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Sessions</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 max-w-2xl text-sm md:text-base leading-relaxed"
          >
            Missed a live session? Catch up on all the workshops, keynotes, and technical deep-dives from Beauty of Cloud 2.0 right here.
          </motion.p>
        </div>

        {/* Featured Latest Session */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full"
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Play className="text-blue-500" size={20} /> Latest Recording
          </h2>
          <GlassCard className="border border-white/10 bg-white/5 overflow-hidden flex flex-col lg:flex-row gap-0">
            {/* Video Player Container */}
            <div className="w-full lg:w-2/3 aspect-video relative bg-black/50">
              <iframe
                src={`https://www.youtube.com/embed/${currentSession.videoId}`}
                title={currentSession.title}
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Video Info */}
            <div className="w-full lg:w-1/3 p-8 flex flex-col justify-center gap-6">
              <div>
                <div className="flex flex-wrap items-center gap-4 mb-4 text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1.5"><User size={14} className="text-blue-400" /> {currentSession.speaker}</span>
                  <span className="flex items-center gap-1.5"><Calendar size={14} className="text-blue-400" /> {currentSession.date}</span>
                  <span className="flex items-center gap-1.5"><Clock size={14} className="text-blue-400" /> {currentSession.duration}</span>
                </div>
                <h3 className="text-2xl font-black text-white mb-3 leading-tight">{currentSession.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {currentSession.description}
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 mt-auto">
                <a
                  href={`https://www.youtube.com/watch?v=${currentSession.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <button className="w-full py-3 px-6 bg-white/10 hover:bg-white/20 transition-colors rounded-xl text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                    <Video size={16} /> Watch on YouTube
                  </button>
                </a>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Coming Soon Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full mt-8"
        >
          <GlassCard hover className="p-12 border border-white/5 bg-white/[0.02] flex flex-col items-center justify-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-500 border border-slate-700/50 mb-2">
              <Clock size={28} />
            </div>
            <h3 className="text-2xl font-bold text-slate-300">More Sessions Coming Soon</h3>
            <p className="text-slate-500 max-w-md text-sm leading-relaxed">
              We have exciting workshops and sessions planned. Stay tuned to find out what's next!
            </p>
          </GlassCard>
        </motion.div>
      </div>

      <MainFooter />
    </main>
  );
}
