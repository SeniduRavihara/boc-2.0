'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const CreationOfAdamNodes: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30">
      <svg className="w-full h-full" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="streamAWS" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8"></stop>
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"></stop>
          </linearGradient>
          <linearGradient id="streamGCP" x1="1" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.8"></stop>
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0"></stop>
          </linearGradient>
        </defs>

        {/* Dynamic Connecting Lines */}
        <g>
          {/* Main Arches */}
          <motion.path 
            d="M 100 400 Q 400 100 700 400" 
            stroke="url(#streamAWS)" 
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <motion.path 
            d="M 700 400 Q 400 700 100 400" 
            stroke="url(#streamGCP)" 
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1 }}
          />
        </g>
        
        {/* Floating Nodes */}
        <g>
          {/* AWS Side Cluster */}
          <motion.circle 
            cx="150" cy="350" r="3" fill="#3b82f6" 
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.circle 
            cx="220" cy="280" r="2" fill="#3b82f6" 
            animate={{ scale: [1, 2, 1], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
          />
          
          {/* GCP Side Cluster */}
          <motion.circle 
            cx="650" cy="450" r="4" fill="#0ea5e9" 
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 3.5, repeat: Infinity }}
          />
          <motion.circle 
            cx="580" cy="520" r="2" fill="#0ea5e9" 
            animate={{ scale: [1, 1.8, 1], opacity: [0.2, 0.7, 0.2] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          />
        </g>

        {/* Central Hub */}
        <motion.circle 
          cx="400" cy="400" r="1.5" fill="white" 
          animate={{ opacity: [0.1, 0.5, 0.1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </svg>
    </div>
  );
};
