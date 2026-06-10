'use client';

import React, { useRef, useCallback, useEffect } from 'react';
import { AppState, AppId } from './types';

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

  // Reset inline position styles when window is maximized or resized to mobile view
  useEffect(() => {
    const el = winRef.current;
    if (!el) return;
    if (app.isMaximised || isMobile) {
      el.style.left = '';
      el.style.top = '';
      el.style.transform = '';
    }
  }, [app.isMaximised, isMobile]);

  const onTitlePointerDown = useCallback((e: React.PointerEvent) => {
    if (isMobile || app.isMaximised) return;
    onFocus();
    const el = winRef.current;
    if (!el) return;
    
    // Use offsetLeft and offsetTop which are relative to the parent container
    dragPos.current = { 
      x: el.offsetLeft, 
      y: el.offsetTop, 
      startX: e.clientX, 
      startY: e.clientY, 
      dragging: true 
    };
    
    el.style.left = el.offsetLeft + 'px';
    el.style.top = el.offsetTop + 'px';
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
    
    // Bounds check using container client size
    const clientW = container.clientWidth;
    const clientH = container.clientHeight;
    
    // Allow dragging off-screen left/right, but keep at least 100px visible
    const minX = 100 - el.offsetWidth;
    const maxX = clientW - 100;
    
    // Keep title bar (height ~40px) below the top panel, and allow dragging down
    const minY = 0;
    const maxY = clientH - 40;
    
    const newX = Math.max(minX, Math.min(dragPos.current.x + dx, maxX));
    const newY = Math.max(minY, Math.min(dragPos.current.y + dy, maxY));
    
    el.style.left = newX + 'px';
    el.style.top = newY + 'px';
  }, [constraintsRef]);

  const onPointerUp = useCallback(() => {
    dragPos.current.dragging = false;
  }, []);

  if (!app.isOpen || app.isMinimised) return null;

  const getWindowSizeClass = (id: AppId) => {
    switch (id) {
      case 'viewer':
        return 'w-[94vw] md:w-[940px] h-[80vh] md:h-[600px]';
      case 'terminal':
        return 'w-[90vw] md:w-[680px] h-[62vh] md:h-[440px]';
      case 'files':
      case 'trash':
        return 'w-[90vw] md:w-[650px] h-[60vh] md:h-[440px]';
      default:
        return 'w-[90vw] md:w-[700px] h-[60vh] md:h-[450px]';
    }
  };

  return (
    <div
      ref={winRef}
      onMouseDown={onFocus}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{ zIndex: app.zIndex, animation: 'winOpen 0.15s ease-out forwards' }}
      className={`absolute ${
        app.isMaximised && !isMobile
          ? 'top-0 left-14 w-[calc(100%-3.5rem)] h-full rounded-none'
          : (isMobile
              ? 'top-0 left-0 w-full h-full rounded-none'
              : `top-10 md:top-14 left-[calc(50%+1.75rem)] -translate-x-1/2 ${getWindowSizeClass(app.id)} rounded-xl`
            )
      } bg-[#1e1e1e] shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col overflow-hidden pointer-events-auto`}
    >
      {/* Title Bar */}
      <div 
        className={`bg-[#2c2c2c] flex items-center justify-between px-4 select-none border-b border-black/40 ${isMobile ? 'h-12' : 'h-10 cursor-grab active:cursor-grabbing'}`}
        onDoubleClick={onMaximise}
        onPointerDown={onTitlePointerDown}
      >
        {/* Left: App Title */}
        <div className="flex items-center gap-2 select-none pointer-events-none">
          <span className="text-white/95 text-[13px] font-semibold tracking-wide font-mono">
            {app.title}
          </span>
        </div>

        {/* Right: Window Controls */}
        <div className="flex items-center gap-1.5">
          {/* Minimize */}
          <button 
            onClick={(e) => { e.stopPropagation(); onMinimise(); }} 
            onPointerDown={(e) => e.stopPropagation()}
            className="w-6.5 h-6.5 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors text-white/50 hover:text-white"
            title="Minimize"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          
          {/* Maximize */}
          <button 
            onClick={(e) => { e.stopPropagation(); onMaximise(); }} 
            onPointerDown={(e) => e.stopPropagation()}
            className={`w-6.5 h-6.5 rounded-full hover:bg-white/10 items-center justify-center transition-colors text-white/50 hover:text-white ${isMobile ? 'hidden' : 'flex'}`}
            title="Maximize"
          >
            <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <rect x="3" y="3" width="18" height="18" rx="1" />
            </svg>
          </button>
          
          {/* Close */}
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(); }} 
            onPointerDown={(e) => e.stopPropagation()}
            className="w-6.5 h-6.5 rounded-full hover:bg-[#e04f1a] flex items-center justify-center transition-colors text-white/50 hover:text-white"
            title="Close"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden relative">
        {content}
      </div>
    </div>
  );
};
