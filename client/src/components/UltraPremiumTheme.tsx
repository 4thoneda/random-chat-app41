import { useEffect, useState } from "react";
import { Gem, Crown, Sparkles, Star, Zap } from "lucide-react";

interface UltraPremiumThemeProps {
  children: React.ReactNode;
  isUltraPremium: boolean;
}

export default function UltraPremiumTheme({ children, isUltraPremium }: UltraPremiumThemeProps) {
  const [showSpecialEffects, setShowSpecialEffects] = useState(false);

  useEffect(() => {
    if (isUltraPremium) {
      setShowSpecialEffects(true);
      // Add premium theme class to body
      document.body.classList.add('ultra-premium-theme');
    } else {
      document.body.classList.remove('ultra-premium-theme');
    }

    return () => {
      document.body.classList.remove('ultra-premium-theme');
    };
  }, [isUltraPremium]);

  if (!isUltraPremium) {
    return <>{children}</>;
  }

  return (
    <div className="ultra-premium-wrapper relative">
      {/* Premium Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Floating gems */}
        <div className="absolute top-10 left-10 animate-float-slow">
          <Gem className="h-4 w-4 text-purple-300/30" />
        </div>
        <div className="absolute top-32 right-16 animate-float-slow" style={{ animationDelay: '1s' }}>
          <Star className="h-3 w-3 text-pink-300/30" />
        </div>
        <div className="absolute bottom-40 left-20 animate-float-slow" style={{ animationDelay: '2s' }}>
          <Sparkles className="h-5 w-5 text-purple-400/30" />
        </div>
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.1),transparent_50%)]" />
      </div>

      {/* Premium Border Glow */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <div className="absolute inset-0 border-2 border-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 rounded-3xl shadow-2xl shadow-purple-500/10" />
      </div>

      {/* Content with premium styling */}
      <div className="relative z-20">
        {children}
      </div>

      {/* Premium Particle System */}
      {showSpecialEffects && (
        <div className="fixed inset-0 pointer-events-none z-30">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-premium-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ULTRA+ Premium Navigation Component
export function UltraPremiumNav({ isUltraPremium }: { isUltraPremium: boolean }) {
  if (!isUltraPremium) return null;

  return (
    <div className="fixed top-4 left-4 z-50">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 backdrop-blur-lg rounded-full px-4 py-2 shadow-2xl shadow-purple-500/25">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
          <span className="text-white text-sm font-bold">ULTRA+ MODE</span>
          <Gem className="h-4 w-4 text-purple-200" />
        </div>
      </div>
    </div>
  );
}

// Premium Quick Actions Floating Menu
export function UltraPremiumQuickActions({ onAction }: { onAction: (action: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { id: 'premium-search', icon: Star, label: 'VIP Search', color: 'from-yellow-500 to-orange-500' },
    { id: 'premium-filters', icon: Sparkles, label: 'Premium Filters', color: 'from-purple-500 to-pink-500' },
    { id: 'ultra-analytics', icon: Zap, label: 'Analytics', color: 'from-blue-500 to-cyan-500' },
    { id: 'vip-mode', icon: Crown, label: 'VIP Mode', color: 'from-amber-500 to-yellow-500' }
  ];

  return (
    <div className="fixed bottom-24 right-4 z-50">
      {/* Quick Actions Menu */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 space-y-2">
          {actions.map((action, index) => (
            <div
              key={action.id}
              className="transform transition-all duration-300"
              style={{ 
                animationDelay: `${index * 100}ms`,
                transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0)'
              }}
            >
              <button
                onClick={() => {
                  onAction(action.id);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 bg-gradient-to-r ${action.color} text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 whitespace-nowrap`}
              >
                <action.icon className="h-4 w-4" />
                <span className="text-sm font-semibold">{action.label}</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-2xl flex items-center justify-center transform hover:scale-110 transition-all duration-200 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 hover:opacity-20 transition-opacity duration-200" />
        <Gem className={`h-6 w-6 text-white transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        
        {/* Pulse effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 animate-ping opacity-20" />
      </button>
    </div>
  );
}
