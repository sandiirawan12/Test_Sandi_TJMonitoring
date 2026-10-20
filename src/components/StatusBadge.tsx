import React from 'react';
import { getStatusTheme, formatStatusLabel } from '../utils/formatters';

interface StatusBadgeProps {
  status?: string | null;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showLabel = true,
}) => {
  const theme = getStatusTheme(status);
  const label = formatStatusLabel(status);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-medium',
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${theme.bg} ${theme.border} ${sizeClasses[size]}`}
    >
      <span className="relative flex">
        {theme.pulse && (
          <span
            className={`absolute inline-flex h-full w-full rounded-full ${theme.dotBg} opacity-75 animate-ping`}
          />
        )}
        <span className={`relative inline-flex rounded-full ${theme.dotBg} ${dotSizes[size]}`} />
      </span>
      {showLabel && <span className="truncate">{label}</span>}
    </span>
  );
};
