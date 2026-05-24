'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { RegistrationLayout } from "@/components/layout/RegistrationLayout";
import { GradientShinyTitle } from "@/components/ui/GradientShinyTitle";
import { ArrowLeft, ArrowRight, Download, BookOpen, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const SLIDES = [
  {
    type: 'cover',
    title: 'BEAUTY OF CLOUD 2.0',
    subtitle: 'DELEGATE BOOKLET',
    tagline: 'GUIDELINES & COMPETITION FRAMEWORK',
  },
  {
    type: 'welcome',
    title: 'WELCOME TO THE FUTURE OF CLOUD INNOVATION',
    text: 'WHERE CREATIVITY MEETS CLOUD TECHNOLOGY, INNOVATIVE MINDS COME TOGETHER TO ENGINEER IMPACTFUL SOLUTIONS FOR TOMORROW...',
  },
  {
    type: 'toc',
    title: 'TABLE OF CONTENTS',
    items: [
      '1. WHAT IS IEEE?',
      '2. WHAT IS BEAUTY OF CLOUD?',
      '3. WHY BEAUTY OF CLOUD?',
      '4. EVENT STRUCTURE',
      '5. WHY PARTICIPATE?',
      '6. PRIZE POOL',
      '7. HOW TO REGISTER',
      '8. TEAM FORMATION',
      '9. REAL-WORLD AWS CHALLENGES',
      '10. SCENARIO SPOTLIGHT',
      '11. TECHNOLOGIES BEHIND INNOVATION',
      '12. JUDGING CRITERIA',
      '13. EVALUATION PROCESS',
      '14. CONTACT INFORMATION',
    ]
  },
  {
    type: 'content',
    number: '1',
    title: 'WHAT IS IEEE?',
    blocks: [
      { type: 'quote', text: '“FROM DEFINING GLOBAL TECHNOLOGICAL STANDARDS TO DRIVING GROUNDBREAKING INNOVATION, IEEE STANDARDS AT THE HEART OF THE TECHNOLOGIES SHAPING THE FUTURE OF HUMANITY.”' },
      { type: 'text', text: "WORLD’S LARGEST TECHNICAL PROFESSIONAL ORGANIZATION DEDICATED TO ADVANCING TECHNOLOGY FOR HUMANITY. IEEE LEADS IN ADVANCING TECHNOLOGY FOR HUMANITY ACROSS ELECTRICAL ENGINEERING, COMPUTER SCIENCE, AND RELATED FIELDS." },
      { type: 'heading', text: 'IEEE COMPUTER SOCIETY – USJ' },
      { type: 'quote', text: '“A COMMUNITY WHERE INNOVATION, LEADERSHIP, AND COMPUTING EXCELLENCE UNITE TO EMPOWER THE NEXT GENERATION OF TECHNOLOGY LEADERS.”' },
      { type: 'text', text: 'ESTABLISHED IN 2024, IEEE COMPUTER SCIENCE (CS) CHAPTER AT THE UNIVERSITY OF SRI JAYEWARDENEPURA CONNECTS STUDENTS WITH GLOBAL OPPORTUNITIES, INDUSTRY EXPOSURE, AND EMERGING TECHNOLOGIES.' }
    ]
  },
  {
    type: 'content',
    number: '2',
    title: 'WHAT IS BEAUTY OF CLOUD?',
    blocks: [
      { type: 'subtitle', text: 'BEAUTY OF CLOUD IS A CLOUD-FOCUS INNOVATION HACKATHON DESIGNED TO INSPIRE CREATIVITY, COLLABORATION, AND REAL-WORLD PROBLEM SOLVING THROUGH MODERN CLOUD TECHNOLOGIES.' },
      { type: 'bullets', items: [
        'CLOUD INNOVATION',
        'REAL-WORLD CHALLENGES',
        'CLOUD TECHNOLOGIES',
        'COLLABORATION & CREATIVITY',
        'SCALABLE SOLUTIONS'
      ]}
    ]
  },
  {
    type: 'content',
    number: '3',
    title: 'WHY BEAUTY OF CLOUD?',
    blocks: [
      { type: 'subtitle', text: 'A SIMULATED PRODUCTION HACKATHON THAT BRIDGES THE GAP BETWEEN ACADEMIC THEORY AND REAL-WORLD INDUSTRIAL CLOUD OPERATIONS.' },
      { type: 'bullets', items: [
        'HANDS-ON PRODUCTION SANDBOX ENVIRONMENTS',
        'MENTORING FROM CERTIFIED CLOUD SOLUTIONS ARCHITECTS',
        'RESUME & PORTFOLIO VALUE FOR CLOUD CAREERS',
        'REAL-WORLD SCENARIO PROBLEM SOLVING'
      ]}
    ]
  },
  {
    type: 'content',
    number: '4',
    title: 'EVENT STRUCTURE',
    blocks: [
      { type: 'subtitle', text: 'THE CHAMPIONSHIP RUNS IN THREE PROGRESSIVE PHASES:' },
      { type: 'text', text: 'PHASE 1: VIRTUAL CLOUD QUIZ - TIMED AWS & ARCHITECTURE MCQ ASSESSMENT.' },
      { type: 'text', text: 'PHASE 2: IDEATHON & ARCHITECTURE DESIGN - TEAMS ARCHITECT SOLUTIONS FOR COMPLEX ENTERPRISE CASE SCENARIOS.' },
      { type: 'text', text: 'PHASE 3: LIVE PITCH PRESENTATION - PRESENT ARCHITECTURE BLUEPRINTS, COST ESTIMATES, AND SECURITY SCHEMAS TO A PANEL OF INDUSTRY EXPERTS.' }
    ]
  },
  {
    type: 'content',
    number: '5',
    title: 'WHY PARTICIPATE?',
    blocks: [
      { type: 'bullets', items: [
        'DIRECT EXPOSURE TO CLOUD ENGINEERING INDUSTRY STANDARDS',
        'AWS SANDBOX CREDITS AND LAB VOUCHERS',
        'OFFICIAL DIGITAL CERTIFICATES VERIFIED BY IEEE USJP COMPUTER SOCIETY',
        'NETWORKING CHANNELS WITH LEAD SOLUTIONS ARCHITECTS & SPONSORS'
      ]}
    ]
  },
  {
    type: 'content',
    number: '6',
    title: 'PRIZE POOL',
    blocks: [
      { type: 'heading', text: 'CHAMPIONSHIP CASH REWARDS:' },
      { type: 'text', text: '★ FIRST PLACE: RS. 30,000 + OFFICIAL MEDALS & SHIELD' },
      { type: 'text', text: '★ SECOND PLACE: RS. 20,000 + OFFICIAL CERTIFICATES' },
      { type: 'text', text: '★ THIRD PLACE: RS. 10,000 + OFFICIAL CERTIFICATES' },
      { type: 'text', text: '★ ALL PARTICIPANTS: VERIFIED DIGITAL CERTIFICATES OF PARTICIPATION' }
    ]
  },
  {
    type: 'content',
    number: '7',
    title: 'HOW TO REGISTER',
    blocks: [
      { type: 'subtitle', text: 'REGISTER ONLINE VIA THE OFFICIAL BEAUTY OF CLOUD PORTAL:' },
      { type: 'heading', text: 'REGISTRATION PORTAL URL' },
      { type: 'text', text: 'HTTP://LOCALHOST:3004/REGISTER/SESSION/2' },
      { type: 'text', text: 'STEPS: COMPLETE THE TEAM PROFILE, UPLOAD STUDENT IDENTITY VERIFICATION, AND SELECT COMPETING TRACKS.' }
    ]
  },
  {
    type: 'content',
    number: '8',
    title: 'TEAM FORMATION',
    blocks: [
      { type: 'bullets', items: [
        'TEAMS OF UP TO 3 DELEGATES ARE FULLY PERMITTED',
        'CROSS-UNIVERSITY TEAM FORMATION IS ALLOWED',
        'TEAMS MUST NOMINATE A CAPTAIN FOR PORTAL SUBMISSIONS',
        'INDIVIDUAL REGISTRATIONS CAN BE PAIRED ON REQUEST'
      ]}
    ]
  },
  {
    type: 'content',
    number: '9',
    title: 'REAL-WORLD AWS CHALLENGES',
    blocks: [
      { type: 'subtitle', text: 'DELEGATES TACKLE REAL-WORLD ARCHITECTURE CHALLENGES:' },
      { type: 'bullets', items: [
        'HIGH-AVAILABILITY MULTI-AZ APPLICATION DEPLOYMENT',
        'SECURE VPC ROUTING, PUBLIC/PRIVATE SUBNETS & NAT GATEWAYS',
        'PRIVILEGE POLICIES VIA AWS IDENTITY & ACCESS MANAGEMENT (IAM)',
        'SERVERLESS WORKFLOWS USING AWS LAMBDA & API GATEWAY'
      ]}
    ]
  },
  {
    type: 'content',
    number: '10',
    title: 'SCENARIO SPOTLIGHT',
    blocks: [
      { type: 'heading', text: 'SESSION 2 CASE STUDY: THE FLASH SALE SCENARIO' },
      { type: 'text', text: 'A LEADING E-COMMERCE PORTAL IS LAUNCHING A HIGH-DEMAND FLASH SALE. CONCURRENT USERS ARE SCALING FROM 1,000 TO 500,000 WITHIN 5 MINUTES.' },
      { type: 'text', text: 'CHALLENGE: ARCHITECT AN AWS INFRASTRUCTURE THAT PREVENTS DATABASE BOTTLENECK, ELIMINATES LATENCY SPIKES, SECURES API ENDPOINTS, AND RUNS COST-EFFECTIVELY.' }
    ]
  },
  {
    type: 'content',
    number: '11',
    title: 'TECHNOLOGIES BEHIND INNOVATION',
    blocks: [
      { type: 'bullets', items: [
        'AMAZON WEB SERVICES (AWS) CORE COMPUTE & NETWORK INFRASTRUCTURE',
        'DOCKER FOR EFFICIENT CONTAINERIZATION OF DEPLOYED MICROSERVICES',
        'KUBERNETES FOR AUTOMATED DEPLOYMENT, SCALING, AND MANAGEMENT',
        'TERRAFORM FOR DECLARATIVE INFRASTRUCTURE AS CODE (IAC)'
      ]}
    ]
  },
  {
    type: 'content',
    number: '12',
    title: 'JUDGING CRITERIA',
    blocks: [
      { type: 'text', text: '★ CLOUD ARCHITECTURE & BEST PRACTICES (35%): AVAILABILITY, SECURITY.' },
      { type: 'text', text: '★ FEASIBILITY & COST OPTIMIZATION (20%): RESOURCE BUDGET ALLOCATION.' },
      { type: 'text', text: '★ INNOVATION & TECHNOLOGY INTEGRATION (30%): CONTAINER/SERVERLESS.' },
      { type: 'text', text: '★ PRESENTATION & PITCH (15%): CLARITY OF ARCHITECTURE DIAGRAMS.' }
    ]
  },
  {
    type: 'content',
    number: '13',
    title: 'EVALUATION PROCESS',
    blocks: [
      { type: 'text', text: 'STAGE 1: AUTOMATED ONLINE AWS CONFIGURATION QUIZ.' },
      { type: 'text', text: 'STAGE 2: TECHNICAL ARCHITECTURE DIAGRAM REVIEW BY MENTORS.' },
      { type: 'text', text: 'STAGE 3: LIVE PITCH DEFENSE TO THE GRAND PANEL JURY.' }
    ]
  },
  {
    type: 'content',
    number: '14',
    title: 'CONTACT INFORMATION',
    blocks: [
      { type: 'heading', text: 'IEEE COMPUTER SOCIETY - UNIVERSITY OF SRI JAYEWARDENEPURA' },
      { type: 'text', text: 'EMAIL: SUPPORT@BEAUTYOFCLOUD.LK' },
      { type: 'text', text: 'HOTLINE: +94 77 123 4567' },
      { type: 'text', text: 'ADDRESS: FACULTY OF APPLIED SCIENCES, USJ, GANGODAWILA, NUGEGODA.' }
    ]
  }
];

export default function DelegateBookletPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setActiveIndex(prev => Math.min(prev + 1, SLIDES.length - 1));
      } else if (e.key === 'ArrowLeft') {
        setActiveIndex(prev => Math.max(prev - 1, 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const downloadPDF = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [1280, 800]
      });

      // Temporary high-res rendering container
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      container.style.width = '1280px';
      container.style.height = '800px';
      container.style.overflow = 'hidden';
      document.body.appendChild(container);

      for (let i = 0; i < SLIDES.length; i++) {
        container.innerHTML = '';
        const slideEl = document.createElement('div');
        slideEl.style.width = '1280px';
        slideEl.style.height = '800px';
        slideEl.style.position = 'relative';
        slideEl.style.backgroundImage = 'url(/booklet/background.png)';
        slideEl.style.backgroundSize = 'cover';
        slideEl.style.backgroundPosition = 'center';
        slideEl.style.display = 'flex';
        slideEl.style.flexDirection = 'column';
        slideEl.style.justifyContent = 'flex-start';
        slideEl.style.alignItems = 'flex-start';
        slideEl.style.textAlign = 'left';
        slideEl.style.padding = '80px';
        slideEl.style.boxSizing = 'border-box';
        slideEl.style.color = '#fff';
        slideEl.style.fontFamily = 'monospace';

        const slide = SLIDES[i];
        if (slide.type === 'cover') {
          slideEl.innerHTML = `
            <div style="display: flex; flex-direction: column; justify-content: center; height: 100%; max-width: 65%; gap: 20px;">
              <h1 style="font-size: 52px; font-weight: 900; margin: 0; line-height: 1.1; font-family: sans-serif; letter-spacing: -2px;">${slide.title}</h1>
              <h2 style="font-size: 32px; font-weight: 700; color: #3b82f6; margin: 0; letter-spacing: 2px;">${slide.subtitle}</h2>
              <div style="width: 80px; height: 4px; background: #3b82f6; margin: 10px 0; border-radius: 99px;"></div>
              <p style="font-size: 16px; color: #94a3b8; margin: 0; letter-spacing: 3px; font-weight: bold; text-transform: uppercase;">${slide.tagline}</p>
            </div>
          `;
        } else if (slide.type === 'welcome') {
          slideEl.innerHTML = `
            <div style="display: flex; flex-direction: column; justify-content: center; height: 100%; max-width: 65%; gap: 30px;">
              <h1 style="font-size: 36px; font-weight: 900; margin: 0; line-height: 1.2; letter-spacing: -1px; text-transform: uppercase; font-family: sans-serif;">${slide.title}</h1>
              <p style="font-size: 18px; line-height: 1.6; color: #cbd5e1; margin: 0;">${slide.text}</p>
            </div>
          `;
        } else if (slide.type === 'toc') {
          let itemsHtmlLeft = '';
          let itemsHtmlRight = '';
          const half = Math.ceil(slide.items!.length / 2);
          slide.items!.forEach((item, idx) => {
            const itemHtml = `<div style="font-size: 14px; color: #cbd5e1; margin-bottom: 12px; font-weight: bold; letter-spacing: 1px;">${item}</div>`;
            if (idx < half) itemsHtmlLeft += itemHtml;
            else itemsHtmlRight += itemHtml;
          });

          slideEl.innerHTML = `
            <div style="display: flex; flex-direction: column; height: 100%; width: 100%; gap: 40px; box-sizing: border-box; justify-content: center;">
              <h1 style="font-size: 36px; font-weight: 900; margin: 0 0 20px 0; letter-spacing: -1px; text-transform: uppercase; font-family: sans-serif;">${slide.title}</h1>
              <div style="display: flex; width: 65%; gap: 50px;">
                <div style="flex: 1;">${itemsHtmlLeft}</div>
                <div style="flex: 1;">${itemsHtmlRight}</div>
              </div>
            </div>
          `;
        } else {
          let blocksHtml = '';
          slide.blocks!.forEach(block => {
            if (block.type === 'quote') {
              blocksHtml += `<div style="font-size: 14px; font-style: italic; color: #cbd5e1; border-left: 3px solid #3b82f6; padding-left: 15px; margin-bottom: 16px; line-height: 1.5;">${block.text}</div>`;
            } else if (block.type === 'text') {
              blocksHtml += `<p style="font-size: 13px; line-height: 1.6; color: #94a3b8; margin: 0 0 16px 0;">${block.text}</p>`;
            } else if (block.type === 'heading') {
              blocksHtml += `<h3 style="font-size: 16px; font-weight: 800; color: #3b82f6; margin: 0 0 12px 0; letter-spacing: 1px; text-transform: uppercase;">${block.text}</h3>`;
            } else if (block.type === 'subtitle') {
              blocksHtml += `<h2 style="font-size: 16px; font-weight: bold; color: #cbd5e1; line-height: 1.5; margin: 0 0 20px 0; text-transform: uppercase;">${block.text}</h2>`;
            } else if (block.type === 'bullets') {
              let listItems = '';
              block.items!.forEach(item => {
                listItems += `<li style="font-size: 13px; color: #cbd5e1; margin-bottom: 10px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase;">${item}</li>`;
              });
              blocksHtml += `<ul style="margin: 0 0 16px 0; padding-left: 20px; list-style-type: square;">${listItems}</ul>`;
            }
          });

          slideEl.innerHTML = `
            <div style="display: flex; flex-direction: column; height: 100%; max-width: 65%; justify-content: center; gap: 30px;">
              <h1 style="font-size: 32px; font-weight: 900; margin: 0; line-height: 1.1; letter-spacing: -1px; text-transform: uppercase; font-family: sans-serif;">${slide.number}. ${slide.title}</h1>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                ${blocksHtml}
              </div>
            </div>
          `;
        }

        container.appendChild(slideEl);
        await new Promise(resolve => setTimeout(resolve, 80));

        const canvas = await html2canvas(slideEl, {
          width: 1280,
          height: 800,
          scale: 2,
          backgroundColor: '#050812'
        });

        const imgData = canvas.toDataURL('image/png');
        if (i > 0) {
          pdf.addPage([1280, 800], 'landscape');
        }
        pdf.addImage(imgData, 'PNG', 0, 0, 1280, 800);
      }

      pdf.save('Beauty_of_Cloud_2.0_Delegate_Booklet.pdf');
      document.body.removeChild(container);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  const currentSlide = SLIDES[activeIndex];

  const nextSlide = () => setActiveIndex(prev => Math.min(prev + 1, SLIDES.length - 1));
  const prevSlide = () => setActiveIndex(prev => Math.max(prev - 1, 0));

  return (
    <RegistrationLayout>
      <div className="max-w-5xl mx-auto px-4">
        
        {/* Top Control Bar */}
        <div className="flex justify-between items-center mb-6">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-slate-400 hover:text-white uppercase transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">
              PAGE {activeIndex + 1} OF {SLIDES.length}
            </span>
            <button 
              onClick={downloadPDF}
              disabled={isExporting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 disabled:bg-white/5 disabled:text-slate-500 font-bold tracking-wider text-[10px] uppercase text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] disabled:shadow-none hover:scale-105 disabled:hover:scale-100 transition-all flex items-center justify-center gap-2"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  Export as PDF
                </>
              )}
            </button>
          </div>
        </div>

        {/* Widescreen Interactive Slide Viewer */}
        <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#050812] group/viewer">
          {/* Background image loaded directly from public path */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-500"
            style={{ backgroundImage: 'url(/booklet/background.png)' }}
          />

          {/* Slide Text Content overlay */}
          <div className="absolute inset-0 flex flex-col justify-center items-start text-left z-10 text-white overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full flex flex-col justify-center"
              >
                {currentSlide.type === 'cover' && (
                  <div className="w-full h-full flex flex-col justify-center max-w-[65%] gap-4 p-8 md:p-16 select-none font-mono">
                    <h1 className="font-reglo text-3xl sm:text-4xl md:text-5xl lg:text-[4.5rem] font-black text-white leading-none tracking-tighter">
                      {currentSlide.title}
                    </h1>
                    <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-blue-400 tracking-[0.2em]">
                      {currentSlide.subtitle}
                    </h2>
                    <div className="w-16 h-1 bg-blue-500 rounded-full" />
                    <p className="text-[9px] sm:text-[10px] md:text-xs tracking-[0.3em] text-slate-300 uppercase mt-2 font-bold leading-normal">
                      {currentSlide.tagline}
                    </p>
                  </div>
                )}

                {currentSlide.type === 'welcome' && (
                  <div className="w-full h-full flex flex-col justify-center max-w-[65%] gap-6 p-8 md:p-16 select-none font-mono">
                    <h1 className="font-reglo text-2xl sm:text-3xl md:text-4xl lg:text-[2.8rem] font-black text-white leading-tight uppercase tracking-tight">
                      {currentSlide.title}
                    </h1>
                    <p className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed font-bold tracking-wide">
                      {currentSlide.text}
                    </p>
                  </div>
                )}

                {currentSlide.type === 'toc' && (
                  <div className="w-full h-full flex flex-col justify-center p-8 md:p-16 gap-6 select-none font-mono">
                    <h1 className="font-reglo text-2xl sm:text-3xl md:text-[2.6rem] font-black text-white uppercase tracking-tight mb-4">
                      {currentSlide.title}
                    </h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 max-w-[65%]">
                      <div className="flex flex-col gap-2">
                        {currentSlide.items!.slice(0, Math.ceil(currentSlide.items!.length / 2)).map((item, idx) => (
                          <span key={idx} className="text-[9px] sm:text-[10px] md:text-xs font-bold tracking-wide text-slate-300 hover:text-blue-400 transition-colors cursor-pointer" onClick={() => setActiveIndex(idx + 3)}>
                            {item}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-col gap-2">
                        {currentSlide.items!.slice(Math.ceil(currentSlide.items!.length / 2)).map((item, idx) => (
                          <span key={idx} className="text-[9px] sm:text-[10px] md:text-xs font-bold tracking-wide text-slate-300 hover:text-blue-400 transition-colors cursor-pointer" onClick={() => setActiveIndex(idx + Math.ceil(currentSlide.items!.length / 2) + 3)}>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {currentSlide.type === 'content' && (
                  <div className="w-full h-full flex flex-col justify-center p-8 md:p-16 gap-5 select-none font-mono">
                    <h1 className="font-reglo text-xl sm:text-2xl md:text-[2.4rem] font-black text-white leading-none tracking-tight uppercase mb-2">
                      {currentSlide.number}. {currentSlide.title}
                    </h1>
                    
                    <div className="flex flex-col gap-4 max-w-[65%] max-h-[70%] overflow-y-auto no-scrollbar pr-2">
                      {currentSlide.blocks!.map((block, idx) => {
                        if (block.type === 'quote') {
                          return (
                            <div key={idx} className="text-[10px] sm:text-xs md:text-sm italic text-slate-200 border-l-[3px] border-blue-500 pl-4 py-0.5 leading-relaxed">
                              {block.text}
                            </div>
                          );
                        }
                        if (block.type === 'text') {
                          return (
                            <p key={idx} className="text-[10px] sm:text-xs md:text-sm text-slate-400 leading-relaxed">
                              {block.text}
                            </p>
                          );
                        }
                        if (block.type === 'heading') {
                          return (
                            <h3 key={idx} className="text-[11px] sm:text-xs md:text-sm font-black text-blue-400 tracking-wider uppercase mt-1">
                              {block.text}
                            </h3>
                          );
                        }
                        if (block.type === 'subtitle') {
                          return (
                            <h2 key={idx} className="text-[11px] sm:text-xs md:text-sm font-bold text-slate-200 leading-relaxed uppercase">
                              {block.text}
                            </h2>
                          );
                        }
                        if (block.type === 'bullets') {
                          return (
                            <ul key={idx} className="list-square pl-4 flex flex-col gap-2">
                              {block.items!.map((item, bIdx) => (
                                <li key={bIdx} className="text-[10px] sm:text-xs font-bold tracking-wide text-slate-300 uppercase list-square">
                                  {item}
                                </li>
                              ))}
                            </ul>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Left Arrow Navigation overlay (visible on hover) */}
          {activeIndex > 0 && (
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-white/10 bg-black/40 text-slate-400 hover:text-white flex items-center justify-center hover:scale-105 transition-all opacity-0 group-hover/viewer:opacity-100 backdrop-blur-md"
              title="Previous Slide (Left Arrow)"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          {/* Right Arrow Navigation overlay (visible on hover) */}
          {activeIndex < SLIDES.length - 1 && (
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-white/10 bg-black/40 text-slate-400 hover:text-white flex items-center justify-center hover:scale-105 transition-all opacity-0 group-hover/viewer:opacity-100 backdrop-blur-md"
              title="Next Slide (Right Arrow)"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          )}

          {/* Bottom Dot Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeIndex === idx ? 'w-6 bg-blue-500' : 'w-1.5 bg-white/20 hover:bg-white/40'
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Info Tip */}
        <div className="text-center mt-6">
          <p className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">
            💡 TIP: USE LEFT AND RIGHT ARROW KEYS ON YOUR KEYBOARD TO FLIP PAGES COMFORTABLY.
          </p>
        </div>

      </div>
    </RegistrationLayout>
  );
}
