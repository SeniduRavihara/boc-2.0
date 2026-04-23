'use client';

import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, Loader2, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { addContactMessage } from "@/firebase/api";
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

export const Footer: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telephone: '',
    subject: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await addContactMessage(formData);
      setIsSuccess(true);
      setFormData({
        name: '',
        email: '',
        telephone: '',
        subject: '',
        message: ''
      });
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err: any) {
      console.error("Error submitting form:", err);
      setError("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  return (
    <footer id="contact" className="relative z-20 py-24 px-6 bg-background">
      <div className="container mx-auto max-w-7xl">
        {/* ... existing footer content ... */}
        {/* I will use the actual content from the file to avoid "existing footer content" placeholders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Get in Touch Card */}
          <div className="bg-[#0f172a] rounded-[32px] p-6 md:p-12 flex flex-col justify-center">
            <h2 className="text-xl md:text-3xl font-bold mb-6 md:mb-10 text-white">Get in Touch</h2>
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-full border border-blue-500/20 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Phone</p>
                  <p className="text-sm text-white/60">+94 11 234 5678</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-full border border-blue-500/20 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Email</p>
                  <p className="text-sm text-white/60">hello@beautyofcloud.com</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-full border border-blue-500/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Location</p>
                  <p className="text-sm text-white/60">University of Sri Jayewardenepura, Sri Lanka</p>
                </div>
              </div>
            </div>
          </div>

          {/* Send Us a Message Card */}
          <div className="bg-[#0f172a] rounded-[32px] p-6 md:p-12">
            <h2 className="text-xl md:text-3xl font-bold mb-6 md:mb-10 text-white">Send Us a Message</h2>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/60 ml-2">Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your name" 
                    className="w-full bg-[#020617] border border-white/5 rounded-xl px-5 py-3 md:px-6 md:py-4 outline-none focus:border-blue-500/50 transition-colors text-white text-sm md:text-base" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/60 ml-2">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com" 
                    className="w-full bg-[#020617] border border-white/5 rounded-xl px-5 py-3 md:px-6 md:py-4 outline-none focus:border-blue-500/50 transition-colors text-white text-sm md:text-base" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/60 ml-2">Telephone</label>
                  <input 
                    type="text" 
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    placeholder="+94 XX XXX XXXX" 
                    className="w-full bg-[#020617] border border-white/5 rounded-xl px-5 py-3 md:px-6 md:py-4 outline-none focus:border-blue-500/50 transition-colors text-white text-sm md:text-base" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/60 ml-2">Subject</label>
                  <input 
                    type="text" 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="What is this regarding?" 
                    className="w-full bg-[#020617] border border-white/5 rounded-xl px-5 py-3 md:px-6 md:py-4 outline-none focus:border-blue-500/50 transition-colors text-white text-sm md:text-base" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/60 ml-2">Message</label>
                <textarea 
                  rows={4} 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Your message here..." 
                  className="w-full bg-[#020617] border border-white/5 rounded-xl px-5 py-4 md:px-6 md:py-12 outline-none focus:border-blue-500/50 resize-none transition-colors text-white text-sm md:text-base" 
                />
              </div>

              <AnimatePresence>
                {isSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-green-500/10 border border-green-500/20 text-green-500 px-6 py-4 rounded-xl text-sm font-bold"
                  >
                    Message sent successfully! We'll get back to you soon.
                  </motion.div>
                )}
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-xl text-sm font-bold"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button 
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full md:w-auto bg-[#3b82f6] text-white font-bold py-3 md:py-4 px-8 md:px-10 rounded-xl transition-all shadow-[0_4px_20px_rgba(59,130,246,0.3)] hover:brightness-110 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
              >
                {isLoading ? (
                  <>Sending... <Loader2 className="w-4 h-4 animate-spin" /></>
                ) : (
                  <>Send Message <Send className="w-4 h-4" /></>
                )}
              </motion.button>
            </form>
          </div>
        </div>

        <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-xs text-white/20 uppercase tracking-[0.4em] font-mono order-2 md:order-1 text-center md:text-left">
            &copy; 2026 Beauty of Cloud. Part of the Digital Multiverse.
          </div>
          
          <div className="flex items-center gap-4 order-1 md:order-2">
            {[
              { 
                icon: FacebookIcon, 
                color: 'hover:bg-[#1877F2]',
                href: 'https://www.facebook.com/share/1EkWmtzhkP/?mibextid=wwXIfr'
              },
              { 
                icon: LinkedinIcon, 
                color: 'hover:bg-[#0A66C2]',
                href: 'https://www.linkedin.com/company/ieee-cs-student-branch-chapter-university-of-sri-jayewardenepura/'
              },
              { 
                icon: InstagramIcon, 
                color: 'hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7]',
                href: 'https://www.instagram.com/ieee_usj_cs?igsh=aWNheXQyMmxreGto'
              }
            ].map(({ icon: Icon, color, href }, i) => (
              <Link 
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 transition-all duration-300 hover:scale-110 hover:-translate-y-1 ${color} hover:border-transparent hover:text-white text-white/40`}
              >
                <Icon className="w-4 h-4" />
              </Link>
            ))}

            <div className="w-[1px] h-4 bg-white/10 mx-2" />

            <button 
              onClick={() => setIsAdminModalOpen(true)}
              className="group flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:text-white transition-all duration-300"
            >
              <ShieldCheck size={14} className="text-blue-500 group-hover:animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest font-mono font-bold text-white/40 group-hover:text-white">Admin</span>
            </button>
          </div>
        </div>

        <AdminLoginModal 
          isOpen={isAdminModalOpen} 
          onClose={() => setIsAdminModalOpen(false)} 
        />
      </div>
    </footer>
  );
};
