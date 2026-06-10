'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { AppId } from './types';

interface AppDrawerProps {
  show: boolean;
  onClose: () => void;
  onOpenApp: (id: AppId) => void;
}

export const AppDrawer: React.FC<AppDrawerProps> = ({ show, onClose, onOpenApp }) => {
  if (!show) return null;

  const appCategories = [
    { id: 'viewer', name: 'About BOC 2.0', icon: "/linux-icons/apps/48/internet-web-browser.svg", isSvg: true },
    { id: 'files', name: 'Files', icon: "/linux-icons/apps/48/system-file-manager.svg", isSvg: true },
    { id: 'terminal', name: 'Terminal', icon: "/linux-icons/apps/48/utilities-terminal.svg", isSvg: true },
    { id: 'trash', name: 'Trash', icon: 'trash', isSvg: false },
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
              {app.isSvg ? (
                <img src={app.icon} alt={app.name} className="w-10 h-10 md:w-12 md:h-12 object-contain" />
              ) : (
                <svg viewBox="0 0 24 24" className="w-10 h-10 md:w-12 md:h-12 text-rose-500/95" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              )}
            </div>
            <span className="text-white/80 text-xs md:text-sm font-medium drop-shadow-md text-center">{app.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
