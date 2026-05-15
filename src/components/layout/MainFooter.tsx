'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, ShieldCheck } from 'lucide-react';
import AdminLoginModal from "@/components/ui/AdminLoginModal";

// Custom SVG icons for compatibility with legacy Lucide version
const FacebookIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const LinkedinIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const YoutubeIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

interface MainFooterProps {
  hideTopStyling?: boolean;
}

const MainFooter: React.FC<MainFooterProps> = ({ hideTopStyling = false }) => {
  const currentYear = new Date().getFullYear();
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const socialLinks = [
    { 
      icon: <LinkedinIcon className="w-[18px] h-[18px]" />, 
      href: "https://www.linkedin.com/company/ieee-cs-student-branch-chapter-university-of-sri-jayewardenepura/",
      label: "LinkedIn"
    },
    { 
      icon: <InstagramIcon className="w-[18px] h-[18px]" />, 
      href: "https://www.instagram.com/ieee_usj_cs?igsh=aWNheXQyMmxreGto",
      label: "Instagram"
    },
    { 
      icon: <FacebookIcon className="w-[18px] h-[18px]" />, 
      href: "https://www.facebook.com/share/1EkWmtzhkP/?mibextid=wwXIfr",
      label: "Facebook"
    },
    { 
      icon: <Mail size={18} />, 
      href: "mailto:contact@beautyofcloud.com",
      label: "Email"
    },
    { 
      icon: <YoutubeIcon className="w-[18px] h-[18px]" />, 
      href: "#",
      label: "YouTube"
    },
  ];

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/#about" },
    { name: "Competition", href: "/#competition" },
    { name: "Contact Us", href: "/#contact" },
  ];

  // Manual logo position and scale controls
  const LOGO_CONFIG = {
    boc: { top: 0, left: 0, scale: 1 },
    ieee: { top: 0, left: 0, scale: 1 },
    ieee_cs: { top: 0, left: 0, scale: 1 },
  };


  return (
    <footer className={`relative w-full overflow-hidden bg-[#001a3d] ${hideTopStyling ? '' : 'border-t border-white/5'} py-8 md:py-10`}>
      {/* Background Gradient Effect */}
      {!hideTopStyling && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-full bg-[radial-gradient(50%_50%_at_50%_0%,rgba(43,137,243,0.1)_0%,transparent_100%)] pointer-events-none" />
      )}
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Top Section: Logos Only (Stacked on mobile, 3 columns on desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center mb-8 border-b border-white/5 pb-8">
          
          {/* Logo 1: BOC */}
          <div className="flex justify-center md:justify-start">
            <div 
              className="relative w-64 h-20 md:w-48 md:h-16 transition-transform hover:scale-105 duration-300"
              style={{ 
                top: `${LOGO_CONFIG.boc.top}px`, 
                left: `${LOGO_CONFIG.boc.left}px`,
                transform: `scale(${LOGO_CONFIG.boc.scale})` 
              }}
            >
              <Image 
                src="/email-and-header/boc.webp" 
                alt="Beauty of Cloud" 
                fill 
                sizes="(max-width: 768px) 256px, 192px"
                className="object-contain"
              />
            </div>
          </div>

          {/* Logo 2: IEEE USJ */}
          <div className="flex justify-center">
            <div 
              className="relative w-64 h-20 transition-transform hover:scale-105 duration-300"
              style={{ 
                top: `${LOGO_CONFIG.ieee.top}px`, 
                left: `${LOGO_CONFIG.ieee.left}px`,
                transform: `scale(${LOGO_CONFIG.ieee.scale})` 
              }}
            >
              <Image 
                src="/email-and-header/ieee.webp" 
                alt="IEEE USJ" 
                fill 
                sizes="(max-width: 768px) 256px, 256px"
                className="object-contain"
              />
            </div>
          </div>

          {/* Logo 3: IEEE CS USJ */}
          <div className="flex justify-center md:justify-end">
            <div 
              className="relative w-64 h-20 md:w-72 md:h-24 transition-transform hover:scale-105 duration-300"
              style={{ 
                top: `${LOGO_CONFIG.ieee_cs.top}px`, 
                left: `${LOGO_CONFIG.ieee_cs.left}px`,
                transform: `scale(${LOGO_CONFIG.ieee_cs.scale})` 
              }}
            >
              <Image 
                src="/email-and-header/IEEE-CS.webp" 
                alt="IEEE CS USJ" 
                fill 
                sizes="(max-width: 768px) 256px, 288px"
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Bottom Section: Content (Nav, Socials, Copyright) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          
          {/* Nav Links */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex flex-col space-y-2 text-center md:text-left">
              <nav className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    className="text-white/60 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Socials */}
          <div className="flex flex-col items-center space-y-4">
            <p className="text-white/40 text-[10px] uppercase tracking-widest font-mono">Connect With Us</p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm text-white/70 hover:text-white transition-all"
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Copyright & Admin */}
          <div className="flex flex-col items-center md:items-end space-y-6 text-center md:text-right">
            <div className="max-w-[300px]">
              <p className="text-white/40 text-[11px] leading-relaxed mb-4">
                Copyright © {currentYear} Beauty of Cloud Designed by IEEE Student Branch of University of Sri Jayewardenepura
              </p>
              
              <button 
                onClick={() => setIsAdminModalOpen(true)}
                className="group flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:text-white transition-all duration-300 mx-auto md:mr-0"
              >
                <ShieldCheck size={14} className="text-blue-500 group-hover:animate-pulse" />
                <span className="text-[10px] uppercase tracking-widest font-mono font-bold text-white/40 group-hover:text-white">Admin</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Subtle bottom line */}
      <div className="mt-8 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <AdminLoginModal 
        isOpen={isAdminModalOpen} 
        onClose={() => setIsAdminModalOpen(false)} 
      />
    </footer>
  );
};

export default MainFooter;
