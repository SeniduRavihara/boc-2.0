'use client';

import React, { useState, useEffect, useRef } from 'react';

export const TerminalContent: React.FC = () => {
  const [history, setHistory] = useState<{ type: string; text: string }[]>([
    { type: 'info', text: 'Beauty of Cloud 2.0 Terminal (v1.0)' },
    { type: 'info', text: '──────────────────────────────────' },
    { type: 'success', text: 'ABOUT BEAUTY OF CLOUD 2.0' },
    { type: 'out', text: 'Sri Lanka\'s first student-led inter-university' },
    { type: 'out', text: 'cloud championship is back for its second edition!' },
    { type: 'out', text: '' },
    { type: 'info', text: 'Theme: Cloud Innovation for Sustainable Future' },
    { type: 'info', text: 'Focus: Scalable solutions for real-world problems.' },
    { type: 'info', text: '──────────────────────────────────' },
    { type: 'out', text: 'Type "help" for a list of available commands.' },
    { type: 'out', text: '' },
  ]);
  const [input, setInput] = useState('');
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const cmd = input.trim();
      const newHistory = [...history, { type: 'cmd', text: cmd }];
      
      if (cmd === '') {
        // do nothing
      } else if (cmd === 'clear') {
        setHistory([]);
        setInput('');
        return;
      } else if (cmd === 'help') {
        newHistory.push(
          { type: 'out', text: 'Available commands:' },
          { type: 'out', text: '  help         - Show this message' },
          { type: 'out', text: '  clear        - Clear the terminal screen' },
          { type: 'out', text: '  ls           - List directory contents' },
          { type: 'out', text: '  whoami       - Print current user' },
          { type: 'out', text: '  date         - Print current date and time' },
          { type: 'out', text: '  neofetch     - System information' },
          { type: 'out', text: '  championship - Start the championship sequence' }
        );
      } else if (cmd === 'ls') {
        newHistory.push(
          { type: 'out', text: 'drwxr-xr-x  boc  boc   4096 Apr 21 21:43 .' },
          { type: 'out', text: 'drwxr-xr-x  boc  boc   4096 Apr 21 19:00 ..' },
          { type: 'out', text: '-rwxr-xr-x  boc  boc  12883 Apr 21 21:43 \x1b[92mbeautyofcloud-2/\x1b[0m' },
          { type: 'out', text: '-rw-r--r--  boc  boc   2048 Apr 20 09:15 \x1b[93mchampionship-plan.md\x1b[0m' }
        );
      } else if (cmd === 'whoami') {
        newHistory.push({ type: 'out', text: 'boc_admin' });
      } else if (cmd === 'date') {
        newHistory.push({ type: 'out', text: new Date().toString() });
      } else if (cmd === 'neofetch') {
        newHistory.push(
          { type: 'info', text: '         .---.          boc@beauty-of-cloud' },
          { type: 'info', text: '        /     \\         ──────────────────────' },
          { type: 'info', text: '       | (●) (●)|        OS: Ubuntu 24.04 LTS x86_64' },
          { type: 'info', text: '       |  ___   |        Kernel: 6.8.0-40-generic' },
          { type: 'info', text: '       | /___\\  |        Host: Beauty of Cloud 2.0' },
          { type: 'info', text: '        \\_____/          Shell: zsh 5.9' },
          { type: 'info', text: '                         CPU: AMD Ryzen 9 7950X (32) @ 5.7GHz' },
          { type: 'info', text: '                         Memory: 8192MiB / 131072MiB' }
        );
      } else if (cmd === 'championship') {
         newHistory.push(
            { type: 'success', text: 'Initializing Beauty of Cloud Championship...' },
            { type: 'out', text: '[✓] Checking prerequisites' },
            { type: 'out', text: '[✓] Connecting to AWS nodes' },
            { type: 'success', text: 'Ready.' }
         );
      } else {
        newHistory.push({ type: 'error', text: `zsh: command not found: ${cmd}` });
      }
      
      setHistory(newHistory);
      setInput('');
    }
  };

  const colourMap: Record<string, string> = {
    cmd:     'text-white',
    out:     'text-white/70',
    info:    'text-blue-300/80',
    success: 'text-green-400',
    error:   'text-red-400',
  };

  return (
    <div 
      ref={bodyRef} 
      className="h-full overflow-y-auto p-4 font-mono text-[13px] leading-6 bg-[#121212] scroll-smooth"
      onClick={() => inputRef.current?.focus()}
    >
      {history.map((l, i) => (
        <div key={i} className={`${colourMap[l.type]} whitespace-pre`}>
          {l.type === 'cmd' ? (
            <span>
              <span className="text-green-400">boc@beauty-of-cloud</span>
              <span className="text-white/40">:</span>
              <span className="text-blue-400">~/projects</span>
              <span className="text-white/40">$ </span>
              <span className="text-white">{l.text}</span>
            </span>
          ) : l.text}
        </div>
      ))}
      <div className="flex items-center gap-0.5 mt-1">
        <span className="text-green-400 shrink-0">boc@beauty-of-cloud</span>
        <span className="text-white/40 shrink-0">:</span>
        <span className="text-blue-400 shrink-0">~/projects</span>
        <span className="text-white/40 shrink-0">$ </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleCommand}
          className="bg-transparent border-none outline-none text-white w-full font-mono shadow-none ml-1 focus:ring-0 p-0"
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    </div>
  );
};
