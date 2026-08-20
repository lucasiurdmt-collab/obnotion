import React from 'react';
import { Search, Plus, Sparkles, Timer, Cloud, CheckCircle2, User, Menu } from 'lucide-react';

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
    dashboard: 'Painel Geral',
    notes: 'Notas & Grafo',
    finance: 'Finanças',
    books: 'Biblioteca',
    tasks: 'Tarefas & Kanban',
    calendar: 'Calendário & Rotina',
    habits: 'Hábitos',
    journal: 'Diário Pessoal',
    settings: 'Configurações'
  };

  const getFormattedDate = () => {
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    const dateStr = new Date().toLocaleDateString('pt-BR', options);
    return dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
  };

  return (
    <header
      className={`h-16 px-4 md:px-6 border-b flex items-center justify-between transition-colors ${
        darkMode
          ? 'bg-[#14151b] border-gray-800 text-gray-100'
          : 'bg-white border-gray-200 text-gray-800'
      } sticky top-0 z-10`}
    >
      {/* Title / Hamburger Menu / Breadcrumb */}
      <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
        {/* Mobile Drawer Trigger */}
        <button
          onClick={onToggleMobileMenu}
          className="p-2 -ml-1 rounded-xl text-gray-400 hover:text-gray-100 hover:bg-gray-800/50 md:hidden flex-shrink-0"
          title="Abrir Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h2 className="text-base sm:text-lg font-bold tracking-tight text-inherit truncate">
          {titles[activeTab] || 'Obnotion'}
        </h2>
        <span className="hidden lg:inline-block text-[11px] px-2.5 py-0.5 rounded-full bg-gray-500/10 text-gray-400 border border-gray-500/20">
          {getFormattedDate()}
        </span>
      </div>

      {/* Action Buttons & Search */}
      <div className="flex items-center space-x-2.5 sm:space-x-3">
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

        {/* Cloud Sync / Auth Button */}
        <button
          onClick={onOpenAuth}
          className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all ${
            isLoggedIn
              ? 'border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20'
              : darkMode
              ? 'bg-gray-900/60 border-gray-700 text-gray-300 hover:border-gray-500'
              : 'bg-gray-100 border-gray-200 text-gray-700 hover:border-gray-300'
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
                <div className="w-4 h-4 rounded-full bg-purple-600 text-[10px] font-bold text-white flex items-center justify-center">
                  {(user?.displayName || user?.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <span className="hidden sm:inline max-w-[100px] truncate font-medium">
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
              <User className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">Entrar</span>
            </>
          )}
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