import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Trash2,
  Filter,
  Search,
  PieChart,
  Calendar,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  X,
  CreditCard,
  Wallet
} from 'lucide-react';

export default function FinanceView({ data, onUpdateTransactions, onUpdateGoals, darkMode }) {
  const currentMonthDefault = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState(currentMonthDefault);
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'income' | 'expense'
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  // Form states
  const [newDesc, setNewDesc] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newType, setNewType] = useState('expense');
  const [newCategory, setNewCategory] = useState('Alimentação');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newNotes, setNewNotes] = useState('');

  // Goal form states
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalCurrent, setGoalCurrent] = useState('');
  const [goalDeadline, setGoalDeadline] = useState('');

  const categories = [
    'Moradia', 'Alimentação', 'Transporte', 'Lazer', 'Saúde',
    'Educação', 'Investimentos', 'Salário', 'Freelance', 'Outros'
  ];

  // Calculations
  const monthTransactions = data.transactions.filter(t => t.date.startsWith(selectedMonth));
  const incomeTotal = monthTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const expenseTotal = monthTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const balance = incomeTotal - expenseTotal;
  const savingsRate = incomeTotal > 0 ? Math.round((balance / incomeTotal) * 100) : 0;

  // Expenses by category
  const expenseByCategory = {};
  monthTransactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
    });

  const categoryEntries = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1]);

  // Filtered transactions for table
  const filteredTransactions = data.transactions.filter(t => {
    const matchesMonth = t.date.startsWith(selectedMonth);
    const matchesType = typeFilter === 'all' || t.type === typeFilter;
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMonth && matchesType && matchesSearch;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!newDesc || !newAmount) return;

    const newTx = {
      id: 'tx-' + Date.now(),
      description: newDesc,
      amount: parseFloat(newAmount),
      type: newType,
      category: newCategory,
      date: newDate,
      status: 'paid',
      notes: newNotes
    };

    onUpdateTransactions([newTx, ...data.transactions]);
    setIsAddModalOpen(false);
    setNewDesc('');
    setNewAmount('');
    setNewNotes('');
  };

  const handleDeleteTransaction = (id) => {
    onUpdateTransactions(data.transactions.filter(t => t.id !== id));
  };

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!goalTitle || !goalTarget) return;

    const newGoal = {
      id: 'fg-' + Date.now(),
      title: goalTitle,
      targetAmount: parseFloat(goalTarget),
      currentAmount: parseFloat(goalCurrent || '0'),
      deadline: goalDeadline
    };

    onUpdateGoals([...(data.financeGoals || []), newGoal]);
    setIsGoalModalOpen(false);
    setGoalTitle('');
    setGoalTarget('');
    setGoalCurrent('');
  };

  const handleUpdateGoalProgress = (goalId, delta) => {
    onUpdateGoals((data.financeGoals || []).map(g => {
      if (g.id === goalId) {
        return { ...g, currentAmount: Math.max(0, g.currentAmount + delta) };
      }
      return g;
    }));
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto">
      {/* Top Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Finanças Pessoais</h1>
          <p className="text-xs md:text-sm text-gray-400 mt-1">Acompanhe receitas, despesas, saldo e metas financeiras.</p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className={'px-3 py-2 rounded-xl text-xs font-semibold border outline-none cursor-pointer ' + (
              darkMode ? 'bg-[#1a1b24] border-gray-800 text-gray-200' : 'bg-white border-gray-200 text-gray-800'
            )}
          />
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Transação</span>
          </button>
        </div>
      </div>

      {/* 4 Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className={'p-5 rounded-2xl border shadow-md ' + (darkMode ? 'bg-[#1a1b24] border-gray-800' : 'bg-white border-gray-200')}>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Receitas</span>
          <div className="flex items-center justify-between mt-2">
            <h3 className="text-2xl font-bold text-emerald-400">R$ {incomeTotal.toFixed(2)}</h3>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400"><ArrowUpRight className="w-5 h-5" /></div>
          </div>
        </div>

        <div className={'p-5 rounded-2xl border shadow-md ' + (darkMode ? 'bg-[#1a1b24] border-gray-800' : 'bg-white border-gray-200')}>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Despesas</span>
          <div className="flex items-center justify-between mt-2">
            <h3 className="text-2xl font-bold text-red-400">R$ {expenseTotal.toFixed(2)}</h3>
            <div className="p-2 rounded-xl bg-red-500/10 text-red-400"><ArrowDownRight className="w-5 h-5" /></div>
          </div>
        </div>

        <div className={'p-5 rounded-2xl border shadow-md ' + (darkMode ? 'bg-[#1a1b24] border-gray-800' : 'bg-white border-gray-200')}>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Saldo Líquido</span>
          <div className="flex items-center justify-between mt-2">
            <h3 className={'text-2xl font-bold ' + (balance >= 0 ? 'text-emerald-400' : 'text-red-400')}>
              R$ {balance.toFixed(2)}
            </h3>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400"><Wallet className="w-5 h-5" /></div>
          </div>
        </div>

        <div className={'p-5 rounded-2xl border shadow-md ' + (darkMode ? 'bg-[#1a1b24] border-gray-800' : 'bg-white border-gray-200')}>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Taxa de Poupança</span>
          <div className="flex items-center justify-between mt-2">
            <h3 className="text-2xl font-bold text-purple-400">{savingsRate > 0 ? savingsRate : 0}%</h3>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400"><TrendingUp className="w-5 h-5" /></div>
          </div>
        </div>
      </div>

      {/* Visual Expenses Category Breakdown & Financial Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown */}
        <div className={'p-6 rounded-3xl border shadow-md space-y-4 ' + (darkMode ? 'bg-[#1a1b24] border-gray-800' : 'bg-white border-gray-200')}>
          <h3 className="text-base font-bold flex items-center gap-2">
            <PieChart className="w-4 h-4 text-purple-400" />
            Despesas por Categoria
          </h3>
          {categoryEntries.length > 0 ? (
            <div className="space-y-3">
              {categoryEntries.map(([cat, amount]) => {
                const percent = expenseTotal > 0 ? Math.round((amount / expenseTotal) * 100) : 0;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold">{cat}</span>
                      <span className="text-gray-400">R$ {amount.toFixed(2)} ({percent}%)</span>
                    </div>
                    <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full rounded-full transition-all duration-300" style={{ width: percent + '%' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-gray-400 py-6 text-center">Nenhuma despesa registrada neste mês.</p>
          )}
        </div>

        {/* Financial Goals */}
        <div className={'lg:col-span-2 p-6 rounded-3xl border shadow-md space-y-4 ' + (darkMode ? 'bg-[#1a1b24] border-gray-800' : 'bg-white border-gray-200')}>
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" />
              Metas de Economia & Sonhos
            </h3>
            <button
              onClick={() => setIsGoalModalOpen(true)}
              className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Nova Meta
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(data.financeGoals || []).map(goal => {
              const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
              return (
                <div key={goal.id} className="p-4 rounded-2xl bg-gray-900/40 border border-gray-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs truncate">{goal.title}</h4>
                    <span className="text-xs font-mono font-bold text-emerald-400">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-300" style={{ width: progress + '%' }} />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-gray-400">
                    <span>R$ {goal.currentAmount.toFixed(0)} de R$ {goal.targetAmount.toFixed(0)}</span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleUpdateGoalProgress(goal.id, 100)} className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30">+100</button>
                      <button onClick={() => handleUpdateGoalProgress(goal.id, 500)} className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30">+500</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Transactions Table & Filters */}
      <div className={'p-6 rounded-3xl border shadow-md space-y-4 ' + (darkMode ? 'bg-[#1a1b24] border-gray-800' : 'bg-white border-gray-200')}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTypeFilter('all')}
              className={'px-3 py-1.5 rounded-xl text-xs font-semibold ' + (typeFilter === 'all' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-800')}
            >
              Todas ({filteredTransactions.length})
            </button>
            <button
              onClick={() => setTypeFilter('income')}
              className={'px-3 py-1.5 rounded-xl text-xs font-semibold ' + (typeFilter === 'income' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:bg-gray-800')}
            >
              Receitas
            </button>
            <button
              onClick={() => setTypeFilter('expense')}
              className={'px-3 py-1.5 rounded-xl text-xs font-semibold ' + (typeFilter === 'expense' ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-gray-800')}
            >
              Despesas
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar transação..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl text-xs bg-gray-900/40 border border-gray-800 outline-none focus:border-purple-500 text-inherit w-full sm:w-48"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-inherit text-gray-400">
                <th className="pb-3 font-semibold">Descrição</th>
                <th className="pb-3 font-semibold">Categoria</th>
                <th className="pb-3 font-semibold">Data</th>
                <th className="pb-3 font-semibold text-right">Valor</th>
                <th className="pb-3 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-inherit">
              {filteredTransactions.map(tx => (
                <tr key={tx.id} className="hover:bg-gray-800/20 transition-colors">
                  <td className="py-3 font-medium flex items-center gap-2">
                    <span className={'w-2 h-2 rounded-full ' + (tx.type === 'income' ? 'bg-emerald-400' : 'bg-red-400')} />
                    <span>{tx.description}</span>
                  </td>
                  <td className="py-3 text-gray-400">
                    <span className="px-2 py-0.5 rounded-full bg-gray-800 text-[10px] font-medium">{tx.category}</span>
                  </td>
                  <td className="py-3 text-gray-400">{tx.date}</td>
                  <td className={'py-3 text-right font-bold ' + (tx.type === 'income' ? 'text-emerald-400' : 'text-red-400')}>
                    {tx.type === 'income' ? '+' : '-'} R$ {tx.amount.toFixed(2)}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => handleDeleteTransaction(tx.id)}
                      className="p-1 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={'w-full max-w-md rounded-3xl border p-6 shadow-2xl space-y-4 ' + (darkMode ? 'bg-[#1a1b24] border-gray-800 text-gray-100' : 'bg-white border-gray-200 text-gray-800')}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base">Adicionar Transação</h3>
              <button onClick={() => setIsAddModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleAddTransaction} className="space-y-3">
              <div className="flex gap-2 p-1 rounded-xl bg-gray-900 border border-gray-800">
                <button type="button" onClick={() => setNewType('expense')} className={'flex-1 py-1.5 rounded-lg text-xs font-bold ' + (newType === 'expense' ? 'bg-red-600 text-white' : 'text-gray-400')}>Despesa</button>
                <button type="button" onClick={() => setNewType('income')} className={'flex-1 py-1.5 rounded-lg text-xs font-bold ' + (newType === 'income' ? 'bg-emerald-600 text-white' : 'text-gray-400')}>Receita</button>
              </div>
              <input type="text" placeholder="Descrição (ex: Aluguel, Supermercado)" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} required className="w-full p-2.5 rounded-xl bg-gray-900/50 border border-gray-800 text-xs outline-none focus:border-purple-500 text-inherit" />
              <input type="number" step="0.01" placeholder="Valor (R$)" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} required className="w-full p-2.5 rounded-xl bg-gray-900/50 border border-gray-800 text-xs outline-none focus:border-purple-500 text-inherit" />
              <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="w-full p-2.5 rounded-xl bg-gray-900/50 border border-gray-800 text-xs outline-none focus:border-purple-500 text-inherit">
                {categories.map(c => <option key={c} value={c} className="bg-gray-900">{c}</option>)}
              </select>
              <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} required className="w-full p-2.5 rounded-xl bg-gray-900/50 border border-gray-800 text-xs outline-none focus:border-purple-500 text-inherit" />
              <button type="submit" className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg transition-transform active:scale-95">Salvar Transação</button>
            </form>
          </div>
        </div>
      )}

      {/* Add Goal Modal */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={'w-full max-w-md rounded-3xl border p-6 shadow-2xl space-y-4 ' + (darkMode ? 'bg-[#1a1b24] border-gray-800 text-gray-100' : 'bg-white border-gray-200 text-gray-800')}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base">Nova Meta Financeira</h3>
              <button onClick={() => setIsGoalModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleAddGoal} className="space-y-3">
              <input type="text" placeholder="Nome da Meta (ex: Reserva, Viagem)" value={goalTitle} onChange={(e) => setGoalTitle(e.target.value)} required className="w-full p-2.5 rounded-xl bg-gray-900/50 border border-gray-800 text-xs outline-none focus:border-purple-500 text-inherit" />
              <input type="number" placeholder="Valor Alvo (R$)" value={goalTarget} onChange={(e) => setGoalTarget(e.target.value)} required className="w-full p-2.5 rounded-xl bg-gray-900/50 border border-gray-800 text-xs outline-none focus:border-purple-500 text-inherit" />
              <input type="number" placeholder="Valor Atual Já Guardado (R$)" value={goalCurrent} onChange={(e) => setGoalCurrent(e.target.value)} className="w-full p-2.5 rounded-xl bg-gray-900/50 border border-gray-800 text-xs outline-none focus:border-purple-500 text-inherit" />
              <button type="submit" className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg transition-transform active:scale-95">Criar Meta</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
