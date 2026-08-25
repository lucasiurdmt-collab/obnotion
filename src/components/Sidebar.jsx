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
  Plus,
  Sparkles,
  User,
  X,
  Wand2
} from 'lucide-react';

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
  isSyncing,
  pomodoroActive,
  pomodoroTimeLeft,
  notesCount,
  tasksPendingCount,
  booksMonthCount
}) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'notes', label: 'Notas & Grafo', icon: FileText, badge: notesCount },
    { id: 'finance', label: 'Finanças', icon: DollarSign, badge: null },
    { id: 'books', label: 'Biblioteca', icon: BookOpen, badge: booksMonthCount > 0 ? `${booksMonthCount} no mês` : null, badgeColor: 'bg-emerald-500/20 text-emerald-400' },
    { id: 'tasks', label: 'Tarefas & Kanban', icon: CheckSquare, badge: tasksPendingCount > 0 ? tasksPendingCount : null, badgeColor: 'bg-amber-500/20 text-amber-400' },
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
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 md:hidden animate-fade-in"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed md:relative inset-y-0 left-0 z-50 md:z-20 ${
          collapsed ? 'md:w-20' : 'w-72 md:w-64'
        } flex-shrink-0 transition-transform md:transition-all duration-300 ease-in-out flex flex-col border-r ${
          darkMode
            ? 'bg-[#181920] border-gray-800 text-gray-200 shadow-2xl md:shadow-none'
            : 'bg-white border-gray-200 text-gray-800 shadow-2xl md:shadow-none'
        } h-full select-none ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-inherit flex items-center justify-between">
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => handleSelectTab('dashboard')}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-tight flex items-center gap-1.5">
                Obnotion
                <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  Pro
                </span>
              </h1>
              <p className="text-xs text-gray-400 font-medium">Segundo Cérebro</p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            {/* Desktop Collapse Toggle */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className={`p-1.5 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-gray-700/30 transition-colors hidden md:block`}
              title={collapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-gray-700/30 transition-colors md:hidden"
              title="Fechar menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center ${
                  collapsed ? 'md:justify-center md:px-0' : ''
                } px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative ${
                  isActive
                    ? 'bg-purple-600/15 text-purple-400 border border-purple-500/30 font-semibold shadow-sm'
                    : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800/40'
                }`}
                title={item.label}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 mr-3 ${
                    collapsed ? 'md:mr-0' : ''
                  } ${isActive ? 'text-purple-400' : 'text-gray-400 group-hover:text-gray-200'}`}
                />
                <span className={`truncate flex-1 text-left ${collapsed ? 'md:hidden' : 'block'}`}>
                  {item.label}
                </span>
                {item.badge && (
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${collapsed ? 'md:hidden' : 'inline-block'} ${
                      item.badgeColor || 'bg-gray-800 text-gray-400 border border-gray-700'
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
      <div className="p-3 border-t border-inherit">
        <button
          onClick={onOpenPomodoro}
          className={`w-full flex items-center ${
            collapsed ? 'justify-center p-2' : 'px-3 py-2.5'
          } rounded-xl text-xs font-semibold transition-all ${
            pomodoroActive
              ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
              : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20'
          }`}
          title="Abrir Pomodoro Timer"
        >
          <Timer className={`w-4 h-4 flex-shrink-0 ${!collapsed ? 'mr-2' : ''}`} />
          {!collapsed && (
            <div className="flex items-center justify-between w-full">
              <span>{pomodoroActive ? 'Foco Ativo' : 'Pomodoro Timer'}</span>
              <span className="font-mono bg-black/30 px-1.5 py-0.5 rounded">
                {formatSeconds(pomodoroTimeLeft)}
              </span>
            </div>
          )}
        </button>
      </div>

      {/* User Cloud / Auth Profile Section */}
      <div className="p-3 border-t border-inherit">
        <button
          onClick={onOpenAuth}
          className={`w-full flex items-center ${
            collapsed ? 'justify-center p-2' : 'px-3 py-2'
          } rounded-xl text-xs font-medium transition-all ${
            isLoggedIn
              ? 'bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/20 text-purple-300'
              : 'hover:bg-gray-800/40 text-gray-400 hover:text-gray-200 border border-transparent'
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
                <div className={`w-5 h-5 rounded-full bg-purple-600 text-[10px] font-bold text-white flex items-center justify-center flex-shrink-0 ${!collapsed ? 'mr-2.5' : ''}`}>
                  {(user?.displayName || user?.email || 'U')[0].toUpperCase()}
                </div>
              )}
              {!collapsed && (
                <div className="flex-1 text-left min-w-0">
                  <p className="font-semibold text-xs text-gray-200 truncate leading-tight">
                    {user?.displayName || user?.email?.split('@')[0]}
                  </p>
                  <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Nuvem Ativa
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              <div className={`w-5 h-5 rounded-full bg-gray-700/50 flex items-center justify-center text-gray-400 flex-shrink-0 ${!collapsed ? 'mr-2.5' : ''}`}>
                <User className="w-3 h-3" />
              </div>
              {!collapsed && (
                <div className="flex-1 text-left">
                  <p className="font-semibold text-xs text-gray-300">Entrar na Conta</p>
                  <p className="text-[10px] text-gray-400">Salvar na nuvem</p>
                </div>
              )}
            </>
          )}
        </button>
      </div>

      {/* Footer / Theme switch & expand button */}
      <div className="p-3 border-t border-inherit flex items-center justify-between">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-xl text-gray-400 hover:text-gray-100 hover:bg-gray-800/50 transition-colors flex items-center gap-2 text-xs"
          title={darkMode ? 'Mudar para Tema Claro' : 'Mudar para Tema Escuro'}
        >
          {darkMode ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-400" />
          )}
          {!collapsed && <span>{darkMode ? 'Tema Claro' : 'Tema Escuro'}</span>}
        </button>

        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-100 hover:bg-gray-800/50 transition-colors"
            title="Expandir barra lateral"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
    </>
  );
}