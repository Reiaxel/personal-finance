'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Transaction, Category } from '@/hooks/useFinanceData';

const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().min(1, 'El monto debe ser mayor a 0'),
  category: z.string().min(1, 'Selecciona una categoría'),
  description: z.string().min(1, 'Agrega una descripción'),
  date: z.string().min(1, 'Selecciona una fecha'),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  categories: Category[];
  onSuccess: () => void;
  initialData?: Transaction;
}

export function TransactionForm({ onSubmit, categories, onSuccess, initialData }: TransactionFormProps) {
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>(initialData?.type || 'expense');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: initialData ? {
      type: initialData.type,
      amount: initialData.amount,
      category: initialData.category,
      description: initialData.description,
      date: initialData.date,
    } : {
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
    }
  });

  const filteredCategories = categories.filter(cat => cat.type === transactionType);

  const onFormSubmit = async (data: TransactionFormData) => {
    try {
      onSubmit(data);
      if (!initialData) {
        reset();
        setTransactionType('expense');
      }
      onSuccess();
    } catch (error) {
      console.error('Error al guardar la transacción:', error);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          {initialData ? 'Editar Transacción' : 'Nueva Transacción'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Transacción</Label>
              <Select
                value={transactionType}
                onValueChange={(value: 'income' | 'expense') => {
                  setTransactionType(value);
                  setValue('type', value);
                  setValue('category', ''); // Reset category when type changes
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Ingreso</SelectItem>
                  <SelectItem value="expense">Gasto</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-sm text-red-600">{errors.type.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Monto (COP)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0"
                {...register('amount', { valueAsNumber: true })}
              />
              {errors.amount && <p className="text-sm text-red-600">{errors.amount.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Select
                value={watch('category') || ''}
                onValueChange={(value) => setValue('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.icon} {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-red-600">{errors.category.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                type="date"
                {...register('date')}
              />
              {errors.date && <p className="text-sm text-red-600">{errors.date.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Describe la transacción..."
              {...register('description')}
            />
            {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
          </div>

          <div className="flex space-x-3">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Guardando...' : (initialData ? 'Actualizar' : 'Guardar')}
            </Button>
            {!initialData && (
              <Button type="button" variant="outline" onClick={() => reset()}>
                Limpiar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}