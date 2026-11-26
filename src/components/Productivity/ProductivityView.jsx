import React, { useState } from 'react';
import { Presentation, FileSpreadsheet, Wand2, ExternalLink, X, Maximize, Play, Palette, Sparkles, Layers, Image as ImageIcon, BookMarked, Clapperboard, Scissors, Film, Cast, Radio, Tv, Tablet, Music } from 'lucide-react';

export default function ProductivityView({ darkMode }) {
  const [activeTool, setActiveTool] = useState(null);

  const tools = [
    {
      id: 'pulpito',
      title: 'Púlpito do Pastor & Retorno de Slides (Altar & Telão)',
      icon: Tablet,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      tag: 'NOVO • AO VIVO & TEMPO REAL',
      tagColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      description: 'Sistema ultra-simples em tempo real para o Púlpito do Pastor e Cabine. O pastor abre e já cai direto na tela de retorno gigante com botões de Avançar/Voltar e botão gigante TIRAR DA TELA (Arca da Aliança).',
      features: [
        'Abre direto no Retorno do Pastor com visor gigante e leitura facilitada para o púlpito',
        'Botão Gigante "TIRAR DA TELA": exibe instantaneamente a Arca da Aliança no Telão',
        'Aba separada para o Operador carregar PDFs e gerenciar mídias pelo computador',
        'App Portátil (.bat) incluso para plugar o notebook na TV/Telão e funcionar em 1 clique'
      ],
      path: `${import.meta.env.BASE_URL}tools/pulpito_retorno.html`,
      iframeUrl: `${import.meta.env.BASE_URL}tools/pulpito_retorno.html`
    },
    {
      id: 'roteiros',
      title: 'Montador de Roteiros & Vídeos (Rundown Pro)',
      icon: Clapperboard,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/30',
      tag: 'PRODUÇÃO & TV',
      tagColor: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
      description: 'Central de Produção e Montagem de Roteiros de Reuniões. Organize vídeos com fotos/frames, durações, deixas do pastor, lembretes, cálculo de tempo total e exportação para switcher/PDF.',
      features: [
        'Cards de vídeos com fotos/thumbnails, tempos e deixas do pastor',
        'Importador automático de PDFs e textos de roteiros existentes',
        'Calculador de tempo total da reunião em minutos e segundos',
        'Seção de lembretes e exportação formatada para WhatsApp e PDF'
      ],
      path: `${import.meta.env.BASE_URL}tools/montador_de_roteiros.html`,
      iframeUrl: `${import.meta.env.BASE_URL}tools/montador_de_roteiros.html`
    },
    {
      id: 'slides',
      title: 'Slide Killer (Central Multimídia Church)',
      icon: Presentation,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      tag: 'NOVO • CINZEL 4K & OFFLINE',
      tagColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      description: 'Plataforma oficial de mídia e projeção para igrejas. Novo Tema Nobre Cinzel 4K, conversão de PDF ➔ PPTX, conversor inverso (PPTX ➔ Imagens/ZIP/PDF) e gerador de sermões.',
      features: [
        'PDF ➔ PPTX Direto (1 Página = 1 Slide em Full HD)',
        'Conversor Inverso: PPTX para Imagens PNG, ZIP e PDF',
        'Organizador Visual com Drag & Drop e exclusão em lote',
        'Slide Killer de sermões com quebra inteligente de versículos'
      ],
      path: `${import.meta.env.BASE_URL}tools/gerador_de_slides/index.html`,
      iframeUrl: `${import.meta.env.BASE_URL}tools/gerador_de_slides/index.html`
    },
    {
      id: 'planilhas',
      title: 'Planilhas Automáticas & Relatórios',
      icon: FileSpreadsheet,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      tag: 'AUTOMAÇÃO & DADOS',
      tagColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      description: 'Central de Automação de Dados. Lê arquivos Excel/PDFs consolidados e separa dinamicamente relatórios organizados por blocos ou regiões.',
      features: [
        'Processa automaticamente arquivos Excel e PDF',
        'Gera relatórios individuais e formatados',
        'Estatísticas calculadas (congregações, ativos)',
        'Visualização de hierarquia e validação de dados'
      ],
      path: `${import.meta.env.BASE_URL}tools/planilhas/index.html`,
      iframeUrl: `${import.meta.env.BASE_URL}tools/planilhas/index.html`
    },
    {
      id: 'telao',
      title: 'Púlpito versão VIDEO DESKTOP',
      icon: Tv,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30',
      tag: 'TELÃO & PROJEÇÃO',
      tagColor: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
      description: 'Painel completo de controle de mídia e letras para igrejas. Gerencie letras, versículos e apresentações e transmita para o telão (HTML) ou envie para o pastor no altar (como receptor).',
      features: [
        'Painel do Operador centralizado (clique para exibir na hora)',
        'Integração com vMix via Janela HTML (Chroma Key Verde opcional)',
        'Visão "Receptor" limpa para o Pastor ou Telão (sem botões)',
        'Sincronização Cloud via Firebase para múltiplos dispositivos'
      ],
      path: `${import.meta.env.BASE_URL}tools/controle_telao.html`,
      iframeUrl: `${import.meta.env.BASE_URL}tools/controle_telao.html`
    },
    {
      id: 'letras_impressao',
      title: 'Letras de Músicas (Impressão A4)',
      icon: Music,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10',
      borderColor: 'border-pink-500/30',
      tag: 'NOVO • IMPRESSÃO',
      tagColor: 'bg-pink-500/15 text-pink-300 border-pink-500/30',
      description: 'Sistema para buscar, editar e imprimir letras de músicas no formato exato (metade da folha A4, fonte itálica, coro em vermelho). Ideal para pastores que leem no papel.',
      features: [
        'Busca rápida em milhares de letras de músicas',
        'Formatação automática (caixa alta, itálico, negrito)',
        'Edição fácil: duplique estrofes ou marque o coro de vermelho',
        'Impressão formatada para ocupar exatamente metade da folha A4'
      ],
      path: `${import.meta.env.BASE_URL}tools/letras_impressao.html`,
      iframeUrl: `${import.meta.env.BASE_URL}tools/letras_impressao.html`
    }
  ];

  if (activeTool) {
    const tool = tools.find(t => t.id === activeTool);
    return (
      <div className="flex-1 flex flex-col h-full animate-fade-in relative">
        <div className={`p-3 px-4 flex items-center justify-between border-b shadow-sm z-10 ${darkMode ? 'bg-[#0f1017] border-white/[0.08]' : 'bg-white border-zinc-200'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded-lg ${tool.bgColor}`}>
              <tool.icon className={`w-4 h-4 ${tool.color}`} />
            </div>
            <div>
              <h2 className="font-bold text-xs text-white flex items-center gap-2">
                {tool.title}
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/[0.06] text-zinc-400 border border-white/[0.08]">
                  Em Execução
                </span>
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                const url = tool.iframeUrl.includes('?') ? `${tool.iframeUrl}&_t=${Date.now()}` : `${tool.iframeUrl}?_t=${Date.now()}`;
                window.open(url, '_blank');
              }}
              className="p-1.5 px-2.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors flex items-center gap-1.5 text-xs font-medium border border-white/[0.06]"
              title="Abrir em tela cheia em nova guia"
            >
              <Maximize className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Nova Guia</span>
            </button>
            <div className="w-px h-4 bg-white/[0.1] mx-1"></div>
            <button 
              onClick={() => setActiveTool(null)}
              className="p-1.5 px-2.5 rounded-lg text-zinc-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors flex items-center gap-1.5 text-xs font-medium border border-transparent hover:border-rose-500/20"
              title="Fechar ferramenta e voltar"
            >
              <X className="w-4 h-4" />
              <span>Fechar</span>
            </button>
          </div>
        </div>
        
        <iframe 
          src={tool.iframeUrl.includes('?') ? `${tool.iframeUrl}&embedded=1&_t=${Date.now()}` : `${tool.iframeUrl}?embedded=1&_t=${Date.now()}`}
          className="flex-1 w-full h-full border-none relative z-1 bg-[#090b11]"
          title={tool.title}
          allow="microphone; camera; display-capture; clipboard-read; clipboard-write; fullscreen"
        />
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full animate-fade-in pb-24 md:pb-10 overflow-y-auto space-y-6">
      {/* Hero Header */}
      <div className={`p-6 sm:p-7 rounded-2xl border ${
        darkMode
          ? 'bg-gradient-to-br from-[#16120c]/90 via-[#12100d]/85 to-[#0c0b09]/90 backdrop-blur-xl border-amber-500/20 shadow-[0_0_40px_-15px_rgba(245,158,11,0.22)]'
          : 'bg-gradient-to-br from-amber-50 via-white to-orange-50/40 border-amber-200/80 shadow-sm'
      } flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden`}>
        {/* Subtle Sinai Sun Ambient Glow */}
        <div className="pointer-events-none absolute -top-24 -right-16 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 w-64 h-64 rounded-full bg-orange-500/10 blur-3xl" />

        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.9)]" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 font-semibold">
              Suíte de Criação &amp; Produtividade
            </span>
          </div>
          <h1 className={`text-xl md:text-2xl font-extrabold tracking-tight flex items-center gap-2.5 ${
            darkMode ? 'text-white' : 'text-zinc-900'
          }`}>
            <span className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400 shadow-inner">
              <Wand2 className="w-5 h-5" />
            </span>
            <span>
              Estúdio &amp; Ferramentas{' '}
              <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                SinaiHUB
              </span>
            </span>
          </h1>
          <p className={`text-xs max-w-xl leading-relaxed ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Soluções completas de projeção, púlpito, apresentações e automação de relatórios integradas em um só lugar.
          </p>
        </div>

        <div className="z-10 flex items-center gap-3 self-start md:self-center">
          <div className={`px-3.5 py-2 rounded-xl border text-right ${
            darkMode ? 'bg-black/30 border-amber-500/20' : 'bg-white/80 border-amber-200'
          }`}>
            <p className="text-[10px] font-mono uppercase tracking-wider text-amber-400/90">Ferramentas Ativas</p>
            <p className={`text-lg font-black leading-tight ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
              {tools.length} <span className="text-xs font-medium text-zinc-400">módulos</span>
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {tools.map(tool => (
          <div
            key={tool.id}
            className={`relative flex flex-col p-6 rounded-2xl border overflow-hidden ${
              darkMode
                ? 'bg-[#12110e]/85 border-white/[0.08] hover:border-amber-500/35 hover:bg-[#171510]'
                : 'bg-white border-zinc-200 hover:border-amber-400/60 hover:shadow-md'
            } transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_-12px_rgba(245,158,11,0.2)] group`}
          >
            {/* Top golden hairline accent on hover */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${tool.bgColor} ${tool.borderColor} border transition-transform duration-300 group-hover:scale-105`}>
                <tool.icon className={`w-6 h-6 ${tool.color}`} />
              </div>
              <span className={`text-[9px] font-mono font-bold px-2.5 py-1 rounded-full border ${tool.tagColor}`}>
                {tool.tag}
              </span>
            </div>

            <h3 className={`text-base font-bold transition-colors ${
              darkMode ? 'text-white group-hover:text-amber-300' : 'text-zinc-900 group-hover:text-amber-600'
            }`}>
              {tool.title}
            </h3>

            <p className={`text-xs mt-2 mb-4 leading-relaxed flex-1 ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
              {tool.description}
            </p>

            <div className={`mb-6 space-y-2 border-t pt-4 ${darkMode ? 'border-white/[0.06]' : 'border-zinc-100'}`}>
              <h4 className="text-[10px] font-mono uppercase tracking-wider text-amber-400/75">Recursos Integrados</h4>
              <ul className="space-y-1.5">
                {tool.features.map((feature, i) => (
                  <li key={i} className={`flex items-start gap-2 text-xs ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80 mt-1.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <button 
              onClick={() => setActiveTool(tool.id)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20 hover:shadow-amber-500/35 flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Abrir no SinaiHUB
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
