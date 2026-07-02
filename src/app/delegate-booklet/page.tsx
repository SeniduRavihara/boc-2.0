'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { RegistrationLayout } from "@/components/layout/RegistrationLayout";
import { ArrowLeft, Download, BookOpen } from 'lucide-react';

const PDF_PATH = '/booklet/boc2-delegate-booklet.pdf';
const PDF_FILENAME = 'Beauty_of_Cloud_2.0_Delegate_Booklet.pdf';

export default function DelegateBookletPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <RegistrationLayout>
      <div className="max-w-5xl mx-auto px-0 sm:px-4">

        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-slate-400 hover:text-white uppercase transition-colors group w-fit"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </Link>

          <div className="flex gap-2">
            <a
              href={PDF_PATH}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 active:scale-95 font-bold tracking-wider text-[10px] uppercase text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] sm:hover:scale-105 transition-all"
            >
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">Open PDF</span>
            </a>

            <a
              href={PDF_PATH}
              download={PDF_FILENAME}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 active:scale-95 font-bold tracking-wider text-[10px] uppercase text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] sm:hover:scale-105 transition-all"
            >
              <Download className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">Download</span>
            </a>
          </div>
        </div>

        {/* PDF Viewer — rendered inline on both mobile and desktop.
            Mobile gets a tall portrait-friendly box instead of the wide
            16:10 box, since a phone screen is narrow, not wide. */}
        <div
          className={
            isMobile
              ? "relative w-full h-[75vh] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#050812]"
              : "relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#050812]"
          }
        >
          <iframe
            src={PDF_PATH}
            className="w-full h-full"
            title="Delegate Booklet"
          />
        </div>

      </div>
    </RegistrationLayout>
  );
}