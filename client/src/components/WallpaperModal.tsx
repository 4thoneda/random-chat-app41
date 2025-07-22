import { useState } from "react";
import {
  X,
  Heart,
  Star,
  Sun,
  Moon,
  Coffee,
  Music,
  Camera,
  Image,
  Flower2,
  Mountain,
  Waves,
  Flame,
  Snowflake,
  Zap,
  Bug,
  Cloud,
  TreePine,
  Globe,
  Gem,
  Crown,
  Sparkles,
  Smile,
  BookOpen,
  Bird,
  Lock,
} from "lucide-react";
import { Button } from "./ui/button";
import { usePremium } from "../context/PremiumProvider";

const wallpaperThemes = [
  // Romantic themes
  {
    id: 1,
    name: "Romantic Sunset",
    icon: Heart,
    gradient: "from-pink-400 via-red-400 to-yellow-400",
    emotion: "romantic",
  },
  {
    id: 2,
    name: "Love Garden",
    icon: Flower2,
    gradient: "from-rose-300 via-pink-300 to-red-300",
    emotion: "romantic",
  },
  {
    id: 3,
    name: "Dreamy Hearts",
    icon: Heart,
    gradient: "from-purple-300 via-pink-300 to-red-300",
    emotion: "romantic",
  },

  // Happy/Joyful themes
  {
    id: 4,
    name: "Sunshine Vibes",
    icon: Sun,
    gradient: "from-yellow-300 via-orange-300 to-red-300",
    emotion: "happy",
  },
  {
    id: 5,
    name: "Rainbow Dreams",
    icon: Star,
    gradient: "from-red-300 via-yellow-300 to-green-300",
    emotion: "happy",
  },
  {
    id: 6,
    name: "Sparkling Joy",
    icon: Sparkles,
    gradient: "from-yellow-200 via-pink-200 to-purple-200",
    emotion: "happy",
  },

  // Calm/Peaceful themes
  {
    id: 7,
    name: "Ocean Waves",
    icon: Waves,
    gradient: "from-blue-300 via-cyan-300 to-teal-300",
    emotion: "calm",
  },
  {
    id: 8,
    name: "Mountain Mist",
    icon: Mountain,
    gradient: "from-gray-300 via-blue-300 to-indigo-300",
    emotion: "calm",
  },
  {
    id: 9,
    name: "Peaceful Clouds",
    icon: Cloud,
    gradient: "from-gray-200 via-blue-200 to-indigo-200",
    emotion: "calm",
  },

  // Energetic themes
  {
    id: 10,
    name: "Electric Storm",
    icon: Zap,
    gradient: "from-indigo-400 via-purple-400 to-pink-400",
    emotion: "energetic",
  },
  {
    id: 11,
    name: "Fire Energy",
    icon: Flame,
    gradient: "from-red-400 via-orange-400 to-yellow-400",
    emotion: "energetic",
  },
  {
    id: 12,
    name: "Neon Nights",
    icon: Star,
    gradient: "from-purple-500 via-pink-500 to-cyan-500",
    emotion: "energetic",
  },

  // Nature themes
  {
    id: 13,
    name: "Forest Path",
    icon: TreePine,
    gradient: "from-green-400 via-emerald-400 to-teal-400",
    emotion: "nature",
  },
  {
    id: 14,
    name: "Butterfly Garden",
    icon: Bug,
    gradient: "from-orange-300 via-yellow-300 to-green-300",
    emotion: "nature",
  },
  {
    id: 15,
    name: "Earth Harmony",
    icon: Globe,
    gradient: "from-green-400 via-blue-400 to-brown-400",
    emotion: "nature",
  },

  // Mysterious/Night themes
  {
    id: 16,
    name: "Midnight Moon",
    icon: Moon,
    gradient: "from-indigo-600 via-purple-600 to-black",
    emotion: "mysterious",
  },
  {
    id: 17,
    name: "Ice Crystal",
    icon: Snowflake,
    gradient: "from-blue-400 via-cyan-400 to-white",
    emotion: "mysterious",
  },
  {
    id: 18,
    name: "Starry Night",
    icon: Star,
    gradient: "from-indigo-500 via-purple-500 to-black",
    emotion: "mysterious",
  },

  // Cozy themes
  {
    id: 19,
    name: "Coffee Warmth",
    icon: Coffee,
    gradient: "from-amber-400 via-orange-400 to-brown-400",
    emotion: "cozy",
  },
  {
    id: 20,
    name: "Sunset Café",
    icon: Image,
    gradient: "from-orange-300 via-red-300 to-purple-300",
    emotion: "cozy",
  },
  {
    id: 21,
    name: "Warm Embrace",
    icon: Heart,
    gradient: "from-orange-200 via-yellow-200 to-red-200",
    emotion: "cozy",
  },

  // Musical themes
  {
    id: 22,
    name: "Music Waves",
    icon: Music,
    gradient: "from-purple-400 via-blue-400 to-cyan-400",
    emotion: "creative",
  },
  {
    id: 23,
    name: "Creative Flow",
    icon: Camera,
    gradient: "from-pink-400 via-purple-400 to-indigo-400",
    emotion: "creative",
  },
  {
    id: 24,
    name: "Artistic Soul",
    icon: Sparkles,
    gradient: "from-violet-400 via-pink-400 to-orange-400",
    emotion: "creative",
  },

  // Luxury themes
  {
    id: 25,
    name: "Golden Crown",
    icon: Crown,
    gradient: "from-yellow-400 via-orange-400 to-amber-400",
    emotion: "luxury",
  },
  {
    id: 26,
    name: "Diamond Shine",
    icon: Gem,
    gradient: "from-gray-300 via-blue-300 to-purple-300",
    emotion: "luxury",
  },
  {
    id: 27,
    name: "Royal Purple",
    icon: Crown,
    gradient: "from-purple-500 via-indigo-500 to-blue-500",
    emotion: "luxury",
  },

  // Spiritual themes
  {
    id: 28,
    name: "Peace Within",
    icon: Smile,
    gradient: "from-green-300 via-blue-300 to-purple-300",
    emotion: "spiritual",
  },
  {
    id: 29,
    name: "Wisdom Light",
    icon: BookOpen,
    gradient: "from-yellow-300 via-orange-300 to-purple-300",
    emotion: "spiritual",
  },
  {
    id: 30,
    name: "Free Spirit",
    icon: Bird,
    gradient: "from-cyan-300 via-blue-300 to-indigo-300",
    emotion: "spiritual",
  },
];

