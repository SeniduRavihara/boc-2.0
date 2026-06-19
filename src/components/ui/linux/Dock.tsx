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
    { id: 'browser', icon: "/linux-icons/apps/48/internet-web-browser.svg", label: 'Browser' },
    { id: 'files', icon: "/linux-icons/apps/48/system-file-manager.svg", label: 'Files' },
    { id: 'editor', icon: "/linux-icons/apps/48/text-editor.svg", label: 'Code' },
    { id: 'terminal', icon: "/linux-icons/apps/48/utilities-terminal.svg", label: 'Terminal' },
    { id: 'viewer', icon: "/linux-icons/apps/48/internet-web-browser.svg", label: 'About' },
  ];

  return (
    <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 z-[120] px-2 py-1.5 bg-[#1e1e1e]/80 backdrop-blur-3xl border border-white/10 rounded-[24px] flex items-center gap-1 md:gap-2 shadow-2xl transition-all duration-300 opacity-100 scale-100">
      {dockItems.map((item, i) => {
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
            {/* Running indicator */}
            {isRunning && (
              <div className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-white/80" />
            )}
          </div>
        );
      })}
      
      {/* Divider */}
      <div className="w-[1px] h-8 bg-white/20 mx-1" />
      
      {/* Show Apps Button */}
      <div 
        onClick={() => setShowAppDrawer(!showAppDrawer)}
        className={`w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all cursor-pointer ${showAppDrawer ? 'bg-white/20 shadow-inner' : 'hover:bg-white/10'} group relative`}
      >
        <img src="/linux-icons/apps/48/appgrid.svg" alt="Show Apps" className="w-7 h-7 md:w-8 md:h-8 object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
};
