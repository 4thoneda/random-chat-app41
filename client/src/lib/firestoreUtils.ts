import { auth } from "../firebaseConfig"; // Adjust if needed

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
      coins: 100, // Optional: give default coins on signup
      createdAt: new Date(),
    });

    console.log(`Created new user doc for UID: ${user.uid}`);
  }
}
