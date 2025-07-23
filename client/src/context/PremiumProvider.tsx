import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { getUserProfile, updatePremiumStatus } from "../lib/firestoreUtils";

interface PremiumContextType {
  isPremium: boolean;
  premiumExpiry: Date | null;
  premiumPlan: string | null;
  loading: boolean;
  setPremium: (premium: boolean, expiry?: Date, plan?: string) => Promise<boolean>;
  checkPremiumStatus: () => boolean;
  syncPremiumStatus: () => Promise<void>;
  isUltraPremium: () => boolean;
  isProMonthly: () => boolean;
}

const PremiumContext = createContext<PremiumContextType | null>(null);

export const usePremium = () => {
  const context = useContext(PremiumContext);
  if (!context) {
    throw new Error("usePremium must be used within a PremiumProvider");
  }
  return context;
};

interface PremiumProviderProps {
  children: ReactNode;
}

export const PremiumProvider = ({ children }: PremiumProviderProps) => {
  const [isPremium, setIsPremium] = useState(false);
  const [premiumExpiry, setPremiumExpiry] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Monitor auth state and sync premium status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUserId(user.uid);
        await syncPremiumStatus(user.uid);
      } else {
        setCurrentUserId(null);
        setIsPremium(false);
        setPremiumExpiry(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const syncPremiumStatus = async (userId?: string) => {
    try {
      setLoading(true);
      const userIdToUse = userId || currentUserId;
      if (!userIdToUse) return;

      const userProfile = await getUserProfile(userIdToUse);
      if (userProfile) {
        const { isPremium: userIsPremium, premiumExpiry: userPremiumExpiry } = userProfile;

        // Check if premium has expired
        const now = new Date();
        const expiryDate = userPremiumExpiry?.toDate();

        if (userIsPremium && expiryDate && expiryDate > now) {
          setIsPremium(true);
          setPremiumExpiry(expiryDate);

          // Sync with localStorage for offline access
          localStorage.setItem("premium_status", "true");
          localStorage.setItem("premium_expiry", expiryDate.toISOString());
        } else if (userIsPremium && (!expiryDate || expiryDate <= now)) {
          // Premium expired, update Firestore
          await updatePremiumStatus(userIdToUse, false);
          setIsPremium(false);
          setPremiumExpiry(null);

          // Clear localStorage
          localStorage.removeItem("premium_status");
          localStorage.removeItem("premium_expiry");
        } else {
          setIsPremium(false);
          setPremiumExpiry(null);

          // Clear localStorage
          localStorage.removeItem("premium_status");
          localStorage.removeItem("premium_expiry");
        }
      }
    } catch (error) {
      console.error("Error syncing premium status:", error);

      // Fallback to localStorage if Firestore fails
      const savedPremium = localStorage.getItem("premium_status");
      const savedExpiry = localStorage.getItem("premium_expiry");

      if (savedPremium && savedExpiry) {
        const expiryDate = new Date(savedExpiry);
        if (expiryDate > new Date()) {
          setIsPremium(true);
          setPremiumExpiry(expiryDate);
        } else {
          setIsPremium(false);
          setPremiumExpiry(null);
          localStorage.removeItem("premium_status");
          localStorage.removeItem("premium_expiry");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const setPremium = async (premium: boolean, expiry?: Date): Promise<boolean> => {
    if (!currentUserId) return false;

    try {
      // Update Firestore first
      const success = await updatePremiumStatus(currentUserId, premium, expiry);

      if (success) {
        // Update local state
        setIsPremium(premium);

        if (premium && expiry) {
          setPremiumExpiry(expiry);
          localStorage.setItem("premium_status", "true");
          localStorage.setItem("premium_expiry", expiry.toISOString());
        } else {
          setPremiumExpiry(null);
          localStorage.removeItem("premium_status");
          localStorage.removeItem("premium_expiry");
        }

        return true;
      }

      return false;
    } catch (error) {
      console.error("Error updating premium status:", error);
      return false;
    }
  };

  const checkPremiumStatus = (): boolean => {
    if (premiumExpiry && new Date() > premiumExpiry) {
      // Premium expired, sync with Firestore
      if (currentUserId) {
        updatePremiumStatus(currentUserId, false).then(() => {
          syncPremiumStatus();
        });
      }
      return false;
    }
    return isPremium;
  };

  return (
    <PremiumContext.Provider
      value={{
        isPremium,
        premiumExpiry,
        loading,
        setPremium,
        checkPremiumStatus,
        syncPremiumStatus,
      }}
    >
      {children}
    </PremiumContext.Provider>
  );
};
