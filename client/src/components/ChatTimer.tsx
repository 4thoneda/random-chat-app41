import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Clock, Crown, Infinity } from "lucide-react";

interface ChatTimerProps {
  isPremium: boolean;
  isConnected: boolean;
  partnerPremium: boolean;
  onTimeUp: () => void;
  onUpgrade: () => void;
  onFriendRequestTime?: () => void;
  isFriendCall?: boolean;
}

export default function ChatTimer({ isPremium, isConnected, partnerPremium, onTimeUp, onUpgrade, onFriendRequestTime, isFriendCall = false }: ChatTimerProps) {
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes for premium, 15 for free
  const [isActive, setIsActive] = useState(false);
  const [friendRequestTriggered, setFriendRequestTriggered] = useState(false);
  const hasPremiumAccess = isPremium || partnerPremium;
  const maxTime = hasPremiumAccess ? 30 * 60 : 15 * 60; // 30 min for premium, 15 min for free
  const friendRequestTime = 7 * 60; // 7 minutes for friend request

  useEffect(() => {
    if (isConnected) {
      if (!hasPremiumAccess) {
        setIsActive(true);
        setTimeLeft(15 * 60); // 15 minutes for free users
      } else {
        setIsActive(true);
        setTimeLeft(30 * 60); // 30 minutes for premium users
      }
      setFriendRequestTriggered(false); // Reset friend request trigger
    } else {
      setIsActive(false);
      setTimeLeft(hasPremiumAccess ? 30 * 60 : 15 * 60); // Reset timer when disconnected
      setFriendRequestTriggered(false);
    }
  }, [isConnected, hasPremiumAccess]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          // Check if we've reached the 7-minute mark for friend request (only for non-friend calls)
          if (!isFriendCall && !friendRequestTriggered && time <= (maxTime - friendRequestTime)) {
            setFriendRequestTriggered(true);
            if (onFriendRequestTime) {
              onFriendRequestTime();
            }
          }

          if (time <= 1) {
            setIsActive(false);
            onTimeUp();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, onTimeUp, onFriendRequestTime, isFriendCall, friendRequestTriggered, maxTime, friendRequestTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    const percentage = timeLeft / maxTime;
    if (percentage > 0.5) return "text-green-600";
    if (percentage > 0.25) return "text-yellow-600";
    return "text-red-600";
  };

  if (!isConnected) return null;

  return (
    <Card className="w-full max-w-md mx-auto mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-800 dark:text-white">
              {isFriendCall ? "Friend Call" : "Chat Time"}
            </span>
          </div>
          
          {hasPremiumAccess ? (
            <div className="flex items-center gap-2 text-purple-600">
              <div className={`font-mono text-xl font-bold ${getTimeColor()}`}>
                {formatTime(timeLeft)}
              </div>
              <span className="text-sm">/ 30:00</span>
              <Crown className="h-4 w-4 text-yellow-500" />
              {partnerPremium && !isPremium && (
                <span className="text-xs text-green-600">(Partner Premium)</span>
              )}
            </div>
          ) : (
            <div className={`font-mono text-xl font-bold ${getTimeColor()}`}>
              {formatTime(timeLeft)}
            </div>
          )}
        </div>
        
        <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-1000 ${
              timeLeft > maxTime * 0.5 ? 'bg-green-500' :
              timeLeft > maxTime * 0.25 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${(timeLeft / maxTime) * 100}%` }}
          />
        </div>
        
        {!isFriendCall && !hasPremiumAccess && timeLeft < 300 && (
          <div className="mt-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              ⏰ Continue this amazing conversation! Get Premium for 30-minute calls.
            </p>
            <Button
              size="sm"
              onClick={onUpgrade}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <Crown className="h-4 w-4 mr-1" />
              Upgrade Now - ₹99/week
            </Button>
          </div>
        )}

        {!isFriendCall && friendRequestTriggered && timeLeft > 0 && (
          <div className="mt-3 p-3 bg-gradient-to-r from-romance-50 to-passion-50 dark:from-romance-900/20 dark:to-passion-900/20 rounded-lg text-center border border-romance-200">
            <p className="text-sm text-romance-700 dark:text-romance-300 mb-1">
              💕 7 minutes are up! Time to decide...
            </p>
            <p className="text-xs text-romance-600 dark:text-romance-400">
              Would you like to become friends with this person?
            </p>
          </div>
        )}
        
        {hasPremiumAccess && (
          <div className="mt-2 p-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg text-center">
            <p className="text-sm text-green-600 dark:text-green-400">
              ✨ {isPremium ? "You have" : "Your partner has"} Premium - Enjoy {isFriendCall ? "unlimited" : "30-minute"} calls! 💕
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
