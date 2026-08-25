import React from 'react';
import {
  DollarSign,
  BookOpen,
  CheckSquare,
  Flame,
  ArrowRight,
  CheckCircle2,
  Circle,
  FileText,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';

export default function DashboardView({
  data = {},
  onNavigate,
  onUpdateTasks,
  onUpdateHabits,
  darkMode
}) {
  const todayStr = new Date().toISOString().split('T')[0];
  const currentMonthStr = todayStr.slice(0, 7);

  const transactions = data?.transactions || [];
  const books = data?.books || [];
  const tasks = data?.tasks || [];
  const habits = data?.habits || [];
  const notes = data?.notes || [];

  const monthTransactions = transactions.filter(t => t.date && t.date.startsWith(currentMonthStr));
  const incomeTotal = monthTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + (t.amount || 0), 0);
  const expenseTotal = monthTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + (t.amount || 0), 0);
  const balance = incomeTotal - expenseTotal;

  const booksReadThisMonth = books.filter(b => b.status === 'completed' && b.monthRead === currentMonthStr);
  const currentReading = books.find(b => b.status === 'reading');

  const todayTasks = tasks.filter(t => t.dueDate === todayStr || t.status === 'in_progress');
  const completedTasksToday = todayTasks.filter(t => t.status === 'done').length;

  const habitsDoneToday = habits.filter(h => h.history && h.history[todayStr]).length;
  const habitCompletionPercent = habits.length > 0 ? Math.round((habitsDoneToday / habits.length) * 100) : 0;

  const toggleTaskDone = (taskId) => {
    onUpdateTasks(tasks.map(t => {
      if (t.id === taskId) {
        return { ...t, status: t.status === 'done' ? 'todo' : 'done' };
      }
      return t;
    }));
  };

  const toggleHabitToday = (habitId) => {
    onUpdateHabits(habits.map(h => {
      if (h.id === habitId) {
        const current = h.history?.[todayStr] || false;
        return {
          ...h,
          history: {
            ...(h.history || {}),
            [todayStr]: !current
          }
        };
      }
      return h;
    }));
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      {/* Sleek Command Center Hero */}
      <div className={`p-6 rounded-2xl border ${
        darkMode 
          ? 'bg-[#101118]/60 backdrop-blur-md border-white/[0.08]' 
          : 'bg-white border-zinc-200'
      } flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden`}>
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">Sistema Operacional Pessoal</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Painel Executivo
          </h1>
          <p className="text-xs text-zinc-400 max-w-xl">
            Visão consolidada de conhecimento, finanças, hábitos e objetivos em tempo real.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <div className="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.07] text-right">
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">Consistência</p>
            <p className="text-sm font-bold font-mono text-zinc-200">{habitCompletionPercent}%</p>
          </div>
          <div className="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.07] text-right">
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">Notas Ativas</p>
            <p className="text-sm font-bold font-mono text-zinc-200">{notes.length}</p>
          </div>
        </div>
      </div>

      {/* 4 Main Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Finance Card */}
        <div
          onClick={() => onNavigate('finance')}
          className={`p-5 rounded-2xl border cursor-pointer group transition-all duration-200 ${
            darkMode ? 'bg-[#111219]/70 border-white/[0.07] hover:border-emerald-500/40 hover:bg-[#141520]' : 'bg-white border-zinc-200 hover:border-emerald-500'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Saldo Mensal</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <h3 className={`text-2xl font-bold font-mono tracking-tight ${balance >= 0 ? 'text-zinc-100' : 'text-rose-400'}`}>
            R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
          <div className="text-[11px] text-zinc-400 mt-2 flex items-center justify-between font-mono">
            <span className="text-emerald-400/90">+{incomeTotal.toFixed(0)}</span>
            <span className="text-rose-400/90">-{expenseTotal.toFixed(0)}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-zinc-400" />
          </div>
        </div>

        {/* Books Card */}
        <div
          onClick={() => onNavigate('books')}
          className={`p-5 rounded-2xl border cursor-pointer group transition-all duration-200 ${
            darkMode ? 'bg-[#111219]/70 border-white/[0.07] hover:border-violet-500/40 hover:bg-[#141520]' : 'bg-white border-zinc-200 hover:border-violet-500'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Leituras no Mês</span>
            <div className="p-1.5 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold font-mono tracking-tight text-zinc-100">
            {booksReadThisMonth.length} <span className="text-xs font-normal text-zinc-400">lidos</span>
          </h3>
          <p className="text-[11px] text-zinc-400 mt-2 flex items-center justify-between">
            <span>Meta Anual: {books.filter(b => b.status === 'completed').length} / {data?.readingGoalYear || 12}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-zinc-400" />
          </p>
        </div>

        {/* Tasks Card */}
        <div
          onClick={() => onNavigate('tasks')}
          className={`p-5 rounded-2xl border cursor-pointer group transition-all duration-200 ${
            darkMode ? 'bg-[#111219]/70 border-white/[0.07] hover:border-amber-500/40 hover:bg-[#141520]' : 'bg-white border-zinc-200 hover:border-amber-500'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Tarefas de Hoje</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold font-mono tracking-tight text-zinc-100">
            {completedTasksToday} / {todayTasks.length}
          </h3>
          <p className="text-[11px] text-zinc-400 mt-2 flex items-center justify-between">
            <span>{todayTasks.length - completedTasksToday} pendentes</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-zinc-400" />
          </p>
        </div>

        {/* Habits Card */}
        <div
          onClick={() => onNavigate('habits')}
          className={`p-5 rounded-2xl border cursor-pointer group transition-all duration-200 ${
            darkMode ? 'bg-[#111219]/70 border-white/[0.07] hover:border-cyan-500/40 hover:bg-[#141520]' : 'bg-white border-zinc-200 hover:border-cyan-500'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Hábitos Diários</span>
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold font-mono tracking-tight text-zinc-100">
            {habitCompletionPercent}%
          </h3>
          <p className="text-[11px] text-zinc-400 mt-2 flex items-center justify-between font-mono">
            <span>{habitsDoneToday} de {habits.length} concluídos</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-zinc-400" />
          </p>
        </div>
      </div>

      {/* Middle Grid: Tasks, Current Book & Habits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority Tasks */}
        <div className={`lg:col-span-2 p-6 rounded-2xl border ${
          darkMode ? 'bg-[#101118]/60 border-white/[0.08]' : 'bg-white border-zinc-200'
        } space-y-4`}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold tracking-tight flex items-center gap-2 text-zinc-200">
              <CheckSquare className="w-4 h-4 text-amber-400" />
              Tarefas Prioritárias de Hoje
            </h3>
            <button
              onClick={() => onNavigate('tasks')}
              className="text-xs font-medium text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              Quadro Kanban <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-1.5">
            {todayTasks.length > 0 ? (
              todayTasks.map(task => (
                <div
                  key={task.id}
                  onClick={() => toggleTaskDone(task.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    task.status === 'done'
                      ? 'bg-white/[0.01] border-white/[0.04] text-zinc-500'
                      : 'bg-white/[0.03] border-white/[0.06] hover:border-white/[0.12] text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {task.status === 'done' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                    )}
                    <span className={`text-xs font-medium ${task.status === 'done' ? 'line-through text-zinc-500' : ''}`}>
                      {task.title}
                    </span>
                  </div>
                  <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border ${
                    task.priority === 'high' 
                      ? 'bg-rose-500/10 text-rose-300 border-rose-500/20' 
                      : 'bg-zinc-800/80 text-zinc-400 border-zinc-700/40'
                  }`}>
                    {task.priority || 'Normal'}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-8 text-center border border-dashed border-white/[0.06] rounded-xl">
                <p className="text-xs text-zinc-500">Nenhuma tarefa pendente para hoje.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Reading & Habits */}
        <div className="space-y-6">
          {currentReading && (
            <div className={`p-5 rounded-2xl border ${
              darkMode ? 'bg-[#101118]/60 border-white/[0.08]' : 'bg-white border-zinc-200'
            } space-y-3`}>
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 font-mono">
                  <BookOpen className="w-3.5 h-3.5 text-violet-400" />
                  Lendo Agora
                </h3>
                <span className="text-xs font-mono text-violet-400">
                  {Math.round((currentReading.currentPage / currentReading.totalPages) * 100)}%
                </span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={currentReading.cover}
                  alt={currentReading.title}
                  className="w-12 h-16 rounded-lg object-cover border border-white/[0.08] shadow-sm flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-xs text-zinc-200 truncate">{currentReading.title}</h4>
                  <p className="text-[11px] text-zinc-400 truncate">{currentReading.author}</p>
                  <p className="text-[10px] text-zinc-500 mt-1 font-mono">
                    {currentReading.currentPage} / {currentReading.totalPages} páginas
                  </p>
                  <div className="w-full bg-white/[0.06] h-1 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-violet-500 h-full rounded-full transition-all duration-300"
                      style={{ width: ((currentReading.currentPage / currentReading.totalPages) * 100) + '%' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Daily Habits */}
          <div className={`p-5 rounded-2xl border ${
            darkMode ? 'bg-[#101118]/60 border-white/[0.08]' : 'bg-white border-zinc-200'
          } space-y-3`}>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 font-mono">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                Hábitos do Dia
              </h3>
              <button onClick={() => onNavigate('habits')} className="text-xs text-zinc-400 hover:text-white transition-colors">
                Ver todos
              </button>
            </div>

            <div className="space-y-1.5">
              {habits.slice(0, 4).map(habit => {
                const done = habit.history?.[todayStr];
                return (
                  <div
                    key={habit.id}
                    onClick={() => toggleHabitToday(habit.id)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      done 
                        ? 'bg-violet-500/10 border-violet-500/25 text-violet-200' 
                        : 'bg-white/[0.02] border-white/[0.05] hover:border-white/[0.1] text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm">{habit.icon || '🎯'}</span>
                      <span className="text-xs font-medium">{habit.name}</span>
                    </div>
                    {done ? (
                      <CheckCircle2 className="w-4 h-4 text-violet-400" />
                    ) : (
                      <Circle className="w-4 h-4 text-zinc-600" />
                    )}
                  </div>
                );
              })}
              {habits.length === 0 && (
                <p className="text-xs text-zinc-500 py-3 text-center">Nenhum hábito ativo.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Notes Section */}
      <div className={`p-6 rounded-2xl border ${
        darkMode ? 'bg-[#101118]/60 border-white/[0.08]' : 'bg-white border-zinc-200'
      } space-y-4`}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold tracking-tight flex items-center gap-2 text-zinc-200">
            <FileText className="w-4 h-4 text-violet-400" />
            Documentos & Base de Conhecimento
          </h3>
          <button
            onClick={() => onNavigate('notes')}
            className="text-xs font-medium text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            Ver Todas <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {notes.slice(0, 3).map(note => (
            <div
              key={note.id}
              onClick={() => onNavigate('notes')}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.14] hover:bg-white/[0.04] cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-base">{note.icon || '📄'}</span>
                <h4 className="font-semibold text-xs text-zinc-200 truncate group-hover:text-violet-400 transition-colors">
                  {note.title}
                </h4>
              </div>
              <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                {(note.content || '').replace(/[#*[\]`>_-]/g, '').slice(0, 75)}...
              </p>
              <div className="flex items-center justify-between mt-3 text-[10px] font-mono text-zinc-500">
                <span>{note.updatedAt || 'Hoje'}</span>
                <span>{(note.tags || []).join(' ')}</span>
              </div>
            </div>
          ))}
          {notes.length === 0 && (
            <div className="col-span-3 py-6 text-center text-xs text-zinc-500">
              Nenhuma nota criada ainda. Clique em "+ Nota" no topo para começar!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
