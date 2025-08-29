import React from 'react';
import { Calendar, Flag, MoreHorizontal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Task } from '~backend/tasks/types';

interface TaskItemProps {
  task: Task;
}

const priorityColors = {
  low: 'text-green-600',
  medium: 'text-yellow-600',
  high: 'text-orange-600',
  urgent: 'text-red-600',
};

const priorityLabels = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  urgent: 'Urgente',
};

export function TaskItem({ task }: TaskItemProps) {
  const isCompleted = task.status === 'completed';
  
  return (
    <Card className={cn('transition-all hover:shadow-md', isCompleted && 'opacity-60')}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            checked={isCompleted}
            className="mt-1"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className={cn(
                'text-sm font-medium text-gray-900',
                isCompleted && 'line-through text-gray-500'
              )}>
                {task.title}
              </h3>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
            
            {task.description && (
              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
            )}
            
            <div className="flex items-center space-x-4 mt-3">
              <div className="flex items-center space-x-1">
                <Flag className={cn('h-3 w-3', priorityColors[task.priority])} />
                <span className="text-xs text-gray-500">
                  {priorityLabels[task.priority]}
                </span>
              </div>
              
              {task.due_date && (
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {new Date(task.due_date).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              )}
              
              {task.tags && task.tags.length > 0 && (
                <div className="flex space-x-1">
                  {task.tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      className="text-xs"
                      style={{ backgroundColor: tag.color + '20', color: tag.color }}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
