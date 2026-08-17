/**
 * Format a course price the way the cart and the catalog cards both need it.
 * Prices here are whole pesos, so fractional digits are dropped.
 */
export const formatCurrency = (amount, currency) => new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: currency || 'PHP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
}).format(amount);

export default formatCurrency;
