'use client';

import React, { useState, useEffect, useRef } from 'react';

// Sub-components
import { AppId, AppState } from './linux/types';
import { TerminalContent } from './linux/TerminalContent';
import { DocumentViewerContent } from './linux/DocumentViewerContent';
import { TrashContent } from './linux/TrashContent';
import { Window } from './linux/Window';
import { QuickSettings } from './linux/QuickSettings';
import { AppDrawer } from './linux/AppDrawer';
import { CalendarPopover } from './linux/CalendarPopover';
import { TopBar } from './linux/TopBar';
import { Dock } from './linux/Dock';
import { Monitor, Folder, Trash2, HardDrive } from 'lucide-react';

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
  const [isMobile, setIsMobile] = useState(false);
  
  const desktopRef = useRef<HTMLDivElement>(null);
  
  const [apps, setApps] = useState<AppState[]>([
    { id: 'viewer', title: 'Document Viewer', isOpen: true, isMinimised: false, isMaximised: false, zIndex: 11 },
    { id: 'files', title: 'Files', isOpen: false, isMinimised: false, isMaximised: false, zIndex: 1 },
    { id: 'terminal', title: 'Terminal', isOpen: false, isMinimised: false, isMaximised: false, zIndex: 10 },
    { id: 'trash', title: 'Trash', isOpen: false, isMinimised: false, isMaximised: false, zIndex: 1 },
  ]);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
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
        if (isMobile) return { ...app, zIndex: Math.max(...prev.map(a => a.zIndex)) + 1 };
        return { ...app, isMaximised: !app.isMaximised, zIndex: Math.max(...prev.map(a => a.zIndex)) + 1 };
      }
      return app;
    }));
  };

  useEffect(() => {
    if (isMobile) {
      setApps(prev => prev.map(app => app.isOpen ? { ...app, isMaximised: true } : app));
    }
  }, [isMobile]);

  const dateStr = time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const getAppContent = (id: AppId) => {
    switch (id) {
      case 'terminal': return <TerminalContent />;
      case 'files': return <div className="p-8 text-white/50 font-mono text-sm">Files directory empty.</div>;
      case 'viewer': return <DocumentViewerContent />;
      case 'trash': return <TrashContent />;
      default: return null;
    }
  };

  return (
    <div 
      className="w-full h-full bg-[#050812] relative overflow-hidden select-none font-sans cursor-default outline-none" 
      onClick={() => { setShowQuickSettings(false); setShowCalendar(false); }}
    >
      {/* — Wallpaper — */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <img 
          src="/images/image3.webp" 
          alt="Desktop Background" 
          className="w-full h-full object-cover opacity-45 select-none pointer-events-none"
        />
        {/* Blue theme color tint and overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/35 via-[#050812]/25 to-[#050812]/85" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px]" />
      </div>

      {/* — Desktop Icons — */}
      <div className="absolute top-14 left-20 z-[10] flex flex-col gap-6">
        <div onDoubleClick={() => openApp('viewer')} className="flex flex-col items-center gap-1 group cursor-pointer w-20 text-center">
          <div className="w-14 h-14 rounded-xl bg-white/5 group-hover:bg-white/15 flex items-center justify-center transition-all backdrop-blur-md border border-white/5 shadow-lg group-active:scale-95">
            <Monitor className="w-8 h-8 text-cyan-300 drop-shadow-md" />
          </div>
          <span className="text-white text-[11px] font-medium drop-shadow-md px-1 py-0.5 rounded group-hover:bg-blue-600/50 transition-colors">
            Computer
          </span>
        </div>

        <div onDoubleClick={() => openApp('files')} className="flex flex-col items-center gap-1 group cursor-pointer w-20 text-center">
          <div className="w-14 h-14 rounded-xl bg-white/5 group-hover:bg-white/15 flex items-center justify-center transition-all backdrop-blur-md border border-white/5 shadow-lg group-active:scale-95">
            <Folder className="w-8 h-8 text-amber-400 drop-shadow-md" />
          </div>
          <span className="text-white text-[11px] font-medium drop-shadow-md px-1 py-0.5 rounded group-hover:bg-blue-600/50 transition-colors">
            guest's Home
          </span>
        </div>

        <div onDoubleClick={() => openApp('files')} className="flex flex-col items-center gap-1 group cursor-pointer w-20 text-center">
          <div className="w-14 h-14 rounded-xl bg-white/5 group-hover:bg-white/15 flex items-center justify-center transition-all backdrop-blur-md border border-white/5 shadow-lg group-active:scale-95">
            <HardDrive className="w-8 h-8 text-slate-400 drop-shadow-md" />
          </div>
          <span className="text-white text-[11px] font-medium drop-shadow-md px-1 py-0.5 rounded group-hover:bg-blue-600/50 transition-colors">
            File System
          </span>
        </div>

        <div onDoubleClick={() => openApp('trash')} className="flex flex-col items-center gap-1 group cursor-pointer w-20 text-center">
          <div className="w-14 h-14 rounded-xl bg-white/5 group-hover:bg-white/15 flex items-center justify-center transition-all backdrop-blur-md border border-white/5 shadow-lg group-active:scale-95">
            <Trash2 className="w-8 h-8 text-rose-500 drop-shadow-md" />
          </div>
          <span className="text-white text-[11px] font-medium drop-shadow-md px-1 py-0.5 rounded group-hover:bg-blue-600/50 transition-colors">
            Trash
          </span>
        </div>
      </div>

      {/* — Visual Overlays (Brightness/Night Light) — */}
      <div className="absolute inset-0 pointer-events-none z-[85] transition-opacity duration-300" style={{ backgroundColor: `rgba(0,0,0, ${(100 - brightness) / 100 * 0.85})` }} />
      {nightLight && <div className="absolute inset-0 pointer-events-none z-[86] bg-orange-500/15 mix-blend-multiply transition-opacity duration-500" />}

      {/* — UI Components — */}
      <TopBar 
        showAppDrawer={showAppDrawer} setShowAppDrawer={setShowAppDrawer}
        showCalendar={showCalendar} setShowCalendar={setShowCalendar}
        showQuickSettings={showQuickSettings} setShowQuickSettings={setShowQuickSettings}
        dateStr={dateStr} timeStr={timeStr}
      />

      {showCalendar && <CalendarPopover show={showCalendar} time={time} />}

      <QuickSettings 
        show={showQuickSettings} brightness={brightness} setBrightness={setBrightness}
        volume={volume} setVolume={setVolume}
        wifiEnabled={wifiEnabled} setWifiEnabled={setWifiEnabled}
        bluetoothEnabled={bluetoothEnabled} setBluetoothEnabled={setBluetoothEnabled}
        powerMode={powerMode} setPowerMode={setPowerMode}
        nightLight={nightLight} setNightLight={setNightLight}
        darkStyle={darkStyle} setDarkStyle={setDarkStyle}
        airplaneMode={airplaneMode} setAirplaneMode={setAirplaneMode}
      />

      <AppDrawer show={showAppDrawer} onClose={() => setShowAppDrawer(false)} onOpenApp={openApp} />

      {/* — Windows Area — */}
      <div ref={desktopRef} className="absolute top-9 md:top-7 left-0 right-0 bottom-0 pointer-events-none z-[80]">
        {apps.map(app => (
          <Window 
            key={app.id} app={app} constraintsRef={desktopRef} isMobile={isMobile}
            onClose={() => closeApp(app.id)} onMinimise={() => minimiseApp(app.id)} 
            onMaximise={() => maximiseApp(app.id)} onFocus={() => focusApp(app.id)}
            content={getAppContent(app.id)}
          />
        ))}
      </div>

      <Dock apps={apps} openApp={openApp} showAppDrawer={showAppDrawer} setShowAppDrawer={setShowAppDrawer} />
    </div>
  );
};
