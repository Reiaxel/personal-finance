'use client';

import { useState, useEffect } from 'react';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
}

const defaultCategories: Category[] = [
  { id: '1', name: 'Salario', type: 'income', color: '#10B981', icon: '💼' },
  { id: '2', name: 'Freelance', type: 'income', color: '#059669', icon: '💻' },
  { id: '3', name: 'Inversiones', type: 'income', color: '#047857', icon: '📈' },
  { id: '4', name: 'Alimentación', type: 'expense', color: '#EF4444', icon: '🍽️' },
  { id: '5', name: 'Transporte', type: 'expense', color: '#DC2626', icon: '🚗' },
  { id: '6', name: 'Entretenimiento', type: 'expense', color: '#B91C1C', icon: '🎬' },
  { id: '7', name: 'Compras', type: 'expense', color: '#991B1B', icon: '🛍️' },
  { id: '8', name: 'Servicios', type: 'expense', color: '#7F1D1D', icon: '🏠' },
];

const defaultTransactions: Transaction[] = [
  {
    id: '1',
    type: 'income',
    amount: 3500000,
    category: 'Salario',
    description: 'Salario mensual',
    date: '2025-01-01',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    type: 'expense',
    amount: 150000,
    category: 'Alimentación',
    description: 'Supermercado',
    date: '2025-01-02',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    type: 'expense',
    amount: 80000,
    category: 'Transporte',
    description: 'Gasolina',
    date: '2025-01-03',
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    type: 'income',
    amount: 500000,
    category: 'Freelance',
    description: 'Proyecto web',
    date: '2025-01-04',
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    type: 'expense',
    amount: 200000,
    category: 'Entretenimiento',
    description: 'Cine y cena',
    date: '2025-01-05',
    createdAt: new Date().toISOString()
  }
];

export function useFinanceData() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories] = useState<Category[]>(defaultCategories);

  useEffect(() => {
    const stored = localStorage.getItem('finance_transactions');
    if (stored) {
      setTransactions(JSON.parse(stored));
    } else {
      setTransactions(defaultTransactions);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('finance_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => 
      prev.map(t => t.id === id ? { ...t, ...updates } : t)
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return {
    transactions,
    categories,
    addTransaction,
    updateTransaction,
    deleteTransaction
  };
}