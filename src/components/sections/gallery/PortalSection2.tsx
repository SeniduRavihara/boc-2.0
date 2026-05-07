'use client';

import React from 'react';
import Image from 'next/image';

const EXECUTIVES = [
  { name: 'Rusira Sandul', role: 'Event Co-Chair', img: '/rusira sandul-event co chair.png' },
  { name: 'Manuja Wimalarathne', role: 'Event Co-Chair', img: '/manuja wimalarathne-event co chair.webp' },
];

const DEPARTMENTS = [
  {
    title: 'Programming & Web',
    lead: { name: 'Sarasi Perera', img: '/Sarasi Perera-programming.png' },
    members: [
      { name: 'Dinil Hansara', img: '/Dinil Hansara-programming.png' },
      { name: 'Arshath Moulana', img: '/Arshath Moulana-programming.png' },
      { name: 'Ahinsa Wickramarathna', img: '/Ruchini Ahinsa-programming.jpg' },
      { name: 'Ganindu Deshapriya', img: '/Ganindu Deshapriya-programming.jpg' },
    ]
  },
  {
    title: 'Design & Marketing',
    lead: { name: 'Shenal Gunasekara', img: '/Shenal Gunasekara-design.png' },
    members: [
      { name: 'Amandi Thathsarani', img: '/Amandi Thathsarani-design.png' },
      { name: 'Dinil Hansara', img: '/Dinil Hansara-design.png' },
      { name: 'Sara Zarook', img: '/Sara Zarook-design.png' },
      { name: 'Udani Wickramanayaka', img: '/Udani Wickramanayaka-design.png' },
    ]
  },
  {
    title: 'Logistics & Coordination',
    leads: [
      { name: 'Shveen Udayanga', img: '/Shveen Udayanga-logistics.jpg' },
      { name: 'Chethana Perera', img: '/Chethana Perera-logistics.jpg' }
    ],
    members: [
      { name: 'Dewni Anuradi', img: '/Dewni Andradi - FOC-logistics.png' },
      { name: 'Ishani Ranthanayake', img: '/Ishani Ranthnayake-logistics.jpeg' },
      { name: 'Hansaka Hirushan', img: '/Hansaka Hirushan-logistics.png' },
    ]
  },
  {
    title: 'Industry Relations',
    lead: { name: 'Dedunu Thakshila', img: '/Dedunu Thakshila-ir.png' },
    members: [
      { name: 'Chamathka Dilshani', img: '/Chamathka Dilshani-ir.png' },
      { name: 'Imalsha Sathsarani', img: '/Imalsha Sathsarani-ir.png' },
      { name: 'Kavishka Rashani', img: '/Kavishka Rashani-ir.png' },
    ]
  }
];

export function PortalSection2() {
  return (
    <div className="w-full h-screen overflow-y-auto bg-[#050812] custom-scrollbar">
      <div className="max-w-7xl mx-auto px-6 py-20">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Our <span className="text-blue-400">Team</span>
          </h2>
          <div className="h-1 w-20 bg-blue-500 mx-auto rounded-full" />
        </div>

        {/* Executives */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-10 mb-32">
          {EXECUTIVES.map((exec, idx) => (
            <div key={idx} className="group relative w-full max-w-[280px]">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-xl text-center">
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl" />
                  <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-blue-500/30">
                    <Image src={exec.img} alt={exec.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{exec.name}</h3>
                <p className="text-blue-400 font-mono text-xs uppercase tracking-[0.2em]">{exec.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {DEPARTMENTS.map((dept, idx) => (
            <div key={idx} className="bg-black/20 border border-white/5 rounded-2xl p-6 backdrop-blur-sm flex flex-col h-full">
              <h3 className="text-white font-bold text-sm mb-8 text-center uppercase tracking-wider h-10 flex items-center justify-center">
                {dept.title}
              </h3>
              
              <div className="flex flex-col items-center gap-6 flex-1">
                {/* Lead(s) */}
                <div className="flex justify-center gap-3">
                  {dept.leads ? dept.leads.map((lead, lIdx) => (
                    <TeamAvatar key={lIdx} person={lead} size="lg" ring />
                  )) : (
                    <TeamAvatar person={dept.lead!} size="lg" ring />
                  )}
                </div>

                {/* Separator */}
                <div className="w-8 h-px bg-white/10" />

                {/* Members */}
                <div className="flex flex-wrap justify-center -space-x-3">
                  {dept.members.map((member, mIdx) => (
                    <TeamAvatar key={mIdx} person={member} size="md" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

function TeamAvatar({ person, size = 'md', ring = false }: { person: { name: string, img: string }, size?: 'md' | 'lg', ring?: boolean }) {
  const sizeClasses = size === 'lg' ? 'w-20 h-20' : 'w-12 h-12';
  return (
    <div className="group relative">
      <div className={`
        relative ${sizeClasses} rounded-full overflow-hidden border-2 
        ${ring ? 'border-blue-500/50 scale-110' : 'border-white/10'} 
        transition-all duration-300 group-hover:border-blue-400 group-hover:z-10 group-hover:scale-125
      `}>
        <Image src={person.img} alt={person.name} fill className="object-cover" />
      </div>
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-blue-600 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
        {person.name}
      </div>
    </div>
  );
}
