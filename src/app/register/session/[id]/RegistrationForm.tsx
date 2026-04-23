'use client';

import { addRegistration, checkRegistrationExists } from '@/firebase/api';
import { useState, ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function RegisterForm({ sessionId }: { sessionId: string }) {

    const [status, setStatus] = useState<"success" | "error" | "loading" | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [form, setForm] = useState({
        name: "",
        email: "",
        organization: "",
        faculty: "",
        phone: "",
        hasAwsAccount: "",
        thoughts: "",
        isIeeeMember: "",
        ieeeId: ""
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!sessionId) {
            setStatus("error");
            return;
        }

        try {
            setStatus("loading");

            // Check for existing registration
            const exists = await checkRegistrationExists(form.email, sessionId);
            if (exists) {
                setStatus("error");
                setErrorMessage("Handshake conflict: A registration with this email already exists for this session.");
                return;
            }

            await addRegistration({
                ...form,
                sessionId
            });

            setStatus("success");

            // Reset form
            setForm({
                name: "",
                email: "",
                organization: "",
                faculty: "",
                phone: "",
                hasAwsAccount: "",
                thoughts: "",
                isIeeeMember: "",
                ieeeId: ""
            });

        } catch (error: any) {
            console.error("Error registering user", error);
            setStatus("error");
            if (error.code === 'already-exists' || (error.message && error.message.includes('already exists'))) {
                setErrorMessage("Handshake conflict: A registration with this signature already exists.");
            } else {
                setErrorMessage("Protocol Failure. Please verify data and retry.");
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Form Banner */}
            <div className="mb-12 w-full overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl relative aspect-[16/9] md:aspect-[5/1]">
                <Image 
                    src="/hero-visual.png" 
                    alt="Session Banner" 
                    fill 
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-4 md:bottom-8 left-6 md:left-10 right-6 md:right-10">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-blue-300 backdrop-blur-md">
                            Cloud Excellence
                        </span>
                        <div className="h-1 w-1 rounded-full bg-white/20" />
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Protocol V2.0</span>
                    </div>
                    <h2 className="text-lg md:text-3xl font-black text-white tracking-tight uppercase leading-tight">Getting into the cloud with AWS</h2>
                </div>
            </div>

            <GlassCard className="relative rounded-[3rem] border-white/10 bg-[#09090b]/80 shadow-2xl backdrop-blur-3xl p-6 md:p-16">
                
                {/* Session Intel Block (Hidden for now)
                <div className="mb-12 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 border-b border-white/5 pb-12">
                    <div className="space-y-1">
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Speaker</span>
                        <p className="text-sm font-bold text-white">Thrindu Kalhara</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Date</span>
                        <p className="text-sm font-bold text-white">April 26</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Time</span>
                        <p className="text-sm font-bold text-white">7:00 - 9:00 PM</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Medium</span>
                        <p className="text-sm font-bold text-white">Zoom</p>
                    </div>
                </div>
                */}
                
                {/* Header */}
                <div className="mb-16 border-b border-white/5 pb-12">
                    <div className="flex flex-wrap items-end justify-between gap-6 mb-6">
                       <div>
                          <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none mb-4">
                             Delegate <span className="text-blue-500">Registration</span>
                          </h1>
                          <p className="text-slate-400 leading-relaxed max-w-xl text-lg">
                              Fill this form out to register yourselves. Learn and get hands on experience in cloud base projects.
                          </p>
                       </div>
                       <div className="px-5 py-2 bg-blue-500/10 border border-blue-500/20 rounded-2xl backdrop-blur-md">
                          <span className="text-xs font-black text-blue-400 uppercase tracking-[0.2em]">Session: {sessionId}</span>
                       </div>
                    </div>
                    <div className="flex items-center gap-2 text-red-500/80 text-[10px] font-black uppercase tracking-widest">
                       <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                       <span>* Indicates required question</span>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-12">
                    
                    {/* Identity Segment */}
                    <div className="space-y-8">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500/60 ml-1">01. Identity Matrix</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-3">
                                <label className="block text-sm font-bold text-slate-200 ml-1">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    required
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all placeholder:text-slate-600"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="block text-sm font-bold text-slate-200 ml-1">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="your.name@example.com"
                                    required
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all placeholder:text-slate-600"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Academic Segment */}
                    <div className="space-y-8">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500/60 ml-1">02. Academic Background</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-3">
                                <label className="block text-sm font-bold text-slate-200 ml-1">
                                    University / Institute <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="organization"
                                    value={form.organization}
                                    onChange={handleChange}
                                    placeholder="e.g. University of Sri Jayewardenepura"
                                    required
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all placeholder:text-slate-600"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="block text-sm font-bold text-slate-200 ml-1">
                                    Faculty <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="faculty"
                                    value={form.faculty}
                                    onChange={handleChange}
                                    placeholder="e.g. Faculty of Applied Sciences"
                                    required
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all placeholder:text-slate-600"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Connectivity Segment */}
                    <div className="space-y-8">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500/60 ml-1">03. Connectivity</h3>
                        <div className="grid grid-cols-1 gap-10">
                            <div className="space-y-3">
                                <label className="block text-sm font-bold text-slate-200 ml-1">
                                    WhatsApp Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="+94 7X XXX XXXX"
                                    required
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all placeholder:text-slate-600"
                                />
                            </div>
                        </div>
                    </div>

                    {/* IEEE Membership Segment */}
                    <div className="space-y-8">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500/60 ml-1">04. IEEE Membership</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-3">
                                <label className="block text-sm font-bold text-slate-200 ml-1">
                                    Are you an IEEE Member? <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="isIeeeMember"
                                    value={form.isIeeeMember}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-[#0c0c0e] border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
                                >
                                    <option value="" disabled className="text-slate-600">Select an option</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>

                            <AnimatePresence>
                                {form.isIeeeMember === "Yes" && (
                                    <motion.div 
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="space-y-3"
                                    >
                                        <label className="block text-sm font-bold text-slate-200 ml-1">
                                            IEEE Membership ID <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="ieeeId"
                                            value={form.ieeeId}
                                            onChange={handleChange}
                                            placeholder="Enter your IEEE ID"
                                            required={form.isIeeeMember === "Yes"}
                                            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all placeholder:text-slate-600"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Logistics & Cloud Readiness */}
                    <div className="space-y-8">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500/60 ml-1">05. Logistics & Readiness</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-3">
                                <label className="block text-sm font-bold text-slate-200 ml-1">
                                    Do you have an AWS account? <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="hasAwsAccount"
                                    value={form.hasAwsAccount}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-[#0c0c0e] border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
                                >
                                    <option value="" disabled className="text-slate-600">Select an option</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Feedback Segment */}
                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-slate-200 ml-1">
                            Share your thoughts on Cloud Computing
                        </label>
                        <textarea
                            name="thoughts"
                            value={form.thoughts}
                            onChange={handleChange}
                            placeholder="Your insights, expectations or questions..."
                            rows={4}
                            className="w-full bg-white/[0.03] border border-white/5 rounded-[2rem] px-8 py-6 text-white outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all placeholder:text-slate-600 resize-none"
                        />
                    </div>

                    {/* Submit Button & Feedback */}
                    <div className="pt-8">
                        <button
                            type="submit"
                            disabled={status === "loading"}
                            className="w-full bg-white text-black font-black py-6 rounded-[2rem] hover:bg-slate-200 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)] uppercase tracking-[0.2em] text-sm active:scale-[0.98] flex items-center justify-center gap-3 group"
                        >
                            {status === "loading" ? (
                                <>Processing Entry... <Loader2 size={20} className="animate-spin" /></>
                            ) : (
                                <>Submit Registration <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400 }}>→</motion.div></>
                            )}
                        </button>

                        <AnimatePresence>
                            {status === "success" && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex items-center justify-center gap-3 mt-10 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem] text-emerald-400 text-sm font-bold"
                                >
                                    <CheckCircle2 size={22} />
                                    <span>Handshake Successful. You are registered!</span>
                                </motion.div>
                            )}

                             {status === "error" && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex items-center justify-center gap-3 mt-10 p-6 bg-red-500/10 border border-red-500/20 rounded-[2rem] text-red-400 text-sm font-bold"
                                >
                                    <AlertCircle size={22} />
                                    <span>{errorMessage || "Protocol Failure. Please verify data and retry."}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </form>
            </GlassCard>

            <div className="mt-12 text-center pb-12">
                <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.4em] opacity-50">
                    BOC-SESSION-UPLINK-ESTABLISHED · NODE: SL-USJ-01
                </p>
            </div>
        </div>
    );
}
