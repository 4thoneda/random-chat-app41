import { useState, useEffect } from "react";
import { Heart, Sparkles, Star, Zap } from "lucide-react";
import { Button } from "./ui/button";

interface PremiumReactionsProps {
  onFlairSend: () => void;
  onSuperEmoji: () => void;
  disabled?: boolean;
  isVisible?: boolean;
}

interface FlairEffect {
  id: string;
  x: number;
  y: number;
  timestamp: number;
}

interface SuperEmojiEffect {
  id: string;
  timestamp: number;
}

export default function PremiumReactions({ 
  onFlairSend, 
  onSuperEmoji, 
  disabled = false,
  isVisible = true 
}: PremiumReactionsProps) {
  const [flairEffects, setFlairEffects] = useState<FlairEffect[]>([]);
  const [superEmojiEffects, setSuperEmojiEffects] = useState<SuperEmojiEffect[]>([]);

  // Cleanup old effects
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setFlairEffects(prev => prev.filter(effect => now - effect.timestamp < 3000));
      setSuperEmojiEffects(prev => prev.filter(effect => now - effect.timestamp < 4000));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleFlairSend = () => {
    if (disabled) return;
    
    // Create multiple flair effects at random positions
    const newEffects: FlairEffect[] = [];
    for (let i = 0; i < 8; i++) {
      newEffects.push({
        id: `flair-${Date.now()}-${i}`,
        x: Math.random() * 80 + 10, // 10-90% of screen width
        y: Math.random() * 60 + 20, // 20-80% of screen height
        timestamp: Date.now()
      });
    }
    
    setFlairEffects(prev => [...prev, ...newEffects]);
    onFlairSend();
  };

  const handleSuperEmoji = () => {
    if (disabled) return;
    
    const newEffect: SuperEmojiEffect = {
      id: `super-${Date.now()}`,
      timestamp: Date.now()
    };
    
    setSuperEmojiEffects(prev => [...prev, newEffect]);
    onSuperEmoji();
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Control Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={handleFlairSend}
          disabled={disabled}
          className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white p-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
          title="Send Flaire ✨"
        >
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            <Sparkles className="h-3 w-3" />
          </div>
        </Button>

        <Button
          onClick={handleSuperEmoji}
          disabled={disabled}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white p-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
          title="Super Emoji 💫"
        >
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4" />
            <Zap className="h-3 w-3" />
          </div>
        </Button>
      </div>

      {/* Flair Effects Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {flairEffects.map(effect => (
          <FlairHeartEffect
            key={effect.id}
            x={effect.x}
            y={effect.y}
            timestamp={effect.timestamp}
          />
        ))}
      </div>

      {/* Super Emoji Effects Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
        {superEmojiEffects.map(effect => (
          <SuperEmojiEffect
            key={effect.id}
            timestamp={effect.timestamp}
          />
        ))}
      </div>
    </>
  );
}

// Individual Flair Heart Effect Component
function FlairHeartEffect({ x, y, timestamp }: { x: number; y: number; timestamp: number }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="absolute animate-ping"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        animationDuration: '2s',
        animationIterationCount: '1'
      }}
    >
      <div className="relative">
        {/* Main heart with gradient */}
        <div className="text-4xl animate-bounce">
          💖
        </div>
        
        {/* Sparkle effects around the heart */}
        <div className="absolute -top-2 -left-2 text-xl animate-spin">
          ✨
        </div>
        <div className="absolute -bottom-2 -right-2 text-lg animate-pulse">
          💫
        </div>
        <div className="absolute top-0 -right-3 text-sm animate-bounce" style={{ animationDelay: '0.5s' }}>
          🌟
        </div>
        
        {/* Floating hearts */}
        <div className="absolute -top-6 left-2 text-sm animate-float">
          💕
        </div>
        <div className="absolute -top-8 -left-4 text-xs animate-float" style={{ animationDelay: '0.3s' }}>
          💘
        </div>
      </div>
    </div>
  );
}

// Super Emoji Effect Component (like Tinder Super Like)
function SuperEmojiEffect({ timestamp }: { timestamp: number }) {
  const [phase, setPhase] = useState(0); // 0: zoom in, 1: shake, 2: zoom out

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase(1), 500);
    const timer2 = setTimeout(() => setPhase(2), 2000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const getAnimationClass = () => {
    switch (phase) {
      case 0:
        return 'animate-zoom-in';
      case 1:
        return 'animate-wiggle';
      case 2:
        return 'animate-zoom-out';
      default:
        return '';
    }
  };

  return (
    <div className={`text-center ${getAnimationClass()}`}>
      {/* Main super emoji */}
      <div className="text-8xl mb-4 filter drop-shadow-2xl">
        🔥
      </div>
      
      {/* Text with gradient */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent text-2xl font-bold mb-2 animate-pulse">
        SUPER LIKE!
      </div>
      
      {/* Surrounding effects */}
      <div className="relative">
        <div className="absolute -top-16 -left-16 text-3xl animate-spin">
          🌟
        </div>
        <div className="absolute -top-20 left-16 text-2xl animate-bounce">
          💫
        </div>
        <div className="absolute -top-12 -right-16 text-3xl animate-ping">
          ✨
        </div>
        <div className="absolute top-4 -left-20 text-xl animate-pulse">
          💖
        </div>
        <div className="absolute top-8 right-20 text-xl animate-bounce" style={{ animationDelay: '0.5s' }}>
          💘
        </div>
      </div>
      
      {/* Particle effects */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-particle"
            style={{
              left: `${50 + Math.cos(i * 30 * Math.PI / 180) * 40}%`,
              top: `${50 + Math.sin(i * 30 * Math.PI / 180) * 40}%`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: '2s'
            }}
          />
        ))}
      </div>
    </div>
  );
}
