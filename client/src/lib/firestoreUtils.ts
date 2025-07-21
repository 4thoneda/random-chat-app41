import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import { auth } from "../firebaseConfig";
import { db } from "../firebaseConfig"; // Ensure this is exported from firebaseConfig.ts

/**
 * Ensures a Firestore user document exists after authentication.
 * Creates one if it doesn't exist.
 */
export async function ensureUserDocumentExists() {
  const user = auth.currentUser;
  if (!user) return;

  const userDocRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(userDocRef);

  if (!docSnap.exists()) {
    const referralCode = user.uid.slice(0, 6).toUpperCase();
    await setDoc(userDocRef, {
      name: "Mystery Person",
      profileImage: "",
      referralCode,
      coins: 100, // Optional: default coin balance
      createdAt: new Date(),
    });

    console.log(`Created new user doc for UID: ${user.uid}`);
  }
}

/**
 * Adds or subtracts coins to/from a user's account.
 * @param userId UID of the user
 * @param amount Number of coins to add (negative to subtract)
 */
export async function addCoins(userId: string, amount: number) {
  const userDocRef = doc(db, "users", userId);
  await updateDoc(userDocRef, {
    coins: increment(amount),
  });
}
