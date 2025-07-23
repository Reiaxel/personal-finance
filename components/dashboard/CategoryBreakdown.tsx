'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Transaction, Category } from '@/hooks/useFinanceData';

interface CategoryBreakdownProps {
  transactions: Transaction[];
  categories: Category[];
}

export function CategoryBreakdown({ transactions, categories }: CategoryBreakdownProps) {
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  
  const categoryData = categories
    .filter(cat => cat.type === 'expense')
    .map(category => {
      const total = expenseTransactions
        .filter(t => t.category === category.name)
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        name: category.name,
        value: total,
        color: category.color,
        icon: category.icon
      };
    })
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{`${data.icon} ${data.name}`}</p>
          <p className="text-sm text-gray-600">{`Gasto: ${formatCurrency(data.value)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Gastos por Categoría</CardTitle>
        <p className="text-sm text-gray-500">Distribución de tus gastos</p>
      </CardHeader>
      <CardContent>
        {categoryData.length > 0 ? (
          <div className="space-y-4">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="space-y-2">
              {categoryData.slice(0, 5).map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium">{item.icon} {item.name}</span>
                  </div>
                  <span className="text-sm text-gray-600">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <p>No hay datos de gastos disponibles</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}