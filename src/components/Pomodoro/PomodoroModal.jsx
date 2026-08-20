import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, SkipForward, X, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';

export default function PomodoroModal({
  isOpen,
  onClose,
  darkMode,
  timeLeft,
  setTimeLeft,
  isActive,
  setIsActive,
  mode,
  setMode,
  sessionsCompleted,
  setSessionsCompleted
}) {
  const MODES = {
    focus: { name: 'Foco Total', time: 25 * 60, color: 'text-purple-400', bg: 'bg-purple-500' },
    shortBreak: { name: 'Pausa Curta', time: 5 * 60, color: 'text-emerald-400', bg: 'bg-emerald-500' },
    longBreak: { name: 'Pausa Longa', time: 15 * 60, color: 'text-blue-400', bg: 'bg-blue-500' }
  };

  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch (e) {
      console.log('Audio not supported or permitted:', e);
    }
  };

  const switchMode = (newMode) => {
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(MODES[newMode].time);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(MODES[mode].time);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalTime = MODES[mode].time;
  const progressPercent = ((totalTime - timeLeft) / totalTime) * 100;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-md rounded-3xl shadow-2xl border p-6 text-center relative overflow-hidden ${
          darkMode
            ? 'bg-[#1a1b24] border-gray-800 text-gray-100'
            : 'bg-white border-gray-200 text-gray-800'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-gray-200 hover:bg-gray-800/40"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Mode Selector */}
        <div className="flex items-center justify-center gap-2 p-1.5 rounded-2xl bg-gray-900/50 border border-gray-800 mb-8 max-w-xs mx-auto">
          <button
            onClick={() => switchMode('focus')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              mode === 'focus'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Foco (25m)
          </button>
          <button
            onClick={() => switchMode('shortBreak')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              mode === 'shortBreak'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Pausa (5m)
          </button>
          <button
            onClick={() => switchMode('longBreak')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              mode === 'longBreak'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Longa (15m)
          </button>
        </div>

        {/* Big Circular Display */}
        <div className="relative w-64 h-64 mx-auto mb-8 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              className="stroke-gray-800"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              className={`transition-all duration-500 ${
                mode === 'focus'
                  ? 'stroke-purple-500'
                  : mode === 'shortBreak'
                  ? 'stroke-emerald-500'
                  : 'stroke-blue-500'
              }`}
              strokeWidth="6"
              strokeDasharray={276}
              strokeDashoffset={276 - (276 * progressPercent) / 100}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-5xl font-bold tracking-tighter">
              {formatTime(timeLeft)}
            </span>
            <span className={`text-xs font-semibold mt-2 uppercase tracking-wider ${MODES[mode].color}`}>
              {MODES[mode].name}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={resetTimer}
            className="p-3 rounded-2xl bg-gray-800/60 hover:bg-gray-800 text-gray-300 transition-all hover:scale-105"
            title="Reiniciar Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={toggleTimer}
            className={`px-8 py-3.5 rounded-2xl font-bold text-white text-base shadow-xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95 ${
              isActive
                ? 'bg-amber-600 shadow-amber-600/30'
                : 'bg-purple-600 shadow-purple-600/30'
            }`}
          >
            {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            <span>{isActive ? 'Pausar' : 'Iniciar Foco'}</span>
          </button>
          <button
            onClick={() => {
              if (mode === 'focus') {
                setSessionsCompleted(prev => prev + 1);
                playBeep();
                switchMode('shortBreak');
              } else {
                switchMode('focus');
              }
            }}
            className="p-3 rounded-2xl bg-gray-800/60 hover:bg-gray-800 text-gray-300 transition-all hover:scale-105"
            title="Avançar para próximo ciclo"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Footer Session Counter */}
        <div className="pt-4 border-t border-inherit flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Ciclos de foco concluídos hoje:</span>
          </div>
          <span className="font-bold font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-400">
            {sessionsCompleted} sessões
          </span>
        </div>
      </div>
    </div>
  );
}