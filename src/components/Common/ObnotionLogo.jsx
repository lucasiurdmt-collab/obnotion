import React from 'react';
import sinaiIcon from '../../assets/sinaihub_icon.png';

export default function ObnotionLogo({ size = 36, className = '', glow = true }) {
  return (
    <div 
      className={`relative flex items-center justify-center flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {glow && (
        <div 
          className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-500 to-yellow-400 opacity-60 blur-md -z-10 animate-pulse"
          style={{ transform: 'scale(1.08)' }}
        />
      )}
      <div className="w-full h-full rounded-xl overflow-hidden border border-amber-500/30 bg-[#0d0f17] shadow-lg flex items-center justify-center p-0.5">
        <img 
          src={sinaiIcon} 
          alt="SinaiHUB" 
          className="w-full h-full object-cover rounded-lg" 
        />
      </div>
    </div>
  );
}
