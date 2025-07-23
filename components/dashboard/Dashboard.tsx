'use client';

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { OverviewCards } from './OverviewCards';
import { TransactionChart } from './TransactionChart';
import { CategoryBreakdown } from './CategoryBreakdown';
import { RecentTransactions } from './RecentTransactions';
import { TransactionForm } from './TransactionForm';
import { TransactionList } from './TransactionList';
import { useFinanceData } from '@/hooks/useFinanceData';

export default function Dashboard() {
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { transactions, addTransaction, updateTransaction, deleteTransaction, categories } = useFinanceData();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1 overflow-y-auto p-6">
          {activeView === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Financiero</h1>
              </div>
              
              <OverviewCards transactions={transactions} />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TransactionChart transactions={transactions} />
                <CategoryBreakdown transactions={transactions} categories={categories} />
              </div>
              
              <RecentTransactions transactions={transactions.slice(0, 5)} />
            </div>
          )}
          
          {activeView === 'transactions' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Transacciones</h1>
              </div>
              <TransactionList 
                transactions={transactions}
                onEdit={updateTransaction}
                onDelete={deleteTransaction}
                categories={categories}
              />
            </div>
          )}
          
          {activeView === 'add-transaction' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Nueva Transacción</h1>
              </div>
              <TransactionForm 
                onSubmit={addTransaction}
                categories={categories}
                onSuccess={() => setActiveView('dashboard')}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}