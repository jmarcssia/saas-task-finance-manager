import React from 'react';
import { useQuery } from '@tanstack/react-query';
import backend from '~backend/client';
import { TaskList } from './TaskList';
import { TaskListSidebar } from './TaskListSidebar';
import { EmptyState } from '../EmptyState';
import { CheckSquare } from 'lucide-react';

export function TasksSection() {
  const { data: taskLists, isLoading } = useQuery({
    queryKey: ['taskLists'],
    queryFn: () => backend.tasks.listTaskLists(),
  });

  const { data: tasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => backend.tasks.listTasks({}),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!tasks?.tasks.length && !taskLists?.task_lists.length) {
    return (
      <EmptyState
        icon={CheckSquare}
        title="Nenhuma tarefa encontrada"
        description="Comece criando sua primeira lista de tarefas ou adicione uma nova tarefa."
        actionLabel="Criar primeira tarefa"
        onAction={() => {}}
      />
    );
  }

  return (
    <div className="flex h-full space-x-6">
      <div className="w-80">
        <TaskListSidebar taskLists={taskLists?.task_lists || []} />
      </div>
      <div className="flex-1">
        <TaskList tasks={tasks?.tasks || []} />
      </div>
    </div>
  );
}
