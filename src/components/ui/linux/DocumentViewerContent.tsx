'use client';

import React from 'react';
import { Search, FileText } from 'lucide-react';

export const DocumentViewerContent: React.FC = () => {
  return (
    <div className="h-full bg-[#3d3d3d] flex flex-col select-none">
      <div className="h-10 bg-[#2d2d2d] border-b border-black/20 flex items-center px-4 justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded text-white/70 text-xs">
            <FileText className="w-3.5 h-3.5" />
            <span>about-boc-2.pdf</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-white/50">
          <Search className="w-4 h-4" />
          <div className="h-4 w-[1px] bg-white/10" />
          <div className="flex items-center gap-2 text-xs font-medium">
            <span>1 / 1</span>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-[#1e1e1e]/50">
        <div className="w-full max-w-2xl bg-white shadow-2xl p-12 min-h-[800px] text-gray-800 font-sans">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h1 className="text-3xl font-bold text-blue-600 mb-1">Beauty of Cloud 2.0</h1>
              <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">Inter-University Cloud Ideathon</p>
            </div>
            <img src="/linux-icons/apps/48/internet-web-browser.svg" className="w-12 h-12 grayscale opacity-20" />
          </div>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-lg font-bold border-b-2 border-blue-100 pb-2 mb-4">Introduction</h2>
              <p className="leading-relaxed">
                Beauty of Cloud 2.0 is Sri Lanka's first student-led inter-university cloud ideathon, returning for its second edition. This initiative brings together the brightest minds from universities across the island to solve critical real-world problems using cloud technologies.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold border-b-2 border-blue-100 pb-2 mb-4">Vision & Mission</h2>
              <p className="leading-relaxed mb-4">
                Our vision is to foster a culture of innovation and excellence in cloud computing among the Sri Lankan student community.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Empower students with industry-level cloud expertise.</li>
                <li>Bridge the gap between academic learning and industrial application.</li>
                <li>Create a platform for sustainable, scalable technological solutions.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold border-b-2 border-blue-100 pb-2 mb-4">Event Theme</h2>
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 italic text-blue-900">
                "Cloud Innovation for a Sustainable Future: Scaling impact through distributed computing and intelligent architecture."
              </div>
            </section>

            <section className="pt-12 mt-12 border-t border-gray-100">
              <div className="flex justify-between items-end">
                <div className="text-xs text-gray-400 font-mono">
                  REF: BOC-2026-X01<br />
                  CONFIDENTIAL DOCUMENT
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-600">The BOC Organizing Committee</p>
                  <p className="text-xs text-gray-400">Sri Lanka Business Platform</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