// Premium wallpapers with beautiful real images
const premiumWallpapers = [
  {
    id: 101,
    name: "Romantic Sunset",
    imageUrl: "https://images.pexels.com/photos/10214705/pexels-photo-10214705.jpeg",
    emotion: "romantic",
    isPremium: true,
  },
  {
    id: 102,
    name: "Ocean Dreams",
    imageUrl: "https://images.pexels.com/photos/33092762/pexels-photo-33092762.jpeg",
    emotion: "calm",
    isPremium: true,
  },
  {
    id: 103,
    name: "Mountain Vista",
    imageUrl: "https://images.pexels.com/photos/33108457/pexels-photo-33108457.jpeg",
    emotion: "nature",
    isPremium: true,
  },
  {
    id: 104,
    name: "Flower Paradise",
    imageUrl: "https://images.pexels.com/photos/158756/flowers-plants-korea-nature-158756.jpeg",
    emotion: "romantic",
    isPremium: true,
  },
  {
    id: 105,
    name: "Starry Night",
    imageUrl: "https://images.pexels.com/photos/813269/pexels-photo-813269.jpeg",
    emotion: "mysterious",
    isPremium: true,
  },
  {
    id: 106,
    name: "City Lights",
    imageUrl: "https://images.pexels.com/photos/2093323/pexels-photo-2093323.jpeg",
    emotion: "energetic",
    isPremium: true,
  },
  {
    id: 107,
    name: "Autumn Serenity",
    imageUrl: "https://images.pexels.com/photos/3764004/pexels-photo-3764004.jpeg",
    emotion: "cozy",
    isPremium: true,
  },
  {
    id: 108,
    name: "Tropical Waterfall",
    imageUrl: "https://images.pexels.com/photos/33089538/pexels-photo-33089538.png",
    emotion: "nature",
    isPremium: true,
  },
  {
    id: 109,
    name: "Cherry Blossoms",
    imageUrl: "https://images.pexels.com/photos/32654433/pexels-photo-32654433.jpeg",
    emotion: "romantic",
    isPremium: true,
  },
  {
    id: 110,
    name: "Aurora Lights",
    imageUrl: "https://images.pexels.com/photos/23995635/pexels-photo-23995635.jpeg",
    emotion: "mysterious",
    isPremium: true,
  },
];

