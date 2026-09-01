import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ size = 'md', showBadge = true, to = '/', className = '' }) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-4xl',
  };

  const subtextSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs',
    xl: 'text-sm',
  };

  const content = (
    <div className={`flex items-center gap-3 select-none group ${className}`}>
      {/* Dynamic Geometric Vector Icon */}
      <div className={`relative ${iconSizes[size]} shrink-0 transition-transform duration-300 group-hover:scale-105`}>
        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 rounded-xl blur-[6px] opacity-70 group-hover:opacity-100 transition-opacity" />
        
        {/* SVG Container */}
        <div className="relative w-full h-full bg-[#070b14] border border-white/20 rounded-xl flex items-center justify-center p-1.5 shadow-2xl overflow-hidden">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <defs>
              <linearGradient id="logoMarkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8"/>
                <stop offset="50%" stopColor="#818cf8"/>
                <stop offset="100%" stopColor="#c084fc"/>
              </linearGradient>
            </defs>
            <polygon points="50,8 88,30 88,70 50,92 12,70 12,30" stroke="url(#logoMarkGrad)" strokeWidth="6" fill="none"/>
            <polygon points="50,28 72,44 50,72 28,44" fill="url(#logoMarkGrad)"/>
            <circle cx="50" cy="44" r="5" fill="#ffffff" />
            <circle cx="50" cy="8" r="3" fill="#38bdf8" />
            <circle cx="88" cy="30" r="3" fill="#818cf8" />
            <circle cx="88" cy="70" r="3" fill="#c084fc" />
            <circle cx="12" cy="70" r="3" fill="#818cf8" />
            <circle cx="12" cy="30" r="3" fill="#38bdf8" />
          </svg>
        </div>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-black font-heading tracking-tight text-white ${textSizes[size]}`}>
            VIREONIQ <span className="gradient-text-indigo">HRCV</span>
          </span>
          {showBadge && (
            <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              AI 3.0
            </span>
          )}
        </div>
        <span className={`font-mono tracking-widest text-slate-400 uppercase leading-none mt-1 ${subtextSizes[size]}`}>
          Career Intelligence Platform
        </span>
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="focus:outline-none focus:ring-2 focus:ring-indigo-500/40 rounded-xl">
        {content}
      </Link>
    );
  }

  return content;
}
