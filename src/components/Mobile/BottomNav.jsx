import React from 'react';
import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  DollarSign,
  Menu
} from 'lucide-react';

export default function BottomNav({
  activeTab,
  setActiveTab,
  onOpenMobileMenu,
  darkMode,
  notesCount,
  tasksPendingCount
}) {
  const navItems = [
    { id: 'dashboard', label: 'Início', icon: LayoutDashboard },
    { id: 'notes', label: 'Notas', icon: FileText, badge: notesCount },
    { id: 'tasks', label: 'Tarefas', icon: CheckSquare, badge: tasksPendingCount },
    { id: 'finance', label: 'Finanças', icon: DollarSign },
  ];

  return (
    <nav
      className={`md:hidden fixed bottom-0 left-0 right-0 z-30 border-t flex items-center justify-around px-2 py-1.5 transition-colors ${
        darkMode
          ? 'bg-[#14151b]/95 border-gray-800 text-gray-400 backdrop-blur-md'
          : 'bg-white/95 border-gray-200 text-gray-600 backdrop-blur-md'
      } pb-safe`}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all relative ${
              isActive
                ? 'text-purple-400 font-bold scale-105'
                : 'hover:text-gray-200'
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {item.badge > 0 && (
                <span className="absolute -top-1 -right-2 min-w-[14px] h-3.5 px-1 bg-purple-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
          </button>
        );
      })}

      {/* More / Menu Drawer trigger */}
      <button
        onClick={onOpenMobileMenu}
        className="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all hover:text-gray-200 text-gray-400"
      >
        <Menu className="w-5 h-5 text-purple-400" />
        <span className="text-[10px] tracking-tight mt-0.5">Mais</span>
      </button>
    </nav>
  );
}
