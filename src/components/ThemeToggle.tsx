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
      className="flex items-center gap-2 px-6 py-2 rounded-full border-2 border-gray-300 shadow-md bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 focus:ring-2 focus:ring-blue-200 dark:focus:ring-purple-700"
    >
      <Sun className={`h-6 w-6 transition-all duration-300 ${theme === 'light' ? 'text-yellow-400' : 'text-gray-400'}`} />
      <span className={`font-bold text-base transition-all duration-300 ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>{theme === 'light' ? 'Light' : 'Dark'}</span>
      <Moon className={`h-6 w-6 transition-all duration-300 ${theme === 'dark' ? 'text-purple-400' : 'text-gray-400'}`} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};