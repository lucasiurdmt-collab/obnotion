const today = new Date();
const formatDate = (d) => d.toISOString().split('T')[0];

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
  journalEntries: [],
  settings: {}
};

export const INITIAL_DATA = EMPTY_WORKSPACE_DATA;