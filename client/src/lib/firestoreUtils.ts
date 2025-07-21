// src/lib/firestoreUtils.ts
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import { auth, db } from "../firebaseConfig"; // ✅ Correct imports

/**
 * Ensure a Firestore user document exists after auth.
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
      coins: 100,
      createdAt: new Date(),
    });
    console.log(`✅ Created user doc for UID: ${user.uid}`);
  }
}

/**
 * Add coins to a user’s Firestore doc.
 */
export async function addCoins(userId: string, amount: number) {
  const userDocRef = doc(db, "users", userId);
  await updateDoc(userDocRef, {
    coins: increment(amount),
  });
  console.log(`✅ Added ${amount} coins to ${userId}`);
}

/**
 * Spend coins from a user’s Firestore doc.
 */
export async function spendCoins(userId: string, amount: number) {
  const userDocRef = doc(db, "users", userId);
  await updateDoc(userDocRef, {
    coins: increment(-amount),
  });
  console.log(`✅ Spent ${amount} coins from ${userId}`);
}
