const today = new Date();
const formatDate = (d) => d.toISOString().split('T')[0];
const currentMonth = today.toISOString().slice(0, 7); // YYYY-MM

const getDayOffset = (offset) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return formatDate(d);
};
export const EMPTY_WORKSPACE_DATA = {
  theme: 'dark',
  colorScheme: 'purple',
  readingGoalYear: 12,
  notes: [
    {
      id: 'note-1',
      title: 'Minha Primeira Nota',
      icon: '📝',
      folder: 'Geral',
      tags: ['Ideias'],
      pinned: true,
      createdAt: formatDate(today),
      updatedAt: formatDate(today),
      content: '# Bem-vindo ao seu Obnotion! 🚀\n\nComece a escrever suas ideias aqui. Use `[[Nome de Outra Nota]]` para conectar pensamentos!'
    }
  ],
  transactions: [],
  financeGoals: [],
  books: [],
  tasks: [],
  habits: [],
  calendarEvents: [],
  weeklySchedule: [],
  journalEntries: []
};

export const INITIAL_DATA = {
  theme: 'dark',
  colorScheme: 'purple',
  readingGoalYear: 18,
  
  notes: [
    {
      id: 'note-1',
      title: '🎯 Meu Segundo Cérebro (Guia de Uso)',
      icon: '🧠',
      cover: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
      folder: 'Pessoal',
      tags: ['Produtividade', 'SegundoCerebro', 'Obnotion'],
      pinned: true,
      createdAt: getDayOffset(-5),
      updatedAt: getDayOffset(0),
      content: `# Bem-vindo ao seu Obnotion! 🚀

Este é o seu **centro de comando pessoal**, unindo a flexibilidade visual do **Notion** com a agilidade e conexões em grafo do **Obsidian**.

---

## 🌟 O que você pode fazer aqui:

- 📝 **Notas & Documentos**: Escreva em Markdown, crie checklists, adicione tags e veja conexões com [[Guia de Produtividade]].
- 🕸️ **Grafo de Conexões**: Clique no botão "Grafo" para ver o mapa visual de como suas ideias se interligam!
- 💰 **Finanças Pessoais**: Registre entradas, saídas, categorias e acompanhe suas metas.
- 📚 **Biblioteca & Leituras**: Acompanhe livros lidos no mês, progresso de páginas e notas de avaliação.
- ✅ **Tarefas & Kanban**: Arraste tarefas entre *A Fazer*, *Em Andamento* e *Concluído*.
- 📅 **Calendário & Rotina Semanal**: Planeje seus dias e monte sua grade de atividades semanais.
- 🔥 **Rastreador de Hábitos**: Mantenha a consistência diária e acumule *streaks*.
- 📖 **Diário Pessoal**: Reflexão diária com registro de humor e gratidão.
- ⏱️ **Pomodoro Timer**: Foco total com intervalos de descanso.

---

### 💡 Dica rápida sobre Wikilinks (Estilo Obsidian):
Você pode conectar notas digitando \`[[Nome de Outra Nota]]\`. Experimente criar novas notas e navegar entre elas!`
    },
    {
      id: 'note-2',
      title: '⚡ Guia de Produtividade e Foco',
      icon: '⚡',
      cover: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
      folder: 'Estudos',
      tags: ['Produtividade', 'Foco', 'Habitos'],
      pinned: false,
      createdAt: getDayOffset(-4),
      updatedAt: getDayOffset(-1),
      content: `# Regras de Ouro para Alta Performance

1. **Blocos de Tempo (Time Blocking)**: Divida seu dia em blocos ininterruptos para tarefas profundas (Deep Work).
2. **Técnica Pomodoro**: 25 minutos de hiperfoco + 5 minutos de descanso.
3. **Revisão Semanal**: Todo domingo, reserve 20 minutos para revisar suas [[🎯 Meu Segundo Cérebro (Guia de Uso)]] e finanças.

### Checklist Diário:
- [x] Definir as 3 tarefas prioritárias da manhã
- [x] 1 sessão de foco sem celular por perto
- [ ] Revisar anotações do dia`
    },
    {
      id: 'note-3',
      title: '🌱 Ideias para Projetos e Criatividade',
      icon: '💡',
      cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
      folder: 'Projetos',
      tags: ['Criatividade', 'Projetos', 'Ideias'],
      pinned: false,
      createdAt: getDayOffset(-3),
      updatedAt: getDayOffset(-2),
      content: `# Banco de Ideias

- [ ] Criar um blog estático integrado com GitHub Actions
- [ ] Automatizar backups locais semanais
- [x] Estruturar o painel do Obnotion no GitHub Pages

> "A criatividade é apenas conectar coisas." — Steve Jobs`
    }
  ],

  transactions: [
    { id: 'tx-1', description: 'Salário / Proventos Mensais', amount: 6500.00, type: 'income', category: 'Salário', date: `${currentMonth}-05`, status: 'paid', notes: 'Transferência principal' },
    { id: 'tx-2', description: 'Projeto Freelance Web', amount: 1800.00, type: 'income', category: 'Freelance', date: `${currentMonth}-12`, status: 'paid', notes: 'Consultoria' },
    { id: 'tx-3', description: 'Aluguel & Condomínio', amount: 2100.00, type: 'expense', category: 'Moradia', date: `${currentMonth}-10`, status: 'paid', notes: 'Vencimento dia 10' },
    { id: 'tx-4', description: 'Supermercado Mensal', amount: 850.40, type: 'expense', category: 'Alimentação', date: `${currentMonth}-08`, status: 'paid', notes: 'Compras do mês' },
    { id: 'tx-5', description: 'Internet Fibra 600MB', amount: 129.90, type: 'expense', category: 'Moradia', date: `${currentMonth}-15`, status: 'paid', notes: 'Débito automático' },
    { id: 'tx-6', description: 'Jantar Restaurante', amount: 145.00, type: 'expense', category: 'Lazer', date: `${currentMonth}-14`, status: 'paid', notes: 'Fim de semana' },
    { id: 'tx-7', description: 'Aporte Tesouro Direto / FIIs', amount: 1500.00, type: 'expense', category: 'Investimentos', date: `${currentMonth}-06`, status: 'paid', notes: 'Poupança futura' },
    { id: 'tx-8', description: 'Farmácia & Vitaminas', amount: 110.00, type: 'expense', category: 'Saúde', date: `${currentMonth}-17`, status: 'paid', notes: 'Medicamentos' }
  ],

  financeGoals: [
    { id: 'fg-1', title: '🛡️ Reserva de Emergência (6 meses)', targetAmount: 25000, currentAmount: 18500, deadline: '2026-12-31' },
    { id: 'fg-2', title: '💻 Upgrade Setup de Trabalho', targetAmount: 6000, currentAmount: 4200, deadline: '2026-10-30' },
    { id: 'fg-3', title: '✈️ Viagem de Férias', targetAmount: 8000, currentAmount: 3100, deadline: '2027-02-15' }
  ],

  books: [
    {
      id: 'book-1',
      title: 'Hábitos Atômicos',
      author: 'James Clear',
      totalPages: 320,
      currentPage: 215,
      status: 'reading',
      rating: 5,
      cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      genre: 'Desenvolvimento Pessoal',
      startDate: `${currentMonth}-02`,
      finishDate: '',
      monthRead: '',
      review: 'Um dos melhores livros sobre psicologia comportamental e pequenas melhorias diárias de 1%.'
    },
    {
      id: 'book-2',
      title: 'A Psicologia Financeira',
      author: 'Morgan Housel',
      totalPages: 304,
      currentPage: 304,
      status: 'completed',
      rating: 5,
      cover: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&w=600&q=80',
      genre: 'Finanças & Economia',
      startDate: `${currentMonth}-01`,
      finishDate: `${currentMonth}-15`,
      monthRead: currentMonth,
      review: 'Lições atemporais sobre como nos comportamos em relação ao dinheiro, risco e paciência.'
    },
    {
      id: 'book-3',
      title: 'Hiperfoco',
      author: 'Chris Bailey',
      totalPages: 256,
      currentPage: 256,
      status: 'completed',
      rating: 4,
      cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
      genre: 'Produtividade',
      startDate: `${currentMonth}-03`,
      finishDate: `${currentMonth}-18`,
      monthRead: currentMonth,
      review: 'Estratégias práticas para focar em tarefas de alto valor e evitar a dispersão mental.'
    },
    {
      id: 'book-4',
      title: 'O Homem Mais Rico da Babilônia',
      author: 'George S. Clason',
      totalPages: 160,
      currentPage: 0,
      status: 'wishlist',
      rating: 0,
      cover: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=600&q=80',
      genre: 'Finanças Pessoais',
      startDate: '',
      finishDate: '',
      monthRead: '',
      review: 'Próximo da fila para ler.'
    }
  ],

  tasks: [
    { id: 'task-1', title: 'Revisar metas do mês e balanço financeiro', status: 'done', priority: 'high', dueDate: getDayOffset(0), tags: ['Finanças', 'Urgente'], notes: 'Conferir extratos e poupança' },
    { id: 'task-2', title: 'Ler 20 páginas de Hábitos Atômicos', status: 'in_progress', priority: 'medium', dueDate: getDayOffset(0), tags: ['Leitura'], notes: 'Capítulo sobre ambiente' },
    { id: 'task-3', title: 'Criar repositório no GitHub para o Obnotion', status: 'in_progress', priority: 'high', dueDate: getDayOffset(0), tags: ['Dev', 'GitHub'], notes: 'Configurar GitHub Pages' },
    { id: 'task-4', title: 'Treino de força na academia (Superiores)', status: 'todo', priority: 'medium', dueDate: getDayOffset(0), tags: ['Saúde'], notes: '18:30 às 19:30' },
    { id: 'task-5', title: 'Organizar documentos fiscais e comprovantes', status: 'todo', priority: 'low', dueDate: getDayOffset(2), tags: ['Finanças'], notes: 'Guardar recibos em PDF' },
    { id: 'task-6', title: 'Planejamento da próxima semana', status: 'todo', priority: 'medium', dueDate: getDayOffset(4), tags: ['Rotina'], notes: 'Definir blocos de tempo' }
  ],

  calendarEvents: [
    { id: 'ev-1', title: 'Reunião de Alinhamento de Projetos', date: getDayOffset(0), time: '14:00', category: 'work', color: '#8b5cf6' },
    { id: 'ev-2', title: 'Consulta Médica de Rotina', date: getDayOffset(1), time: '10:30', category: 'health', color: '#10b981' },
    { id: 'ev-3', title: 'Jantar em Família', date: getDayOffset(2), time: '20:00', category: 'personal', color: '#f59e0b' },
    { id: 'ev-4', title: 'Clube do Livro Online', date: getDayOffset(5), time: '19:00', category: 'study', color: '#3b82f6' }
  ],

  weeklySchedule: [
    { day: 'Segunda', morning: '🌅 07:00 Treino / 08:30 Trabalho Profundo', afternoon: '💻 14:00 Reuniões / 16:30 Tarefas Rápidas', evening: '📚 20:00 Leitura 30min / Diário' },
    { day: 'Terça', morning: '🌅 07:30 Caminhada / 08:30 Trabalho Profundo', afternoon: '💻 14:00 Projetos / 17:00 Estudo de Código', evening: '🧘 20:30 Relaxamento / Pomodoro Livre' },
    { day: 'Quarta', morning: '🌅 07:00 Treino / 08:30 Trabalho Profundo', afternoon: '💻 14:00 Alinhamentos / 16:00 Finanças', evening: '📚 20:00 Leitura / Planejamento' },
    { day: 'Quinta', morning: '🌅 07:30 Caminhada / 08:30 Trabalho Profundo', afternoon: '💻 14:00 Criação de Conteúdo / Dev', evening: '🎬 20:00 Lazer & Descanso' },
    { day: 'Sexta', morning: '🌅 07:00 Treino / 08:30 Fechamento Semanal', afternoon: '💻 14:00 Revisão de Metas / Limpeza Inbox', evening: '🍕 19:30 Jantar / Amigos' },
    { day: 'Sábado', morning: '☕ 08:30 Café tranquilo / Leitura longa', afternoon: '🌳 14:00 Passeio ao ar livre / Hobbies', evening: '🍿 20:00 Cinema / Descanso' },
    { day: 'Domingo', morning: '🍳 09:00 Brunch / Descanso', afternoon: '🧹 15:00 Organização da Casa', evening: '📝 19:00 Planejamento da Semana no Obnotion' }
  ],

  habits: [
    { id: 'hab-1', name: 'Beber 2L de Água', icon: '💧', color: '#3b82f6', history: { [getDayOffset(-3)]: true, [getDayOffset(-2)]: true, [getDayOffset(-1)]: true, [getDayOffset(0)]: true } },
    { id: 'hab-2', name: 'Ler pelo menos 20min', icon: '📖', color: '#8b5cf6', history: { [getDayOffset(-4)]: true, [getDayOffset(-3)]: true, [getDayOffset(-2)]: true, [getDayOffset(-1)]: true, [getDayOffset(0)]: true } },
    { id: 'hab-3', name: 'Exercício Físico / Treino', icon: '💪', color: '#10b981', history: { [getDayOffset(-3)]: true, [getDayOffset(-1)]: true, [getDayOffset(0)]: false } },
    { id: 'hab-4', name: 'Registrar Gastos do Dia', icon: '💰', color: '#f59e0b', history: { [getDayOffset(-2)]: true, [getDayOffset(-1)]: true, [getDayOffset(0)]: true } },
    { id: 'hab-5', name: 'Preencher Diário / Gratidão', icon: '✨', color: '#ec4899', history: { [getDayOffset(-3)]: true, [getDayOffset(-2)]: true, [getDayOffset(-1)]: true, [getDayOffset(0)]: false } }
  ],

  journalEntries: [
    {
      id: 'j-1',
      date: getDayOffset(0),
      mood: 'awesome',
      gratitude: '1. Dia muito produtivo\n2. Café fresquinho pela manhã\n3. Sistema Obnotion funcionando perfeitamente!',
      wins: 'Consegui adiantar a leitura do mês e organizar todas as pendências financeiras.',
      improvements: 'Evitar pegar no celular nos primeiros 30 minutos após acordar.',
      freeText: 'Hoje senti uma energia muito boa para criar e focar. O dia rendeu bastante!'
    },
    {
      id: 'j-2',
      date: getDayOffset(-1),
      mood: 'good',
      gratitude: '1. Boa conversa com amigos\n2. Concluí a leitura de Hiperfoco\n3. Saúde e disposição',
      wins: 'Bati a meta de treinos da semana.',
      improvements: 'Dormir 30 minutos mais cedo.',
      freeText: 'Reflexão rápida: consistência supera intensidade em qualquer objetivo de longo prazo.'
    }
  ],

  quotes: [
    { text: "Nós somos aquilo que fazemos repetidamente. A excelência, portanto, não é um ato, mas um hábito.", author: "Aristóteles" },
    { text: "Seu cérebro foi feito para ter ideias, não para guardá-las.", author: "David Allen (Getting Things Done)" },
    { text: "O segredo para progredir é começar.", author: "Mark Twain" },
    { text: "Pequenos ajustes diários geram transformações gigantescas ao longo do tempo.", author: "James Clear" }
  ]
};