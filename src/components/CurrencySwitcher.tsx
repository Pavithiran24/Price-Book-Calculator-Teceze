import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

const currencies = [
  { code: 'USD', symbol: '$', label: 'USD' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'GBP' },
];

export type CurrencyCode = 'USD' | 'EUR' | 'GBP';

interface CurrencySwitcherProps {
  currency: CurrencyCode;
  onChange: (currency: CurrencyCode) => void;
}

export const CurrencySwitcher: React.FC<CurrencySwitcherProps> = ({ currency, onChange }) => {
  return (
    <div className="flex gap-2 rounded-full bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 p-1 shadow-md">
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
