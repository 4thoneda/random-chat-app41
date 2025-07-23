import React from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import BottomNavBar from "../components/BottomNavBar";
import UltraBottomNavBar from "../components/UltraBottomNavBar";
import { usePremium } from "../context/PremiumProvider";
import { Button } from "../components/ui/button";
import { ArrowLeft, Mic, Crown } from "lucide-react";

export default function VoicePage() {
  const navigate = useNavigate();
  const { isUltraPremium } = usePremium();

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleStartVoiceCall = () => {
    navigate("/video-chat", { state: { voiceOnly: true } });
  };

  return (
    <>
      <Helmet>
        <title>AjnabiCam - Voice Chat</title>
      </Helmet>
      <main className="flex flex-col items-center min-h-screen w-full max-w-md mx-auto bg-white px-2 py-4 relative pb-20">
        {/* Header */}
        <div className="w-full flex items-center p-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-xl rounded-t-2xl shadow-lg">
          <button 
            onClick={handleBackClick} 
            className="mr-3 text-white font-bold text-xl hover:scale-110 transition-transform"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="flex-grow text-center">Voice Chat</h1>
          <Mic className="h-6 w-6" />
        </div>

        <div className="w-full flex flex-col bg-white rounded-b-2xl border border-rose-100 shadow-xl mb-6 overflow-hidden">
          {/* Voice Chat Info */}
          <div className="p-6 text-center">
            <div className="text-6xl mb-4">🎙️</div>
            <h2 className="text-2xl font-bold text-rose-600 mb-2">Voice-Only Mode</h2>
            <p className="text-gray-600 mb-6">
              Connect with people through voice conversations only. Perfect for those who prefer audio-only interactions.
            </p>
            
            {/* Premium Feature Notice */}
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 mb-6 border border-purple-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Crown className="h-5 w-5 text-purple-600" />
                <span className="font-semibold text-purple-700">Premium Feature</span>
              </div>
              <p className="text-sm text-purple-600">
                Voice-only mode is available for Premium users. Upgrade to unlock this feature!
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center bg-rose-50 p-3 rounded-lg border border-rose-200">
                <span className="text-2xl mr-3">🔊</span>
                <div className="text-left">
                  <div className="font-semibold text-rose-700">High Quality Audio</div>
                  <div className="text-xs text-rose-500">Crystal clear voice conversations</div>
                </div>
              </div>
              
              <div className="flex items-center bg-rose-50 p-3 rounded-lg border border-rose-200">
                <span className="text-2xl mr-3">🎧</span>
                <div className="text-left">
                  <div className="font-semibold text-rose-700">Privacy Focused</div>
                  <div className="text-xs text-rose-500">No video, just voice connections</div>
                </div>
              </div>
              
              <div className="flex items-center bg-rose-50 p-3 rounded-lg border border-rose-200">
                <span className="text-2xl mr-3">⚡</span>
                <div className="text-left">
                  <div className="font-semibold text-rose-700">Low Bandwidth</div>
                  <div className="text-xs text-rose-500">Works great on slower connections</div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <Button
              onClick={handleStartVoiceCall}
              className="w-full py-4 text-lg font-bold rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Mic className="h-5 w-5 mr-2" />
              Start Voice Chat
            </Button>
            
            <p className="text-xs text-rose-400 mt-4">
              Note: Voice-only mode requires Premium subscription
            </p>
          </div>
        </div>
        
        <BottomNavBar />
      </main>
    </>
  );
}
