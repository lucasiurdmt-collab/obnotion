import React from 'react';
import {
  Sparkles,
  DollarSign,
  BookOpen,
  CheckSquare,
  Flame,
  Plus,
  ArrowRight,
  CheckCircle2,
  CalendarDays as CalendarIcon,
  Timer
} from 'lucide-react';

export default function DashboardView({
  data,
  onNavigate,
  onUpdateTasks,
  onUpdateHabits,
  onOpenPomodoro,
  darkMode
}) {
  const todayStr = new Date().toISOString().split('T')[0];
  const currentMonthStr = todayStr.slice(0, 7);

  const monthTransactions = data.transactions.filter(t => t.date.startsWith(currentMonthStr));
  const incomeTotal = monthTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const expenseTotal = monthTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const balance = incomeTotal - expenseTotal;

  const booksReadThisMonth = data.books.filter(b => b.status === 'completed' && b.monthRead === currentMonthStr);
  const currentReading = data.books.find(b => b.status === 'reading');

  const todayTasks = data.tasks.filter(t => t.dueDate === todayStr || t.status === 'in_progress');
  const completedTasksToday = todayTasks.filter(t => t.status === 'done').length;

  const habitsDoneToday = data.habits.filter(h => h.history && h.history[todayStr]).length;
  const habitCompletionPercent = data.habits.length > 0 ? Math.round((habitsDoneToday / data.habits.length) * 100) : 0;

  const quote = data.quotes[0] || { text: "O segredo para progredir é começar.", author: "Mark Twain" };

  const toggleTaskDone = (taskId) => {
    onUpdateTasks(data.tasks.map(t => {
      if (t.id === taskId) {
        return { ...t, status: t.status === 'done' ? 'todo' : 'done' };
      }
      return t;
    }));
  };

  const toggleHabitToday = (habitId) => {
    onUpdateHabits(data.habits.map(h => {
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
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto">
      {/* Welcome Banner */}
      <div className={'p-6 md:p-8 rounded-3xl border relative overflow-hidden shadow-xl ' + (
        darkMode
          ? 'bg-gradient-to-r from-purple-950/40 via-indigo-950/20 to-gray-900 border-purple-900/30'
          : 'bg-gradient-to-r from-purple-50 via-indigo-50 to-white border-purple-200'
      )}>
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✨</span>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Olá! Bem-vindo ao seu Obnotion
            </h1>
          </div>
          <p className="text-sm md:text-base text-gray-400 italic max-w-2xl">
            "{quote.text}" <span className="font-semibold text-purple-400">— {quote.author}</span>
          </p>
        </div>
      </div>

      {/* 4 Main Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Finance Card */}
        <div
          onClick={() => onNavigate('finance')}
          className={'p-5 rounded-2xl border cursor-pointer group transition-all duration-200 hover:scale-[1.02] shadow-md ' + (
            darkMode ? 'bg-[#1a1b24] border-gray-800 hover:border-emerald-500/40' : 'bg-white border-gray-200 hover:border-emerald-500'
          )}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Saldo do Mês</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <h3 className={'text-2xl font-bold tracking-tight ' + (balance >= 0 ? 'text-emerald-400' : 'text-red-400')}>
            R$ {balance.toFixed(2)}
          </h3>
          <p className="text-xs text-gray-400 mt-2 flex items-center justify-between">
            <span>+{incomeTotal.toFixed(0)} / -{expenseTotal.toFixed(0)}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-emerald-400" />
          </p>
        </div>

        {/* Books Card */}
        <div
          onClick={() => onNavigate('books')}
          className={'p-5 rounded-2xl border cursor-pointer group transition-all duration-200 hover:scale-[1.02] shadow-md ' + (
            darkMode ? 'bg-[#1a1b24] border-gray-800 hover:border-purple-500/40' : 'bg-white border-gray-200 hover:border-purple-500'
          )}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Livros no Mês</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-purple-400">
            {booksReadThisMonth.length} {booksReadThisMonth.length === 1 ? 'lido' : 'lidos'}
          </h3>
          <p className="text-xs text-gray-400 mt-2 flex items-center justify-between">
            <span>Meta: {data.books.filter(b => b.status === 'completed').length}/{data.readingGoalYear || 18}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-purple-400" />
          </p>
        </div>

        {/* Tasks Card */}
        <div
          onClick={() => onNavigate('tasks')}
          className={'p-5 rounded-2xl border cursor-pointer group transition-all duration-200 hover:scale-[1.02] shadow-md ' + (
            darkMode ? 'bg-[#1a1b24] border-gray-800 hover:border-amber-500/40' : 'bg-white border-gray-200 hover:border-amber-500'
          )}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Tarefas de Hoje</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-amber-400">
            {completedTasksToday}/{todayTasks.length}
          </h3>
          <p className="text-xs text-gray-400 mt-2 flex items-center justify-between">
            <span>{todayTasks.length - completedTasksToday} pendentes</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-amber-400" />
          </p>
        </div>

        {/* Habits Card */}
        <div
          onClick={() => onNavigate('habits')}
          className={'p-5 rounded-2xl border cursor-pointer group transition-all duration-200 hover:scale-[1.02] shadow-md ' + (
            darkMode ? 'bg-[#1a1b24] border-gray-800 hover:border-pink-500/40' : 'bg-white border-gray-200 hover:border-pink-500'
          )}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Hábitos Hoje</span>
            <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-pink-400">
            {habitCompletionPercent}%
          </h3>
          <p className="text-xs text-gray-400 mt-2 flex items-center justify-between">
            <span>{habitsDoneToday} de {data.habits.length} concluídos</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-pink-400" />
          </p>
        </div>
      </div>

      {/* Middle: Tasks, Current Book, Habits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={'lg:col-span-2 p-6 rounded-3xl border shadow-md space-y-4 ' + (
          darkMode ? 'bg-[#1a1b24] border-gray-800' : 'bg-white border-gray-200'
        )}>
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-amber-400" />
              Tarefas Prioritárias de Hoje
            </h3>
            <button
              onClick={() => onNavigate('tasks')}
              className="text-xs font-semibold text-purple-400 hover:underline flex items-center gap-1"
            >
              Ver Quadro Kanban <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2">
            {todayTasks.length > 0 ? (
              todayTasks.map(task => (
                <div
                  key={task.id}
                  onClick={() => toggleTaskDone(task.id)}
                  className={'p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ' + (
                    task.status === 'done'
                      ? 'bg-emerald-500/5 border-emerald-500/20 text-gray-400'
                      : 'bg-gray-900/30 border-gray-800 hover:border-gray-700'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.status === 'done'}
                      onChange={() => {}}
                      className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                    />
                    <span className={'text-sm font-medium ' + (task.status === 'done' ? 'line-through' : '')}>
                      {task.title}
                    </span>
                  </div>
                  <span className={'text-[10px] font-bold px-2 py-0.5 rounded uppercase ' + (
                    task.priority === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-gray-800 text-gray-400'
                  )}>
                    {task.priority}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 py-4 text-center">Nenhuma tarefa pendente para hoje! 🎉</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {currentReading && (
            <div className={'p-6 rounded-3xl border shadow-md space-y-4 ' + (
              darkMode ? 'bg-[#1a1b24] border-gray-800' : 'bg-white border-gray-200'
            )}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                  Lendo Atualmente
                </h3>
                <span className="text-xs text-purple-400 font-semibold">
                  {Math.round((currentReading.currentPage / currentReading.totalPages) * 100)}%
                </span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={currentReading.cover}
                  alt={currentReading.title}
                  className="w-14 h-20 rounded-lg object-cover shadow-md flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm truncate">{currentReading.title}</h4>
                  <p className="text-xs text-gray-400 truncate">{currentReading.author}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {currentReading.currentPage} de {currentReading.totalPages} páginas
                  </p>
                  <div className="w-full bg-gray-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-purple-500 h-full rounded-full transition-all duration-300"
                      style={{ width: ((currentReading.currentPage / currentReading.totalPages) * 100) + '%' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className={'p-6 rounded-3xl border shadow-md space-y-3 ' + (
            darkMode ? 'bg-[#1a1b24] border-gray-800' : 'bg-white border-gray-200'
          )}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Flame className="w-4 h-4 text-pink-400" />
                Hábitos do Dia
              </h3>
              <button onClick={() => onNavigate('habits')} className="text-xs text-pink-400 hover:underline">
                Ver todos
              </button>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {data.habits.slice(0, 4).map(habit => {
                const done = habit.history?.[todayStr];
                return (
                  <div
                    key={habit.id}
                    onClick={() => toggleHabitToday(habit.id)}
                    className={'p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ' + (
                      done ? 'bg-pink-500/10 border-pink-500/30 text-pink-300' : 'bg-gray-900/30 border-gray-800 hover:border-gray-700'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span>{habit.icon}</span>
                      <span className="text-xs font-medium">{habit.name}</span>
                    </div>
                    <CheckCircle2 className={'w-4 h-4 ' + (done ? 'text-pink-400 fill-pink-400/20' : 'text-gray-600')} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Notes */}
      <div className={'p-6 rounded-3xl border shadow-md space-y-4 ' + (
        darkMode ? 'bg-[#1a1b24] border-gray-800' : 'bg-white border-gray-200'
      )}>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Notas Recentes & Conhecimento
          </h3>
          <button
            onClick={() => onNavigate('notes')}
            className="text-xs font-semibold text-purple-400 hover:underline flex items-center gap-1"
          >
            Abrir Notas <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.notes.slice(0, 3).map(note => (
            <div
              key={note.id}
              onClick={() => onNavigate('notes')}
              className="p-4 rounded-2xl bg-gray-900/30 border border-gray-800 hover:border-purple-500/40 cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{note.icon || '📝'}</span>
                <h4 className="font-bold text-xs truncate group-hover:text-purple-400 transition-colors">
                  {note.title}
                </h4>
              </div>
              <p className="text-xs text-gray-400 line-clamp-2">
                {note.content.replace(/[#*[\]`>_-]/g, '').slice(0, 80)}...
              </p>
              <div className="flex items-center justify-between mt-3 text-[10px] text-gray-500">
                <span>{note.updatedAt}</span>
                <span>{(note.tags || []).join(', ')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
