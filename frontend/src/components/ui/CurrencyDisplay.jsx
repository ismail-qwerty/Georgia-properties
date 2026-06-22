export default function CurrencyDisplay({ amount, className = '', showCurrency = true }) {
  const formattedAmount = typeof amount === 'number' 
    ? amount.toFixed(2) 
    : parseFloat(amount || 0).toFixed(2);

  return (
    <span className={`font-semibold ${className}`}>
      {showCurrency && 'VIEWS '}
      {formattedAmount}
    </span>
  );
}
