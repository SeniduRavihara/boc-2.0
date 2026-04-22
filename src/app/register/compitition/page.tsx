import React from 'react';
import { RegistrationLayout } from '@/components/layout/RegistrationLayout';
import Image from 'next/image';
import { GlassCard } from '@/components/ui/GlassCard';

/**
 * COMPETITION REGISTRATION PAGE
 * 
 * This page is used for delegate registration specifically for the competition.
 */

export default function CompetitionRegistrationPage() {

    return (
        <RegistrationLayout>
            <div className="max-w-3xl mx-auto">
                {/* Form Banner — Inspired by MazeX */}
                <div className="mb-12 w-full overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl relative aspect-[3/1]">
                    <Image 
                        src="/hero-visual.png" 
                        alt="Competition Banner" 
                        fill 
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-8">
                        <span className="inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-300 backdrop-blur-md mb-2">
                            Open for Entries
                        </span>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Competition Registration</h2>
                    </div>
                </div>

                {/* Registration Form Card */}
                <GlassCard className="relative overflow-hidden rounded-[2.5rem] border-white/10 bg-[#09090b]/80 shadow-2xl backdrop-blur-2xl p-8 md:p-12">
                    <div className="mb-12 border-b border-white/5 pb-8">
                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-4">
                            Join the <span className="text-purple-500">Cloud Challenge</span>
                        </h1>
                        <p className="text-slate-400 leading-relaxed max-w-xl">
                            Register your team now for the premier inter-university cloud computing ideathon. Prove your architecture skills and win amazing prizes.
                        </p>
                    </div>

                    <form className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-300 ml-1">Team Leader Name <span className="text-purple-500">*</span></label>
                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-300 ml-1">Email Address <span className="text-purple-500">*</span></label>
                                <input
                                    type="email"
                                    placeholder="leader@university.lk"
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-300 ml-1">University / Institute <span className="text-purple-500">*</span></label>
                            <input
                                type="text"
                                placeholder="Select or type your university"
                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-300 ml-1">Team Name</label>
                            <input
                                type="text"
                                placeholder="A creative cloud-themed name"
                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all"
                            />
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                className="w-full bg-white text-black font-black py-5 rounded-2xl hover:bg-slate-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] uppercase tracking-widest text-sm active:scale-[0.98]"
                            >
                                Submit Registration
                            </button>
                        </div>
                    </form>
                </GlassCard>

                <div className="mt-8 text-center">
                    <p className="text-slate-600 text-xs font-mono uppercase tracking-widest">
                        Closing on 2026/05/15 · Verifying Protocol SEC-2.0
                    </p>
                </div>
            </div>
        </RegistrationLayout>
    );
}
