import { useState, useEffect } from "react";
import { 
  Crown, 
  Gem, 
  Sparkles, 
  Star,
  Award,
  TrendingUp,
  Heart,
  Users,
  MessageCircle,
  Video,
  Zap,
  Clock,
  Eye,
  Settings,
  Edit3,
  Camera,
  Palette
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface UltraProfileEnhancementsProps {
  isUltraPremium: boolean;
  userProfile: {
    name: string;
    bio: string;
    profileImage?: string;
    premiumSince: Date;
    totalFriends: number;
    totalChats: number;
    premiumFeatureUsage: {
      reactionsUsed: number;
      filtersUsed: number;
      adsFree: number;
      unlimitedTime: number;
    };
  };
  onProfileUpdate: (updates: any) => void;
}

export default function UltraProfileEnhancements({
  isUltraPremium,
  userProfile,
  onProfileUpdate
}: UltraProfileEnhancementsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(userProfile);
  const [selectedTheme, setSelectedTheme] = useState('purple');

  const themes = [
    { id: 'purple', name: 'Royal Purple', color: 'from-purple-600 to-pink-600' },
    { id: 'gold', name: 'Golden Crown', color: 'from-yellow-500 to-orange-600' },
    { id: 'diamond', name: 'Diamond Elite', color: 'from-cyan-500 to-blue-600' },
    { id: 'rose', name: 'Rose Garden', color: 'from-pink-500 to-rose-600' }
  ];

  const achievements = [
    { id: 1, title: 'ULTRA+ Pioneer', description: 'First week premium user', icon: '🚀', unlocked: true },
    { id: 2, title: 'Social Butterfly', description: '100+ successful chats', icon: '🦋', unlocked: true },
    { id: 3, title: 'Heart Collector', description: '500+ reactions sent', icon: '💖', unlocked: true },
    { id: 4, title: 'Friend Magnet', description: '50+ friends added', icon: '🧲', unlocked: false },
    { id: 5, title: 'Premium Legend', description: '6 months ULTRA+', icon: '👑', unlocked: false },
    { id: 6, title: 'Filter Master', description: 'Used all face filters', icon: '🎭', unlocked: true }
  ];

  if (!isUltraPremium) {
    return null; // Regular profile would show
  }

  const getPremiumDuration = () => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - userProfile.premiumSince.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* ULTRA+ Profile Header */}
      <div className={`relative bg-gradient-to-br ${themes.find(t => t.id === selectedTheme)?.color} rounded-3xl p-6 text-white overflow-hidden shadow-2xl`}>
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        <div className="absolute top-4 right-4 text-white/20">
          <Gem className="h-16 w-16 animate-pulse" />
        </div>
        <div className="absolute bottom-4 left-4 text-white/20">
          <Crown className="h-12 w-12 animate-bounce" />
        </div>

        <div className="relative z-10">
          {/* Profile Picture Section */}
          <div className="flex items-start gap-6 mb-6">
            <div className="relative">
              {userProfile.profileImage ? (
                <img
                  src={userProfile.profileImage}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white/30 shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold border-4 border-white/30">
                  {userProfile.name.charAt(0)}
                </div>
              )}
              
              {/* ULTRA+ Crown Badge */}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                <Crown className="h-4 w-4 text-white" />
              </div>

              {/* Edit Button */}
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                <Camera className="h-4 w-4 text-gray-600" />
              </button>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">{userProfile.name}</h1>
                <div className="bg-yellow-400 px-3 py-1 rounded-full flex items-center gap-1">
                  <Gem className="h-4 w-4 text-white" />
                  <span className="text-white text-sm font-bold">ULTRA+</span>
                </div>
              </div>
              
              <p className="text-white/90 mb-3">{userProfile.bio}</p>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Premium for {getPremiumDuration()} days</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{userProfile.totalFriends} friends</span>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>

          {/* Premium Stats Row */}
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center bg-white/10 rounded-xl p-3 backdrop-blur-sm">
              <div className="text-2xl font-bold">{userProfile.totalChats}</div>
              <div className="text-white/80 text-xs">Total Chats</div>
            </div>
            <div className="text-center bg-white/10 rounded-xl p-3 backdrop-blur-sm">
              <div className="text-2xl font-bold">{userProfile.premiumFeatureUsage.reactionsUsed}</div>
              <div className="text-white/80 text-xs">Reactions</div>
            </div>
            <div className="text-center bg-white/10 rounded-xl p-3 backdrop-blur-sm">
              <div className="text-2xl font-bold">{userProfile.premiumFeatureUsage.filtersUsed}</div>
              <div className="text-white/80 text-xs">Filters Used</div>
            </div>
            <div className="text-center bg-white/10 rounded-xl p-3 backdrop-blur-sm">
              <div className="text-2xl font-bold">{userProfile.premiumFeatureUsage.adsFree}h</div>
              <div className="text-white/80 text-xs">Ad-Free Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Theme Selector */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Palette className="h-5 w-5" />
            ULTRA+ Themes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {themes.map(theme => (
              <button
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className={`p-4 rounded-xl bg-gradient-to-r ${theme.color} text-white text-center transition-all duration-200 transform hover:scale-105 ${
                  selectedTheme === theme.id ? 'ring-2 ring-white shadow-lg scale-105' : ''
                }`}
              >
                <div className="text-sm font-bold">{theme.name}</div>
                {selectedTheme === theme.id && (
                  <div className="mt-1">
                    <Star className="h-4 w-4 mx-auto text-yellow-300" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Premium Achievements */}
      <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-800">
            <Award className="h-5 w-5" />
            Premium Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {achievements.map(achievement => (
              <div
                key={achievement.id}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  achievement.unlocked
                    ? 'border-green-200 bg-green-50 hover:shadow-lg'
                    : 'border-gray-200 bg-gray-50 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`text-3xl ${achievement.unlocked ? '' : 'grayscale'}`}>
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
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Premium Analytics */}
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <TrendingUp className="h-5 w-5" />
            Premium Usage Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Feature Usage Chart */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Premium Reactions</span>
                <span className="text-sm text-purple-600">{userProfile.premiumFeatureUsage.reactionsUsed}/∞</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-3 rounded-full" style={{ width: '75%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Face Filters Used</span>
                <span className="text-sm text-purple-600">{userProfile.premiumFeatureUsage.filtersUsed}/20</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full" style={{ width: '60%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Ad-Free Hours Enjoyed</span>
                <span className="text-sm text-green-600">{userProfile.premiumFeatureUsage.adsFree}h saved</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Premium Settings */}
      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Settings className="h-5 w-5" />
            ULTRA+ Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Eye className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="font-medium text-purple-800">Enhanced Privacy</div>
                  <div className="text-sm text-purple-600">Advanced privacy controls</div>
                </div>
              </div>
              <div className="w-12 h-6 bg-purple-200 rounded-full relative cursor-pointer">
                <div className="w-5 h-5 bg-purple-600 rounded-full absolute top-0.5 right-0.5 transition-all" />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="font-medium text-purple-800">Premium Notifications</div>
                  <div className="text-sm text-purple-600">Get notified about premium features</div>
                </div>
              </div>
              <div className="w-12 h-6 bg-purple-200 rounded-full relative cursor-pointer">
                <div className="w-5 h-5 bg-purple-600 rounded-full absolute top-0.5 right-0.5 transition-all" />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="font-medium text-purple-800">VIP Matching</div>
                  <div className="text-sm text-purple-600">Priority matching with other premium users</div>
                </div>
              </div>
              <div className="w-12 h-6 bg-purple-200 rounded-full relative cursor-pointer">
                <div className="w-5 h-5 bg-purple-600 rounded-full absolute top-0.5 right-0.5 transition-all" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
