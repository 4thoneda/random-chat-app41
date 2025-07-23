import { useEffect, useState } from "react";
import { Eye, Clock } from "lucide-react";

interface LastSeenDisplayProps {
  lastSeen?: Date | string;
  isOnline?: boolean;
  username?: string;
  isVisible?: boolean;
  className?: string;
}

export default function LastSeenDisplay({ 
  lastSeen, 
  isOnline = false, 
  username = "User",
  isVisible = true,
  className = ""
}: LastSeenDisplayProps) {
  const [timeAgo, setTimeAgo] = useState<string>("");

  useEffect(() => {
    if (!lastSeen || isOnline) return;

    const updateTimeAgo = () => {
      const lastSeenDate = typeof lastSeen === 'string' ? new Date(lastSeen) : lastSeen;
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - lastSeenDate.getTime()) / 1000);

      if (diffInSeconds < 60) {
        setTimeAgo("just now");
      } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        setTimeAgo(`${minutes}m ago`);
      } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        setTimeAgo(`${hours}h ago`);
      } else if (diffInSeconds < 604800) {
        const days = Math.floor(diffInSeconds / 86400);
        setTimeAgo(`${days}d ago`);
      } else {
        setTimeAgo("long time ago");
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [lastSeen, isOnline]);

  if (!isVisible) return null;

  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      {isOnline ? (
        <>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-600 font-medium">Online now</span>
        </>
      ) : (
        <>
          <Eye className="h-3 w-3 text-gray-400" />
          <span className="text-gray-500">
            Last seen {timeAgo}
          </span>
        </>
      )}
    </div>
  );
}

// Component for showing when someone was last active
export function LastActiveIndicator({ 
  lastSeen, 
  isOnline, 
  isPremiumFeature = true 
}: { 
  lastSeen?: Date | string; 
  isOnline?: boolean; 
  isPremiumFeature?: boolean;
}) {
  if (!isPremiumFeature) {
    return (
      <div className="flex items-center gap-1 text-xs text-gray-400">
        <Clock className="h-3 w-3" />
        <span>Premium feature</span>
      </div>
    );
  }

  return (
    <LastSeenDisplay 
      lastSeen={lastSeen}
      isOnline={isOnline}
      className="text-xs"
    />
  );
}
