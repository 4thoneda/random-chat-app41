import { useEffect, useRef, useCallback } from 'react';

interface UseDailyBonusNotificationProps {
  canClaimDailyBonus: boolean;
  currentUser: string | null;
  hasCompletedOnboarding: boolean;
  showBonusNotification: (title: string, message: string, action: () => void) => void;
  claimDailyBonus: () => Promise<boolean>;
}

export const useDailyBonusNotification = ({
  canClaimDailyBonus,
  currentUser,
  hasCompletedOnboarding,
  showBonusNotification,
  claimDailyBonus,
}: UseDailyBonusNotificationProps) => {
  const hasTriggeredToday = useRef(false);
  const lastCheckDate = useRef<string>('');
  const functionsRef = useRef({ showBonusNotification, claimDailyBonus });

  // Update function refs when they change
  useEffect(() => {
    functionsRef.current = { showBonusNotification, claimDailyBonus };
  }, [showBonusNotification, claimDailyBonus]);

  useEffect(() => {
    const today = new Date().toDateString();

    // Reset the trigger flag if it's a new day
    if (lastCheckDate.current !== today) {
      hasTriggeredToday.current = false;
      lastCheckDate.current = today;
    }

    // Only proceed if all conditions are met and we haven't triggered today
    if (!canClaimDailyBonus ||
        !currentUser ||
        !hasCompletedOnboarding ||
        hasTriggeredToday.current) {
      return;
    }

    const sessionKey = `daily_bonus_shown_${today}`;
    const hasShownToday = sessionStorage.getItem(sessionKey);

    if (!hasShownToday) {
      // Mark as triggered for this session
      hasTriggeredToday.current = true;
      sessionStorage.setItem(sessionKey, "true");

      // Show notification after a delay using ref to avoid dependency issues
      const timeoutId = setTimeout(() => {
        functionsRef.current.showBonusNotification(
          "🎁 Daily Bonus Available!",
          "Claim your 5 coins now and keep your streak going!",
          functionsRef.current.claimDailyBonus,
        );
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [canClaimDailyBonus, currentUser, hasCompletedOnboarding]); // Only include stable values
};
