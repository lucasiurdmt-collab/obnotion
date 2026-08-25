import React from 'react';
import { Search, Plus, Timer, Cloud, User, Menu } from 'lucide-react';

export default function Header({
  activeTab,
  onOpenSearch,
  onOpenPomodoro,
  onOpenAuth,
  onToggleMobileMenu,
  user,
  isLoggedIn,
  isSyncing,
  onQuickAction,
  darkMode
}) {
  const titles = {
    dashboard: 'Centro de Comando',
    notes: 'Base de Conhecimento',
    finance: 'Finanças & Fluxo',
    books: 'Biblioteca & Leituras',
    tasks: 'Tarefas & Execução',
    calendar: 'Calendário & Rotina',
    habits: 'Hábitos & Consistência',
    journal: 'Diário & Reflexão',
    productivity: 'Produtividade & Estúdio',
    settings: 'Configurações do Sistema'
  };

  const getFormattedDate = () => {
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    const dateStr = new Date().toLocaleDateString('pt-BR', options);
    return dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
  };

  return (
    <header
      className={`h-14 px-4 md:px-6 border-b flex items-center justify-between transition-colors ${
        darkMode
          ? 'bg-[#0c0d14]/80 backdrop-blur-md border-white/[0.07] text-zinc-100'
          : 'bg-white/80 backdrop-blur-md border-zinc-200 text-zinc-800'
      } sticky top-0 z-10`}
    >
      {/* Title / Mobile Trigger / Date */}
      <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
        <button
          onClick={onToggleMobileMenu}
          className="p-1.5 -ml-1 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.06] md:hidden flex-shrink-0"
          title="Abrir Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h2 className="text-sm sm:text-base font-semibold tracking-tight text-inherit truncate">
          {titles[activeTab] || 'Obnotion'}
        </h2>
        <span className="hidden lg:inline-block text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] text-zinc-400 border border-white/[0.06]">
          {getFormattedDate()}
        </span>
      </div>

      {/* Action Buttons & Search */}
      <div className="flex items-center space-x-2 sm:space-x-2.5">
        {/* Global Search Button */}
        <button
          onClick={onOpenSearch}
          className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            darkMode
              ? 'bg-white/[0.03] border-white/[0.08] text-zinc-400 hover:text-zinc-200 hover:border-white/[0.15]'
              : 'bg-zinc-100 border-zinc-200 text-zinc-600 hover:border-zinc-300'
          }`}
        >
          <Search className="w-3.5 h-3.5 text-zinc-400" />
          <span className="hidden sm:inline text-zinc-400">Buscar...</span>
          <kbd className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/40 text-zinc-400 border border-white/[0.08]">
            Ctrl+K
          </kbd>
        </button>

        {/* Quick Pomodoro Trigger */}
        <button
          onClick={onOpenPomodoro}
          className="p-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.06] transition-all"
          title="Pomodoro Timer"
        >
          <Timer className="w-4 h-4" />
        </button>

        {/* Cloud Sync / Auth Button */}
        <button
          onClick={onOpenAuth}
          className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
            isLoggedIn
              ? 'border-violet-500/25 bg-violet-500/10 text-violet-300 hover:bg-violet-500/15'
              : darkMode
              ? 'bg-white/[0.03] border-white/[0.08] text-zinc-300 hover:border-white/[0.15]'
              : 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:border-zinc-300'
          }`}
          title={isLoggedIn ? `Conectado como ${user?.displayName || user?.email}` : 'Entrar / Sincronizar'}
        >
          {isLoggedIn ? (
            <>
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Avatar'}
                  className="w-4 h-4 rounded-full object-cover"
                />
              ) : (
                <div className="w-4 h-4 rounded-full bg-violet-600 text-[10px] font-bold text-white flex items-center justify-center">
                  {(user?.displayName || user?.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <span className="hidden sm:inline max-w-[90px] truncate font-medium text-zinc-300">
                {user?.displayName || user?.email?.split('@')[0]}
              </span>
              <Cloud
                className={`w-3.5 h-3.5 ${
                  isSyncing ? 'text-amber-400 animate-pulse' : 'text-emerald-400'
                }`}
              />
            </>
          ) : (
            <>
              <User className="w-3.5 h-3.5 text-violet-400" />
              <span className="hidden sm:inline">Entrar</span>
            </>
          )}
        </button>

        {/* Quick Add Button */}
        <button
          onClick={() => onQuickAction('new-note')}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Nota</span>
        </button>
      </div>
    </header>
  );
}