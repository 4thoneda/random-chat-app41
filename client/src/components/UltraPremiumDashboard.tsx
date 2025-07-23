import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Users, 
  Heart, 
  Crown, 
  Zap, 
  Star, 
  Clock,
  Eye,
  MessageCircle,
  Video,
  Gem,
  Award,
  Target
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

interface UltraPremiumDashboardProps {
  isVisible: boolean;
  onClose: () => void;
  userStats?: {
    totalChats: number;
    totalFriends: number;
    premiumSince: Date;
    totalReactions: number;
    avgChatDuration: number;
    favoriteFeatures: string[];
  };
}

export default function UltraPremiumDashboard({ 
  isVisible, 
  onClose, 
  userStats = {
    totalChats: 150,
    totalFriends: 25,
    premiumSince: new Date('2024-01-15'),
    totalReactions: 89,
    avgChatDuration: 12.5,
    favoriteFeatures: ['Face Filters', 'Premium Reactions', 'Unlimited Time']
  }
}: UltraPremiumDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [achievements, setAchievements] = useState([
    { id: 1, title: 'Social Butterfly', description: '50+ successful chats', icon: '🦋', unlocked: true },
    { id: 2, title: 'Heart Collector', description: '100+ reactions received', icon: '💖', unlocked: true },
    { id: 3, title: 'Premium Pioneer', description: 'ULTRA+ for 3+ months', icon: '🌟', unlocked: false },
    { id: 4, title: 'Connection Master', description: '25+ friends added', icon: '👥', unlocked: true },
  ]);

  if (!isVisible) return null;

  const getPremiumDuration = () => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - userStats.premiumSince.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-purple-50 via-white to-pink-50 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-purple-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Gem className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">ULTRA+ Dashboard</h2>
                <p className="text-purple-100">Your premium experience insights</p>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              className="text-white hover:bg-white/20 rounded-full"
            >
              ✕
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-purple-100">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'achievements', label: 'Achievements', icon: Award },
            { id: 'analytics', label: 'Analytics', icon: Target }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-4 flex items-center justify-center gap-2 font-semibold transition-all ${
                activeTab === tab.id
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                  : 'text-gray-600 hover:text-purple-500 hover:bg-purple-25'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Premium Status */}
              <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-800">
                    <Crown className="h-5 w-5" />
                    Premium Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{getPremiumDuration()}</div>
                      <div className="text-sm text-gray-600">Days Premium</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-pink-600">{userStats.totalChats}</div>
                      <div className="text-sm text-gray-600">Total Chats</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{userStats.totalFriends}</div>
                      <div className="text-sm text-gray-600">Friends</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-pink-600">{userStats.totalReactions}</div>
                      <div className="text-sm text-gray-600">Reactions Sent</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Feature Usage */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-purple-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      Most Used Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {userStats.favoriteFeatures.map((feature, index) => (
                        <div key={feature} className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            index === 0 ? 'bg-yellow-100 text-yellow-600' :
                            index === 1 ? 'bg-purple-100 text-purple-600' :
                            'bg-pink-100 text-pink-600'
                          }`}>
                            {index + 1}
                          </div>
                          <span className="font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-purple-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-blue-500" />
                      Chat Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Avg Chat Duration</span>
                          <span className="font-bold text-blue-600">{userStats.avgChatDuration} min</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                            style={{ width: `${Math.min((userStats.avgChatDuration / 30) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-center pt-2">
                        <div className="text-sm text-gray-600">Premium Advantage</div>
                        <div className="text-lg font-bold text-green-600">Unlimited Time! ∞</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="space-y-4">
              {achievements.map(achievement => (
                <Card key={achievement.id} className={`border ${
                  achievement.unlocked ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`text-3xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-bold ${achievement.unlocked ? 'text-green-800' : 'text-gray-600'}`}>
                          {achievement.title}
                        </h3>
                        <p className={`text-sm ${achievement.unlocked ? 'text-green-600' : 'text-gray-500'}`}>
                          {achievement.description}
                        </p>
                      </div>
                      {achievement.unlocked && (
                        <div className="text-green-500">
                          <Award className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Premium Features Impact */}
              <Card className="border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-500" />
                    Premium Features Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                      <Eye className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                      <div className="font-bold text-purple-600">No Ads</div>
                      <div className="text-sm text-gray-600">Pure experience</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg">
                      <Heart className="h-8 w-8 text-pink-500 mx-auto mb-2" />
                      <div className="font-bold text-pink-600">Premium Reactions</div>
                      <div className="text-sm text-gray-600">{userStats.totalReactions} sent</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                      <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                      <div className="font-bold text-blue-600">Unlimited Time</div>
                      <div className="text-sm text-gray-600">No limits</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Activity */}
              <Card className="border-purple-200">
                <CardHeader>
                  <CardTitle>Weekly Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                      const activity = Math.floor(Math.random() * 10) + 1;
                      return (
                        <div key={day} className="flex items-center gap-3">
                          <div className="w-8 text-sm font-medium">{day}</div>
                          <div className="flex-1 bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                              style={{ width: `${activity * 10}%` }}
                            />
                          </div>
                          <div className="w-8 text-sm text-gray-600">{activity}</div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
