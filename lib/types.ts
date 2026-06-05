export interface Transaction {
  id: string;
  amount: number;
  category: 'Food' | 'Travel' | 'Shopping' | 'Bills' | 'Others';
  date: string;
  note: string;
  type: 'expense' | 'income';
  createdAt: string;
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Insight {
  id: string;
  type: 'warning' | 'info' | 'tip' | 'success';
  message: string;
}

export interface Pattern {
  id: string;
  pattern: string;
}

export interface FinanceStats {
  totalBalance: number;
  monthlySpending: number;
  monthlyIncome: number;
  savingsRate: number;
  categoryBreakdown: { category: string; amount: number; percentage: number }[];
}

export type Category = Transaction['category'];

export const CATEGORIES: Category[] = ['Food', 'Travel', 'Shopping', 'Bills', 'Others'];
