import React, { useState } from 'react';
import { Presentation, FileSpreadsheet, Bot, Wand2, ExternalLink, X, Maximize, Play } from 'lucide-react';

export default function ProductivityView({ darkMode }) {
  const [activeTool, setActiveTool] = useState(null);

  const tools = [
    {
      id: 'slides',
      title: 'Gerador de Slides (Canva Killer Pro)',
      icon: Presentation,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      description: 'Estúdio profissional para transformar sermões em apresentações incríveis. Extrai textos de PDFs e gera slides com referências bíblicas formatadas.',
      features: [
        'Importação inteligente de sermões em PDF',
        'Editor visual estilo Canvas (drag-and-drop)',
        'Geração de arquivos PPTX nativos',
        'Separação automática de tópicos e versículos'
      ],
      path: `${import.meta.env.BASE_URL}tools/gerador_de_slides.html`,
      iframeUrl: `${import.meta.env.BASE_URL}tools/gerador_de_slides.html`
    },
    {
      id: 'planilhas',
      title: 'Planilhas Automáticas & Relatórios',
      icon: FileSpreadsheet,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      description: 'Central de Automação. Lê dados complexos de planilhas/PDFs consolidados e separa dinamicamente a geração por blocos ou regiões.',
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
        <div className={`p-3 flex items-center justify-between border-b shadow-sm z-10 ${darkMode ? 'bg-[#15161e] border-gray-800' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded-lg ${tool.bgColor}`}>
              <tool.icon className={`w-5 h-5 ${tool.color}`} />
            </div>
            <h2 className="font-bold text-sm text-inherit">{tool.title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => window.open(tool.iframeUrl, '_blank')}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-gray-800 transition-colors flex items-center gap-1.5 text-xs font-medium"
              title="Abrir em tela cheia na nova guia"
            >
              <Maximize className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Nova Guia</span>
            </button>
            <div className="w-px h-4 bg-gray-700 mx-1"></div>
            <button 
              onClick={() => setActiveTool(null)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-1.5 text-xs font-medium"
              title="Fechar ferramenta e voltar"
            >
              <X className="w-4 h-4" />
              <span>Fechar</span>
            </button>
          </div>
        </div>
        
        <iframe 
          src={tool.iframeUrl} 
          className="flex-1 w-full h-full border-none relative z-1 bg-white"
          title={tool.title}
          allow="microphone; camera; display-capture"
        />
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 lg:p-10 max-w-6xl mx-auto w-full animate-fade-in pb-24 md:pb-10 overflow-y-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 tracking-tight">
            <Wand2 className="w-8 h-8 text-purple-500" />
            Minhas Ferramentas de Produtividade
          </h1>
          <p className="text-gray-400 mt-2 font-medium">
            Suas soluções customizadas integradas nativamente ao Obnotion.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {tools.map(tool => (
          <div
            key={tool.id}
            className={`flex flex-col p-6 rounded-2xl border ${darkMode ? 'bg-[#15161e] border-gray-800' : 'bg-white border-gray-200 shadow-sm'} transition-all hover:-translate-y-1 hover:shadow-lg`}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className={`p-3 rounded-xl ${tool.bgColor} ${tool.borderColor} border`}>
                <tool.icon className={`w-6 h-6 ${tool.color}`} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-inherit">{tool.title}</h3>
                <p className="text-xs text-gray-500 font-mono mt-1 flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" />
                  {tool.path}
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-400 mb-6 leading-relaxed flex-1">
              {tool.description}
            </p>

            <div className="mb-6">
              <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">Recursos</h4>
              <ul className="space-y-2">
                {tool.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                    <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${tool.bgColor.split('/')[0]}`} />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <button 
              onClick={() => setActiveTool(tool.id)}
              className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm transition-colors ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
            >
              <Play className="w-4 h-4" />
              Abrir Ferramenta no Obnotion
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
