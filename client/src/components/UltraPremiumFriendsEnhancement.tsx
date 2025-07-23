import { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Star, 
  Crown, 
  Users, 
  Heart, 
  MessageCircle, 
  Video,
  Sparkles,
  Gem,
  Clock,
  Eye,
  TrendingUp
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import LastSeenDisplay from "./LastSeenDisplay";

interface Friend {
  id: string;
  name: string;
  profileImage?: string;
  isOnline: boolean;
  lastSeen?: Date;
  isPremium: boolean;
  mutualFriends: number;
  totalChats: number;
  compatibility: number;
}

interface UltraPremiumFriendsEnhancementProps {
  friends: Friend[];
  isUltraPremium: boolean;
  onVideoCall: (friendId: string) => void;
  onMessage: (friendId: string) => void;
}

export default function UltraPremiumFriendsEnhancement({
  friends,
  isUltraPremium,
  onVideoCall,
  onMessage
}: UltraPremiumFriendsEnhancementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortBy, setSortBy] = useState("online");

  const filters = [
    { id: "all", label: "All Friends", icon: Users },
    { id: "online", label: "Online Now", icon: Sparkles },
    { id: "premium", label: "Premium Friends", icon: Crown },
    { id: "recent", label: "Recent Chats", icon: Clock },
    { id: "favorites", label: "Favorites", icon: Heart }
  ];

  const filteredFriends = friends.filter(friend => {
    const matchesSearch = friend.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    switch (activeFilter) {
      case "online":
        return matchesSearch && friend.isOnline;
      case "premium":
        return matchesSearch && friend.isPremium;
      case "recent":
        return matchesSearch && friend.totalChats > 5;
      case "favorites":
        return matchesSearch && friend.compatibility > 80;
      default:
        return matchesSearch;
    }
  }).sort((a, b) => {
    switch (sortBy) {
      case "online":
        return Number(b.isOnline) - Number(a.isOnline);
      case "compatibility":
        return b.compatibility - a.compatibility;
      case "activity":
        return b.totalChats - a.totalChats;
      default:
        return 0;
    }
  });

  if (!isUltraPremium) {
    return null; // Regular friends component would be shown
  }

  return (
    <div className="space-y-6">
      {/* ULTRA+ Friends Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Gem className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold">ULTRA+ Friends</h2>
            <p className="text-purple-100 text-sm">Premium friendship experience</p>
          </div>
        </div>

        {/* Premium Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">{friends.length}</div>
            <div className="text-purple-100 text-xs">Total Friends</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{friends.filter(f => f.isOnline).length}</div>
            <div className="text-purple-100 text-xs">Online Now</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{friends.filter(f => f.isPremium).length}</div>
            <div className="text-purple-100 text-xs">Premium Friends</div>
          </div>
        </div>
      </div>

      {/* Advanced Search & Filters */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardContent className="p-4">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search friends with ULTRA+ power..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-purple-200 focus:border-purple-400"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {filters.map(filter => (
              <Button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                variant={activeFilter === filter.id ? "default" : "outline"}
                size="sm"
                className={`flex items-center gap-2 ${
                  activeFilter === filter.id
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 border-none"
                    : "border-purple-200 text-purple-600 hover:bg-purple-50"
                }`}
              >
                <filter.icon className="h-3 w-3" />
                {filter.label}
              </Button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-purple-200 rounded px-2 py-1 bg-white"
            >
              <option value="online">Online Status</option>
              <option value="compatibility">Compatibility</option>
              <option value="activity">Chat Activity</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Friends Grid with Premium Features */}
      <div className="grid gap-4">
        {filteredFriends.map(friend => (
          <UltraPremiumFriendCard
            key={friend.id}
            friend={friend}
            onVideoCall={() => onVideoCall(friend.id)}
            onMessage={() => onMessage(friend.id)}
          />
        ))}
      </div>

      {/* Premium Suggestions */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <span className="font-semibold text-purple-800">ULTRA+ Recommendations</span>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Based on your premium analytics, we suggest connecting with these users:
          </p>
          <div className="flex flex-wrap gap-2">
            {["Active Chatter", "Premium User", "Compatibility Match"].map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs rounded-full border border-purple-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Individual Premium Friend Card
function UltraPremiumFriendCard({ 
  friend, 
  onVideoCall, 
  onMessage 
}: { 
  friend: Friend; 
  onVideoCall: () => void; 
  onMessage: () => void; 
}) {
  return (
    <Card className="border-purple-200 hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-white to-purple-50/30">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Profile Image with Status */}
          <div className="relative">
            {friend.profileImage ? (
              <img
                src={friend.profileImage}
                alt={friend.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-purple-200"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-xl">
                {friend.name.charAt(0)}
              </div>
            )}
            
            {/* Online Status */}
            {friend.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>
            )}

            {/* Premium Badge */}
            {friend.isPremium && (
              <div className="absolute -top-1 -left-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                <Crown className="h-3 w-3 text-white" />
              </div>
            )}
          </div>

          {/* Friend Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-800">{friend.name}</h3>
              {friend.compatibility > 80 && (
                <div className="flex items-center gap-1 bg-pink-100 px-2 py-0.5 rounded-full">
                  <Heart className="h-3 w-3 text-pink-600" />
                  <span className="text-xs text-pink-600 font-medium">{friend.compatibility}%</span>
                </div>
              )}
            </div>

            {/* Last Seen */}
            <LastSeenDisplay
              lastSeen={friend.lastSeen}
              isOnline={friend.isOnline}
              isVisible={true}
              className="mb-2"
            />

            {/* Premium Insights */}
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                <span>{friend.totalChats} chats</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{friend.mutualFriends} mutual</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <Button
              onClick={onVideoCall}
              size="sm"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-none"
            >
              <Video className="h-3 w-3 mr-1" />
              Call
            </Button>
            <Button
              onClick={onMessage}
              size="sm"
              variant="outline"
              className="border-purple-200 text-purple-600 hover:bg-purple-50"
            >
              <MessageCircle className="h-3 w-3 mr-1" />
              Chat
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
