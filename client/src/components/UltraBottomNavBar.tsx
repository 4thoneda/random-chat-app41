import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Home, 
  MessageCircle, 
  Bot, 
  Users, 
  User,
  Gem,
  Crown,
  Sparkles,
  Zap,
  Heart
} from "lucide-react";
import { usePremium } from "../context/PremiumProvider";

export default function UltraBottomNavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isUltraPremium } = usePremium();
  const [activeTab, setActiveTab] = useState('');

  const tabs = [
    { 
      id: 'home', 
      path: '/', 
      icon: Home, 
      label: 'Home',
      color: 'from-purple-500 to-pink-500'
    },
    { 
      id: 'chat', 
      path: '/video-chat', 
      icon: MessageCircle, 
      label: 'Chat',
      color: 'from-pink-500 to-rose-500'
    },
    { 
      id: 'ai', 
      path: '/ai-chatbot', 
      icon: Bot, 
      label: 'AI Chat',
      color: 'from-blue-500 to-purple-500'
    },
    { 
      id: 'friends', 
      path: '/friends', 
      icon: Users, 
      label: 'Friends',
      color: 'from-green-500 to-teal-500'
    },
    { 
      id: 'profile', 
      path: '/profile', 
      icon: User, 
      label: 'Profile',
      color: 'from-orange-500 to-red-500'
    }
  ];

  useEffect(() => {
    const currentTab = tabs.find(tab => 
      tab.path === location.pathname || 
      (tab.path !== '/' && location.pathname.startsWith(tab.path))
    );
    setActiveTab(currentTab?.id || 'home');
  }, [location.pathname]);

  const handleTabClick = (tab: typeof tabs[0]) => {
    setActiveTab(tab.id);
    navigate(tab.path);
  };

  if (!isUltraPremium()) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      {/* Native App Style Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/98 via-white/95 to-transparent backdrop-blur-xl border-t border-purple-200/50" />
      
      {/* ULTRA+ Glow Effect */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 animate-gradient-shift" />
      
      <div className="relative px-2 sm:px-4 py-2 sm:py-3">
        {/* Premium Floating Indicator */}
        <div className="flex justify-center mb-2">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-full px-3 py-1 shadow-lg">
            <div className="flex items-center gap-2">
              <Gem className="h-3 w-3 text-white" />
              <span className="text-white text-xs font-bold">ULTRA+ Navigation</span>
              <Sparkles className="h-3 w-3 text-purple-200 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Navigation Tabs - Native App Style */}
        <div className="flex items-center justify-around bg-white/90 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-xl border border-purple-100/50 px-2 py-3">
          {tabs.map((tab, index) => {
            const isActive = activeTab === tab.id;
            const IconComponent = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className={`relative flex flex-col items-center gap-1 py-2 px-3 rounded-xl sm:rounded-2xl transition-all duration-300 transform ${
                  isActive 
                    ? 'scale-110 -translate-y-1' 
                    : 'scale-100 hover:scale-105'
                }`}
              >
                {/* Active Tab Background */}
                {isActive && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${tab.color} rounded-xl sm:rounded-2xl shadow-lg opacity-90`} />
                )}

                {/* Tab Content */}
                <div className="relative z-10 flex flex-col items-center gap-1">
                  {/* Icon with Premium Effects */}
                  <div className={`relative p-2 rounded-full transition-all duration-200 ${
                    isActive 
                      ? 'bg-white/20 backdrop-blur-sm' 
                      : 'hover:bg-gray-100'
                  }`}>
                    <IconComponent 
                      className={`h-4 w-4 sm:h-5 sm:w-5 transition-all duration-200 ${
                        isActive ? 'text-white' : 'text-gray-600'
                      }`} 
                    />
                    
                    {/* Premium Sparkle Effect */}
                    {isActive && (
                      <div className="absolute -top-1 -right-1">
                        <Sparkles className="h-3 w-3 text-yellow-300 animate-ping" />
                      </div>
                    )}
                  </div>

                  {/* Label */}
                  <span className={`text-xs font-medium transition-all duration-200 ${
                    isActive ? 'text-white' : 'text-gray-600'
                  }`}>
                    {tab.label}
                  </span>
                </div>

                {/* Premium Tab Indicator */}
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                    <div className="w-2 h-2 bg-white rounded-full shadow-lg animate-pulse" />
                  </div>
                )}

                {/* Floating Particles for Active Tab */}
                {isActive && (
                  <>
                    <div className="absolute -top-2 left-0 w-1 h-1 bg-white/60 rounded-full animate-float-slow" 
                         style={{ animationDelay: '0s' }} />
                    <div className="absolute -top-1 right-1 w-0.5 h-0.5 bg-yellow-300/80 rounded-full animate-float-slow" 
                         style={{ animationDelay: '0.5s' }} />
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* ULTRA+ Premium Actions */}
        <div className="flex justify-center mt-2">
          <div className="flex items-center gap-2">
            {/* Quick Premium Actions */}
            <button className="p-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-200">
              <Crown className="h-3 w-3 text-purple-600" />
            </button>
            <button className="p-1.5 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full hover:from-pink-500/30 hover:to-purple-500/30 transition-all duration-200">
              <Heart className="h-3 w-3 text-pink-600" />
            </button>
            <button className="p-1.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-200">
              <Zap className="h-3 w-3 text-blue-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Premium Bottom Shadow */}
      <div className="absolute -bottom-2 left-0 right-0 h-2 bg-gradient-to-b from-purple-500/10 to-transparent" />
    </div>
  );
}

// Premium Page Transition Component
export function UltraPageTransition({ children }: { children: React.ReactNode }) {
  const { isUltraPremium } = usePremium();
  const [isTransitioning, setIsTransitioning] = useState(false);

  if (!isUltraPremium()) {
    return <>{children}</>;
  }

  return (
    <div className="ultra-page-wrapper">
      {/* Premium Page Border */}
      <div className="fixed inset-2 border border-purple-200/50 rounded-3xl pointer-events-none z-10 shadow-2xl shadow-purple-500/5" />
      
      {/* Content with Premium Styling */}
      <div className="relative z-20 min-h-screen">
        {children}
      </div>

      {/* Premium Transition Overlay */}
      {isTransitioning && (
        <div className="fixed inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <div className="text-purple-700 font-semibold">ULTRA+ Transition</div>
          </div>
        </div>
      )}
    </div>
  );
}