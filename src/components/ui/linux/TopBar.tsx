'use client';

import React from 'react';
import { Wifi } from 'lucide-react';

interface TopBarProps {
  showAppDrawer: boolean;
  setShowAppDrawer: (v: boolean) => void;
  showCalendar: boolean;
  setShowCalendar: (v: boolean) => void;
  showQuickSettings: boolean;
  setShowQuickSettings: (v: boolean) => void;
  dateStr: string;
  timeStr: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  showAppDrawer,
  setShowAppDrawer,
  showCalendar,
  setShowCalendar,
  showQuickSettings,
  setShowQuickSettings,
  dateStr,
  timeStr,
}) => {
  return (
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
        <img src="/linux-icons/status/16/audio-volume-high-symbolic.svg" alt="volume" className="w-4 h-4 brightness-0 invert" />
        <div className="flex items-center gap-1.5">
          <img src="/linux-icons/status/16/battery-100-symbolic.svg" alt="battery" className="w-5 h-5 brightness-0 invert" />
          <span className="hidden md:inline font-medium text-xs">100%</span>
        </div>
      </div>
    </div>
  );
};
