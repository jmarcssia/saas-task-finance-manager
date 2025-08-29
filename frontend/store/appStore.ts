import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  currentSection: 'tasks' | 'finance';
  setCurrentSection: (section: 'tasks' | 'finance') => void;
  
  // Theme and preferences
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  
  density: 'compact' | 'comfortable' | 'spacious';
  setDensity: (density: 'compact' | 'comfortable' | 'spacious') => void;
  
  language: 'pt-BR' | 'en-US';
  setLanguage: (language: 'pt-BR' | 'en-US') => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentSection: 'tasks',
      setCurrentSection: (section) => set({ currentSection: section }),
      
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      
      density: 'comfortable',
      setDensity: (density) => set({ density }),
      
      language: 'pt-BR',
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'app-store',
    }
  )
);
