"use client";

import React, { useState, useEffect } from "react";
import { DataProvider } from "@/context/DataContext";
import { AdminSidebar } from "@/components/ui/AdminSidebar";
import AdminAuthGuard from "@/components/auth/AdminAuthGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Sync with localStorage on mount (Pattern from Sri Lanka Business)
  useEffect(() => {
    const saved = localStorage.getItem("boc_admin_sidebar_collapsed");
    if (saved !== null) {
      setIsCollapsed(saved === "true");
    }
    setIsMounted(true);
  }, []);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("boc_admin_sidebar_collapsed", String(newState));
  };

  // Prevent layout jump on hydration
  if (!isMounted) {
    return (
      <div className="flex min-h-screen bg-[#030712] items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AdminAuthGuard>
      <DataProvider>
        {/* Root Container: Locked to Viewport (Sri Lanka Business Pattern) */}
        <div className="fixed inset-0 overflow-hidden bg-[#030712] flex selection:bg-purple-500/30">
          
          {/* Fixed Sidebar */}
          <AdminSidebar 
            isCollapsed={isCollapsed} 
            toggleCollapse={toggleSidebar} 
          />

          {/* Main Content Wrapper: margin-aware transition (Sri Lanka Business Pattern) */}
          <div
            className={`flex-1 flex flex-col min-w-0 transition-all duration-300 relative ${
              isCollapsed ? "lg:ml-20" : "lg:ml-72"
            }`}
          >
            {/* Scrollable Main Tag (Sri Lanka Business Pattern) */}
            <main className="flex-1 overflow-y-auto w-full custom-scrollbar p-6 md:p-10">
              {children}
            </main>
          </div>
        </div>
      </DataProvider>
    </AdminAuthGuard>
  );
}
