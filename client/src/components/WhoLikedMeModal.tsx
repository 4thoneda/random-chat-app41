import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Heart, Crown, X, Coins, Eye, Star, Users } from "lucide-react";
import { useCoin } from "../context/CoinProvider";
import { usePremium } from "../context/PremiumProvider";

interface LikeData {
  id: string;
  name: string;
  age: number;
  location: string;
  avatar: string;
  timeAgo: string;
  isRevealed: boolean;
}

interface WhoLikedMeModalProps {
  isOpen: boolean;
  onClose: () => void;
  likes: LikeData[];
  onRevealLike: (likeId: string) => void;
}

export default function WhoLikedMeModal({
  isOpen,
  onClose,
  likes,
  onRevealLike,
}: WhoLikedMeModalProps) {
  const { coins, deductCoins } = useCoin();
  const { isPremium } = usePremium();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  if (!isOpen) return null;

  const handleRevealLike = async (likeId: string) => {
    if (isPremium) {
      onRevealLike(likeId);
      return;
    }

    if (coins < 10) {
      alert("💰 You need at least 10 coins to reveal a like! Get more coins or upgrade to Premium.");
      return;
    }

    const shouldPay = window.confirm("💝 Pay 10 coins to reveal who liked you?");
    if (!shouldPay) return;

    setIsProcessingPayment(true);
    try {
      const success = await deductCoins(10);
      if (success) {
        onRevealLike(likeId);
        alert("✨ Like revealed! 10 coins deducted from your account.");
      } else {
        alert("❌ Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("❌ Payment failed. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const revealedLikes = likes.filter(like => like.isRevealed);
  const hiddenLikes = likes.filter(like => !like.isRevealed);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white shadow-2xl border-0 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 p-6 text-white relative">
          <div className="absolute inset-0 bg-white/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white fill-current" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Who Liked You</h2>
                  <p className="text-white/80 text-sm">{likes.length} total likes</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <CardContent className="p-0 max-h-96 overflow-y-auto">
          {/* Premium Banner */}
          {!isPremium && (
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-yellow-800" />
                <span className="font-bold text-yellow-800">Upgrade to Premium</span>
              </div>
              <p className="text-yellow-800 text-sm mb-3">
                See all your likes instantly! No more paying per view.
              </p>
              <Button
                onClick={() => {
                  onClose();
                  // Navigate to premium page
                }}
                className="bg-yellow-800 hover:bg-yellow-900 text-white font-semibold px-6 py-2"
              >
                Upgrade Now
              </Button>
            </div>
          )}

          {/* Revealed Likes */}
          {revealedLikes.length > 0 && (
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Revealed Likes ({revealedLikes.length})
              </h3>
              <div className="space-y-3">
                {revealedLikes.map((like) => (
                  <div key={like.id} className="flex items-center gap-3 p-3 bg-green-50 border border-green-200">
                    <img
                      src={like.avatar}
                      alt={like.name}
                      className="w-12 h-12 object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{like.name}, {like.age}</h4>
                      <p className="text-sm text-gray-600">{like.location}</p>
                      <p className="text-xs text-gray-500">{like.timeAgo}</p>
                    </div>
                    <Button
                      onClick={() => {
                        // Navigate to chat or profile
                        alert(`Starting chat with ${like.name}...`);
                      }}
                      className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 text-sm"
                    >
                      Chat
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hidden Likes */}
          {hiddenLikes.length > 0 && (
            <div className="p-4 border-t border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Hidden Likes ({hiddenLikes.length})
              </h3>
              <div className="space-y-3">
                {hiddenLikes.map((like) => (
                  <div key={like.id} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 relative">
                    {/* Blurred Profile */}
                    <div className="w-12 h-12 bg-gray-300 flex items-center justify-center relative overflow-hidden">
                      <img
                        src={like.avatar}
                        alt="Hidden profile"
                        className="w-full h-full object-cover blur-lg"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Heart className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-600">Someone special</h4>
                      <p className="text-sm text-gray-500">Location hidden</p>
                      <p className="text-xs text-gray-400">{like.timeAgo}</p>
                    </div>
                    
                    <div className="text-center">
                      {isPremium ? (
                        <Button
                          onClick={() => handleRevealLike(like.id)}
                          className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 text-sm"
                          disabled={isProcessingPayment}
                        >
                          <Crown className="w-3 h-3 mr-1" />
                          Reveal
                        </Button>
                      ) : (
                        <div className="space-y-1">
                          <Button
                            onClick={() => handleRevealLike(like.id)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 text-sm w-full"
                            disabled={isProcessingPayment || coins < 10}
                          >
                            <Coins className="w-3 h-3 mr-1" />
                            10 coins
                          </Button>
                          <p className="text-xs text-gray-500">
                            {coins < 10 ? 'Need more coins' : 'Pay to reveal'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {likes.length === 0 && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No likes yet</h3>
              <p className="text-gray-500 text-sm">
                Complete your profile and start meeting people to get likes!
              </p>
            </div>
          )}

          {/* Current Balance */}
          {!isPremium && (
            <div className="bg-gray-50 p-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Your Balance:</span>
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-yellow-500" />
                  <span className={`font-bold ${coins >= 10 ? 'text-green-600' : 'text-red-500'}`}>
                    {coins} coins
                  </span>
                </div>
              </div>
              {coins < 10 && (
                <p className="text-xs text-gray-500 mt-1">
                  You need at least 10 coins to reveal a like
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
