import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  variant?: 'base' | 'dark';
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className, 
  hover = false,
  variant = 'base'
}) => {
  return (
    <div className={cn(
      variant === 'base' ? "glass" : "glass-dark",
      "rounded-2xl overflow-hidden transition-all duration-500",
      hover && "hover:border-white/20 hover:bg-white/[0.05] hover:shadow-[0_0_50px_rgba(255,255,255,0.05)]",
      className
    )}>
      {children}
    </div>
  );
};
