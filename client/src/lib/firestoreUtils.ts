import {
  doc,
  getDoc,
  updateDoc,
  increment,
  runTransaction,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig"; // ✅ keep using your existing import path

// ==========================
// 🪙 COIN MANAGEMENT FUNCTIONS
// ==========================

export async function getCoins(uid: string): Promise<number> {
  try {
    const userDocRef = doc(db, "users", uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      return userData.coins || 0;
    } else {
      console.warn(`User document not found for uid: ${uid}`);
      return 0;
    }
  } catch (error) {
    console.error("Error getting coins:", error);
    throw new Error("Failed to fetch coin balance");
  }
}

export async function addCoins(uid: string, amount: number): Promise<number> {
  if (amount <= 0) {
    throw new Error("Amount must be positive");
  }

  try {
    const userDocRef = doc(db, "users", uid);
    const newBalance = await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userDocRef);
      if (!userDoc.exists()) throw new Error("User document not found");

      const currentCoins = userDoc.data().coins || 0;
      const newCoins = currentCoins + amount;

      transaction.update(userDocRef, {
        coins: newCoins,
        updatedAt: new Date(),
      });

      return newCoins;
    });

    console.log(`Added ${amount} coins to user ${uid}. New balance: ${newBalance}`);
    return newBalance;
  } catch (error) {
    console.error("Error adding coins:", error);
    throw new Error("Failed to add coins");
  }
}

export async function spendCoins(
  uid: string,
  amount: number
): Promise<{
  success: boolean;
  newBalance: number;
  message: string;
}> {
  if (amount <= 0) {
    return {
      success: false,
      newBalance: 0,
      message: "Amount must be positive",
    };
  }

  try {
    const userDocRef = doc(db, "users", uid);

    const result = await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userDocRef);

      if (!userDoc.exists()) {
        return {
          success: false,
          newBalance: 0,
          message: "User document not found",
        };
      }

      const currentCoins = userDoc.data().coins || 0;

      if (currentCoins < amount) {
        return {
          success: false,
          newBalance: currentCoins,
          message: `Insufficient coins. You have ${currentCoins} coins but need ${amount}`,
        };
      }

      const newCoins = currentCoins - amount;

      transaction.update(userDocRef, {
        coins: newCoins,
        updatedAt: new Date(),
      });

      return {
        success: true,
        newBalance: newCoins,
        message: `Successfully spent ${amount} coins`,
      };
    });

    if (result.success) {
      console.log(`Spent ${amount} coins for user ${uid}. New balance: ${result.newBalance}`);
    } else {
      console.warn(`Failed to spend coins for user ${uid}: ${result.message}`);
    }

    return result;
  } catch (error) {
    console.error("Error spending coins:", error);
    return {
      success: false,
      newBalance: 0,
      message: "Failed to spend coins due to an error",
    };
  }
}

export async function initializeCoins(uid: string): Promise<number> {
  try {
    const userDocRef = doc(db, "users", uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();

      if (userData.coins === undefined) {
        await updateDoc(userDocRef, {
          coins: 100,
          updatedAt: new Date(),
        });
        console.log(`Initialized coins to 100 for user ${uid}`);
        return 100;
      }

      return userData.coins;
    } else {
      await setDoc(userDocRef, {
        coins: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`Created user document with 100 coins for user ${uid}`);
      return 100;
    }
  } catch (error) {
    console.error("Error initializing coins:", error);
    throw new Error("Failed to initialize coins");
  }
}

// ==========================
// 👤 USER PROFILE FUNCTIONS
// ==========================

// Save referral code for a user
export async function saveReferralCode(uid: string, referralCode: string) {
  const userDocRef = doc(db, "users", uid);
  await setDoc(userDocRef, { referralCode }, { merge: true });
}

// Get full user profile data
export async function getUserProfile(uid: string) {
  const userDocRef = doc(db, "users", uid);
  const snap = await getDoc(userDocRef);
  return snap.exists() ? snap.data() : null;
}

// Update user name and/or profile picture
export async function updateUserProfile(
  uid: string,
  data: { name?: string; photoURL?: string }
) {
  const userDocRef = doc(db, "users", uid);
  await setDoc(userDocRef, data, { merge: true });
}
