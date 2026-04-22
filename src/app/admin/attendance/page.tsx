"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle,
  ChevronDown,
  ChevronUp,
  X,
  History
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { 
  getMeetings, 
  addMeeting, 
  updateMeetingAttendance, 
  deleteMeeting, 
  getTeamMembers
} from '@/firebase/api';
import { TeamMember, Meeting } from '@/types';
import { exportAttendanceToExcel } from '@/utils/excel-export';
import { ExportButton } from '@/components/ui/ExportButton';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AttendancePage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [expandedMeetingId, setExpandedMeetingId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  // New meeting form state
  const [newMeeting, setNewMeeting] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [fetchedMeetings, fetchedMembers] = await Promise.all([
        getMeetings(),
        getTeamMembers()
      ]);
      setMeetings(fetchedMeetings);
      setTeamMembers(fetchedMembers);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeeting.title) return;

    try {
      await addMeeting(newMeeting.title, newMeeting.description, newMeeting.date);
      setNewMeeting({
        title: "",
        description: "",
        date: new Date().toISOString().split('T')[0]
      });
      setIsFormOpen(false);
      const updated = await getMeetings();
      setMeetings(updated);
    } catch (error) {
      console.error("Error adding meeting:", error);
    }
  };

  const handleToggleAttendance = async (meetingId: string, memberId: string, currentPresentIds: string[]) => {
    const isPresent = currentPresentIds.includes(memberId);
    const newPresentIds = isPresent 
      ? currentPresentIds.filter(id => id !== memberId)
      : [...currentPresentIds, memberId];

    try {
      // Optimistic update
      setMeetings(prev => prev.map(m => 
        m.id === meetingId ? { ...m, presentMemberIds: newPresentIds } : m
      ));
      
      await updateMeetingAttendance(meetingId, newPresentIds);
    } catch (error) {
      console.error("Error updating attendance:", error);
      // Rollback on error
      const updated = await getMeetings();
      setMeetings(updated);
    }
  };

  const handleDeleteMeeting = async (id: string) => {
    if (!confirm("Delete this meeting record?")) return;
    try {
      await deleteMeeting(id);
      setMeetings(prev => prev.filter(m => m.id !== id));
    } catch (error) {
      console.error("Error deleting meeting:", error);
    }
  };

  const handleExport = () => {
    setExporting(true);
    try {
      exportAttendanceToExcel(meetings, teamMembers);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 p-6 md:p-12 font-sans">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-2"
            >
              Attendance Tracker
            </motion.h1>
            <p className="text-slate-500 text-lg">Manage meeting attendance for your team records.</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <ExportButton onClick={handleExport} isLoading={exporting} />
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              {isFormOpen ? <X size={18} /> : <Plus size={18} />}
              {isFormOpen ? "Close" : "New Meeting"}
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 32 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <GlassCard className="p-8 border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.05)]">
                <form onSubmit={handleAddMeeting} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Meeting Title</label>
                    <input 
                      type="text" 
                      placeholder="Daily Sync, Project Review, etc."
                      value={newMeeting.title}
                      onChange={e => setNewMeeting({...newMeeting, title: e.target.value})}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-lg p-3 outline-none focus:border-emerald-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Meeting Date</label>
                    <input 
                      type="date" 
                      value={newMeeting.date}
                      onChange={e => setNewMeeting({...newMeeting, date: e.target.value})}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-lg p-3 outline-none focus:border-emerald-500/50"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Description / Notes</label>
                    <textarea 
                      placeholder="What happened in this meeting? (e.g., Discussed UI refactor, assigned new tasks...)"
                      value={newMeeting.description}
                      onChange={e => setNewMeeting({...newMeeting, description: e.target.value})}
                      rows={3}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-lg p-3 outline-none focus:border-emerald-500/50 resize-none"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <button 
                      type="submit"
                      disabled={!newMeeting.title}
                      className="w-full bg-emerald-500 text-black font-bold py-3 rounded-lg hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:opacity-50"
                    >
                      Start Meeting Record
                    </button>
                  </div>
                </form>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-20 gap-4">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-500 animate-pulse">Fetching meeting records...</p>
            </div>
          ) : meetings.length === 0 ? (
            <div className="text-center py-20 text-slate-500 bg-slate-900/10 rounded-3xl border border-dashed border-slate-800">
              <History className="mx-auto mb-4 opacity-10" size={80} />
              <p className="text-xl font-medium">No meeting records yet.</p>
              <p className="mt-2">Create your first meeting to start tracking attendance.</p>
            </div>
          ) : (
            meetings.map((meeting) => (
              <GlassCard key={meeting.id} className="overflow-hidden">
                <div 
                  className="p-6 cursor-pointer hover:bg-white/5 transition-colors flex items-center justify-between"
                  onClick={() => setExpandedMeetingId(expandedMeetingId === meeting.id ? null : meeting.id!)}
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center text-emerald-400">
                      <Calendar size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{meeting.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span>{meeting.date}</span>
                        <span className="flex items-center gap-1.5 border-l border-slate-800 pl-4">
                          <Users size={14} className="text-indigo-400" />
                          {meeting.presentMemberIds.length} / {teamMembers.length} Present
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteMeeting(meeting.id!); }}
                      className="p-2 text-slate-600 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                    {expandedMeetingId === meeting.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                  </div>
                </div>

                <AnimatePresence>
                  {expandedMeetingId === meeting.id && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      className="border-t border-slate-800 bg-black/20"
                    >
                      <div className="p-6">
                        {meeting.description && (
                          <div className="mb-6 p-4 bg-slate-950/50 border border-slate-800 rounded-xl">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Notes</h4>
                            <p className="text-sm text-slate-300 whitespace-pre-wrap">{meeting.description}</p>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {teamMembers.map((member) => {
                          const isPresent = meeting.presentMemberIds.includes(member.id!);
                          return (
                            <button
                              key={member.id}
                              onClick={() => handleToggleAttendance(meeting.id!, member.id!, meeting.presentMemberIds)}
                              className={cn(
                                "flex items-center gap-3 p-4 rounded-xl border transition-all duration-300",
                                isPresent 
                                  ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                                  : "bg-slate-900/40 border-slate-800 text-slate-500 hover:border-slate-700 hover:bg-slate-800/40"
                              )}
                            >
                              {isPresent ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                              <span className="font-semibold">{member.name}</span>
                            </button>
                          );
                        })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
