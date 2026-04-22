"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Clock,
  Users,
  Calendar,
  Search,
  UserPlus,
  UserCheck,
  X,
  Edit2,
  AlertCircle
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { ExportButton } from '@/components/ui/ExportButton';
import { 
  getTasks, 
  addTask, 
  updateTask, 
  deleteTask, 
  getTeamMembers,
  addTeamMember,
  deleteTeamMember
} from '@/firebase/api';
import { Task, TeamMember } from '@/types';
import { exportTasksToExcel } from '@/utils/excel-export';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TaskFormState {
  title: string;
  assignees: string[];
  status: Task['status'];
  priority: Task['priority'];
  dueDate: string;
}

export default function TaskTrackingPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isTeamFormOpen, setIsTeamFormOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // New task form state
  const [newTask, setNewTask] = useState<TaskFormState>({
    title: "",
    assignees: [] as string[],
    status: "Todo",
    priority: "Medium",
    dueDate: new Date().toISOString().split('T')[0]
  });

  // Team member form state
  const [newMemberName, setNewMemberName] = useState("");

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [fetchedTasks, fetchedMembers] = await Promise.all([
        getTasks(),
        getTeamMembers()
      ]);
      setTasks(fetchedTasks);
      setTeamMembers(fetchedMembers);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title || newTask.assignees.length === 0) return;

    try {
      if (editingTaskId) {
        await updateTask(editingTaskId, newTask);
      } else {
        await addTask(newTask);
      }
      
      setNewTask({
        title: "",
        assignees: [],
        status: "Todo",
        priority: "Medium",
        dueDate: new Date().toISOString().split('T')[0]
      });
      setIsFormOpen(false);
      setEditingTaskId(null);
      const updatedTasks = await getTasks();
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleEditTask = (task: Task) => {
    setNewTask({
      title: task.title,
      assignees: task.assignees || [],
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate
    });
    setEditingTaskId(task.id!);
    setIsFormOpen(true);
    setIsTeamFormOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    try {
      await addTeamMember(newMemberName.trim());
      setNewMemberName("");
      const updatedMembers = await getTeamMembers();
      setTeamMembers(updatedMembers);
    } catch (error) {
      console.error("Error adding team member:", error);
    }
  };

  const handleDeleteMember = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from the team?`)) return;
    try {
      await deleteTeamMember(id);
      const updatedMembers = await getTeamMembers();
      setTeamMembers(updatedMembers);
    } catch (error) {
      console.error("Error deleting team member:", error);
    }
  };

  const handleUpdateStatus = async (id: string, currentStatus: string) => {
    const statuses: Task['status'][] = ["Todo", "In Progress", "Done"];
    const currentStatusIndex = statuses.indexOf(currentStatus as Task['status']);
    const nextStatus = statuses[(currentStatusIndex + 1) % statuses.length];
    
    try {
      await updateTask(id, { status: nextStatus });
      const updatedTasks = await getTasks();
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteTask(id);
      const updatedTasks = await getTasks();
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const toggleAssignee = (name: string) => {
    setNewTask(prev => ({
      ...prev,
      assignees: prev.assignees.includes(name)
        ? prev.assignees.filter(a => a !== name)
        : [...prev.assignees, name]
    }));
  };

  const handleExport = () => {
    setExporting(true);
    try {
      exportTasksToExcel(tasks);
    } finally {
      setExporting(false);
    }
  };

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (task.assignees && task.assignees.some(a => a.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 p-6 md:p-12 font-sans">
      <div className="fixed inset-0 overflow-hidden pointer-events-none text-white">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-2"
            >
              Task Tracking
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-slate-500 text-lg"
            >
              Manage your team&apos;s productivity with style.
            </motion.p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <ExportButton onClick={handleExport} isLoading={exporting} />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setIsTeamFormOpen(!isTeamFormOpen); setIsFormOpen(false); }}
              className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-all border border-slate-700"
            >
              {isTeamFormOpen ? <X size={18} /> : <UserPlus size={18} />}
              {isTeamFormOpen ? "Close Team" : "Manage Team"}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setIsFormOpen(!isFormOpen); setIsTeamFormOpen(false); }}
              className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              {isFormOpen ? <X size={18} /> : <Plus size={18} />}
              {isFormOpen ? "Close Form" : "New Task"}
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {isTeamFormOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 32 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <GlassCard className="p-8 border-indigo-500/20 shadow-[0_0_40px_rgba(99,102,241,0.05)]">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Users size={20} className="text-indigo-400" />
                      Add Team Member
                    </h3>
                    <form onSubmit={handleAddMember} className="flex gap-4">
                      <input 
                        type="text" 
                        placeholder="Enter full name..."
                        value={newMemberName}
                        onChange={e => setNewMemberName(e.target.value)}
                        className="flex-1 bg-slate-950/50 border border-slate-800 rounded-lg p-3 outline-none focus:border-indigo-500/50"
                      />
                      <button type="submit" className="bg-indigo-500 text-white font-bold px-6 py-3 rounded-lg hover:bg-indigo-400 transition-all">
                        Add
                      </button>
                    </form>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <UserCheck size={20} className="text-emerald-400" />
                      Current Team
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {teamMembers.map((member) => (
                        <span key={member.id} className="flex items-center gap-2 bg-slate-800/50 border border-slate-700 px-3 py-1.5 rounded-full text-sm">
                          {member.name}
                          <button onClick={() => handleDeleteMember(member.id!, member.name)} className="text-slate-500 hover:text-rose-500 transition-colors">
                            <Trash2 size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 32 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <GlassCard className="p-8 border-cyan-500/20 shadow-[0_0_40px_rgba(34,211,238,0.05)]">
                <div className="flex justify-between items-center mb-6 text-white">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    {editingTaskId ? <Edit2 size={20} className="text-cyan-400" /> : <Plus size={20} className="text-cyan-400" />}
                    {editingTaskId ? "Edit Task" : "Create New Task"}
                  </h2>
                  {editingTaskId && (
                    <button onClick={() => { setEditingTaskId(null); setNewTask({ title: "", assignees: [], status: "Todo", priority: "Medium", dueDate: new Date().toISOString().split('T')[0] }); }} className="text-xs text-slate-500 hover:text-white transition-colors">
                      Cancel Edit
                    </button>
                  )}
                </div>
                <form onSubmit={handleAddTask} className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Task Title</label>
                      <input 
                        type="text" 
                        placeholder="What needs to be done?"
                        value={newTask.title}
                        onChange={e => setNewTask({...newTask, title: e.target.value})}
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-lg p-3 outline-none focus:border-cyan-500/50 transition-all text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Priority</label>
                      <select 
                        value={newTask.priority}
                        onChange={e => setNewTask({...newTask, priority: e.target.value as Task['priority']})}
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-lg p-3 outline-none focus:border-cyan-500/50 appearance-none text-white"
                      >
                        <option value="Low" className="bg-slate-900">Low</option>
                        <option value="Medium" className="bg-slate-900">Medium</option>
                        <option value="High" className="bg-slate-900">High</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Status</label>
                      <select 
                        value={newTask.status}
                        onChange={e => setNewTask({...newTask, status: e.target.value as Task['status']})}
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-lg p-3 outline-none focus:border-cyan-500/50 appearance-none text-white"
                      >
                        <option value="Todo" className="bg-slate-900">Todo</option>
                        <option value="In Progress" className="bg-slate-900">In Progress</option>
                        <option value="Done" className="bg-slate-900">Done</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Assign To (Select multiple)</label>
                    <div className="flex flex-wrap gap-2">
                      {teamMembers.map(member => (
                        <button
                          key={member.id}
                          type="button"
                          onClick={() => toggleAssignee(member.name)}
                          className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300 flex items-center gap-2",
                            newTask.assignees.includes(member.name)
                              ? "bg-cyan-500/20 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.1)]"
                              : "bg-slate-900/50 border-slate-800 text-slate-500 hover:border-slate-700"
                          )}
                        >
                          {newTask.assignees.includes(member.name) && <UserCheck size={14} />}
                          {member.name}
                        </button>
                      ))}
                      {teamMembers.length === 0 && <p className="text-slate-600 text-sm italic">Add team members first to assign tasks.</p>}
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button 
                      type="submit"
                      disabled={!newTask.title || newTask.assignees.length === 0}
                      className="px-10 py-3 bg-cyan-500 text-black font-bold rounded-lg hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {editingTaskId ? "Update Task" : "Create Task"}
                    </button>
                  </div>
                </form>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        <GlassCard className="mb-8 p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full text-white">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text"
                placeholder="Search tasks or assignees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-cyan-500/50 transition-all font-medium"
              />
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-20 gap-4">
              <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-500 animate-pulse">Loading tracker data...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-20 text-slate-500 bg-slate-900/10 rounded-3xl border border-dashed border-slate-800">
              <AlertCircle className="mx-auto mb-4 opacity-10" size={80} />
              <p className="text-xl font-medium">No tasks found.</p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredTasks.map((task, index) => (
                <motion.div key={task.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: index * 0.05 }} layout>
                  <GlassCard hover className="p-6 group">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <div className="flex items-center gap-6 flex-1">
                        <motion.div 
                          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={() => handleUpdateStatus(task.id!, task.status)}
                          className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-500",
                            task.status === "Done" ? "bg-emerald-500/20 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]" : 
                            task.status === "In Progress" ? "bg-cyan-500/20 text-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.2)]" : 
                            "bg-slate-800/80 text-slate-500"
                          )}
                        >
                          {task.status === "Done" ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                        </motion.div>
                        <div>
                          <h3 className={cn("text-xl font-semibold mb-1 transition-all", task.status === "Done" && "line-through text-slate-600")}>
                            {task.title}
                          </h3>
                          <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                            <div className="flex items-center gap-2">
                              <Users size={14} className="text-indigo-400" />
                              <div className="flex flex-wrap gap-1">
                                {(task.assignees || []).map((a, i) => (
                                  <span key={i} className="font-medium text-slate-400 bg-slate-800/50 px-2 py-0.5 rounded">
                                    {a}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <span className="flex items-center gap-1.5 border-l border-slate-800 pl-4">
                              <Calendar size={14} className="text-cyan-400" />
                              Due {task.dueDate}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                        <div className="flex gap-3">
                          <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest", task.priority === "High" ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" : task.priority === "Medium" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : "bg-slate-500/10 text-slate-400 border border-slate-500/20")}>
                            {task.priority}
                          </span>
                          <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/5 text-slate-400 border border-white/10")}>
                            {task.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEditTask(task)} className="p-2 text-slate-600 hover:text-cyan-500 transition-colors" title="Edit task"><Edit2 size={18} /></button>
                          <button onClick={() => handleDeleteTask(task.id!)} className="p-2 text-slate-600 hover:text-rose-500 transition-colors" title="Delete task"><Trash2 size={18} /></button>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
