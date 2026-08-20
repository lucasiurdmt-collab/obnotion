import React, { useState } from 'react';
import {
  CalendarDays as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Clock,
  LayoutTemplate,
  CheckCircle2,
  X
} from 'lucide-react';

export default function CalendarView({
  events,
  tasks,
  weeklySchedule,
  onUpdateEvents,
  onUpdateWeeklySchedule,
  darkMode
}) {
  const [activeSubTab, setActiveSubTab] = useState('monthly'); // 'monthly' | 'weekly'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().toISOString().split('T')[0]);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);

  // Form state
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [eventTime, setEventTime] = useState('14:00');
  const [eventCategory, setEventCategory] = useState('work');
  const [eventColor, setEventColor] = useState('#8b5cf6');

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthYearStr = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const capitalizedMonth = monthYearStr.charAt(0).toUpperCase() + monthYearStr.slice(1);

  // Calculate calendar grid
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];
  for (let i = 0; i < firstDayIndex; i++) {
    days.push(null);
  }
  for (let d = 1; d <= totalDaysInMonth; d++) {
    const dayStr = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
    days.push(dayStr);
  }

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!eventTitle) return;

    const newEv = {
      id: 'ev-' + Date.now(),
      title: eventTitle,
      date: eventDate,
      time: eventTime,
      category: eventCategory,
      color: eventColor
    };

    onUpdateEvents([...events, newEv]);
    setIsAddEventModalOpen(false);
    setEventTitle('');
  };

  const handleDeleteEvent = (id) => {
    onUpdateEvents(events.filter(e => e.id !== id));
  };

  const handleUpdateWeeklyDay = (dayIndex, field, value) => {
    onUpdateWeeklySchedule(weeklySchedule.map((item, idx) => {
      if (idx === dayIndex) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const selectedDayEvents = events.filter(e => e.date === selectedDay);
  const selectedDayTasks = tasks.filter(t => t.dueDate === selectedDay);

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Calendário & Rotina</h1>
          <p className="text-xs md:text-sm text-gray-400 mt-1">
            Planejamento de eventos mensais e rotina semanal fixa de atividades.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 rounded-xl bg-gray-900/50 border border-gray-800 text-xs">
            <button
              onClick={() => setActiveSubTab('monthly')}
              className={'px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 ' + (activeSubTab === 'monthly' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400')}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Visão Mensal</span>
            </button>
            <button
              onClick={() => setActiveSubTab('weekly')}
              className={'px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 ' + (activeSubTab === 'weekly' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400')}
            >
              <LayoutTemplate className="w-3.5 h-3.5" />
              <span>Rotina Semanal</span>
            </button>
          </div>

          {activeSubTab === 'monthly' && (
            <button
              onClick={() => { setEventDate(selectedDay); setIsAddEventModalOpen(true); }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Evento</span>
            </button>
          )}
        </div>
      </div>

      {activeSubTab === 'monthly' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Month Grid */}
          <div className={'lg:col-span-2 p-6 rounded-3xl border shadow-md space-y-4 ' + (darkMode ? 'bg-[#1a1b24] border-gray-800' : 'bg-white border-gray-200')}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-inherit">{capitalizedMonth}</h3>
              <div className="flex items-center gap-2">
                <button onClick={prevMonth} className="p-1.5 rounded-xl border border-gray-800 hover:bg-gray-800 text-gray-400 hover:text-white">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={() => setCurrentDate(new Date())} className="px-2.5 py-1 text-xs font-medium rounded-xl border border-gray-800 hover:bg-gray-800 text-gray-400">
                  Hoje
                </button>
                <button onClick={nextMonth} className="p-1.5 rounded-xl border border-gray-800 hover:bg-gray-800 text-gray-400 hover:text-white">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-400 pb-2 border-b border-inherit">
              <span>Dom</span><span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sáb</span>
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((dayStr, index) => {
                if (!dayStr) return <div key={'empty-' + index} className="h-20 rounded-2xl" />;

                const dayNum = parseInt(dayStr.split('-')[2]);
                const isSelected = selectedDay === dayStr;
                const isToday = new Date().toISOString().split('T')[0] === dayStr;
                const dayEvents = events.filter(e => e.date === dayStr);
                const dayTasks = tasks.filter(t => t.dueDate === dayStr);

                return (
                  <div
                    key={dayStr}
                    onClick={() => setSelectedDay(dayStr)}
                    className={'h-20 p-2 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ' + (
                      isSelected
                        ? 'bg-purple-600/15 border-purple-500 shadow-md ring-1 ring-purple-500'
                        : isToday
                        ? 'bg-indigo-950/20 border-indigo-500/50'
                        : 'bg-gray-900/30 border-gray-800/80 hover:border-gray-700'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className={'text-xs font-bold ' + (isToday ? 'px-1.5 py-0.2 rounded-full bg-purple-600 text-white' : 'text-gray-400')}>
                        {dayNum}
                      </span>
                    </div>

                    <div className="space-y-1 overflow-hidden">
                      {dayEvents.slice(0, 1).map(e => (
                        <div key={e.id} className="text-[9px] font-semibold px-1.5 py-0.2 rounded truncate bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {e.title}
                        </div>
                      ))}
                      {dayTasks.slice(0, 1).map(t => (
                        <div key={t.id} className="text-[9px] font-semibold px-1.5 py-0.2 rounded truncate bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          ✓ {t.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Day Detail Sidebar */}
          <div className={'p-6 rounded-3xl border shadow-md space-y-6 ' + (darkMode ? 'bg-[#1a1b24] border-gray-800' : 'bg-white border-gray-200')}>
            <div className="flex items-center justify-between pb-3 border-b border-inherit">
              <div>
                <h3 className="font-bold text-sm">Compromissos do Dia</h3>
                <span className="text-xs text-gray-400">{selectedDay}</span>
              </div>
              <button
                onClick={() => { setEventDate(selectedDay); setIsAddEventModalOpen(true); }}
                className="p-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-md"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Events on selected day */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase font-bold text-gray-400 tracking-wider">Eventos ({selectedDayEvents.length})</h4>
              {selectedDayEvents.length > 0 ? (
                selectedDayEvents.map(e => (
                  <div key={e.id} className="p-3 rounded-2xl bg-gray-900/50 border border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: e.color || '#8b5cf6' }} />
                      <div>
                        <p className="text-xs font-bold">{e.title}</p>
                        <span className="text-[10px] text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {e.time}</span>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteEvent(e.id)} className="p-1 text-gray-500 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500">Nenhum evento neste dia.</p>
              )}
            </div>

            {/* Tasks on selected day */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase font-bold text-gray-400 tracking-wider">Tarefas do Dia ({selectedDayTasks.length})</h4>
              {selectedDayTasks.length > 0 ? (
                selectedDayTasks.map(t => (
                  <div key={t.id} className="p-3 rounded-2xl bg-gray-900/50 border border-gray-800 flex items-center justify-between">
                    <p className={'text-xs font-medium ' + (t.status === 'done' ? 'line-through text-gray-500' : '')}>{t.title}</p>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-gray-800 text-gray-400 uppercase font-bold">{t.priority}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500">Nenhuma tarefa com prazo para hoje.</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Weekly Routine Planner */
        <div className={'p-6 rounded-3xl border shadow-md space-y-6 ' + (darkMode ? 'bg-[#1a1b24] border-gray-800' : 'bg-white border-gray-200')}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base">Planejador de Rotina Semanal</h3>
              <p className="text-xs text-gray-400">Atividades fixas e blocos de tempo para cada dia da semana.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {(weeklySchedule || []).map((item, idx) => (
              <div key={item.day} className="p-4 rounded-2xl bg-gray-900/40 border border-gray-800 space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                  <h4 className="font-bold text-sm text-purple-400">{item.day}</h4>
                </div>

                <div className="space-y-2 text-xs flex-1">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-gray-500">🌅 Manhã</label>
                    <input
                      type="text"
                      value={item.morning || ''}
                      onChange={(e) => handleUpdateWeeklyDay(idx, 'morning', e.target.value)}
                      className="w-full mt-1 p-2 rounded-xl bg-gray-900/60 border border-gray-800 text-xs text-inherit outline-none focus:border-purple-500"
                      placeholder="Atividades da manhã..."
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-gray-500">💻 Tarde</label>
                    <input
                      type="text"
                      value={item.afternoon || ''}
                      onChange={(e) => handleUpdateWeeklyDay(idx, 'afternoon', e.target.value)}
                      className="w-full mt-1 p-2 rounded-xl bg-gray-900/60 border border-gray-800 text-xs text-inherit outline-none focus:border-purple-500"
                      placeholder="Atividades da tarde..."
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-gray-500">🌙 Noite</label>
                    <input
                      type="text"
                      value={item.evening || ''}
                      onChange={(e) => handleUpdateWeeklyDay(idx, 'evening', e.target.value)}
                      className="w-full mt-1 p-2 rounded-xl bg-gray-900/60 border border-gray-800 text-xs text-inherit outline-none focus:border-purple-500"
                      placeholder="Atividades da noite..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {isAddEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={'w-full max-w-md rounded-3xl border p-6 shadow-2xl space-y-4 ' + (darkMode ? 'bg-[#1a1b24] border-gray-800 text-gray-100' : 'bg-white border-gray-200 text-gray-800')}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base">Novo Evento</h3>
              <button onClick={() => setIsAddEventModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleAddEvent} className="space-y-3">
              <input type="text" placeholder="Nome do Evento" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} required className="w-full p-2.5 rounded-xl bg-gray-900/50 border border-gray-800 text-xs outline-none focus:border-purple-500 text-inherit" />
              <div className="grid grid-cols-2 gap-2">
                <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required className="w-full p-2.5 rounded-xl bg-gray-900/50 border border-gray-800 text-xs outline-none focus:border-purple-500 text-inherit" />
                <input type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} required className="w-full p-2.5 rounded-xl bg-gray-900/50 border border-gray-800 text-xs outline-none focus:border-purple-500 text-inherit" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select value={eventCategory} onChange={(e) => setEventCategory(e.target.value)} className="w-full p-2.5 rounded-xl bg-gray-900/50 border border-gray-800 text-xs outline-none focus:border-purple-500 text-inherit">
                  <option value="work" className="bg-gray-900">Trabalho</option>
                  <option value="study" className="bg-gray-900">Estudos</option>
                  <option value="health" className="bg-gray-900">Saúde</option>
                  <option value="personal" className="bg-gray-900">Pessoal</option>
                </select>
                <input type="color" value={eventColor} onChange={(e) => setEventColor(e.target.value)} className="w-full h-9 rounded-xl bg-gray-900/50 border border-gray-800 cursor-pointer" />
              </div>
              <button type="submit" className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-lg transition-transform active:scale-95">Salvar Evento</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
