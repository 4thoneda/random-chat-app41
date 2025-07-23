import { useState, useEffect } from "react";
import { useCoin } from "../context/CoinProvider";
import PendingAdsModal from "./PendingAdsModal";

interface AppStartupCheckProps {
  children: React.ReactNode;
}

export default function AppStartupCheck({ children }: AppStartupCheckProps) {
  const { pendingAds } = useCoin();
  const [showPendingAds, setShowPendingAds] = useState(false);
  const [startupChecked, setStartupChecked] = useState(false);

  useEffect(() => {
    // Check for pending ads on app startup
    if (!startupChecked) {
      setStartupChecked(true);
      
      if (pendingAds > 0) {
        setShowPendingAds(true);
      }
    }
  }, [pendingAds, startupChecked]);

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
