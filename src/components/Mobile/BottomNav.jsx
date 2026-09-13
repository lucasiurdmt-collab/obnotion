import React from 'react';
import {
  Home,
  CheckCircle2,
  Calendar,
  LayoutGrid,
  Sparkles
} from 'lucide-react';

export default function BottomNav({
  activeTab,
  setActiveTab,
  onOpenMobileMenu,
  onAskJarvis,
  darkMode,
  notesCount,
  tasksPendingCount
}) {
  return (
    <nav
      className={`md:hidden fixed bottom-0 left-0 right-0 z-40 border-t flex items-center justify-around px-3 py-2 transition-colors ${
        darkMode
          ? 'bg-[#090a10]/95 border-white/[0.08] text-zinc-400 backdrop-blur-2xl'
          : 'bg-white/95 border-zinc-200 text-zinc-600 backdrop-blur-2xl'
      } pb-safe`}
    >
      {/* 1. Produtividade */}
      <button
        onClick={() => setActiveTab('productivity')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
          activeTab === 'productivity' ? 'text-violet-400 font-semibold' : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        <Sparkles className="w-5 h-5" />
        <span className="text-[10px] tracking-tight mt-1">Produtividade</span>
      </button>
    </nav>
  );
}