interface WallpaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWallpaper: (wallpaper: any) => void;
  currentWallpaper?: any;
}

export default function WallpaperModal({
  isOpen,
  onClose,
  onSelectWallpaper,
  currentWallpaper,
}: WallpaperModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { isPremium } = usePremium();

  if (!isOpen) return null;

  const categories = [
    { key: "all", name: "All Themes" },
    { key: "premium", name: "✨ Premium" },
    { key: "romantic", name: "Romantic" },
    { key: "happy", name: "Happy" },
    { key: "calm", name: "Calm" },
    { key: "energetic", name: "Energetic" },
    { key: "nature", name: "Nature" },
    { key: "mysterious", name: "Mysterious" },
    { key: "cozy", name: "Cozy" },
    { key: "creative", name: "Creative" },
    { key: "luxury", name: "Luxury" },
    { key: "spiritual", name: "Spiritual" },
  ];

  const allWallpapers = [...wallpaperThemes, ...(isPremium || selectedCategory === "premium" ? premiumWallpapers : [])];

  const filteredWallpapers =
    selectedCategory === "all"
      ? allWallpapers
      : selectedCategory === "premium"
      ? premiumWallpapers
      : allWallpapers.filter((w) => w.emotion === selectedCategory);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md sm:max-w-lg lg:max-w-2xl xl:max-w-4xl w-full max-h-[80vh] lg:max-h-[85vh] xl:max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white p-6 sm:p-8 lg:p-10 relative">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Choose Wallpaper</h2>
            <button
              onClick={onClose}
              className="p-2 sm:p-3 lg:p-4 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
            </button>
          </div>
          <p className="text-purple-100 text-sm sm:text-base lg:text-lg mt-1">
            Set a unique mood for this chat
          </p>
        </div>

        {/* Category Filter */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category.key
                    ? "bg-violet-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Wallpaper Grid */}
        <div className="max-h-96 lg:max-h-[500px] xl:max-h-[600px] overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
            {filteredWallpapers.map((wallpaper) => {
              const IconComponent = 'icon' in wallpaper ? wallpaper.icon : null;
              const isSelected = currentWallpaper?.id === wallpaper.id;
              const isPremiumWallpaper = 'isPremium' in wallpaper ? wallpaper.isPremium : false;
              const canUse = !isPremiumWallpaper || isPremium;

              return (
                <div
                  key={wallpaper.id}
                  onClick={() => canUse && onSelectWallpaper(wallpaper)}
                  className={`rounded-xl overflow-hidden shadow-md transition-all transform ${
                    canUse
                      ? "cursor-pointer hover:shadow-lg hover:scale-105"
                      : "cursor-not-allowed opacity-75"
                  } ${isSelected ? "ring-4 ring-violet-500" : ""}`}
                >
                  <div className="h-20 sm:h-24 lg:h-28 xl:h-32 flex items-center justify-center relative overflow-hidden">
                    {isPremiumWallpaper ? (
                      <div
                        className="w-full h-full bg-cover bg-center relative"
                        style={{
                          backgroundImage: `url(${'imageUrl' in wallpaper ? wallpaper.imageUrl : ''})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      >
                        {!canUse && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Lock size={20} className="text-white drop-shadow-lg" />
                          </div>
                        )}
                        {isPremiumWallpaper && (
                          <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded text-xs font-bold text-white shadow-lg">
                            ✨
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        className={`bg-gradient-to-br ${wallpaper.gradient} w-full h-full flex items-center justify-center relative`}
                      >
                        {IconComponent && (
                          <IconComponent
                            size={24}
                            className="text-white/90 drop-shadow-lg"
                          />
                        )}
                      </div>
                    )}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-4 h-4 bg-violet-600 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-white">
                    <p className={`text-xs font-medium text-center leading-tight ${
                      isPremiumWallpaper ? "text-violet-700" : "text-gray-800"
                    }`}>
                      {wallpaper.name}
                      {isPremiumWallpaper && !isPremium && (
                        <span className="block text-xs text-orange-600 font-semibold mt-1">
                          Premium
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
            >
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
