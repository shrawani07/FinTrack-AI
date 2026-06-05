import { Transaction, Goal, Insight, Pattern } from './types';

// In-memory database for mock data
export const db = {
  transactions: [
    { id: '1', amount: 450, category: 'Food', date: '2024-01-15', note: 'Lunch at restaurant', type: 'expense', createdAt: '2024-01-15T10:00:00Z' },
    { id: '2', amount: 1200, category: 'Shopping', date: '2024-01-14', note: 'New headphones', type: 'expense', createdAt: '2024-01-14T14:00:00Z' },
    { id: '3', amount: 350, category: 'Travel', date: '2024-01-14', note: 'Uber ride', type: 'expense', createdAt: '2024-01-14T09:00:00Z' },
    { id: '4', amount: 2500, category: 'Bills', date: '2024-01-13', note: 'Electricity bill', type: 'expense', createdAt: '2024-01-13T11:00:00Z' },
    { id: '5', amount: 180, category: 'Food', date: '2024-01-13', note: 'Groceries', type: 'expense', createdAt: '2024-01-13T08:00:00Z' },
    { id: '6', amount: 890, category: 'Food', date: '2024-01-12', note: 'Online food order', type: 'expense', createdAt: '2024-01-12T20:00:00Z' },
    { id: '7', amount: 3500, category: 'Shopping', date: '2024-01-11', note: 'Clothes shopping', type: 'expense', createdAt: '2024-01-11T16:00:00Z' },
    { id: '8', amount: 150, category: 'Others', date: '2024-01-10', note: 'Subscription', type: 'expense', createdAt: '2024-01-10T00:00:00Z' },
    { id: '9', amount: 650, category: 'Travel', date: '2024-01-09', note: 'Metro pass', type: 'expense', createdAt: '2024-01-09T07:00:00Z' },
    { id: '10', amount: 420, category: 'Food', date: '2024-01-08', note: 'Dinner with friends', type: 'expense', createdAt: '2024-01-08T21:00:00Z' },
  ] as Transaction[],

  goals: [
    { id: '1', name: 'Emergency Fund', target: 50000, current: 32500, deadline: '2024-06-30', createdAt: '2024-01-01T00:00:00Z' },
    { id: '2', name: 'Vacation Trip', target: 25000, current: 8000, deadline: '2024-12-31', createdAt: '2024-01-01T00:00:00Z' },
    { id: '3', name: 'New Laptop', target: 80000, current: 45000, deadline: '2024-09-30', createdAt: '2024-01-01T00:00:00Z' },
  ] as Goal[],

  monthlyData: [
    { month: 'Aug', spending: 12500, income: 45000 },
    { month: 'Sep', spending: 15800, income: 45000 },
    { month: 'Oct', spending: 11200, income: 48000 },
    { month: 'Nov', spending: 18500, income: 48000 },
    { month: 'Dec', spending: 22000, income: 52000 },
    { month: 'Jan', spending: 14290, income: 52000 },
  ],
};

export const insights: Insight[] = [
  { id: '1', type: 'warning', message: 'You spent 20% more this week compared to last week' },
  { id: '2', type: 'info', message: 'Food is your highest expense category this month' },
  { id: '3', type: 'tip', message: 'Try reducing online food orders to save more' },
  { id: '4', type: 'success', message: 'You saved 15% more than last month!' },
];

export const patterns: Pattern[] = [
  { id: '1', pattern: 'You tend to spend more on weekends' },
  { id: '2', pattern: 'Shopping expenses increased this month by 30%' },
  { id: '3', pattern: 'Your food expenses peak on Fridays' },
  { id: '4', pattern: 'Bill payments are consistent every month' },
];

export const categoryColors: Record<string, string> = {
  Food: 'hsl(var(--chart-1))',
  Travel: 'hsl(var(--chart-2))',
  Shopping: 'hsl(var(--chart-3))',
  Bills: 'hsl(var(--chart-4))',
  Others: 'hsl(var(--chart-5))',
};
