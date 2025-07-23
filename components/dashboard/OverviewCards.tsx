'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';
import { Transaction } from '@/hooks/useFinanceData';

interface OverviewCardsProps {
  transactions: Transaction[];
}

export function OverviewCards({ transactions }: OverviewCardsProps) {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const balance = totalIncome - totalExpenses;
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyExpenses = transactions
    .filter(t => {
      const date = new Date(t.date);
      return t.type === 'expense' && 
             date.getMonth() === currentMonth && 
             date.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const cards = [
    {
      title: 'Balance Total',
      value: formatCurrency(balance),
      icon: DollarSign,
      trend: balance >= 0 ? 'positive' : 'negative',
      description: 'Balance actual'
    },
    {
      title: 'Ingresos Totales',
      value: formatCurrency(totalIncome),
      icon: TrendingUp,
      trend: 'positive',
      description: 'Total de ingresos'
    },
    {
      title: 'Gastos Totales',
      value: formatCurrency(totalExpenses),
      icon: TrendingDown,
      trend: 'negative',
      description: 'Total de gastos'
    },
    {
      title: 'Gastos del Mes',
      value: formatCurrency(monthlyExpenses),
      icon: Target,
      trend: 'neutral',
      description: 'Gastos de este mes'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="transition-all duration-200 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <Icon className={`h-5 w-5 ${
                card.trend === 'positive' ? 'text-green-600' :
                card.trend === 'negative' ? 'text-red-600' : 'text-blue-600'
              }`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{card.value}</div>
              <p className="text-xs text-gray-500 mt-1">{card.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}