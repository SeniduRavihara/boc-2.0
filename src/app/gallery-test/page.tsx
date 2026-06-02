'use client';

import React from 'react';
import Link from 'next/link';
import { Home } from 'lucide-react';
import { PortalGalleryEntrance } from '@/components/sections/PortalGalleryEntrance';

export default function GalleryTestPage() {
  return (
    <main className="bg-[#020617] text-white min-h-screen relative font-sans">
      
      {/* Render only the new premium portal entrance gallery */}
      <PortalGalleryEntrance />

      {/* Floating Home Link */}
      <div className="fixed bottom-6 right-6 z-[100]">
        <Link 
          href="/" 
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 border border-blue-400/30 rounded-full text-xs font-mono uppercase font-bold tracking-widest shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all hover:scale-105"
        >
          <Home className="w-4 h-4" /> Return to Home
        </Link>
      </div>

    </main>
  );
}
