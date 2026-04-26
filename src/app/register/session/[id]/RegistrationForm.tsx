'use client';

import { addRegistration, checkRegistrationExists, checkUserRegistration } from '@/firebase/api';
import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function RegisterForm({ sessionId }: { sessionId: string }) {
    const searchParams = useSearchParams();

    const [status, setStatus] = useState<"success" | "error" | "loading" | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [step, setStep] = useState<'initial' | 'returning' | 'new'>('initial');
    const [returningUser, setReturningUser] = useState<any>(null);
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);
    
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

    // Check for returning user on mount or when session changes
    useEffect(() => {
        // Reset state for new session
        setStatus(null);
        setErrorMessage(null);
        setIsCheckingEmail(false);
        
        if (sessionId === "1") {
            setStep('new');
            setReturningUser(null);
            return;
        }

        const urlEmail = searchParams.get('email');
        const saved = localStorage.getItem('last_registered_user');
        
        if (urlEmail) {
            // Priority 1: Email from URL (likely coming from attendance redirect)
            setForm(prev => ({ ...prev, email: urlEmail }));
            setStep('initial');
        } else if (saved) {
            // Priority 2: Saved user from storage
            try {
                const userData = JSON.parse(saved);
                setReturningUser(userData);
                setForm(prev => ({ ...prev, email: userData.email, name: userData.name }));
                setStep('returning');
            } catch (e) {
                console.error("Failed to parse saved user", e);
                setStep('initial');
            }
        } else {
            setStep('initial');
            setReturningUser(null);
        }
    }, [sessionId, searchParams]);

    const handleEmailBlur = async () => {
        if (!form.email || step !== 'initial' || !form.email.includes('@')) return;
        
        setIsCheckingEmail(true);
        try {
            const existing = await checkUserRegistration(form.email);
            if (existing && sessionId !== "1") {
                setReturningUser(existing);
                setForm(prev => ({ 
                    ...prev, 
                    name: existing.name || "",
                    phone: existing.phone || "",
                    organization: existing.organization || ""
                }));
                setStep('returning');
            } else if (existing && sessionId === "1") {
                // If they exist but it's session 1, just pre-fill the form but stay on 'new' step
                setForm(prev => ({ 
                    ...prev, 
                    name: existing.name || "",
                    phone: existing.phone || "",
                    organization: existing.organization || ""
                }));
                setStep('new');
            } else {
                setStep('new');
            }
        } catch (e) {
            console.error("Check email failed", e);
        } finally {
            setIsCheckingEmail(false);
        }
    };

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

            // Use returning user email if available
            const emailToUse = returningUser?.email || form.email;

            // 1. Check if already registered for THIS session
            const alreadyInSession = await checkRegistrationExists(emailToUse, sessionId);
            if (alreadyInSession) {
                setErrorMessage("You're already registered for this session!");
                setStatus("error");
                return;
            }

            let finalUser: any = form;
            
            if (returningUser) {
                // Update existing profile
                const updatedSessions = [...(returningUser.sessionIds || [])];
                if (!updatedSessions.includes(sessionId)) {
                    updatedSessions.push(sessionId);
                }
                
                finalUser = {
                    ...returningUser,
                    sessionId, // Explicitly pass current sessionId
                    sessionIds: updatedSessions
                };
                
                await addRegistration(finalUser);
            } else {
                // 3. Totally new user
                await addRegistration({
                    ...form,
                    sessionId, // Explicitly pass current sessionId
                    sessionIds: [sessionId]
                });
                finalUser = form;
            }

            // Save to localStorage
            localStorage.setItem('last_registered_user', JSON.stringify(finalUser));
            localStorage.setItem('quiz_user_general', JSON.stringify(finalUser));

            await new Promise(r => setTimeout(r, 1500));
            setStatus("success");

            // Redirect logic
            const searchParams = new URLSearchParams(window.location.search);
            const redirectUrl = searchParams.get('redirect');

            setTimeout(() => {
                if (redirectUrl) {
                    window.location.href = redirectUrl;
                } else {
                    window.location.href = "https://chat.whatsapp.com/JUC9aKBmpMW2MdjBnIgl2e?mode=gi_t";
                }
            }, 3500);

        } catch (error: any) {
            console.error("Error registering user", error);
            setStatus("error");
            setErrorMessage("System error. Please try again.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Status Overlay */}
            <AnimatePresence>
                {status && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/80"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        >
                            <div className="w-full max-w-sm rounded-[2.5rem] border border-white/10 shadow-2xl p-10 flex flex-col items-center text-center bg-[#020617] relative overflow-hidden">
                                <div className="absolute inset-0 bg-blue-500/5 pointer-events-none" />
                                {status === "loading" && (
                                    <>
                                        <div className="relative w-20 h-20 mb-6">
                                            <div className="absolute inset-0 rounded-full border-4 border-blue-500/20" />
                                            <motion.div 
                                                className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent"
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Transmitting</h3>
                                        <p className="text-slate-400 text-sm font-medium">Securing your registration in the cloud...</p>
                                    </>
                                )}

                                {status === "success" && (
                                    <>
                                        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6 border border-green-500/30">
                                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                                        </div>
                                        <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Success!</h3>
                                        <p className="text-slate-400 text-sm font-medium mb-8">{errorMessage || `Your registration for Session ${sessionId} has been confirmed. Redirecting you to the official WhatsApp group...`}</p>
                                        <div className="flex flex-col gap-3">
                                            <a 
                                                href="https://chat.whatsapp.com/JUC9aKBmpMW2MdjBnIgl2e?mode=gi_t"
                                                className="w-full py-5 px-6 bg-emerald-500 text-white font-black uppercase tracking-[0.15em] text-[10px] rounded-2xl hover:bg-emerald-600 transition-colors flex justify-center items-center gap-2 drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                                            >
                                                Join WhatsApp Group
                                            </a>
                                            <button 
                                                onClick={() => setStatus(null)}
                                                className="w-full py-3 bg-white/5 text-white/50 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-white/10 hover:text-white transition-colors"
                                            >
                                                Return to Portal
                                            </button>
                                        </div>
                                    </>
                                )}

                                {status === "error" && (
                                    <>
                                        <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-6 border border-red-500/30">
                                            <AlertCircle className="w-10 h-10 text-red-500" />
                                        </div>
                                        <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Protocol Error</h3>
                                        <p className="text-slate-400 text-sm font-medium mb-8">{errorMessage}</p>
                                        <button 
                                            onClick={() => setStatus(null)}
                                            className="w-full py-4 bg-red-500 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-red-600 transition-colors"
                                        >
                                            Try Again
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Form Banner */}
            <div className="mb-12 w-full overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl relative aspect-[16/9] md:aspect-[5/1]">
                <Image 
                    src="/hero-visual.png" 
                    alt="Session Banner" 
                    fill 
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-blue-950/40 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent" />
                <div className="absolute bottom-4 md:bottom-8 left-6 md:left-10 right-6 md:right-10">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="inline-flex rounded-full border border-blue-400/50 bg-blue-600/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-blue-400 backdrop-blur-md shadow-[0_0_15px_rgba(59,130,246,0.4)]">
                            Cloud Excellence
                        </span>
                        <div className="h-1 w-1 rounded-full bg-white/20" />
                        <span className="text-[10px] font-black text-white/80 uppercase tracking-widest drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Protocol V2.0</span>
                    </div>
                    <h2 className="text-lg md:text-3xl font-black text-white tracking-tight uppercase leading-tight">Getting into the cloud with AWS</h2>
                </div>
            </div>

            <GlassCard className="relative rounded-[3rem] border-white/10 bg-[#09090b]/80 shadow-2xl backdrop-blur-3xl p-6 md:p-16">
                
                {/* Header */}
                <div className="mb-12 border-b border-white/5 pb-10">
                    <div className="flex flex-wrap items-end justify-between gap-6 mb-6">
                       <div>
                          <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none mb-4">
                             Delegate <span className="text-blue-500">Registration</span>
                          </h1>
                          <p className="text-slate-400 leading-relaxed max-w-xl text-lg">
                              {step === 'returning' 
                                ? `Welcome back! Confirm your registration for the next session.` 
                                : `Fill this form out to register yourselves for the BOC Workshop Series.`}
                          </p>
                       </div>
                       <div className="px-6 py-3 bg-blue-500/20 border border-blue-400/40 rounded-2xl backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.3)] group transition-all hover:scale-105">
                          <span className="text-xs font-black text-blue-400 uppercase tracking-[0.3em]">Session: {sessionId}</span>
                       </div>
                    </div>
                </div>

                {/* Form Logic */}
                <form onSubmit={handleSubmit} className="space-y-12">
                    
                    <AnimatePresence mode="wait">
                        {/* STEP: INITIAL (Email Check) */}
                        {step === 'initial' && (
                            <motion.div 
                                key="initial"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                <div className="space-y-4 max-w-lg mx-auto text-center py-10">
                                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500/60 mb-6">01. Identity Matrix</h3>
                                    <label className="block text-xl font-bold text-slate-200">
                                        Enter your registered Email Address
                                    </label>
                                    <div className="relative group">
                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    handleEmailBlur();
                                                }
                                            }}
                                            placeholder="your.name@example.com"
                                            required
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] px-8 py-6 text-xl text-white text-center outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all placeholder:text-slate-700"
                                        />
                                        {isCheckingEmail && (
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2">
                                                <Loader2 className="animate-spin text-blue-500" size={24} />
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleEmailBlur}
                                        disabled={isCheckingEmail || !form.email.includes('@')}
                                        className="mt-6 w-full max-w-xs mx-auto py-4 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-blue-50 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-2 group"
                                    >
                                        {isCheckingEmail ? (
                                            <Loader2 className="animate-spin" size={16} />
                                        ) : (
                                            <>Proceed <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.span></>
                                        )}
                                    </button>
                                    <p className="text-slate-500 text-sm italic mt-4">We'll check if you've attended previous sessions to save you time.</p>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP: RETURNING (Fast Track) */}
                        {step === 'returning' && (
                            <motion.div 
                                key="returning"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="py-10 text-center"
                            >
                                <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-black uppercase tracking-[0.2em] text-[10px] mb-8">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                    Known Delegate Detected
                                </div>
                                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase mb-4">
                                    Welcome Back,<br/>
                                    <span className="text-blue-500">{returningUser.name.split(' ')[0]}!</span>
                                </h2>
                                <p className="text-slate-400 text-lg mb-12 max-w-md mx-auto font-medium">
                                    We found your profile from <span className="text-white font-bold">{returningUser.organization}</span>. Click the button below to register for <span className="text-blue-400 font-black tracking-tight">Session {sessionId}</span>.
                                </p>
                                
                                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                                    <button
                                        type="submit"
                                        className="w-full md:w-auto min-w-[300px] bg-white text-black font-black py-6 px-12 rounded-[2rem] hover:bg-blue-50 transition-all shadow-[0_20px_60px_rgba(59,130,246,0.3)] uppercase tracking-[0.2em] text-sm active:scale-[0.98]"
                                    >
                                        Confirm Registration
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setStep('initial');
                                            setReturningUser(null);
                                            setForm(prev => ({ ...prev, email: "" }));
                                            localStorage.removeItem('last_registered_user');
                                        }}
                                        className="text-slate-500 hover:text-white transition-colors font-bold uppercase tracking-widest text-[10px]"
                                    >
                                        Not {returningUser.name.split(' ')[0]}?
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP: NEW (Full Form) */}
                        {step === 'new' && (
                            <motion.div 
                                key="new"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-12"
                            >
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
                                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all"
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
                                                readOnly
                                                className="w-full bg-white/[0.01] border border-white/5 rounded-2xl px-6 py-4 text-slate-500 outline-none cursor-not-allowed"
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
                                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all"
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
                                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all"
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
                                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all"
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
                                                <option value="" disabled>Select an option</option>
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
                                                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500/50 transition-all"
                                                    />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                <div className="pt-8">
                                    <button
                                        type="submit"
                                        disabled={status === "loading"}
                                        className="w-full bg-white text-black font-black py-6 rounded-[2rem] hover:bg-slate-200 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)] uppercase tracking-[0.2em] text-sm active:scale-[0.98] flex items-center justify-center gap-3"
                                    >
                                        {status === "loading" ? (
                                            <>Processing Entry... <Loader2 size={20} className="animate-spin" /></>
                                        ) : (
                                            <>Submit Registration <motion.div whileHover={{ x: 5 }}>→</motion.div></>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
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