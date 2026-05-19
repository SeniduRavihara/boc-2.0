"use client";

import React from "react";
import { motion } from "framer-motion";
import { GradientShinyTitle } from "@/components/ui/GradientShinyTitle";

const PRIZES = [
  {
    rank: "2",
    place: "2nd",
    title: "SECOND PLACE",
    amount: "Rs. 20,000",
    color: "#ffffff",
    headerBg: "bg-white",
    headerText: "text-[#7c7c77]",
    bodyBg: "bg-gradient-to-b from-[#323232] to-[#1e1e1e]",
    bodyText: "text-white",
    borderColor: "border-white/20",
    cardHeight: "h-[260px] md:h-[400px]",
    headerHeight: "h-[110px] md:h-[150px]",
    numSize: "text-6xl md:text-8xl",
    glow: "rgba(255, 255, 255, 0.15)",
  },
  {
    rank: "1",
    place: "1st",
    title: "FIRST PLACE",
    amount: "Rs. 30,000",
    featured: true,
    color: "#ffcc00",
    headerBg: "bg-[#ffcc00]",
    headerText: "text-[#8a6800]",
    bodyBg: "bg-gradient-to-b from-[#2e2a14] to-[#12110a]",
    bodyText: "text-[#ffcc00]",
    borderColor: "border-[#ffcc00]/40",
    cardHeight: "h-[320px] md:h-[460px]",
    headerHeight: "h-[135px] md:h-[180px]",
    numSize: "text-7xl md:text-9xl",
    glow: "rgba(255, 204, 0, 0.3)",
  },
  {
    rank: "3",
    place: "3rd",
    title: "THIRD PLACE",
    amount: "Rs. 10,000",
    color: "#c15206",
    headerBg: "bg-[#c15206]",
    headerText: "text-[#5e2000]",
    bodyBg: "bg-gradient-to-b from-[#2a170f] to-[#120a06]",
    bodyText: "text-[#e06615]",
    borderColor: "border-[#c15206]/40",
    cardHeight: "h-[220px] md:h-[340px]",
    headerHeight: "h-[90px] md:h-[120px]",
    numSize: "text-5xl md:text-7xl",
    glow: "rgba(193, 82, 6, 0.15)",
  },
];

export function PrizePool() {
  return (
    <section id="prizes" className="relative py-32 bg-[#020617] overflow-hidden border-y border-white/5">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-reglo text-5xl md:text-7xl font-black tracking-tighter mb-8"
          >
            <GradientShinyTitle text="The Reward." speed={2} delay={0.5} />
          </motion.h2>

          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "120px" }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="h-1 bg-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)] mx-auto"
          />
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-end justify-center gap-6 lg:gap-8 w-full max-w-4xl mx-auto">
          {PRIZES.map((prize, idx) => (
            <motion.div
              key={prize.place}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className={`relative group w-full max-w-[280px] flex flex-col ${prize.cardHeight} ${
                prize.featured ? "order-1 md:order-2" : idx === 0 ? "order-2 md:order-1" : "order-3"
              }`}
            >
              {/* Glow Effect */}
              <div
                className="absolute inset-0 rounded-2xl blur-xl transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                style={{ backgroundColor: prize.glow }}
              />

              {/* Main Card Container */}
              <div
                className={`relative rounded-2xl border ${prize.borderColor} overflow-hidden h-full flex flex-col bg-black/40 backdrop-blur-xl transition-all duration-500`}
              >
                {/* Top Header */}
                <div className={`w-full ${prize.headerBg} ${prize.headerHeight} flex flex-col items-center justify-center p-4`}>
                  <span className={`font-black ${prize.numSize} leading-none tracking-tighter ${prize.headerText}`}>
                    {prize.rank}
                  </span>
                  <span className={`font-black tracking-widest text-[10px] md:text-xs uppercase mt-2 ${prize.headerText}`}>
                    {prize.title}
                  </span>
                </div>

                {/* Bottom Content */}
                <div className={`flex-1 ${prize.bodyBg} flex flex-col items-center justify-center p-6 text-center gap-1`}>
                  <div className={`text-2xl md:text-3xl font-black tracking-tight ${prize.bodyText}`}>
                    {prize.amount}
                  </div>

                  <div className={`text-lg md:text-xl font-black ${prize.bodyText}`}>
                    +
                  </div>

                  <div className={`text-xs md:text-sm font-black tracking-widest uppercase ${prize.bodyText}`}>
                    Digital Certificate
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-16 text-center max-w-2xl mx-auto px-4"
        >
          <p className="text-slate-400 text-xs md:text-sm leading-relaxed uppercase tracking-widest font-mono">
            ★ All participating delegates will be awarded official <span className="text-blue-400 font-bold">Digital Certificates</span> of participation to recognize their cloud innovation. ★
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-20 text-center text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em]"
        >
          * Terms and conditions apply. Awards subject to final evaluation.
        </motion.p>
      </div>
    </section>
  );
}
