"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { checkAndInitializeUser } from "@/firebase/api";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Loader2 } from "lucide-react";

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export default function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const { user, loading: authLoading } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function verifyAccess() {
      if (authLoading) return;

      if (!user) {
        setIsAuthorized(false);
        setIsVerifying(false);
        // Redirect to home if not logged in
        router.push("/");
        return;
      }

      try {
        const role = await checkAndInitializeUser(user.uid, user.email, user.displayName);
        if (role === 'admin') {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
          router.push("/");
        }
      } catch (error) {
        console.error("Authorization check failed:", error);
        setIsAuthorized(false);
        router.push("/");
      } finally {
        setIsVerifying(false);
      }
    }

    verifyAccess();
  }, [user, authLoading, router]);

  if (authLoading || isVerifying) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center"
        >
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full" />
            <div className="relative w-16 h-16 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <h2 className="text-xl font-black text-white tracking-tighter uppercase mb-2">
            Verifying <span className="text-purple-500">Credentials</span>
          </h2>
          <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em]">
            Secure Handshake in Progress...
          </p>
        </motion.div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-center">
        <div className="mb-6 h-20 w-20 flex items-center justify-center rounded-3xl bg-red-500/10 border border-red-500/20 text-red-500">
          <ShieldAlert size={40} />
        </div>
        <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">
          Access <span className="text-red-500">Denied</span>
        </h2>
        <p className="text-slate-500 text-sm max-w-xs uppercase tracking-widest leading-loose">
          Unauthorized terminal access detected. Redirecting to safe zone.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
