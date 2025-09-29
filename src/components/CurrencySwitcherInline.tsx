import React from 'react';
import { Button } from '@/components/ui/button';

const currencies = [
  { code: 'USD', symbol: '$', label: 'USD' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'GBP' },
];

export type CurrencyCode = 'USD' | 'EUR' | 'GBP';

interface CurrencySwitcherInlineProps {
  currency: CurrencyCode;
  onChange: (currency: CurrencyCode) => void;
}

export const CurrencySwitcherInline: React.FC<CurrencySwitcherInlineProps> = ({ currency, onChange }) => {
  return (
    <div className="flex gap-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-1 shadow-sm mt-4 mb-2 justify-center">
      {currencies.map((c) => (
        <Button
          key={c.code}
          variant={currency === c.code ? 'default' : 'ghost'}
          className={`rounded-full px-4 py-2 font-semibold text-base transition-all duration-200 ${currency === c.code ? 'bg-primary text-white shadow' : 'text-gray-700 dark:text-gray-200'}`}
          onClick={() => onChange(c.code as CurrencyCode)}
        >
          <span className="mr-1">{c.symbol}</span>
          {c.label}
        </Button>
      ))}
    </div>
  );
};
