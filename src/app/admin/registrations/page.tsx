'use client';

import { useEffect, useState } from "react";
import { getRegistrationsBySession } from "@/firebase/api";
import { Registration } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Filter, Download, Search, ChevronRight } from "lucide-react";

import { SESSIONS } from "@/constants/sessions";

export default function AdminRegistrationsPage() {
    const [activeSession, setActiveSession] = useState("1");
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);

    const fetchData = async (sessionId: string) => {
        setLoading(true);
        try {
            const res = await getRegistrationsBySession(sessionId);
            setRegistrations(res);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData(activeSession);
    }, [activeSession]);

    const filteredRegistrations = registrations.filter(reg => 
        reg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.organization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.phone?.includes(searchQuery)
    );

    return (
        <div className="space-y-8 pb-20">
            {/* Header section with Glassmorphism */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">
                        User <span className="text-purple-500">Registrations</span>
                    </h1>
                    <p className="text-slate-500 font-medium font-mono text-sm tracking-widest uppercase">
                        Monitor attendance and session sign-ups
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-slate-300 transition-all">
                        <Download size={16} /> Export CSV
                    </button>
                </div>
            </div>

            {/* Session Tabs */}
            <div className="flex flex-wrap gap-2 p-1 bg-white/5 border border-white/10 rounded-2xl w-fit">
                {SESSIONS.map((session) => (
                    <button
                        key={session.id}
                        onClick={() => setActiveSession(session.id)}
                        className={`
                            px-6 py-2.5 rounded-xl transition-all duration-300
                            text-xs font-black uppercase tracking-widest
                            ${activeSession === session.id
                                ? "bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                                : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                            }
                        `}
                    >
                        {session.name}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 gap-6">
                <div className="bg-[#0f172a]/50 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden shadow-2xl">
                    
                    {/* Toolbar */}
                    <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input 
                                type="text"
                                placeholder="Search by name, email, phone or org..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl pl-12 pr-6 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-4 text-slate-400 text-xs font-bold uppercase tracking-widest">
                            <Users size={16} className="text-purple-500" />
                            <span>{filteredRegistrations.length} Delegates Found</span>
                        </div>
                    </div>

                    {/* Table View */}
                    <div className="relative">
                        <AnimatePresence mode="wait">
                            {loading ? (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="p-20 flex flex-col items-center justify-center space-y-4"
                                >
                                    <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                                    <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">Accessing encrypted database...</p>
                                </motion.div>
                            ) : filteredRegistrations.length === 0 ? (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="p-20 text-center"
                                >
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-600">
                                        <Filter size={32} />
                                    </div>
                                    <h3 className="text-white font-bold text-lg mb-2">No results found</h3>
                                    <p className="text-slate-500 text-sm">Try adjusting your search or switching sessions.</p>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="overflow-x-auto"
                                >
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/5">
                                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Delegate</th>
                                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Phone</th>
                                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Organization</th>
                                                <th className="px-8 py-5 text-center text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                                                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {filteredRegistrations.map((reg) => (
                                                <tr key={reg.id} className="group hover:bg-white/5 transition-all">
                                                    <td className="px-8 py-6">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors uppercase tracking-tight">{reg.name}</span>
                                                            <span className="text-xs text-slate-500 font-mono">{reg.email}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className="text-xs font-mono text-slate-300">{reg.phone || "N/A"}</span>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className="inline-flex px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                            {reg.organization || "Independent"}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center justify-center gap-2 text-green-500">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                                            <span className="text-[10px] font-black uppercase tracking-widest">Verified</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <button 
                                                            onClick={() => setSelectedRegistration(reg)}
                                                            className="p-2 hover:bg-white/10 rounded-lg text-slate-500 hover:text-white transition-all group/btn"
                                                        >
                                                            <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer Stats */}
                    {!loading && filteredRegistrations.length > 0 && (
                        <div className="p-6 bg-black/40 border-t border-white/5 flex items-center justify-between">
                            <p className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">
                                Protocol Version: REG-v2.0 // Active Session: {activeSession}
                            </p>
                            <div className="flex gap-1">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="w-1 h-1 rounded-full bg-purple-500/30" />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Detailed View Modal */}
            <AnimatePresence>
                {selectedRegistration && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedRegistration(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl bg-[#0f172a] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl"
                        >
                            <div className="p-8 border-b border-white/5 bg-white/5 flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">Delegate <span className="text-purple-500">Profile</span></h2>
                                    <p className="text-xs text-slate-500 font-mono uppercase tracking-widest mt-1">ID: {selectedRegistration.id}</p>
                                </div>
                                <button 
                                    onClick={() => setSelectedRegistration(null)}
                                    className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-all"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="p-8 grid grid-cols-2 gap-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Full Name</label>
                                        <p className="text-white font-bold">{selectedRegistration.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Email Address</label>
                                        <p className="text-white font-mono">{selectedRegistration.email}</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Phone Number</label>
                                        <p className="text-white font-mono">{selectedRegistration.phone || "Not provided"}</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Organization</label>
                                        <p className="text-white font-bold">{selectedRegistration.organization || "Independent"}</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">IEEE Membership</label>
                                        <p className={`${selectedRegistration.isIeeeMember === 'yes' ? 'text-emerald-400' : 'text-rose-400'} font-bold`}>
                                            {selectedRegistration.isIeeeMember === 'yes' ? `Yes (${selectedRegistration.ieeeId})` : 'No'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Faculty / Dept</label>
                                        <p className="text-white">{selectedRegistration.faculty || "N/A"}</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">LinkedIn Profile</label>
                                        {selectedRegistration.linkedin ? (
                                            <a href={selectedRegistration.linkedin} target="_blank" className="text-blue-400 hover:underline break-all">{selectedRegistration.linkedin}</a>
                                        ) : (
                                            <p className="text-slate-600 italic">Not provided</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Attended First Session</label>
                                        <p className="text-white">{selectedRegistration.attendFirstSession || "N/A"}</p>
                                    </div>
                                </div>

                                <div className="col-span-2 space-y-6">
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Thoughts / Expectations</label>
                                        <p className="text-slate-300 text-sm italic">"{selectedRegistration.thoughts || "No thoughts shared."}"</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 bg-white/5 border-t border-white/5 flex justify-end">
                                <button 
                                    onClick={() => setSelectedRegistration(null)}
                                    className="px-8 py-3 bg-purple-500 text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    Close Profile
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
