import type { LucideIcon } from 'lucide-react';

type IconColor = 'green' | 'gold' | 'blue' | 'red';

const iconColors: Record<IconColor, string> = {
  green: 'bg-ccm-green-50 text-ccm-green-600',
  gold: 'bg-ccm-gold-50 text-ccm-gold-600',
  blue: 'bg-info-50 text-info-600',
  red: 'bg-error-50 text-error-600',
};

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: IconColor;
  trend?: { value: string; positive: boolean };
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  iconColor = 'green',
  trend,
}: StatCardProps) {
  return (
    <div className="card p-5 hover:shadow-card-hover transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500 truncate">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`stat-icon ${iconColors[iconColor]} flex-shrink-0`}>
          <Icon size={22} />
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1.5">
          <span
            className={`text-xs font-medium ${
              trend.positive ? 'text-ccm-green-600' : 'text-error-600'
            }`}
          >
            {trend.positive ? '↑' : '↓'} {trend.value}
          </span>
          <span className="text-xs text-gray-400">mwezi uliopita</span>
        </div>
      )}
    </div>
  );
}
