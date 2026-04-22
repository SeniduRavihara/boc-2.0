'use client';

import { useScroll, useSpring, useVelocity } from 'framer-motion';
import { ChevronRight, Cloud, Cpu, Crown, Database, Medal, Network, Shield, Trophy, Zap } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

const SESSIONS = [
  {
    id: "01",
    title: "AWS_IGNITE",
    desc: "Architecting serverless ecosystems and lambda-driven rhythm.",
    icon: <Zap className="w-8 h-8 text-aws" />,
    tag: "CLOUD_CORE",
    color: "from-aws/20 to-transparent"
  },
  {
    id: "02",
    title: "GCP_FLOW",
    desc: "Mastering BigQuery and visual data intelligence.",
    icon: <Cloud className="w-8 h-8 text-gcp" />,
    tag: "DATA_OPS",
    color: "from-gcp/20 to-transparent"
  },
  {
    id: "03",
    title: "NEURAL_SYNC",
    desc: "Integrating generative AI and latent space protocols.",
    icon: <Cpu className="w-8 h-8 text-accent" />,
    tag: "AI_ML",
    color: "from-accent/20 to-transparent"
  },
  {
    id: "04",
    title: "HYPER_SCALE",
    desc: "Scaling digital architecture for the global multiverse.",
    icon: <Network className="w-8 h-8 text-white/60" />,
    tag: "INFRA_STRUCTURE",
    color: "from-gcp/20 to-transparent"
  },
  {
    id: "05",
    title: "CYBER_SHIELD",
    desc: "Security audit systems and zero-trust cloud nodes.",
    icon: <Shield className="w-8 h-8 text-gcp" />,
    tag: "SECURITY",
    color: "from-gcp/20 to-transparent"
  },
  {
    id: "06",
    title: "ORCHESTRATE",
    desc: "Final session: Linking human logic with cloud randomness.",
    icon: <Database className="w-8 h-8 text-aws" />,
    tag: "OPERATIONS",
    color: "from-aws/20 to-transparent"
  },
  {
    id: "FINALE",
    title: "PRIZE_POOL",
    type: "prizes",
    desc: "The ultimate reward for architectural excellence.",
    tag: "GRAND_REWARD",
    color: "from-accent/20 to-transparent"
  }
];

const CONFIG = {
  zGap: 800,
  starCount: 200,
  worldYOffset: 50, // Added slight offset by default
  worldXOffset: 0,
  finaleCushion: -200,
  warpFactor: 0.1,
  lerpAmount: 0.1
};

