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
      {/* 1. Início */}
      <button
        onClick={() => setActiveTab('dashboard')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
          activeTab === 'dashboard' ? 'text-violet-400 font-semibold' : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] tracking-tight mt-1">Início</span>
      </button>

      {/* 2. Tarefas */}
      <button
        onClick={() => setActiveTab('tasks')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-all relative ${
          activeTab === 'tasks' ? 'text-violet-400 font-semibold' : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        <div className="relative">
          <CheckCircle2 className="w-5 h-5" />
          {tasksPendingCount > 0 && (
            <span className="absolute -top-1 -right-2 min-w-[14px] h-3.5 px-1 bg-amber-500 text-black text-[9px] font-bold rounded-full flex items-center justify-center">
              {tasksPendingCount > 99 ? '99+' : tasksPendingCount}
            </span>
          )}
        </div>
        <span className="text-[10px] tracking-tight mt-1">Tarefas</span>
      </button>

      {/* 3. Center Siri AI Orb Button */}
      <div className="flex-1 flex items-center justify-center -mt-5">
        <button
          onClick={() => {
            if (onAskJarvis) {
              onAskJarvis('Olá JARVIS! Como posso otimizar meu dia?');
            } else {
              setActiveTab('dashboard');
            }
          }}
          className="w-12 h-12 rounded-full p-0.5 relative shadow-lg shadow-violet-500/40 hover:scale-105 active:scale-95 transition-transform"
          title="Falar com a IA"
        >
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-violet-600 via-cyan-400 to-pink-500 p-[1.5px] animate-spin" style={{ animationDuration: '8s' }}>
            <div className="w-full h-full rounded-full bg-[#0a0b12] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
          </div>
        </button>
      </div>

      {/* 4. Agenda */}
      <button
        onClick={() => setActiveTab('calendar')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
          activeTab === 'calendar' ? 'text-violet-400 font-semibold' : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        <Calendar className="w-5 h-5" />
        <span className="text-[10px] tracking-tight mt-1">Agenda</span>
      </button>

      {/* 5. Mais / Drawer */}
      <button
        onClick={onOpenMobileMenu}
        className="flex flex-col items-center justify-center flex-1 py-1 transition-all text-zinc-500 hover:text-zinc-300"
      >
        <LayoutGrid className="w-5 h-5" />
        <span className="text-[10px] tracking-tight mt-1">Mais</span>
      </button>
    </nav>
  );
}
