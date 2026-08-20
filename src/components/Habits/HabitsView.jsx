import React, { useState } from 'react';
import {
  Flame,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  Trophy,
  X,
  TrendingUp
} from 'lucide-react';

export default function HabitsView({ habits, onUpdateHabits, darkMode }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('💧');
  const [color, setColor] = useState('#8b5cf6');

  // Last 7 days
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    last7Days.push({
      dateStr: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('pt-BR', { weekday: 'short' }),
      dayNum: d.getDate()
    });
  }

  const toggleDay = (habitId, dateStr) => {
    onUpdateHabits(habits.map(h => {
      if (h.id === habitId) {
        const current = h.history?.[dateStr] || false;
        return {
          ...h,
          history: {
            ...(h.history || {}),
            [dateStr]: !current
          }
        };
      }
      return h;
    }));
  };

  const calculateStreak = (history = {}) => {
    let streak = 0;
    const d = new Date();
    while (true) {
      const dateStr = d.toISOString().split('T')[0];
      if (history[dateStr]) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else {
        // If today is not checked yet, check yesterday before breaking
        if (streak === 0) {
          d.setDate(d.getDate() - 1);
          const yDateStr = d.toISOString().split('T')[0];
          if (history[yDateStr]) {
            streak++;
            d.setDate(d.getDate() - 1);
            continue;
          }
        }
        break;
      }
    }
    return streak;
  };

  const handleAddHabit = (e) => {
    e.preventDefault();
    if (!name) return;

    const newH = {
      id: 'hab-' + Date.now(),
      name,
      icon,
      color,
      history: {}
    };

    onUpdateHabits([...habits, newH]);
    setIsAddModalOpen(false);
    setName('');
  };

  const handleDeleteHabit = (id) => {
    if (confirm('Excluir este hábito?')) {
      onUpdateHabits(habits.filter(h => h.id !== id));
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto">
      {/* Top Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Rastreador de Hábitos</h1>
          <p className="text-xs md:text-sm text-gray-400 mt-1">
            Construa consistência diária e acompanhe suas sequências de hábitos (streaks).
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-lg shadow-pink-600/30 transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Hábito</span>
        </button>
      </div>

      {/* Habits Grid Table */}
      <div className={'p-6 rounded-3xl border shadow-md space-y-6 overflow-x-auto ' + (
        darkMode ? 'bg-[#1a1b24] border-gray-800' : 'bg-white border-gray-200'
      )}>
        <table className="w-full text-left text-xs min-w-[650px]">
          <thead>
            <tr className="border-b border-inherit text-gray-400">
              <th className="pb-4 font-bold uppercase text-[11px] tracking-wider w-1/3">Hábito</th>
              <th className="pb-4 font-bold uppercase text-[11px] tracking-wider text-center">Sequência 🔥</th>
              {last7Days.map(d => (
                <th key={d.dateStr} className="pb-4 text-center font-semibold">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-gray-500 uppercase">{d.dayName}</span>
                    <span className="text-xs font-bold mt-0.5">{d.dayNum}</span>
                  </div>
                </th>
              ))}
              <th className="pb-4 text-right font-bold uppercase text-[11px]">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-inherit">
            {habits.map(habit => {
              const streak = calculateStreak(habit.history);
              return (
                <tr key={habit.id} className="hover:bg-gray-800/20 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl p-1.5 rounded-xl bg-gray-900/60 border border-gray-800">{habit.icon}</span>
                      <div>
                        <h4 className="font-bold text-sm text-inherit">{habit.name}</h4>
                        <span className="text-[10px] text-gray-500">Meta diária</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 text-center">
                    <span className="inline-flex items-center gap-1 font-mono font-extrabold text-sm px-2.5 py-1 rounded-xl bg-pink-500/15 text-pink-400 border border-pink-500/30">
                      🔥 {streak} {streak === 1 ? 'dia' : 'dias'}
                    </span>
                  </td>

                  {last7Days.map(d => {
                    const isDone = habit.history?.[d.dateStr] || false;
                    return (
                      <td key={d.dateStr} className="py-4 text-center">
                        <button
                          onClick={() => toggleDay(habit.id, d.dateStr)}
                          className={'w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-150 ' + (
                            isDone
                              ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30 scale-105'
                              : 'bg-gray-900/60 border border-gray-800 text-transparent hover:border-gray-700'
                          )}
                          title={isDone ? 'Concluído' : 'Marcar'}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      </td>
                    );
                  })}

                  <td className="py-4 text-right">
                    <button
                      onClick={() => handleDeleteHabit(habit.id)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Habit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={'w-full max-w-md rounded-3xl border p-6 shadow-2xl space-y-4 ' + (
            darkMode ? 'bg-[#1a1b24] border-gray-800 text-gray-100' : 'bg-white border-gray-200 text-gray-800'
          )}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base">Novo Hábito</h3>
              <button onClick={() => setIsAddModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleAddHabit} className="space-y-3">
              <input
                type="text"
                placeholder="Nome do hábito (ex: Meditação, Treino, Beber Água)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-2.5 rounded-xl bg-gray-900/50 border border-gray-800 text-xs outline-none focus:border-purple-500 text-inherit"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Emoji (ex: 💧, 🏃, 📚)"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-gray-900/50 border border-gray-800 text-xs outline-none focus:border-purple-500 text-inherit"
                />
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full h-9 rounded-xl bg-gray-900/50 border border-gray-800 cursor-pointer"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs shadow-lg transition-transform active:scale-95"
              >
                Salvar Hábito
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
