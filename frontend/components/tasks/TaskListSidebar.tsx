import React from 'react';
import { Plus, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { TaskList } from '~backend/tasks/types';

interface TaskListSidebarProps {
  taskLists: TaskList[];
}

export function TaskListSidebar({ taskLists }: TaskListSidebarProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Listas</CardTitle>
          <Button size="sm" variant="ghost">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button variant="ghost" className="w-full justify-start" size="sm">
          <List className="h-4 w-4 mr-2" />
          Todas as tarefas
        </Button>
        
        {taskLists.map((list) => (
          <Button
            key={list.id}
            variant="ghost"
            className="w-full justify-start"
            size="sm"
          >
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: list.color }}
            />
            {list.name}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
