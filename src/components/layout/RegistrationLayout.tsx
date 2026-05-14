'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLoginModal from '@/components/ui/AdminLoginModal';
import MainFooter from '@/components/layout/MainFooter';

interface RegistrationLayoutProps {
  children: React.ReactNode;
}

export function RegistrationLayout({ children }: RegistrationLayoutProps) {

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
        <Link href="/" className="group flex flex-col items-center gap-6 transition-all hover:opacity-90">
          <div className="relative h-28 md:h-44 w-auto aspect-square">
            <Image 
              src="/email-and-header/boc.webp" 
              alt="Beauty of Cloud 2.0" 
              fill
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
      <main className="relative z-10 px-4 pb-16 md:pb-24">
        {children}
      </main>

      <MainFooter />
    </div>
  );
}
