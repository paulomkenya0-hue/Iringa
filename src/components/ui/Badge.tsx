type BadgeVariant = 'green' | 'gold' | 'gray' | 'red' | 'blue';

const variants: Record<BadgeVariant, string> = {
  green: 'bg-ccm-green-50 text-ccm-green-700',
  gold: 'bg-ccm-gold-50 text-ccm-gold-700',
  gray: 'bg-gray-100 text-gray-600',
  red: 'bg-error-50 text-error-700',
  blue: 'bg-info-50 text-info-700',
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

export default function Badge({ variant = 'gray', children }: BadgeProps) {
  return <span className={`badge ${variants[variant]}`}>{children}</span>;
}
