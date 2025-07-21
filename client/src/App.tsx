import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import VideoChat from "./screens/VideoChat";
import SplashScreen from "./components/SplashScreen";
import OnboardingScreen from "./screens/OnboardingScreen";
import ReferToUnlock from "./screens/ReferToUnlock";
import ReferralCodeScreen from "./screens/ReferralCode";
import GenderSelect from "./screens/GenderSelect";
import ChatPage from "./screens/ChatPage";
import VoicePage from "./screens/VoicePage";
import HomePage from "./screens/HomePage";
import ProfilePage from "./screens/ProfilePage";
import StorageDebugPage from "./screens/StorageDebugPage";
import FirebaseDebugPage from "./screens/FirebaseDebugPage";
import UserSetup from "./screens/UserSetup";
import PersonalChat from "./screens/PersonalChat";
import FriendsPage from "./screens/FriendsPage";
import AIChatbotPage from "./screens/AIChatbotPage";
import SpinWheel from "./components/SpinWheel";
import PWAInstallPrompt from "./components/PWAInstallPrompt";

import { useNavigate } from "react-router-dom";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { ensureUserDocumentExists } from "./lib/firestoreUtils"; // Adjust path if needed

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();

  console.log("App component rendered, showSplash:", showSplash);

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("Hiding splash screen");
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // ✅ Move this one here
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        ensureUserDocumentExists();
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSplashComplete = () => {
    console.log("Splash screen completed, setting showSplash to false");
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div>
      <Routes>
        {/* all your routes are good here */}
      </Routes>

      <PWAInstallPrompt />
    </div>
  );
}

export default App;
