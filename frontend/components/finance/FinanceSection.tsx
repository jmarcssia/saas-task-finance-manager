import React from 'react';
import { useQuery } from '@tanstack/react-query';
import backend from '~backend/client';
import { AccountsList } from './AccountsList';
import { TransactionsList } from './TransactionsList';
import { FinanceOverview } from './FinanceOverview';
import { EmptyState } from '../EmptyState';
import { DollarSign } from 'lucide-react';

export function FinanceSection() {
  const { data: accounts, isLoading: accountsLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => backend.finance.listAccounts(),
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => backend.finance.listTransactions({}),
  });

  if (accountsLoading || transactionsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!accounts?.accounts.length && !transactions?.transactions.length) {
    return (
      <EmptyState
        icon={DollarSign}
        title="Nenhuma conta encontrada"
        description="Comece criando sua primeira conta bancária ou adicionando uma transação."
        actionLabel="Criar primeira conta"
        onAction={() => {}}
      />
    );
  }

  return (
    <div className="space-y-6">
      <FinanceOverview accounts={accounts?.accounts || []} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <AccountsList accounts={accounts?.accounts || []} />
        </div>
        <div className="lg:col-span-2">
          <TransactionsList transactions={transactions?.transactions || []} />
        </div>
      </div>
    </div>
  );
}
