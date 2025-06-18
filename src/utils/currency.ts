
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatCurrencyShort = (amount: number): string => {
  return `Ksh ${amount.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`;
};
