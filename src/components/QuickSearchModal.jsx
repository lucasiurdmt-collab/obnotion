import React, { useState, useEffect, useRef } from 'react';
import { Search, FileText, BookOpen, CheckSquare, DollarSign, Calendar, X, ArrowRight } from 'lucide-react';

export default function QuickSearchModal({
  isOpen,
  onClose,
  data,
  onNavigate,
  onSelectNote,
  darkMode
}) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onNavigate(null, 'open-search');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNavigate]);

  if (!isOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  // Filter notes
  const filteredNotes = cleanQuery
    ? data.notes.filter(
        n =>
          n.title.toLowerCase().includes(cleanQuery) ||
          n.content.toLowerCase().includes(cleanQuery) ||
          n.tags?.some(t => t.toLowerCase().includes(cleanQuery))
      )
    : data.notes.slice(0, 3);

  // Filter tasks
  const filteredTasks = cleanQuery
    ? data.tasks.filter(
        t =>
          t.title.toLowerCase().includes(cleanQuery) ||
          t.tags?.some(tag => tag.toLowerCase().includes(cleanQuery))
      )
    : data.tasks.slice(0, 2);

  // Filter books
  const filteredBooks = cleanQuery
    ? data.books.filter(
        b =>
          b.title.toLowerCase().includes(cleanQuery) ||
          b.author.toLowerCase().includes(cleanQuery)
      )
    : data.books.slice(0, 2);

  // Filter transactions
  const filteredTransactions = cleanQuery
    ? data.transactions.filter(
        tx =>
          tx.description.toLowerCase().includes(cleanQuery) ||
          tx.category.toLowerCase().includes(cleanQuery)
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className={`w-full max-w-2xl rounded-2xl shadow-2xl border overflow-hidden ${
          darkMode
            ? 'bg-[#1a1b24] border-gray-800 text-gray-100'
            : 'bg-white border-gray-200 text-gray-800'
        }`}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-inherit flex items-center gap-3">
          <Search className="w-5 h-5 text-purple-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar notas, tarefas, livros, finanças ou comandos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-base placeholder-gray-500 font-medium"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800/40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {/* Notes Section */}
          {filteredNotes.length > 0 && (
            <div>
              <h3 className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-2 px-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-purple-400" /> Notas
              </h3>
              <div className="space-y-1">
                {filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => {
                      onSelectNote(note.id);
                      onNavigate('notes');
                      onClose();
                    }}
                    className="p-2.5 rounded-xl hover:bg-purple-600/15 cursor-pointer flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{note.icon || '📝'}</span>
                      <div>
                        <p className="font-semibold text-sm group-hover:text-purple-400 transition-colors">
                          {note.title}
                        </p>
                        <p className="text-xs text-gray-400 line-clamp-1">
                          {note.content.slice(0, 70)}...
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tasks Section */}
          {filteredTasks.length > 0 && (
            <div>
              <h3 className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-2 px-2 flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-amber-400" /> Tarefas
              </h3>
              <div className="space-y-1">
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => {
                      onNavigate('tasks');
                      onClose();
                    }}
                    className="p-2.5 rounded-xl hover:bg-amber-600/15 cursor-pointer flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${task.status === 'done' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                      <p className="font-medium text-sm group-hover:text-amber-400 transition-colors">
                        {task.title}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">{task.dueDate}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Books Section */}
          {filteredBooks.length > 0 && (
            <div>
              <h3 className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-2 px-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> Livros
              </h3>
              <div className="space-y-1">
                {filteredBooks.map((book) => (
                  <div
                    key={book.id}
                    onClick={() => {
                      onNavigate('books');
                      onClose();
                    }}
                    className="p-2.5 rounded-xl hover:bg-emerald-600/15 cursor-pointer flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">📖</span>
                      <div>
                        <p className="font-semibold text-sm group-hover:text-emerald-400 transition-colors">
                          {book.title}
                        </p>
                        <p className="text-xs text-gray-400">{book.author} • {book.status === 'completed' ? 'Concluído' : `${book.currentPage}/${book.totalPages} pág`}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transactions Section */}
          {filteredTransactions.length > 0 && (
            <div>
              <h3 className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-2 px-2 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Finanças
              </h3>
              <div className="space-y-1">
                {filteredTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    onClick={() => {
                      onNavigate('finance');
                      onClose();
                    }}
                    className="p-2.5 rounded-xl hover:bg-emerald-600/15 cursor-pointer flex items-center justify-between group transition-colors"
                  >
                    <p className="text-sm font-medium">{tx.description}</p>
                    <span className={`text-xs font-semibold ${tx.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {tx.type === 'income' ? '+' : '-'} R$ {tx.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredNotes.length === 0 && filteredTasks.length === 0 && filteredBooks.length === 0 && (
            <div className="text-center py-10 text-gray-400">
              <p className="text-sm font-medium">Nenhum resultado encontrado para "{query}"</p>
              <p className="text-xs text-gray-500 mt-1">Tente buscar por outro termo ou navegue pelo menu lateral.</p>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 bg-gray-900/40 border-t border-inherit flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-3">
            <span>Pressione <kbd className="px-1.5 py-0.5 rounded bg-gray-800 text-gray-300 font-mono text-[10px]">Esc</kbd> para fechar</span>
          </div>
          <span className="text-[11px] text-purple-400 font-medium">Obnotion Spotlight</span>
        </div>
      </div>
    </div>
  );
}