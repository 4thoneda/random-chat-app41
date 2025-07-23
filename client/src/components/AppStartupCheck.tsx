import { useState, useEffect } from "react";
import { useCoin } from "../context/CoinProvider";
import { usePremium } from "../context/PremiumProvider";
import PendingAdsModal from "./PendingAdsModal";

interface AppStartupCheckProps {
  children: React.ReactNode;
}

export default function AppStartupCheck({ children }: AppStartupCheckProps) {
  const { pendingAds } = useCoin();
  const { isPremium } = usePremium();
  const [showPendingAds, setShowPendingAds] = useState(false);
  const [startupChecked, setStartupChecked] = useState(false);

  useEffect(() => {
    // Check for pending ads on app startup
    if (!startupChecked) {
      setStartupChecked(true);
      
      // Check if user has ULTRA+ premium and show welcome message
      const premiumPlan = localStorage.getItem('ajnabicam_premium_plan');
      if (isPremium && premiumPlan === 'ultra-quarterly') {
        setTimeout(() => {
          alert('🎭 Welcome ULTRA+ user! You can now apply face filters to your partner\'s video during calls. Look for the filter button in video chat!');
        }, 2000);
      }
      
      if (pendingAds > 0) {
        setShowPendingAds(true);
      }
    }
  }, [pendingAds, startupChecked, isPremium]);

  const handleAllAdsWatched = () => {
    setShowPendingAds(false);
  };

  return (
    <>
      {children}
      <PendingAdsModal
        isOpen={showPendingAds}
        onAllAdsWatched={handleAllAdsWatched}
        reason="startup"
      />
    </>
  );
}
