interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'expired';
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const styles = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    expired: 'bg-red-100 text-red-800',
  };
  
  const displayLabel = label || status.charAt(0).toUpperCase() + status.slice(1);
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full ${styles[status]}`}>
      {displayLabel}
    </span>
  );
}
