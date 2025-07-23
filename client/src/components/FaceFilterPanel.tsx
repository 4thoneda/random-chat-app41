import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { X, Crown, Sparkles, Heart, Camera } from 'lucide-react';
import { faceFilters, FaceFilter } from '../lib/faceFilters';

interface FaceFilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onFilterSelect: (filter: FaceFilter) => void;
  currentFilter: FaceFilter | null;
  isUltraPremium: boolean;
  onUpgrade: () => void;
}

export default function FaceFilterPanel({
  isOpen,
  onClose,
  onFilterSelect,
  currentFilter,
  isUltraPremium,
  onUpgrade,
}: FaceFilterPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const categories = [
    { key: 'all', name: 'All Filters', icon: '🎭' },
    { key: 'fun', name: 'Fun', icon: '😄' },
    { key: 'romantic', name: 'Romantic', icon: '💕' },
    { key: 'beauty', name: 'Beauty', icon: '✨' },
    { key: 'effects', name: 'Effects', icon: '🎨' },
  ];

  const filteredFilters = selectedCategory === 'all' 
    ? faceFilters 
    : faceFilters.filter(filter => filter.category === selectedCategory);

  const handleFilterSelect = (filter: FaceFilter) => {
    if (filter.isPremium && !isUltraPremium) {
      onUpgrade();
      return;
    }
    onFilterSelect(filter);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center p-4">
      <Card className="w-full max-w-md bg-white rounded-t-3xl shadow-2xl max-h-[80vh] overflow-hidden animate-slide-up">
        <CardHeader className="text-center relative bg-gradient-to-r from-passion-500 to-romance-600 text-white">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-2 top-2 p-2 text-white hover:bg-white/20 rounded-full"
          >
            <X size={20} />
          </Button>
          
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
              <Camera className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <CardTitle className="text-xl font-bold">
            Face Filters
          </CardTitle>
          <p className="text-white/80 text-sm">
            Apply filters to your partner's video
          </p>
          
          {!isUltraPremium && (
            <div className="flex items-center justify-center gap-2 bg-yellow-400/20 backdrop-blur-sm px-3 py-1 rounded-full mt-2">
              <Crown className="h-4 w-4 text-yellow-300" />
              <span className="text-yellow-100 text-sm font-bold">ULTRA+ Feature</span>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-0">
          {/* Category Filter */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => setSelectedCategory(category.key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                    selectedCategory === category.key
                      ? "bg-passion-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <span>{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Filters Grid */}
          <div className="max-h-96 overflow-y-auto p-4">
            <div className="grid grid-cols-3 gap-3">
              {filteredFilters.map((filter) => {
                const isSelected = currentFilter?.id === filter.id;
                const isLocked = filter.isPremium && !isUltraPremium;

                return (
                  <button
                    key={filter.id}
                    onClick={() => handleFilterSelect(filter)}
                    className={`relative p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                      isSelected
                        ? 'border-passion-500 bg-passion-50 shadow-lg'
                        : isLocked
                        ? 'border-gray-200 bg-gray-50 opacity-75'
                        : 'border-gray-200 hover:border-passion-300 hover:bg-passion-25'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">{filter.icon}</div>
                      <div className="text-xs font-medium text-gray-800 mb-1">
                        {filter.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {filter.description}
                      </div>
                    </div>

                    {/* Premium Lock */}
                    {isLocked && (
                      <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center">
                        <Crown className="w-6 h-6 text-yellow-500" />
                      </div>
                    )}

                    {/* Premium Badge */}
                    {filter.isPremium && (
                      <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-1">
                        <Crown className="w-3 h-3 text-white" />
                      </div>
                    )}

                    {/* Selected Indicator */}
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-passion-500 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ULTRA+ Upgrade Banner */}
          {!isUltraPremium && (
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-t border-gray-100">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Crown className="h-5 w-5 text-purple-600" />
                  <span className="font-bold text-purple-800">Upgrade to ULTRA+</span>
                </div>
                <p className="text-sm text-purple-600 mb-3">
                  Unlock all premium face filters and apply them to your partner's video!
                </p>
                <Button
                  onClick={onUpgrade}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 py-2 rounded-full"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Upgrade Now
                </Button>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <div className="text-center">
              <h4 className="font-medium text-gray-800 mb-2">How it works</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• Select a filter to apply to your partner's video</p>
                <p>• Only you will see the filter effect</p>
                <p>• Premium filters require ULTRA+ subscription</p>
                <p>• Tap "No Filter" to remove effects</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}