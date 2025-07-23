import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Heart, Clock, Coins, Users, X, Loader } from "lucide-react";
import { useCoin } from "../context/CoinProvider";

interface FriendRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  onDecline: () => void;
  partnerName: string;
  isWaitingForPartner: boolean;
  partnerAccepted?: boolean | null;
  timeLeft: number;
}

export default function FriendRequestModal({
  isOpen,
  onClose,
  onAccept,
  onDecline,
  partnerName,
  isWaitingForPartner,
  partnerAccepted,
  timeLeft,
}: FriendRequestModalProps) {
  const { coins } = useCoin();
  const [myChoice, setMyChoice] = useState<boolean | null>(null);
  const friendshipCost = 20;
  const hasEnoughCoins = coins >= friendshipCost;

  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAccept = () => {
    setMyChoice(true);
    onAccept();
  };

  const handleDecline = () => {
    setMyChoice(false);
    onDecline();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white shadow-2xl border-0 overflow-hidden">
        <div className="bg-gradient-to-r from-romance-500 via-passion-500 to-royal-500 p-6 text-white relative">
          <div className="absolute inset-0 bg-white/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white fill-current" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Continue Chatting?</h2>
                  <p className="text-white/80 text-sm">7 minutes are up!</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">
                Chat time: {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          {!isWaitingForPartner && myChoice === null && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-700 text-lg font-medium mb-2">
                  Want to become friends with <span className="text-romance-600 font-bold">{partnerName}</span>?
                </p>
                <p className="text-gray-500 text-sm">
                  If both of you agree, you can continue chatting and find each other in your friends list!
                </p>
              </div>

              <div className="bg-gradient-to-r from-romance-50 to-passion-50 rounded-xl p-4 border border-romance-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-romance-500 rounded-full flex items-center justify-center">
                    <Coins className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Friendship Cost</p>
                    <p className="text-sm text-gray-600">20 coins will be deducted</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Your balance:</span>
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-yellow-500" />
                    <span className={`font-bold ${hasEnoughCoins ? 'text-green-600' : 'text-red-500'}`}>
                      {coins} coins
                    </span>
                  </div>
                </div>
                
                {!hasEnoughCoins && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm font-medium mb-2">
                      💰 YOU DON'T HAVE ENOUGH BALANCE, RECHARGE NOW
                    </p>
                    <p className="text-red-600 text-xs">
                      OR, Watch 2 ads after the call to continue
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleDecline}
                  variant="outline"
                  className="flex-1 py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  No Thanks
                </Button>
                <Button
                  onClick={handleAccept}
                  className="flex-1 py-3 bg-gradient-to-r from-romance-500 to-passion-500 hover:from-romance-600 hover:to-passion-600 text-white"
                >
                  <Heart className="w-4 h-4 mr-2 fill-current" />
                  Yes, Be Friends!
                </Button>
              </div>
            </div>
          )}

          {isWaitingForPartner && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-romance-100 to-passion-100 rounded-full flex items-center justify-center">
                <Loader className="w-8 h-8 text-romance-500 animate-spin" />
              </div>
              
              {myChoice === true ? (
                <div>
                  <p className="text-lg font-semibold text-gray-800 mb-2">
                    Waiting for {partnerName}...
                  </p>
                  <p className="text-gray-600 text-sm">
                    You chose to be friends! Let's see what {partnerName} decides.
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-semibold text-gray-800 mb-2">
                    You declined the friendship
                  </p>
                  <p className="text-gray-600 text-sm">
                    Waiting for {partnerName}'s response to end the call.
                  </p>
                </div>
              )}
            </div>
          )}

          {partnerAccepted !== null && !isWaitingForPartner && (
            <div className="text-center space-y-4">
              {partnerAccepted && myChoice === true ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-green-700 mb-2">
                    🎉 You're Now Friends!
                  </h3>
                  <p className="text-green-600">
                    Both of you agreed! Continue chatting and find {partnerName} in your friends list.
                  </p>
                  {hasEnoughCoins && (
                    <p className="text-sm text-green-600 mt-2">
                      20 coins have been deducted from your account.
                    </p>
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <div className="w-16 h-16 mx-auto bg-gray-400 rounded-full flex items-center justify-center mb-4">
                    <X className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">
                    Friendship Declined
                  </h3>
                  <p className="text-gray-600">
                    {myChoice === false 
                      ? "You chose not to be friends." 
                      : `${partnerName} declined the friendship request.`
                    }
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    The call will end now.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
