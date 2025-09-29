import React from 'react';
import { Button } from '@/components/ui/button';

interface LanguageSwitcherProps {
  language: 'en' | 'ta' | 'si';
  setLanguage: (lang: 'en' | 'ta' | 'si') => void;
  languages?: Array<'en' | 'ta' | 'si'>;
}


export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ language, setLanguage }) => {
  // Always use ENG, Tamil, Sinhala order for mobile
  const langOrder: Array<'en' | 'ta' | 'si'> = ['en', 'ta', 'si'];
  const labels: Record<string, string> = { en: 'ENG', ta: 'தமிழ்', si: 'සිංහල' };

  // Helper to get the next language in the list (always in langOrder)
  const getNextLang = (current: string) => {
    const idx = langOrder.indexOf(current as any);
    return langOrder[(idx + 1) % langOrder.length];
  };
  return (
    <div className="w-full sm:w-auto">
      {/* Mobile: show only current language, tap to cycle */}
      <div className="block sm:hidden">
        <Button
          variant="outline"
          size="default"
          onClick={() => setLanguage(getNextLang(language))}
          className={
            'w-full font-bold border-2 border-primary shadow-md text-lg py-3 rounded-xl active:scale-95 transition-transform duration-150 focus:ring-2 focus:ring-primary/50 bg-white text-black dark:bg-gray-900 dark:text-white' // white bg/black text in light, dark bg/white text in dark
          }
          aria-label="Change language"
        >
          <span className="flex items-center justify-center gap-2">
            <span className="text-black dark:text-white">{labels[language] || language.toUpperCase()}</span>
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </span>
        </Button>
  {/* Removed 'Tap to change language' hint for a cleaner mobile UI */}
      </div>
      {/* Desktop: show all languages as buttons */}
      <div className="hidden sm:flex flex-row items-center gap-2">
        {langOrder.map((lang) => (
          <Button
            key={lang}
            variant={language === lang ? 'default' : 'outline'}
            size="default"
            onClick={() => setLanguage(lang)}
            className={
              'w-auto ' +
              (language === lang
                ? 'font-bold border-2 border-primary shadow-md'
                : 'font-semibold border-2 border-gray-300 shadow-md')
            }
          >
            {labels[lang] || lang.toUpperCase()}
          </Button>
        ))}
      </div>
    </div>
  );
};
