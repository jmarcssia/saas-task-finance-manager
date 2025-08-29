import React from 'react';
import { Search, Plus, Command } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function TopBar() {
  const { currentSection } = useAppStore();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {currentSection === 'tasks' ? 'Tarefas' : 'Financeiro'}
          </h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar..."
              className="pl-10 w-64"
            />
          </div>
          
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Novo
          </Button>
          
          <Button variant="outline" size="sm">
            <Command className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
