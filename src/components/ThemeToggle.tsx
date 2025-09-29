import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    const initialTheme = savedTheme || 'light';
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <Button
      variant="outline"
      size="default"
      onClick={toggleTheme}
      className="flex items-center gap-2 px-3 py-2 sm:px-6 sm:py-2 rounded-lg sm:rounded-2xl border-2 border-gray-300 shadow-md bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 focus:ring-2 focus:ring-blue-200 dark:focus:ring-purple-700 w-full sm:w-auto min-h-[36px] min-w-[36px] sm:min-h-0 sm:min-w-0 active:scale-95"
      aria-label="Toggle theme"
    >
      <Sun className={`h-5 w-5 sm:h-6 sm:w-6 transition-all duration-300 ${theme === 'light' ? 'text-yellow-400' : 'text-gray-400'}`} />
      <span className={`font-bold text-base sm:text-base transition-all duration-300 ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>{theme === 'light' ? 'Light' : 'Dark'}</span>
      <Moon className={`h-5 w-5 sm:h-6 sm:w-6 transition-all duration-300 ${theme === 'dark' ? 'text-purple-400' : 'text-gray-400'}`} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};