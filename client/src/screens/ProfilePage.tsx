import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Pencil, 
  Camera, 
  ArrowLeft, 
  Copy, 
  Share2, 
  Crown, 
  Settings, 
  Shield, 
  Bell, 
  User, 
  Globe, 
  Database,
  HelpCircle,
  Plus,
  X,
  Star,
  Edit3,
  Check,
  Info
} from "lucide-react";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { uploadProfileImage } from "../lib/storageUtils";
import { getUserId } from "../lib/userUtils";
import { usePremium } from "../context/PremiumProvider";
import { useLanguage } from "../context/LanguageProvider";
import BottomNavBar from "../components/BottomNavBar";
import BannerAd from "../components/BannerAd";
import LanguageSelector from "../components/LanguageSelector";
import SettingsModal from "../components/SettingsModal";
import HelpSupportModal from "../components/HelpSupportModal";
import PremiumPaywall from "../components/PremiumPaywall";
import { TestTube } from "lucide-react";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [name, setName] = useState("V");
  const [age, setAge] = useState(22);
  const [editingName, setEditingName] = useState(false);
  const [bio, setBio] = useState("");
  const [editingBio, setEditingBio] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settingType, setSettingType] = useState<'privacy' | 'notifications' | 'account' | 'general' | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showPremiumPaywall, setShowPremiumPaywall] = useState(false);
  const [referralCount, setReferralCount] = useState(0);
  const [profileCompletion, setProfileCompletion] = useState(35);

  const { isPremium, setPremium } = usePremium();
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const additionalImageInputRef = useRef<HTMLInputElement>(null);
  const user = auth.currentUser;

  // Premium features data
  const premiumFeatures = [
    { name: "Get exclusive photo insights", premium: true, free: false },
    { name: "Fast track your likes", premium: true, free: false },
    { name: "Stand out every day", premium: true, free: false },
    { name: "Unlimited likes", premium: true, free: false },
    { name: "See who liked you", premium: true, free: false },
    { name: "Advanced filters", premium: true, free: false },
    { name: "Incognito mode", premium: true, free: false },
    { name: "Travel mode", premium: true, free: false },
    { name: "2 Compliments a week", premium: true, free: false },
    { name: "10 SuperSwipes a week", premium: true, free: false },
    { name: "2 Spotlights a week", premium: true, free: false },
    { name: "Unlimited Extends", premium: true, free: false },
    { name: "Unlimited Rematch", premium: true, free: false },
    { name: "Unlimited Backtrack", premium: true, free: false },
  ];

  const tabs = [
    { id: 'pay', label: 'Pay plan', active: true },
    { id: 'dating', label: 'Dating advice', active: false },
    { id: 'photo', label: 'Photo insights', active: false },
  ];

  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);

    // Real-time listener
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setName(data.username || data.name || "V");
        setAge(data.age || 22);
        setBio(data.bio || "");
        setProfileImage(data.profileImage || null);
        setAdditionalImages(data.additionalImages || []);
        setReferralCode(data.referralCode || generateReferralCode(user.uid));
        setReferralCount(data.referralCount || 0);
        
        // Calculate profile completion
        let completion = 0;
        if (data.username) completion += 20;
        if (data.profileImage) completion += 30;
        if (data.bio) completion += 25;
        if (data.age) completion += 15;
        if (data.additionalImages?.length > 0) completion += 10;
        setProfileCompletion(completion);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const generateReferralCode = (uid: string) => {
    return uid.slice(0, 6).toUpperCase();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploadingImage(true);
    setUploadProgress(0);

    try {
      const result = await uploadProfileImage(
        file,
        user.uid,
        (progress) => setUploadProgress(progress)
      );

      setProfileImage(result.url);

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        profileImage: result.url,
        profileImagePath: result.path,
        updatedAt: new Date()
      });

      console.log("Profile image uploaded successfully!!");
    } catch (error) {
      console.error("Error uploading profile image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
      setUploadProgress(0);
    }
  };

  const handlePremiumPurchase = (plan: string) => {
    const now = new Date();
    const expiry = new Date(now);
    if (plan === "weekly") {
      expiry.setDate(now.getDate() + 7);
    } else {
      expiry.setMonth(now.getMonth() + 1);
    }

    setPremium(true, expiry);
    setShowPremiumPaywall(false);
    alert(`🎉 Welcome to Premium! Your ${plan} subscription is now active!`);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-600 mb-4">Please log in first</h2>
          <Button onClick={() => navigate("/onboarding")} className="bg-blue-600 text-white">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        </div>
        <button
          onClick={() => navigate('/profile')}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Settings size={24} className="text-gray-700" />
        </button>
      </div>

      <div className="max-w-md mx-auto">
        {/* Profile Section */}
        <div className="bg-white px-6 py-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-400 to-purple-500">
                    <span className="text-white text-2xl font-bold">{name.charAt(0)}</span>
                  </div>
                )}
              </div>
              
              {/* Profile completion percentage */}
              <div className="absolute -bottom-2 -right-2 bg-black text-white text-xs px-2 py-1 rounded-full font-medium">
                {profileCompletion}%
              </div>
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-white border-2 border-gray-200 rounded-full p-1 hover:bg-gray-50 transition-colors"
                disabled={uploadingImage}
              >
                <Camera size={12} className="text-gray-600" />
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
            
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{name}, {age}</h2>
              <button className="mt-2 px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Complete profile
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  tab.active
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-yellow-100 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-800" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Spotlight</h3>
                <p className="text-sm text-gray-600">Stand out</p>
              </div>
            </div>
            
            <div className="bg-yellow-100 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-800" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">SuperSwipe</h3>
                <p className="text-sm text-gray-600">Get noticed</p>
              </div>
            </div>
          </div>

          {/* Premium Card */}
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl p-6 text-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Premium+</h3>
            <p className="text-gray-800 mb-4 text-sm leading-relaxed">
              Get the VIP treatment, and enjoy better ways to connect with incredible people.
            </p>
            <button
              onClick={() => setShowPremiumPaywall(true)}
              className="bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
            >
              Explore Premium+
            </button>
          </div>

          {/* Features Comparison */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">What you get:</h3>
              <div className="flex gap-8">
                <span className="text-sm font-semibold text-gray-900">Premium+</span>
                <span className="text-sm font-semibold text-gray-400">Premium</span>
              </div>
            </div>

            <div className="space-y-4">
              {premiumFeatures.slice(0, 3).map((feature, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-900 text-sm">{feature.name}</span>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex gap-8">
                    <div className="w-6 flex justify-center">
                      {feature.premium && <Check className="w-5 h-5 text-green-600" />}
                    </div>
                    <div className="w-6 flex justify-center">
                      {feature.free && <Check className="w-5 h-5 text-green-600" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* All Features List (when not premium) */}
        {!isPremium && (
          <div className="bg-white px-6 py-6 border-t border-gray-100">
            <div className="space-y-4">
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-900 text-sm">{feature.name}</span>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex gap-8">
                    <div className="w-6 flex justify-center">
                      {feature.premium && <Check className="w-5 h-5 text-green-600" />}
                    </div>
                    <div className="w-6 flex justify-center">
                      {feature.free ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-md mx-auto px-6 py-3">
          <div className="flex justify-around">
            <button className="flex flex-col items-center gap-1">
              <div className="w-6 h-6 bg-black rounded-full"></div>
              <span className="text-xs font-medium text-gray-900">Profile</span>
            </button>
            <button 
              onClick={() => navigate('/')}
              className="flex flex-col items-center gap-1"
            >
              <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
              <span className="text-xs text-gray-500">Discover</span>
            </button>
            <button 
              onClick={() => navigate('/friends')}
              className="flex flex-col items-center gap-1"
            >
              <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
              <span className="text-xs text-gray-500">People</span>
            </button>
            <button 
              onClick={() => navigate('/chat')}
              className="flex flex-col items-center gap-1"
            >
              <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
              <span className="text-xs text-gray-500">Liked You</span>
            </button>
            <button 
              onClick={() => navigate('/chat')}
              className="flex flex-col items-center gap-1"
            >
              <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
              <span className="text-xs text-gray-500">Chats</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <LanguageSelector
        isOpen={showLanguageSelector}
        onClose={() => setShowLanguageSelector(false)}
      />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        settingType={settingType}
      />

      <HelpSupportModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />

      <PremiumPaywall
        isOpen={showPremiumPaywall}
        onClose={() => setShowPremiumPaywall(false)}
        onPurchase={handlePremiumPurchase}
      />
    </div>
  );
}