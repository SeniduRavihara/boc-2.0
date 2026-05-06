'use client';

import React, { useRef, useCallback } from 'react';
import { AppState } from './types';

interface WindowProps {
  app: AppState;
  constraintsRef?: React.RefObject<HTMLDivElement | null>;
  isMobile: boolean;
  onClose: () => void;
  onMinimise: () => void;
  onMaximise: () => void;
  onFocus: () => void;
  content: React.ReactNode;
}

export const Window: React.FC<WindowProps> = ({
  app,
  constraintsRef,
  isMobile,
  onClose,
  onMinimise,
  onMaximise,
  onFocus,
  content,
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
