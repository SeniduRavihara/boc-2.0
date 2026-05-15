"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trophy, Award, Medal, Star } from "lucide-react";
import { GradientShinyTitle } from "@/components/ui/GradientShinyTitle";

const PRIZES = [
  {
    rank: "2nd",
    title: "Runner Up",
    amount: "LKR 75,000",
    icon: Award,
    color: "from-slate-400 to-slate-600",
    glow: "rgba(148, 163, 184, 0.2)",
    features: ["Cash Prize", "Certificate", "Tech Swag Box"],
  },
  {
    rank: "1st",
    title: "The Champion",
    amount: "LKR 100,000",
    icon: Trophy,
    color: "from-blue-400 to-blue-600",
    glow: "rgba(59, 130, 246, 0.4)",
    featured: true,
    features: [
      "Grand Cash Prize",
      "Winner Trophy",
      "Exclusive Internship Opportunity",
      "Premium Swag Pack",
    ],
  },
  {
    rank: "3rd",
    title: "Second Runner Up",
    amount: "LKR 50,000",
    icon: Medal,
    color: "from-amber-600 to-amber-800",
    glow: "rgba(180, 83, 9, 0.2)",
    features: ["Cash Prize", "Certificate", "BOC Swag Bag"],
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end max-w-6xl mx-auto">
          {PRIZES.map((prize, idx) => (
            <motion.div
              key={prize.rank}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className={`relative group ${
                prize.featured ? "md:pb-12 z-20 order-1 md:order-2" : idx === 0 ? "order-2 md:order-1" : "order-3"
              }`}
            >
              {/* Glow Effect */}
              <div
                className="absolute inset-0 rounded-[2.5rem] blur-2xl transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                style={{ backgroundColor: prize.glow }}
              />

              <div
                className={`relative h-full p-8 rounded-[2.5rem] border transition-all duration-500 ${
                  prize.featured
                    ? "bg-[#0a1229] border-blue-500/30 shadow-[0_0_40px_rgba(59,130,246,0.1)] py-12"
                    : "bg-[#050812] border-white/5 hover:border-white/10"
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${prize.color} flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-500`}
                  >
                    <prize.icon className="w-8 h-8 text-white" />
                  </div>

                  <span className="text-sm font-mono uppercase tracking-[0.3em] text-blue-500 mb-2">
                    {prize.rank} Place
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-1 uppercase tracking-tight">
                    {prize.title}
                  </h3>
                  <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 mb-8 tracking-tighter">
                    {prize.amount}
                  </div>

                  <div className="w-full space-y-3 pt-8 border-t border-white/5">
                    {prize.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-3 text-sm text-slate-400"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {prize.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-blue-600 text-[10px] font-bold uppercase tracking-[0.2em] text-white z-30">
                  Main Prize
                </div>
              )}
            </motion.div>
          ))}
        </div>

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
