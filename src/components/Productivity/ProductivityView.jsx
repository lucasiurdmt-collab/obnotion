import React from 'react';
import { Presentation, FileSpreadsheet, Bot, Wand2, ExternalLink } from 'lucide-react';

export default function ProductivityView({ darkMode }) {
  const tools = [
    {
      id: 'slides',
      title: 'Gerador de Slides (Canva Killer Pro)',
      icon: Presentation,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      description: 'Estúdio profissional para transformar sermões em apresentações incríveis. Extrai textos de PDFs usando inteligência e gera slides com referências bíblicas formatadas. Inclui um editor visual completo com exportação nativa para .pptx.',
      features: [
        'Importação inteligente de sermões em PDF',
        'Editor visual estilo Canvas (drag-and-drop)',
        'Geração de arquivos PPTX nativos',
        'Separação automática de tópicos, textos livres e versículos'
      ],
      path: 'Desktop/Minha IA Pessoal/gerador_de_slides.html'
    },
    {
      id: 'planilhas',
      title: 'Separador de Relatórios (Planilhas Automáticas)',
      icon: FileSpreadsheet,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      description: 'Script automatizado Node.js para processar relatórios de usuários ativos. Lê dados complexos de planilhas/PDFs consolidados e separa dinamicamente a geração por blocos ou regiões.',
      features: [
        'Processa automaticamente arquivos PDF ou Excel',
        'Gera PDFs individuais e formatados por bloco (cabeçalhos, cores)',
        'Estatísticas calculadas (congregações, ativos)',
        'Execução via terminal: npm start'
      ],
      path: 'Desktop/Planilhas automaticas'
    },
    {
      id: 'jarvis',
      title: 'JARVIS - Obsidian Neural AI Hub',
      icon: Bot,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      description: 'Assistente pessoal com ativação por voz ("Olá Jarvis") e Graph View interativo.',
      features: [
        'Comandos de voz 100% mãos livres',
        'Integração com tarefas e calendário',
        'Navegação Graph View controlada por gestos de webcam',
        'Design minimalista inspirado no Obsidian'
      ],
      path: 'Desktop/Minha IA Pessoal/iniciar_jarvis.bat'
    }
  ];

  return (
    <div className="flex-1 p-6 lg:p-10 max-w-6xl mx-auto w-full animate-fade-in pb-24 md:pb-10 overflow-y-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 tracking-tight">
            <Wand2 className="w-8 h-8 text-purple-500" />
            Minhas Ferramentas de Produtividade
          </h1>
          <p className="text-gray-400 mt-2 font-medium">
            Seus scripts e automações customizadas salvos localmente.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div>
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
          </div>
        ))}
      </div>
    </div>
  );
}
