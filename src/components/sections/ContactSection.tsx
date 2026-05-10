"use client";

import { motion } from "framer-motion";
import { Mail, MessageCircle, Phone } from "lucide-react";

// Custom LinkedIn Icon for compatibility with legacy Lucide version
const LinkedinIcon = ({ size = 24, ...props }: any) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// Custom WhatsApp Icon
const WhatsappIcon = ({ size = 24, ...props }: any) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1z" />
    <path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1z" />
    <path d="M9 14h6" />
  </svg>
);

import Image from "next/image";
import React from "react";

const CONTACTS = [
  {
    name: "Waruna Udara Sampath",
    role: "Event Co-Chair",
    img: "/contact-us/warunaudara.webp",
    phone: "+94 70 174 3074",
    linkedin: "https://www.linkedin.com/in/waruna-udara/",
    whatsapp: "https://wa.me/94701743074",
    email: "mailto:warunaudarasam2003@gmail.com",
  },
  {
    name: "Nimesha Rathnayake",
    role: "Event Co-Chair",
    img: "/contact-us/Nimesga.webp",
    phone: "+94 77 488 8701",
    linkedin: "https://www.linkedin.com/in/nimesha-rathnayake-b95471344/",
    whatsapp: "https://wa.me/94774888701",
    email: "mailto:nimeshakavindu91@gmail.com",
  },
  {
    name: "Shanki Tharusha",
    role: "Event Industry Relations Head",
    img: "/contact-us/Shanki Tharusha_photo.webp",
    phone: "+94 76 346 9070",
    linkedin: "https://www.linkedin.com/in/shanki-tharusha-531144349/",
    whatsapp: "https://wa.me/94763469070",
    email: "mailto:shankitharu@gmail.com",
  },
  {
    name: "Senidu Ravihara",
    role: "Programming Team Head",
    img: "/contact-us/Senidu.webp",
    phone: "+94 78 171 8964",
    linkedin: "https://www.linkedin.com/in/senidu-ravihara/",
    whatsapp: "https://wa.me/94781718964",
    email: "mailto:seniduravihara@gmail.com",
  },
];

export function ContactSection() {
  return (
    <section
      id="contact-us"
      className="w-full py-24 bg-[#050812] relative overflow-hidden"
    >
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-400/5 rounded-full blur-[120px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-blue-500 mb-6 drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]"
          >
            Contact Us
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "120px" }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="h-1 bg-blue-500 mx-auto rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {CONTACTS.map((contact, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
              whileHover={{ y: -12, transition: { duration: 0.3 } }}
              className="relative group h-full"
            >
              {/* Card Glow Effect */}
              <div className="absolute -inset-[1px] bg-gradient-to-b from-blue-500 to-transparent rounded-3xl opacity-20 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />

              <div className="relative h-full bg-[#080c16]/80 border border-blue-500/30 rounded-3xl p-8 backdrop-blur-xl flex flex-col items-center transition-all duration-500 group-hover:border-blue-400 group-hover:bg-[#0a1225] group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                {/* Profile Image Container */}
                <div className="relative w-32 h-32 mb-8 group-hover:scale-105 transition-transform duration-500">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl group-hover:bg-blue-500/40 transition-colors" />
                  <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-[#0d152a] ring-2 ring-blue-500/30 group-hover:ring-blue-400/60 transition-all">
                    <Image
                      src={contact.img}
                      alt={contact.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Name and Role */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors text-center">
                  {contact.name}
                </h3>
                <p className="text-slate-400 font-mono text-[10px] uppercase tracking-[0.25em] mb-8 text-center">
                  {contact.role}
                </p>

                {/* Social Actions */}
                <div className="flex items-center gap-4 mb-8">
                  <SocialLink
                    href={contact.linkedin}
                    icon={<LinkedinIcon size={18} />}
                    color="hover:text-[#0A66C2] hover:bg-[#0A66C2]/10"
                  />
                  <SocialLink
                    href={contact.whatsapp}
                    icon={<WhatsappIcon size={18} />}
                    color="hover:text-[#25D366] hover:bg-[#25D366]/10"
                  />
                  <SocialLink
                    href={contact.email}
                    icon={<Mail size={18} />}
                    color="hover:text-blue-400 hover:bg-blue-400/10"
                  />
                </div>

                {/* Contact Info */}
                <div className="mt-auto pt-6 border-t border-white/5 w-full flex flex-col items-center gap-3">
                  <PhoneContact phone={contact.phone} />
                </div>

                {/* Accent Detail */}
                <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-blue-500/20 group-hover:bg-blue-500 animate-pulse" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SocialLink({
  href,
  icon,
  color,
}: {
  href: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-white/30 transition-all duration-300 ${color} hover:border-current hover:scale-110`}
    >
      {icon}
    </a>
  );
}

function PhoneContact({ phone }: { phone: string }) {
  const [copied, setCopied] = React.useState(false);

  const handlePhoneClick = (e: React.MouseEvent) => {
    // Basic mobile detection
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (!isMobile) {
      // Desktop: Copy to clipboard
      e.preventDefault();
      navigator.clipboard.writeText(phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    // Mobile: default link behavior (tel:) will take over
  };

  return (
    <div className="relative">
      <a
        href={`tel:${phone.replace(/\s/g, "")}`}
        onClick={handlePhoneClick}
        className="flex items-center gap-2 text-white/40 group-hover:text-white transition-all hover:underline cursor-pointer decoration-blue-500 underline-offset-4"
      >
        <Phone size={14} className="text-blue-500" />
        <span className="font-mono text-sm font-semibold tracking-wider">
          {phone}
        </span>
      </a>
      {copied && (
        <motion.span
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] bg-blue-500 text-white px-2 py-1 rounded font-bold uppercase tracking-tighter shadow-[0_0_15px_rgba(59,130,246,0.5)] z-20"
        >
          Copied!
        </motion.span>
      )}
    </div>
  );
}
