import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { Button } from "../components/ui/button";

export default function GenderSelect() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingGender, setIsCheckingGender] = useState(true);

  // Check if gender already selected
  useEffect(() => {
    const checkGenderStatus = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate("/onboarding");
          return;
        }

        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          if (userData.gender && (userData.gender === 'male' || userData.gender === 'female')) {
            // Gender already selected, redirect to home
            navigate("/");
            return;
          }
        }
      } catch (error) {
        console.error("Error checking gender status:", error);
      } finally {
        setIsCheckingGender(false);
      }
    };

    checkGenderStatus();
  }, [navigate, auth]);

  const handleSelect = async (gender: string) => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No authenticated user found');
      }

      // Update gender in Firestore
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        gender: gender,
        updatedAt: new Date()
      });

      console.log('Gender updated in Firestore:', gender);
      navigate("/");
    } catch (error) {
      console.error("Error updating gender:", error);
      alert('Error saving gender selection. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingGender) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-pink-50 via-rose-100 to-fuchsia-100 px-4 py-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <p className="text-rose-600 font-medium">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-pink-50 via-rose-100 to-fuchsia-100 px-4 py-6">
      <div className="w-full max-w-xs bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
        <h2 className="text-xl font-bold text-rose-600 mb-4 text-center">Select Your Gender</h2>
        <div className="flex flex-col gap-4 w-full">
          <Button 
            className="w-full py-3 rounded-xl bg-rose-500 text-white font-bold text-base disabled:opacity-50" 
            onClick={() => handleSelect("female")}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Female'}
          </Button>
          <Button 
            className="w-full py-3 rounded-xl bg-blue-500 text-white font-bold text-base disabled:opacity-50" 
            onClick={() => handleSelect("male")}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Male'}
          </Button>

        </div>
      </div>
    </main>
  );
}
