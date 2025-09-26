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
      className="relative h-12 w-12 rounded-full border-2 border-primary shadow-md bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 hover:from-pink-100 hover:to-blue-100 hover:shadow-xl transition-all duration-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-purple-400"
    >
      <span className="absolute inset-0 rounded-full pointer-events-none animate-pulse bg-gradient-to-br from-blue-200/30 via-purple-200/30 to-pink-200/30 blur-sm"></span>
      <Sun className="relative h-6 w-6 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0 text-yellow-400 drop-shadow" />
      <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100 text-purple-400 drop-shadow" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};