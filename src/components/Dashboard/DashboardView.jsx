import React, { useState, useRef } from 'react';
import {
  Sparkles,
  ArrowUp,
  Mic,
  MicOff,
  Plus,
  Calendar,
  FileText,
  BarChart3,
  Bot,
  CheckSquare,
  BookOpen,
  DollarSign,
  ChevronRight,
  TrendingUp,
  X,
  Clock,
  Compass,
  Lightbulb,
  ArrowRight
} from 'lucide-react';

export default function DashboardView({
  data = {},
  user,
  onNavigate,
  onUpdateTasks,
  onUpdateHabits,
  onUpdateSection,
  onAskJarvis,
  onOpenPomodoro,
  darkMode
}) {
  const [universalInput, setUniversalInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState(null);
  const [isRadarModalOpen, setIsRadarModalOpen] = useState(false);
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const currentHour = today.getHours();

  // Dynamic Greeting based on time and logged-in user
  const greeting = currentHour < 12 ? 'Bom dia' : currentHour < 18 ? 'Boa tarde' : 'Boa noite';
  const getDisplayName = () => {
    if (user?.displayName && user.displayName.trim()) return user.displayName.trim().split(' ')[0];
    if (user?.email && user.email.trim()) return user.email.trim().split('@')[0];
    if (data?.profile?.name && data.profile.name.trim()) return data.profile.name.trim().split(' ')[0];
    if (data?.settings?.userName && data.settings.userName.trim()) return data.settings.userName.trim().split(' ')[0];
    return '';
  };
  const userName = getDisplayName();

  // Workspace Data Extraction
  const tasks = data?.tasks || [];
  const habits = data?.habits || [];
  const notes = data?.notes || [];
  const calendarEvents = data?.calendarEvents || [];
  const books = data?.books || [];
  const bills = data?.bills || [];
  const profile = data?.financeProfile || { monthlySalary: 0, salaryDay: 5 };
  const debts = data?.debts || [];
  const creditCards = data?.creditCards || [];

  // Filter Tasks
  const pendingTasks = tasks.filter(t => t.status !== 'done');
  const todayTasks = pendingTasks.filter(t => t.dueDate === todayStr);
  const overdueTasks = pendingTasks.filter(t => t.dueDate && t.dueDate < todayStr);
  const highPriorityTasks = pendingTasks.filter(t => t.priority === 'high' || t.priority === 'urgent');

  // Filter Events & Habits
  const todayEvents = calendarEvents.filter(e => e.date === todayStr);
  const habitsPendingToday = habits.filter(h => !h.history || !h.history[todayStr]);
  const currentBook = books.find(b => b.status === 'reading');
  const urgentBills = bills.filter(b => b.status === 'pending' && b.dueDate && b.dueDate <= todayStr);

  // Financial Balance Estimation
  const totalBills = bills.reduce((acc, b) => acc + (Number(b.amount) || 0), 0);
  const totalDebtMonthly = debts.reduce((acc, d) => acc + (Number(d.installmentAmount) || 0), 0);
  const totalCards = creditCards.reduce((acc, c) => acc + (Number(c.currentBill) || 0), 0);
  const freeBalance = (Number(profile.monthlySalary) || 0) - (totalBills + totalDebtMonthly + totalCards);

  // 1. RADAR DO DIA - Intelligent Intensity Analysis
  const intensityScore = 
    (overdueTasks.length * 2.5) +
    (todayEvents.length * 2.0) +
    (highPriorityTasks.length * 1.5) +
    (todayTasks.length * 1.0) +
    (urgentBills.length * 1.5) +
    (habitsPendingToday.length * 0.3);

  let radarLevel = 'green'; // 'red' | 'yellow' | 'green'
  let radarTitle = 'Dia Tranquilo';
  let radarBadgeBg = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
  let radarDotColor = 'bg-emerald-400';
  let radarSummary = '';

  if (intensityScore >= 6.5 || overdueTasks.length >= 2 || (todayEvents.length >= 2 && highPriorityTasks.length >= 1)) {
    radarLevel = 'red';
    radarTitle = 'Dia Pesado';
    radarBadgeBg = 'bg-rose-500/15 text-rose-400 border-rose-500/30';
    radarDotColor = 'bg-rose-400';

    const reasons = [];
    if (overdueTasks.length > 0) reasons.push(`${overdueTasks.length} tarefa(s) atrasada(s)`);
    if (todayEvents.length > 0) reasons.push(`${todayEvents.length} compromisso(s) no calendário`);
    if (highPriorityTasks.length > 0) reasons.push(`${highPriorityTasks.length} tarefa(s) de alta prioridade`);
    if (urgentBills.length > 0) reasons.push(`${urgentBills.length} conta(s) no vencimento`);

    radarSummary = `Hoje será um dia mais intenso. Você tem ${reasons.join(', ')}. O tempo livre será escasso, então comece pelas prioridades críticas antes de abrir novas demandas.`;
  } else if (intensityScore >= 3.0 || todayTasks.length >= 2 || todayEvents.length >= 1) {
    radarLevel = 'yellow';
    radarTitle = 'Dia Moderado';
    radarBadgeBg = 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    radarDotColor = 'bg-amber-400';

    const countTasks = todayTasks.length || pendingTasks.slice(0, 3).length;
    const countEvents = todayEvents.length;
    radarSummary = `Hoje será um dia equilibrado. Você tem ${countEvents > 0 ? `${countEvents} compromisso(s) e ` : ''}${countTasks} tarefa(s) para focar. Existem janelas livres para avançar com tranquilidade nos seus projetos.`;
  } else {
    radarLevel = 'green';
    radarTitle = 'Dia Leve';
    radarBadgeBg = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    radarDotColor = 'bg-emerald-400';

    if (currentBook) {
      radarSummary = `Sua agenda está tranquila hoje com poucos compromissos. Excelente momento para colocar a leitura de "${currentBook.title}" em dia, adiantar hábitos ou planejar a semana.`;
    } else {
      radarSummary = `Sua agenda está livre e sem pressões imediatas. Aproveite a calma para colocar seus hábitos em dia, organizar suas notas ou descansar.`;
    }
  }

  // 2. SE EU FOSSE VOCÊ - Top Priorities
  const recommendations = [];
  if (overdueTasks.length > 0) {
    const topOverdue = overdueTasks[0];
    recommendations.push({
      id: 'rec-1',
      tag: 'Atrasada',
      tagColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      title: topOverdue.title,
      subtitle: `Venceu em ${topOverdue.dueDate?.split('-').reverse().slice(0, 2).join('/')} • Resolver primeiro`,
      type: 'task',
      targetId: topOverdue.id,
      actionText: 'Concluir',
      actionTab: 'tasks'
    });
  } else if (highPriorityTasks.length > 0) {
    const topHigh = highPriorityTasks[0];
    recommendations.push({
      id: 'rec-1',
      tag: 'Alta Prioridade',
      tagColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
      title: topHigh.title,
      subtitle: `Prazo: ${topHigh.dueDate ? topHigh.dueDate.split('-').reverse().slice(0, 2).join('/') : 'Hoje'} • Maior impacto`,
      type: 'task',
      targetId: topHigh.id,
      actionText: 'Concluir',
      actionTab: 'tasks'
    });
  } else if (todayTasks.length > 0) {
    const topToday = todayTasks[0];
    recommendations.push({
      id: 'rec-1',
      tag: 'Foco de Hoje',
      tagColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      title: topToday.title,
      subtitle: 'Tarefa agendada para hoje',
      type: 'task',
      targetId: topToday.id,
      actionText: 'Concluir',
      actionTab: 'tasks'
    });
  } else {
    recommendations.push({
      id: 'rec-1',
      tag: 'Planejamento',
      tagColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      title: 'Definir prioridades da semana',
      subtitle: 'Sem tarefas pendentes imediatas. Defina suas próximas metas.',
      type: 'custom',
      actionText: 'Ver Tarefas',
      actionTab: 'tasks'
    });
  }

  // Toast notification helper
  const showToast = (message) => {
    setFeedbackToast(message);
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  // Speech Recognition
  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Seu navegador não suporta reconhecimento de voz direto. Use o campo de texto.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      const recog = new SpeechRecognition();
      recog.lang = 'pt-BR';
      recog.continuous = false;
      recog.interimResults = false;
      recognitionRef.current = recog;
      setIsListening(true);

      recog.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setUniversalInput(transcript);
        setIsListening(false);
        processUniversalCapture(transcript);
      };

      recog.onerror = () => setIsListening(false);
      recog.onend = () => setIsListening(false);
      recog.start();
    }
  };

  // Dispatch Universal Capture through JARVIS
  const processUniversalCapture = async (textToProcess = universalInput) => {
    const text = textToProcess.trim();
    if (!text) return;

    setIsProcessing(true);
    setUniversalInput('');

    try {
      if (onAskJarvis) {
        onAskJarvis(text);
        showToast(`⚡ JARVIS processando: "${text.length > 35 ? text.slice(0, 32) + '...' : text}"`);
      } else {
        const newTask = {
          id: 'task-' + Date.now(),
          title: text,
          status: 'todo',
          priority: 'medium',
          dueDate: todayStr,
          tags: ['Captura Universal']
        };
        if (onUpdateTasks) onUpdateTasks([newTask, ...(data.tasks || [])]);
        showToast(`✓ Item salvo com sucesso!`);
      }
    } catch (e) {
      console.error(e);
      if (onAskJarvis) onAskJarvis(text);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRecAction = (rec) => {
    if (rec.type === 'task' && rec.targetId) {
      if (onUpdateTasks) {
        onUpdateTasks(tasks.map(t => t.id === rec.targetId ? { ...t, status: 'done' } : t));
        showToast('✓ Tarefa concluída!');
      }
    } else if (rec.actionTab && onNavigate) {
      onNavigate(rec.actionTab);
    }
  };

  // Quick Action Buttons
  const quickActions = [
    {
      id: 'task',
      label: 'Criar tarefa',
      icon: Plus,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10 border-violet-500/20',
      action: () => {
        setUniversalInput('Nova tarefa: ');
        inputRef.current?.focus();
      }
    },
    {
      id: 'event',
      label: 'Agendar compromisso',
      icon: Calendar,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
      action: () => {
        setUniversalInput('Agendar compromisso para ');
        inputRef.current?.focus();
      }
    },
    {
      id: 'note',
      label: 'Nova anotação',
      icon: FileText,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10 border-yellow-500/20',
      action: () => {
        setUniversalInput('Anotar insight: ');
        inputRef.current?.focus();
      }
    },
    {
      id: 'summary',
      label: 'Ver resumo do dia',
      icon: BarChart3,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
      action: () => setIsRadarModalOpen(true)
    }
  ];

  // 6 Apple-style Quick Access Cards
  const accessCards = [
    {
      id: 'ia',
      title: 'IA Integrada',
      subtitle: 'Compreende, aprende e ajuda você.',
      icon: Bot,
      color: 'text-violet-400',
      bg: 'bg-violet-500/15 border-violet-500/25',
      onClick: () => onAskJarvis && onAskJarvis('Olá JARVIS! O que você me recomenda focar hoje?')
    },
    {
      id: 'tasks',
      title: 'Tarefas',
      subtitle: 'Organize, priorize e realize mais.',
      icon: CheckSquare,
      color: 'text-amber-400',
      bg: 'bg-amber-500/15 border-amber-500/25',
      onClick: () => onNavigate && onNavigate('tasks')
    },
    {
      id: 'calendar',
      title: 'Agenda',
      subtitle: 'Todos os seus compromissos em um só lugar.',
      icon: Calendar,
      color: 'text-purple-400',
      bg: 'bg-purple-500/15 border-purple-500/25',
      onClick: () => onNavigate && onNavigate('calendar')
    },
    {
      id: 'notes',
      title: 'Anotações',
      subtitle: 'Capture ideias e tenha tudo à mão.',
      icon: FileText,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/15 border-yellow-500/25',
      onClick: () => onNavigate && onNavigate('notes')
    },
    {
      id: 'books',
      title: 'Livros',
      subtitle: 'Acompanhe suas leituras e aprendizados.',
      icon: BookOpen,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/15 border-emerald-500/25',
      onClick: () => onNavigate && onNavigate('books')
    },
    {
      id: 'finance',
      title: 'Finanças',
      subtitle: 'Tenha clareza e controle total.',
      icon: DollarSign,
      color: 'text-rose-400',
      bg: 'bg-rose-500/15 border-rose-500/25',
      onClick: () => onNavigate && onNavigate('finance')
    }
  ];

  return (
    <div className="w-full min-h-screen bg-[#07080d] text-white flex flex-col items-center px-4 md:px-8 py-6 md:py-8 relative overflow-hidden select-none">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-violet-600/10 via-cyan-500/10 to-pink-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Toast Notification */}
      {feedbackToast && (
        <div className="fixed top-5 z-50 animate-bounce-in">
          <div className="px-4 py-2.5 rounded-2xl bg-[#141522]/95 border border-violet-500/40 text-xs text-white shadow-2xl backdrop-blur-xl flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-400 animate-spin" />
            <span>{feedbackToast}</span>
          </div>
        </div>
      )}

      {/* Top Header Row (Radar do Dia Pill on Left) */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-6 md:mb-8">
        <button
          onClick={() => setIsRadarModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12131e]/90 hover:bg-[#1a1c2c] border border-white/[0.08] hover:border-violet-500/40 text-xs text-zinc-300 font-medium transition-all shadow-lg backdrop-blur-xl group"
        >
          <span className={`w-2 h-2 rounded-full ${radarDotColor} animate-pulse`} />
          <span>Radar do dia</span>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 group-hover:translate-x-0.5 transition-all" />
        </button>
      </div>

      {/* Main Hero Container */}
      <div className="w-full max-w-2xl flex flex-col items-center text-center space-y-6 md:space-y-8">
        {/* Apple-style Greeting Headline */}
        <div className="space-y-1">
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white">
            {greeting}
            {userName ? (
              <>
                ,{' '}
                <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent font-extrabold">
                  {userName}.
                </span>
              </>
            ) : '.'}
          </h1>
          <p className="text-lg md:text-2xl font-medium text-zinc-300 tracking-tight">
            Como posso te ajudar hoje?
          </p>
        </div>

        {/* Luminous Siri Intelligence Orb */}
        <div
          onClick={() => onAskJarvis ? onAskJarvis('Olá JARVIS! Como está meu dia e o que devo priorizar agora?') : toggleListening()}
          className="siri-orb-outer my-2 group"
          title="Clique para falar ou conversar com o JARVIS"
        >
          <div className="siri-glow-bg" />
          <div className="siri-sphere">
            <div className="siri-fluid-layer" />
            <div className="siri-inner-core" />
          </div>
        </div>

        {/* Apple-style Omnibar Pill */}
        <div className="w-full">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              processUniversalCapture();
            }}
            className={`relative flex items-center rounded-full border transition-all duration-300 shadow-2xl backdrop-blur-2xl px-2 py-1.5 ${
              isListening
                ? 'ring-2 ring-violet-500 border-violet-400 bg-violet-950/40'
                : 'bg-[#10111a]/85 border-white/[0.12] hover:border-white/[0.2] focus-within:border-violet-500/70 focus-within:bg-[#141524]'
            }`}
          >
            {/* Sparkle or Voice Wave Icon */}
            <div className="pl-3.5 pr-2 text-zinc-400">
              <Sparkles className="w-5 h-5 text-zinc-300" />
            </div>

            <input
              ref={inputRef}
              type="text"
              value={universalInput}
              onChange={(e) => setUniversalInput(e.target.value)}
              placeholder={isListening ? 'Ouvindo sua voz...' : 'Fale ou escreva qualquer coisa...'}
              className="w-full py-2.5 bg-transparent text-sm md:text-base outline-none text-zinc-100 placeholder:text-zinc-500 font-normal"
              disabled={isProcessing}
            />

            {/* Voice & Submit Buttons */}
            <div className="flex items-center gap-1.5 pr-1">
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2 rounded-full transition-all duration-200 ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/40'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.08]'
                }`}
                title={isListening ? 'Parar' : 'Falar por voz'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                type="submit"
                disabled={!universalInput.trim() && !isProcessing}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                  universalInput.trim()
                    ? 'bg-gradient-to-tr from-violet-600 to-indigo-500 text-white shadow-lg shadow-violet-500/40 hover:scale-105 active:scale-95'
                    : 'bg-violet-600/30 text-violet-300/40 cursor-not-allowed'
                }`}
                title="Enviar para o JARVIS"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </form>

          {/* Quick Action 4 Rounded Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
            {quickActions.map((qa) => {
              const Icon = qa.icon;
              return (
                <button
                  key={qa.id}
                  onClick={qa.action}
                  className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#10111a]/70 hover:bg-[#151624] border border-white/[0.06] hover:border-white/[0.15] text-xs text-zinc-300 font-medium transition-all shadow-sm group text-left"
                >
                  <div className={`w-8 h-8 rounded-xl ${qa.bg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                    <Icon className={`w-4 h-4 ${qa.color}`} />
                  </div>
                  <span className="truncate leading-tight text-[11px] md:text-xs">
                    {qa.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid: Acesso Rápido (6 Cards) */}
      <div className="w-full max-w-4xl mt-12 md:mt-16 space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-semibold text-zinc-400 tracking-wider">
            Acesso rápido
          </h2>
          <button
            onClick={() => onNavigate && onNavigate('settings')}
            className="text-[11px] text-violet-400 hover:text-violet-300 transition-colors"
          >
            Editar
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {accessCards.map((card) => {
            const CardIcon = card.icon;
            return (
              <div
                key={card.id}
                onClick={card.onClick}
                className="p-4 rounded-2xl bg-[#0f1018]/80 hover:bg-[#141522] border border-white/[0.06] hover:border-white/[0.14] cursor-pointer transition-all duration-200 shadow-md flex items-start gap-3.5 group"
              >
                <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                  <CardIcon className={`w-5 h-5 ${card.color}`} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-white tracking-tight group-hover:text-violet-300 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5 leading-snug">
                    {card.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: Seu dia, resumido */}
      <div className="w-full max-w-4xl mt-8 space-y-3 pb-16">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-semibold text-zinc-400 tracking-wider">
            Seu dia, resumido
          </h2>
          <button
            onClick={() => onNavigate && onNavigate('productivity')}
            className="text-[11px] text-violet-400 hover:text-violet-300 transition-colors"
          >
            Ver tudo
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Tarefas Card with Progress Ring */}
          <div
            onClick={() => onNavigate && onNavigate('tasks')}
            className="p-4 rounded-2xl bg-[#0f1018]/80 hover:bg-[#141522] border border-white/[0.06] hover:border-white/[0.14] transition-all cursor-pointer flex items-center gap-4"
          >
            <div className="w-11 h-11 rounded-full border-4 border-cyan-500/30 border-t-cyan-400 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold font-mono text-cyan-300">
                {pendingTasks.length}
              </span>
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                {pendingTasks.length} Tarefas
              </div>
              <div className="text-xs text-zinc-400">
                {todayTasks.length} para hoje
              </div>
            </div>
          </div>

          {/* Agenda Card */}
          <div
            onClick={() => onNavigate && onNavigate('calendar')}
            className="p-4 rounded-2xl bg-[#0f1018]/80 hover:bg-[#141522] border border-white/[0.06] hover:border-white/[0.14] transition-all cursor-pointer flex items-center gap-4"
          >
            <div className="w-11 h-11 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center shrink-0 text-purple-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                {todayEvents.length} Compromissos
              </div>
              <div className="text-xs text-zinc-400">
                agendados hoje
              </div>
            </div>
          </div>

          {/* Finanças Card */}
          <div
            onClick={() => onNavigate && onNavigate('finance')}
            className="p-4 rounded-2xl bg-[#0f1018]/80 hover:bg-[#141522] border border-white/[0.06] hover:border-white/[0.14] transition-all cursor-pointer flex items-center gap-4"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                R$ {freeBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-emerald-400 flex items-center gap-1">
                <span>Saldo livre projetado</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RADAR DO DIA MODAL (DETAILED DIAGNOSTIC & SE EU FOSSE VOCÊ) */}
      {isRadarModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-xl bg-[#11121d] border border-white/[0.1] rounded-3xl p-6 shadow-2xl space-y-5 relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-violet-400" />
                <h3 className="text-base font-bold text-white">
                  Radar do Dia & Recomendações
                </h3>
              </div>
              <button
                onClick={() => setIsRadarModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-xl hover:bg-white/[0.08]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Radar Intensity Badge & Narrative */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                  Intensidade do Dia:
                </span>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold font-mono tracking-wide ${radarBadgeBg}`}>
                  <span className={`w-2 h-2 rounded-full ${radarDotColor} animate-pulse`} />
                  <span>{radarTitle}</span>
                </div>
              </div>
              <p className="text-xs md:text-sm text-zinc-200 leading-relaxed">
                {radarSummary}
              </p>
            </div>

            {/* Se Eu Fosse Você */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                  Se Eu Fosse Você (Prioridades)
                </span>
              </div>

              {recommendations.map((rec, index) => (
                <div
                  key={rec.id}
                  className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-white/[0.06] text-zinc-400 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded border ${rec.tagColor}`}>
                          {rec.tag}
                        </span>
                        <h4 className="text-xs font-semibold text-zinc-200 truncate">
                          {rec.title}
                        </h4>
                      </div>
                      <p className="text-[10px] text-zinc-400 mt-0.5 truncate">
                        {rec.subtitle}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      handleRecAction(rec);
                      setIsRadarModalOpen(false);
                    }}
                    className="px-2.5 py-1 rounded-xl bg-violet-600/20 hover:bg-violet-600 text-violet-300 hover:text-white border border-violet-500/30 text-[11px] font-medium transition-all shrink-0"
                  >
                    {rec.actionText}
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  setIsRadarModalOpen(false);
                  if (onAskJarvis) onAskJarvis('Faça uma análise profunda da minha semana e me dê conselhos estratégicos.');
                }}
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-lg shadow-violet-600/30 transition-all flex items-center gap-1.5"
              >
                Pedir Conselho ao JARVIS <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
