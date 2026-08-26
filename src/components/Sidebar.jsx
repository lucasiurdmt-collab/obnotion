import React from 'react';
import {
  LayoutDashboard,
  FileText,
  DollarSign,
  BookOpen,
  CheckSquare,
  Calendar,
  Flame,
  BookHeart,
  Settings,
  Timer,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  User,
  X,
  Wand2
} from 'lucide-react';
import ObnotionLogo from './Common/ObnotionLogo';

export default function Sidebar({
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  collapsed,
  setCollapsed,
  mobileOpen,
  onCloseMobile,
  onOpenPomodoro,
  onOpenAuth,
  user,
  isLoggedIn,
  pomodoroActive,
  pomodoroTimeLeft,
  notesCount,
  tasksPendingCount,
  booksMonthCount
}) {
  const menuItems = [
    { id: 'dashboard', label: 'Início (IA)', icon: LayoutDashboard, badge: null },
    { id: 'notes', label: 'Notas & Grafo', icon: FileText, badge: notesCount },
    { id: 'finance', label: 'Finanças', icon: DollarSign, badge: null },
    { id: 'books', label: 'Biblioteca', icon: BookOpen, badge: booksMonthCount > 0 ? `${booksMonthCount} este mês` : null, badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    { id: 'tasks', label: 'Tarefas & Kanban', icon: CheckSquare, badge: tasksPendingCount > 0 ? tasksPendingCount : null, badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    { id: 'calendar', label: 'Calendário & Rotina', icon: Calendar, badge: null },
    { id: 'habits', label: 'Hábitos', icon: Flame, badge: null },
    { id: 'journal', label: 'Diário Pessoal', icon: BookHeart, badge: null },
    { id: 'productivity', label: 'Produtividade', icon: Wand2, badge: null },
    { id: 'settings', label: 'Configurações', icon: Settings, badge: null },
  ];

  const formatSeconds = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectTab = (id) => {
    setActiveTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed md:relative inset-y-0 left-0 z-50 md:z-20 ${
          collapsed ? 'md:w-[76px]' : 'w-72 md:w-64'
        } flex-shrink-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col border-r ${
          darkMode
            ? 'bg-[#0c0d14] border-white/[0.07] text-zinc-200'
            : 'bg-white border-zinc-200 text-zinc-800'
        } h-full select-none ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-inherit flex items-center justify-between">
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => handleSelectTab('dashboard')}
          >
            <ObnotionLogo size={34} glow={true} />
            {!collapsed && (
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="font-bold text-sm tracking-tight text-white group-hover:text-violet-400 transition-colors">
                    Obnotion
                  </h1>
                  <span className="text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.2 rounded bg-violet-500/15 text-violet-300 border border-violet-500/25">
                    Pro
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 font-medium tracking-tight">Second Brain OS</p>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-1">
            {/* Desktop Collapse Toggle */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06] transition-colors hidden md:flex items-center justify-center"
              title={collapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'}
            >
              <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06] transition-colors md:hidden"
              title="Fechar menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5 no-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center ${
                  collapsed ? 'md:justify-center md:px-0' : 'px-3'
                } py-2 rounded-xl text-xs font-medium transition-all duration-150 group relative ${
                  isActive
                    ? 'bg-white/[0.08] text-white font-semibold border border-white/[0.08] shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.03]'
                }`}
                title={item.label}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-violet-500 rounded-r-full" />
                )}
                <Icon
                  className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-105 ${
                    collapsed ? 'md:mr-0' : 'mr-2.5'
                  } ${isActive ? 'text-violet-400' : 'text-zinc-400 group-hover:text-zinc-200'}`}
                />
                <span className={`truncate flex-1 text-left ${collapsed ? 'md:hidden' : 'block'}`}>
                  {item.label}
                </span>
                {item.badge && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md border ${collapsed ? 'md:hidden' : 'inline-block'} ${
                      item.badgeColor || 'bg-zinc-800/80 text-zinc-300 border-zinc-700/50'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Pomodoro Quick Widget in Sidebar */}
        <div className="p-2 border-t border-inherit">
          <button
            onClick={onOpenPomodoro}
            className={`w-full flex items-center ${
              collapsed ? 'justify-center p-2' : 'px-3 py-2'
            } rounded-xl text-xs font-medium transition-all ${
              pomodoroActive
                ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                : 'bg-white/[0.02] text-zinc-400 border border-white/[0.05] hover:bg-white/[0.05] hover:text-zinc-200'
            }`}
            title="Abrir Pomodoro Timer"
          >
            <Timer className={`w-3.5 h-3.5 flex-shrink-0 ${!collapsed ? 'mr-2' : ''} ${pomodoroActive ? 'text-rose-400 animate-pulse' : ''}`} />
            {!collapsed && (
              <div className="flex items-center justify-between w-full">
                <span>{pomodoroActive ? 'Foco em Andamento' : 'Pomodoro'}</span>
                <span className="font-mono text-[11px] bg-black/40 px-1.5 py-0.2 rounded border border-white/[0.06]">
                  {formatSeconds(pomodoroTimeLeft)}
                </span>
              </div>
            )}
          </button>
        </div>

        {/* User Cloud / Auth Profile Section */}
        <div className="p-2 border-t border-inherit">
          <button
            onClick={onOpenAuth}
            className={`w-full flex items-center ${
              collapsed ? 'justify-center p-2' : 'px-3 py-2'
            } rounded-xl text-xs font-medium transition-all ${
              isLoggedIn
                ? 'bg-violet-600/10 hover:bg-violet-600/15 border border-violet-500/20 text-violet-300'
                : 'hover:bg-white/[0.04] text-zinc-400 hover:text-zinc-200 border border-transparent'
            }`}
            title={isLoggedIn ? `Conectado como ${user?.displayName || user?.email}` : 'Entrar / Criar Conta'}
          >
            {isLoggedIn ? (
              <>
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Avatar"
                    className={`w-5 h-5 rounded-full object-cover flex-shrink-0 ${!collapsed ? 'mr-2.5' : ''}`}
                  />
                ) : (
                  <div className={`w-5 h-5 rounded-full bg-violet-600 text-[10px] font-bold text-white flex items-center justify-center flex-shrink-0 ${!collapsed ? 'mr-2.5' : ''}`}>
                    {(user?.displayName || user?.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                {!collapsed && (
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-semibold text-xs text-zinc-200 truncate leading-tight">
                      {user?.displayName || user?.email?.split('@')[0]}
                    </p>
                    <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Sincronizado
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className={`w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 flex-shrink-0 ${!collapsed ? 'mr-2.5' : ''}`}>
                  <User className="w-3 h-3" />
                </div>
                {!collapsed && (
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-xs text-zinc-300">Conectar Nuvem</p>
                    <p className="text-[10px] text-zinc-500">Acesse de qualquer lugar</p>
                  </div>
                )}
              </>
            )}
          </button>
        </div>

        {/* Footer / Theme switch */}
        <div className="p-2 border-t border-inherit flex items-center justify-between">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.05] transition-colors flex items-center gap-2 text-xs"
            title={darkMode ? 'Mudar para Tema Claro' : 'Mudar para Tema Escuro'}
          >
            {darkMode ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
            )}
            {!collapsed && <span>{darkMode ? 'Tema Claro' : 'Tema Escuro'}</span>}
          </button>
        </div>
      </aside>
    </>
  );
}