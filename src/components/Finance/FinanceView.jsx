import React, { useState, useEffect } from 'react';
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
  ChevronLeft,
  ChevronRight,
  Check,
  Edit2,
  X,
  Layers,
  Percent,
  Receipt,
  MinusCircle
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
  const currentMonthStr = today.toISOString().slice(0, 7); // e.g. "2026-08"

  const [activeSubTab, setActiveSubTab] = useState('overview'); // 'overview' | 'bills' | 'debts' | 'cards' | 'transactions' | 'goals'
  const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);
  const [viewAllMonths, setViewAllMonths] = useState(false);

  // Modals state
  const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [isDebtModalOpen, setIsDebtModalOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  // Profile data & default fallbacks
  const profile = data?.financeProfile || {
    paymentFrequency: 'monthly',
    monthlySalary: 0,
    salaryDay: 5,
    firstPaymentAmount: 0,
    firstPaymentDay: 20,
    secondPaymentAmount: 0,
    secondPaymentDay: 5,
    grossSalary: 0,
    hasDiscounts: false,
    discounts: []
  };

  const bills = data?.bills || [];
  const debts = data?.debts || [];
  const creditCards = data?.creditCards || [];
  const transactions = data?.transactions || [];
  const goals = data?.financeGoals || [];

  // Salary Form States (Biweekly & Discounts support)
  const [tempFrequency, setTempFrequency] = useState(profile.paymentFrequency || 'monthly');
  const [tempMonthlySalary, setTempMonthlySalary] = useState(profile.monthlySalary || '');
  const [tempSalaryDay, setTempSalaryDay] = useState(profile.salaryDay || 5);
  
  // Biweekly fields
  const [tempFirstAmount, setTempFirstAmount] = useState(profile.firstPaymentAmount || '');
  const [tempFirstDay, setTempFirstDay] = useState(profile.firstPaymentDay || 20);
  const [tempSecondAmount, setTempSecondAmount] = useState(profile.secondPaymentAmount || '');
  const [tempSecondDay, setTempSecondDay] = useState(profile.secondPaymentDay || 5);

  // Discounts (Holerite)
  const [tempHasDiscounts, setTempHasDiscounts] = useState(profile.hasDiscounts || false);
  const [tempGrossSalary, setTempGrossSalary] = useState(profile.grossSalary || '');
  const [tempDiscounts, setTempDiscounts] = useState(profile.discounts || []);
  const [newDiscountName, setNewDiscountName] = useState('');
  const [newDiscountAmount, setNewDiscountAmount] = useState('');

  // Sync state whenever modal opens or profile changes
  useEffect(() => {
    setTempFrequency(profile.paymentFrequency || 'monthly');
    setTempMonthlySalary(profile.monthlySalary || '');
    setTempSalaryDay(profile.salaryDay || 5);
    setTempFirstAmount(profile.firstPaymentAmount || '');
    setTempFirstDay(profile.firstPaymentDay || 20);
    setTempSecondAmount(profile.secondPaymentAmount || '');
    setTempSecondDay(profile.secondPaymentDay || 5);
    setTempHasDiscounts(profile.hasDiscounts || false);
    setTempGrossSalary(profile.grossSalary || '');
    setTempDiscounts(profile.discounts || []);
  }, [profile, isSalaryModalOpen]);

  // Bill Form
  const [billTitle, setBillTitle] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [billDueDate, setBillDueDate] = useState(todayStr);
  const [billCategory, setBillCategory] = useState('Cartão de Crédito');
  const [billRecurring, setBillRecurring] = useState(false);

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

  // Extract all distinct months from bills to allow quick navigation
  const availableMonths = Array.from(new Set([
    currentMonthStr,
    ...bills.map(b => (b.dueDate ? b.dueDate.slice(0, 7) : currentMonthStr))
  ])).sort();

  // Helper to format month name (e.g. "2027-01" -> "Janeiro de 2027")
  const formatMonthTitle = (mStr) => {
    try {
      const [y, m] = mStr.split('-');
      const d = new Date(Number(y), Number(m) - 1, 15);
      const str = d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
      return str.charAt(0).toUpperCase() + str.slice(1);
    } catch (e) {
      return mStr;
    }
  };

  const navigateMonth = (direction) => {
    try {
      const [y, m] = selectedMonth.split('-').map(Number);
      const curDate = new Date(y, m - 1 + direction, 15);
      const newMonthStr = curDate.toISOString().slice(0, 7);
      setSelectedMonth(newMonthStr);
      setViewAllMonths(false);
    } catch (e) {}
  };

  // Filter bills by selected month or show all
  const filteredBills = viewAllMonths 
    ? [...bills].sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''))
    : bills.filter(b => (b.dueDate || '').startsWith(selectedMonth));

  // Calculate Effective Monthly Net Salary based on Frequency and Discounts
  const calculateEffectiveSalary = () => {
    if (profile.paymentFrequency === 'biweekly') {
      return (Number(profile.firstPaymentAmount) || 0) + (Number(profile.secondPaymentAmount) || 0);
    }
    if (profile.hasDiscounts && Number(profile.grossSalary) > 0) {
      const totalDisc = (profile.discounts || []).reduce((acc, d) => acc + (Number(d.amount) || 0), 0);
      return Math.max(0, Number(profile.grossSalary) - totalDisc);
    }
    return Number(profile.monthlySalary) || 0;
  };

  const effectiveMonthlySalary = calculateEffectiveSalary();

  // Calculations for selected month
  const monthBillsAmount = filteredBills.reduce((acc, b) => acc + (Number(b.amount) || 0), 0);
  const monthPaidBillsAmount = filteredBills.filter(b => b.status === 'paid').reduce((acc, b) => acc + (Number(b.amount) || 0), 0);
  const monthPendingBillsAmount = filteredBills.filter(b => b.status !== 'paid').reduce((acc, b) => acc + (Number(b.amount) || 0), 0);

  // Total debt installments due this month
  const totalDebtInstallmentsMonthly = debts.reduce((acc, d) => acc + (Number(d.installmentAmount) || 0), 0);

  // Total card bills
  const totalCardBills = creditCards.reduce((acc, c) => acc + (Number(c.currentBill) || 0), 0);

  // Total committed expenses for the selected month
  const totalCommittedMonth = monthBillsAmount + totalDebtInstallmentsMonthly + totalCardBills;
  
  // Real Free Cash Flow for the selected month
  const realFreeBalance = effectiveMonthlySalary - totalCommittedMonth;
  const commitmentRate = effectiveMonthlySalary > 0 ? Math.round((totalCommittedMonth / effectiveMonthlySalary) * 100) : 0;

  // Total remaining debt in general
  const totalDebtRemaining = debts.reduce((acc, d) => {
    const total = Number(d.totalAmount) || 0;
    const paid = (Number(d.paidInstallments) || 0) * (Number(d.installmentAmount) || 0);
    return acc + Math.max(0, total - paid);
  }, 0);

  // Save Salary Profile Handler
  const handleSaveSalaryProfile = (e) => {
    if (e) e.preventDefault();

    let computedNet = Number(tempMonthlySalary) || 0;
    if (tempFrequency === 'biweekly') {
      computedNet = (Number(tempFirstAmount) || 0) + (Number(tempSecondAmount) || 0);
    } else if (tempHasDiscounts && Number(tempGrossSalary) > 0) {
      const sumDisc = tempDiscounts.reduce((acc, d) => acc + (Number(d.amount) || 0), 0);
      computedNet = Math.max(0, Number(tempGrossSalary) - sumDisc);
    }

    const updatedProfile = {
      paymentFrequency: tempFrequency,
      monthlySalary: computedNet,
      salaryDay: Number(tempSalaryDay) || 5,
      firstPaymentAmount: Number(tempFirstAmount) || 0,
      firstPaymentDay: Number(tempFirstDay) || 20,
      secondPaymentAmount: Number(tempSecondAmount) || 0,
      secondPaymentDay: Number(tempSecondDay) || 5,
      grossSalary: Number(tempGrossSalary) || 0,
      hasDiscounts: tempHasDiscounts,
      discounts: tempDiscounts
    };

    onUpdateFinanceProfile(updatedProfile);
    setIsSalaryModalOpen(false);
  };

  const handleAddDiscount = () => {
    if (!newDiscountName || !newDiscountAmount) return;
    const newDisc = {
      id: 'disc-' + Date.now(),
      name: newDiscountName,
      amount: Number(newDiscountAmount)
    };
    setTempDiscounts([...tempDiscounts, newDisc]);
    setNewDiscountName('');
    setNewDiscountAmount('');
  };

  const handleRemoveDiscount = (discId) => {
    setTempDiscounts(tempDiscounts.filter(d => d.id !== discId));
  };

  // Add Bill
  const handleAddBill = (e) => {
    e.preventDefault();
    if (!billTitle || !billAmount) return;
    const newBill = {
      id: 'bill-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      title: billTitle,
      amount: Number(billAmount),
      dueDate: billDueDate,
      category: billCategory,
      isRecurring: billRecurring,
      status: 'pending',
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
      id: 'debt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
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
    const salaryDesc = profile.paymentFrequency === 'biweekly'
      ? `Salário Quinzenal: R$ ${(Number(profile.firstPaymentAmount) || 0).toFixed(2)} (Dia ${profile.firstPaymentDay}) + R$ ${(Number(profile.secondPaymentAmount) || 0).toFixed(2)} (Dia ${profile.secondPaymentDay}) = Total Líquido R$ ${effectiveMonthlySalary.toFixed(2)}`
      : `Salário Líquido Mensal: R$ ${effectiveMonthlySalary.toFixed(2)} (Recebimento dia ${profile.salaryDay || 5})`;

    const prompt = `Faça um diagnóstico completo das minhas finanças no Obnotion para o período de ${formatMonthTitle(selectedMonth)}:
- ${salaryDesc}
- Contas a Pagar deste Mês: R$ ${monthBillsAmount.toFixed(2)} (${filteredBills.length} contas cadastradas)
- Dívidas & Empréstimos (Parcelas mensais): R$ ${totalDebtInstallmentsMonthly.toFixed(2)} (Saldo devedor total acumulado: R$ ${totalDebtRemaining.toFixed(2)})
- Faturas de Cartão: R$ ${totalCardBills.toFixed(2)}
- Saldo Livre Real deste Mês: R$ ${realFreeBalance.toFixed(2)} (${commitmentRate}% da renda comprometida).

Por favor, me dê uma orientação direta e prática:
1. Meu planejamento para ${formatMonthTitle(selectedMonth)} está equilibrado com meu fluxo de recebimento?
2. Como devo distribuir o pagamento das contas entre as quinzenas/datas para não passar aperto?
3. O que posso fazer para acelerar a quitação de dívidas e aumentar meu saldo livre?`;

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
            <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">Controle Orçamentário Multi-Mês</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Gestão Financeira & Dívidas
          </h1>
          <p className="text-xs text-zinc-400 max-w-xl">
            Planejamento inteligente com suporte a salário quinzenal, descontos em folha, contas e parcelas.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 z-10">
          <button
            onClick={() => setIsSalaryModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-medium bg-white/[0.04] border border-white/[0.08] hover:border-violet-500/40 hover:bg-white/[0.07] text-zinc-200 transition-all shadow-sm"
          >
            <Wallet className="w-4 h-4 text-violet-400" />
            <div className="text-left">
              <span className="text-[10px] text-zinc-400 block font-mono">
                {profile.paymentFrequency === 'biweekly' ? 'Salário Quinzenal' : 'Salário Líquido'}
              </span>
              <strong className="font-mono text-white text-xs">
                R$ {effectiveMonthlySalary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </strong>
            </div>
            <Edit2 className="w-3.5 h-3.5 text-zinc-400 ml-1.5" />
          </button>

          <button
            onClick={triggerJarvisDiagnosis}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md shadow-violet-600/20 transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200 animate-pulse" />
            <span>Diagnóstico do JARVIS</span>
          </button>
        </div>
      </div>

      {/* MONTH / YEAR NAVIGATOR BAR */}
      <div className={`p-4 rounded-2xl border ${
        darkMode ? 'bg-[#0f1017]/80 border-white/[0.08]' : 'bg-zinc-50 border-zinc-200'
      } flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        {/* Navigation Arrows & Current Month Display */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-300 transition-colors"
            title="Mês Anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-violet-400" />
            <h2 className="text-sm md:text-base font-bold text-white font-mono">
              {viewAllMonths ? 'Visão Geral (Todos os Meses / Anos)' : formatMonthTitle(selectedMonth)}
            </h2>
          </div>

          <button
            onClick={() => navigateMonth(1)}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-300 transition-colors"
            title="Próximo Mês"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setViewAllMonths(!viewAllMonths)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              viewAllMonths 
                ? 'bg-violet-600 text-white font-semibold shadow-sm' 
                : 'bg-white/[0.03] text-zinc-400 border border-white/[0.08] hover:text-zinc-200'
            }`}
          >
            {viewAllMonths ? 'Filtrar por Mês' : 'Ver Todas as Contas'}
          </button>
        </div>

        {/* Quick Month Pills / Projection Timeline */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {availableMonths.map(mStr => {
            const isSelected = selectedMonth === mStr && !viewAllMonths;
            const count = bills.filter(b => (b.dueDate || '').startsWith(mStr)).length;
            const total = bills.filter(b => (b.dueDate || '').startsWith(mStr)).reduce((acc, b) => acc + (Number(b.amount) || 0), 0);

            return (
              <button
                key={mStr}
                onClick={() => {
                  setSelectedMonth(mStr);
                  setViewAllMonths(false);
                }}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-mono whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-violet-600/20 text-violet-300 border border-violet-500/40 font-bold'
                    : 'bg-white/[0.02] text-zinc-400 border border-white/[0.06] hover:bg-white/[0.05] hover:text-zinc-200'
                }`}
              >
                <span>{mStr}</span>
                {count > 0 && (
                  <span className="text-[10px] text-zinc-400 font-normal">
                    (R$ {total.toFixed(0)})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4 Main Cash Flow Metric Cards (for selected month) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Salário Previsto */}
        <div 
          onClick={() => setIsSalaryModalOpen(true)}
          className={`p-5 rounded-2xl border cursor-pointer group transition-all duration-200 ${
            darkMode ? 'bg-[#111219]/70 border-white/[0.07] hover:border-emerald-500/40 hover:bg-[#141520]' : 'bg-white border-zinc-200 hover:border-emerald-500'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
              {profile.paymentFrequency === 'biweekly' ? 'Salário (2 Quinzenas)' : 'Salário Líquido'}
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold font-mono tracking-tight text-white">
            R$ {effectiveMonthlySalary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-[10px] text-zinc-400 mt-2 font-mono truncate">
            {profile.paymentFrequency === 'biweekly'
              ? `1ª Quinzena (Dia ${profile.firstPaymentDay}): R$ ${Number(profile.firstPaymentAmount || 0).toFixed(0)} • 2ª (Dia ${profile.secondPaymentDay}): R$ ${Number(profile.secondPaymentAmount || 0).toFixed(0)}`
              : `Recebimento estimado dia ${profile.salaryDay || 5}`}
          </p>
        </div>

        {/* 2. Contas & Boletos do Mês */}
        <div className={`p-5 rounded-2xl border ${
          darkMode ? 'bg-[#111219]/70 border-white/[0.07]' : 'bg-white border-zinc-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
              {viewAllMonths ? 'Total Geral Contas' : `Contas (${selectedMonth})`}
            </span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold font-mono tracking-tight text-zinc-100">
            R$ {monthBillsAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-[10px] text-zinc-400 mt-2 font-mono flex items-center justify-between">
            <span className="text-emerald-400">Pago: R$ {monthPaidBillsAmount.toFixed(0)}</span>
            <span className="text-amber-400">Pendente: R$ {monthPendingBillsAmount.toFixed(0)}</span>
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
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Saldo Livre Previsto</span>
            <div className={`p-1.5 rounded-lg ${realFreeBalance >= 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <h3 className={`text-2xl font-bold font-mono tracking-tight ${realFreeBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            R$ {realFreeBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-[10px] text-zinc-400 mt-2 font-mono">
            {commitmentRate}% da sua renda comprometida em {selectedMonth}
          </p>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center space-x-1 border-b border-white/[0.08] pb-1 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Visão Geral', count: null },
          { id: 'bills', label: 'Contas & Boletos', count: filteredBills.length },
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
          {/* Left: Bills of Selected Month & Debts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Bill Checklist */}
            <div className={`p-6 rounded-2xl border ${
              darkMode ? 'bg-[#101118]/60 border-white/[0.08]' : 'bg-white border-zinc-200'
            } space-y-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold tracking-tight text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    Contas de {viewAllMonths ? 'Todos os Períodos' : formatMonthTitle(selectedMonth)}
                  </h3>
                  <p className="text-[11px] text-zinc-500 font-mono">
                    Total deste mês: R$ {monthBillsAmount.toFixed(2)} ({filteredBills.length} faturas/contas)
                  </p>
                </div>
                <button
                  onClick={() => setIsBillModalOpen(true)}
                  className="flex items-center gap-1 text-xs font-medium text-violet-400 hover:text-violet-300"
                >
                  <Plus className="w-3.5 h-3.5" /> Adicionar Conta
                </button>
              </div>

              <div className="space-y-2 max-h-[420px] overflow-y-auto no-scrollbar">
                {filteredBills.map(b => (
                  <div
                    key={b.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                      b.status === 'paid' 
                        ? 'bg-white/[0.01] border-white/[0.04] text-zinc-500 opacity-75' 
                        : 'bg-white/[0.03] border-white/[0.06] text-zinc-200 hover:border-white/[0.12]'
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
                          Vencimento: {b.dueDate} • {b.category}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
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
                      <button
                        onClick={() => handleDeleteBill(b.id)}
                        className="p-1 text-zinc-600 hover:text-rose-400"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                {filteredBills.length === 0 && (
                  <div className="py-8 text-center border border-dashed border-white/[0.06] rounded-xl">
                    <p className="text-xs text-zinc-500">Nenhuma conta cadastrada para {formatMonthTitle(selectedMonth)}.</p>
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
                <span>Estratégia para {formatMonthTitle(selectedMonth)}</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {monthBillsAmount > 0 
                  ? `Para ${formatMonthTitle(selectedMonth)}, você tem R$ ${monthBillsAmount.toFixed(2)} em contas previstas. Seu saldo livre restante estimado é de R$ ${realFreeBalance.toFixed(2)}.`
                  : `Nenhuma conta cadastrada para ${formatMonthTitle(selectedMonth)}. Use o botão abaixo ou anexe as fotos de faturas no JARVIS para preencher os meses futuros!`
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white">Contas a Pagar & Boletos ({viewAllMonths ? 'Todos os Meses' : formatMonthTitle(selectedMonth)})</h3>
              <p className="text-xs text-zinc-400">Controle rigoroso de vencimentos e faturas por mês.</p>
            </div>
            <button
              onClick={() => setIsBillModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium transition-all self-start"
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
                {filteredBills.map(b => (
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
                    <td className="py-3 px-3 font-mono text-zinc-300">{b.dueDate}</td>
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
            {filteredBills.length === 0 && (
              <div className="py-12 text-center text-xs text-zinc-500">
                Nenhuma conta encontrada para {formatMonthTitle(selectedMonth)}.
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
      
      {/* 1. Comprehensive Salary Profile Modal (Monthly, Biweekly & Discounts) */}
      {isSalaryModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveSalaryProfile} className="w-full max-w-lg p-6 rounded-2xl bg-[#141520] border border-white/[0.1] space-y-4 text-xs max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-violet-400" />
                  Configuração Salarial & Holerite
                </h3>
                <p className="text-[11px] text-zinc-400">Defina como você recebe seu salário e seus descontos em folha.</p>
              </div>
              <button type="button" onClick={() => setIsSalaryModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Frequency Selection Tabs */}
            <div className="space-y-1.5">
              <label className="block text-zinc-300 font-semibold text-[11px]">Como você recebe seu salário?</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTempFrequency('monthly')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    tempFrequency === 'monthly'
                      ? 'bg-violet-600/15 border-violet-500/40 text-violet-200'
                      : 'bg-black/30 border-white/[0.08] text-zinc-400 hover:bg-white/[0.03]'
                  }`}
                >
                  <p className="font-bold text-xs text-white">Mensal (1x ao mês)</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Recebe o valor total de uma vez</p>
                </button>

                <button
                  type="button"
                  onClick={() => setTempFrequency('biweekly')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    tempFrequency === 'biweekly'
                      ? 'bg-violet-600/15 border-violet-500/40 text-violet-200'
                      : 'bg-black/30 border-white/[0.08] text-zinc-400 hover:bg-white/[0.03]'
                  }`}
                >
                  <p className="font-bold text-xs text-white">Quinzenal (2x ao mês)</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Adiantamento + Pagamento final</p>
                </button>
              </div>
            </div>

            {/* IF MONTHLY */}
            {tempFrequency === 'monthly' && (
              <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-300 font-mono mb-1">
                      {tempHasDiscounts ? 'Salário Líquido Calculado:' : 'Salário Líquido (R$):'}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required={!tempHasDiscounts}
                      disabled={tempHasDiscounts}
                      value={tempHasDiscounts 
                        ? Math.max(0, (Number(tempGrossSalary) || 0) - tempDiscounts.reduce((a, d) => a + (Number(d.amount) || 0), 0))
                        : tempMonthlySalary}
                      onChange={e => setTempMonthlySalary(e.target.value)}
                      placeholder="Ex: 3500.00"
                      className="w-full p-2.5 rounded-xl bg-black/50 border border-white/[0.1] text-white outline-none font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-300 font-mono mb-1">Dia do Recebimento:</label>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      required
                      value={tempSalaryDay}
                      onChange={e => setTempSalaryDay(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-black/50 border border-white/[0.1] text-white outline-none font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* IF BIWEEKLY (QUINZENAL) */}
            {tempFrequency === 'biweekly' && (
              <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {/* 1st Payment */}
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-2">
                    <span className="text-[11px] font-bold text-violet-300 block">1ª Quinzena (Adiantamento)</span>
                    <div>
                      <label className="block text-zinc-400 font-mono text-[10px] mb-1">Valor (R$):</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={tempFirstAmount}
                        onChange={e => setTempFirstAmount(e.target.value)}
                        placeholder="Ex: 1400.00"
                        className="w-full p-2 rounded-lg bg-black/50 border border-white/[0.1] text-white outline-none font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 font-mono text-[10px] mb-1">Dia do Mês:</label>
                      <input
                        type="number"
                        min="1"
                        max="31"
                        required
                        value={tempFirstDay}
                        onChange={e => setTempFirstDay(e.target.value)}
                        placeholder="Ex: 20"
                        className="w-full p-2 rounded-lg bg-black/50 border border-white/[0.1] text-white outline-none font-mono text-xs"
                      />
                    </div>
                  </div>

                  {/* 2nd Payment */}
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-2">
                    <span className="text-[11px] font-bold text-emerald-300 block">2ª Quinzena (Saldo Final)</span>
                    <div>
                      <label className="block text-zinc-400 font-mono text-[10px] mb-1">Valor (R$):</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={tempSecondAmount}
                        onChange={e => setTempSecondAmount(e.target.value)}
                        placeholder="Ex: 2100.00"
                        className="w-full p-2 rounded-lg bg-black/50 border border-white/[0.1] text-white outline-none font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 font-mono text-[10px] mb-1">Dia do Mês:</label>
                      <input
                        type="number"
                        min="1"
                        max="31"
                        required
                        value={tempSecondDay}
                        onChange={e => setTempSecondDay(e.target.value)}
                        placeholder="Ex: 5"
                        className="w-full p-2 rounded-lg bg-black/50 border border-white/[0.1] text-white outline-none font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-center font-mono text-xs text-violet-200">
                  Total Líquido do Mês: <strong>R$ {((Number(tempFirstAmount) || 0) + (Number(tempSecondAmount) || 0)).toFixed(2)}</strong>
                </div>
              </div>
            )}

            {/* OPTIONAL: DISCOUNTS & GROSS SALARY ACCORDION */}
            {tempFrequency === 'monthly' && (
              <div className="border border-white/[0.08] rounded-xl p-3.5 space-y-3 bg-white/[0.01]">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-zinc-200 font-bold text-xs flex items-center gap-1.5">
                      <Receipt className="w-3.5 h-3.5 text-amber-400" />
                      Detalhar Salário Bruto & Descontos (Holerite)
                    </label>
                    <p className="text-[10px] text-zinc-400">INSS, VT, VR, Plano de Saúde, Consignado, etc.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={tempHasDiscounts}
                    onChange={e => setTempHasDiscounts(e.target.checked)}
                    className="w-4 h-4 accent-violet-500 rounded cursor-pointer"
                  />
                </div>

                {tempHasDiscounts && (
                  <div className="space-y-3 pt-2 border-t border-white/[0.06] animate-fade-in">
                    <div>
                      <label className="block text-zinc-400 font-mono text-[11px] mb-1">Salário Bruto (R$):</label>
                      <input
                        type="number"
                        step="0.01"
                        value={tempGrossSalary}
                        onChange={e => setTempGrossSalary(e.target.value)}
                        placeholder="Ex: 4200.00"
                        className="w-full p-2.5 rounded-xl bg-black/50 border border-white/[0.1] text-white outline-none font-mono text-xs"
                      />
                    </div>

                    {/* Discounts List */}
                    <div className="space-y-2">
                      <label className="block text-zinc-400 font-mono text-[11px]">Descontos em Folha:</label>
                      
                      <div className="space-y-1.5">
                        {tempDiscounts.map(d => (
                          <div key={d.id} className="p-2 rounded-lg bg-black/40 border border-white/[0.04] flex items-center justify-between text-xs">
                            <span className="text-zinc-300">{d.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-rose-400 font-bold">- R$ {Number(d.amount).toFixed(2)}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveDiscount(d.id)}
                                className="text-zinc-500 hover:text-rose-400"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add Discount Input Group */}
                      <div className="grid grid-cols-12 gap-2 pt-1">
                        <input
                          type="text"
                          value={newDiscountName}
                          onChange={e => setNewDiscountName(e.target.value)}
                          placeholder="Nome (ex: INSS, VT, Unimed)"
                          className="col-span-6 p-2 rounded-lg bg-black/50 border border-white/[0.1] text-white text-xs outline-none"
                        />
                        <input
                          type="number"
                          step="0.01"
                          value={newDiscountAmount}
                          onChange={e => setNewDiscountAmount(e.target.value)}
                          placeholder="Valor R$"
                          className="col-span-4 p-2 rounded-lg bg-black/50 border border-white/[0.1] text-white text-xs font-mono outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleAddDiscount}
                          className="col-span-2 p-2 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-white flex items-center justify-center transition-colors"
                          title="Adicionar Desconto"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs tracking-wide shadow-md shadow-violet-600/30 transition-all active:scale-95"
            >
              Salvar Configuração Salarial
            </button>
          </form>
        </div>
      )}

      {/* 2. Add Bill Modal */}
      {isBillModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddBill} className="w-full max-w-md p-6 rounded-2xl bg-[#141520] border border-white/[0.1] space-y-4 text-xs shadow-2xl">
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
                placeholder="Ex: Fatura Nubank Jan/2027, Aluguel, Luz"
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
                {['Cartão de Crédito', 'Moradia', 'Alimentação', 'Transporte', 'Saúde', 'Educação', 'Lazer', 'Assinaturas', 'Outros'].map(c => (
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
          <form onSubmit={handleAddDebt} className="w-full max-w-md p-6 rounded-2xl bg-[#141520] border border-white/[0.1] space-y-4 text-xs shadow-2xl">
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
          <form onSubmit={handleAddCard} className="w-full max-w-md p-6 rounded-2xl bg-[#141520] border border-white/[0.1] space-y-4 text-xs shadow-2xl">
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
          <form onSubmit={handleAddTx} className="w-full max-w-md p-6 rounded-2xl bg-[#141520] border border-white/[0.1] space-y-4 text-xs shadow-2xl">
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
          <form onSubmit={handleAddGoal} className="w-full max-w-md p-6 rounded-2xl bg-[#141520] border border-white/[0.1] space-y-4 text-xs shadow-2xl">
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
