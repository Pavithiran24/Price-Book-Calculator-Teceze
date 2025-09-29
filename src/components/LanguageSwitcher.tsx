import React from 'react';
import { Button } from '@/components/ui/button';

interface LanguageSwitcherProps {
  language: 'en' | 'ta' | 'si';
  setLanguage: (lang: 'en' | 'ta' | 'si') => void;
  languages?: Array<'en' | 'ta' | 'si'>;
}


export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ language, setLanguage, languages = ['en', 'ta', 'si'] }) => {
  const labels: Record<string, string> = { en: 'ENG', ta: 'தமிழ்', si: 'සිංහල' };
  return (
    <div className="flex items-center gap-2">
      {languages.map((lang) => (
        <Button
          key={lang}
          variant={language === lang ? 'default' : 'outline'}
          size="default"
          onClick={() => setLanguage(lang)}
          className={
            language === lang
              ? 'font-bold border-2 border-primary shadow-md'
              : 'font-semibold border-2 border-gray-300 shadow-md'
          }
        >
          {labels[lang] || lang.toUpperCase()}
        </Button>
      ))}
    </div>
  );
};
