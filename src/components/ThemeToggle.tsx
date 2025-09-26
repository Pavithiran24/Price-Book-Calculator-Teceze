import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
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
      size="icon"
      onClick={toggleTheme}
      className="relative h-12 w-12 rounded-full border-2 border-primary shadow-lg bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 hover:from-pink-400 hover:to-blue-400 hover:shadow-2xl transition-all duration-500 focus:ring-4 focus:ring-blue-300 dark:focus:ring-purple-800"
    >
      <span className="absolute inset-0 rounded-full pointer-events-none animate-pulse bg-gradient-to-br from-blue-400/30 via-purple-400/30 to-pink-400/30 blur-sm"></span>
      <Sun className="relative h-6 w-6 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0 text-yellow-400 drop-shadow-lg" />
      <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100 text-purple-400 drop-shadow-lg" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};