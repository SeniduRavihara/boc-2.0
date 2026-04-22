'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLoginModal from '@/components/ui/AdminLoginModal';

// Raw SVG Components for Social Icons to ensure compatibility with Lucide 1.8.0
const FacebookIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const LinkedinIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const YoutubeIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.14 1 12 1 12s0 3.86.42 5.58a2.78 2.78 0 0 0 1.94 2c1.71.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.86 23 12 23 12s0-3.86-.42-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
  </svg>
);

const SendIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const GlobeIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const ShieldCheckIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

interface RegistrationLayoutProps {
  children: React.ReactNode;
}

export function RegistrationLayout({ children }: RegistrationLayoutProps) {
  const [isAdminModalOpen, setIsAdminModalOpen] = React.useState(false);

  return (
    <div className="relative min-h-screen bg-[#020104] text-slate-200 overflow-x-hidden overflow-y-auto selection:bg-blue-500/30">
      {/* Background System — Inspired by MazeX */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Glows */}
        <div className="absolute top-0 left-0 w-full h-[50vh] bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.2)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-[radial-gradient(circle_at_50%_100%,rgba(37,99,235,0.15)_0%,transparent_70%)]" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
      </div>

      {/* Header — Cinematic Centered (As per Image) */}
      <header className="relative z-10 pt-8 md:pt-16 pb-8 md:pb-12 flex flex-col items-center px-6">
        <Link href="/" className="group flex flex-col items-center gap-4 transition-all hover:opacity-90">
          <div className="relative h-16 md:h-24 w-auto aspect-square">
            <Image 
              src="/email-and-header/boc.png" 
              alt="Beauty of Cloud 2.0" 
              fill
              sizes="(max-width: 768px) 64px, 96px"
              className="object-contain drop-shadow-[0_0_30px_rgba(37,99,235,0.3)] group-hover:scale-105 transition-transform duration-500"
              priority
            />
          </div>
          <div className="flex flex-col items-center gap-1">
             <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/80">Cloud Session | Ideathon</h2>
             <div className="w-8 h-[1px] bg-blue-500/50 mt-1" />
          </div>
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 px-4 pb-40">
        {children}
      </main>

      {/* Footer — Three Segment Layout (As per Image) */}
      <footer className="relative z-10 border-t border-white/5 bg-black/40 backdrop-blur-3xl pt-20 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Main Footer Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center mb-16 relative">
            {/* Divider Lines (Desktop) */}
            <div className="hidden md:block absolute left-1/3 top-0 bottom-0 w-px bg-white/5" />
            <div className="hidden md:block absolute left-2/3 top-0 bottom-0 w-px bg-white/5" />

            {/* Segment 1: University */}
            <div className="flex flex-col items-center text-center px-4 group">
               <div className="relative w-32 h-20 mb-4 flex items-center justify-center transition-all">
                  <Image 
                    src="/email-and-header/ieee.png" 
                    alt="IEEE Student Branch USJ" 
                    width={140} 
                    height={70} 
                    className="object-contain opacity-50 group-hover:opacity-100 transition-all duration-500 scale-[1.75]"
                  />
               </div>
               <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 leading-relaxed group-hover:text-white transition-colors">
                  University of Sri Jayewardenepura<br/>IEEE Student Branch
               </h4>
            </div>

            {/* Segment 2: Society */}
            <div className="flex flex-col items-center text-center px-4 group">
               <div className="relative w-32 h-20 mb-4 flex items-center justify-center transition-all">
                  <Image 
                    src="/email-and-header/IEEE-CS.png" 
                    alt="IEEE Computer Society USJ" 
                    width={240} 
                    height={170} 
                    className="object-contain opacity-50 group-hover:opacity-100 transition-all duration-500"
                  />
               </div>
               <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 leading-relaxed group-hover:text-white transition-colors">
                  IEEE Computer Society<br/>Student Chapter
               </h4>
            </div>

            {/* Segment 3: BOC */}
            <div className="flex flex-col items-center text-center px-4 group">
               <div className="relative w-32 h-20 mb-4 flex items-center justify-center transition-all">
                  <Image 
                    src="/email-and-header/boc.png" 
                    alt="BOC 2.0" 
                    width={140} 
                    height={70} 
                    className="object-contain opacity-50 group-hover:opacity-100 transition-all duration-500" 
                  />
               </div>
               <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 leading-relaxed group-hover:text-white transition-colors">
                  Beauty of Cloud 2.0<br/>Organizing Committee
               </h4>
            </div>
          </div>

          {/* Social Icons Row */}
          <div className="flex justify-center gap-4 mb-10">
            {[
              { icon: FacebookIcon, color: 'hover:bg-[#1877F2]' },
              { icon: LinkedinIcon, color: 'hover:bg-[#0A66C2]' },
              { icon: InstagramIcon, color: 'hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7]' },
              { icon: YoutubeIcon, color: 'hover:bg-[#FF0000]' }
            ].map(({ icon: Icon, color }, i) => (
              <Link 
                key={i}
                href="#"
                className={`flex h-12 w-12 items-center justify-center rounded-full bg-white/5 border border-white/10 transition-all duration-300 hover:scale-110 hover:-translate-y-1 ${color} hover:border-transparent hover:text-white text-slate-400`}
              >
                <Icon className="w-5 h-5" />
              </Link>
            ))}
          </div>

          {/* Copyright & Subtext */}
          <div className="flex flex-col items-center gap-4">
             <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-600">©2026 Beauty of Cloud 2.0</p>
             <p className="text-[9px] font-bold text-slate-700 uppercase tracking-widest text-center">
                Organizing Committee - Beauty of Cloud 2.0<br/>
                University of Sri Jayewardenepura
             </p>
             
             <button 
                onClick={() => setIsAdminModalOpen(true)}
                className="mt-6 flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:text-white transition-all duration-300 group"
             >
                <ShieldCheckIcon className="w-3.5 h-3.5 text-blue-500 group-hover:animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">Admin Access</span>
             </button>
          </div>
        </div>

        {/* Floating Action Button */}
        <button 
          onClick={() => setIsAdminModalOpen(true)} 
          className="fixed bottom-8 right-8 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_10px_30px_rgba(37,99,235,0.4)] transition-all hover:scale-110 hover:-translate-y-1 active:scale-95 group"
        >
          <ShieldCheckIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>

        <AdminLoginModal 
          isOpen={isAdminModalOpen} 
          onClose={() => setIsAdminModalOpen(false)} 
        />
      </footer>
    </div>
  );
}
