"use client";

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { Transaction, Goal, ChatMessage, Insight, Pattern } from '@/lib/types';

interface FinanceState {
  transactions: Transaction[];
  goals: Goal[];
  messages: ChatMessage[];
  insights: Insight[];
  patterns: Pattern[];
  stats: {
    totalBalance: number;
    monthlySpending: number;
    monthlyIncome: number;
    savingsRate: number;
    goalsProgress: number;
  };
  categoryBreakdown: { category: string; amount: number; percentage: number; fill: string }[];
  monthlyData: { month: string; spending: number; income: number }[];
  isLoading: boolean;
  error: string | null;
}

type FinanceAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'SET_GOALS'; payload: Goal[] }
  | { type: 'ADD_GOAL'; payload: Goal }
  | { type: 'DELETE_GOAL'; payload: string }
  | { type: 'UPDATE_GOAL'; payload: Goal }
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_MESSAGES'; payload: ChatMessage[] }
  | { type: 'SET_STATS'; payload: Partial<FinanceState> };

const initialState: FinanceState = {
  transactions: [],
  goals: [],
  messages: [
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI Finance Assistant. I can help you understand your spending patterns, give personalized advice, and help you reach your financial goals. What would you like to know?",
      timestamp: new Date().toISOString(),
    },
  ],
  insights: [],
  patterns: [],
  stats: {
    totalBalance: 0,
    monthlySpending: 0,
    monthlyIncome: 0,
    savingsRate: 0,
    goalsProgress: 0,
  },
  categoryBreakdown: [],
  monthlyData: [],
  isLoading: true,
  error: null,
};

function financeReducer(state: FinanceState, action: FinanceAction): FinanceState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'DELETE_TRANSACTION':
      return { ...state, transactions: state.transactions.filter(t => t.id !== action.payload) };
    case 'SET_GOALS':
      return { ...state, goals: action.payload };
    case 'ADD_GOAL':
      return { ...state, goals: [...state.goals, action.payload] };
    case 'DELETE_GOAL':
      return { ...state, goals: state.goals.filter(g => g.id !== action.payload) };
    case 'UPDATE_GOAL':
      return {
        ...state,
        goals: state.goals.map(g => g.id === action.payload.id ? action.payload : g),
      };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'SET_STATS':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

interface FinanceContextType {
  state: FinanceState;
  fetchTransactions: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  fetchGoals: () => Promise<void>;
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  updateGoal: (id: string, amount: number) => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  fetchStats: () => Promise<void>;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(financeReducer, initialState);

  const fetchTransactions = useCallback(async () => {
    try {
      const res = await fetch('/api/expenses');
      const json = await res.json();
      if (json.success) {
        dispatch({ type: 'SET_TRANSACTIONS', payload: json.data });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch transactions' });
    }
  }, []);

  const addTransaction = useCallback(async (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction),
      });
      const json = await res.json();
      if (json.success) {
        dispatch({ type: 'ADD_TRANSACTION', payload: json.data });
        // Refresh stats after adding transaction
        fetchStats();
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add transaction' });
    }
  }, []);

  const deleteTransaction = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        dispatch({ type: 'DELETE_TRANSACTION', payload: id });
        // Refresh stats after deleting transaction
        fetchStats();
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete transaction' });
    }
  }, []);

  const fetchGoals = useCallback(async () => {
    try {
      const res = await fetch('/api/goals');
      const json = await res.json();
      if (json.success) {
        dispatch({ type: 'SET_GOALS', payload: json.data });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch goals' });
    }
  }, []);

  const addGoal = useCallback(async (goal: Omit<Goal, 'id' | 'createdAt'>) => {
    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goal),
      });
      const json = await res.json();
      if (json.success) {
        dispatch({ type: 'ADD_GOAL', payload: json.data });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add goal' });
    }
  }, []);

  const deleteGoal = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/goals/${id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        dispatch({ type: 'DELETE_GOAL', payload: id });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete goal' });
    }
  }, []);

  const updateGoal = useCallback(async (id: string, amount: number) => {
    try {
      const res = await fetch(`/api/goals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addFunds: amount }),
      });
      const json = await res.json();
      if (json.success) {
        dispatch({ type: 'UPDATE_GOAL', payload: json.data });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update goal' });
    }
  }, []);

  const sendMessage = useCallback(async (message: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const json = await res.json();
      if (json.success) {
        dispatch({ type: 'ADD_MESSAGE', payload: json.data });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to get AI response' });
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/stats');
      const json = await res.json();
      if (json.success) {
        dispatch({
          type: 'SET_STATS',
          payload: {
            stats: json.data.stats,
            categoryBreakdown: json.data.categoryBreakdown,
            monthlyData: json.data.monthlyData,
            insights: json.data.insights,
            patterns: json.data.patterns,
          },
        });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch stats' });
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    const loadData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      await Promise.all([
        fetchTransactions(),
        fetchGoals(),
        fetchStats(),
      ]);
      dispatch({ type: 'SET_LOADING', payload: false });
    };
    loadData();
  }, [fetchTransactions, fetchGoals, fetchStats]);

  const value: FinanceContextType = {
    state,
    fetchTransactions,
    addTransaction,
    deleteTransaction,
    fetchGoals,
    addGoal,
    deleteGoal,
    updateGoal,
    sendMessage,
    fetchStats,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}
