'use client';

import React from 'react';
import { AppId, AppState } from './types';

interface DockProps {
  apps: AppState[];
  openApp: (id: AppId) => void;
  showAppDrawer: boolean;
  setShowAppDrawer: (v: boolean) => void;
}

export const Dock: React.FC<DockProps> = ({ apps, openApp, showAppDrawer, setShowAppDrawer }) => {
  const dockItems = [
    { id: 'viewer', icon: "/linux-icons/apps/48/internet-web-browser.svg", label: 'About BOC' },
    { id: 'files', icon: "/linux-icons/apps/48/system-file-manager.svg", label: 'Files' },
    { id: 'terminal', icon: "/linux-icons/apps/48/utilities-terminal.svg", label: 'Terminal' },
  ];

  return (
    <div className="absolute left-0 top-9 md:top-7 bottom-0 w-14 z-[120] py-4 bg-[#111111]/85 backdrop-blur-3xl border-r border-white/10 flex flex-col items-center justify-between shadow-2xl transition-all duration-300">
      {/* Top: App list */}
      <div className="flex flex-col gap-3 items-center w-full">
        {dockItems.map((item, i) => {
          const appState = apps.find(a => a.id === item.id);
          const isRunning = appState?.isOpen;
          const isFocused = isRunning && !appState?.isMinimised && appState?.zIndex === Math.max(...apps.map(a => a.zIndex));

          return (
            <div 
              key={i} 
              onClick={() => openApp(item.id as AppId)}
              className="relative group flex items-center justify-center w-full"
            >
              {/* Running indicator on the left side of the icon */}
              {isRunning && (
                <div className="absolute left-0.5 w-1 h-3 rounded-r-md bg-white/80 animate-pulse" />
              )}
              
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${isFocused ? 'bg-white/15 shadow-inner' : 'hover:bg-white/10'}`}>
                <img src={item.icon} alt={item.label} className="w-6.5 h-6.5 object-contain drop-shadow-md" />
              </div>

              {/* Tooltip */}
              <div className="absolute left-16 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity font-mono pointer-events-none whitespace-nowrap shadow-md z-[130]">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Bottom: Utilities */}
      <div className="flex flex-col gap-3 items-center w-full">
        <div className="w-8 h-[1px] bg-white/20" />
        
        {/* Trash App Button */}
        <div 
          onClick={() => openApp('trash')}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer hover:bg-white/10 group relative ${apps.find(a => a.id === 'trash')?.isOpen ? 'bg-white/15' : ''}`}
        >
          {/* Running indicator */}
          {apps.find(a => a.id === 'trash')?.isOpen && (
            <div className="absolute left-0.5 w-1 h-3 rounded-r-md bg-white/80" />
          )}
          <svg viewBox="0 0 24 24" className="w-5.5 h-5.5 text-rose-500/90 drop-shadow-md" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
          <div className="absolute left-16 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity font-mono pointer-events-none whitespace-nowrap shadow-md z-[130]">
            Trash
          </div>
        </div>

        {/* Show Apps Button */}
        <div 
          onClick={() => setShowAppDrawer(!showAppDrawer)}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${showAppDrawer ? 'bg-white/20 shadow-inner' : 'hover:bg-white/10'} group relative`}
        >
          <img src="/linux-icons/apps/48/appgrid.svg" alt="Show Apps" className="w-6.5 h-6.5 object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
          <div className="absolute left-16 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity font-mono pointer-events-none whitespace-nowrap shadow-md z-[130]">
            Show Applications
          </div>
        </div>
      </div>
    </div>
  );
};
