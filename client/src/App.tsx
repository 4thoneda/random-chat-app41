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
import { ensureUserDocumentExists } from "./lib/firestoreUtils"; // ✅

import {
  ensureUserDocumentExists,
  addCoins,
  spendCoins,
} from "./lib/firestoreUtils";


function App() {
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // ✅ Make sure Firestore doc exists for logged-in user
        ensureUserDocumentExists(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/onboarding" element={<OnboardingScreen />} />
        <Route path="/user-setup" element={<UserSetup />} />
        <Route path="/premium-trial" element={<ReferToUnlock />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/gender-select" element={<GenderSelect />} />
        <Route path="/video-chat" element={<VideoChat />} />
        <Route path="/voice" element={<VoicePage />} />
        <Route path="/personal-chat" element={<PersonalChat />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/refer" element={<ReferToUnlock />} />
        <Route path="/referral-code" element={<ReferralCodeScreen />} />
        <Route path="/ai-chatbot" element={<AIChatbotPage />} />
        <Route path="/spin-wheel" element={<SpinWheel />} />
        <Route path="/storage-debug" element={<StorageDebugPage />} />
        <Route path="/firebase-debug" element={<FirebaseDebugPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>

      <PWAInstallPrompt />
    </div>
  );
}

export default App;
