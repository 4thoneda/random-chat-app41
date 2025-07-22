import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  Timestamp
} from "firebase/firestore";
import { db } from "../firebaseConfig";

// Types for user data
export interface UserProfile {
  userId: string;
  username: string;
  email?: string;
  profileImage?: string;
  gender: 'male' | 'female' | 'other';
  language: string;
  bio?: string;
  age?: number;
  location?: string;
  interests?: string[];
  isPremium: boolean;
  premiumExpiry?: Timestamp;
  coins: number;
  totalCoinsEarned: number;
  totalCoinsSpent: number;
  friendsCount: number;
  totalMatches: number;
  totalChatTime: number;
  lastSeen: Timestamp;
  isOnline: boolean;
  joinDate: Timestamp;
  onboardingComplete: boolean;
  settings: {
    notifications: boolean;
    soundEnabled: boolean;
    cameraEnabled: boolean;
    micEnabled: boolean;
    autoMatch: boolean;
    genderFilter?: 'male' | 'female' | 'all';
  };
  reportCount: number;
  isBlocked: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Ensure user document exists in Firestore with comprehensive profile
 */
export async function ensureUserDocumentExists(userId: string, initialData?: Partial<UserProfile>): Promise<void> {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      // Create new user document with comprehensive default values
      const defaultUserProfile: UserProfile = {
        userId,
        username: initialData?.username || `User${Math.floor(Math.random() * 10000)}`,
        gender: initialData?.gender || 'male',
        language: initialData?.language || 'en',
        isPremium: false,
        coins: 100, // Starting coins
        totalCoinsEarned: 100,
        totalCoinsSpent: 0,
        friendsCount: 0,
        totalMatches: 0,
        totalChatTime: 0,
        lastSeen: serverTimestamp() as Timestamp,
        isOnline: true,
        joinDate: serverTimestamp() as Timestamp,
        onboardingComplete: false,
        settings: {
          notifications: true,
          soundEnabled: true,
          cameraEnabled: true,
          micEnabled: true,
          autoMatch: true,
          genderFilter: 'all'
        },
        reportCount: 0,
        isBlocked: false,
        createdAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp,
        ...initialData
      };

      await setDoc(userDocRef, defaultUserProfile);
      console.log("✅ Comprehensive user document created for:", userId);
    } else {
      // Update lastSeen and online status for existing users
      await updateDoc(userDocRef, {
        lastSeen: serverTimestamp(),
        isOnline: true,
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error("❌ Error ensuring user document exists:", error);
    throw error;
  }
}

/**
 * Get user's coin balance
 */
export async function getCoins(userId: string): Promise<number> {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      return userData.coins || 0;
    }

    return 0;
  } catch (error) {
    console.error("❌ Error getting coins:", error);
    return 0;
  }
}

/**
 * Add coins to user's balance
 */
export async function addCoins(userId: string, amount: number): Promise<void> {
  try {
    const userDocRef = doc(db, "users", userId);
    
    // Ensure user document exists first
    await ensureUserDocumentExists(userId);
    
    // Add coins using Firestore increment
    await updateDoc(userDocRef, {
      coins: increment(amount),
      updatedAt: new Date()
    });

    console.log(`✅ Added ${amount} coins to user ${userId}`);
  } catch (error) {
    console.error("❌ Error adding coins:", error);
    throw error;
  }
}

/**
 * Spend coins from user's balance
 */
export async function spendCoins(userId: string, amount: number): Promise<{ success: boolean; message: string }> {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      return { success: false, message: "User not found" };
    }

    const userData = userDocSnap.data();
    const currentCoins = userData.coins || 0;

    if (currentCoins < amount) {
      return { success: false, message: "Insufficient coins" };
    }

    // Deduct coins
    await updateDoc(userDocRef, {
      coins: increment(-amount),
      updatedAt: new Date()
    });

    console.log(`✅ Spent ${amount} coins for user ${userId}`);
    return { success: true, message: "Coins spent successfully" };
  } catch (error) {
    console.error("❌ Error spending coins:", error);
    return { success: false, message: "Error spending coins" };
  }
}
