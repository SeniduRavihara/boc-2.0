'use client';

import React from 'react';
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const Header: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-[100] px-6 md:px-12 py-4 md:py-6 flex justify-between items-center border-b border-white/5 bg-black/80">
      <div className="flex items-center gap-6">
        <motion.a 
          href="#" 
          className="relative w-40 h-10 md:w-56 md:h-14 block"
          whileHover={{ scale: 1.05 }}
        >
          <Image 
            src="/logo.png"
            alt="Beauty of Cloud Logo"
            fill
            className="object-contain"
            priority
          />
        </motion.a>
      </div>

      <div className="hidden lg:flex gap-16 text-[10px] font-black uppercase tracking-[0.4em] font-mono">
        <a href="#about" className="hover:text-accent transition-colors opacity-60 hover:opacity-100">— About</a>
        <a href="#schedule" className="hover:text-accent transition-colors opacity-60 hover:opacity-100 italic">— Timeline</a>
        <a href="#gallery" className="hover:text-accent transition-colors opacity-60 hover:opacity-100 italic">— Gallery</a>
        <a href="#experience" className="hover:text-accent transition-colors opacity-60 hover:opacity-100 italic">— History</a>
      </div>

      <Link href="/register/compitition">
        <motion.button 
          className="group relative px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-full overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_50px_rgba(59,130,246,0.5)] transition-shadow"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative z-10 flex items-center gap-2">
            Register Now <ChevronRight className="w-3 h-3" />
          </span>
          <div className="absolute inset-0 bg-blue-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
        </motion.button>
      </Link>
    </nav>
  );
};
