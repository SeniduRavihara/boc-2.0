"use client";

import TripleReveal from "@/components/landing/TripleReveal";
import { FOOTER_BODY } from "@/components/landing/content";
import GradualBlur from "@/components/ui/GradualBlur";
import { ShieldCheck } from "lucide-react";

export default function FooterSection({ onAdminClick }: { onAdminClick: () => void }) {
  return (
    <section className="boc-section boc-endnote js-footer-stage">
      <div className="boc-footer-box">
        <h2 className="boc-footer-title js-footer-title">CLOUD IDEAS. REAL IMPACT.</h2>

        <TripleReveal
          wrapperClassName="boc-endnote-wrap"
          textClassName="boc-endnote-text"
        >
          {FOOTER_BODY}
        </TripleReveal>

        <GradualBlur
          target="parent"
          position="bottom"
          height="7rem"
          strength={2.2}
          divCount={6}
          curve="bezier"
          exponential
          opacity={1}
          className="boc-footer-blur"
        />

        {/* Unified Footer Tools */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-6 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
          <a 
            href="/landing-page" 
            className="text-[9px] uppercase font-black tracking-[0.2em] text-slate-500 hover:text-blue-500 transition-colors"
          >
            Experimental V2
          </a>
          
          <div className="w-[1px] h-3 bg-white/10" />

          <button
            onClick={onAdminClick}
            className="group flex items-center gap-2 transition-all duration-300"
          >
            <ShieldCheck size={12} className="text-slate-500 group-hover:text-purple-400 transition-colors" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-white transition-colors">
              Admin Terminal
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
