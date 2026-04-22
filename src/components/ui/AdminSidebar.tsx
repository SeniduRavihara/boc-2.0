"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Mail, 
  Users, 
  Trophy,
  LogOut,
  Cloud,
  ChevronRight,
  Monitor,
  UserPlus
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Registrations', href: '/admin/registrations', icon: UserPlus },
  { name: 'Live Leaderboard', href: '/admin/leaderboard', icon: Trophy },
  { name: 'Quiz Management', href: '/admin/quiz', icon: Monitor },
  { name: 'Task Tracking', href: '/admin/task-tracking', icon: CheckSquare },
  { name: 'Email Tool', href: '/admin/email-tool', icon: Mail },
  { name: 'Attendance', href: '/admin/attendance', icon: Users },
];

export function AdminSidebar({ isCollapsed, toggleCollapse }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div 
      className={`
        ${isCollapsed ? "w-20" : "w-72"} 
        h-screen flex flex-col bg-[#030712] border-r border-slate-800/50 
        fixed left-0 top-0 z-40 transition-all duration-300
        hidden lg:flex
      `}
    >
      {/* Logo Section - Matching Sample Pattern */}
      <div className="h-20 flex items-center px-6 border-b border-slate-800/50 shrink-0 relative">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 shrink-0">
            <Cloud size={24} />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h1 className="text-lg font-black text-white leading-tight truncate">BOC 2.0</h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Admin Portal</p>
            </div>
          )}
        </Link>

        {/* Toggle Button - Centered Vertically (Sri Lanka Business Pattern) */}
        <button
          onClick={toggleCollapse}
          className="absolute -right-3 top-1/2 -translate-y-1/2 bg-[#030712] border border-slate-800 rounded-full p-1 text-slate-500 hover:text-purple-400 z-50 transition-all hover:scale-110 shadow-lg"
        >
          <div className={`transition-transform duration-300 ${isCollapsed ? '' : 'rotate-180'}`}>
            <ChevronRight size={16} />
          </div>
        </button>
      </div>
      
      {/* Navigation Space */}
      <div className="flex-1 w-full overflow-y-auto overflow-x-hidden custom-scrollbar py-6">
        <nav className={`space-y-1.5 ${isCollapsed ? 'px-3' : 'px-4'}`}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-all duration-200 group border ${
                  isActive
                    ? "bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.05)]"
                    : "text-slate-500 border-transparent hover:text-white hover:bg-slate-900"
                } ${isCollapsed ? "justify-center" : ""}`}
                title={isCollapsed ? item.name : ""}
              >
                <span
                  className={`shrink-0 transition-colors ${
                    isActive ? "text-purple-400" : "text-slate-600 group-hover:text-slate-300"
                  }`}
                >
                  <Icon size={20} />
                </span>
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / User Info & Logout */}
      <div
        className={`p-6 border-t border-slate-900 bg-black/20 flex flex-col gap-2 ${
          isCollapsed ? "items-center" : ""
        }`}
      >
        <Link 
          href="/" 
          className={`flex items-center gap-3 w-full px-3 py-3 text-sm font-bold text-slate-500 hover:text-white hover:bg-slate-900 rounded-xl transition-all border border-transparent ${
            isCollapsed ? "justify-center" : ""
          }`}
          title={isCollapsed ? "Return to Site" : ""}
        >
          <LogOut size={20} className="shrink-0" />
          {!isCollapsed && <span>Return to Site</span>}
        </Link>
      </div>
    </div>
  );
}
