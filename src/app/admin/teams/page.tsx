'use client';

import { useEffect, useState } from "react";
import { getCompetitionTeams, deleteCompetitionTeam } from "@/firebase/api";
import { CompetitionTeam } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Filter, Download, Search, ChevronRight, Loader2, Award, Trash2, Mail, Phone, School, Trash } from "lucide-react";

export default function AdminTeamsPage() {
    const [teams, setTeams] = useState<CompetitionTeam[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTeam, setSelectedTeam] = useState<CompetitionTeam | null>(null);
    const [modalTab, setModalTab] = useState<'details' | 'raw'>('details');

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getCompetitionTeams();
            setTeams(data);
        } catch (err) {
            console.error("Error fetching teams:", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async () => {
        if (!selectedTeam?.id) return;
        
        setIsDeleting(true);
        try {
            await deleteCompetitionTeam(selectedTeam.id);
            setSelectedTeam(null);
            setShowDeleteConfirm(false);
            fetchData(); // Refresh list
        } catch (err) {
            console.error("Error deleting team:", err);
            alert("Failed to delete team.");
        }
        setIsDeleting(false);
    };

    const exportToCSV = () => {
        const headers = ["Team Name", "University", "Leader Name", "Leader Email", "Leader Phone", "Members Count", "Members List", "Registered At"];
        const rows = filteredTeams.map(team => {
            const membersListStr = team.members.map(m => `${m.name} (${m.email})`).join(" | ");
            const regTime = team.createdAt 
                ? (typeof team.createdAt.toDate === 'function' ? new Date(team.createdAt.toDate()).toLocaleString() : new Date(team.createdAt).toLocaleString())
                : 'N/A';
            return [
                team.teamName,
                team.university,
                team.leaderName,
                team.leaderEmail,
                team.leaderPhone,
                team.members.length + 1, // Total members (leader + add-ons)
                membersListStr,
                regTime
            ];
        });

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `BOC_Ideathon_Teams_List.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredTeams = teams.filter(team => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;

        const inMembers = team.members.some(m => 
            m.name.toLowerCase().includes(query) || 
            m.email.toLowerCase().includes(query)
        );

        return (
            team.teamName.toLowerCase().includes(query) ||
            team.university.toLowerCase().includes(query) ||
            team.leaderName.toLowerCase().includes(query) ||
            team.leaderEmail.toLowerCase().includes(query) ||
            team.leaderPhone.includes(query) ||
            inMembers
        );
    });

    const totalParticipantsCount = teams.reduce((acc, curr) => acc + 1 + curr.members.length, 0);

    return (
        <div className="space-y-8 pb-20">
            {/* Header section with Glassmorphism */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">
                        Ideathon <span className="text-purple-500">Teams</span>
                    </h1>
                    <p className="text-slate-500 font-medium font-mono text-sm tracking-widest uppercase">
                        Monitor cloud challenge ideathon registrations and teams
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                    <button 
                        onClick={exportToCSV}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white text-black hover:bg-slate-200 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg"
                    >
                        <Download size={16} /> Export CSV
                    </button>
                </div>
            </div>

            {/* Stats Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#0f172a]/30 border border-white/5 rounded-2xl p-6 flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Teams</p>
                        <h3 className="text-3xl font-black text-white">{teams.length}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400">
                        <Users size={20} />
                    </div>
                </div>

                <div className="bg-[#0f172a]/30 border border-white/5 rounded-2xl p-6 flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Ideathon Delegates</p>
                        <h3 className="text-3xl font-black text-white">{totalParticipantsCount}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400">
                        <Award size={20} />
                    </div>
                </div>

                <div className="bg-[#0f172a]/30 border border-white/5 rounded-2xl p-6 flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Universities Represented</p>
                        <h3 className="text-3xl font-black text-white">
                            {new Set(teams.map(t => t.university.toLowerCase().trim())).size}
                        </h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/25 flex items-center justify-center text-pink-400">
                        <School size={20} />
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 gap-6">
                <div className="bg-[#0f172a]/50 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden shadow-2xl">
                    
                    {/* Toolbar */}
                    <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/5">
                        <div className="flex items-center gap-4 text-slate-400 text-xs font-bold uppercase tracking-widest">
                            <Users size={16} className="text-purple-500" />
                            <span>{filteredTeams.length} Teams Filtered</span>
                        </div>

                        <div className="relative flex-1 max-w-md group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-500 transition-colors" size={18} />
                            <input 
                                type="text"
                                placeholder="Search by team, university, leader, member..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl pl-12 pr-6 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all"
                            />
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
                            ) : filteredTeams.length === 0 ? (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="p-20 text-center"
                                >
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-600">
                                        <Filter size={32} />
                                    </div>
                                    <h3 className="text-white font-bold text-lg mb-2">No teams found</h3>
                                    <p className="text-slate-500 text-sm">Try adjusting your search query.</p>
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
                                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Team / University</th>
                                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Team Leader</th>
                                                <th className="px-8 py-5 text-center text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Total Size</th>
                                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Additional Members</th>
                                                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {filteredTeams.map((team) => (
                                                <tr key={team.id} className="group hover:bg-white/5 transition-all">
                                                    <td className="px-8 py-6">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors uppercase tracking-tight">{team.teamName}</span>
                                                            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                                                                <School size={10} className="text-purple-500/70" /> {team.university}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-bold text-slate-200">{team.leaderName}</span>
                                                            <span className="text-[10px] text-slate-500 font-mono">{team.leaderEmail}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-center">
                                                        <span className="inline-flex px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-xs font-black text-purple-400">
                                                            {team.members.length + 1} Members
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        {team.members.length === 0 ? (
                                                            <span className="text-[10px] text-slate-600 uppercase font-bold tracking-wider">Solo Mode</span>
                                                        ) : (
                                                            <div className="flex flex-wrap gap-1.5 max-w-xs">
                                                                {team.members.map((m, idx) => (
                                                                    <span key={idx} className="inline-flex px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                                                                        {m.name.split(" ")[0]}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <button 
                                                            onClick={() => setSelectedTeam(team)}
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
                    {!loading && filteredTeams.length > 0 && (
                        <div className="p-6 bg-black/40 border-t border-white/5 flex items-center justify-between">
                            <p className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">
                                Protocol Version: IDEATHON-REG-v2.0
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
                {selectedTeam && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedTeam(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl bg-[#0f172a] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl"
                        >
                            <div className="p-8 border-b border-white/5 bg-white/5">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Team <span className="text-purple-500">Matrix</span></h2>
                                        <p className="text-xs text-slate-500 font-mono uppercase tracking-widest mt-1">ID: {selectedTeam.id}</p>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            setSelectedTeam(null);
                                            setModalTab('details');
                                            setShowDeleteConfirm(false);
                                        }}
                                        className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-all"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="flex gap-4 p-1 bg-black/20 rounded-xl w-fit border border-white/5">
                                    <button 
                                        onClick={() => setModalTab('details')}
                                        className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${modalTab === 'details' ? 'bg-purple-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                                    >
                                        Information
                                    </button>
                                    <button 
                                        onClick={() => setModalTab('raw')}
                                        className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${modalTab === 'raw' ? 'bg-purple-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                                    >
                                        Raw Firebase Data
                                    </button>
                                </div>
                            </div>

                            <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                {modalTab === 'details' ? (
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Team Name</label>
                                                <p className="text-lg font-black text-white uppercase tracking-tight">{selectedTeam.teamName}</p>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">University / Institute</label>
                                                <p className="text-md font-bold text-purple-400 uppercase tracking-wide">{selectedTeam.university}</p>
                                            </div>
                                        </div>

                                        {/* Leader section */}
                                        <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                                            <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
                                                <span className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-[9px] font-black uppercase tracking-widest text-purple-400 rounded-full">Primary Contact</span>
                                                <h4 className="text-xs font-black uppercase tracking-widest text-white">Team Leader</h4>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                <div>
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Full Name</span>
                                                    <p className="text-white font-bold">{selectedTeam.leaderName}</p>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Email</span>
                                                    <p className="text-white font-mono text-xs">{selectedTeam.leaderEmail}</p>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Phone / WhatsApp</span>
                                                    <p className="text-white font-mono text-xs">{selectedTeam.leaderPhone}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Members section */}
                                        <div className="space-y-4">
                                            <h4 className="text-xs font-black uppercase tracking-widest text-white border-l-2 border-purple-500 pl-3">Additional Members ({selectedTeam.members.length})</h4>
                                            
                                            {selectedTeam.members.length === 0 ? (
                                                <p className="text-slate-500 text-xs italic pl-1">This team is registered as a solo participant.</p>
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {selectedTeam.members.map((member, idx) => (
                                                        <div key={idx} className="p-4 bg-white/[0.01] border border-white/5 rounded-xl flex items-center justify-between">
                                                            <div>
                                                                <span className="text-[9px] font-black uppercase text-slate-600 block mb-0.5">Member #{idx + 2}</span>
                                                                <p className="text-white text-xs font-bold">{member.name}</p>
                                                                <p className="text-slate-400 font-mono text-[10px] mt-0.5">{member.email}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-black/40 rounded-2xl p-6 border border-white/5 font-mono text-xs">
                                        <pre className="text-purple-400 overflow-x-auto whitespace-pre-wrap">
                                            {JSON.stringify(selectedTeam, (key, value) => {
                                                if (value && typeof value === 'object' && value.toDate) {
                                                    return value.toDate().toISOString() + " (Firestore Timestamp)";
                                                }
                                                return value;
                                            }, 2)}
                                        </pre>
                                    </div>
                                )}
                            </div>

                            <div className="p-8 bg-white/5 border-t border-white/5 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    {!showDeleteConfirm ? (
                                        <button 
                                            onClick={() => setShowDeleteConfirm(true)}
                                            className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                                        >
                                            Disband Team
                                        </button>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={handleDelete}
                                                disabled={isDeleting}
                                                className="px-4 py-2 bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-all disabled:opacity-50"
                                            >
                                                {isDeleting ? "Disbanding..." : "Confirm Disband?"}
                                            </button>
                                            <button 
                                                onClick={() => setShowDeleteConfirm(false)}
                                                className="px-4 py-2 bg-white/5 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
                                
                                <button 
                                    onClick={() => setSelectedTeam(null)}
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
