import React from 'react';
import { useAppStore } from '../store/appStore';
import { Layout } from './Layout';
import { TasksSection } from './tasks/TasksSection';
import { FinanceSection } from './finance/FinanceSection';

export function AppInner() {
  const { currentSection } = useAppStore();

  return (
    <Layout>
      {currentSection === 'tasks' && <TasksSection />}
      {currentSection === 'finance' && <FinanceSection />}
    </Layout>
  );
}
