'use client';

import React from 'react';
import { motion } from "framer-motion";

export const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center">
      <div className="relative">
        {/* SVG Animation Ported from Sample */}
        <svg width="240" height="240" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="filter drop-shadow-[0_0_30px_rgba(255,62,0,0.2)]">
          <style>
            {`
              .line-anim {
                stroke-dasharray: 40 200;
                stroke-dashoffset: 140;
                animation: drawLine 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
              }
              .face-anim {
                animation: facefloat 2.5s ease-in-out infinite;
              }
              @keyframes drawLine {
                0% { stroke-dashoffset: 240; }
                50% { stroke-dashoffset: 0; }
                100% { stroke-dashoffset: -240; }
              }
              @keyframes facefloat {
                0%, 100% { transform: translateY(-3px); }
                50% { transform: translateY(3px); }
              }
            `}
          </style>
          
          {/* Hexagonal Background Gradient */}
          <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M91.9257 2.81528C84.4183 -0.938425 75.5817 -0.938425 68.0743 2.81528L14.741 29.4819C5.70673 33.9991 0 43.2327 0 53.3333V106.667C0 116.767 5.70673 126.001 14.741 130.518L68.0743 157.185C75.5817 160.938 84.4183 160.938 91.9257 157.185L145.259 130.518C154.293 126.001 160 116.767 160 106.667V53.3333C160 43.2327 154.293 33.9991 145.259 29.4819L91.9257 2.81528Z" 
            fill="url(#loadingRadial)"
            className="opacity-50"
          />
          
          {/* Static Cloud Border */}
          <path 
            className="cloud" 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M77 56C86.5645 56 94.634 62.3946 97.1702 71.1414C98.8208 69.2189 101.267 68 104 68C108.971 68 113 72.0294 113 77C113 78.1425 112.784 79.234 112.396 80.2395C117.875 81.3497 122 86.193 122 92C122 98.6274 116.627 104 110 104H53C44.7157 104 38 97.2843 38 89C38 80.7157 44.7157 74 53 74C54.0866 74 55.146 74.116 56.167 74.3354C57.4763 63.9955 66.3046 56 77 56Z" 
            stroke="#18181B" 
            strokeWidth="5" 
            strokeLinejoin="round"
          />
          
          {/* Animated Line */}
          <path 
            className="line-anim" 
            d="M77 56C86.5645 56 94.634 62.3946 97.1702 71.1414C98.8208 69.2189 101.267 68 104 68C108.971 68 113 72.0294 113 77C113 78.1425 112.784 79.234 112.396 80.2395C117.875 81.3497 122 86.193 122 92C122 98.6274 116.627 104 110 104H53C44.7157 104 38 97.2843 38 89C38 80.7157 44.7157 74 53 74C54.0866 74 55.146 74.116 56.167 74.3354C57.4763 63.9955 66.3046 56 77 56Z" 
            stroke="#3b82f6" 
            strokeWidth="4" 
            strokeLinejoin="round" 
            fill="none"
          />
          
          {/* Floating Face */}
          <g className="face-anim">
            <path d="M75 87C76.5223 87.6989 78.2142 88 79.999 88C81.7837 88 83.4777 87.6989 85 87" stroke="#A1A1AA" strokeWidth="4" strokeLinecap="round"/>
            <circle cx="72" cy="78" r="2" fill="#A1A1AA"/>
            <circle cx="88" cy="78" r="2" fill="#A1A1AA"/>
          </g>
          
          <defs>
            <radialGradient id="loadingRadial">
              <stop offset="0%" stopColor="#18181B"/>
              <stop offset="100%" stopColor="#09090B"/>
            </radialGradient>
          </defs>
        </svg>

        {/* Loading Text */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[10px] font-mono tracking-[1em] uppercase opacity-40 text-white whitespace-nowrap animate-pulse">
           Initializing Cloud
        </div>
      </div>
    </div>
  );
};
