import { Crown, Gem } from "lucide-react";

interface PremiumBadgeProps {
  plan: 'ultra-quarterly' | 'pro-monthly' | 'weekly';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function PremiumBadge({ plan, size = 'md', className = '' }: PremiumBadgeProps) {
  const getBadgeConfig = () => {
    switch (plan) {
      case 'ultra-quarterly':
        return {
          icon: Gem,
          text: 'ULTRA+',
          colors: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white',
          iconColor: 'text-purple-200'
        };
      case 'pro-monthly':
        return {
          icon: Crown,
          text: 'PRO',
          colors: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white',
          iconColor: 'text-yellow-200'
        };
      case 'weekly':
        return {
          icon: Crown,
          text: 'PREMIUM',
          colors: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
          iconColor: 'text-blue-200'
        };
      default:
        return {
          icon: Crown,
          text: 'PREMIUM',
          colors: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
          iconColor: 'text-blue-200'
        };
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-0.5 text-xs gap-1';
      case 'lg':
        return 'px-4 py-2 text-sm gap-2';
      default:
        return 'px-3 py-1 text-xs gap-1.5';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'h-3 w-3';
      case 'lg':
        return 'h-5 w-5';
      default:
        return 'h-4 w-4';
    }
  };

  const config = getBadgeConfig();
  const IconComponent = config.icon;

  return (
    <div className={`inline-flex items-center rounded-full font-bold shadow-md ${config.colors} ${getSizeClasses()} ${className}`}>
      <IconComponent className={`${getIconSize()} ${config.iconColor}`} />
      <span>{config.text}</span>
    </div>
  );
}
