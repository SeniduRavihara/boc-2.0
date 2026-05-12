"use client";

import { motion } from "framer-motion";
import { Mail, Phone } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

// Custom Icons
const LinkedinIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
);

const WhatsappIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1z" /><path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1z" /><path d="M9 14h6" /></svg>
);

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

gsap.registerPlugin(ScrollTrigger);

export function ContactSection() {
  const sectionRef = useRef(null);
  const desktopCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const mobileCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [api, setApi] = useState<CarouselApi>();
  const [canScroll, setCanScroll] = useState(false);

  useEffect(() => {
    if (!api) return;

    const updateScroll = () => {
      setCanScroll(api.canScrollPrev() || api.canScrollNext());
    };

    updateScroll();
    api.on("select", updateScroll);
    api.on("reInit", updateScroll);

    return () => {
      api.off("select", updateScroll);
      api.off("reInit", updateScroll);
    };
  }, [api]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 85%",
          },
        }
      );

      // Line animation
      gsap.fromTo(
        ".title-line",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.5,
          ease: "power2.out",
          delay: 0.3,
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 85%",
          },
        }
      );

      // Card animations
      gsap.from(
        [...mobileCardsRef.current, ...desktopCardsRef.current].filter(
          (card): card is HTMLDivElement => card !== null
        ),
        {
          opacity: 0,
          y: 60,
          scale: 0.9,
          duration: 0.8,
          ease: "back.out(1.2)",
          stagger: 0.15,
          scrollTrigger: {
            trigger: ".cards-container",
            start: "top 80%",
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact-us"
      ref={sectionRef}
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

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 ref={titleRef} className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-blue-500 mb-6 drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            Contact Us
          </h2>
          <div className="flex justify-center">
            <div className="title-line h-1 w-24 bg-blue-600 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)]" />
          </div>
        </div>

        <div className="cards-container relative w-full px-4 md:px-10">
          <div className="mx-auto flex max-w-md flex-col gap-6 md:hidden">
            {CONTACTS.map((contact, index) => (
              <ContactCard
                key={contact.name}
                contact={contact}
                index={index}
                hoveredIndex={hoveredIndex}
                setHoveredIndex={setHoveredIndex}
                refCallback={(el) => {
                  mobileCardsRef.current[index] = el;
                }}
                className="w-full"
              />
            ))}
          </div>

          <div className="hidden md:block">
            <Carousel
              setApi={setApi}
              opts={{
                align: "start",
                loop: false,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4 py-8">
                {CONTACTS.map((contact, index) => (
                  <CarouselItem
                    key={contact.name}
                    className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                  >
                    <ContactCard
                      contact={contact}
                      index={index}
                      hoveredIndex={hoveredIndex}
                      setHoveredIndex={setHoveredIndex}
                      refCallback={(el) => {
                        desktopCardsRef.current[index] = el;
                      }}
                      className="h-full"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>

              {canScroll && (
                <div className="flex justify-center mt-12 gap-4">
                  <CarouselPrevious className="static translate-y-0 bg-blue-600/10 border-blue-500/30 text-blue-500 hover:bg-blue-600 hover:text-white transition-all w-12 h-12" />
                  <CarouselNext className="static translate-y-0 bg-blue-600/10 border-blue-500/30 text-blue-500 hover:bg-blue-600 hover:text-white transition-all w-12 h-12" />
                </div>
              )}
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactCard({
  contact,
  index,
  hoveredIndex,
  setHoveredIndex,
  refCallback,
  className = "",
}: {
  contact: (typeof CONTACTS)[number];
  index: number;
  hoveredIndex: number | null;
  setHoveredIndex: React.Dispatch<React.SetStateAction<number | null>>;
  refCallback: (el: HTMLDivElement | null) => void;
  className?: string;
}) {
  return (
    <div
      ref={refCallback}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
      className={className}
    >
      <div
        className={`relative h-full bg-[#080c16]/80 border rounded-3xl p-8 backdrop-blur-xl flex flex-col items-center transition-all duration-500 ${
          hoveredIndex === index
            ? "border-blue-500/50 shadow-[0_20px_50px_rgba(0,0,0,0.5)] translate-y-[-8px] bg-[#0a1225]"
            : "border-blue-500/30 shadow-none"
        }`}
      >
        <div
          className="relative w-32 h-32 mb-8 transition-transform duration-500"
          style={{ transform: hoveredIndex === index ? "scale(1.05)" : "scale(1)" }}
        >
          <div
            className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl transition-colors"
            style={{
              backgroundColor:
                hoveredIndex === index
                  ? "rgba(59,130,246,0.4)"
                  : "rgba(59,130,246,0.2)",
            }}
          />
          <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-[#0d152a] ring-2 ring-blue-500/30 group-hover:ring-blue-400/60 transition-all">
            <Image
              src={contact.img}
              alt={contact.name}
              fill
              className="object-cover"
            />
          </div>
        </div>

        <h3
          className={`text-xl font-bold mb-2 transition-colors text-center line-clamp-1 ${
            hoveredIndex === index ? "text-blue-400" : "text-white"
          }`}
        >
          {contact.name}
        </h3>
        <p className="text-slate-400 font-mono text-[10px] uppercase tracking-[0.25em] mb-8 text-center line-clamp-1">
          {contact.role}
        </p>

        <div className="flex items-center gap-4 mb-8">
          <SocialLink
            href={contact.linkedin}
            icon={<LinkedinIcon />}
            color="hover:text-[#0A66C2] hover:bg-[#0A66C2]/10"
          />
          <SocialLink
            href={contact.whatsapp}
            icon={<WhatsappIcon />}
            color="hover:text-[#25D366] hover:bg-[#25D366]/10"
          />
          <SocialLink
            href={contact.email}
            icon={<Mail size={18} />}
            color="hover:text-blue-400 hover:bg-blue-400/10"
          />
        </div>

        <div className="mt-auto pt-6 border-t border-white/5 w-full flex flex-col items-center gap-3">
          <PhoneContact phone={contact.phone} />
        </div>

        <div
          className={`absolute top-4 right-4 w-1.5 h-1.5 rounded-full transition-colors ${
            hoveredIndex === index ? "bg-blue-500 animate-pulse" : "bg-blue-500/20"
          }`}
        />
      </div>
    </div>
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
  const [copied, setCopied] = useState(false);

  const handlePhoneClick = (e: React.MouseEvent) => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (!isMobile) {
      e.preventDefault();
      navigator.clipboard.writeText(phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative">
      <a
        href={`tel:${phone.replace(/\s/g, "")}`}
        onClick={handlePhoneClick}
        className="flex items-center gap-2 text-white/40 hover:text-white transition-all hover:underline cursor-pointer decoration-blue-500 underline-offset-4"
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
