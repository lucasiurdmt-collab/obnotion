import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  Plus,
  Trash2,
  Star,
  CheckCircle2,
  Clock,
  Bookmark,
  Calendar,
  Sparkles,
  X,
  Search,
  BookMarked
} from 'lucide-react';

export default function BooksView({ data, onUpdateBooks, onUpdateGoal, darkMode }) {
  const currentMonthDefault = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState(currentMonthDefault);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'reading' | 'completed' | 'wishlist' | 'month'
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [totalPages, setTotalPages] = useState('');
  const [currentPage, setCurrentPage] = useState('');
  const [status, setStatus] = useState('reading');
  const [rating, setRating] = useState(5);
  const [genre, setGenre] = useState('Desenvolvimento Pessoal');
  const [cover, setCover] = useState('');
  const [review, setReview] = useState('');

  const books = data.books || [];
  const yearlyGoal = data.readingGoalYear || 18;

  // Completed books this year
  const completedBooksYear = books.filter(b => b.status === 'completed');
  const completedPercent = Math.min(100, Math.round((completedBooksYear.length / yearlyGoal) * 100));

  // Books read in selected month
  const booksReadInMonth = books.filter(b => b.status === 'completed' && (b.monthRead === selectedMonth || b.finishDate?.startsWith(selectedMonth)));

  const filteredBooks = books.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.genre?.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (statusFilter === 'month') {
      return b.status === 'completed' && (b.monthRead === selectedMonth || b.finishDate?.startsWith(selectedMonth));
    }
    if (statusFilter !== 'all') {
      return b.status === statusFilter;
    }
    return true;
  });

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleSaveBook = (e) => {
    e.preventDefault();
    const isCompleted = status === 'completed' || parseInt(currentPage || '0') >= parseInt(totalPages || '1');
    const todayStr = new Date().toISOString().split('T')[0];
    const monthStr = todayStr.slice(0, 7);

    if (isCompleted && (!editingBook || editingBook.status !== 'completed')) {
      triggerCelebration();
    }

    const bookObj = {
      id: editingBook ? editingBook.id : 'book-' + Date.now(),
      title,
      author,
      totalPages: parseInt(totalPages || '100'),
      currentPage: isCompleted ? parseInt(totalPages || '100') : parseInt(currentPage || '0'),
      status: isCompleted ? 'completed' : status,
      rating: parseInt(rating),
      genre,
      cover: cover || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      review,
      startDate: editingBook ? editingBook.startDate : todayStr,
      finishDate: isCompleted ? todayStr : '',
      monthRead: isCompleted ? monthStr : ''
    };

    if (editingBook) {
      onUpdateBooks(books.map(b => b.id === editingBook.id ? bookObj : b));
    } else {
      onUpdateBooks([bookObj, ...books]);
    }

    setIsAddModalOpen(false);
    setEditingBook(null);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setAuthor('');
    setTotalPages('');
    setCurrentPage('');
    setStatus('reading');
    setRating(5);
    setGenre('Desenvolvimento Pessoal');
    setCover('');
    setReview('');
  };

  const openEdit = (b) => {
    setEditingBook(b);
    setTitle(b.title);
    setAuthor(b.author);
    setTotalPages(b.totalPages.toString());
    setCurrentPage(b.currentPage.toString());
    setStatus(b.status);
    setRating(b.rating);
    setGenre(b.genre || 'Geral');
    setCover(b.cover || '');
    setReview(b.review || '');
    setIsAddModalOpen(true);
  };

  const handleQuickPageAdd = (bookId, pagesToAdd) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const monthStr = todayStr.slice(0, 7);

    onUpdateBooks(books.map(b => {
      if (b.id === bookId) {
        const newPage = Math.min(b.totalPages, b.currentPage + pagesToAdd);
        const justFinished = newPage >= b.totalPages && b.status !== 'completed';
        if (justFinished) triggerCelebration();

        return {
          ...b,
          currentPage: newPage,
          status: newPage >= b.totalPages ? 'completed' : b.status,
          finishDate: newPage >= b.totalPages ? todayStr : b.finishDate,
          monthRead: newPage >= b.totalPages ? monthStr : b.monthRead
        };
      }
      return b;
    }));
  };

  const handleDeleteBook = (id) => {
    if (confirm('Tem certeza que deseja remover este livro da sua biblioteca?')) {
      onUpdateBooks(books.filter(b => b.id !== id));
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto">
      {/* Top Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Biblioteca & Leituras</h1>
          <p className="text-xs md:text-sm text-gray-400 mt-1">
            Rastreie seus livros, páginas lidas, metas do mês e notas de leitura.
          </p>
        </div>

        <button
          onClick={() => { resetForm(); setEditingBook(null); setIsAddModalOpen(true); }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all active:scale-95 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar Livro</span>
        </button>
      </div>

      {/* Featured Goal & Month Banners */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Month Highlight Card */}
        <div className={'p-6 rounded-3xl border shadow-md flex flex-col justify-between ' + (
          darkMode ? 'bg-gradient-to-br from-purple-950/40 via-[#1a1b24] to-gray-900 border-purple-900/30' : 'bg-gradient-to-br from-purple-50 to-white border-purple-200'
        )}>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Livros Lidos no Mês</span>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-transparent border-b border-gray-700 text-xs font-semibold outline-none cursor-pointer text-inherit"
              />
            </div>
            <div className="flex items-baseline gap-2 mt-4">
              <span className="text-4xl font-extrabold text-purple-400">{booksReadInMonth.length}</span>
              <span className="text-sm text-gray-400 font-medium">livros concluídos</span>
            </div>
          </div>
          <button
            onClick={() => setStatusFilter('month')}
            className="text-xs font-semibold text-purple-400 hover:underline mt-4 text-left flex items-center gap-1"
          >
            Filtrar leituras de {selectedMonth} →
          </button>
        </div>

        {/* Yearly Reading Goal Progress */}
        <div className={'md:col-span-2 p-6 rounded-3xl border shadow-md space-y-4 ' + (
          darkMode ? 'bg-[#1a1b24] border-gray-800' : 'bg-white border-gray-200'
        )}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Meta de Leitura Anual ({new Date().getFullYear()})
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {completedBooksYear.length} de {yearlyGoal} livros lidos ({completedPercent}% concluído)
              </p>
            </div>
            <button
              onClick={() => {
                const newG = prompt('Qual é sua meta de livros para este ano?', yearlyGoal);
                if (newG && !isNaN(parseInt(newG))) onUpdateGoal(parseInt(newG));
              }}
              className="text-xs text-gray-400 hover:text-purple-400 border border-gray-800 hover:border-purple-500 px-2.5 py-1 rounded-xl"
            >
              Editar Meta
            </button>
          </div>

          <div className="w-full bg-gray-800 h-3.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-600 to-indigo-500 h-full rounded-full transition-all duration-500 shadow-lg shadow-purple-500/30"
              style={{ width: completedPercent + '%' }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>🎉 {completedBooksYear.length} livros finalizados</span>
            <span>Faltam {Math.max(0, yearlyGoal - completedBooksYear.length)} livros</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setStatusFilter('all')}
            className={'px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap ' + (statusFilter === 'all' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-800')}
          >
            Todos ({books.length})
          </button>
          <button
            onClick={() => setStatusFilter('reading')}
            className={'px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap ' + (statusFilter === 'reading' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-800')}
          >
            Lendo Agora ({books.filter(b => b.status === 'reading').length})
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={'px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap ' + (statusFilter === 'completed' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:bg-gray-800')}
          >
            Concluídos ({completedBooksYear.length})
          </button>
          <button
            onClick={() => setStatusFilter('wishlist')}
            className={'px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap ' + (statusFilter === 'wishlist' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-800')}
          >
            Quero Ler ({books.filter(b => b.status === 'wishlist').length})
          </button>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por título ou autor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 rounded-xl text-xs bg-gray-900/40 border border-gray-800 outline-none focus:border-purple-500 text-inherit w-full sm:w-60"
          />
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map(book => {
          const progressPercent = Math.min(100, Math.round((book.currentPage / book.totalPages) * 100));
          return (
            <div
              key={book.id}
              className={'rounded-3xl border overflow-hidden shadow-lg flex flex-col justify-between group transition-all duration-200 hover:-translate-y-1 ' + (
                darkMode ? 'bg-[#1a1b24] border-gray-800 hover:border-purple-500/40' : 'bg-white border-gray-200 hover:border-purple-500'
              )}
            >
              {/* Cover Banner */}
              <div className="h-44 w-full relative overflow-hidden bg-gray-900">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1b24] via-transparent to-transparent" />
                <span className={'absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md ' + (
                  book.status === 'completed'
                    ? 'bg-emerald-500/80 text-white'
                    : book.status === 'reading'
                    ? 'bg-purple-600/80 text-white'
                    : 'bg-gray-800/80 text-gray-300'
                )}>
                  {book.status === 'completed' ? 'Concluído' : book.status === 'reading' ? 'Lendo' : 'Quero Ler'}
                </span>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="font-bold text-sm leading-snug line-clamp-1">{book.title}</h4>
                  <p className="text-xs text-gray-400 mt-0.5">{book.author}</p>
                  <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded bg-gray-800 text-gray-400">
                    {book.genre || 'Livro'}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className={'w-3.5 h-3.5 ' + (star <= (book.rating || 0) ? 'fill-amber-400' : 'text-gray-700')}
                    />
                  ))}
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-gray-400">
                    <span>{book.currentPage} / {book.totalPages} pág</span>
                    <span className="font-bold font-mono text-purple-400">{progressPercent}%</span>
                  </div>
                  <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-500 h-full rounded-full transition-all duration-300"
                      style={{ width: progressPercent + '%' }}
                    />
                  </div>
                </div>

                {/* Review snippet */}
                {book.review && (
                  <p className="text-xs text-gray-400 italic line-clamp-2 bg-gray-900/40 p-2 rounded-xl">
                    "{book.review}"
                  </p>
                )}

                {/* Quick actions buttons */}
                <div className="pt-2 border-t border-inherit flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {book.status !== 'completed' && (
                      <>
                        <button
                          onClick={() => handleQuickPageAdd(book.id, 10)}
                          className="px-2 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-[10px] font-semibold"
                        >
                          +10p
                        </button>
                        <button
                          onClick={() => handleQuickPageAdd(book.id, 25)}
                          className="px-2 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-[10px] font-semibold"
                        >
                          +25p
                        </button>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEdit(book)}
                      className="px-2 py-1 rounded-lg text-xs text-gray-400 hover:text-gray-100 hover:bg-gray-800"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteBook(book.id)}
                      className="p-1 rounded-lg text-gray-500 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Book Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={'w-full max-w-lg rounded-3xl border p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto ' + (
            darkMode ? 'bg-[#1a1b24] border-gray-800 text-gray-100' : 'bg-white border-gray-200 text-gray-800'
          )}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base">{editingBook ? 'Editar Livro' : 'Adicionar Novo Livro'}</h3>
              <button onClick={() => setIsAddModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleSaveBook} className="space-y-3">
              <input type="text" placeholder="Título do Livro" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full p-2.5 rounded-xl bg-gray-900/50 border border-gray-800 text-xs outline-none focus:border-purple-500 text-inherit" />
              <input type="text" placeholder="Autor" value={author} onChange={(e) => setAuthor(e.target.value)} required className="w-full p-2.5 rounded-xl bg-gray-900/50 border border-gray-800 text-xs outline-none focus:border-purple-500 text-inherit" />
              <div className="grid grid-cols-2 gap-2">
                <input type="number" placeholder="Total de Páginas" value={totalPages} onChange={(e) => setTotalPages(e.target.value)} required className="w-full p-2.5 rounded-xl bg-gray-900/50 border border-gray-800 text-xs outline-none focus:border-purple-500 text-inherit" />
                <input type="number" placeholder="Página Atual" value={currentPage} onChange={(e) => setCurrentPage(e.target.value)} className="w-full p-2.5 rounded-xl bg-gray-900/50 border border-gray-800 text-xs outline-none focus:border-purple-500 text-inherit" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full p-2.5 rounded-xl bg-gray-900/50 border border-gray-800 text-xs outline-none focus:border-purple-500 text-inherit">
                  <option value="reading" className="bg-gray-900">Lendo Agora</option>
                  <option value="completed" className="bg-gray-900">Concluído</option>
                  <option value="wishlist" className="bg-gray-900">Quero Ler</option>
                </select>
                <select value={rating} onChange={(e) => setRating(e.target.value)} className="w-full p-2.5 rounded-xl bg-gray-900/50 border border-gray-800 text-xs outline-none focus:border-purple-500 text-inherit">
                  <option value="5" className="bg-gray-900">⭐⭐⭐⭐⭐ (5 estrelas)</option>
                  <option value="4" className="bg-gray-900">⭐⭐⭐⭐ (4 estrelas)</option>
                  <option value="3" className="bg-gray-900">⭐⭐⭐ (3 estrelas)</option>
                  <option value="2" className="bg-gray-900">⭐⭐ (2 estrelas)</option>
                  <option value="1" className="bg-gray-900">⭐ (1 estrela)</option>
                </select>
              </div>
              <input type="text" placeholder="Gênero (ex: Ficção, Produtividade, Finanças)" value={genre} onChange={(e) => setGenre(e.target.value)} className="w-full p-2.5 rounded-xl bg-gray-900/50 border border-gray-800 text-xs outline-none focus:border-purple-500 text-inherit" />
              <input type="text" placeholder="URL da Capa (opcional)" value={cover} onChange={(e) => setCover(e.target.value)} className="w-full p-2.5 rounded-xl bg-gray-900/50 border border-gray-800 text-xs outline-none focus:border-purple-500 text-inherit" />
              <textarea placeholder="Resenha, citações e notas do livro..." value={review} onChange={(e) => setReview(e.target.value)} className="w-full h-24 p-2.5 rounded-xl bg-gray-900/50 border border-gray-800 text-xs outline-none focus:border-purple-500 text-inherit resize-none" />
              <button type="submit" className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-lg transition-transform active:scale-95">Salvar Livro</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
