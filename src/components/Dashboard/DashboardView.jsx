import React, { useState, useEffect, useRef } from 'react';
import {
  BrainCircuit,
  Mic,
  MicOff,
  Send,
  Sparkles,
  ArrowRight,
  Clock,
  Compass,
  Lightbulb
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

  // 1. RADAR DO DIA - Intelligent Intensity & Context Analysis
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

  // 2. SE EU FOSSE VOCÊ - Top 3 Contextual Priorities
  const recommendations = [];

  // Priority 1: Overdue Task or Most Urgent Task
  if (overdueTasks.length > 0) {
    const topOverdue = overdueTasks[0];
    recommendations.push({
      id: 'rec-1',
      tag: 'Atrasada',
      tagColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      title: topOverdue.title,
      subtitle: `Venceu em ${topOverdue.dueDate?.split('-').reverse().slice(0, 2).join('/')} • Recomendo resolver antes de tudo`,
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
      subtitle: `Prazo: ${topHigh.dueDate ? topHigh.dueDate.split('-').reverse().slice(0, 2).join('/') : 'Hoje'} • Maior impacto no seu dia`,
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

  // Priority 2: Urgent Bill / Calendar Event / Second Task
  if (urgentBills.length > 0) {
    const topBill = urgentBills[0];
    recommendations.push({
      id: 'rec-2',
      tag: 'Financeiro',
      tagColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      title: `Pagar ${topBill.title} (R$ ${Number(topBill.amount).toFixed(2)})`,
      subtitle: `Vencimento: ${topBill.dueDate?.split('-').reverse().slice(0, 2).join('/')} • Evite juros e atrasos`,
      type: 'bill',
      targetId: topBill.id,
      actionText: 'Ver Finanças',
      actionTab: 'finance'
    });
  } else if (todayEvents.length > 0) {
    const topEvent = todayEvents[0];
    recommendations.push({
      id: 'rec-2',
      tag: 'Compromisso',
      tagColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
      title: topEvent.title,
      subtitle: `Horário: ${topEvent.time || 'Durante o dia'} • Prepare-se com antecedência`,
      type: 'event',
      actionText: 'Ver Agenda',
      actionTab: 'calendar'
    });
  } else if (pendingTasks.length > 1) {
    const secondTask = pendingTasks.find(t => t.id !== recommendations[0]?.targetId) || pendingTasks[1];
    recommendations.push({
      id: 'rec-2',
      tag: 'Próxima Ação',
      tagColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
      title: secondTask.title,
      subtitle: `Categoria: ${secondTask.tags?.[0] || 'Geral'}`,
      type: 'task',
      targetId: secondTask.id,
      actionText: 'Concluir',
      actionTab: 'tasks'
    });
  } else {
    recommendations.push({
      id: 'rec-2',
      tag: 'Estudo & Reflexão',
      tagColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      title: 'Anotar ideias ou estudos',
      subtitle: 'Registre insights no bloco de notas para estruturar novos projetos.',
      type: 'custom',
      actionText: 'Abrir Notas',
      actionTab: 'notes'
    });
  }

  // Priority 3: Habit / Reading / Health
  if (habitsPendingToday.length > 0) {
    const topHabit = habitsPendingToday[0];
    recommendations.push({
      id: 'rec-3',
      tag: 'Hábito do Dia',
      tagColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      title: `${topHabit.icon || '⚡'} ${topHabit.name}`,
      subtitle: 'Mantenha a sua sequência de consistência diária',
      type: 'habit',
      targetId: topHabit.id,
      actionText: 'Marcar Feito',
      actionTab: 'habits'
    });
  } else if (currentBook) {
    recommendations.push({
      id: 'rec-3',
      tag: 'Leitura',
      tagColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
      title: `Ler 20 min de "${currentBook.title}"`,
      subtitle: `Pág. ${currentBook.currentPage || 0} de ${currentBook.totalPages || 100}`,
      type: 'book',
      targetId: currentBook.id,
      actionText: 'Abrir Livro',
      actionTab: 'books'
    });
  } else {
    recommendations.push({
      id: 'rec-3',
      tag: 'Foco',
      tagColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      title: 'Sessão de Foco Pomodoro',
      subtitle: '25 minutos de imersão total sem distrações',
      type: 'pomodoro',
      actionText: 'Iniciar',
      actionTab: 'pomodoro'
    });
  }

  // Handle recommendation action
  const handleRecAction = (rec) => {
    if (rec.type === 'task' && rec.targetId) {
      if (onUpdateTasks) {
        onUpdateTasks(tasks.map(t => t.id === rec.targetId ? { ...t, status: 'done' } : t));
        showToast('✓ Tarefa concluída com sucesso!');
      }
    } else if (rec.type === 'habit' && rec.targetId) {
      if (onUpdateHabits) {
        onUpdateHabits(habits.map(h => {
          if (h.id === rec.targetId) {
            return {
              ...h,
              history: { ...(h.history || {}), [todayStr]: true }
            };
          }
          return h;
        }));
        showToast('✓ Hábito registrado para hoje!');
      }
    } else if (rec.actionTab === 'pomodoro') {
      if (onOpenPomodoro) onOpenPomodoro();
    } else if (rec.actionTab && onNavigate) {
      onNavigate(rec.actionTab);
    }
  };

  // Toast notification helper
  const showToast = (message) => {
    setFeedbackToast(message);
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  // 3. UNIVERSAL CAPTURE - Speech Recognition
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

  // 4. UNIVERSAL CAPTURE - Intelligent Natural Language Processing
  const processUniversalCapture = async (textToProcess = universalInput) => {
    const text = textToProcess.trim();
    if (!text) return;

    setIsProcessing(true);
    setUniversalInput('');

    try {
      if (onAskJarvis) {
        onAskJarvis(text);
        showToast(`⚡ JARVIS processando: "${text.length > 40 ? text.slice(0, 37) + '...' : text}"`);
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

  // Helper to calculate target day of week
  const getNextDayOfWeek = (dayOfWeek) => {
    const d = new Date();
    const result = new Date(d.getTime());
    result.setDate(d.getDate() + ((7 + dayOfWeek - d.getDay()) % 7 || 7));
    return result.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-start px-4 py-8 md:py-12 max-w-4xl mx-auto space-y-10 selection:bg-violet-500/30">
      {/* Toast Notification */}
      {feedbackToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-violet-600/95 text-white font-medium shadow-2xl backdrop-blur-md border border-violet-400/40 text-xs animate-fade-in">
          <Sparkles className="w-4 h-4 text-cyan-200" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* 1. CENTRAL AI HERO ORB */}
      <div className="flex flex-col items-center text-center space-y-5">
        <div className="relative group cursor-pointer" onClick={() => onAskJarvis ? onAskJarvis("Olá JARVIS! Como está meu dia e o que você me recomenda fazer agora?") : null}>
          {/* Animated Atmospheric Rings */}
          <div className="absolute -inset-4 bg-gradient-to-r from-violet-600/30 via-cyan-500/30 to-purple-600/30 rounded-full blur-2xl opacity-70 group-hover:opacity-100 transition-all duration-700 animate-pulse"></div>
          <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full blur-md opacity-40 group-hover:opacity-75 transition-all duration-500"></div>

          {/* Core AI Orb */}
          <div className={`w-28 h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center relative z-10 border backdrop-blur-2xl transition-all duration-500 transform group-hover:scale-105 shadow-2xl ${
            darkMode 
              ? 'bg-gradient-to-b from-[#181926] via-[#10111a] to-[#0a0b12] border-white/[0.15] shadow-violet-950/60' 
              : 'bg-gradient-to-b from-white via-zinc-50 to-zinc-100 border-zinc-300 shadow-violet-200/60'
          }`}>
            <BrainCircuit className="w-12 h-12 md:w-14 md:h-14 text-transparent bg-clip-text bg-gradient-to-tr from-violet-400 via-cyan-300 to-indigo-300 animate-pulse" />
            
            {/* Ambient Inner Orbit */}
            <div className="absolute inset-2 rounded-full border border-violet-400/20 border-dashed animate-spin" style={{ animationDuration: '25s' }}></div>
          </div>
        </div>

        <div className="space-y-1.5 max-w-md">
          <p className="text-xs font-mono uppercase tracking-widest text-violet-400 font-semibold">
            {userName ? `${greeting}, ${userName}` : greeting}
          </p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            O que você precisa hoje?
          </h1>
          <p className="text-xs text-zinc-400">
            Fale ou escreva abaixo. O Obnotion entende, organiza e cuida de tudo.
          </p>
        </div>
      </div>

      {/* 2. UNIVERSAL CAPTURE OMNIBAR */}
      <div className="w-full max-w-2xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            processUniversalCapture();
          }}
          className={`relative flex items-center rounded-2xl border transition-all duration-300 shadow-2xl backdrop-blur-2xl ${
            isListening 
              ? 'ring-2 ring-violet-500 border-violet-400 bg-violet-950/20' 
              : darkMode 
                ? 'bg-[#12131d]/85 border-white/[0.12] focus-within:border-violet-500/60 focus-within:bg-[#151624]' 
                : 'bg-white/95 border-zinc-200 focus-within:border-violet-500'
          }`}
        >
          <input
            ref={inputRef}
            type="text"
            value={universalInput}
            onChange={(e) => setUniversalInput(e.target.value)}
            placeholder={isListening ? "Ouvindo sua voz..." : "Jogue qualquer coisa aqui... (ex: Ligar para João amanhã, Comprar cabo, Estudar Romanos 8)"}
            className="w-full px-5 py-4 bg-transparent text-sm md:text-base outline-none text-zinc-100 placeholder:text-zinc-500 font-medium"
            disabled={isProcessing}
          />

          <div className="flex items-center gap-1.5 pr-3">
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2.5 rounded-xl transition-all duration-200 ${
                isListening 
                  ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/40' 
                  : 'text-zinc-400 hover:text-violet-300 hover:bg-white/[0.08]'
              }`}
              title={isListening ? "Parar de ouvir" : "Falar por voz"}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <button
              type="submit"
              disabled={!universalInput.trim() && !isProcessing}
              className={`p-2.5 rounded-xl transition-all duration-200 ${
                universalInput.trim()
                  ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-lg shadow-violet-500/30 hover:scale-105'
                  : 'text-zinc-600 cursor-not-allowed'
              }`}
              title="Organizar pela IA"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-[11px] text-zinc-400">
          <span className="text-zinc-500 font-mono">Sugestões:</span>
          <button
            type="button"
            onClick={() => onAskJarvis && onAskJarvis("Qual o raio-x financeiro e tarefas prioritárias de hoje?")}
            className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-zinc-300 transition-colors"
          >
            📊 Resumo do Meu Dia
          </button>
          <button
            type="button"
            onClick={() => onAskJarvis && onAskJarvis("Quais contas vencem essa semana e como está meu saldo?")}
            className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-zinc-300 transition-colors"
          >
            💰 Contas da Semana
          </button>
          <button
            type="button"
            onClick={() => {
              setUniversalInput("Estudar e resumir ");
              inputRef.current?.focus();
            }}
            className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-zinc-300 transition-colors"
          >
            📖 Novo Estudo/Insight
          </button>
        </div>
      </div>

      {/* 3. RADAR DO DIA & 4. SE EU FOSSE VOCÊ */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* RADAR DO DIA CARD */}
        <div className={`p-6 rounded-3xl border flex flex-col justify-between transition-all duration-300 ${
          darkMode ? 'bg-[#11121c]/80 border-white/[0.08] backdrop-blur-xl' : 'bg-white border-zinc-200'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-violet-400" />
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                  Radar do Dia
                </span>
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold font-mono tracking-wide ${radarBadgeBg}`}>
                <span className={`w-2 h-2 rounded-full ${radarDotColor} animate-pulse`}></span>
                <span>{radarTitle}</span>
              </div>
            </div>

            <p className="text-sm text-zinc-200 leading-relaxed font-normal">
              {radarSummary}
            </p>
          </div>

          <div className="pt-5 mt-5 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-zinc-500" /> {today.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>
            <button
              onClick={() => onAskJarvis && onAskJarvis("Faça uma análise profunda da minha semana e sugira um plano de ação.")}
              className="text-violet-400 hover:text-violet-300 font-sans font-medium flex items-center gap-1"
            >
              Pedir conselho à IA <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* SE EU FOSSE VOCÊ CARD */}
        <div className={`p-6 rounded-3xl border flex flex-col justify-between transition-all duration-300 ${
          darkMode ? 'bg-[#11121c]/80 border-white/[0.08] backdrop-blur-xl' : 'bg-white border-zinc-200'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                  Se Eu Fosse Você
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                Próximas Ações
              </span>
            </div>

            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div
                  key={rec.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition-all duration-200 ${
                    darkMode 
                      ? 'bg-black/30 border-white/[0.05] hover:border-violet-500/30 hover:bg-white/[0.02]' 
                      : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300'
                  }`}
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
                    onClick={() => handleRecAction(rec)}
                    className="px-2.5 py-1 rounded-xl bg-violet-600/20 hover:bg-violet-600 text-violet-300 hover:text-white border border-violet-500/30 text-[11px] font-medium transition-all shrink-0"
                  >
                    {rec.actionText}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400">
            <span className="text-[11px] text-zinc-500">
              {pendingTasks.length} tarefas pendentes • {habitsPendingToday.length} hábitos restantes
            </span>
            <button
              onClick={() => onNavigate && onNavigate('tasks')}
              className="text-zinc-400 hover:text-zinc-200 text-[11px] flex items-center gap-1 font-mono"
            >
              Ver todas <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
