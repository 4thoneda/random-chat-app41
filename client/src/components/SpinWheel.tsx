import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import {
  ArrowLeft,
  Play,
  Gift,
  Coins,
  Star,
  Zap,
  X,
  RotateCcw,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Sparkles,
  Crown,
  Flame,
  Diamond,
} from "lucide-react";
import { useCoin } from "../context/CoinProvider";
import { useNavigate } from "react-router-dom";

interface SpinResult {
  coins: number;
  message: string;
  requiresAd: boolean;
  color: string;
  icon: string;
}

const SpinWheel: React.FC = () => {
  const navigate = useNavigate();
  const coinContext = useCoin();
  const {
    coins = 0,
    addCoins,
    watchAd,
    adsWatchedToday = 0,
    maxAdsPerDay = 5,
  } = coinContext || {};
  const wheelRef = useRef<HTMLDivElement>(null);

  // Component states
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<SpinResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [hasSpunToday, setHasSpunToday] = useState(false);
  const [spinsToday, setSpinsToday] = useState(0);
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]);
  const maxSpinsPerDay = 3;

  // Enhanced wheel segments with vibrant colors and patterns matching home page
  const wheelSegments = [
    {
      coins: 10,
      color: "from-peach-400 to-peach-600",
      bgColor: "#FB923C",
      label: "10 Coins",
      probability: 50,
      icon: "💎",
      pattern: "dots",
    },
    {
      coins: 0,
      color: "from-cream-400 to-cream-600",
      bgColor: "#F59E0B",
      label: "Try Again",
      probability: 25,
      icon: "🔄",
      pattern: "stripes",
    },
    {
      coins: 20,
      color: "from-coral-400 to-coral-600",
      bgColor: "#F97316",
      label: "20 Coins",
      probability: 15,
      icon: "⭐",
      pattern: "zigzag",
    },
    {
      coins: 0,
      color: "from-blush-400 to-blush-600",
      bgColor: "#EC4899",
      label: "Better Luck",
      probability: 7,
      icon: "🍀",
      pattern: "waves",
    },
    {
      coins: 50,
      color: "from-rose-400 to-rose-600",
      bgColor: "#F43F5E",
      label: "JACKPOT!",
      probability: 3,
      icon: "🎰",
      pattern: "stars",
    },
  ];

  useEffect(() => {
    // Check daily spin count from localStorage
    const today = new Date().toDateString();
    const lastSpinDate = localStorage.getItem("lastSpinDate");
    const savedSpinsToday = parseInt(localStorage.getItem("spinsToday") || "0");

    if (lastSpinDate === today) {
      setSpinsToday(savedSpinsToday);
      setHasSpunToday(savedSpinsToday >= maxSpinsPerDay);
    } else {
      setSpinsToday(0);
      setHasSpunToday(false);
      localStorage.setItem("lastSpinDate", today);
      localStorage.setItem("spinsToday", "0");
    }
  }, []);

  // Create floating particles effect
  useEffect(() => {
    if (isSpinning) {
      const interval = setInterval(() => {
        setParticles((prev) =>
          [
            ...prev,
            {
              id: Date.now() + Math.random(),
              x: Math.random() * 100,
              y: Math.random() * 100,
            },
          ].slice(-20),
        );
      }, 200);
      return () => clearInterval(interval);
    } else {
      setParticles([]);
    }
  }, [isSpinning]);

  const getRandomResult = (): SpinResult => {
    const random = Math.random() * 100;
    let cumulativeProbability = 0;

    for (const segment of wheelSegments) {
      cumulativeProbability += segment.probability;
      if (random <= cumulativeProbability) {
        if (segment.coins === 0) {
          return {
            coins: 0,
            message: "Better luck next time! 🍀",
            requiresAd: false,
            color: segment.bgColor,
            icon: segment.icon,
          };
        } else {
          return {
            coins: segment.coins,
            message:
              segment.coins === 50
                ? `🎉 JACKPOT! You won ${segment.coins} coins! 🎉`
                : `Congratulations! You won ${segment.coins} coins! 🎉`,
            requiresAd: true,
            color: segment.bgColor,
            icon: segment.icon,
          };
        }
      }
    }

    return {
      coins: 0,
      message: "Better luck next time! 🍀",
      requiresAd: false,
      color: "#F59E0B",
      icon: "🔄",
    };
  };

  const spinWheel = () => {
    if (isSpinning || hasSpunToday) return;

    setIsSpinning(true);
    setShowResult(false);
    setResult(null);

    const randomRotation = 1440 + Math.random() * 1440;

    if (wheelRef.current) {
      wheelRef.current.style.transition =
        "transform 4s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
      wheelRef.current.style.transform = `rotate(${randomRotation}deg)`;
    }

    setTimeout(() => {
      const spinResult = getRandomResult();
      setResult(spinResult);
      setShowResult(true);
      setIsSpinning(false);

      const newSpinsToday = spinsToday + 1;
      setSpinsToday(newSpinsToday);
      localStorage.setItem("spinsToday", newSpinsToday.toString());

      if (newSpinsToday >= maxSpinsPerDay) {
        setHasSpunToday(true);
      }
    }, 4000);
  };

  const handleClaimReward = async () => {
    if (!result) return;

    if (result.requiresAd && result.coins > 0) {
      if (adsWatchedToday >= maxAdsPerDay) {
        alert("You've reached your daily ad limit. Come back tomorrow!");
        return;
      }

      try {
        await watchAd();
        await addCoins(result.coins);
        alert(
          `🎉 Amazing! You watched an ad and earned ${result.coins} coins!`,
        );
        setShowResult(false);
        setResult(null);
      } catch (error) {
        alert("Failed to watch ad. Please try again.");
      }
    } else if (result.coins === 0) {
      if (confirm("Watch an ad and win 10 coins instantly?")) {
        if (adsWatchedToday >= maxAdsPerDay) {
          alert("You've reached your daily ad limit. Come back tomorrow!");
          return;
        }

        try {
          await watchAd();
          await addCoins(10);
          alert("🎉 You watched an ad and earned 10 coins!");
          setShowResult(false);
          setResult(null);
        } catch (error) {
          alert("Failed to watch ad. Please try again.");
        }
      } else {
        setShowResult(false);
        setResult(null);
      }
    }
  };

  const resetDaily = () => {
    setSpinsToday(0);
    setHasSpunToday(false);
    localStorage.setItem("spinsToday", "0");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-peach-25 via-cream-50 to-blush-50 w-full">
      {/* Fixed Header with Prominent Back Button - matching home page style */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-peach-400 via-coral-400 to-blush-500 shadow-lg">
        <div className="flex items-center justify-between px-4 py-4 max-w-sm mx-auto">
          <button
            onClick={() => {
              console.log("Back button clicked - navigating to home");
              navigate("/");
            }}
            className="flex items-center justify-center w-12 h-12 text-white hover:text-peach-100 transition-all duration-300 bg-white/30 hover:bg-white/50 backdrop-blur-sm rounded-full touch-manipulation active:scale-95 border-2 border-white/40 shadow-lg"
            title="Go back"
          >
            <ArrowLeft
              className="h-7 w-7 text-white drop-shadow-lg"
              strokeWidth={3}
            />
          </button>

          <h1 className="text-white font-bold text-xl drop-shadow-lg">Spin & Win</h1>

          <div className="flex items-center gap-2 bg-gradient-to-r from-coral-400 to-peach-500 rounded-full px-4 py-2 shadow-lg border border-white/30">
            <Coins className="h-5 w-5 text-white" />
            <span className="font-bold text-white">{coins}</span>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-sm mx-auto relative min-h-screen">
        {/* Animated Background matching home page */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-peach-200/20 to-coral-200/20 rounded-full animate-pulse"></div>
          <div
            className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-blush-200/20 to-cream-200/20 rounded-full animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>

          {/* Floating romantic particles */}
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-2 h-2 bg-coral-400 rounded-full opacity-60 animate-ping"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                animationDuration: "2s",
              }}
            />
          ))}
        </div>

        {/* Scrollable Content */}
        <div className="relative z-10 p-4">
          {/* Title Section */}
          <div className="text-center py-6">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="text-6xl animate-bounce">🎰</div>
                <div className="absolute -top-2 -right-2 text-2xl animate-ping text-coral-400">
                  ✨
                </div>
                <div
                  className="absolute -bottom-2 -left-2 text-xl animate-ping text-peach-400"
                  style={{ animationDelay: "0.5s" }}
                >
                  ⭐
                </div>
              </div>
            </div>

            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-coral-600 to-peach-600 bg-clip-text text-transparent mb-2 drop-shadow-lg">
              Spin & Win Fortune!
            </h1>

            <p className="text-blush-600 font-medium text-lg drop-shadow-md">
              🎲 Test your luck and win rewards! 🎲
            </p>

            {/* Daily Spin Counter */}
            <div className="mt-6 bg-white/80 backdrop-blur-lg rounded-2xl px-6 py-4 border border-peach-200 shadow-lg">
              <div className="flex items-center gap-3 justify-center">
                <div className="bg-gradient-to-r from-coral-400 to-peach-400 p-2 rounded-full">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div className="text-center">
                  <div className="text-coral-700 font-bold text-lg">
                    Daily Spins: {spinsToday}/{maxSpinsPerDay}
                  </div>
                  <div className="text-blush-600 text-sm font-medium">
                    {maxSpinsPerDay - spinsToday} spins remaining
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3D Wheel Section */}
          <div className="flex flex-col justify-center items-center py-8">
            <div className="relative mb-8">
              {/* Multiple layered outer glow rings for 3D effect */}
              <div className="absolute -inset-8 bg-gradient-to-r from-coral-400 via-peach-400 to-blush-400 rounded-full opacity-30 blur-2xl animate-pulse"></div>
              <div className="absolute -inset-6 bg-gradient-to-r from-peach-500 via-coral-500 to-rose-500 rounded-full opacity-40 blur-xl animate-pulse" style={{ animationDelay: "0.5s" }}></div>
              <div className="absolute -inset-4 bg-gradient-to-r from-coral-600 via-blush-600 to-peach-600 rounded-full opacity-50 blur-lg animate-pulse" style={{ animationDelay: "1s" }}></div>

              {/* 3D Wheel Container with enhanced shadows and gradients */}
              <div
                ref={wheelRef}
                className="relative w-72 h-72 rounded-full shadow-2xl overflow-hidden transform-gpu"
                style={{
                  background: `conic-gradient(
                    from 0deg,
                    #FB923C 0deg 72deg,
                    #F59E0B 72deg 144deg,
                    #F97316 144deg 216deg,
                    #EC4899 216deg 288deg,
                    #F43F5E 288deg 360deg
                  )`,
                  boxShadow: `
                    0 0 0 8px rgba(255, 255, 255, 0.8),
                    0 0 0 12px rgba(251, 146, 60, 0.3),
                    0 25px 50px -12px rgba(0, 0, 0, 0.25),
                    inset 0 2px 4px 0 rgba(255, 255, 255, 0.3),
                    inset 0 -2px 4px 0 rgba(0, 0, 0, 0.1)
                  `,
                  transform: 'perspective(1000px) rotateX(5deg)',
                }}
              >
                {/* Enhanced 3D inner shadow ring */}
                <div 
                  className="absolute inset-2 rounded-full"
                  style={{
                    boxShadow: `
                      inset 0 0 20px rgba(0, 0, 0, 0.2),
                      inset 0 4px 8px rgba(255, 255, 255, 0.3),
                      inset 0 -4px 8px rgba(0, 0, 0, 0.2)
                    `
                  }}
                ></div>

                {/* Segment dividers with 3D effect */}
                {[0, 72, 144, 216, 288].map((angle, index) => (
                  <div
                    key={index}
                    className="absolute w-full h-1 bg-gradient-to-r from-transparent via-white/70 to-transparent origin-left top-1/2"
                    style={{
                      transform: `rotate(${angle}deg)`,
                      transformOrigin: "50% 50%",
                      boxShadow: '0 0 4px rgba(255, 255, 255, 0.5)',
                    }}
                  />
                ))}

                {/* Enhanced 3D center circle */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className="bg-gradient-to-br from-white via-cream-50 to-peach-50 rounded-full w-20 h-20 flex items-center justify-center shadow-2xl border-4 border-gradient-to-r from-coral-400 to-peach-400"
                    style={{
                      boxShadow: `
                        0 8px 16px rgba(0, 0, 0, 0.2),
                        inset 0 2px 4px rgba(255, 255, 255, 0.6),
                        inset 0 -2px 4px rgba(0, 0, 0, 0.1),
                        0 0 0 3px rgba(251, 146, 60, 0.3)
                      `,
                      transform: 'translateZ(10px)',
                    }}
                  >
                    <div className="text-center">
                      <div className="text-lg font-bold bg-gradient-to-r from-coral-600 to-peach-600 bg-clip-text text-transparent animate-pulse">
                        SPIN
                      </div>
                      <div className="text-xs font-bold text-blush-600">
                        WIN!
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced segment labels with 3D shadows */}
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-center">
                  <div className="text-2xl drop-shadow-lg">💎</div>
                  <div className="text-white font-bold text-sm drop-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                    10
                  </div>
                </div>

                <div className="absolute right-6 top-1/2 transform -translate-y-1/2 text-center">
                  <div className="text-2xl drop-shadow-lg">🔄</div>
                  <div className="text-white font-bold text-sm drop-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                    Try
                  </div>
                </div>

                <div className="absolute bottom-10 right-10 text-center">
                  <div className="text-2xl drop-shadow-lg">⭐</div>
                  <div className="text-white font-bold text-sm drop-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                    20
                  </div>
                </div>

                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center">
                  <div className="text-2xl drop-shadow-lg">🍀</div>
                  <div className="text-white font-bold text-sm drop-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                    Luck
                  </div>
                </div>

                <div className="absolute bottom-10 left-10 text-center">
                  <div className="text-3xl animate-pulse drop-shadow-lg">🎰</div>
                  <div className="text-white font-bold text-sm drop-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                    50!
                  </div>
                </div>
              </div>

              {/* Enhanced 3D Pointer */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-20">
                <div className="relative">
                  <div 
                    className="w-0 h-0 border-l-6 border-r-6 border-b-12 border-l-transparent border-r-transparent border-b-gradient-to-b from-coral-400 to-peach-500 drop-shadow-2xl"
                    style={{
                      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3)) drop-shadow(0 2px 4px rgba(251,146,60,0.5))',
                    }}
                  ></div>
                  <div 
                    className="absolute top-3 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gradient-to-br from-coral-400 to-peach-500 rounded-full shadow-lg"
                    style={{
                      boxShadow: '0 2px 4px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.5)',
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Area */}
          <div className="pb-8">
            {hasSpunToday ? (
              <div className="space-y-4">
                <div className="bg-white/80 backdrop-blur-lg text-coral-700 font-bold py-6 px-8 rounded-2xl shadow-lg border border-peach-200 text-center">
                  <div className="text-xl mb-2">🎯 Daily Limit Reached!</div>
                  <div className="text-sm opacity-90 text-blush-600">
                    Come back tomorrow for more spins!
                  </div>
                </div>
                <button
                  onClick={resetDaily}
                  className="w-full text-sm text-coral-600 underline hover:text-coral-700 transition-colors"
                >
                  🔧 Reset for testing
                </button>
              </div>
            ) : (
              <Button
                onClick={spinWheel}
                disabled={isSpinning}
                className={`w-full py-6 rounded-2xl font-extrabold text-xl shadow-2xl transition-all duration-300 transform border-4 touch-manipulation ${
                  isSpinning
                    ? "bg-gray-400 cursor-not-allowed border-gray-500 scale-95"
                    : "bg-gradient-to-r from-coral-500 via-peach-500 to-blush-500 hover:from-coral-600 hover:via-peach-600 hover:to-blush-600 hover:shadow-3xl hover:scale-105 border-white active:scale-95 text-white"
                }`}
              >
                {isSpinning ? (
                  <div className="flex items-center justify-center gap-3">
                    <RotateCcw className="h-7 w-7 animate-spin" />
                    <span>🌟 Spinning Magic... 🌟</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <Play className="h-7 w-7" />
                    <span>🚀 SPIN THE WHEEL! 🚀</span>
                  </div>
                )}
              </Button>
            )}

            {/* Motivational message */}
            <div className="text-center mt-6 bg-white/60 backdrop-blur-lg rounded-2xl p-4 border border-peach-200 shadow-lg">
              <div className="text-coral-700 font-bold text-lg mb-2">
                🎪 Every spin is a chance to win! 🎪
              </div>
              <div className="text-blush-600 text-sm">
                Watch ads to claim your rewards! 📺✨
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Result Modal */}
      {showResult && result && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="relative w-full max-w-sm">
            {/* Confetti effect for wins */}
            {result.coins > 0 && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(30)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-3 h-3 bg-coral-400 animate-bounce opacity-80 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${1 + Math.random()}s`,
                    }}
                  />
                ))}
              </div>
            )}

            <div className="bg-white/95 backdrop-blur-sm rounded-3xl border-4 border-white shadow-3xl relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-10 animate-pulse"
                style={{ backgroundColor: result.color }}
              />

              <div className="text-center relative z-10 p-8">
                <div className="flex justify-center mb-6">
                  {result.coins > 0 ? (
                    <div className="relative">
                      <div className="text-8xl animate-bounce">
                        {result.icon}
                      </div>
                      <div className="absolute -top-4 -right-4 text-4xl animate-ping">
                        🎉
                      </div>
                      <div
                        className="absolute -bottom-4 -left-4 text-3xl animate-ping"
                        style={{ animationDelay: "0.5s" }}
                      >
                        ✨
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="text-6xl">{result.icon}</div>
                      <div className="absolute -top-2 -right-2 text-2xl animate-pulse">
                        💫
                      </div>
                    </div>
                  )}
                </div>

                <h2 className="text-2xl font-extrabold mb-4">
                  {result.coins > 0 ? (
                    <div className="space-y-2">
                      <div className="text-3xl bg-gradient-to-r from-coral-400 to-peach-500 bg-clip-text text-transparent">
                        🎊 WINNER! 🎊
                      </div>
                      <div className="text-lg text-gray-700">
                        You won{" "}
                        <span className="text-coral-600 font-extrabold">
                          {result.coins} coins!
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-600">
                      Better Luck Next Time! 🍀
                    </div>
                  )}
                </h2>

                <p className="text-gray-600 font-medium mb-8">
                  {result.message}
                </p>

                {/* Action Buttons */}
                <div className="space-y-4">
                  {result.requiresAd && result.coins > 0 ? (
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-peach-50 to-coral-50 border-2 border-peach-200 rounded-2xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Play className="h-6 w-6 text-coral-600" />
                          <p className="text-coral-800 font-bold">
                            🎬 Watch a quick ad to claim your {result.coins}{" "}
                            coins!
                          </p>
                        </div>
                        <p className="text-coral-600 text-sm">
                          Supporting ads keeps the app free! 💙
                        </p>
                      </div>
                      <div className="space-y-3">
                        <Button
                          onClick={handleClaimReward}
                          className="w-full bg-gradient-to-r from-coral-500 to-peach-600 hover:from-coral-600 hover:to-peach-700 py-4 font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl text-white"
                        >
                          <Play className="h-5 w-5 mr-2" />
                          Watch Ad & Claim! 🎉
                        </Button>
                        <Button
                          onClick={() => setShowResult(false)}
                          variant="outline"
                          className="w-full py-4 font-bold border-2 hover:bg-gray-50 rounded-2xl"
                        >
                          Maybe Later
                        </Button>
                      </div>
                    </div>
                  ) : result.coins === 0 ? (
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-cream-50 to-peach-50 border-2 border-cream-200 rounded-2xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Gift className="h-6 w-6 text-peach-600" />
                          <p className="text-peach-800 font-bold">
                            🎁 Don't give up! Watch an ad and get 10 coins!
                          </p>
                        </div>
                        <p className="text-peach-600 text-sm">
                          Turn your luck around! 🌟
                        </p>
                      </div>
                      <div className="space-y-3">
                        <Button
                          onClick={handleClaimReward}
                          className="w-full bg-gradient-to-r from-peach-500 to-coral-500 hover:from-peach-600 hover:to-coral-600 py-4 font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl text-white"
                        >
                          <Play className="h-5 w-5 mr-2" />
                          Watch Ad & Get 10 Coins! 🪙
                        </Button>
                        <Button
                          onClick={() => setShowResult(false)}
                          variant="outline"
                          className="w-full py-4 font-bold border-2 hover:bg-gray-50 rounded-2xl"
                        >
                          Close
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setShowResult(false)}
                      className="w-full py-4 font-bold text-lg bg-gradient-to-r from-coral-500 to-peach-500 hover:from-coral-600 hover:to-peach-600 rounded-2xl text-white"
                    >
                      Try Again Tomorrow! 🌅
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpinWheel;
