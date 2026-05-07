'use client';

import React from 'react';

const TIMELINE_EVENTS = [
  { date: '24 May 2025', title: 'AWS Workshop 2', desc: 'Level up your cloud skills! Following our successful first session, a session providing detailed exploration into key services of AWS, including expert talks, insightful discussions on practical applications relevant to Sri Lanka.' },
  { date: '25 May 2025', title: 'Registration for Ideathon', desc: 'Get ready to unleash your innovative ideas and compete for exciting opportunities. Stay tuned for the launch of registration.' },
  { date: '7 June 2025', title: 'CoDeKu Workshop 2', desc: 'A perfect start up for beginners and curious minds to expand their knowledge in coding.' },
  { date: 'June 2025', title: 'AWS Workshop 3', desc: 'An in-depth discussion on advanced cloud topics and practical applications.' },
  { date: '8 June 2025', title: 'CoDeKu Workshop 3', desc: 'Join our upcoming workshop to deepen your programming skills and explore new technologies.' },
  { date: '28 May 2025', title: 'Prototype Phase Registration', desc: 'The Ideathon will advance to the Prototype Phase as registration opens.' },
  { date: '25 June 2025', title: 'Prototype Submissions Open', desc: 'Participating teams can begin to submit their completed prototypes for evaluation.' },
  { date: '4 July 2025', title: 'Prototype Registration Closes', desc: 'Marking the final opportunity for new teams to enter this stage.' },
  { date: '5 July 2025', title: 'Judging Criteria Release', desc: 'Providing all teams with clear guidelines on the metrics for success.' },
  { date: '23 July 2025', title: 'Prototype Submissions Close', desc: 'All prototypes will then enter the evaluation stage.' },
  { date: '30 July 2025', title: 'Finalists Announced', desc: 'The teams selected to advance to the Grand Finale will be announced.' },
  { date: 'Aug 2025', title: 'Builderthon & Pitch-a-thon', desc: 'Finalist teams will build and present their final products to claim the championship title.' },
];

const PRIZES = [
  { place: '2nd', amount: 'Rs. 20,000', color: '#C0C0C0', rank: '2' },
  { place: '1st', amount: 'Rs. 30,000', color: '#FFD700', rank: '1', highlight: true },
  { place: '3rd', amount: 'Rs. 10,000', color: '#CD7F32', rank: '3' },
];

export function PortalSection1() {
  return (
    <div className="w-full h-screen overflow-y-auto bg-[#050812] custom-scrollbar">
      <div className="max-w-6xl mx-auto px-6 py-20 space-y-32">
        
        {/* Timeline Section */}
        <section>
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl md:text-6xl font-bold text-white mb-4">
              Event <span className="text-blue-400">Timeline</span>
            </h2>
            <div className="h-1 w-16 md:w-20 bg-blue-500 mx-auto rounded-full" />
          </div>

          <div className="relative border-l-2 border-blue-500/20 ml-2 md:ml-0 md:grid md:grid-cols-2 md:border-l-0">
            {/* Center line for desktop */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-blue-500/20 to-transparent -translate-x-1/2" />
            
            {TIMELINE_EVENTS.map((event, idx) => (
              <div 
                key={idx} 
                className={`relative mb-8 md:mb-20 ${idx % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:col-start-2'}`}
              >
                {/* Dot */}
                <div className="absolute -left-[9px] md:left-1/2 top-1.5 w-3.5 h-3.5 rounded-full bg-blue-500 border-4 border-[#050812] md:-translate-x-1/2 z-10 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                
                <div className="pl-6 md:pl-0">
                  <span className="text-[10px] md:text-sm font-mono text-blue-400/80 uppercase tracking-widest mb-1 block">
                    {event.date}
                  </span>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2 tracking-tight group-hover:text-blue-300 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-md mx-auto md:mx-0">
                    {event.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Prize Pool Section */}
        <section className="pb-20">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Prize <span className="text-blue-400">Pool</span>
            </h2>
            <div className="h-1 w-20 bg-blue-500 mx-auto rounded-full" />
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-10">
            {PRIZES.map((prize, idx) => (
              <div 
                key={idx}
                className={`relative group transition-all duration-500 hover:-translate-y-2 w-full max-w-sm ${prize.highlight ? 'order-first md:order-none scale-105' : ''}`}
              >
                <div className={`absolute inset-0 rounded-3xl blur-xl opacity-20 transition-opacity group-hover:opacity-40`} style={{ backgroundColor: prize.color }} />
                
                <div className={`relative rounded-3xl border-2 p-8 text-center bg-black/40 backdrop-blur-xl h-full flex flex-col justify-center`} style={{ borderColor: `${prize.color}40` }}>
                  <div 
                    className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 shadow-inner" 
                    style={{ backgroundColor: prize.color }}
                  >
                    <span className="text-black font-black text-2xl">{prize.rank}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-tighter">
                    {prize.place} Place
                  </h3>
                  
                  <div className="text-3xl font-black mb-4 tracking-tighter" style={{ color: prize.color }}>
                    {prize.amount}
                  </div>
                  
                  <div className="space-y-1 text-slate-400 text-sm font-medium uppercase tracking-widest">
                    <p>+</p>
                    <p>Digital Certificates</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
