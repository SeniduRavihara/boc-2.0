'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Terminal as TerminalIcon, X, Minus, Square, Search, Wifi, Volume2,
  FolderOpen, FileCode, Globe, Settings, Power, Lock, Camera, Battery,
  Monitor, Cpu, HardDrive, Activity, Zap, Cloud, Grid,
  Bluetooth, Sun, Moon, Plane, ChevronRight, ChevronLeft, ChevronDown, Menu, Calculator, Clock,
  Edit, PlaySquare, Briefcase, Wrench, FileText
} from 'lucide-react';

// — Types —
type AppId = 'terminal' | 'files' | 'editor' | 'browser' | 'monitor' | 'settings' | 'calculator' | 'viewer';

interface AppState {
  id: AppId;
  title: string;
  isOpen: boolean;
  isMinimised: boolean;
  isMaximised: boolean;
  zIndex: number;
}

// — Terminal Component —
const TerminalContent: React.FC = () => {
  const [history, setHistory] = useState<{ type: string; text: string }[]>([
    { type: 'info', text: 'Beauty of Cloud 2.0 Terminal (v1.0)' },
    { type: 'info', text: '──────────────────────────────────' },
    { type: 'success', text: 'ABOUT BEAUTY OF CLOUD 2.0' },
    { type: 'out', text: 'Sri Lanka\'s first student-led inter-university' },
    { type: 'out', text: 'cloud ideathon is back for its second edition!' },
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
          { type: 'out', text: '  help       - Show this message' },
          { type: 'out', text: '  clear      - Clear the terminal screen' },
          { type: 'out', text: '  ls         - List directory contents' },
          { type: 'out', text: '  whoami     - Print current user' },
          { type: 'out', text: '  date       - Print current date and time' },
          { type: 'out', text: '  neofetch   - System information' },
          { type: 'out', text: '  ideathon   - Start the ideathon sequence' }
        );
      } else if (cmd === 'ls') {
        newHistory.push(
          { type: 'out', text: 'drwxr-xr-x  boc  boc   4096 Apr 21 21:43 .' },
          { type: 'out', text: 'drwxr-xr-x  boc  boc   4096 Apr 21 19:00 ..' },
          { type: 'out', text: '-rwxr-xr-x  boc  boc  12883 Apr 21 21:43 \x1b[92mbeautyofcloud-2/\x1b[0m' },
          { type: 'out', text: '-rw-r--r--  boc  boc   2048 Apr 20 09:15 \x1b[93mideathon-plan.md\x1b[0m' }
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
      } else if (cmd === 'ideathon') {
         newHistory.push(
            { type: 'success', text: 'Initializing Beauty of Cloud Ideathon...' },
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

// — Calculator Component —
const CalculatorContent: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState<string>('');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDot = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setHistory('');
    setPrevValue(null);
    setOperator(null);
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (nextOperator === '=') {
      if (operator && prevValue !== null) {
        let result = 0;
        switch (operator) {
          case '+': result = prevValue + inputValue; break;
          case '-': result = prevValue - inputValue; break;
          case '*': result = prevValue * inputValue; break;
          case '/': result = prevValue / inputValue; break;
          case 'mod': result = prevValue % inputValue; break;
        }
        setHistory(`${prevValue} ${operator} ${inputValue} =`);
        setDisplay(result.toString());
        setPrevValue(null);
        setOperator(null);
        setWaitingForOperand(true);
      }
      return;
    }

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operator) {
      let result = prevValue;
      switch (operator) {
        case '+': result += inputValue; break;
        case '-': result -= inputValue; break;
        case '*': result *= inputValue; break;
        case '/': result /= inputValue; break;
        case 'mod': result %= inputValue; break;
      }
      setPrevValue(result);
      setDisplay(result.toString());
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const scientific = (type: string) => {
    const val = parseFloat(display);
    switch (type) {
      case 'sqrt': setDisplay(Math.sqrt(val).toString()); break;
      case 'sqr': setDisplay((val * val).toString()); break;
      case 'pi': setDisplay(Math.PI.toString()); break;
    }
    setWaitingForOperand(true);
  };

  const btnClass = "h-14 rounded-lg text-white font-medium transition-all active:scale-95 flex items-center justify-center";
  const numBtn = `${btnClass} bg-white/10 hover:bg-white/15 text-lg`;
  const opBtn = `${btnClass} bg-white/5 hover:bg-white/10 text-white/70`;
  const eqBtn = `row-span-2 h-full rounded-lg bg-[#e95420] hover:bg-[#ff6333] text-white text-2xl transition-all active:scale-95 flex items-center justify-center font-bold`;

  return (
    <div className="h-full bg-[#2d2d2d] flex flex-col select-none overflow-hidden">
      {/* Tool bar */}
      <div className="h-10 flex items-center justify-between px-4 border-b border-black/20 bg-[#353535]">
        <div className="flex gap-4 items-center">
          <span className="text-white/40 text-xs">↶ Undo</span>
          <div className="flex items-center gap-1 text-white text-xs font-bold cursor-pointer">
            Basic <ChevronDown className="w-3 h-3" />
          </div>
        </div>
        <Menu className="w-4 h-4 text-white/70" />
      </div>

      {/* Display */}
      <div className="flex-1 flex flex-col justify-end p-6 gap-1 bg-[#2d2d2d]">
        <div className="text-right text-white/40 text-sm font-mono h-5 overflow-hidden">
          {history}
        </div>
        <div className="text-right text-white text-5xl font-light tracking-tight flex items-center justify-end gap-1">
          {display}
          <div className="w-0.5 h-10 bg-white/60 animate-pulse" />
        </div>
      </div>

      {/* Buttons Grid */}
      <div className="p-4 bg-[#353535] grid grid-cols-5 gap-2">
        <button onClick={clear} className={opBtn}>C</button>
        <button className={opBtn}>(</button>
        <button className={opBtn}>)</button>
        <button onClick={() => performOperation('mod')} className={opBtn}>mod</button>
        <button onClick={() => scientific('pi')} className={opBtn}>π</button>

        <button onClick={() => inputDigit('7')} className={numBtn}>7</button>
        <button onClick={() => inputDigit('8')} className={numBtn}>8</button>
        <button onClick={() => inputDigit('9')} className={numBtn}>9</button>
        <button onClick={() => performOperation('/')} className={opBtn}>÷</button>
        <button onClick={() => scientific('sqrt')} className={opBtn}>√</button>

        <button onClick={() => inputDigit('4')} className={numBtn}>4</button>
        <button onClick={() => inputDigit('5')} className={numBtn}>5</button>
        <button onClick={() => inputDigit('6')} className={numBtn}>6</button>
        <button onClick={() => performOperation('*')} className={opBtn}>×</button>
        <button onClick={() => scientific('sqr')} className={opBtn}>x²</button>

        <button onClick={() => inputDigit('1')} className={numBtn}>1</button>
        <button onClick={() => inputDigit('2')} className={numBtn}>2</button>
        <button onClick={() => inputDigit('3')} className={numBtn}>3</button>
        <button onClick={() => performOperation('-')} className={opBtn}>−</button>
        <button onClick={() => performOperation('=')} className={eqBtn}>=</button>

        <button onClick={() => inputDigit('0')} className={numBtn}>0</button>
        <button onClick={inputDot} className={numBtn}>.</button>
        <button className={opBtn}>%</button>
        <button onClick={() => performOperation('+')} className={opBtn}>+</button>
      </div>
    </div>
  );
};


// — Document Viewer Component —
const DocumentViewerContent: React.FC = () => {
  return (
    <div className="h-full bg-[#3d3d3d] flex flex-col select-none">
      <div className="h-10 bg-[#2d2d2d] border-b border-black/20 flex items-center px-4 justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded text-white/70 text-xs">
            <FileText className="w-3.5 h-3.5" />
            <span>about-boc-2.pdf</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-white/50">
          <Search className="w-4 h-4" />
          <div className="h-4 w-[1px] bg-white/10" />
          <div className="flex items-center gap-2 text-xs font-medium">
            <span>1 / 1</span>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-[#1e1e1e]/50">
        <div className="w-full max-w-2xl bg-white shadow-2xl p-12 min-h-[800px] text-gray-800 font-sans">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h1 className="text-3xl font-bold text-blue-600 mb-1">Beauty of Cloud 2.0</h1>
              <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">Inter-University Cloud Ideathon</p>
            </div>
            <img src="/linux-icons/apps/48/internet-web-browser.svg" className="w-12 h-12 grayscale opacity-20" />
          </div>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-lg font-bold border-b-2 border-blue-100 pb-2 mb-4">Introduction</h2>
              <p className="leading-relaxed">
                Beauty of Cloud 2.0 is Sri Lanka's first student-led inter-university cloud ideathon, returning for its second edition. This initiative brings together the brightest minds from universities across the island to solve critical real-world problems using cloud technologies.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold border-b-2 border-blue-100 pb-2 mb-4">Vision & Mission</h2>
              <p className="leading-relaxed mb-4">
                Our vision is to foster a culture of innovation and excellence in cloud computing among the Sri Lankan student community.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Empower students with industry-level cloud expertise.</li>
                <li>Bridge the gap between academic learning and industrial application.</li>
                <li>Create a platform for sustainable, scalable technological solutions.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold border-b-2 border-blue-100 pb-2 mb-4">Event Theme</h2>
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 italic text-blue-900">
                "Cloud Innovation for a Sustainable Future: Scaling impact through distributed computing and intelligent architecture."
              </div>
            </section>

            <section className="pt-12 mt-12 border-t border-gray-100">
              <div className="flex justify-between items-end">
                <div className="text-xs text-gray-400 font-mono">
                  REF: BOC-2026-X01<br />
                  CONFIDENTIAL DOCUMENT
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-600">The BOC Organizing Committee</p>
                  <p className="text-xs text-gray-400">Sri Lanka Business Platform</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

// — Browser Component —
const BrowserContent = ({ currentUrl }: { currentUrl: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadIssue, setHasLoadIssue] = useState(false);
  const loadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setHasLoadIssue(false);

    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }

    loadTimeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      setHasLoadIssue(true);
    }, 7000);

    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };
  }, [currentUrl]);

  const handleFrameLoad = () => {
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }
    setHasLoadIssue(false);
    setIsLoading(false);
  };

  const handleFrameError = () => {
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }
    setHasLoadIssue(true);
    setIsLoading(false);
  };

  return (
    <div className="h-full bg-[#202124] flex flex-col select-none">
      <div className="h-12 md:h-11 bg-[#2d2d2d] border-b border-black/30 flex items-center gap-2 px-2 md:px-3">
        <button className="w-8 h-8 md:w-7 md:h-7 rounded-full bg-white/5 hover:bg-white/10 text-white/70 flex items-center justify-center transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button className="w-8 h-8 md:w-7 md:h-7 rounded-full bg-white/5 hover:bg-white/10 text-white/70 flex items-center justify-center transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
        <button className="w-8 h-8 md:w-7 md:h-7 rounded-full bg-white/5 hover:bg-white/10 text-white/70 flex items-center justify-center transition-colors">
          <Activity className="w-4 h-4" />
        </button>
        <div className="flex-1 h-9 md:h-8 rounded-full bg-[#1a1a1a] border border-white/10 px-2.5 md:px-3 flex items-center gap-2 min-w-0">
          <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="text-[11px] md:text-[12px] text-white/80 font-mono truncate">{currentUrl}</span>
          <span className="hidden sm:inline text-[9px] uppercase tracking-widest text-cyan-300/80 ml-auto shrink-0">Pinned</span>
        </div>
      </div>
      <div className="flex-1 bg-black relative">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/70">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-cyan-200/80 text-xs font-mono">Loading pinned website...</p>
            </div>
          </div>
        )}
        <iframe
          src={currentUrl}
          title="BOC Browser"
          className="w-full h-full border-0 bg-white"
          onLoad={handleFrameLoad}
          onError={handleFrameError}
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
        />
        {hasLoadIssue && (
          <div className="absolute inset-0 z-20 bg-[#0b1119]/95 backdrop-blur-sm flex items-center justify-center px-5">
            <div className="max-w-md text-center">
              <p className="text-cyan-100 text-sm font-medium mb-2">Pinned page is taking too long to load.</p>
              <p className="text-cyan-200/70 text-xs mb-4">This can happen when the page blocks embedded view.</p>
              <a
                href={currentUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-cyan-500/20 border border-cyan-300/40 px-4 py-2 text-cyan-100 text-xs font-semibold"
              >
                Open website in new tab
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// — Draggable Window Component —
const Window = ({ 
  app, 
  constraintsRef,
  isMobile,
  onClose, 
  onMinimise, 
  onMaximise,
  onFocus, 
  content 
}: { 
  app: AppState; 
  constraintsRef?: React.RefObject<HTMLDivElement | null>;
  isMobile: boolean;
  onClose: () => void; 
  onMinimise: () => void; 
  onMaximise: () => void;
  onFocus: () => void;
  content: React.ReactNode;
}) => {
  const winRef = useRef<HTMLDivElement>(null);
  const dragPos = useRef({ x: 0, y: 0, startX: 0, startY: 0, dragging: false });

  const onTitlePointerDown = useCallback((e: React.PointerEvent) => {
    if (isMobile || app.isMaximised) return;
    onFocus();
    const el = winRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    dragPos.current = { x: rect.left, y: rect.top, startX: e.clientX, startY: e.clientY, dragging: true };
    el.style.left = rect.left + 'px';
    el.style.top = rect.top + 'px';
    el.style.transform = 'none';
    el.setPointerCapture(e.pointerId);
  }, [isMobile, app.isMaximised, onFocus]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragPos.current.dragging) return;
    const el = winRef.current;
    const container = constraintsRef?.current;
    if (!el || !container) return;
    const dx = e.clientX - dragPos.current.startX;
    const dy = e.clientY - dragPos.current.startY;
    const bounds = container.getBoundingClientRect();
    const newX = Math.max(0, Math.min(dragPos.current.x + dx, bounds.width - el.offsetWidth));
    const newY = Math.max(0, Math.min(dragPos.current.y + dy, bounds.height - el.offsetHeight));
    el.style.left = newX + 'px';
    el.style.top = newY + 'px';
  }, [constraintsRef]);

  const onPointerUp = useCallback(() => {
    dragPos.current.dragging = false;
  }, []);

  if (!app.isOpen || app.isMinimised) return null;

  const isCalculator = app.id === 'calculator';

  return (
    <div
      ref={winRef}
      onMouseDown={onFocus}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{ zIndex: app.zIndex, animation: 'winOpen 0.15s ease-out forwards' }}
      className={`absolute ${app.isMaximised || isMobile ? 'top-0 left-0 w-full h-full rounded-none' : `top-10 left-1/2 -translate-x-1/2 md:translate-x-0 ${isCalculator ? 'md:left-[35%] w-[340px] h-[520px]' : 'md:left-[20%] w-[90vw] md:w-[700px] h-[60vh] md:h-[450px]'} rounded-xl`} bg-[#1e1e1e] shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col overflow-hidden pointer-events-auto`}
    >
      {/* Title Bar */}
      <div 
        className={`bg-[#2d2d2d] flex items-center justify-between px-4 select-none border-b border-black/50 ${isMobile ? 'h-12' : 'h-10 cursor-grab active:cursor-grabbing'}`}
        onDoubleClick={onMaximise}
        onPointerDown={onTitlePointerDown}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <button onClick={onClose} className="w-4 h-4 rounded-full bg-[#ff5f56] flex items-center justify-center hover:bg-[#ff5f56]/80 group transition-colors shadow-sm">
              <img src="/linux-icons/actions/16/window-close-symbolic.svg" alt="close" className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity brightness-0 invert" />
            </button>
            <button onClick={onMinimise} className="w-4 h-4 rounded-full bg-[#ffbd2e] flex items-center justify-center hover:bg-[#ffbd2e]/80 group transition-colors shadow-sm">
              <img src="/linux-icons/actions/16/window-minimize-symbolic.svg" alt="minimize" className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity brightness-0 invert" />
            </button>
            <button onClick={onMaximise} className={`w-4 h-4 rounded-full bg-[#27c93f] items-center justify-center hover:bg-[#27c93f]/80 group transition-colors shadow-sm ${isMobile ? 'hidden' : 'flex'}`}>
              <img src="/linux-icons/actions/16/window-maximize-symbolic.svg" alt={app.isMaximised ? 'restore' : 'maximize'} className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity brightness-0 invert" />
            </button>
          </div>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 text-white/50 text-[13px] font-medium tracking-wide">
          {app.title}
        </div>
        <div className="w-10" />
      </div>
      <div className="flex-1 overflow-hidden relative">
        {content}
      </div>
    </div>
  );
};

