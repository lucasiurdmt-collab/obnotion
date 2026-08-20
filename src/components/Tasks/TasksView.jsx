import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Trash2,
  Calendar,
  Tag,
  Search,
  Filter,
  ArrowRight,
  ArrowLeft,
  X,
  LayoutGrid,
  List,
  AlertCircle
} from 'lucide-react';

export default function TasksView({ tasks, onUpdateTasks, darkMode }) {
  const [viewType, setViewType] = useState('kanban'); // 'kanban' | 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [tagInput, setTagInput] = useState('Geral');
  const [notes, setNotes] = useState('');

  const COLUMNS = [
    { id: 'todo', title: '📋 A Fazer', color: 'border-blue-500/40 text-blue-400' },
    { id: 'in_progress', title: '⚡ Em Andamento', color: 'border-amber-500/40 text-amber-400' },
    { id: 'done', title: '✅ Concluído', color: 'border-emerald-500/40 text-emerald-400' }
  ];

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.notes?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = selectedPriority === 'ALL' || t.priority === selectedPriority;
    return matchesSearch && matchesPriority;
  });

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!title) return;

    const newTask = {
      id: 'task-' + Date.now(),
      title,
      status: 'todo',
      priority,
      dueDate,
      tags: tagInput.split(',').map(t => t.trim()).filter(Boolean),
      notes
    };

    onUpdateTasks([newTask, ...tasks]);
    setIsAddModalOpen(false);
    setTitle('');
    setNotes('');
  };

  const handleMoveStatus = (taskId, newStatus) => {
    onUpdateTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const handleDeleteTask = (taskId) => {
    onUpdateTasks(tasks.filter(t => t.id !== taskId));
  };

  const getPriorityBadge = (p) => {
    switch (p) {
      case 'high': return 'bg-red-500/20 text-red-400 border border-red-500/30';
      case 'medium': return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
      default: return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto">
      {/* Top Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Tarefas & Produtividade</h1>
          <p className="text-xs md:text-sm text-gray-400 mt-1">
            Organize seu fluxo de trabalho no quadro Kanban ou visualização em lista.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 rounded-xl bg-gray-900/50 border border-gray-800 text-xs">
            <button
              onClick={() => setViewType('kanban')}
              className={'px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 ' + (viewType === 'kanban' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400')}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewType('list')}
              className={'px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 ' + (viewType === 'list' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400')}
            >
              <List className="w-3.5 h-3.5" />
              <span>Lista</span>
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Tarefa</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedPriority('ALL')}
            className={'px-3 py-1.5 rounded-xl text-xs font-semibold ' + (selectedPriority === 'ALL' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-800')}
          >
            Todas ({tasks.length})
          </button>
          <button
            onClick={() => setSelectedPriority('high')}
            className={'px-3 py-1.5 rounded-xl text-xs font-semibold ' + (selectedPriority === 'high' ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-gray-800')}
          >
            Alta Prioridade
          </button>
          <button
            onClick={() => setSelectedPriority('medium')}
            className={'px-3 py-1.5 rounded-xl text-xs font-semibold ' + (selectedPriority === 'medium' ? 'bg-amber-600 text-white' : 'text-gray-400 hover:bg-gray-800')}
          >
            Média
          </button>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Filtrar tarefas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 rounded-xl text-xs bg-gray-900/40 border border-gray-800 outline-none focus:border-purple-500 text-inherit w-full sm:w-60"
          />
        </div>
      </div>

      {/* Kanban Board View */}
      {viewType === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLUMNS.map(col => {
            const colTasks = filteredTasks.filter(t => t.status === col.id);
            return (
              <div
                key={col.id}
                className={'p-5 rounded-3xl border shadow-md flex flex-col space-y-4 min-h-[500px] ' + (
                  darkMode ? 'bg-[#1a1b24] border-gray-800' : 'bg-white border-gray-200'
                )}
              >
                <div className="flex items-center justify-between pb-2 border-b border-inherit">
                  <h3 className="font-bold text-sm text-inherit">{col.title}</h3>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-gray-800 text-gray-400">
                    {colTasks.length}
                  </span>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto">
                  {colTasks.map(task => (
                    <div
                      key={task.id}
                      className={'p-4 rounded-2xl border shadow-sm space-y-3 group transition-all duration-150 ' + (
                        darkMode ? 'bg-gray-900/60 border-gray-800 hover:border-purple-500/40' : 'bg-gray-50 border-gray-200 hover:border-purple-500'
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={'font-bold text-xs leading-snug ' + (task.status === 'done' ? 'line-through text-gray-500' : 'text-inherit')}>
                          {task.title}
                        </h4>
                        <span className={'text-[9px] font-bold px-2 py-0.5 rounded uppercase flex-shrink-0 ' + getPriorityBadge(task.priority)}>
                          {task.priority}
                        </span>
                      </div>

                      {task.notes && (
                        <p className="text-[11px] text-gray-400 line-clamp-2">
                          {task.notes}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-[10px] text-gray-400 pt-2 border-t border-inherit">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-purple-400" />
                          {task.dueDate}
                        </span>

                        <div className="flex items-center gap-1">
                          {col.id !== 'todo' && (
                            <button
                              onClick={() => handleMoveStatus(task.id, col.id === 'done' ? 'in_progress' : 'todo')}
                              className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-gray-200"
                              title="Voltar status"
                            >
                              <ArrowLeft className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {col.id !== 'done' && (
                            <button
                              onClick={() => handleMoveStatus(task.id, col.id === 'todo' ? 'in_progress' : 'done')}
                              className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-gray-200"
                              title="Avançar status"
                            >
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-1 rounded hover:bg-red-500/20 text-gray-500 hover:text-red-400"
                            title="Excluir"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {colTasks.length === 0 && (
                    <div className="p-8 text-center border-2 border-dashed border-gray-800 rounded-2xl text-xs text-gray-500">
                      Nenhuma tarefa nesta coluna
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className={'p-6 rounded-3xl border shadow-md space-y-3 ' + (darkMode ? 'bg-[#1a1b24] border-gray-800' : 'bg-white border-gray-200')}>
          {filteredTasks.map(task => (
            <div
              key={task.id}
              className="p-3.5 rounded-2xl bg-gray-900/40 border border-gray-800 flex items-center justify-between transition-colors hover:border-purple-500/40"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.status === 'done'}
                  onChange={() => handleMoveStatus(task.id, task.status === 'done' ? 'todo' : 'done')}
                  className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                />
                <div>
                  <h4 className={'font-bold text-xs ' + (task.status === 'done' ? 'line-through text-gray-500' : 'text-inherit')}>
                    {task.title}
                  </h4>
                  <span className="text-[10px] text-gray-400">{task.dueDate} • {task.tags?.join(', ')}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={'text-[9px] font-bold px-2 py-0.5 rounded uppercase ' + getPriorityBadge(task.priority)}>
                  {task.priority}
                </span>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="p-1 text-gray-500 hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={'w-full max-w-md rounded-3xl border p-6 shadow-2xl space-y-4 ' + (darkMode ? 'bg-[#1a1b24] border-gray-800 text-gray-100' : 'bg-white border-gray-200 text-gray-800')}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base">Criar Nova Tarefa</h3>
              <button onClick={() => setIsAddModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleAddTask} className="space-y-3">
              <input type="text" placeholder="Título da tarefa..." value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full p-2.5 rounded-xl bg-gray-900/50 border border-gray-800 text-xs outline-none focus:border-purple-500 text-inherit" />
              <div className="grid grid-cols-2 gap-2">
                <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full p-2.5 rounded-xl bg-gray-900/50 border border-gray-800 text-xs outline-none focus:border-purple-500 text-inherit">
                  <option value="high" className="bg-gray-900">Alta Prioridade</option>
                  <option value="medium" className="bg-gray-900">Média Prioridade</option>
                  <option value="low" className="bg-gray-900">Baixa Prioridade</option>
                </select>
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required className="w-full p-2.5 rounded-xl bg-gray-900/50 border border-gray-800 text-xs outline-none focus:border-purple-500 text-inherit" />
              </div>
              <input type="text" placeholder="Tags (separadas por vírgula)" value={tagInput} onChange={(e) => setTagInput(e.target.value)} className="w-full p-2.5 rounded-xl bg-gray-900/50 border border-gray-800 text-xs outline-none focus:border-purple-500 text-inherit" />
              <textarea placeholder="Notas ou detalhes da tarefa..." value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full h-20 p-2.5 rounded-xl bg-gray-900/50 border border-gray-800 text-xs outline-none focus:border-purple-500 text-inherit resize-none" />
              <button type="submit" className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-lg transition-transform active:scale-95">Salvar Tarefa</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
