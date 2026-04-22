'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Terminal lines to type out - Linux cloud terminal style
const TERMINAL_LINES = [
  { type: 'prompt', text: 'cloud@beauty-of-cloud:~$' , cmd: ' cat about.md' },
  { type: 'output', text: '' },
  { type: 'comment', text: '# ═══════════════════════════════════════════' },
  { type: 'comment', text: '# 🌩️  BEAUTY OF CLOUD 2.0 — System Info' },
  { type: 'comment', text: '# ═══════════════════════════════════════════' },
  { type: 'output', text: '' },
  { type: 'key', key: 'Event:', value: "Sri Lanka's First Inter-University Cloud Ideathon" },
  { type: 'key', key: 'Edition:', value: '2.0  (Upgraded from BOC 1.0)' },
  { type: 'key', key: 'Platform:', value: 'AWS | GCP | Azure | Open Stack' },
  { type: 'key', key: 'Participants:', value: '200+ Students & Professionals' },
  { type: 'output', text: '' },
  { type: 'prompt', text: 'cloud@beauty-of-cloud:~$', cmd: ' cat mission.txt' },
  { type: 'output', text: '' },
  { type: 'text', text: '"Beauty of Cloud is the 1st Ever Inter University Ideathon' },
  { type: 'text', text: ' on Cloud Computing in Sri Lanka — launched to spread' },
  { type: 'text', text: ' knowledge on Cloud technologies."' },
  { type: 'output', text: '' },
  { type: 'prompt', text: 'cloud@beauty-of-cloud:~$', cmd: ' ls -la pillars/' },
  { type: 'output', text: '' },
  { type: 'dir', text: 'drwxr-xr-x  explore_cloud_platforms/' },
  { type: 'dir', text: 'drwxr-xr-x  solve_real_world_problems/' },
  { type: 'dir', text: 'drwxr-xr-x  build_innovative_solutions/' },
  { type: 'dir', text: 'drwxr-xr-x  university_collaboration/' },
  { type: 'output', text: '' },
  { type: 'prompt', text: 'cloud@beauty-of-cloud:~$', cmd: ' ping ideathon.lk' },
  { type: 'output', text: 'PING ideathon.lk: 56 bytes of data.' },
  { type: 'success', text: '64 bytes from ideathon.lk: seq=0 ttl=64 time=0.4ms ✓' },
  { type: 'success', text: '64 bytes from ideathon.lk: seq=1 ttl=64 time=0.2ms ✓' },
  { type: 'output', text: '' },
  { type: 'prompt', text: 'cloud@beauty-of-cloud:~$', cmd: ' _' },
];

const LINE_DELAY = 60; // ms between chars
const LINE_PAUSE = 120; // ms between lines

interface TerminalLine {
  type: string;
  text?: string;
  cmd?: string;
  key?: string;
  value?: string;
}

const TypedLine: React.FC<{ line: TerminalLine; onDone: () => void; instant?: boolean }> = ({ line, onDone, instant }) => {
  const [displayed, setDisplayed] = useState('');
  const [cmdDisplayed, setCmdDisplayed] = useState('');
  
  const fullText = line.type === 'key' ? (line.value || '') : (line.text || '');
  const fullCmd = line.cmd || '';

  useEffect(() => {
    if (instant) {
      setDisplayed(fullText);
      setCmdDisplayed(fullCmd);
      onDone();
      return;
    }

    if (line.type !== 'prompt') {
      setDisplayed(fullText);
      const timer = setTimeout(onDone, 50);
      return () => clearTimeout(timer);
    }

    setDisplayed(fullText);
    
    if (fullCmd) {
      let j = 0;
      const cmdTimer = setInterval(() => {
        if (j < fullCmd.length) {
          setCmdDisplayed(fullCmd.slice(0, j + 1));
          j++;
        } else {
          clearInterval(cmdTimer);
          setTimeout(onDone, LINE_PAUSE);
        }
      }, LINE_DELAY);
      return () => clearInterval(cmdTimer);
    } else {
      const timer = setTimeout(onDone, LINE_PAUSE);
      return () => clearTimeout(timer);
    }
  }, [instant]);

  const renderContent = () => {
    switch (line.type) {
      case 'prompt':
        return (
          <div className="flex items-center gap-0 flex-wrap">
            <span className="text-blue-400 font-bold">{displayed}</span>
            <span className="text-white">{cmdDisplayed}</span>
            {!instant && cmdDisplayed.length < fullCmd.length && (
              <span className="ml-0.5 inline-block w-2 h-4 bg-blue-400 animate-pulse" />
            )}
          </div>
        );
      case 'comment':
        return <span className="text-white/30 italic">{displayed}</span>;
      case 'key':
        return (
          <div className="flex gap-2">
            <span className="text-blue-300 font-bold min-w-[120px]">{line.key} </span>
            <span className="text-white/80">{displayed}</span>
          </div>
        );
      case 'dir':
        return <span className="text-blue-400">{displayed}</span>;
      case 'success':
        return <span className="text-green-400">{displayed}</span>;
      case 'text':
        return <span className="text-white/70 italic">{displayed}</span>;
      default:
        return <span className="text-white/50">{displayed}</span>;
    }
  };

  return (
    <div className="min-h-[1.5rem] leading-6">
      {renderContent()}
    </div>
  );
};

