export type VsCurrency = 'usd' | 'eur';

export const isVsCurrency = (value: string): value is VsCurrency =>
  value === 'usd' || value === 'eur';
