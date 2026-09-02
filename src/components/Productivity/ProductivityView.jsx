import React, { useState } from 'react';
import { Presentation, FileSpreadsheet, Wand2, ExternalLink, X, Maximize, Play, Palette, Sparkles, Layers, Image as ImageIcon, BookMarked, Clapperboard, Scissors, Film } from 'lucide-react';

export default function ProductivityView({ darkMode }) {
  const [activeTool, setActiveTool] = useState(null);

  const tools = [
    {
      id: 'cinecut',
      title: 'CineCut Pro (CapCut Open-Source • OpenCut)',
      icon: Scissors,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/30',
      tag: 'NOVO • CAPCUT OPEN-SOURCE',
      tagColor: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
      description: 'Estúdio profissional de edição de vídeo de código aberto (OpenCut). Faça cortes, edite Reels/Shorts (9:16), vídeos de cultos (16:9), adicione legendas, efeitos e transições com processamento local privado (WASM/GPU).',
      features: [
        'Editor completo estilo CapCut baseado no motor OpenCut (Rust + WASM)',
        'Ideal para cortes de testemunhos, pregações, Reels, Shorts e TikTok',
        'Processamento 100% local e privado direto no navegador com aceleração de GPU',
        'Linha do tempo multicamadas, textos, áudio, transições e exportação 4K'
      ],
      path: `${import.meta.env.BASE_URL}tools/cinecut_studio.html`,
      iframeUrl: `${import.meta.env.BASE_URL}tools/cinecut_studio.html`
    },
    {
      id: 'photogimp',
      title: 'PhotoGIMP Studio Pro (GIMP + Photoshop Diolinux)',
      icon: Palette,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      tag: 'NOVO • PHOTOGIMP PRO',
      tagColor: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
      description: 'Estúdio de design e edição de imagem profissional baseado no projeto PhotoGIMP (Diolinux). Interface, ferramentas e atalhos idênticos ao Adobe Photoshop com suporte a arquivos PSD, camadas, filtros e exportação de alta resolução.',
      features: [
        'Interface e atalhos de teclado 100% mapeados no padrão Adobe Photoshop',
        'Suporte nativo a arquivos PSD, PNG, JPG, WebP e camadas com máscaras',
        'Ferramentas avançadas: Pincéis, varinha mágica, caneta, curvas e filtros',
        'Acesso direto à documentação oficial e patch do Diolinux PhotoGIMP'
      ],
      path: `${import.meta.env.BASE_URL}tools/photogimp_studio.html`,
      iframeUrl: `${import.meta.env.BASE_URL}tools/photogimp_studio.html`
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
      title: 'Gerador de Slides (Canva Killer Pro)',
      icon: Presentation,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      tag: 'PDF & TEXTO ESCRITO',
      tagColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
      description: 'Estúdio profissional para transformar sermões e estudos em apresentações de alto impacto. Aceita tanto arquivos PDF quanto textos/mensagens coladas diretamente.',
      features: [
        'Importe PDFs ou Cole Mensagens do Pastor (WhatsApp / Anotações)',
        'Detecção inteligente de tópicos e versículos bíblicos formatados',
        'Editor visual estilo Canvas (drag-and-drop)',
        'Geração e exportação de arquivos PPTX nativos'
      ],
      path: `${import.meta.env.BASE_URL}tools/gerador_de_slides.html?v=ai_val_v4`,
      iframeUrl: `${import.meta.env.BASE_URL}tools/gerador_de_slides.html?v=ai_val_v4`
    },
    {
      id: 'biblia',
      title: 'Bíblia de Estudo Exegética (Léxico, Pais da Igreja & Prática)',
      icon: BookMarked,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      tag: 'EXEGESE & PATRÍSTICA',
      tagColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      description: 'Texto bíblico fluido em português com consulta interativa palavra por palavra. Ao clicar, revela o original em hebraico/grego, comentários dos antigos Pais da Igreja e aplicação prática evangélica.',
      features: [
        'Leitura limpa e contínua do texto bíblico em português (ARA)',
        'Clique em qualquer palavra para abrir o Hebraico/Grego e Strong',
        'Comentários dos Pais da Igreja (Agostinho, Crisóstomo) e Reformadores',
        'Aplicação prática para a vida cristã e exegese pastoral com IA'
      ],
      path: `${import.meta.env.BASE_URL}tools/biblia_interlinear.html?v=exegetica`,
      iframeUrl: `${import.meta.env.BASE_URL}tools/biblia_interlinear.html?v=exegetica`
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
          src={tool.iframeUrl.includes('?') ? `${tool.iframeUrl}&_t=${Date.now()}` : `${tool.iframeUrl}?_t=${Date.now()}`}
          className="flex-1 w-full h-full border-none relative z-1 bg-[#1a1a1a]"
          title={tool.title}
          allow="microphone; camera; display-capture; clipboard-read; clipboard-write; fullscreen"
        />
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full animate-fade-in pb-24 md:pb-10 overflow-y-auto space-y-6">
      {/* Hero Header */}
      <div className={`p-6 rounded-2xl border ${
        darkMode ? 'bg-[#101118]/70 backdrop-blur-md border-white/[0.08]' : 'bg-white border-zinc-200'
      } flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden`}>
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">Suíte de Criação & Produtividade</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Wand2 className="w-6 h-6 text-violet-400" />
            Estúdio & Ferramentas Integradas
          </h1>
          <p className="text-xs text-zinc-400 max-w-xl">
            Soluções completas de design gráfico, apresentações e automação de relatórios nativas no Obnotion.
          </p>
        </div>
      </div>

      {/* Grid of Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {tools.map(tool => (
          <div
            key={tool.id}
            className={`flex flex-col p-6 rounded-2xl border ${
              darkMode ? 'bg-[#111219]/70 border-white/[0.07]' : 'bg-white border-zinc-200'
            } transition-all duration-200 hover:border-white/[0.15] hover:bg-[#13141f] group`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${tool.bgColor} ${tool.borderColor} border`}>
                <tool.icon className={`w-6 h-6 ${tool.color}`} />
              </div>
              <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${tool.tagColor}`}>
                {tool.tag}
              </span>
            </div>

            <h3 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors">
              {tool.title}
            </h3>

            <p className="text-xs text-zinc-400 mt-2 mb-4 leading-relaxed flex-1">
              {tool.description}
            </p>

            <div className="mb-6 space-y-2 border-t border-white/[0.05] pt-4">
              <h4 className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Recursos Integrados</h4>
              <ul className="space-y-1.5">
                {tool.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400/70 mt-1.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <button 
              onClick={() => setActiveTool(tool.id)}
              className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Abrir Ferramenta no Obnotion
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
