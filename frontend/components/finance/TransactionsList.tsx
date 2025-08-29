import React from 'react';
import { Plus, ArrowUpRight, ArrowDownLeft, ArrowRightLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { FinanceTransaction } from '~backend/finance/types';

interface TransactionsListProps {
  transactions: FinanceTransaction[];
}

const transactionIcons = {
  income: ArrowUpRight,
  expense: ArrowDownLeft,
  transfer: ArrowRightLeft,
};

const transactionColors = {
  income: 'text-green-600',
  expense: 'text-red-600',
  transfer: 'text-blue-600',
};

const transactionLabels = {
  income: 'Receita',
  expense: 'Despesa',
  transfer: 'Transferência',
};

export function TransactionsList({ transactions }: TransactionsListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Transações Recentes</CardTitle>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nova Transação
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.slice(0, 10).map((transaction) => {
            const Icon = transactionIcons[transaction.type];
            return (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    transaction.type === 'income' && 'bg-green-100',
                    transaction.type === 'expense' && 'bg-red-100',
                    transaction.type === 'transfer' && 'bg-blue-100'
                  )}>
                    <Icon className={cn('h-5 w-5', transactionColors[transaction.type])} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {transaction.description || transactionLabels[transaction.type]}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.transaction_date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn(
                    'font-semibold',
                    transactionColors[transaction.type]
                  )}>
                    {transaction.type === 'expense' ? '-' : '+'}
                    {formatCurrency(Math.abs(transaction.amount))}
                  </p>
                  <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                    {transaction.status === 'completed' ? 'Concluída' : 'Pendente'}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