export const HyperTimeline: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const scrollVelocity = useVelocity(scrollYProgress);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Sync 3D transforms manually for maximum performance (Tunnel effect)
  useEffect(() => {
    let animationFrameId: number;

    const update = () => {
      if (!worldRef.current || !viewportRef.current) return;

      const progress = scrollYProgress.get();
      const velocity = smoothVelocity.get();
      const w = window.innerWidth;
      const h = window.innerHeight;
      
      // Calculate Camera Z with a centralized cushion to prevent excessive zoom
      const terminalZ = (SESSIONS.length - 1) * CONFIG.zGap - CONFIG.finaleCushion;
      const cameraZ = progress * terminalZ;
      
      // 1. World Tilt & Offset (Dynamic translateY to clear header based on screen aspect ratio)
      // On small height screens, we push the world down further.
      const dynamicYOffset = h < 700 ? 180 : (h < 900 ? 100 : CONFIG.worldYOffset);
      const tiltX = (mousePos.y * 5 - velocity * 4);
      const tiltY = mousePos.x * 5;
      worldRef.current.style.transform = `translate(${CONFIG.worldXOffset}px, ${dynamicYOffset}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

      // 2. Wrap FOV / Perspective based on width
      // Mobile needs wider FOV (lower perspective value) to see the tunnel depth properly
      const baseFov = w < 768 ? 800 : 1200;
      const warp = Math.min(Math.abs(velocity) * 500, 600);
      viewportRef.current.style.perspective = `${baseFov - warp}px`;

      // 3. Update Scale on Items implicitly by their Z position
      
      animationFrameId = requestAnimationFrame(update);
    };

    update();
    return () => cancelAnimationFrame(animationFrameId);
  }, [mousePos, scrollYProgress, smoothVelocity]);

  return (
    <div ref={containerRef} className="h-[600vh] relative">
      <div 
        ref={viewportRef}
        className="sticky top-0 h-screen w-full overflow-hidden bg-background"
        style={{ perspective: '1000px' }}
      >
        <div className="absolute inset-0 pointer-events-none z-10 scanlines opacity-20" />
        <div className="absolute inset-0 pointer-events-none z-10 vignette" />
        
        <div 
          ref={worldRef}
          className="absolute inset-0 transition-transform duration-300 ease-out"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* StarField */}
          <StarField velocity={smoothVelocity} />

          {/* Large BG Text */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none text-[25vw] font-black opacity-[0.05] text-white italic -z-10 translate-z-[-2000px] tracking-tighter">
             ROADMAP
          </div>

          {/* Session Cards */}
          {SESSIONS.map((session, index) => (
            <SessionCard3D 
              key={session.id} 
              session={session} 
              index={index} 
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>

        {/* HUD Elements */}
        <div className="fixed inset-10 z-50 pointer-events-none flex flex-col justify-between font-mono text-[10px] tracking-widest opacity-40">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-2">
              <span className="text-accent font-black">SYSTEM_HUD {"//"} ACTIVE</span>
              <span>COORD_X: {mousePos.x.toFixed(3)}</span>
              <span>COORD_Y: {mousePos.y.toFixed(3)}</span>
            </div>
            <div className="text-right">
              <span>beauty of cloud {"//"} 2.0</span>
            </div>
          </div>
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-4">
               <div className="w-12 h-[1px] bg-white/20" />
               <span>PROGRESS: {(scrollYProgress.get() * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SessionCard3D: React.FC<{ 
  session: typeof SESSIONS[0]; 
  index: number; 
  scrollYProgress: any 
}> = ({ session, index, scrollYProgress }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Calculate specific positions for spiral tunnel
  // On mobile (< 768px), we compress the radius to almost 0 to keep cards centered
  const getRadius = () => {
    if (typeof window === 'undefined') return 220;
    const w = window.innerWidth;
    if (w < 768) return 0; // Perfectly centered mobile stack
    if (w < 1280) return 150; // Medium tablet spiral
    return 280; // Large desktop spiral
  };

  const angle = (index / SESSIONS.length) * Math.PI * 4; // 2 rotations
  const baseRadius = getRadius();
  const x = Math.cos(angle) * baseRadius;
  const y = Math.sin(angle) * baseRadius;
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const rot = isMobile ? 0 : (index % 2 === 0 ? 1 : -1) * 15;

  useEffect(() => {
    let animationFrameId: number;
    const update = () => {
      if (!cardRef.current) return;
      
      const progress = scrollYProgress.get();
      // Sync terminalZ with global CONFIG to ensure consistent pinning
      const terminalZ = (SESSIONS.length - 1) * CONFIG.zGap - CONFIG.finaleCushion;
      const cameraZ = progress * terminalZ;
      const baseZ = -index * CONFIG.zGap;
      
      const vizZ = baseZ + cameraZ;
      const isFinale = session.id === 'FINALE';
      
      // Visibility threshold - Finale is a "Master Card" visible from the start
      let opacity = 1;
      if (isFinale) {
        // Master card is visible from the start and stays solid once reached
        if (vizZ < -7000) opacity = 0;
        else if (vizZ < -5000) opacity = (vizZ + 7000) / 2000;
        else opacity = 1; // Stay pinned at 1
      } else {
        if (vizZ < -4000) opacity = 0;
        else if (vizZ < -3000) opacity = (vizZ + 4000) / 1000;
        else if (vizZ > 500) opacity = 1 - (vizZ - 500) / 500;
        if (opacity < 0) opacity = 0;
      }
      
      const targetX = isFinale ? 0 : x;
      const targetY = isFinale ? 0 : y;
      const targetRot = isFinale ? 0 : rot;

      cardRef.current.style.opacity = opacity.toString();
      cardRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, ${vizZ}px) rotateZ(${targetRot}deg) translate(-50%, -50%)`;
      
      // Dynamic glow based on session color and proximity
      // Finale has a more intense "Master Card" glow
      if (isFinale) {
        const glowIntensity = Math.max(0, 1 - Math.abs(vizZ) / 5000);
        cardRef.current.style.boxShadow = `0 0 ${100 * glowIntensity}px rgba(255, 62, 0, ${0.4 * glowIntensity})`;
      } else if (vizZ > -2000 && vizZ < 500) {
        const glowIntensity = Math.max(0, 1 - Math.abs(vizZ) / 2000);
        cardRef.current.style.boxShadow = `0 0 ${40 * glowIntensity}px rgba(255, 255, 255, ${0.1 * glowIntensity})`;
      } else {
        cardRef.current.style.boxShadow = 'none';
      }
      
      animationFrameId = requestAnimationFrame(update);
    };
    
    update();
    return () => cancelAnimationFrame(animationFrameId);
  }, [scrollYProgress, index, x, y, rot]);

  return (
    <div 
      ref={cardRef} 
      className={`absolute left-1/2 top-1/2 ${session.id === 'FINALE' ? 'w-[95vw] md:w-[900px]' : 'w-[85vw] md:w-80'} h-[450px] md:h-[400px]`}
      style={{ backfaceVisibility: 'hidden' }}
    >
      <div className={`w-full h-full p-8 md:p-12 flex flex-col justify-between overflow-hidden rounded-3xl border border-white/20 bg-[#1A1A1C] relative ring-1 ring-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.9)]`}>
        {/* Session Color Accent Overlay - Solidified */}
        <div className={`absolute inset-0 bg-gradient-to-br ${session.color} opacity-20 pointer-events-none`} />

        <div className="flex justify-between items-start z-10">
          <span className="text-accent font-mono text-xs font-black">[{session.tag}]</span>
          <span className="text-white/20 font-mono text-[10px]">{session.id === 'FINALE' ? 'GRAND_FINALE' : `${session.id} / 06`}</span>
        </div>

        {session.id === 'FINALE' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center flex-1 z-10 overflow-y-auto md:overflow-visible">
            {/* Left Side: Master Branding */}
            <div className="flex flex-col gap-4 md:gap-6">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-accent/20 flex items-center justify-center border border-accent/30 filter drop-shadow-[0_0_20px_rgba(255,62,0,0.3)]">
                <Crown className="w-8 h-8 md:w-10 md:h-10 text-accent" />
              </div>
              <h3 className="text-3xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">
                Elevate <br/>
                <span className="text-accent">Innovation.</span>
              </h3>
              <p className="text-[10px] md:text-sm text-white/40 font-mono uppercase tracking-widest leading-relaxed max-w-xs">
                The ultimate visual culmination of digital architectural excellence.
              </p>
            </div>

            {/* Right Side: Prize Board */}
            <div className="flex flex-col gap-4">
              {[
                { rank: "01ST", amount: "50,000 LKR", icon: <Crown className="w-6 h-6 text-aws" />, glow: "border-aws/30 bg-aws/5" },
                { rank: "02ND", amount: "30,000 LKR", icon: <Trophy className="w-6 h-6 text-white/60" />, glow: "border-white/10 bg-white/5" },
                { rank: "03RD", amount: "20,000 LKR", icon: <Medal className="w-6 h-6 text-accent" />, glow: "border-accent/20 bg-accent/5" }
              ].map((p) => (
                <div key={p.rank} className={`flex items-center justify-between p-5 rounded-2xl border transition-all hover:scale-[1.02] ${p.glow}`}>
                  <div className="flex items-center gap-5">
                    <div className="shrink-0">{p.icon}</div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-mono opacity-40 leading-none mb-1">{p.rank} {"//"} PLACE</span>
                      <span className="text-2xl font-black tracking-tighter leading-none">{p.amount}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 opacity-20" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
              {session.icon}
            </div>
            <h3 className="text-4xl font-bold tracking-tighter uppercase italic">{session.title}</h3>
            <p className="text-sm text-white/40 leading-relaxed font-mono uppercase tracking-tight">
              {session.desc}
            </p>
          </div>
        )}

        <div className="pt-8 border-t border-white/5 flex justify-between items-center text-[10px] font-mono tracking-widest text-accent">
          <span>INITIALIZE_SESS</span>
          <ChevronRight className="w-4 h-4" />
        </div>

        {/* Decal */}
        <div className="absolute -bottom-10 -right-10 text-9xl font-black text-white/[0.02] italic select-none pointer-events-none">
          {session.id}
        </div>
      </div>
    </div>
  );
};

const StarField: React.FC<{ velocity: any }> = ({ velocity }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stars = useRef<{ x: number; y: number; z: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Init stars
    stars.current = Array.from({ length: CONFIG.starCount }, () => ({
      x: (Math.random() - 0.5) * canvas.width * 2,
      y: (Math.random() - 0.5) * canvas.height * 2,
      z: Math.random() * 5000
    }));

    let animationFrameId: number;
    const draw = () => {
      // Accumulation Blur: Instead of clearRect, we draw a translucent rectangle
      // to fade previous frames, creating natural 3D motion trails.
      ctx.fillStyle = "rgba(10, 10, 10, 0.25)"; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2 + CONFIG.worldXOffset;
      const cy = canvas.height / 2 + (window.innerHeight < 700 ? 180 : (window.innerHeight < 900 ? 100 : CONFIG.worldYOffset)); // Sync with dynamic world offset

      ctx.fillStyle = "white";
      
      stars.current.forEach(star => {
        const fov = 1000;
        const scale = fov / (fov + star.z);
        const x = cx + star.x * scale;
        const y = cy + star.y * scale;
        
        // No manual stretching here! The accumulation fills previous frames 
        // behind the moving particle, creating a perfect perspective trail.
        const size = Math.max(0.5, 2 * scale);
        
        // Fade stars as they leave the Z-depth or get too close
        let alpha = Math.min(1, scale * 2);
        if (star.z < 100) alpha *= (star.z / 100);
        ctx.globalAlpha = alpha;
        
        ctx.beginPath();
        ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [velocity]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-50" />;
};
