import React from 'react';

export default function ObnotionLogo({ size = 36, className = '', glow = true }) {
  return (
    <div 
      className={`relative flex items-center justify-center flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {glow && (
        <div 
          className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 opacity-60 blur-md -z-10 animate-pulse"
          style={{ transform: 'scale(1.05)' }}
        />
      )}
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          <linearGradient id="obnotion-grad-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id="obnotion-grad-core" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
          <radialGradient id="obnotion-glow-inner" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#8b5cf6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Squircle Glass Frame */}
        <rect 
          x="4" y="4" width="92" height="92" rx="26" 
          fill="#13141c" 
          stroke="url(#obnotion-grad-bg)" 
          strokeWidth="4" 
        />

        {/* Inner Subtle Glow */}
        <circle cx="50" cy="50" r="32" fill="url(#obnotion-glow-inner)" />

        {/* Synaptic Hexagonal / Obsidian Nexus (O Shape) */}
        {/* Connection Arcs */}
        <path 
          d="M50 22 L76 37 L76 67 L50 82 L24 67 L24 37 Z" 
          stroke="url(#obnotion-grad-bg)" 
          strokeWidth="4.5" 
          strokeLinejoin="round" 
          fill="none" 
          opacity="0.9"
        />

        {/* Inner Graph Links */}
        <path d="M50 22 L50 50" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
        <path d="M24 67 L50 50" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" />
        <path d="M76 67 L50 50" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" />

        {/* Graph Nodes (Knowledge Neurons) */}
        <circle cx="50" cy="22" r="5.5" fill="#38bdf8" />
        <circle cx="76" cy="37" r="4.5" fill="#818cf8" />
        <circle cx="76" cy="67" r="5.5" fill="#06b6d4" />
        <circle cx="50" cy="82" r="5" fill="#a855f7" />
        <circle cx="24" cy="67" r="5.5" fill="#c084fc" />
        <circle cx="24" cy="37" r="4.5" fill="#818cf8" />

        {/* Central Core Spark (Second Brain Nucleus) */}
        <circle cx="50" cy="50" r="7" fill="url(#obnotion-grad-core)" />
        <circle cx="50" cy="50" r="3" fill="#ffffff" />
      </svg>
    </div>
  );
}
