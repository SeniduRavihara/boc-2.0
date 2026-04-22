'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Wifi, Volume2, ChevronRight, Monitor, Trophy, CheckSquare, Mail, Users, Cloud } from 'lucide-react';
import { About } from '@/components/sections/About';
import { Experience } from '@/components/sections/Experience';
import { Gallery } from '@/components/sections/Gallery';
import { Team } from '@/components/sections/Team';
import { Partners } from '@/components/sections/Partners';
import { Footer } from '@/components/sections/Footer';

/* ─────────────────────────────────────────────────────────
   GENIE / MAGIC LAMP ANIMATIONS
───────────────────────────────────────────────────────────*/
const styles = `
@keyframes magicLampOpen {
  0%   { transform: scaleX(0.08) translateY(80vh);
         clip-path: polygon(40% 85%, 60% 85%, 57% 100%, 43% 100%);
         opacity: 0; }
  35%  { transform: scaleX(0.35) translateY(35vh);
         clip-path: polygon(18% 55%, 82% 55%, 72% 100%, 28% 100%);
         opacity: 0.6; }
  70%  { transform: scaleX(0.8) translateY(8vh);
         clip-path: polygon(5% 10%, 95% 10%, 98% 100%, 2% 100%);
         opacity: 0.9; }
  100% { transform: scaleX(1) translateY(0);
         clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
         opacity: 1; }
}

@keyframes magicLampClose {
  0%   { transform: scaleX(1) translateY(0);
         clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
         opacity: 1; }
  30%  { transform: scaleX(0.8) translateY(8vh);
         clip-path: polygon(5% 10%, 95% 10%, 98% 100%, 2% 100%);
         opacity: 0.9; }
  65%  { transform: scaleX(0.35) translateY(35vh);
         clip-path: polygon(18% 55%, 82% 55%, 72% 100%, 28% 100%);
         opacity: 0.6; }
  100% { transform: scaleX(0.08) translateY(80vh);
         clip-path: polygon(40% 85%, 60% 85%, 57% 100%, 43% 100%);
         opacity: 0; }
}

.magic-lamp-open {
  animation: magicLampOpen 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  transform-origin: bottom center;
}

.magic-lamp-close {
  animation: magicLampClose 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  transform-origin: bottom center;
}
`;

interface LinuxShellProps {
  activeSection: number;
  onSectionClick: (index: number) => void;
}

const SECTIONS = [
  { label: "About",      icon: Cloud,       component: About,      color: "#3b82f6" },
  { label: "Experience", icon: Trophy,      component: Experience, color: "#8b5cf6" },
  { label: "Gallery",    icon: Monitor,     component: Gallery,    color: "#06b6d4" },
  { label: "Team",       icon: Users,       component: Team,       color: "#10b981" },
  { label: "Partners",   icon: Mail,        component: Partners,   color: "#f59e0b" }
];

export function LinuxShell({ activeSection, onSectionClick }: LinuxShellProps) {
  const [time, setTime] = useState(new Date());
  const [windowState, setWindowState] = useState<'hidden' | 'opening' | 'open' | 'closing'>('hidden');
  const [displayedSection, setDisplayedSection] = useState(activeSection);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle section changes with magic lamp logic
  useEffect(() => {
    if (activeSection !== displayedSection) {
      setWindowState('closing');
      const timer = setTimeout(() => {
        setDisplayedSection(activeSection);
        setWindowState('opening');
      }, 600);
      return () => clearTimeout(timer);
    } else if (windowState === 'hidden') {
      setWindowState('opening');
    }
  }, [activeSection, displayedSection, windowState]);

  useEffect(() => {
    if (windowState === 'opening') {
      const timer = setTimeout(() => setWindowState('open'), 700);
      return () => clearTimeout(timer);
    }
    if (windowState === 'closing') {
      const timer = setTimeout(() => setWindowState('hidden'), 600);
      return () => clearTimeout(timer);
    }
  }, [windowState]);

  const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = time.toLocaleDateString([], { month: 'short', day: 'numeric' });

  const ActiveComponent = SECTIONS[displayedSection]?.component || About;

  return (
    <div className="relative w-full h-full bg-[#050812] overflow-hidden">
      <style>{styles}</style>
      
      {/* Wallpaper */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
      </div>

      {/* GNOME Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-black/40 backdrop-blur-xl flex items-center justify-between px-4 z-50 text-white/90 text-[13px] font-medium border-b border-white/5">
        <div className="flex items-center gap-4">
          <span className="font-bold">Activities</span>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2">
          {dateStr} {timeStr}
        </div>
        <div className="flex items-center gap-4">
          <Wifi size={14} />
          <Volume2 size={14} />
          <div className="flex items-center gap-1">
            <div className="w-5 h-2.5 border border-white/30 rounded-sm relative">
              <div className="absolute inset-[1px] bg-white/80 w-full" />
            </div>
            <span className="text-[10px]">100%</span>
          </div>
        </div>
      </div>

      {/* Main Desktop Area */}
      <div className="absolute inset-0 pt-8 pb-20 px-4 md:px-10 flex items-center justify-center">
        {windowState !== 'hidden' && (
          <div 
            className={`w-full h-full max-w-6xl max-h-[85%] bg-[#1e1e1e]/95 backdrop-blur-2xl rounded-xl border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden
              ${windowState === 'opening' ? 'magic-lamp-open' : ''}
              ${windowState === 'closing' ? 'magic-lamp-close' : ''}
            `}
          >
            {/* Window Header */}
            <div className="h-10 bg-[#2d2d2d] border-b border-black/50 flex items-center justify-between px-4 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              </div>
              <span className="text-white/50 text-xs font-medium uppercase tracking-widest">
                {SECTIONS[displayedSection]?.label}
              </span>
              <div className="w-12" />
            </div>

            {/* Window Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-background">
              <ActiveComponent />
              {displayedSection === SECTIONS.length - 1 && <Footer />}
            </div>
          </div>
        )}
      </div>

      {/* GNOME Dock */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[100] px-2 py-2 bg-[#1e1e1e]/80 backdrop-blur-3xl border border-white/10 rounded-[24px] flex items-center gap-2 shadow-2xl transition-all duration-300">
        {SECTIONS.map((section, i) => {
          const Icon = section.icon;
          const isActive = activeSection === i;
          
          return (
            <button
              key={i}
              onClick={() => onSectionClick(i)}
              className={`relative group flex flex-col items-center transition-all duration-300 ${isActive ? 'scale-110' : 'hover:scale-105'}`}
            >
              <div 
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all relative
                  ${isActive ? 'bg-white/20 shadow-[0_0_20px_rgba(255,255,255,0.15)]' : 'hover:bg-white/10'}
                `}
              >
                <Icon 
                  size={24} 
                  className={isActive ? 'text-white' : 'text-white/60 group-hover:text-white'} 
                />
                
                {/* Active Indicator Dot */}
                {isActive && (
                  <div className="absolute -bottom-1.5 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white]" />
                )}
              </div>

              {/* Tooltip */}
              <div className="absolute -top-10 scale-0 group-hover:scale-100 transition-all bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg text-[11px] font-bold text-white border border-white/10 pointer-events-none whitespace-nowrap">
                {section.label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
