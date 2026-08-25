import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Trash2,
  Calendar,
  CreditCard,
  Wallet,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  Target,
  ArrowRight,
  HelpCircle,
  FileSpreadsheet,
  Check,
  Edit2,
  X,
  PieChart
} from 'lucide-react';

export default function FinanceView({
  data = {},
  onUpdateTransactions,
  onUpdateBills,
  onUpdateDebts,
  onUpdateCreditCards,
  onUpdateFinanceProfile,
  onUpdateGoals,
  onAskJarvis,
  darkMode
}) {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const currentMonth = today.toISOString().slice(0, 7);

  const [activeSubTab, setActiveSubTab] = useState('overview'); // 'overview' | 'bills' | 'debts' | 'cards' | 'transactions' | 'goals'
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  // Modals state
  const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [isDebtModalOpen, setIsDebtModalOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  // Profile data
  const profile = data?.financeProfile || { monthlySalary: 0, salaryDay: 5 };
  const bills = data?.bills || [];
  const debts = data?.debts || [];
  const creditCards = data?.creditCards || [];
  const transactions = data?.transactions || [];
  const goals = data?.financeGoals || [];

  // Form states
  const [tempSalary, setTempSalary] = useState(profile.monthlySalary || '');
  const [tempSalaryDay, setTempSalaryDay] = useState(profile.salaryDay || 5);

  // Bill Form
  const [billTitle, setBillTitle] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [billDueDate, setBillDueDate] = useState(todayStr);
  const [billCategory, setBillCategory] = useState('Moradia');
  const [billRecurring, setBillRecurring] = useState(true);

  // Debt Form
  const [debtTitle, setDebtTitle] = useState('');
  const [debtTotalAmount, setDebtTotalAmount] = useState('');
  const [debtInstallmentAmount, setDebtInstallmentAmount] = useState('');
  const [debtTotalInstallments, setDebtTotalInstallments] = useState('12');
  const [debtPaidInstallments, setDebtPaidInstallments] = useState('0');
  const [debtDueDate, setDebtDueDate] = useState(todayStr);

  // Credit Card Form
  const [cardName, setCardName] = useState('');
  const [cardLimit, setCardLimit] = useState('');
  const [cardBillAmount, setCardBillAmount] = useState('');
  const [cardClosingDay, setCardClosingDay] = useState('25');
  const [cardDueDay, setCardDueDay] = useState('5');
  const [cardColor, setCardColor] = useState('#8b5cf6');

  // Transaction Form
  const [txDesc, setTxDesc] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txType, setTxType] = useState('expense');
  const [txCategory, setTxCategory] = useState('Alimentação');
  const [txDate, setTxDate] = useState(todayStr);

  // Goal Form
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalCurrent, setGoalCurrent] = useState('');
  const [goalDeadline, setGoalDeadline] = useState('');

  // Calculations for current month
  const monthlySalary = Number(profile.monthlySalary) || 0;
  
  // Total bills of selected month
  const totalBillsAmount = bills.reduce((acc, b) => acc + (Number(b.amount) || 0), 0);
  const paidBillsAmount = bills.filter(b => b.status === 'paid').reduce((acc, b) => acc + (Number(b.amount) || 0), 0);
  const pendingBillsAmount = bills.filter(b => b.status !== 'paid').reduce((acc, b) => acc + (Number(b.amount) || 0), 0);

  // Total debt installments due this month
  const totalDebtInstallmentsMonthly = debts.reduce((acc, d) => acc + (Number(d.installmentAmount) || 0), 0);

  // Total card bills
  const totalCardBills = creditCards.reduce((acc, c) => acc + (Number(c.currentBill) || 0), 0);

  // Total committed expenses
  const totalCommittedExpenses = totalBillsAmount + totalDebtInstallmentsMonthly + totalCardBills;
  
  // Real Free Cash Flow (Quanto sobra de verdade)
  const realFreeBalance = monthlySalary - totalCommittedExpenses;
  const commitmentRate = monthlySalary > 0 ? Math.round((totalCommittedExpenses / monthlySalary) * 100) : 0;

  // Total remaining debt in general
  const totalDebtRemaining = debts.reduce((acc, d) => {
    const total = Number(d.totalAmount) || 0;
    const paid = (Number(d.paidInstallments) || 0) * (Number(d.installmentAmount) || 0);
    return acc + Math.max(0, total - paid);
  }, 0);

  // Save Salary Profile
  const handleSaveProfile = () => {
    const updated = {
      monthlySalary: Number(tempSalary) || 0,
      salaryDay: Number(tempSalaryDay) || 5
    };
    onUpdateFinanceProfile(updated);
    setIsSalaryModalOpen(false);
  };

  // Add Bill
  const handleAddBill = (e) => {
    e.preventDefault();
    if (!billTitle || !billAmount) return;
    const newBill = {
      id: 'bill-' + Date.now(),
      title: billTitle,
      amount: Number(billAmount),
      dueDate: billDueDate,
      category: billCategory,
      isRecurring: billRecurring,
      status: 'pending', // 'pending' | 'paid'
      createdAt: todayStr
    };
    onUpdateBills([newBill, ...bills]);
    setBillTitle('');
    setBillAmount('');
    setIsBillModalOpen(false);
  };

  // Toggle Bill Paid
  const handleToggleBillStatus = (billId) => {
    const updated = bills.map(b => {
      if (b.id === billId) {
        const nextStatus = b.status === 'paid' ? 'pending' : 'paid';
        // If marking as paid, create an automatic transaction record
        if (nextStatus === 'paid') {
          const autoTx = {
            id: 'tx-' + Date.now(),
            description: `Pagamento: ${b.title}`,
            amount: b.amount,
            type: 'expense',
            category: b.category,
            date: todayStr,
            isBillAuto: true
          };
          onUpdateTransactions([autoTx, ...transactions]);
        }
        return { ...b, status: nextStatus, paidAt: nextStatus === 'paid' ? todayStr : null };
      }
      return b;
    });
    onUpdateBills(updated);
  };

  const handleDeleteBill = (id) => {
    onUpdateBills(bills.filter(b => b.id !== id));
  };

  // Add Debt
  const handleAddDebt = (e) => {
    e.preventDefault();
    if (!debtTitle || !debtTotalAmount) return;
    const newDebt = {
      id: 'debt-' + Date.now(),
      title: debtTitle,
      totalAmount: Number(debtTotalAmount),
      installmentAmount: Number(debtInstallmentAmount) || (Number(debtTotalAmount) / (Number(debtTotalInstallments) || 1)),
      totalInstallments: Number(debtTotalInstallments) || 1,
      paidInstallments: Number(debtPaidInstallments) || 0,
      dueDate: debtDueDate,
      createdAt: todayStr
    };
    onUpdateDebts([newDebt, ...debts]);
    setDebtTitle('');
    setDebtTotalAmount('');
    setDebtInstallmentAmount('');
    setIsDebtModalOpen(false);
  };

  // Pay 1 Debt Installment
  const handlePayDebtInstallment = (debtId) => {
    const updated = debts.map(d => {
      if (d.id === debtId) {
        const nextPaid = Math.min(d.totalInstallments, (d.paidInstallments || 0) + 1);
        const autoTx = {
          id: 'tx-' + Date.now(),
          description: `Parcela Dívida (${nextPaid}/${d.totalInstallments}): ${d.title}`,
          amount: d.installmentAmount,
          type: 'expense',
          category: 'Dívidas & Empréstimos',
          date: todayStr
        };
        onUpdateTransactions([autoTx, ...transactions]);
        return { ...d, paidInstallments: nextPaid };
      }
      return d;
    });
    onUpdateDebts(updated);
  };

  const handleDeleteDebt = (id) => {
    onUpdateDebts(debts.filter(d => d.id !== id));
  };

  // Add Credit Card
  const handleAddCard = (e) => {
    e.preventDefault();
    if (!cardName || !cardLimit) return;
    const newCard = {
      id: 'card-' + Date.now(),
      name: cardName,
      limit: Number(cardLimit),
      currentBill: Number(cardBillAmount) || 0,
      closingDay: Number(cardClosingDay) || 25,
      dueDay: Number(cardDueDay) || 5,
      color: cardColor
    };
    onUpdateCreditCards([newCard, ...creditCards]);
    setCardName('');
    setCardLimit('');
    setCardBillAmount('');
    setIsCardModalOpen(false);
  };

  const handlePayCardBill = (cardId) => {
    const updated = creditCards.map(c => {
      if (c.id === cardId) {
        if (c.currentBill > 0) {
          const autoTx = {
            id: 'tx-' + Date.now(),
            description: `Pagamento Fatura: ${c.name}`,
            amount: c.currentBill,
            type: 'expense',
            category: 'Cartão de Crédito',
            date: todayStr
          };
          onUpdateTransactions([autoTx, ...transactions]);
        }
        return { ...c, currentBill: 0 };
      }
      return c;
    });
    onUpdateCreditCards(updated);
  };

  const handleDeleteCard = (id) => {
    onUpdateCreditCards(creditCards.filter(c => c.id !== id));
  };

  // Add Regular Transaction
  const handleAddTx = (e) => {
    e.preventDefault();
    if (!txDesc || !txAmount) return;
    const newTx = {
      id: 'tx-' + Date.now(),
      description: txDesc,
      amount: Number(txAmount),
      type: txType,
      category: txCategory,
      date: txDate
    };
    onUpdateTransactions([newTx, ...transactions]);
    setTxDesc('');
    setTxAmount('');
    setIsTxModalOpen(false);
  };

  const handleDeleteTx = (id) => {
    onUpdateTransactions(transactions.filter(t => t.id !== id));
  };

  // Add Goal
  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!goalTitle || !goalTarget) return;
    const newGoal = {
      id: 'goal-' + Date.now(),
      title: goalTitle,
      targetAmount: Number(goalTarget),
      currentAmount: Number(goalCurrent) || 0,
      deadline: goalDeadline
    };
    onUpdateGoals([newGoal, ...goals]);
    setGoalTitle('');
    setGoalTarget('');
    setGoalCurrent('');
    setIsGoalModalOpen(false);
  };

  const handleDeleteGoal = (id) => {
    onUpdateGoals(goals.filter(g => g.id !== id));
  };

  // Quick Diagnosis Action with JARVIS
  const triggerJarvisDiagnosis = () => {
    const prompt = `Faça um diagnóstico completo das minhas finanças atuais no Obnotion:
- Salário Líquido: R$ ${monthlySalary.toFixed(2)}
- Contas Fixas/Boletos a Pagar: R$ ${totalBillsAmount.toFixed(2)}
- Dívidas e Empréstimos (Parcelas mensais): R$ ${totalDebtInstallmentsMonthly.toFixed(2)} (Saldo devedor total: R$ ${totalDebtRemaining.toFixed(2)})
- Faturas de Cartão: R$ ${totalCardBills.toFixed(2)}
- Saldo Livre Real: R$ ${realFreeBalance.toFixed(2)} (${commitmentRate}% da renda comprometida).

Por favor, me dê um plano de ação tático:
1. Minha situação está segura, em alerta ou crítica?
2. Como devo organizar meus pagamentos para não pagar juros?
3. O que fazer para zerar as dívidas mais rápido e começar a montar uma reserva?`;

    if (onAskJarvis) {
      onAskJarvis(prompt);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      {/* Top Banner & Executive Flow */}
      <div className={`p-6 rounded-2xl border ${
        darkMode ? 'bg-[#101118]/70 backdrop-blur-md border-white/[0.08]' : 'bg-white border-zinc-200'
      } flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden`}>
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${realFreeBalance >= 0 ? 'bg-emerald-400' : 'bg-rose-500'} animate-pulse`} />
            <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">Raio-X de Fluxo de Caixa Real</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Gestão Financeira & Dívidas
          </h1>
          <p className="text-xs text-zinc-400 max-w-xl">
            Planejamento inteligente baseado no seu salário, contas fixas, faturas e controle de quitação de dívidas.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 z-10">
          <button
            onClick={() => {
              setTempSalary(profile.monthlySalary || '');
              setTempSalaryDay(profile.salaryDay || 5);
              setIsSalaryModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] text-zinc-200 transition-all"
          >
            <Wallet className="w-3.5 h-3.5 text-violet-400" />
            <span>Salário: <strong className="font-mono text-white">R$ {monthlySalary.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</strong></span>
            <Edit2 className="w-3 h-3 text-zinc-500 ml-1" />
          </button>

          <button
            onClick={triggerJarvisDiagnosis}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md shadow-violet-600/20 transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200 animate-pulse" />
            <span>Diagnóstico do JARVIS</span>
          </button>
        </div>
      </div>

      {/* 4 Main Cash Flow Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Salário Previsto */}
        <div className={`p-5 rounded-2xl border ${
          darkMode ? 'bg-[#111219]/70 border-white/[0.07]' : 'bg-white border-zinc-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Salário / Renda</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold font-mono tracking-tight text-white">
            R$ {monthlySalary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-[10px] text-zinc-400 mt-2 font-mono">
            Recebimento estimado dia {profile.salaryDay || 5}
          </p>
        </div>

        {/* 2. Contas & Boletos */}
        <div className={`p-5 rounded-2xl border ${
          darkMode ? 'bg-[#111219]/70 border-white/[0.07]' : 'bg-white border-zinc-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Contas Fixas (Mês)</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold font-mono tracking-tight text-zinc-100">
            R$ {totalBillsAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-[10px] text-zinc-400 mt-2 font-mono flex items-center justify-between">
            <span className="text-emerald-400">Pago: R$ {paidBillsAmount.toFixed(0)}</span>
            <span className="text-amber-400">Pendente: R$ {pendingBillsAmount.toFixed(0)}</span>
          </p>
        </div>

        {/* 3. Dívidas & Cartões */}
        <div className={`p-5 rounded-2xl border ${
          darkMode ? 'bg-[#111219]/70 border-white/[0.07]' : 'bg-white border-zinc-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Cartões & Dívidas</span>
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold font-mono tracking-tight text-zinc-100">
            R$ {(totalDebtInstallmentsMonthly + totalCardBills).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-[10px] text-zinc-400 mt-2 font-mono">
            {debts.length} dívida(s) • {creditCards.length} cartão(ões)
          </p>
        </div>

        {/* 4. Saldo Livre Real */}
        <div className={`p-5 rounded-2xl border ${
          realFreeBalance >= 0 
            ? (darkMode ? 'bg-[#111219]/70 border-emerald-500/30' : 'bg-emerald-50/50 border-emerald-200')
            : (darkMode ? 'bg-[#111219]/70 border-rose-500/30' : 'bg-rose-50/50 border-rose-200')
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Saldo Livre Real</span>
            <div className={`p-1.5 rounded-lg ${realFreeBalance >= 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <h3 className={`text-2xl font-bold font-mono tracking-tight ${realFreeBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            R$ {realFreeBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-[10px] text-zinc-400 mt-2 font-mono">
            {commitmentRate}% da sua renda comprometida
          </p>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center space-x-1 border-b border-white/[0.08] pb-1 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Visão Geral', count: null },
          { id: 'bills', label: 'Contas & Boletos', count: bills.length },
          { id: 'debts', label: 'Dívidas & Empréstimos', count: debts.length },
          { id: 'cards', label: 'Cartões de Crédito', count: creditCards.length },
          { id: 'transactions', label: 'Extrato & Gastos', count: transactions.length },
          { id: 'goals', label: 'Metas & Reserva', count: goals.length },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === tab.id
                ? 'bg-white/[0.08] text-white font-semibold border border-white/[0.08]'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== null && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/40 text-zinc-400 border border-white/[0.06]">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ================= TAB 1: OVERVIEW ================= */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Pending Bills & Debts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Bill Checklist */}
            <div className={`p-6 rounded-2xl border ${
              darkMode ? 'bg-[#101118]/60 border-white/[0.08]' : 'bg-white border-zinc-200'
            } space-y-4`}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold tracking-tight text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  Próximos Vencimentos de Contas
                </h3>
                <button
                  onClick={() => setIsBillModalOpen(true)}
                  className="flex items-center gap-1 text-xs font-medium text-violet-400 hover:text-violet-300"
                >
                  <Plus className="w-3.5 h-3.5" /> Adicionar Conta
                </button>
              </div>

              <div className="space-y-2">
                {bills.slice(0, 5).map(b => (
                  <div
                    key={b.id}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                      b.status === 'paid' 
                        ? 'bg-white/[0.01] border-white/[0.04] text-zinc-500' 
                        : 'bg-white/[0.03] border-white/[0.06] text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleBillStatus(b.id)}
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                          b.status === 'paid' 
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' 
                            : 'border-white/[0.2] hover:border-amber-400'
                        }`}
                        title={b.status === 'paid' ? 'Desmarcar' : 'Marcar como Pago'}
                      >
                        {b.status === 'paid' && <Check className="w-3.5 h-3.5" />}
                      </button>
                      <div>
                        <p className={`text-xs font-semibold ${b.status === 'paid' ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                          {b.title}
                        </p>
                        <p className="text-[10px] text-zinc-500 font-mono">
                          Vence em: {b.dueDate} • {b.category}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono font-bold text-white">
                        R$ {Number(b.amount).toFixed(2)}
                      </p>
                      <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded ${
                        b.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {b.status === 'paid' ? 'Pago' : 'Pendente'}
                      </span>
                    </div>
                  </div>
                ))}
                {bills.length === 0 && (
                  <div className="py-8 text-center border border-dashed border-white/[0.06] rounded-xl">
                    <p className="text-xs text-zinc-500">Nenhuma conta cadastrada ainda. Clique em "+ Adicionar Conta".</p>
                  </div>
                )}
              </div>
            </div>

            {/* Debts Summary in Overview */}
            <div className={`p-6 rounded-2xl border ${
              darkMode ? 'bg-[#101118]/60 border-white/[0.08]' : 'bg-white border-zinc-200'
            } space-y-4`}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold tracking-tight text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-rose-400" />
                  Plano de Quitação de Dívidas & Empréstimos
                </h3>
                <button
                  onClick={() => setIsDebtModalOpen(true)}
                  className="flex items-center gap-1 text-xs font-medium text-violet-400 hover:text-violet-300"
                >
                  <Plus className="w-3.5 h-3.5" /> Adicionar Dívida
                </button>
              </div>

              <div className="space-y-3">
                {debts.map(d => {
                  const total = Number(d.totalAmount) || 0;
                  const instVal = Number(d.installmentAmount) || 0;
                  const paidInst = Number(d.paidInstallments) || 0;
                  const totalInst = Number(d.totalInstallments) || 1;
                  const paidTotal = paidInst * instVal;
                  const remaining = Math.max(0, total - paidTotal);
                  const progress = Math.min(100, Math.round((paidInst / totalInst) * 100));

                  return (
                    <div key={d.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-xs text-zinc-200">{d.title}</h4>
                          <p className="text-[10px] text-zinc-400 font-mono">
                            Parcela: R$ {instVal.toFixed(2)}/mês ({paidInst} de {totalInst} pagas)
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handlePayDebtInstallment(d.id)}
                            disabled={paidInst >= totalInst}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 disabled:opacity-40 transition-colors"
                          >
                            {paidInst >= totalInst ? 'Quitado 🎉' : 'Pagar Parcela'}
                          </button>
                          <button
                            onClick={() => handleDeleteDebt(d.id)}
                            className="p-1 text-zinc-600 hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-rose-500 to-emerald-400 h-full rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                        <span>Pago: R$ {paidTotal.toFixed(2)}</span>
                        <span>Falta: R$ {remaining.toFixed(2)} ({100 - progress}%)</span>
                      </div>
                    </div>
                  );
                })}
                {debts.length === 0 && (
                  <p className="text-xs text-zinc-500 text-center py-4">Nenhuma dívida cadastrada. Parabéns!</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Cards & JARVIS Advice Card */}
          <div className="space-y-6">
            {/* JARVIS Intelligent Strategy Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-950/40 via-[#12131c] to-[#0c0d14] border border-violet-500/30 space-y-3">
              <div className="flex items-center gap-2 text-violet-300 font-semibold text-xs">
                <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
                <span>Estratégia Recomendada JARVIS</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {debts.length > 0 
                  ? `Você tem R$ ${totalDebtRemaining.toFixed(2)} em dívidas ativas. Recomendo focar no método de amortização direta da parcela mais cara para liberar R$ ${totalDebtInstallmentsMonthly.toFixed(2)} no seu fluxo mensal.`
                  : realFreeBalance > 0
                  ? `Seu saldo livre projetado é de R$ ${realFreeBalance.toFixed(2)}. Recomendo direcionar pelo menos 20% para a sua Reserva de Emergência.`
                  : `Atenção: seus compromissos superam ou empatam com sua renda. Clique no botão de Diagnóstico para ver onde enxugar despesas.`
                }
              </p>
              <button
                onClick={triggerJarvisDiagnosis}
                className="w-full py-2 rounded-xl text-xs font-semibold bg-white/[0.08] hover:bg-white/[0.12] text-white border border-white/[0.1] transition-all flex items-center justify-center gap-1.5"
              >
                <span>Análise Completa com IA</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Credit Cards Widget */}
            <div className={`p-5 rounded-2xl border ${
              darkMode ? 'bg-[#101118]/60 border-white/[0.08]' : 'bg-white border-zinc-200'
            } space-y-3`}>
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-violet-400" />
                  Cartões de Crédito
                </h3>
                <button
                  onClick={() => setIsCardModalOpen(true)}
                  className="text-xs text-violet-400 hover:text-violet-300"
                >
                  + Cartão
                </button>
              </div>

              <div className="space-y-3">
                {creditCards.map(c => (
                  <div key={c.id} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-white">{c.name}</span>
                      <span className="font-mono text-xs font-bold text-rose-400">
                        Fatura: R$ {Number(c.currentBill || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-white/[0.06] h-1 rounded-full overflow-hidden">
                      <div
                        className="bg-violet-500 h-full rounded-full"
                        style={{ width: `${Math.min(100, Math.round(((c.currentBill || 0) / (c.limit || 1)) * 100))}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                      <span>Limite: R$ {Number(c.limit).toFixed(0)}</span>
                      <button
                        onClick={() => handlePayCardBill(c.id)}
                        className="text-emerald-400 hover:underline"
                      >
                        Pagar Fatura
                      </button>
                    </div>
                  </div>
                ))}
                {creditCards.length === 0 && (
                  <p className="text-xs text-zinc-500 text-center py-3">Nenhum cartão cadastrado.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: BILLS ================= */}
      {activeSubTab === 'bills' && (
        <div className={`p-6 rounded-2xl border ${
          darkMode ? 'bg-[#101118]/60 border-white/[0.08]' : 'bg-white border-zinc-200'
        } space-y-4`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Contas a Pagar & Boletos</h3>
              <p className="text-xs text-zinc-400">Controle rigoroso de vencimentos para nunca mais pagar juros ou multas por atraso.</p>
            </div>
            <button
              onClick={() => setIsBillModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Adicionar Conta
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] text-zinc-400 font-mono text-[11px]">
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Descrição da Conta</th>
                  <th className="py-2.5 px-3">Categoria</th>
                  <th className="py-2.5 px-3">Vencimento</th>
                  <th className="py-2.5 px-3">Valor</th>
                  <th className="py-2.5 px-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {bills.map(b => (
                  <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3">
                      <button
                        onClick={() => handleToggleBillStatus(b.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold flex items-center gap-1 ${
                          b.status === 'paid'
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25'
                            : 'bg-amber-500/15 text-amber-300 border border-amber-500/25'
                        }`}
                      >
                        {b.status === 'paid' ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        <span>{b.status === 'paid' ? 'Pago' : 'Pendente'}</span>
                      </button>
                    </td>
                    <td className="py-3 px-3 font-semibold text-zinc-200">{b.title}</td>
                    <td className="py-3 px-3 text-zinc-400">{b.category}</td>
                    <td className="py-3 px-3 font-mono text-zinc-400">{b.dueDate}</td>
                    <td className="py-3 px-3 font-mono font-bold text-white">R$ {Number(b.amount).toFixed(2)}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleDeleteBill(b.id)}
                        className="p-1 text-zinc-600 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {bills.length === 0 && (
              <div className="py-12 text-center text-xs text-zinc-500">
                Nenhuma conta cadastrada. Clique no botão acima para adicionar sua primeira conta!
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 3: DEBTS ================= */}
      {activeSubTab === 'debts' && (
        <div className={`p-6 rounded-2xl border ${
          darkMode ? 'bg-[#101118]/60 border-white/[0.08]' : 'bg-white border-zinc-200'
        } space-y-6`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Dívidas, Empréstimos & Parcelamentos</h3>
              <p className="text-xs text-zinc-400">Acompanhe seu progresso de amortização até a liberdade total das dívidas.</p>
            </div>
            <button
              onClick={() => setIsDebtModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Adicionar Dívida
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {debts.map(d => {
              const total = Number(d.totalAmount) || 0;
              const instVal = Number(d.installmentAmount) || 0;
              const paidInst = Number(d.paidInstallments) || 0;
              const totalInst = Number(d.totalInstallments) || 1;
              const paidTotal = paidInst * instVal;
              const remaining = Math.max(0, total - paidTotal);
              const progress = Math.min(100, Math.round((paidInst / totalInst) * 100));

              return (
                <div key={d.id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-white">{d.title}</h4>
                      <p className="text-xs font-mono text-zinc-400">Total Inicial: R$ {total.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteDebt(d.id)}
                      className="p-1 text-zinc-600 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-black/40 p-3 rounded-xl border border-white/[0.04]">
                    <div>
                      <span className="text-zinc-500 text-[10px] uppercase">Parcela Mensal</span>
                      <p className="font-bold text-zinc-200">R$ {instVal.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-[10px] uppercase">Parcelas</span>
                      <p className="font-bold text-violet-400">{paidInst} de {totalInst} pagas</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                      <span>Progresso ({progress}%)</span>
                      <span className="text-emerald-400 font-bold">Falta: R$ {remaining.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-white/[0.06] h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 h-full rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                  </div>

                  <button
                    onClick={() => handlePayDebtInstallment(d.id)}
                    disabled={paidInst >= totalInst}
                    className="w-full py-2 rounded-xl text-xs font-semibold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 disabled:opacity-40 transition-all flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{paidInst >= totalInst ? 'Dívida Quitada!' : `Pagar Parcela #${paidInst + 1}`}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 4: CARDS ================= */}
      {activeSubTab === 'cards' && (
        <div className={`p-6 rounded-2xl border ${
          darkMode ? 'bg-[#101118]/60 border-white/[0.08]' : 'bg-white border-zinc-200'
        } space-y-6`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Cartões de Crédito & Limites</h3>
              <p className="text-xs text-zinc-400">Acompanhe faturas abertas, limite disponível e datas de fechamento.</p>
            </div>
            <button
              onClick={() => setIsCardModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Adicionar Cartão
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {creditCards.map(c => {
              const limit = Number(c.limit) || 1;
              const bill = Number(c.currentBill) || 0;
              const available = Math.max(0, limit - bill);
              const usagePercent = Math.min(100, Math.round((bill / limit) * 100));

              return (
                <div key={c.id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-violet-400" />
                      <h4 className="font-bold text-sm text-white">{c.name}</h4>
                    </div>
                    <button onClick={() => handleDeleteCard(c.id)} className="p-1 text-zinc-600 hover:text-rose-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-mono text-zinc-400">Fatura Atual do Mês</span>
                    <p className="text-xl font-bold font-mono text-rose-400">R$ {bill.toFixed(2)}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                      <span>Limite Usado ({usagePercent}%)</span>
                      <span className="text-emerald-400 font-bold">Disponível: R$ {available.toFixed(0)}</span>
                    </div>
                    <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-violet-500 h-full rounded-full" style={{ width: `${usagePercent}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-1 border-t border-white/[0.04]">
                    <span>Fecha dia {c.closingDay}</span>
                    <span>Vence dia {c.dueDay}</span>
                  </div>

                  <button
                    onClick={() => handlePayCardBill(c.id)}
                    className="w-full py-2 rounded-xl text-xs font-medium bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 border border-white/[0.08] transition-colors"
                  >
                    Pagar Fatura
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 5: TRANSACTIONS ================= */}
      {activeSubTab === 'transactions' && (
        <div className={`p-6 rounded-2xl border ${
          darkMode ? 'bg-[#101118]/60 border-white/[0.08]' : 'bg-white border-zinc-200'
        } space-y-4`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Extrato & Transações</h3>
              <p className="text-xs text-zinc-400">Histórico de todas as entradas e saídas registradas.</p>
            </div>
            <button
              onClick={() => setIsTxModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Nova Transação
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] text-zinc-400 font-mono text-[11px]">
                  <th className="py-2.5 px-3">Tipo</th>
                  <th className="py-2.5 px-3">Descrição</th>
                  <th className="py-2.5 px-3">Categoria</th>
                  <th className="py-2.5 px-3">Data</th>
                  <th className="py-2.5 px-3">Valor</th>
                  <th className="py-2.5 px-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {transactions.map(t => (
                  <tr key={t.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        t.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {t.type === 'income' ? 'Receita' : 'Despesa'}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-zinc-200">{t.description}</td>
                    <td className="py-3 px-3 text-zinc-400">{t.category}</td>
                    <td className="py-3 px-3 font-mono text-zinc-400">{t.date}</td>
                    <td className={`py-3 px-3 font-mono font-bold ${t.type === 'income' ? 'text-emerald-400' : 'text-zinc-100'}`}>
                      {t.type === 'income' ? '+' : '-'} R$ {Number(t.amount).toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button onClick={() => handleDeleteTx(t.id)} className="p-1 text-zinc-600 hover:text-rose-400">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 6: GOALS ================= */}
      {activeSubTab === 'goals' && (
        <div className={`p-6 rounded-2xl border ${
          darkMode ? 'bg-[#101118]/60 border-white/[0.08]' : 'bg-white border-zinc-200'
        } space-y-6`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Metas Financeiras & Reserva de Emergência</h3>
              <p className="text-xs text-zinc-400">Defina objetivos e acompanhe a formação da sua segurança financeira.</p>
            </div>
            <button
              onClick={() => setIsGoalModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Nova Meta
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map(g => {
              const target = Number(g.targetAmount) || 1;
              const current = Number(g.currentAmount) || 0;
              const percent = Math.min(100, Math.round((current / target) * 100));

              return (
                <div key={g.id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-white">{g.title}</h4>
                    <button onClick={() => handleDeleteGoal(g.id)} className="p-1 text-zinc-600 hover:text-rose-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-emerald-400 font-bold">R$ {current.toFixed(2)}</span>
                    <span className="text-zinc-400">Meta: R$ {target.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-white/[0.06] h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${percent}%` }} />
                  </div>
                  <p className="text-[10px] font-mono text-zinc-500">{percent}% alcançado {g.deadline ? `• Prazo: ${g.deadline}` : ''}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= MODALS ================= */}
      {/* 1. Salary Profile Modal */}
      {isSalaryModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#141520] border border-white/[0.1] space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Configurar Salário & Renda</h3>
              <button onClick={() => setIsSalaryModalOpen(false)} className="text-zinc-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <div>
              <label className="block text-zinc-400 font-mono mb-1">Salário Líquido Mensal (R$):</label>
              <input
                type="number"
                value={tempSalary}
                onChange={e => setTempSalary(e.target.value)}
                placeholder="Ex: 3500"
                className="w-full p-2.5 rounded-xl bg-black/50 border border-white/[0.1] text-white outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-zinc-400 font-mono mb-1">Dia do Recebimento (1 a 31):</label>
              <input
                type="number"
                min="1"
                max="31"
                value={tempSalaryDay}
                onChange={e => setTempSalaryDay(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-black/50 border border-white/[0.1] text-white outline-none font-mono"
              />
            </div>
            <button
              onClick={handleSaveProfile}
              className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-colors"
            >
              Salvar Configuração
            </button>
          </div>
        </div>
      )}

      {/* 2. Add Bill Modal */}
      {isBillModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddBill} className="w-full max-w-md p-6 rounded-2xl bg-[#141520] border border-white/[0.1] space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Adicionar Conta / Boleto a Pagar</h3>
              <button type="button" onClick={() => setIsBillModalOpen(false)} className="text-zinc-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <div>
              <label className="block text-zinc-400 font-mono mb-1">Nome da Conta:</label>
              <input
                type="text"
                required
                value={billTitle}
                onChange={e => setBillTitle(e.target.value)}
                placeholder="Ex: Aluguel, Luz, Internet, Academia"
                className="w-full p-2.5 rounded-xl bg-black/50 border border-white/[0.1] text-white outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-400 font-mono mb-1">Valor (R$):</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={billAmount}
                  onChange={e => setBillAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full p-2.5 rounded-xl bg-black/50 border border-white/[0.1] text-white outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-zinc-400 font-mono mb-1">Data de Vencimento:</label>
                <input
                  type="date"
                  required
                  value={billDueDate}
                  onChange={e => setBillDueDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/50 border border-white/[0.1] text-white outline-none font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-zinc-400 font-mono mb-1">Categoria:</label>
              <select
                value={billCategory}
                onChange={e => setBillCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-black/50 border border-white/[0.1] text-white outline-none"
              >
                {['Moradia', 'Alimentação', 'Transporte', 'Saúde', 'Educação', 'Lazer', 'Assinaturas', 'Outros'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-colors"
            >
              Adicionar Conta
            </button>
          </form>
        </div>
      )}

      {/* 3. Add Debt Modal */}
      {isDebtModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddDebt} className="w-full max-w-md p-6 rounded-2xl bg-[#141520] border border-white/[0.1] space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Cadastrar Dívida / Empréstimo</h3>
              <button type="button" onClick={() => setIsDebtModalOpen(false)} className="text-zinc-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <div>
              <label className="block text-zinc-400 font-mono mb-1">Nome do Empréstimo / Dívida:</label>
              <input
                type="text"
                required
                value={debtTitle}
                onChange={e => setDebtTitle(e.target.value)}
                placeholder="Ex: Empréstimo Caixa, Dívida Cartão Nubank"
                className="w-full p-2.5 rounded-xl bg-black/50 border border-white/[0.1] text-white outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-400 font-mono mb-1">Valor Total da Dívida (R$):</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={debtTotalAmount}
                  onChange={e => setDebtTotalAmount(e.target.value)}
                  placeholder="Ex: 5000"
                  className="w-full p-2.5 rounded-xl bg-black/50 border border-white/[0.1] text-white outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-zinc-400 font-mono mb-1">Valor da Parcela (R$):</label>
                <input
                  type="number"
                  step="0.01"
                  value={debtInstallmentAmount}
                  onChange={e => setDebtInstallmentAmount(e.target.value)}
                  placeholder="Ex: 500"
                  className="w-full p-2.5 rounded-xl bg-black/50 border border-white/[0.1] text-white outline-none font-mono"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-400 font-mono mb-1">Total de Parcelas:</label>
                <input
                  type="number"
                  min="1"
                  value={debtTotalInstallments}
                  onChange={e => setDebtTotalInstallments(e.target.value)}
                  placeholder="Ex: 10"
                  className="w-full p-2.5 rounded-xl bg-black/50 border border-white/[0.1] text-white outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-zinc-400 font-mono mb-1">Parcelas Já Pagas:</label>
                <input
                  type="number"
                  min="0"
                  value={debtPaidInstallments}
                  onChange={e => setDebtPaidInstallments(e.target.value)}
                  placeholder="Ex: 2"
                  className="w-full p-2.5 rounded-xl bg-black/50 border border-white/[0.1] text-white outline-none font-mono"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold transition-colors"
            >
              Salvar Dívida no Plano
            </button>
          </form>
        </div>
      )}

      {/* 4. Add Card Modal */}
      {isCardModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddCard} className="w-full max-w-md p-6 rounded-2xl bg-[#141520] border border-white/[0.1] space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Cadastrar Cartão de Crédito</h3>
              <button type="button" onClick={() => setIsCardModalOpen(false)} className="text-zinc-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <div>
              <label className="block text-zinc-400 font-mono mb-1">Nome do Cartão / Banco:</label>
              <input
                type="text"
                required
                value={cardName}
                onChange={e => setCardName(e.target.value)}
                placeholder="Ex: Nubank Ultravioleta, Inter Black"
                className="w-full p-2.5 rounded-xl bg-black/50 border border-white/[0.1] text-white outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-400 font-mono mb-1">Limite Total (R$):</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={cardLimit}
                  onChange={e => setCardLimit(e.target.value)}
                  placeholder="Ex: 3000"
                  className="w-full p-2.5 rounded-xl bg-black/50 border border-white/[0.1] text-white outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-zinc-400 font-mono mb-1">Fatura Atual (R$):</label>
                <input
                  type="number"
                  step="0.01"
                  value={cardBillAmount}
                  onChange={e => setCardBillAmount(e.target.value)}
                  placeholder="Ex: 850"
                  className="w-full p-2.5 rounded-xl bg-black/50 border border-white/[0.1] text-white outline-none font-mono"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-400 font-mono mb-1">Dia Fechamento:</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={cardClosingDay}
                  onChange={e => setCardClosingDay(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/50 border border-white/[0.1] text-white outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-zinc-400 font-mono mb-1">Dia Vencimento:</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={cardDueDay}
                  onChange={e => setCardDueDay(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/50 border border-white/[0.1] text-white outline-none font-mono"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-colors"
            >
              Salvar Cartão
            </button>
          </form>
        </div>
      )}

      {/* 5. Add Transaction Modal */}
      {isTxModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddTx} className="w-full max-w-md p-6 rounded-2xl bg-[#141520] border border-white/[0.1] space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Nova Transação</h3>
              <button type="button" onClick={() => setIsTxModalOpen(false)} className="text-zinc-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTxType('expense')}
                className={`flex-1 py-2 rounded-xl font-semibold transition-colors ${
                  txType === 'expense' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-black/40 text-zinc-400'
                }`}
              >
                Despesa
              </button>
              <button
                type="button"
                onClick={() => setTxType('income')}
                className={`flex-1 py-2 rounded-xl font-semibold transition-colors ${
                  txType === 'income' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-black/40 text-zinc-400'
                }`}
              >
                Receita / Entrada
              </button>
            </div>
            <div>
              <label className="block text-zinc-400 font-mono mb-1">Descrição:</label>
              <input
                type="text"
                required
                value={txDesc}
                onChange={e => setTxDesc(e.target.value)}
                placeholder="Ex: Compra Mercado, Freelance"
                className="w-full p-2.5 rounded-xl bg-black/50 border border-white/[0.1] text-white outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-400 font-mono mb-1">Valor (R$):</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={txAmount}
                  onChange={e => setTxAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full p-2.5 rounded-xl bg-black/50 border border-white/[0.1] text-white outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-zinc-400 font-mono mb-1">Data:</label>
                <input
                  type="date"
                  required
                  value={txDate}
                  onChange={e => setTxDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/50 border border-white/[0.1] text-white outline-none font-mono"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-colors"
            >
              Registrar
            </button>
          </form>
        </div>
      )}

      {/* 6. Add Goal Modal */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddGoal} className="w-full max-w-md p-6 rounded-2xl bg-[#141520] border border-white/[0.1] space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Nova Meta Financeira</h3>
              <button type="button" onClick={() => setIsGoalModalOpen(false)} className="text-zinc-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <div>
              <label className="block text-zinc-400 font-mono mb-1">Título da Meta:</label>
              <input
                type="text"
                required
                value={goalTitle}
                onChange={e => setGoalTitle(e.target.value)}
                placeholder="Ex: Reserva de Emergência 6 meses"
                className="w-full p-2.5 rounded-xl bg-black/50 border border-white/[0.1] text-white outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-400 font-mono mb-1">Valor Alvo (R$):</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={goalTarget}
                  onChange={e => setGoalTarget(e.target.value)}
                  placeholder="Ex: 5000"
                  className="w-full p-2.5 rounded-xl bg-black/50 border border-white/[0.1] text-white outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-zinc-400 font-mono mb-1">Valor Atual Guardado (R$):</label>
                <input
                  type="number"
                  step="0.01"
                  value={goalCurrent}
                  onChange={e => setGoalCurrent(e.target.value)}
                  placeholder="Ex: 500"
                  className="w-full p-2.5 rounded-xl bg-black/50 border border-white/[0.1] text-white outline-none font-mono"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors"
            >
              Criar Meta
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
