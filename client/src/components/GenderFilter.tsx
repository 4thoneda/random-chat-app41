import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Users, User, Crown } from "lucide-react";

interface GenderFilterProps {
  isPremium: boolean;
  onGenderSelect: (gender: string) => void;
  onUpgrade: () => void;
}

export default function GenderFilter({
  isPremium,
  onGenderSelect,
  onUpgrade,
}: GenderFilterProps) {
  const [selectedGender, setSelectedGender] = useState<string>("any");

  const genderOptions = [
    {
      id: "any",
      label: "Anyone",
      icon: Users,
      description: "Connect with all genders",
      emoji: "👥",
      color: "from-blue-500 to-purple-600",
      bgColor: "bg-blue-50 hover:bg-blue-100",
    },
    {
      id: "male",
      label: "Male",
      icon: User,
      description: "Connect with males only",
      emoji: "👨",
      color: "from-cyan-500 to-blue-600",
      bgColor: "bg-cyan-50 hover:bg-cyan-100",
    },
    {
      id: "female",
      label: "Female",
      icon: User,
      description: "Connect with females only",
      emoji: "👩",
      color: "from-pink-500 to-rose-600",
      bgColor: "bg-pink-50 hover:bg-pink-100",
    },
  ];

  const handleGenderChange = (gender: string) => {
    if (!isPremium && gender !== "any") {
      onUpgrade();
      return;
    }
    setSelectedGender(gender);
    onGenderSelect(gender);
  };

  return (
    <Card className="w-full bg-white/95 backdrop-blur-sm shadow-xl border-rose-200 overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-t-lg px-4 py-4">
        <CardTitle className="text-lg flex items-center gap-2 text-rose-700">
          <div className="p-2 bg-rose-100 rounded-full">
            <Users className="h-5 w-5 text-rose-600" />
          </div>
          Gender Preference 💗
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {/* Gender Options - Enhanced 2-Row Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {genderOptions.map((option, index) => {
            const isLocked = !isPremium && option.id !== "any";
            const isSelected = selectedGender === option.id;

            return (
              <div
                key={option.id}
                className={`relative group transform transition-all duration-500 hover:scale-102 ${
                  isSelected ? "scale-105 z-10" : ""
                } animate-slide-in`}
                style={{
                  animationDelay: `${index * 150}ms`,
                }}
              >
                {/* Glow Effect Background */}
                {isSelected && (
                  <div className="absolute -inset-3 bg-gradient-to-r from-rose-400/30 via-pink-400/30 to-purple-400/30 rounded-3xl blur-xl animate-pulse"></div>
                )}

                <Button
                  variant="ghost"
                  className={`w-full h-auto p-4 sm:p-5 rounded-3xl transition-all duration-500 border-2 relative overflow-hidden group ${
                    isSelected
                      ? `bg-gradient-to-r ${option.color} text-white shadow-2xl border-white/50 animate-pulse-glow`
                      : `${option.bgColor} border-gray-200 hover:border-gray-300 hover:shadow-xl group-hover:shadow-2xl`
                  } ${isLocked ? "opacity-75" : ""}`}
                  onClick={() => handleGenderChange(option.id)}
                >
                  {/* Shimmer Animation for Selected */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-shimmer"></div>
                  )}

                  <div className="flex items-center gap-3 w-full relative z-10">
                    {/* Ultra Large Avatar/Emoji with Advanced Animations */}
                    <div className="relative flex-shrink-0">
                      {/* Outer Glow Ring */}
                      {isSelected && (
                        <div className="absolute -inset-3 bg-gradient-to-r from-rose-400/20 via-pink-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse"></div>
                      )}

                      {/* Main Avatar */}
                      <div
                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-3xl sm:text-4xl transition-all duration-700 relative ${
                          isSelected
                            ? "bg-white/25 backdrop-blur-md shadow-2xl animate-bounce scale-110"
                            : "bg-white/90 group-hover:bg-white shadow-xl group-hover:shadow-2xl group-hover:scale-105"
                        }`}
                      >
                        <span
                          className={`transition-all duration-500 ${isSelected ? "animate-pulse" : ""}`}
                        >
                          {option.emoji}
                        </span>
                      </div>

                      {/* Multiple Animated Rings for Selected */}
                      {isSelected && (
                        <>
                          <div className="absolute -inset-3 border-2 border-white/30 rounded-full animate-ping"></div>
                          <div
                            className="absolute -inset-2 border-2 border-white/50 rounded-full animate-pulse"
                            style={{ animationDelay: "0.5s" }}
                          ></div>
                        </>
                      )}

                      {/* Sparkle Effects for Selected */}
                      {isSelected && (
                        <>
                          <div className="absolute -top-1 -right-1 text-yellow-300 text-sm animate-bounce">
                            ✨
                          </div>
                          <div
                            className="absolute -bottom-1 -left-1 text-pink-300 text-xs animate-pulse"
                            style={{ animationDelay: "0.3s" }}
                          >
                            ⭐
                          </div>
                        </>
                      )}
                    </div>

                    {/* Enhanced Content */}
                    <div className="text-left flex-1 min-w-0 pr-2">
                      <div
                        className={`text-base sm:text-lg font-bold mb-1 transition-all duration-300 leading-tight ${
                          isSelected
                            ? "text-white drop-shadow-lg"
                            : "text-gray-800 group-hover:text-gray-900"
                        }`}
                      >
                        {option.label}
                      </div>
                      <div
                        className={`text-xs sm:text-sm font-medium transition-all duration-300 leading-tight break-words ${
                          isSelected
                            ? "text-white/90"
                            : "text-gray-600 group-hover:text-gray-700"
                        }`}
                      >
                        {option.description}
                      </div>
                    </div>

                    {/* Lock Icon with Animation */}
                    {isLocked && (
                      <div className="p-3 bg-yellow-100 rounded-full shadow-lg animate-bounce">
                        <Crown className="h-6 w-6 text-yellow-600" />
                      </div>
                    )}

                    {/* Enhanced Selection Indicator */}
                    {isSelected && (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <div className="w-4 h-4 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full animate-pulse"></div>
                        </div>
                        <div className="text-white text-xs font-bold">
                          Selected
                        </div>
                      </div>
                    )}
                  </div>
                </Button>
              </div>
            );
          })}
        </div>

        {/* Ultimate Premium Upsell Card - Maximum Standout */}
        {!isPremium && (
          <div className="mt-10 relative group animate-fade-in-up">
            {/* Extreme Multiple Layer Background Blur Effect */}
            <div className="absolute -inset-8 bg-gradient-to-r from-purple-500/15 via-pink-500/15 to-orange-500/15 backdrop-blur-2xl rounded-3xl animate-pulse opacity-80"></div>
            <div
              className="absolute -inset-6 bg-gradient-to-r from-purple-400/25 via-pink-400/25 to-orange-400/25 backdrop-blur-xl rounded-3xl animate-pulse"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-300/35 via-pink-300/35 to-orange-300/35 backdrop-blur-lg rounded-3xl"></div>
            <div className="absolute -inset-2 bg-gradient-to-r from-purple-200/45 via-pink-200/45 to-orange-200/45 backdrop-blur-md rounded-3xl"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-white/20 via-white/10 to-white/20 backdrop-blur-sm rounded-3xl"></div>

            {/* Outer Glow Ring */}
            <div className="absolute -inset-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-3xl opacity-20 blur-xl animate-pulse"></div>

            {/* Main Premium Card */}
            <div className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 p-8 rounded-3xl shadow-2xl border-3 border-white/60 overflow-hidden group-hover:scale-105 transition-all duration-500">
              {/* Multiple Animated Backgrounds */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-purple-500/10 animate-pulse"></div>

              {/* Floating Decorative Elements */}
              <div className="absolute -top-3 -left-3 w-6 h-6 bg-yellow-400 rounded-full animate-bounce opacity-80"></div>
              <div className="absolute -top-2 -right-4 w-4 h-4 bg-pink-300 rounded-full animate-pulse opacity-70"></div>
              <div
                className="absolute -bottom-3 -left-4 w-5 h-5 bg-orange-400 rounded-full animate-bounce opacity-75"
                style={{ animationDelay: "0.5s" }}
              ></div>
              <div
                className="absolute -bottom-2 -right-3 w-7 h-7 bg-purple-300 rounded-full animate-pulse opacity-60"
                style={{ animationDelay: "1s" }}
              ></div>

              {/* Corner Sparkles */}
              <div className="absolute top-4 right-6 text-yellow-300 text-xl animate-bounce">
                ✨
              </div>
              <div className="absolute bottom-4 left-6 text-pink-300 text-lg animate-pulse">
                ⭐
              </div>

              <div className="relative z-10 text-center text-white">
                {/* Premium Badge */}
                <div className="mb-4">
                  <div className="inline-flex items-center gap-3 bg-white/25 backdrop-blur-sm px-4 py-2 rounded-full text-base font-bold shadow-lg border border-white/30">
                    <Crown className="h-5 w-5 text-yellow-300 animate-pulse" />
                    Premium Feature
                    <Crown className="h-5 w-5 text-yellow-300 animate-pulse" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-3 drop-shadow-lg animate-pulse">
                  🎯 Unlock Gender Filtering!
                </h3>
                <p className="text-white/95 text-base mb-6 leading-relaxed">
                  Choose exactly who you want to meet with premium gender
                  preferences
                </p>

                {/* Enhanced Benefits List */}
                <div className="flex justify-center gap-4 mb-6 text-sm font-medium">
                  <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                    <span>👨</span> Male Filter
                  </div>
                  <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                    <span>👩</span> Female Filter
                  </div>
                </div>

                <Button
                  onClick={onUpgrade}
                  className="bg-white text-purple-700 hover:bg-yellow-100 font-bold px-8 py-4 rounded-2xl shadow-2xl transform hover:scale-110 transition-all duration-300 border-3 border-yellow-300 hover:border-yellow-400 text-lg group"
                >
                  <Crown className="h-5 w-5 mr-2 text-yellow-600 group-hover:animate-bounce" />
                  Upgrade Now ✨
                  <div className="ml-2 text-sm opacity-75">Premium</div>
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
