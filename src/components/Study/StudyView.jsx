import React, { useState } from 'react';
import { BookOpen, ExternalLink, RefreshCw, Languages, Sparkles } from 'lucide-react';

export default function StudyView({ darkMode }) {
  const [key, setKey] = useState(Date.now());
  const studyUrl = `${import.meta.env.BASE_URL}tools/estudo/index.html`;

  const handleRefresh = () => {
    setKey(Date.now());
  };

  const handleOpenNewTab = () => {
    window.open(studyUrl, '_blank');
  };

  return (
    <div className="flex-1 flex flex-col h-full w-full bg-[#000000] overflow-hidden select-auto animate-fade-in">
      {/* Barra Superior Rápida do Módulo de Estudo */}
      <div className={`p-2.5 px-4 flex items-center justify-between border-b ${
        darkMode ? 'bg-[#0a0b10] border-white/[0.08]' : 'bg-white border-zinc-200'
      } z-10 flex-shrink-0`}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
            <Languages className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-xs md:text-sm text-white tracking-tight">
                Estudo de Idiomas & Bíblia
              </h2>
              <span className="hidden sm:inline-flex text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                🇷🇺 Russo • 🇺🇸 Inglês
              </span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                🧠 Anki SM-2
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="p-1.5 px-2.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors flex items-center gap-1.5 text-xs font-medium border border-white/[0.06]"
            title="Recarregar estudo"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Recarregar</span>
          </button>

          <button
            onClick={handleOpenNewTab}
            className="p-1.5 px-2.5 rounded-lg text-zinc-300 hover:text-white hover:bg-indigo-600/20 transition-colors flex items-center gap-1.5 text-xs font-medium border border-indigo-500/30 text-indigo-300"
            title="Abrir em tela cheia em uma nova guia"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Nova Guia</span>
          </button>
        </div>
      </div>

      {/* Frame Principal do Aplicativo Scriptura */}
      <iframe
        key={key}
        src={studyUrl}
        className="flex-1 w-full h-full border-none bg-[#000000]"
        title="Estudo de Idiomas - Scriptura"
        allow="autoplay; microphone; clipboard-read; clipboard-write; fullscreen"
      />
    </div>
  );
}
