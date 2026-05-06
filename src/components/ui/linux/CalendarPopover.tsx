'use client';

import React from 'react';
import { Camera, ChevronRight, X, Monitor, ChevronLeft } from 'lucide-react';

interface CalendarPopoverProps {
  show: boolean;
  time: Date;
}

export const CalendarPopover: React.FC<CalendarPopoverProps> = ({ show, time }) => {
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

        {/* Events Block */}
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5 mb-2">
          <p className="text-white/80 text-sm font-medium mb-1">Today</p>
          <p className="text-white/40 text-sm italic">No Events</p>
        </div>

        {/* World Clocks */}
        <div className="bg-white/5 rounded-2xl p-3 border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
          <p className="text-white/80 text-sm font-medium">Add world clocks...</p>
        </div>
      </div>
    </div>
  );
};