export const About: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  
  const [currentLine, setCurrentLine] = useState(-1);
  const [started, setStarted] = useState(false);

  useGSAP(() => {
    // Label animation
    gsap.fromTo(labelRef.current, 
      { opacity: 0, y: 20 },
      { 
        opacity: 1, y: 0,
        scrollTrigger: {
          trigger: labelRef.current,
          start: 'top 90%',
          once: true
        }
      }
    );

    // Left content animation
    gsap.fromTo(leftRef.current,
      { opacity: 0, x: -40 },
      {
        opacity: 1, x: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: leftRef.current,
          start: 'top 85%',
          once: true
        }
      }
    );

    // Right content (terminal) animation
    gsap.fromTo(rightRef.current,
      { opacity: 0, x: 40 },
      {
        opacity: 1, x: 0,
        duration: 0.8,
        delay: 0.2,
        scrollTrigger: {
          trigger: rightRef.current,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            setStarted(true);
            setCurrentLine(0);
          }
        }
      }
    );
  }, { scope: containerRef });

  const handleLineDone = () => {
    setCurrentLine(prev => {
      if (prev < TERMINAL_LINES.length - 1) return prev + 1;
      return prev;
    });
  };

  return (
    <section id="about" ref={containerRef} className="py-32 px-6 bg-[#020617] relative overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section Label */}
        <div ref={labelRef} className="mb-16 flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-blue-500 font-mono text-xs tracking-[0.5em] uppercase">
            About Beauty of Cloud
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left — Heading */}
          <div ref={leftRef} className="lg:sticky lg:top-32">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9] mb-8">
              About <br />
              <span className="text-blue-500 font-mono">Beauty of</span><br />
              Cloud.
            </h2>
            <p className="text-white/40 text-sm font-mono leading-relaxed max-w-sm">
              Sri Lanka&apos;s first & largest student-led inter-university cloud ideathon — now in its second installment, bigger than ever.
            </p>

            {/* Stats row */}
            <div className="mt-10 grid grid-cols-2 gap-6">
              {[
                { val: '2nd', label: 'Edition' },
                { val: '200+', label: 'Participants' },
                { val: '10+', label: 'Universities' },
                { val: '3', label: 'Cloud Platforms' },
              ].map(s => (
                <div key={s.val} className="border border-white/5 rounded-xl p-4 bg-[#0a1628]">
                  <div className="text-2xl font-black text-blue-400">{s.val}</div>
                  <div className="text-[10px] text-white/30 uppercase tracking-widest font-mono mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            <a
              href="/delegate-booklet.pdf"
              target="_blank"
              className="mt-10 inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-8 py-4 rounded-xl shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_50px_rgba(59,130,246,0.5)] transition-all hover:scale-105 active:scale-95"
            >
              <span className="text-blue-200 font-mono">$</span>
              Delegate Booklet
            </a>
          </div>

          {/* Right — Terminal Window */}
          <div ref={rightRef}>
            {/* Terminal chrome */}
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(59,130,246,0.12)]">
              {/* Title bar */}
              <div className="bg-[#0d1b2e] px-5 py-3 flex items-center gap-3 border-b border-white/5">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <span className="text-white/30 font-mono text-xs mx-auto">bash — cloud-terminal — 80×24</span>
                <div className="w-3 h-3 rounded-full bg-blue-500/30 border border-blue-500/50 animate-pulse" />
              </div>

              {/* Terminal body */}
              <div className="bg-[#060f1e] p-6 font-mono text-sm min-h-[520px] overflow-hidden relative">
                {/* Scan-line overlay */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-[0.03]"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,1) 2px, rgba(0,0,0,1) 4px)',
                  }}
                />

                {/* Welcome line */}
                <div className="text-green-400/50 text-xs mb-4 font-mono">
                  Last login: Sat Apr 19 09:00:00 2026 from ideathon.lk
                </div>

                {/* Typed lines */}
                {TERMINAL_LINES.map((line, i) => (
                  <div key={i} className="relative">
                    {i <= currentLine ? (
                      <TypedLine
                        line={line}
                        onDone={i === currentLine ? handleLineDone : () => {}}
                        instant={i < currentLine}
                      />
                    ) : null}
                  </div>
                ))}

                {/* Blinking cursor at end */}
                {currentLine >= TERMINAL_LINES.length - 1 && (
                  <span className="inline-block w-2 h-4 bg-blue-400 animate-pulse ml-0.5 align-middle" />
                )}
              </div>
            </div>

            {/* Terminal footer badge */}
            <div className="mt-4 flex items-center justify-between px-2">
              <span className="text-white/20 font-mono text-[10px] uppercase tracking-widest">bash 5.1 · cloud-os kernel 6.1</span>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400/50 font-mono text-[10px]">connected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
