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
      content: '# Bem-vindo ao seu Obnotion!\n\nComece a registrar suas anotações, tarefas e finanças aqui.'
    }
  ],
  transactions: [],
  bills: [],
  debts: [],
  creditCards: [],
  financeProfile: {
    paymentFrequency: 'monthly', // 'monthly' | 'biweekly'
    monthlySalary: 0,
    salaryDay: 5,
    firstPaymentAmount: 0,
    firstPaymentDay: 20,
    secondPaymentAmount: 0,
    secondPaymentDay: 5,
    grossSalary: 0,
    hasDiscounts: false,
    discounts: [] // [{ id, name, amount }]
  },
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