'use client';

import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, Loader2 } from "lucide-react";

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
      // Simulate API call
      console.log('Form data:', formData);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
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

  return (
    <footer id="contact" className="relative z-20 py-24 px-6 bg-[#050812]">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Get in Touch Card */}
          <div className="bg-[#0f172a] rounded-[32px] p-6 md:p-12 flex flex-col justify-center border border-white/5">
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
          <div className="bg-[#0f172a] rounded-[32px] p-6 md:p-12 border border-white/5">
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
                  className="w-full bg-[#020617] border border-white/5 rounded-xl px-5 py-4 md:px-6 md:py-8 outline-none focus:border-blue-500/50 resize-none transition-colors text-white text-sm md:text-base" 
                />
              </div>

              {isSuccess && (
                <div 
                  className="bg-green-500/10 border border-green-500/20 text-green-500 px-6 py-4 rounded-xl text-sm font-bold animate-in fade-in slide-in-from-top-1"
                >
                  Message sent successfully! We&apos;ll get back to you soon.
                </div>
              )}
              {error && (
                <div 
                  className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-xl text-sm font-bold animate-in fade-in slide-in-from-top-1"
                >
                  {error}
                </div>
              )}

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full md:w-auto bg-[#3b82f6] text-white font-bold py-3 md:py-4 px-8 md:px-10 rounded-xl transition-all shadow-[0_4px_20px_rgba(59,130,246,0.3)] hover:brightness-110 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
              >
                {isLoading ? (
                  <>Sending... <Loader2 className="w-4 h-4 animate-spin" /></>
                ) : (
                  <>Send Message <Send className="w-4 h-4" /></>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-20 pt-10 border-t border-white/5 text-center text-xs text-white/20 uppercase tracking-[0.4em] font-mono">
          &copy; 2026 Beauty of Cloud. Part of the Digital Multiverse.
        </div>
      </div>
    </footer>
  );
};