// — Quick Settings Popover —
interface QuickSettingsProps {
  show: boolean;
  brightness: number; setBrightness: (v: number) => void;
  volume: number; setVolume: (v: number) => void;
  wifiEnabled: boolean; setWifiEnabled: (v: boolean) => void;
  bluetoothEnabled: boolean; setBluetoothEnabled: (v: boolean) => void;
  powerMode: string; setPowerMode: (v: string) => void;
  nightLight: boolean; setNightLight: (v: boolean) => void;
  darkStyle: boolean; setDarkStyle: (v: boolean) => void;
  airplaneMode: boolean; setAirplaneMode: (v: boolean) => void;
}

const QuickSettings = ({ 
  show, brightness, setBrightness, volume, setVolume,
  wifiEnabled, setWifiEnabled, bluetoothEnabled, setBluetoothEnabled,
  powerMode, setPowerMode, nightLight, setNightLight,
  darkStyle, setDarkStyle, airplaneMode, setAirplaneMode
}: QuickSettingsProps) => {
  if (!show) return null;

  const cyclePowerMode = () => {
    if (powerMode === 'Performance') setPowerMode('Balanced');
    else if (powerMode === 'Balanced') setPowerMode('Power Saver');
    else setPowerMode('Performance');
  };

  return (
    <div
      style={{ animation: 'popoverIn 0.15s ease-out forwards' }}
      className="absolute top-10 right-2 w-[calc(100vw-1rem)] max-w-[340px] bg-[#1e1e1e]/95 backdrop-blur-3xl -webkit-backdrop-filter-blur-3xl rounded-[24px] shadow-2xl border border-white/10 p-4 z-[130]"
      onClick={e => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-white text-xs font-medium">
          <img src="/linux-icons/status/16/battery-100-symbolic.svg" className="w-4 h-4 brightness-0 invert" />
          <span>100%</span>
        </div>
        <div className="flex gap-2">
          <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 text-white"><Settings className="w-4 h-4" /></button>
          <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 text-white"><Lock className="w-4 h-4" /></button>
          <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 text-white"><Power className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="space-y-4 mb-4">
        {/* Volume */}
        <div className="flex items-center gap-3 px-2">
          <img src="/linux-icons/status/16/audio-volume-high-symbolic.svg" className="w-5 h-5 brightness-0 invert opacity-70 shrink-0" />
          <input 
            type="range" min="0" max="100" value={volume} 
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full h-1.5 bg-white/20 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full cursor-pointer outline-none"
            style={{ background: `linear-gradient(to right, #fff ${volume}%, rgba(255,255,255,0.2) ${volume}%)` }}
          />
        </div>
        {/* Brightness */}
        <div className="flex items-center gap-3 px-2">
          <img src="/linux-icons/actions/16/adjustcol-symbolic.svg" className="w-5 h-5 brightness-0 invert opacity-70 shrink-0" />
          <input 
            type="range" min="20" max="100" value={brightness} 
            onChange={(e) => setBrightness(Number(e.target.value))}
            className="w-full h-1.5 bg-white/20 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full cursor-pointer outline-none"
            style={{ background: `linear-gradient(to right, #06b6d4 ${brightness}%, rgba(255,255,255,0.2) ${brightness}%)` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 select-none">
        <div 
          onClick={() => setWifiEnabled(!wifiEnabled)}
          className={`${wifiEnabled ? 'bg-cyan-700/80 hover:bg-cyan-600/80' : 'bg-white/10 hover:bg-white/15'} rounded-2xl p-3 cursor-pointer flex justify-between items-center transition-colors text-white`}
        >
          <div className="flex items-center gap-3">
            <Wifi className="w-5 h-5" />
            <div className="flex flex-col text-left">
              <span className="text-[13px] font-medium leading-tight">Wi-Fi</span>
              {wifiEnabled && <span className="text-[10px] text-white/70">BOC-Network</span>}
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-white/50" />
        </div>
        
        <div 
          onClick={() => setBluetoothEnabled(!bluetoothEnabled)}
          className={`${bluetoothEnabled ? 'bg-cyan-700/80 hover:bg-cyan-600/80' : 'bg-white/10 hover:bg-white/15'} rounded-2xl p-3 cursor-pointer flex justify-between items-center transition-colors text-white`}
        >
          <div className="flex items-center gap-3">
            <Bluetooth className="w-5 h-5" />
            <span className="text-[13px] font-medium">Bluetooth</span>
          </div>
          <ChevronRight className="w-4 h-4 text-white/50" />
        </div>

        <div 
          onClick={cyclePowerMode}
          className="bg-cyan-700/80 hover:bg-cyan-600/80 rounded-2xl p-3 cursor-pointer flex justify-between items-center transition-colors text-white"
        >
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5" />
            <div className="flex flex-col text-left">
              <span className="text-[13px] font-medium leading-tight">Power Mode</span>
              <span className="text-[10px] text-white/70">{powerMode}</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-white/50" />
        </div>

        <div 
          onClick={() => setNightLight(!nightLight)}
          className={`${nightLight ? 'bg-cyan-700/80 hover:bg-cyan-600/80' : 'bg-white/10 hover:bg-white/15'} rounded-2xl p-3 cursor-pointer flex items-center gap-3 transition-colors text-white`}
        >
          <Sun className="w-5 h-5" />
          <span className="text-[13px] font-medium">Night Light</span>
        </div>

        <div 
          onClick={() => setDarkStyle(!darkStyle)}
          className={`${darkStyle ? 'bg-cyan-700/80 hover:bg-cyan-600/80' : 'bg-white/10 hover:bg-white/15'} rounded-2xl p-3 cursor-pointer flex items-center gap-3 transition-colors text-white`}
        >
          <Moon className="w-5 h-5" />
          <span className="text-[13px] font-medium">Dark Style</span>
        </div>

        <div 
          onClick={() => setAirplaneMode(!airplaneMode)}
          className={`${airplaneMode ? 'bg-cyan-700/80 hover:bg-cyan-600/80' : 'bg-white/10 hover:bg-white/15'} rounded-2xl p-3 cursor-pointer flex items-center gap-3 transition-colors text-white`}
        >
          <Plane className="w-5 h-5" />
          <span className="text-[13px] font-medium">Airplane Mode</span>
        </div>
      </div>
    </div>
  );
};

// — App Drawer (Activities) —
const AppDrawer = ({ show, onClose, onOpenApp }: { show: boolean; onClose: () => void; onOpenApp: (id: AppId) => void }) => {
  if (!show) return null;

  const appCategories = [
    { id: 'files', name: 'Office', icon: "/linux-icons/apps/48/libreoffice-main.svg" },
    { id: 'terminal', name: 'Programming', icon: "/linux-icons/apps/48/utilities-terminal.svg" },
    { id: 'settings', name: 'Tools', icon: "/linux-icons/apps/48/system-settings.svg" },
    { id: 'monitor', name: 'Media', icon: "/linux-icons/apps/48/multimedia.svg" },
    { id: 'settings', name: 'System', icon: "/linux-icons/apps/48/applications-system.svg" },
    { id: 'files', name: 'Utilities', icon: "/linux-icons/apps/48/utilities-file-archiver.svg" },
    { id: 'files', name: 'Graphics', icon: "/linux-icons/apps/48/gimp.svg" },
    { id: 'settings', name: 'Settings', icon: "/linux-icons/apps/48/system-settings.svg" },
    { id: 'monitor', name: 'Clocks', icon: "/linux-icons/apps/48/clocks.svg" },
    { id: 'calculator', name: 'Calculator', icon: "/linux-icons/apps/48/calculator.svg" },
    { id: 'editor', name: 'Text Editor', icon: "/linux-icons/apps/48/text-editor.svg" },
    { id: 'terminal', name: 'Terminal', icon: "/linux-icons/apps/48/utilities-terminal.svg" },
    { id: 'viewer', name: 'About BOC 2.0', icon: "/linux-icons/apps/48/internet-web-browser.svg" },
  ];

  return (
    <div
      style={{ animation: 'popoverIn 0.2s ease-out forwards' }}
      className="absolute inset-0 z-[110] bg-black/50 backdrop-blur-xl flex flex-col items-center pt-16 md:pt-24 pb-24 md:pb-32 px-4 md:px-10"
      onClick={onClose}
    >
      <div className="w-full max-w-2xl bg-white/10 rounded-full flex items-center px-4 md:px-6 py-2.5 md:py-3 mb-10 md:mb-16 shadow-2xl border border-white/10" onClick={e => e.stopPropagation()}>
        <Search className="w-5 h-5 text-white/50 mr-3" />
        <input 
          type="text" 
          placeholder="Type to search" 
          className="bg-transparent border-none outline-none text-white text-lg w-full placeholder:text-white/30"
          autoFocus
        />
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-x-4 md:gap-x-8 gap-y-8 md:gap-y-12 max-w-5xl w-full" onClick={e => e.stopPropagation()}>
        {appCategories.map((app, i) => (
          <div key={i} className="flex flex-col items-center gap-3 cursor-pointer group" onClick={() => onOpenApp(app.id as AppId)}>
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-white/5 hover:bg-white/15 flex items-center justify-center transition-all border border-white/5 shadow-xl group-hover:scale-105">
              <img src={app.icon} alt={app.name} className="w-10 h-10 md:w-12 md:h-12 object-contain" />
            </div>
            <span className="text-white/80 text-xs md:text-sm font-medium drop-shadow-md text-center">{app.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// — Calendar & Notifications Popover —
const CalendarPopover = ({ show, time }: { show: boolean, time: Date }) => {
  if (!show) return null;

  const monthStr = time.toLocaleDateString('en-US', { month: 'long' });
  const dayName = time.toLocaleDateString('en-US', { weekday: 'long' });
  const dayStr = time.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div
      style={{ animation: 'popoverIn 0.15s ease-out forwards' }}
      className="absolute top-10 left-1/2 -translate-x-1/2 w-[calc(100vw-1rem)] md:w-[680px] bg-[#1e1e1e]/95 backdrop-blur-3xl rounded-[24px] shadow-2xl border border-white/10 p-4 z-[130] flex flex-col md:flex-row gap-4 h-[70vh] md:h-[420px] overflow-hidden"
      onClick={e => e.stopPropagation()}
    >
      {/* Left: Notifications */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto pr-2 space-y-2">
          {/* Example Notification */}
          <div className="bg-white/5 rounded-2xl p-3 border border-white/5 relative group hover:bg-white/10 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-white/50" />
                <span className="text-white/50 text-xs font-medium">Screenshot • Just now</span>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"><ChevronRight className="w-3 h-3 text-white" /></button>
                <button className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"><X className="w-3 h-3 text-white" /></button>
              </div>
            </div>
            <p className="text-white text-sm font-medium">Screenshot captured</p>
            <p className="text-white/60 text-xs">You can paste the image from the clipboard.</p>
          </div>
          
          <div className="bg-white/5 rounded-2xl p-3 border border-white/5 relative group hover:bg-white/10 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-white/50" />
                <span className="text-white/50 text-xs font-medium">System • 9 mins ago</span>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"><ChevronRight className="w-3 h-3 text-white" /></button>
                <button className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"><X className="w-3 h-3 text-white" /></button>
              </div>
            </div>
            <p className="text-white text-sm font-medium">Updates available</p>
            <p className="text-white/60 text-xs">System requires a restart to install updates.</p>
          </div>
        </div>
        
        {/* Do Not Disturb & Clear */}
        <div className="mt-4 flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-white/80 text-sm font-medium">Do Not Disturb</span>
            <div className="w-10 h-6 bg-cyan-700 rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
            </div>
          </div>
          <button className="bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-lg text-white text-sm transition-colors font-medium">
            Clear
          </button>
        </div>
      </div>

      <div className="h-[1px] md:h-auto md:w-[1px] bg-white/10" />

      {/* Right: Calendar */}
      <div className="w-full md:w-[280px] flex flex-col">
        <div className="mb-4 pl-2">
          <p className="text-white/50 text-sm font-medium">{dayName}</p>
          <p className="text-white text-lg font-medium">{dayStr}</p>
        </div>
        
        {/* Fake Calendar Grid */}
        <div className="mb-6 px-2">
          <div className="flex items-center justify-between mb-4">
            <ChevronLeft className="w-4 h-4 text-white/50 cursor-pointer hover:text-white" />
            <span className="text-white text-sm font-medium">{monthStr}</span>
            <ChevronRight className="w-4 h-4 text-white/50 cursor-pointer hover:text-white" />
          </div>
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['S','M','T','W','T','F','S'].map((d, i) => (
              <span key={i} className="text-white/30 text-[10px] font-medium">{d}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-3 gap-x-1 text-center text-xs text-white/80 items-center justify-items-center">
            {/* Fake calendar representation for demo */}
            <span className="text-white/30">29</span><span className="text-white/30">30</span><span className="text-white/30">31</span>
            <span>1</span><span>2</span><span>3</span><span>4</span>
            <span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span>
            <span>12</span><span>13</span><span>14</span><span>15</span><span>16</span><span>17</span><span>18</span>
            <span>19</span><span>20</span>
            <div className="w-6 h-6 bg-cyan-700 text-white rounded-full flex items-center justify-center">21</div>
            <span>22</span><span>23</span><span>24</span><span>25</span>
            <span>26</span><span>27</span><span>28</span><span>29</span><span>30</span>
            <span className="text-white/30">1</span><span className="text-white/30">2</span>
          </div>
        </div>

        {/* Events Block — */}
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5 mb-2">
          <p className="text-white/80 text-sm font-medium mb-1">Today</p>
          <p className="text-white/40 text-sm italic">No Events</p>
        </div>

        {/* World Clocks — */}
        <div className="bg-white/5 rounded-2xl p-3 border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
          <p className="text-white/80 text-sm font-medium">Add world clocks...</p>
        </div>
      </div>
    </div>
  );
};

// — Main Component —
export const LinuxEnvironment: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [showQuickSettings, setShowQuickSettings] = useState(false);
  const [showAppDrawer, setShowAppDrawer] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  
  // Quick Settings States
  const [brightness, setBrightness] = useState(100);
  const [volume, setVolume] = useState(70);
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(true);
  const [powerMode, setPowerMode] = useState('Performance');
  const [nightLight, setNightLight] = useState(false);
  const [darkStyle, setDarkStyle] = useState(true);
  const [airplaneMode, setAirplaneMode] = useState(false);
  const [currentSiteUrl, setCurrentSiteUrl] = useState('about:blank');
  const [isMobile, setIsMobile] = useState(false);
  
  const desktopRef = useRef<HTMLDivElement>(null);
  
  const [apps, setApps] = useState<AppState[]>([
    { id: 'terminal', title: 'Terminal', isOpen: true, isMinimised: false, isMaximised: false, zIndex: 10 },
    { id: 'browser', title: 'BOC Browser', isOpen: false, isMinimised: false, isMaximised: false, zIndex: 12 },
    { id: 'files', title: 'Files', isOpen: false, isMinimised: false, isMaximised: false, zIndex: 1 },
    { id: 'editor', title: 'Code Editor', isOpen: false, isMinimised: false, isMaximised: false, zIndex: 1 },
    { id: 'calculator', title: 'Calculator', isOpen: false, isMinimised: false, isMaximised: false, zIndex: 1 },
    { id: 'viewer', title: 'Document Viewer', isOpen: true, isMinimised: false, isMaximised: false, zIndex: 11 },
  ]);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const { origin, pathname } = window.location;
    const shouldPointHome = pathname === '/test' || pathname === '/linux';
    const safePath = shouldPointHome ? '/' : pathname;
    setCurrentSiteUrl(`${origin}${safePath}`);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia('(max-width: 767px)');
    const applyMode = () => setIsMobile(media.matches);

    applyMode();
    media.addEventListener('change', applyMode);

    return () => media.removeEventListener('change', applyMode);
  }, []);

  const openApp = (id: AppId) => {
    setShowAppDrawer(false);
    setApps(prev => prev.map(app => {
      if (app.id === id) {
        return { ...app, isOpen: true, isMinimised: false, isMaximised: isMobile ? true : app.isMaximised, zIndex: Math.max(...prev.map(a => a.zIndex)) + 1 };
      }
      return app;
    }));
  };

  const closeApp = (id: AppId) => {
    setApps(prev => prev.map(app => app.id === id ? { ...app, isOpen: false } : app));
  };

  const minimiseApp = (id: AppId) => {
    setApps(prev => prev.map(app => app.id === id ? { ...app, isMinimised: true } : app));
  };

  const focusApp = (id: AppId) => {
    setApps(prev => prev.map(app => {
      if (app.id === id) {
        return { ...app, zIndex: Math.max(...prev.map(a => a.zIndex)) + 1 };
      }
      return app;
    }));
  };

  const maximiseApp = (id: AppId) => {
    setApps(prev => prev.map(app => {
      if (app.id === id) {
        if (isMobile) {
          return { ...app, zIndex: Math.max(...prev.map(a => a.zIndex)) + 1 };
        }
        return { ...app, isMaximised: !app.isMaximised, zIndex: Math.max(...prev.map(a => a.zIndex)) + 1 };
      }
      return app;
    }));
  };

  useEffect(() => {
    if (!isMobile) return;

    setApps(prev => prev.map(app => app.isOpen ? { ...app, isMaximised: true } : app));
  }, [isMobile]);

  const dateStr = time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Render App Contents
  const getAppContent = (id: AppId) => {
    switch (id) {
      case 'terminal': return <TerminalContent />;
      case 'browser': return <BrowserContent currentUrl={currentSiteUrl} />;
      case 'files': return <div className="p-8 text-white/50 font-mono text-sm">Files directory empty.</div>;
      case 'editor': return <div className="p-8 text-white/50 font-mono text-sm">Visual Studio Code Insiders.</div>;
      case 'calculator': return <CalculatorContent />;
      case 'viewer': return <DocumentViewerContent />;
      default: return null;
    }
  };

  return (
    <div className="w-full h-full bg-[#1a1a2e] relative overflow-hidden select-none font-sans cursor-default outline-none" onClick={() => { setShowQuickSettings(false); setShowCalendar(false); }}>
      
      {/* — Wallpaper — */}
      <div className="absolute inset-0 z-0 bg-black">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-60" />
      </div>

      {/* — Desktop Icons — */}
      <div className="absolute top-12 left-6 z-[10] flex flex-col gap-6">
        <div 
          onDoubleClick={() => openApp('viewer')}
          className="flex flex-col items-center gap-1 group cursor-pointer w-20"
        >
          <div className="w-14 h-14 rounded-xl bg-white/5 group-hover:bg-white/15 flex items-center justify-center transition-all backdrop-blur-md border border-white/5 shadow-lg group-active:scale-95">
            <img src="/linux-icons/apps/48/internet-web-browser.svg" alt="About" className="w-9 h-9 object-contain" />
          </div>
          <span className="text-white text-[11px] font-medium drop-shadow-md text-center px-1 py-0.5 rounded group-hover:bg-blue-600/50 transition-colors">
            About BOC 2.0
          </span>
        </div>
      </div>

      {/* — Visual Overlays based on Quick Settings — */}
      <div 
        className="absolute inset-0 pointer-events-none z-[85] transition-opacity duration-300"
        style={{
          backgroundColor: `rgba(0,0,0, ${(100 - brightness) / 100 * 0.85})`, // dim up to 85%
        }}
      />
      {nightLight && (
        <div className="absolute inset-0 pointer-events-none z-[86] bg-orange-500/15 mix-blend-multiply transition-opacity duration-500" />
      )}

      {/* — GNOME Top Bar — */}
      <div className="absolute top-0 left-0 right-0 h-9 md:h-7 bg-black/50 hover:bg-black/80 transition-colors backdrop-blur-xl flex items-center justify-between px-2 md:px-4 z-[110] text-white">
        {/* Left: Activities */}
        <div 
          className={`flex items-center gap-2 text-[12px] md:text-[13px] font-medium cursor-pointer ${showAppDrawer ? 'bg-white/20' : 'hover:bg-white/10'} px-2 md:px-3 py-1 rounded-full transition-colors`}
          onClick={() => setShowAppDrawer(!showAppDrawer)}
        >
          <span className="font-semibold">Activities</span>
        </div>

        {/* Centre: clock */}
        <div 
          className="absolute left-1/2 -translate-x-1/2 text-[12px] md:text-[13px] font-semibold cursor-pointer hover:bg-white/10 px-2 md:px-4 py-1 rounded-full transition-colors flex items-center justify-center"
          onClick={(e) => { e.stopPropagation(); setShowCalendar(!showCalendar); setShowQuickSettings(false); }}
        >
          {dateStr}  {timeStr}
        </div>

        {/* Right: tray */}
        <div 
          className="flex items-center gap-1.5 md:gap-3 text-[12px] md:text-[13px] cursor-pointer hover:bg-white/10 px-2 md:px-3 py-1 rounded-full transition-colors"
          onClick={(e) => { e.stopPropagation(); setShowQuickSettings(!showQuickSettings); setShowCalendar(false); }}
        >
          <Wifi className="w-4 h-4" />
          <img src="/linux-icons/status/16/audio-volume-high-symbolic.svg" className="w-4 h-4 brightness-0 invert" />
          <div className="flex items-center gap-1.5">
            <img src="/linux-icons/status/16/battery-100-symbolic.svg" className="w-5 h-5 brightness-0 invert" />
            <span className="hidden md:inline font-medium text-xs">100%</span>
          </div>
        </div>
      </div>

      {/* Calendar & Notifications Dropdown */}
      {showCalendar && <CalendarPopover show={showCalendar} time={time} />}

      {/* Quick Settings Dropdown — */}
      {showQuickSettings && (
        <QuickSettings 
          show={showQuickSettings} 
          brightness={brightness} setBrightness={setBrightness}
          volume={volume} setVolume={setVolume}
          wifiEnabled={wifiEnabled} setWifiEnabled={setWifiEnabled}
          bluetoothEnabled={bluetoothEnabled} setBluetoothEnabled={setBluetoothEnabled}
          powerMode={powerMode} setPowerMode={setPowerMode}
          nightLight={nightLight} setNightLight={setNightLight}
          darkStyle={darkStyle} setDarkStyle={setDarkStyle}
          airplaneMode={airplaneMode} setAirplaneMode={setAirplaneMode}
        />
      )}

      {/* App Drawer — */}
      {showAppDrawer && <AppDrawer show={showAppDrawer} onClose={() => setShowAppDrawer(false)} onOpenApp={openApp} />}

      {/* — Windows Area — */}
      <div ref={desktopRef} className="absolute top-9 md:top-7 left-0 right-0 bottom-0 pointer-events-none z-[80]">
        {apps.map(app => (
          <Window 
            key={app.id} 
            app={app} 
            constraintsRef={desktopRef}
            isMobile={isMobile}
            onClose={() => closeApp(app.id)} 
            onMinimise={() => minimiseApp(app.id)} 
            onMaximise={() => maximiseApp(app.id)}
            onFocus={() => focusApp(app.id)}
            content={getAppContent(app.id)}
          />
        ))}
      </div>

      {/* — GNOME Dock — */}
      <div className={`absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 z-[120] px-2 py-1.5 bg-[#1e1e1e]/80 backdrop-blur-3xl border border-white/10 rounded-[24px] flex items-center gap-1 md:gap-2 shadow-2xl transition-all duration-300 opacity-100 scale-100`}>
        {[
          { id: 'browser', icon: "/linux-icons/apps/48/internet-web-browser.svg", label: 'Browser' },
          { id: 'files', icon: "/linux-icons/apps/48/system-file-manager.svg", label: 'Files' },
          { id: 'editor', icon: "/linux-icons/apps/48/text-editor.svg", label: 'Code' },
          { id: 'terminal', icon: "/linux-icons/apps/48/utilities-terminal.svg", label: 'Terminal' },
          { id: 'viewer', icon: "/linux-icons/apps/48/internet-web-browser.svg", label: 'About' },
        ].map((item, i) => {
          const appState = apps.find(a => a.id === item.id);
          const isRunning = appState?.isOpen;
          const isFocused = isRunning && !appState?.isMinimised && appState?.zIndex === Math.max(...apps.map(a => a.zIndex));

          return (
            <div 
              key={i} 
              onClick={() => openApp(item.id as AppId)}
              className="relative group flex flex-col items-center"
            >
              <div className={`w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all cursor-pointer ${isFocused ? 'bg-white/15 shadow-inner' : 'hover:bg-white/10'}`}>
                <img src={item.icon} alt={item.label} className="w-7 h-7 md:w-8 md:h-8 object-contain drop-shadow-md" />
              </div>
              {/* Running indicator — */}
              {isRunning && (
                <div className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-white/80" />
              )}
            </div>
          )
        })}
        
        {/* Divider — */}
        <div className="w-[1px] h-8 bg-white/20 mx-1" />
        
        {/* Show Apps Button — */}
        <div 
          onClick={() => setShowAppDrawer(!showAppDrawer)}
          className={`w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all cursor-pointer ${showAppDrawer ? 'bg-white/20 shadow-inner' : 'hover:bg-white/10'} group relative`}
        >
          <img src="/linux-icons/apps/48/appgrid.svg" alt="Show Apps" className="w-7 h-7 md:w-8 md:h-8 object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

    </div>
  );
};
