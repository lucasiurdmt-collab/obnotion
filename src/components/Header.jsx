import React from 'react';
import { Search, Plus, Sparkles, Timer, Calendar, CheckSquare, FileText, DollarSign, BookOpen } from 'lucide-react';

export default function Header({
  activeTab,
  onOpenSearch,
  onOpenPomodoro,
  onQuickAction,
  darkMode
}) {
  const titles = {
    dashboard: 'Painel Geral',
    notes: 'Notas & Grafo de Conhecimento',
    finance: 'Controle Financeiro',
    books: 'Biblioteca & Leituras',
    tasks: 'Quadro de Tarefas & Kanban',
    calendar: 'Calendário & Rotina Semanal',
    habits: 'Rastreador de Hábitos',
    journal: 'Diário Pessoal & Reflexão',
    settings: 'Configurações & Backup'
  };

  const getFormattedDate = () => {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const dateStr = new Date().toLocaleDateString('pt-BR', options);
    return dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
  };

  return (
    <header
      className={`h-16 px-6 border-b flex items-center justify-between transition-colors ${
        darkMode
          ? 'bg-[#14151b] border-gray-800 text-gray-100'
          : 'bg-white border-gray-200 text-gray-800'
      } sticky top-0 z-10`}
    >
      {/* Title / Breadcrumb */}
      <div className="flex items-center space-x-3">
        <h2 className="text-lg font-bold tracking-tight text-inherit">
          {titles[activeTab] || 'Obnotion'}
        </h2>
        <span className="hidden md:inline-block text-xs px-2.5 py-1 rounded-full bg-gray-500/10 text-gray-400 border border-gray-500/20">
          {getFormattedDate()}
        </span>
      </div>

      {/* Action Buttons & Search */}
      <div className="flex items-center space-x-3">
        {/* Global Search Button */}
        <button
          onClick={onOpenSearch}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
            darkMode
              ? 'bg-gray-900/60 border-gray-700 text-gray-300 hover:border-gray-500'
              : 'bg-gray-100 border-gray-200 text-gray-600 hover:border-gray-300'
          }`}
        >
          <Search className="w-3.5 h-3.5 text-gray-400" />
          <span className="hidden sm:inline">Buscar no Obnotion...</span>
          <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700">
            Ctrl+K
          </kbd>
        </button>

        {/* Quick Pomodoro Trigger */}
        <button
          onClick={onOpenPomodoro}
          className="p-2 rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-all"
          title="Abrir Pomodoro Timer"
        >
          <Timer className="w-4 h-4" />
        </button>

        {/* Quick Add Button */}
        <div className="relative group">
          <button
            onClick={() => onQuickAction('new-note')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md shadow-purple-600/30 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Criar</span>
          </button>
        </div>
      </div>
    </header>
  );
}