import React, { useState } from 'react';
import {
  BookHeart,
  Calendar,
  Smile,
  Sparkles,
  Plus,
  Trash2,
  Heart,
  Trophy,
  Flame,
  Search
} from 'lucide-react';

export default function JournalView({ entries, onUpdateEntries, darkMode }) {
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);

  const MOODS = [
    { id: 'awesome', emoji: '😄', label: 'Radiante' },
    { id: 'good', emoji: '😊', label: 'Bom' },
    { id: 'neutral', emoji: '😐', label: 'Neutro' },
    { id: 'tired', emoji: '😔', label: 'Cansado' },
    { id: 'bad', emoji: '😫', label: 'Estressado' }
  ];

  // Active entry
  const activeEntry = entries.find(e => e.date === selectedDate) || {
    id: 'j-' + selectedDate,
    date: selectedDate,
    mood: 'good',
    gratitude: '',
    wins: '',
    improvements: '',
    freeText: ''
  };

  const handleUpdateActiveEntry = (fields) => {
    const exists = entries.some(e => e.date === selectedDate);
    let updated;
    if (exists) {
      updated = entries.map(e => e.date === selectedDate ? { ...e, ...fields } : e);
    } else {
      updated = [{ ...activeEntry, ...fields }, ...entries];
    }
    onUpdateEntries(updated);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto overflow-y-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Diário & Reflexão</h1>
          <p className="text-xs md:text-sm text-gray-400 mt-1">
            Espaço de gratidão diária, pequenas vitórias e reflexões pessoais.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-purple-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className={'px-3 py-2 rounded-xl text-xs font-semibold border outline-none cursor-pointer ' + (
              darkMode ? 'bg-[#1a1b24] border-gray-800 text-gray-200' : 'bg-white border-gray-200 text-gray-800'
            )}
          />
        </div>
      </div>

      {/* Main Journal Form Box */}
      <div className={'p-6 md:p-8 rounded-3xl border shadow-xl space-y-6 ' + (
        darkMode ? 'bg-[#1a1b24] border-gray-800' : 'bg-white border-gray-200'
      )}>
        {/* Mood Selector */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Como você está se sentindo hoje?
          </label>
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            {MOODS.map(m => (
              <button
                key={m.id}
                onClick={() => handleUpdateActiveEntry({ mood: m.id })}
                className={'flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-semibold transition-all ' + (
                  activeEntry.mood === m.id
                    ? 'bg-purple-600/20 border-purple-500 text-purple-300 shadow-md scale-105'
                    : 'bg-gray-900/40 border-gray-800 text-gray-400 hover:border-gray-700'
                )}
              >
                <span className="text-xl">{m.emoji}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Guided Prompts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gratitude */}
          <div className="space-y-2">
            <label className="text-xs font-bold flex items-center gap-1.5 text-pink-400">
              <Heart className="w-3.5 h-3.5" />
              Pelo que sou grato hoje? (3 coisas)
            </label>
            <textarea
              value={activeEntry.gratitude}
              onChange={(e) => handleUpdateActiveEntry({ gratitude: e.target.value })}
              placeholder="1. Pela minha saúde
2. Pelo aprendizado de hoje
3. Pelo café quentinho"
              className="w-full h-28 p-3 rounded-2xl bg-gray-900/50 border border-gray-800 text-xs text-inherit outline-none focus:border-purple-500 resize-none"
            />
          </div>

          {/* Wins */}
          <div className="space-y-2">
            <label className="text-xs font-bold flex items-center gap-1.5 text-amber-400">
              <Trophy className="w-3.5 h-3.5" />
              Qual foi a maior vitória / conquista de hoje?
            </label>
            <textarea
              value={activeEntry.wins}
              onChange={(e) => handleUpdateActiveEntry({ wins: e.target.value })}
              placeholder="Ex: Concluí o módulo de estudos e organizei as tarefas pendentes..."
              className="w-full h-28 p-3 rounded-2xl bg-gray-900/50 border border-gray-800 text-xs text-inherit outline-none focus:border-purple-500 resize-none"
            />
          </div>
        </div>

        {/* Improvements */}
        <div className="space-y-2">
          <label className="text-xs font-bold flex items-center gap-1.5 text-indigo-400">
            <Sparkles className="w-3.5 h-3.5" />
            O que posso fazer ainda melhor amanhã?
          </label>
          <input
            type="text"
            value={activeEntry.improvements}
            onChange={(e) => handleUpdateActiveEntry({ improvements: e.target.value })}
            placeholder="Ex: Fazer pausas regulares e beber mais água durante a tarde..."
            className="w-full p-3 rounded-2xl bg-gray-900/50 border border-gray-800 text-xs text-inherit outline-none focus:border-purple-500"
          />
        </div>

        {/* Free Writing */}
        <div className="space-y-2">
          <label className="text-xs font-bold flex items-center gap-1.5 text-gray-300">
            <BookHeart className="w-3.5 h-3.5 text-purple-400" />
            Anotações Livres & Pensamentos
          </label>
          <textarea
            value={activeEntry.freeText}
            onChange={(e) => handleUpdateActiveEntry({ freeText: e.target.value })}
            placeholder="Escreva livremente sobre o seu dia, ideias ou sentimentos..."
            className="w-full h-36 p-3.5 rounded-2xl bg-gray-900/50 border border-gray-800 text-xs text-inherit outline-none focus:border-purple-500 resize-none font-sans leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
}
