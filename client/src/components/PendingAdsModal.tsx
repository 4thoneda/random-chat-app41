import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Play, CheckCircle, X, Clock, AlertTriangle, Gift } from "lucide-react";
import { useCoin } from "../context/CoinProvider";

interface PendingAdsModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onAllAdsWatched: () => void;
  reason: "friendship" | "startup";
  partnerName?: string;
}

export default function PendingAdsModal({
  isOpen,
  onClose,
  onAllAdsWatched,
  reason,
  partnerName,
}: PendingAdsModalProps) {
  const { pendingAds, setPendingAds } = useCoin();
  const [watchedAds, setWatchedAds] = useState(0);
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [adTimer, setAdTimer] = useState(0);
  const [currentAdNumber, setCurrentAdNumber] = useState(0);

  const totalAdsToWatch = pendingAds || 2;
  const adsRemaining = totalAdsToWatch - watchedAds;

  useEffect(() => {
    if (isWatchingAd && adTimer > 0) {
      const timer = setTimeout(() => {
        setAdTimer(adTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isWatchingAd && adTimer === 0) {
      // Ad finished
      handleAdComplete();
    }
  }, [isWatchingAd, adTimer]);

  const handleWatchAd = () => {
    setIsWatchingAd(true);
    setAdTimer(30); // 30 second ad simulation
    setCurrentAdNumber(watchedAds + 1);
  };

  const handleAdComplete = () => {
    setIsWatchingAd(false);
    setAdTimer(0);
    const newWatchedAds = watchedAds + 1;
    setWatchedAds(newWatchedAds);

    if (newWatchedAds >= totalAdsToWatch) {
      // All ads watched
      setPendingAds(0);
      setTimeout(() => {
        onAllAdsWatched();
      }, 1500);
    }
  };

  const handleSkipAttempt = () => {
    alert("❌ You must watch all required ads to continue using AjnabiCam. This ensures our app remains free!");
  };

  if (!isOpen) return null;

  const getReasonText = () => {
    switch (reason) {
      case "friendship":
        return {
          title: "Complete Your Friendship Request",
          description: `You chose to be friends with ${partnerName} but don't have enough coins. Watch ${totalAdsToWatch} ads to complete your friendship request!`,
          icon: "💕"
        };
      case "startup":
        return {
          title: "Welcome Back!",
          description: `You have ${totalAdsToWatch} pending ads from your previous session. Please watch them to continue using AjnabiCam.`,
          icon: "🎬"
        };
      default:
        return {
          title: "Watch Required Ads",
          description: `Please watch ${totalAdsToWatch} ads to continue.`,
          icon: "📺"
        };
    }
  };

  const reasonData = getReasonText();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white shadow-2xl border-0 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-6 text-white relative">
          <div className="absolute inset-0 bg-white/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                  {reasonData.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{reasonData.title}</h2>
                  <p className="text-white/80 text-sm">Required to continue</p>
                </div>
              </div>
              {reason !== "startup" && onClose && (
                <button
                  onClick={handleSkipAttempt}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Progress Bar */}
            <div className="bg-white/20 rounded-full h-3 overflow-hidden">
              <div
                className="bg-white h-full transition-all duration-500 ease-out"
                style={{ width: `${(watchedAds / totalAdsToWatch) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span>{watchedAds} of {totalAdsToWatch} ads watched</span>
              <span>{adsRemaining} remaining</span>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          {watchedAds >= totalAdsToWatch ? (
            /* All ads completed */
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-green-700 mb-2">
                  🎉 All Ads Watched!
                </h3>
                <p className="text-green-600">
                  {reason === "friendship" 
                    ? `Your friendship with ${partnerName} is now confirmed! You can continue chatting.`
                    : "Thank you for watching the ads! You can now continue using AjnabiCam."
                  }
                </p>
              </div>
            </div>
          ) : isWatchingAd ? (
            /* Currently watching ad */
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-red-500 rounded-full flex items-center justify-center">
                <Play className="w-10 h-10 text-white fill-current" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Watching Ad {currentAdNumber} of {totalAdsToWatch}
                </h3>
                <div className="flex items-center justify-center gap-2 text-red-600">
                  <Clock className="w-5 h-5" />
                  <span className="text-lg font-mono font-bold">{adTimer}s</span>
                </div>
                <p className="text-gray-600 text-sm mt-2">
                  Please wait for the ad to complete...
                </p>
              </div>
              
              {/* Fake ad content */}
              <div className="bg-gray-100 rounded-lg p-6 border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <div className="text-4xl mb-2">🛍️</div>
                  <p className="font-bold text-gray-700">Sample Advertisement</p>
                  <p className="text-sm text-gray-500">Amazing deals await you!</p>
                  <div className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg inline-block">
                    Learn More
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Ready to watch next ad */
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-700 text-base mb-3">
                  {reasonData.description}
                </p>
                
                {reason === "startup" && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                      <div className="text-left">
                        <p className="text-orange-700 font-medium text-sm">
                          You must watch these ads to continue using the app
                        </p>
                        <p className="text-orange-600 text-xs mt-1">
                          Closing the app won't skip this requirement
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <Gift className="w-6 h-6 text-blue-500" />
                  <span className="font-semibold text-gray-800">Ad Benefits</span>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Keeps AjnabiCam completely free</li>
                  <li>• Supports our amazing community</li>
                  <li>• Each ad is only 30 seconds long</li>
                  {reason === "friendship" && (
                    <li>• Unlocks your friendship with {partnerName}</li>
                  )}
                </ul>
              </div>

              <Button
                onClick={handleWatchAd}
                className="w-full py-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold text-lg"
              >
                <Play className="w-5 h-5 mr-2 fill-current" />
                Watch Ad {watchedAds + 1} of {totalAdsToWatch}
              </Button>

              {adsRemaining > 1 && (
                <p className="text-center text-sm text-gray-500">
                  {adsRemaining - 1} more ad{adsRemaining - 1 !== 1 ? 's' : ''} after this one
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
