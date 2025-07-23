import { useState, useEffect } from "react";
import { 
  Crown, 
  Gem, 
  Sparkles, 
  Zap, 
  Heart, 
  Star,
  TrendingUp,
  Users,
  MessageCircle,
  Video,
  Award,
  Target,
  Eye,
  Clock
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface UltraHomeEnhancementsProps {
  isUltraPremium: boolean;
  onQuickMatch: () => void;
  onPremiumSearch: () => void;
  onAnalytics: () => void;
}

export default function UltraHomeEnhancements({
  isUltraPremium,
  onQuickMatch,
  onPremiumSearch,
  onAnalytics
}: UltraHomeEnhancementsProps) {
  const [dailyStats, setDailyStats] = useState({
    chatsToday: 8,
    friendsOnline: 12,
    reactionsSent: 15,
    premiumFeaturesSaved: 45 // minutes saved from no ads + unlimited time
  });

  const [showPremiumFeatures, setShowPremiumFeatures] = useState(true);

  if (!isUltraPremium) {
    return null; // Regular home content would show
  }

  return (
    <div className="space-y-6">
      {/* ULTRA+ Premium Hero Section */}
      <div className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 rounded-3xl p-6 text-white overflow-hidden shadow-2xl">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        <div className="absolute top-4 right-4 text-purple-200/30">
          <Gem className="h-12 w-12 animate-pulse" />
        </div>
        <div className="absolute bottom-4 left-4 text-pink-200/30">
          <Crown className="h-8 w-8 animate-bounce" />
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-200/20">
          <Sparkles className="h-16 w-16 animate-spin" style={{ animationDuration: '8s' }} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Welcome Back, VIP!</h2>
              <p className="text-purple-100">Your ULTRA+ experience awaits</p>
            </div>
          </div>

          {/* Today's Premium Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center bg-white/10 rounded-xl p-3 backdrop-blur-sm">
              <div className="text-2xl font-bold">{dailyStats.chatsToday}</div>
              <div className="text-purple-100 text-xs">Chats Today</div>
            </div>
            <div className="text-center bg-white/10 rounded-xl p-3 backdrop-blur-sm">
              <div className="text-2xl font-bold">{dailyStats.friendsOnline}</div>
              <div className="text-purple-100 text-xs">Friends Online</div>
            </div>
            <div className="text-center bg-white/10 rounded-xl p-3 backdrop-blur-sm">
              <div className="text-2xl font-bold">{dailyStats.reactionsSent}</div>
              <div className="text-purple-100 text-xs">Reactions Sent</div>
            </div>
            <div className="text-center bg-white/10 rounded-xl p-3 backdrop-blur-sm">
              <div className="text-2xl font-bold">{dailyStats.premiumFeaturesSaved}m</div>
              <div className="text-purple-100 text-xs">Time Saved</div>
            </div>
          </div>

          {/* Premium Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={onQuickMatch}
              className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-105"
            >
              <Zap className="h-4 w-4 mr-2" />
              ULTRA+ Match
            </Button>
            <Button
              onClick={onPremiumSearch}
              className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-105"
            >
              <Star className="h-4 w-4 mr-2" />
              VIP Search
            </Button>
          </div>
        </div>
      </div>

      {/* Premium Features Showcase */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* No Ads Achievement */}
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-green-800">Ad-Free Experience</h3>
                <p className="text-green-600 text-sm">Pure, uninterrupted chatting</p>
                <div className="text-xs text-green-500 mt-1">
                  ✨ {dailyStats.premiumFeaturesSaved} minutes saved today
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Unlimited Time */}
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-blue-800">Unlimited Chat Time</h3>
                <p className="text-blue-600 text-sm">No limits, endless conversations</p>
                <div className="text-xs text-blue-500 mt-1">
                  ∞ Freedom to connect
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Premium Reactions */}
        <Card className="border-pink-200 bg-gradient-to-br from-pink-50 to-rose-50 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-pink-800">Premium Reactions</h3>
                <p className="text-pink-600 text-sm">Flare & Super Emoji unlocked</p>
                <div className="text-xs text-pink-500 mt-1">
                  💖 {dailyStats.reactionsSent} reactions sent today
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Access */}
        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={onAnalytics}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-purple-800">Premium Analytics</h3>
                <p className="text-purple-600 text-sm">Detailed insights & stats</p>
                <div className="text-xs text-purple-500 mt-1">
                  📊 Tap to view dashboard
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ULTRA+ Exclusive Features */}
      <Card className="border-gradient-to-r from-purple-200 to-pink-200 bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Gem className="h-5 w-5" />
            ULTRA+ Exclusive Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-purple-800">Last Seen</div>
              <div className="text-xs text-purple-600">See when friends were active</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg">
              <MessageCircle className="h-6 w-6 text-pink-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-pink-800">Read Receipts</div>
              <div className="text-xs text-pink-600">Know when messages are read</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
              <Video className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-blue-800">Face Filters</div>
              <div className="text-xs text-blue-600">Instagram-style filters</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg">
              <Award className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-orange-800">VIP Status</div>
              <div className="text-xs text-orange-600">Priority in everything</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Premium Achievements */}
      <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-800">
            <Award className="h-5 w-5" />
            Today's Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-2 bg-green-100 rounded-lg">
              <div className="text-green-600">🎯</div>
              <div className="flex-1">
                <div className="text-sm font-medium text-green-800">Chat Master</div>
                <div className="text-xs text-green-600">Completed 8 chats today</div>
              </div>
              <div className="text-green-600 font-bold">+50 XP</div>
            </div>
            <div className="flex items-center gap-3 p-2 bg-pink-100 rounded-lg">
              <div className="text-pink-600">💖</div>
              <div className="flex-1">
                <div className="text-sm font-medium text-pink-800">Heart Collector</div>
                <div className="text-xs text-pink-600">Sent 15 premium reactions</div>
              </div>
              <div className="text-pink-600 font-bold">+30 XP</div>
            </div>
            <div className="flex items-center gap-3 p-2 bg-purple-100 rounded-lg">
              <div className="text-purple-600">👑</div>
              <div className="flex-1">
                <div className="text-sm font-medium text-purple-800">ULTRA+ Legend</div>
                <div className="text-xs text-purple-600">Using premium features daily</div>
              </div>
              <div className="text-purple-600 font-bold">+100 XP</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
