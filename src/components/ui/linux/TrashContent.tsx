'use client';

import React, { useState } from 'react';
import { FileText, Image as ImageIcon, Video, FileSpreadsheet, ArrowLeft, RefreshCw, Trash2 } from 'lucide-react';

interface TrashItem {
  name: string;
  type: 'video' | 'image' | 'text' | 'spreadsheet';
  size: string;
  icon: React.ReactNode;
}

export const TrashContent: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<TrashItem | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const trashItems: TrashItem[] = [
    {
      name: 'boc-teaser-v1.mp4',
      type: 'video',
      size: '42.1 MB',
      icon: <Video className="w-10 h-10 text-rose-400" />
    },
    {
      name: 'quiz-answers-leaked.txt',
      type: 'text',
      size: '1.2 KB',
      icon: <FileText className="w-10 h-10 text-amber-400" />
    },
    {
      name: 'logo-draft-old.png',
      type: 'image',
      size: '850 KB',
      icon: <ImageIcon className="w-10 h-10 text-emerald-400" />
    },
    {
      name: 'boc-budget-v2.xlsx',
      type: 'spreadsheet',
      size: '115 KB',
      icon: <FileSpreadsheet className="w-10 h-10 text-teal-400" />
    }
  ];

  const handleDoubleClick = (item: TrashItem) => {
    setSelectedItem(item);
    setPreviewOpen(true);
  };

  const renderPreview = () => {
    if (!selectedItem) return null;

    switch (selectedItem.type) {
      case 'video':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-black/80 rounded-lg">
            <h3 className="text-white text-xs font-mono mb-2">{selectedItem.name}</h3>
            <div className="w-full aspect-video rounded overflow-hidden relative bg-black border border-white/10">
              <iframe
                src="https://www.youtube.com/embed/HyHeBfZtIzg"
                title={selectedItem.name}
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        );
      case 'text':
        return (
          <div className="w-full h-full p-4 bg-zinc-900 text-zinc-300 font-mono text-[11px] rounded-lg border border-white/5 overflow-y-auto leading-relaxed">
            <h3 className="text-white text-xs border-b border-white/10 pb-2 mb-2">{selectedItem.name}</h3>
            <p className="text-amber-500/90 mb-2"># MOCK QUIZ ANSWERS LEAKED</p>
            <p className="mb-1">Q1: What is the main characteristic of serverless computing?</p>
            <p className="text-emerald-400 mb-2">A: Automatically scaling infrastructure based on request volume (No servers to manage directly).</p>
            <p className="mb-1">Q2: Which AWS service is best suited for hosting static websites at minimal cost?</p>
            <p className="text-emerald-400 mb-2">A: Amazon S3 combined with CloudFront CDN.</p>
            <p className="mb-1">Q3: What is the purpose of Docker multi-stage builds?</p>
            <p className="text-emerald-400">A: To minimize the final container image size by discarding build-time dependencies.</p>
          </div>
        );
      case 'image':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-zinc-900/60 rounded-lg">
            <h3 className="text-white text-xs font-mono mb-2">{selectedItem.name}</h3>
            <div className="relative w-36 h-36 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center p-2">
              <img src="/email-and-header/boc.webp" alt="Preview Logo" className="w-28 h-28 object-contain opacity-80" />
            </div>
            <span className="text-[10px] text-zinc-500 mt-2 font-mono">Dimensions: 512 x 512 | PNG format</span>
          </div>
        );
      case 'spreadsheet':
        return (
          <div className="w-full h-full flex flex-col p-4 bg-zinc-900 text-zinc-300 rounded-lg border border-white/5 overflow-x-auto">
            <h3 className="text-white text-xs border-b border-white/10 pb-2 mb-2 font-mono">{selectedItem.name}</h3>
            <table className="w-full text-[10px] font-mono text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-white/50">
                  <th className="py-1 pr-4">Category</th>
                  <th className="py-1 pr-4">Item</th>
                  <th className="py-1">Est. Cost (LKR)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5">
                  <td className="py-1 pr-4 text-teal-400">Prizes</td>
                  <td className="py-1 pr-4">1st Place Prize Pool</td>
                  <td className="py-1">150,000.00</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-1 pr-4 text-teal-400">Logistics</td>
                  <td className="py-1 pr-4">Venue & AV Setup</td>
                  <td className="py-1">75,000.00</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-1 pr-4 text-teal-400">Marketing</td>
                  <td className="py-1 pr-4">Stickers & Merch Pack</td>
                  <td className="py-1">45,000.00</td>
                </tr>
                <tr>
                  <td className="py-1 pr-4 text-teal-400">Catering</td>
                  <td className="py-1 pr-4">Mentors & Delegates Meals</td>
                  <td className="py-1">90,000.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
    }
  };

  return (
    <div className="h-full bg-[#181824] flex flex-col select-none text-slate-100 font-sans relative">
      {/* File Explorer Header */}
      <div className="h-10 bg-[#1e1e2f] border-b border-white/5 flex items-center px-4 justify-between">
        <div className="flex items-center gap-2 text-xs font-mono text-white/50">
          <Trash2 className="w-3.5 h-3.5 text-rose-500" />
          <span>trash://</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-[10px] font-mono text-white/70 hover:text-white transition-colors border border-white/5">
            <RefreshCw className="w-3 h-3" /> Restore All
          </button>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        {previewOpen ? (
          <div className="h-full flex flex-col">
            <button 
              onClick={() => setPreviewOpen(false)}
              className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white mb-4 bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded w-fit transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Trash
            </button>
            <div className="flex-1">
              {renderPreview()}
            </div>
          </div>
        ) : (
          <div>
            <p className="text-[10px] text-zinc-500 font-mono mb-4 uppercase tracking-wider">Deleted items in trash bin (Double-click to open/preview):</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {trashItems.map((item, idx) => (
                <div
                  key={idx}
                  onDoubleClick={() => handleDoubleClick(item)}
                  onTouchEnd={() => handleDoubleClick(item)} // Double-tap helper for mobile
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-white/10 transition-all cursor-pointer group text-center"
                >
                  <div className="mb-3 transform group-hover:scale-105 transition-transform">
                    {item.icon}
                  </div>
                  <span className="text-[11px] font-medium text-white/90 truncate max-w-full px-1">{item.name}</span>
                  <span className="text-[9px] text-zinc-500 mt-1 font-mono">{item.size}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
