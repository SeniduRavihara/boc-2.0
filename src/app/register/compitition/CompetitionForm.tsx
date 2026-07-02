'use client';

import { addCompetitionTeam, checkEmailRegisteredInCompetition, checkTeamNameExists } from '@/firebase/api';
import { useState, ChangeEvent, FormEvent, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { CheckCircle2, AlertCircle, Loader2, Plus, Trash2, Users, School, Sparkles, Award, Copy, Check } from 'lucide-react';

const WHATSAPP_GROUP_LINK = "https://chat.whatsapp.com/D2ww3xn34Vu3QgZipBal9D";

export default function CompetitionForm() {
    const [status, setStatus] = useState<"success" | "error" | "loading" | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [linkCopied, setLinkCopied] = useState(false);
    const copiedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current);
        };
    }, []);

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(WHATSAPP_GROUP_LINK);
            setLinkCopied(true);
            if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current);
            copiedTimeoutRef.current = setTimeout(() => setLinkCopied(false), 2500);
        } catch (err) {
            console.error("Failed to copy link:", err);
        }
    };

    // Top-level team details
    const [teamName, setTeamName] = useState("");
    const [university, setUniversity] = useState("");

    // Leader details
    const [leader, setLeader] = useState({
        name: "",
        email: "",
        phone: ""
    });

    // Members list (1 to 3 additional members -> total team size 2 to 4)
    const [members, setMembers] = useState<{ name: string; email: string }[]>([]);

    // Terms verification checkbox
    const [termsAccepted, setTermsAccepted] = useState(false);

    // Helpers to manage members array
    const addMember = () => {
        if (members.length < 3) {
            setMembers([...members, { name: "", email: "" }]);
        }
    };

    const removeMember = (index: number) => {
        setMembers(members.filter((_, i) => i !== index));
    };

    const handleMemberChange = (index: number, field: 'name' | 'email', value: string) => {
        const updated = [...members];
        updated[index] = { ...updated[index], [field]: value };
        setMembers(updated);
    };

    const handleLeaderChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLeader(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // 1. Client-side sanity checks
        if (!teamName.trim() || !university.trim() || !leader.name.trim() || !leader.email.trim() || !leader.phone.trim()) {
            setErrorMessage("Please fill in all required team leader and team metadata fields.");
            setStatus("error");
            return;
        }

        // Team size must be 2-4 (leader + 1-3 members)
        if (members.length < 1) {
            setErrorMessage("Teams must have at least 2 members. Please add at least one team member before submitting.");
            setStatus("error");
            return;
        }

        if (members.length > 3) {
            setErrorMessage("Teams cannot exceed 4 members total (1 leader + 3 members).");
            setStatus("error");
            return;
        }

        // Verify if any member field is empty
        for (let i = 0; i < members.length; i++) {
            if (!members[i].name.trim() || !members[i].email.trim()) {
                setErrorMessage(`Please fill in all details for Member ${i + 1}.`);
                setStatus("error");
                return;
            }
        }

        if (!termsAccepted) {
            setErrorMessage("You must confirm that your team composition is final and all members are from the same university.");
            setStatus("error");
            return;
        }

        // 2. Email duplicate check within the team itself
        const allEmails = [
            leader.email.toLowerCase().trim(),
            ...members.map(m => m.email.toLowerCase().trim())
        ];

        const uniqueEmails = new Set(allEmails);
        if (uniqueEmails.size !== allEmails.length) {
            setErrorMessage("Duplicate emails detected within your team. Each participant must have a unique email address.");
            setStatus("error");
            return;
        }

        try {
            setStatus("loading");

            // 3. Database: Check if Team Name is already taken (case-insensitive)
            const teamNameTaken = await checkTeamNameExists(teamName);
            if (teamNameTaken) {
                setErrorMessage(`Team name "${teamName}" is already registered. Please choose another creative name!`);
                setStatus("error");
                return;
            }

            // 4. Database: Check if Leader or Members are already in another team
            for (const email of allEmails) {
                const isRegistered = await checkEmailRegisteredInCompetition(email);
                if (isRegistered) {
                    setErrorMessage(`Participant email "${email}" is already registered in another team. Each participant can only join one team.`);
                    setStatus("error");
                    return;
                }
            }

            // 5. Build and submit final object
            const finalTeam = {
                teamName,
                university,
                leaderName: leader.name,
                leaderEmail: leader.email,
                leaderPhone: leader.phone,
                members,
                allEmails
            };

            await addCompetitionTeam(finalTeam);

            // Wait a moment to show smooth transition
            await new Promise(r => setTimeout(r, 1500));
            setStatus("success");

            // Save to localStorage for referencing
            localStorage.setItem('registered_competition_team', JSON.stringify(finalTeam));

        } catch (error: any) {
            console.error("Error registering team:", error);
            setStatus("error");
            setErrorMessage("System transmission failure. Please verify your internet connection and try again.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-0 md:px-0">
            {/* Status Overlay */}
            <AnimatePresence>
                {status && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 backdrop-blur-3xl bg-black/80"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        >
                            <div className="w-full max-w-md rounded-[2rem] md:rounded-[2.5rem] border border-white/10 shadow-2xl p-6 md:p-10 flex flex-col items-center text-center bg-[#020617] relative overflow-hidden">
                                <div className="absolute inset-0 bg-purple-500/5 pointer-events-none" />
                                {status === "loading" && (
                                    <>
                                        <div className="relative w-16 h-16 md:w-20 md:h-20 mb-4 md:mb-6">
                                            <div className="absolute inset-0 rounded-full border-4 border-purple-500/20" />
                                            <motion.div
                                                className="absolute inset-0 rounded-full border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent"
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
                                            </div>
                                        </div>
                                        <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight mb-2">Deploying Stack</h3>
                                        <p className="text-slate-400 text-xs md:text-sm font-medium">Registering team & validating member profiles in the cloud...</p>
                                    </>
                                )}

                                {status === "success" && (
                                    <>
                                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4 md:mb-6 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                                            <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-emerald-500" />
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight mb-2">Team Registered!</h3>
                                        <p className="text-slate-400 text-xs md:text-sm font-medium mb-6 md:mb-8 leading-relaxed">
                                            Congratulations! Your team <span className="text-purple-400 font-bold">"{teamName}"</span> has successfully entered the Cloud Challenge Ideathon.
                                            As team leader, join the WhatsApp group below, then copy the link and share it with the rest of your team so they can join too.
                                        </p>

                                        {/* Link display */}
                                        <div className="w-full mb-4 bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl px-3 py-2.5 md:px-4 md:py-3">
                                            <span className="block text-left text-[10px] md:text-xs text-slate-400 truncate font-mono">
                                                {WHATSAPP_GROUP_LINK}
                                            </span>
                                        </div>

                                        {/* Copy + Join button pair */}
                                        <div className="flex flex-col gap-3 w-full">
                                            <div className="grid grid-cols-2 gap-3 w-full">
                                                <button
                                                    type="button"
                                                    onClick={handleCopyLink}
                                                    className="w-full py-4 md:py-5 px-4 bg-white/5 border border-white/10 text-white font-black uppercase tracking-[0.1em] text-[10px] rounded-xl md:rounded-2xl hover:bg-white/10 transition-colors flex justify-center items-center gap-2"
                                                >
                                                    {linkCopied ? (
                                                        <>
                                                            <Check size={14} className="text-emerald-400" /> Copied
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy size={14} /> Copy Link
                                                        </>
                                                    )}
                                                </button>
                                                <a
                                                    href={WHATSAPP_GROUP_LINK}
                                                    className="w-full py-4 md:py-5 px-4 bg-emerald-500 text-white font-black uppercase tracking-[0.1em] text-[10px] rounded-xl md:rounded-2xl hover:bg-emerald-600 transition-colors flex justify-center items-center gap-2 drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                                                >
                                                    Join as Leader
                                                </a>
                                            </div>
                                            <p className="text-[9px] md:text-[10px] text-slate-500 italic">
                                                Only the team leader should join the group directly — forward the copied link to your teammates instead of having them join individually.
                                            </p>
                                            <button
                                                onClick={() => setStatus(null)}
                                                className="w-full py-3 bg-white/5 text-white/50 font-black uppercase tracking-widest text-[10px] rounded-xl md:rounded-2xl hover:bg-white/10 hover:text-white transition-colors"
                                            >
                                                Return to Form
                                            </button>
                                        </div>
                                    </>
                                )}

                                {status === "error" && (
                                    <>
                                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-4 md:mb-6 border border-red-500/30">
                                            <AlertCircle className="w-8 h-8 md:w-10 md:h-10 text-red-500" />
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight mb-2">Protocol Violation</h3>
                                        <p className="text-slate-400 text-xs md:text-sm font-medium mb-8 leading-relaxed">{errorMessage}</p>
                                        <button
                                            onClick={() => setStatus(null)}
                                            className="w-full py-3.5 bg-red-500 text-white font-black uppercase tracking-widest text-[10px] rounded-xl md:rounded-2xl hover:bg-red-600 transition-colors"
                                        >
                                            Modify Registration
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Form Banner — Glass & Modern */}
            <div className="mb-6 md:mb-12 w-full overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] border border-white/10 shadow-2xl relative aspect-[16/9] md:aspect-[5/1]">
                <Image
                    src="/images/image3.webp"
                    alt="Ideathon Banner"
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-purple-950/40 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/50 to-transparent" />

                {/* Wall-E Mascot Overlay */}
                <div className="absolute right-4 md:right-12 bottom-0 top-0 w-[30%] md:w-[20%] pointer-events-none z-10 flex items-end justify-end">
                    <div className="relative w-full h-[95%] md:h-[115%] transition-transform duration-700 hover:scale-105">
                        <Image
                            src="/images/walle.png"
                            alt="Wall-E Mascot"
                            fill
                            priority
                            className="object-contain object-bottom"
                        />
                    </div>
                </div>

                <div className="absolute top-1/2 -translate-y-1/2 left-4 md:left-10 right-[35%] md:right-10 z-20">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 mb-1.5 sm:mb-2">
                        <span className="inline-flex self-start rounded-lg border border-purple-400/50 bg-purple-600/20 px-2.5 py-1 sm:px-3 sm:py-1.5 text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-purple-400 backdrop-blur-md">
                            Ideathon Phase
                        </span>
                        <div className="hidden sm:block h-1 w-1 rounded-full bg-white/20" />
                        <span className="text-[8px] sm:text-[10px] font-black text-white/80 uppercase tracking-widest drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">SEC-REG-2.0</span>
                    </div>
                    <h2 className="text-sm md:text-3xl font-black text-white tracking-tight uppercase leading-tight">
                        Cloud Challenge Team Registration
                    </h2>
                </div>
            </div>

            {/* Main Form Wrapper */}
            <GlassCard className="relative rounded-[2rem] md:rounded-[3rem] border-white/10 bg-[#09090b]/80 shadow-2xl backdrop-blur-3xl p-5 md:p-16">

                {/* Header */}
                <div className="mb-6 md:mb-12 border-b border-white/5 pb-6 md:pb-10">
                    <div className="flex flex-wrap items-end justify-between gap-4 mb-4 md:mb-6">
                        <div>
                            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none mb-3 md:mb-4">
                                Join the <span className="text-purple-500">Ideathon</span>
                            </h1>
                            <p className="text-slate-400 leading-relaxed max-w-xl text-sm md:text-md">
                                Form your dream team of 2 to 4 members to brainstorm, design and pitch breakthrough cloud computing architectures.
                            </p>
                        </div>
                        <div className="px-4 py-2 md:px-6 md:py-3 bg-purple-500/20 border border-purple-400/40 rounded-lg backdrop-blur-md transition-all hover:scale-105">
                            <span className="text-[10px] md:text-xs font-black text-purple-400 uppercase tracking-[0.3em] flex items-center gap-1.5">
                                <Award size={12} /> Phase 1
                            </span>
                        </div>
                    </div>

                    {/* Quick Rules Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 md:mt-8 bg-white/[0.02] border border-white/5 rounded-xl md:rounded-2xl p-4 md:p-6 text-sm">
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 rounded-lg bg-purple-500/20 p-1 text-purple-400">
                                <Users size={14} />
                            </div>
                            <div>
                                <h4 className="font-bold text-white uppercase text-[10px] md:text-xs tracking-wider mb-0.5 md:mb-1">Team Limits</h4>
                                <p className="text-slate-400 text-[11px] md:text-xs">Teams must consist of exactly 2 to 4 members.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 rounded-lg bg-purple-500/20 p-1 text-purple-400">
                                <School size={14} />
                            </div>
                            <div>
                                <h4 className="font-bold text-white uppercase text-[10px] md:text-xs tracking-wider mb-0.5 md:mb-1">University Rule</h4>
                                <p className="text-slate-400 text-[11px] md:text-xs">All members must represent the same university.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 md:space-y-12">

                    {/* SECTION 1: TEAM INFORMATION */}
                    <div className="space-y-4 md:space-y-8">
                        <div className="flex items-center gap-2.5 border-l-2 border-purple-500 pl-3 md:pl-4">
                            <span className="text-[10px] md:text-xs font-mono font-black text-purple-500">01</span>
                            <h3 className="text-sm md:text-md font-black uppercase tracking-[0.2em] text-white">Team Meta Matrix</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                            <div className="space-y-2">
                                <label className="block text-xs md:text-sm font-bold text-slate-200 ml-1">
                                    Team Name <span className="text-purple-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={teamName}
                                    onChange={(e) => setTeamName(e.target.value)}
                                    placeholder="Enter a creative cloud name"
                                    required
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl md:rounded-2xl px-5 py-3 md:px-6 md:py-4 text-sm md:text-base text-white outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs md:text-sm font-bold text-slate-200 ml-1">
                                    University / Institute <span className="text-purple-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={university}
                                    onChange={(e) => setUniversity(e.target.value)}
                                    placeholder="e.g. University of Sri Jayewardenepura"
                                    required
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl md:rounded-2xl px-5 py-3 md:px-6 md:py-4 text-sm md:text-base text-white outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all"
                                />
                                <p className="text-[9px] md:text-[10px] text-slate-500 italic ml-1">All members must belong to this institute</p>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: TEAM LEADER DETAILS */}
                    <div className="space-y-4 md:space-y-8">
                        <div className="flex items-center gap-2.5 border-l-2 border-purple-500 pl-3 md:pl-4">
                            <span className="text-[10px] md:text-xs font-mono font-black text-purple-500">02</span>
                            <h3 className="text-sm md:text-md font-black uppercase tracking-[0.2em] text-white">Team Leader (Primary Contact)</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                            <div className="space-y-2">
                                <label className="block text-xs md:text-sm font-bold text-slate-200 ml-1">
                                    Full Name <span className="text-purple-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={leader.name}
                                    onChange={handleLeaderChange}
                                    placeholder="Leader's Name"
                                    required
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl md:rounded-2xl px-5 py-3 md:px-6 md:py-4 text-sm md:text-base text-white outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs md:text-sm font-bold text-slate-200 ml-1">
                                    Email Address <span className="text-purple-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={leader.email}
                                    onChange={handleLeaderChange}
                                    placeholder="leader@university.lk"
                                    required
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl md:rounded-2xl px-5 py-3 md:px-6 md:py-4 text-sm md:text-base text-white outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs md:text-sm font-bold text-slate-200 ml-1">
                                    WhatsApp / Mobile <span className="text-purple-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={leader.phone}
                                    onChange={handleLeaderChange}
                                    placeholder="+94 7X XXX XXXX"
                                    required
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl md:rounded-2xl px-5 py-3 md:px-6 md:py-4 text-sm md:text-base text-white outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: ADDITIONAL MEMBERS */}
                    <div className="space-y-4 md:space-y-8">
                        <div className="flex items-center justify-between border-l-2 border-purple-500 pl-3 md:pl-4">
                            <div className="flex items-center gap-2.5">
                                <span className="text-[10px] md:text-xs font-mono font-black text-purple-500">03</span>
                                <h3 className="text-sm md:text-md font-black uppercase tracking-[0.2em] text-white">Additional Members <span className="text-purple-400 normal-case font-bold tracking-normal">(at least 1 required)</span></h3>
                            </div>

                            <button
                                type="button"
                                onClick={addMember}
                                disabled={members.length >= 3}
                                className="flex items-center gap-1.5 py-1.5 px-3 md:py-2 md:px-4 rounded-lg md:rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 hover:bg-purple-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-[10px] md:text-xs font-black uppercase tracking-wider"
                            >
                                <Plus size={12} /> Add Member ({members.length}/3)
                            </button>
                        </div>

                        {members.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-red-500/[0.03] border border-red-500/20 border-dashed rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-10 text-center"
                            >
                                <div className="text-red-400/70 mb-1 md:mb-2 flex justify-center"><Users size={24} /></div>
                                <h4 className="text-red-300 font-bold uppercase text-[10px] md:text-xs tracking-wider">At Least 1 Member Required</h4>
                                <p className="text-slate-500 text-[11px] md:text-xs mt-1">Teams must have 2 to 4 members total. Click "Add Member" below to add at least one teammate before submitting.</p>
                            </motion.div>
                        ) : (
                            <div className="space-y-4 md:space-y-6">
                                <AnimatePresence>
                                    {members.map((member, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 15, scale: 0.98 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -15, scale: 0.98 }}
                                            transition={{ duration: 0.2 }}
                                            className="bg-white/[0.02] border border-white/5 rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 relative group"
                                        >
                                            <div className="absolute right-4 top-4 md:right-6 md:top-6">
                                                <button
                                                    type="button"
                                                    onClick={() => removeMember(index)}
                                                    className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg md:rounded-xl transition-all"
                                                    title="Remove Member"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-2 mb-4 md:mb-6">
                                                <span className="inline-flex rounded-full bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 md:px-3 md:py-1 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-purple-400">
                                                    Member #{index + 2}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                                <div className="space-y-1.5">
                                                    <label className="block text-xs font-bold text-slate-300 ml-0.5">Full Name *</label>
                                                    <input
                                                        type="text"
                                                        value={member.name}
                                                        onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                                                        placeholder={`Member ${index + 2} Name`}
                                                        required
                                                        className="w-full bg-white/[0.02] border border-white/5 rounded-lg md:rounded-xl px-4 py-2.5 md:px-5 md:py-3 text-xs md:text-sm text-white outline-none focus:border-purple-500/50 transition-all"
                                                    />
                                                </div>

                                                <div className="space-y-1.5">
                                                    <label className="block text-xs font-bold text-slate-300 ml-0.5">Email Address *</label>
                                                    <input
                                                        type="email"
                                                        value={member.email}
                                                        onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                                                        placeholder={`Member ${index + 2} Email`}
                                                        required
                                                        className="w-full bg-white/[0.02] border border-white/5 rounded-lg md:rounded-xl px-4 py-2.5 md:px-5 md:py-3 text-xs md:text-sm text-white outline-none focus:border-purple-500/50 transition-all"
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    {/* SECTION 4: PROTOCOL CONFIRMATION */}
                    <div className="space-y-4 pt-4 md:pt-6 border-t border-white/5">
                        <div className="flex items-start gap-3 md:gap-4">
                            <div className="flex items-center h-5">
                                <input
                                    id="terms"
                                    type="checkbox"
                                    checked={termsAccepted}
                                    onChange={(e) => setTermsAccepted(e.target.checked)}
                                    className="w-4.5 h-4.5 bg-white/[0.03] border border-white/10 rounded text-purple-600 focus:ring-purple-500 focus:ring-offset-black cursor-pointer accent-purple-500"
                                />
                            </div>
                            <div className="text-xs md:text-sm">
                                <label htmlFor="terms" className="font-bold text-slate-200 cursor-pointer select-none">
                                    I confirm that this team composition is final.
                                </label>
                                <p className="text-slate-500 text-[10px] md:text-xs mt-1 leading-relaxed">
                                    I certify that all team members are active undergraduate/postgraduate students from <span className="text-slate-300 font-bold">{university || "the same university"}</span>. I acknowledge that teams cannot be modified, and members cannot be added or replaced after this protocol is transmitted.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <div className="pt-4 md:pt-6">
                        <button
                            type="submit"
                            disabled={status === "loading"}
                            className="w-full bg-white text-black font-black py-4 md:py-6 rounded-xl md:rounded-[2rem] hover:bg-purple-100 transition-all shadow-[0_20px_50px_rgba(168,85,247,0.15)] uppercase tracking-[0.2em] text-xs md:text-sm active:scale-[0.98] flex items-center justify-center gap-3"
                        >
                            {status === "loading" ? (
                                <>Validating & Transmitting... <Loader2 size={16} className="animate-spin text-purple-600" /></>
                            ) : (
                                <>Deploy Team Protocol <motion.div whileHover={{ x: 5 }}>→</motion.div></>
                            )}
                        </button>
                    </div>
                </form>
            </GlassCard>

            <div className="mt-8 md:mt-12 text-center pb-8 md:pb-12">
                <p className="text-slate-600 text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] opacity-50 flex items-center justify-center gap-2">
                    <Sparkles size={8} className="text-purple-500" /> BOC-IDEATHON-UPLINK-ESTABLISHED · SECURE CHANNEL <Sparkles size={8} className="text-purple-500" />
                </p>
            </div>
        </div>
    );
}