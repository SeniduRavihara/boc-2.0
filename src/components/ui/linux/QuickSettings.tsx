'use client';

import React from 'react';
import { Settings, Lock, Power, Wifi, Bluetooth, Activity, Sun, Moon, Plane, ChevronRight } from 'lucide-react';

interface QuickSettingsProps {
  show: boolean;
  brightness: number; 
  setBrightness: (v: number) => void;
  volume: number; 
  setVolume: (v: number) => void;
  wifiEnabled: boolean; 
  setWifiEnabled: (v: boolean) => void;
  bluetoothEnabled: boolean; 
  setBluetoothEnabled: (v: boolean) => void;
  powerMode: string; 
  setPowerMode: (v: string) => void;
  nightLight: boolean; 
  setNightLight: (v: boolean) => void;
  darkStyle: boolean; 
  setDarkStyle: (v: boolean) => void;
  airplaneMode: boolean; 
  setAirplaneMode: (v: boolean) => void;
}

export const QuickSettings: React.FC<QuickSettingsProps> = ({ 
  show, brightness, setBrightness, volume, setVolume,
  wifiEnabled, setWifiEnabled, bluetoothEnabled, setBluetoothEnabled,
  powerMode, setPowerMode, nightLight, setNightLight,
  darkStyle, setDarkStyle, airplaneMode, setAirplaneMode
}) => {
  if (!show) return null;

  const cyclePowerMode = () => {
    if (powerMode === 'Performance') setPowerMode('Balanced');
    else if (powerMode === 'Balanced') setPowerMode('Power Saver');
    else setPowerMode('Performance');
  };

  return (
    <div
      style={{ animation: 'popoverIn 0.15s ease-out forwards' }}
      className="absolute top-10 right-2 w-[calc(100vw-1rem)] max-w-[340px] bg-[#1e1e1e]/95 backdrop-blur-3xl rounded-[24px] shadow-2xl border border-white/10 p-4 z-[130]"
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
