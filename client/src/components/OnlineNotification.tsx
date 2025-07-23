import { useState, useEffect } from "react";
import { X, Heart, Sparkles, Users, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";

interface OnlineNotificationProps {
  isVisible: boolean;
  onClose: () => void;
  onStartChat?: () => void;
  user: {
    name: string;
    isFriend: boolean;
    profileImage?: string;
    lastSeen?: Date;
  };
}

const flirtyMessages = [
  "just came online! 💕",
  "is ready to chat! ✨", 
  "wants to connect! 💖",
  "is online and looking gorgeous! 🌟",
  "just arrived! Time to sparkle! ✨",
  "is here and ready to make magic! 💫",
  "came online! Your heart might skip a beat! 💘",
  "is online! Romance is in the air! 🌹",
  "just logged in! Cupid is working! 💘",
  "is ready for some fun! 🎉"
];

const friendMessages = [
  "Your friend is online! 👫",
  "is ready to catch up! 💕",
  "came online! Time to reconnect! ✨",
  "is here! Your bestie awaits! 💖",
  "just arrived! Friendship goals! 🌟",
  "is online! BFF time! 💫",
  "came online! Let the fun begin! 🎉"
];

export default function OnlineNotification({ 
  isVisible, 
  onClose, 
  onStartChat,
  user 
}: OnlineNotificationProps) {
  const [message, setMessage] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const messages = user.isFriend ? friendMessages : flirtyMessages;
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      setMessage(randomMessage);

      // Auto-close after 6 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, user.isFriend]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(onClose, 300);
  };

  const handleStartChat = () => {
    if (onStartChat) {
      onStartChat();
    }
    handleClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className={`transform transition-all duration-300 ${
        isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}>
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 border-l-4 border-pink-400 rounded-lg shadow-lg p-4 backdrop-blur-sm">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              {user.isFriend ? (
                <Users className="h-5 w-5 text-pink-500" />
              ) : (
                <Heart className="h-5 w-5 text-rose-500 animate-pulse" />
              )}
              <span className="font-semibold text-gray-800">
                {user.isFriend ? "Friend Online!" : "Someone Special!"}
              </span>
            </div>
            <Button
              onClick={handleClose}
              variant="ghost"
              size="sm"
              className="p-1 h-6 w-6 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              {user.profileImage ? (
                <img 
                  src={user.profileImage} 
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-pink-200"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center text-white font-bold text-lg">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            
            <div className="flex-1">
              <div className="font-medium text-gray-800 flex items-center gap-2">
                {user.name}
                <Sparkles className="h-4 w-4 text-yellow-500 animate-spin" />
              </div>
              <div className="text-sm text-gray-600">
                {message}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleStartChat}
              className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-sm py-2 shadow-md transform hover:scale-105 transition-all duration-200"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              {user.isFriend ? "Say Hi!" : "Start Chat"}
            </Button>
            <Button
              onClick={handleClose}
              variant="outline"
              className="px-4 text-sm border-pink-200 text-pink-600 hover:bg-pink-50"
            >
              Later
            </Button>
          </div>

          {/* Floating hearts animation */}
          <div className="absolute -top-2 -right-2 pointer-events-none">
            <div className="text-lg animate-bounce">💖</div>
          </div>
          <div className="absolute top-1 -left-2 pointer-events-none">
            <div className="text-sm animate-pulse">✨</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Notification Manager Component
export function OnlineNotificationManager() {
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    user: {
      name: string;
      isFriend: boolean;
      profileImage?: string;
      lastSeen?: Date;
    };
    timestamp: number;
  }>>([]);

  const addNotification = (user: OnlineNotificationProps['user']) => {
    const newNotification = {
      id: `notification-${Date.now()}`,
      user,
      timestamp: Date.now()
    };
    
    setNotifications(prev => [...prev, newNotification]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Clean up old notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setNotifications(prev => prev.filter(n => now - n.timestamp < 10000)); // Remove after 10 seconds
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          style={{ transform: `translateY(${index * 10}px)` }}
        >
          <OnlineNotification
            isVisible={true}
            onClose={() => removeNotification(notification.id)}
            user={notification.user}
            onStartChat={() => {
              // Handle start chat logic here
              console.log(`Starting chat with ${notification.user.name}`);
              removeNotification(notification.id);
            }}
          />
        </div>
      ))}
    </div>
  );
}
