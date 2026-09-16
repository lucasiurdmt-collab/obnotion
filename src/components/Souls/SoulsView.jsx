import React, { useState, useRef, useMemo } from 'react';
import { Plus, Search, User, Phone, CheckCircle, Clock, AlertTriangle, ImagePlus, Check } from 'lucide-react';

// Helpers
const getStartOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // ajusta para segunda-feira
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const getDaysSince = (dateString) => {
  if (!dateString) return null;
  const now = new Date();
  const past = new Date(dateString);
  const diffTime = Math.abs(now - past);
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

export default function SoulsView({ souls = [], onUpdateSouls, darkMode }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newStatus, setNewStatus] = useState('bom');
  const [newPhoto, setNewPhoto] = useState(null);

  const fileInputRef = useRef(null);

  // Computações de data
  const now = new Date();
  const startOfThisWeek = getStartOfWeek(now);

  const stats = useMemo(() => {
    let attendedThisWeek = 0;
    souls.forEach(soul => {
      const lastAttendance = soul.attendances?.length ? soul.attendances[soul.attendances.length - 1] : null;
      if (lastAttendance && new Date(lastAttendance) >= startOfThisWeek) {
        attendedThisWeek++;
      }
    });
    return {
      total: souls.length,
      attendedThisWeek
    };
  }, [souls, startOfThisWeek]);

  const filteredSouls = useMemo(() => {
    return souls.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (s.phone && s.phone.includes(searchTerm))
    ).sort((a, b) => {
      // Ordenar por status (ruim primeiro) e depois por tempo desde o último atendimento
      const statusWeight = { ruim: 3, medio: 2, bom: 1 };
      if (statusWeight[b.status] !== statusWeight[a.status]) {
        return statusWeight[b.status] - statusWeight[a.status];
      }
      const lastA = a.attendances?.length ? new Date(a.attendances[a.attendances.length - 1]).getTime() : 0;
      const lastB = b.attendances?.length ? new Date(b.attendances[b.attendances.length - 1]).getTime() : 0;
      return lastA - lastB; // mais antigos primeiro
    });
  }, [souls, searchTerm]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSoul = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newSoul = {
      id: 'soul_' + Date.now(),
      name: newName.trim(),
      phone: newPhone.trim(),
      photoUrl: newPhoto,
      status: newStatus,
      createdAt: new Date().toISOString(),
      attendances: []
    };

    onUpdateSouls([...souls, newSoul]);
    
    setNewName('');
    setNewPhone('');
    setNewStatus('bom');
    setNewPhoto(null);
    setIsAdding(false);
  };

  const handleAttend = (id) => {
    const updated = souls.map(s => {
      if (s.id === id) {
        return {
          ...s,
          attendances: [...(s.attendances || []), new Date().toISOString()]
        };
      }
      return s;
    });
    onUpdateSouls(updated);
  };

  const handleUpdateStatus = (id, status) => {
    const updated = souls.map(s => s.id === id ? { ...s, status } : s);
    onUpdateSouls(updated);
  };

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir este registro?')) {
      onUpdateSouls(souls.filter(s => s.id !== id));
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'bom': return <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">Bom</span>;
      case 'medio': return <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">Médio</span>;
      case 'ruim': return <span className="bg-rose-500/10 text-rose-500 border border-rose-500/20 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">Ruim</span>;
      default: return null;
    }
  };

  return (
    <div className={`h-full flex flex-col ${darkMode ? 'text-zinc-100' : 'text-zinc-800'} p-4 md:p-8 max-w-5xl mx-auto space-y-6 overflow-y-auto`}>
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            Atendimento de Almas
          </h1>
          <p className={`text-sm ${darkMode ? 'text-zinc-400' : 'text-zinc-500'} mt-1`}>
            Acompanhe o desenvolvimento espiritual e atendimentos semanais.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-xl flex flex-col items-center justify-center border ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'} shadow-sm`}>
            <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-500">Atendidos na Semana</span>
            <span className="text-xl font-black text-blue-500">{stats.attendedThisWeek}</span>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/30"
          >
            {isAdding ? <User className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            <span className="hidden sm:inline">{isAdding ? 'Cancelar' : 'Nova Pessoa'}</span>
          </button>
        </div>
      </header>

      {isAdding && (
        <form onSubmit={handleAddSoul} className={`p-5 md:p-6 rounded-2xl border ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'} shadow-lg animate-fade-in`}>
          <h3 className="font-bold text-lg mb-4">Adicionar Nova Pessoa</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Foto Profile */}
            <div className="md:col-span-3 flex flex-col items-center justify-center gap-3">
              <div 
                className={`w-24 h-24 rounded-full border-2 border-dashed ${darkMode ? 'border-zinc-700 bg-zinc-800' : 'border-zinc-300 bg-zinc-50'} flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group`}
                onClick={() => fileInputRef.current?.click()}
              >
                {newPhoto ? (
                  <img src={newPhoto} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <ImagePlus className={`w-8 h-8 ${darkMode ? 'text-zinc-500' : 'text-zinc-400'} group-hover:scale-110 transition-transform`} />
                    <span className="text-[9px] uppercase font-bold text-zinc-500 mt-1">Foto</span>
                  </>
                )}
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handlePhotoUpload} />
              </div>
            </div>

            {/* Campos */}
            <div className="md:col-span-9 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Nome da Pessoa *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="Ex: João Silva"
                    className={`w-full px-4 py-2.5 rounded-xl border ${darkMode ? 'bg-black/50 border-zinc-800 focus:border-blue-500' : 'bg-white border-zinc-300 focus:border-blue-500'} outline-none transition-colors`}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={e => setNewPhone(e.target.value)}
                    placeholder="(00) 00000-0000"
                    className={`w-full px-4 py-2.5 rounded-xl border ${darkMode ? 'bg-black/50 border-zinc-800 focus:border-blue-500' : 'bg-white border-zinc-300 focus:border-blue-500'} outline-none transition-colors`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Como ela está espiritualmente?</label>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setNewStatus('bom')} className={`flex-1 py-2 rounded-xl border font-bold text-sm flex items-center justify-center gap-2 transition-colors ${newStatus === 'bom' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' : (darkMode ? 'border-zinc-800 text-zinc-500 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-400 hover:bg-zinc-50')}`}>
                    Bom (Firme)
                  </button>
                  <button type="button" onClick={() => setNewStatus('medio')} className={`flex-1 py-2 rounded-xl border font-bold text-sm flex items-center justify-center gap-2 transition-colors ${newStatus === 'medio' ? 'bg-amber-500/20 border-amber-500 text-amber-500' : (darkMode ? 'border-zinc-800 text-zinc-500 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-400 hover:bg-zinc-50')}`}>
                    Médio
                  </button>
                  <button type="button" onClick={() => setNewStatus('ruim')} className={`flex-1 py-2 rounded-xl border font-bold text-sm flex items-center justify-center gap-2 transition-colors ${newStatus === 'ruim' ? 'bg-rose-500/20 border-rose-500 text-rose-500' : (darkMode ? 'border-zinc-800 text-zinc-500 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-400 hover:bg-zinc-50')}`}>
                    Ruim (Afastando)
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all">
                  <Check className="w-5 h-5" />
                  Salvar Registro
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Lista */}
      <div className="space-y-4">
        {/* Barra de Pesquisa */}
        <div className={`flex items-center px-4 py-3 rounded-xl border ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'} shadow-sm`}>
          <Search className={`w-5 h-5 ${darkMode ? 'text-zinc-500' : 'text-zinc-400'} mr-3`} />
          <input
            type="text"
            placeholder="Buscar pessoa por nome..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none flex-1 text-sm font-medium"
          />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredSouls.length === 0 && (
            <div className={`col-span-1 lg:col-span-2 text-center py-10 ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
              Nenhuma pessoa encontrada. Adicione uma nova clicando no botão acima.
            </div>
          )}
          
          {filteredSouls.map(soul => {
            const attendances = soul.attendances || [];
            const lastAttendance = attendances.length ? attendances[attendances.length - 1] : null;
            const daysSince = getDaysSince(lastAttendance);
            
            const isAttendedThisWeek = lastAttendance && new Date(lastAttendance) >= startOfThisWeek;

            return (
              <div key={soul.id} className={`flex flex-col p-4 rounded-2xl border ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'} shadow-sm relative group`}>
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 bg-zinc-800 flex items-center justify-center border-2 border-zinc-700">
                    {soul.photoUrl ? (
                      <img src={soul.photoUrl} alt={soul.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 text-zinc-400" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-lg truncate">{soul.name}</h4>
                      {renderStatusBadge(soul.status)}
                    </div>
                    {soul.phone && (
                      <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-0.5">
                        <Phone className="w-3 h-3" />
                        {soul.phone}
                      </div>
                    )}
                    
                    <div className="mt-3 space-y-1.5">
                      {/* Status Warning */}
                      {soul.status === 'ruim' && (
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-rose-500 bg-rose-500/10 px-2 py-1 rounded w-max">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          URGENTE PARA ATENDER
                        </div>
                      )}

                      {/* Tempo desde último atendimento */}
                      <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
                        <Clock className="w-3.5 h-3.5" />
                        {lastAttendance ? (
                          daysSince === 0 ? 'Atendido hoje' :
                          daysSince === 1 ? 'Atendido ontem' :
                          daysSince < 7 ? `Atendido há ${daysSince} dias` :
                          daysSince < 14 ? 'Atendido há 1 semana' :
                          `Atendido há ${Math.floor(daysSince / 7)} semanas`
                        ) : 'Nunca atendido'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-zinc-500/20 flex items-center justify-between gap-2">
                  <div className="flex bg-black/20 rounded-lg p-1 border border-zinc-700">
                    <button onClick={() => handleUpdateStatus(soul.id, 'bom')} className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${soul.status === 'bom' ? 'bg-emerald-500 text-white' : 'hover:bg-zinc-800 text-zinc-500'}`} title="Marcar como Bom"></button>
                    <button onClick={() => handleUpdateStatus(soul.id, 'medio')} className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${soul.status === 'medio' ? 'bg-amber-500 text-white' : 'hover:bg-zinc-800 text-zinc-500'}`} title="Marcar como Médio"></button>
                    <button onClick={() => handleUpdateStatus(soul.id, 'ruim')} className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${soul.status === 'ruim' ? 'bg-rose-500 text-white' : 'hover:bg-zinc-800 text-zinc-500'}`} title="Marcar como Ruim"></button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleDelete(soul.id)} className="px-3 py-2 rounded-lg text-xs font-bold text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 transition-colors">
                      Excluir
                    </button>
                    <button
                      onClick={() => handleAttend(soul.id)}
                      disabled={isAttendedThisWeek}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${isAttendedThisWeek ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'}`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      {isAttendedThisWeek ? 'Atendido (Semana)' : 'Marcar Atendimento'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
