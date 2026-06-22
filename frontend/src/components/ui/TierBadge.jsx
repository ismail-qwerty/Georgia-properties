export default function TierBadge({ tier, size = 'md' }) {
  const getTierStyles = () => {
    const tierName = tier?.toLowerCase() || '';
    
    if (tierName.includes('silver')) {
      return 'bg-blue-500 text-white';
    }
    if (tierName.includes('gold')) {
      return 'bg-yellow-500 text-white';
    }
    if (tierName.includes('platinum')) {
      return 'bg-purple-500 text-white';
    }
    return 'bg-gray-500 text-white';
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${getTierStyles()} ${sizeClasses[size]}`}
    >
      {tier}
    </span>
  );
}
