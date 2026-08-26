import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  Clock,
  Calendar,
  CheckCircle2,
  X,
  Volume2,
  Sparkles,
  ArrowRight,
  AlarmClock
} from 'lucide-react';

export default function ReminderManager({
  data = {},
  onNavigate,
  onUpdateTasks,
  onUpdateEvents,
  darkMode
}) {
  const [activeReminder, setActiveReminder] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [snoozedReminders, setSnoozedReminders] = useState({}); // { id: timestampToAlert }
  const firedAlertsRef = useRef(new Set());
  const audioCtxRef = useRef(null);

  // Check notification permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setHasPermission(Notification.permission === 'granted');
    }
  }, []);

  // Request native permission
  const requestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setHasPermission(perm === 'granted');
        if (perm === 'granted') {
          playAppleChime();
          new Notification('Obnotion • Lembretes Ativos', {
            body: 'Notificações e alarmes configurados com sucesso!',
            icon: '/obnotion/favicon.ico'
          });
        }
      } catch (e) {
        console.warn('Permission error:', e);
      }
    }
  };

  // Play Apple-style crystalline marimba/chime chord (Web Audio API)
  const playAppleChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      
      const ctx = audioCtxRef.current || new AudioCtx();
      audioCtxRef.current = ctx;
      if (ctx.state === 'suspended') ctx.resume();

      // Apple-style 4-tone harmonic bell chord: E5, G#5, B5, E6 with arpeggiated sparkle
      const notes = [659.25, 830.61, 987.77, 1318.51];
      const startTime = ctx.currentTime + 0.05;

      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime + (index * 0.09));

        // Add subtle harmonic richness (second harmonic overtone)
        const noteStart = startTime + (index * 0.09);
        gain.gain.setValueAtTime(0, noteStart);
        gain.gain.linearRampToValueAtTime(0.18 - (index * 0.02), noteStart + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 1.3);
      });
    } catch (e) {
      console.warn('Audio chime error:', e);
    }
  };

  // Periodic Clock Heartbeat Check (Runs every 15 seconds)
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
      const currentDay = String(now.getDate()).padStart(2, '0');
      const todayStr = `${currentYear}-${currentMonth}-${currentDay}`;

      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMins = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMins}`;
      const nowTimestamp = now.getTime();

      const events = data?.calendarEvents || [];
      const tasks = data?.tasks || [];

      // 1. Check Calendar Events scheduled for today & current time
      events.forEach((ev) => {
        if (!ev.date || ev.date !== todayStr) return;
        if (!ev.time) return;

        // Normalize event time (e.g., "15:00", "15:00:00", "15h")
        const cleanEvTime = ev.time.slice(0, 5);
        const alertKey = `event-${ev.id}-${todayStr}-${cleanEvTime}`;

        // Check snoozed or normal match
        const isSnoozedMatch = snoozedReminders[ev.id] && nowTimestamp >= snoozedReminders[ev.id];
        const isTimeMatch = cleanEvTime === currentTimeStr && !firedAlertsRef.current.has(alertKey);

        if (isTimeMatch || isSnoozedMatch) {
          firedAlertsRef.current.add(alertKey);
          triggerAlert({
            id: ev.id,
            title: ev.title,
            time: ev.time,
            category: ev.category || 'Compromisso',
            type: 'event',
            date: ev.date
          });
        }
      });

      // 2. Check Tasks scheduled for today with specific due time or high urgency
      tasks.forEach((t) => {
        if (t.status === 'done') return;
        if (!t.dueDate || t.dueDate !== todayStr) return;
        if (!t.time) return;

        const cleanTaskTime = t.time.slice(0, 5);
        const alertKey = `task-${t.id}-${todayStr}-${cleanTaskTime}`;

        const isSnoozedMatch = snoozedReminders[t.id] && nowTimestamp >= snoozedReminders[t.id];
        const isTimeMatch = cleanTaskTime === currentTimeStr && !firedAlertsRef.current.has(alertKey);

        if (isTimeMatch || isSnoozedMatch) {
          firedAlertsRef.current.add(alertKey);
          triggerAlert({
            id: t.id,
            title: t.title,
            time: t.time,
            category: t.tags?.[0] || 'Tarefa',
            type: 'task',
            date: t.dueDate
          });
        }
      });
    };

    // Check immediately and set interval
    checkReminders();
    const interval = setInterval(checkReminders, 15000);
    return () => clearInterval(interval);
  }, [data, snoozedReminders]);

  const triggerAlert = (reminderItem) => {
    setActiveReminder(reminderItem);
    playAppleChime();

    // Native System Push Notification
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(`Obnotion: ${reminderItem.title}`, {
          body: `Horário: ${reminderItem.time || 'Agora'} • ${reminderItem.category}`,
          icon: '/obnotion/favicon.ico',
          vibrate: [200, 100, 200]
        });
      } catch (e) {}
    }
  };

  const handleDismiss = () => {
    setActiveReminder(null);
  };

  const handleSnooze = (minutes = 10) => {
    if (!activeReminder) return;
    const futureTimestamp = Date.now() + (minutes * 60 * 1000);
    setSnoozedReminders(prev => ({
      ...prev,
      [activeReminder.id]: futureTimestamp
    }));
    setActiveReminder(null);
  };

  const handleComplete = () => {
    if (!activeReminder) return;

    if (activeReminder.type === 'task' && onUpdateTasks) {
      const tasks = data?.tasks || [];
      onUpdateTasks(tasks.map(t => t.id === activeReminder.id ? { ...t, status: 'done' } : t));
    }
    setActiveReminder(null);
  };

  const handleView = () => {
    if (!activeReminder) return;
    const tab = activeReminder.type === 'event' ? 'calendar' : 'tasks';
    if (onNavigate) onNavigate(tab);
    setActiveReminder(null);
  };

  return (
    <>
      {/* 1. FLOATING APPLE GLASSMORPHISM REMINDER MODAL (ABOVE EVERYTHING) */}
      {activeReminder && (
        <div className="fixed inset-x-0 top-6 z-[99999] flex justify-center px-4 pointer-events-auto animate-bounce-in">
          <div className={`w-full max-w-lg p-5 rounded-3xl border shadow-2xl backdrop-blur-2xl transition-all duration-300 relative overflow-hidden ${
            darkMode 
              ? 'bg-[#12131f]/95 border-violet-500/40 text-white shadow-violet-950/80 shadow-2xl ring-1 ring-white/[0.1]' 
              : 'bg-white/95 border-violet-400/40 text-zinc-800 shadow-2xl ring-1 ring-zinc-200'
          }`}>
            {/* Top Accent Glow Bar */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-violet-500 via-cyan-400 to-indigo-500 animate-pulse"></div>

            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-violet-500/30 shrink-0">
                  <AlarmClock className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-md bg-violet-500/20 text-violet-300 border border-violet-500/30 font-bold">
                      {activeReminder.category}
                    </span>
                    <span className="text-xs font-mono text-cyan-300 font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {activeReminder.time || 'Agora'}
                    </span>
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-white tracking-tight mt-1 leading-snug">
                    {activeReminder.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={handleDismiss}
                className="text-zinc-400 hover:text-white p-1.5 rounded-xl hover:bg-white/[0.08] transition-colors"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-white/[0.08]">
              <button
                onClick={handleComplete}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-lg shadow-emerald-600/30"
              >
                <CheckCircle2 className="w-4 h-4" /> Concluir
              </button>

              <button
                onClick={() => handleSnooze(10)}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-zinc-200 font-medium text-xs border border-white/[0.1] transition-all"
              >
                <Clock className="w-3.5 h-3.5" /> Adiar 10m
              </button>

              <button
                onClick={handleView}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-violet-600/20 hover:bg-violet-600 text-violet-300 hover:text-white font-medium text-xs border border-violet-500/30 transition-all"
              >
                Ver Detalhes <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. ONE-CLICK NOTIFICATION PERMISSION PROMPT BANNER (IF NOT GRANTED YET) */}
      {!hasPermission && (
        <div className="fixed bottom-20 left-4 md:left-6 z-40 max-w-xs p-3.5 rounded-2xl border shadow-xl backdrop-blur-xl bg-[#11121d]/90 border-white/[0.1] text-xs text-zinc-200 space-y-2 hidden sm:block">
          <div className="flex items-center gap-2 font-semibold text-white">
            <Bell className="w-4 h-4 text-violet-400 animate-bounce" />
            <span>Ativar Lembretes no Celular/PC?</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-tight">
            Receba alarmes com o toque de sino do iPhone na hora dos seus compromissos.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={requestNotificationPermission}
              className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs shadow-md transition-all"
            >
              Ativar Notificações
            </button>
            <button
              onClick={() => playAppleChime()}
              className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.08]"
              title="Ouvir som de teste"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
