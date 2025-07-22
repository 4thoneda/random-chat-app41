import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  HelpCircle
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
  const [name, setName] = useState("Mystery Person");
  const [editingName, setEditingName] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
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

  const { isPremium, setPremium } = usePremium();
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);

    // Real-time listener
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setName(data.username || data.name || "Mystery Person");
        setProfileImage(data.profileImage || null);
        setReferralCode(data.referralCode || generateReferralCode(user.uid));
        setReferralCount(data.referralCount || 0);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const generateReferralCode = (uid: string) => {
    return uid.slice(0, 6).toUpperCase(); // e.g. A1B2C3
  };

  const handleNameEdit = () => {
    setEditingName(true);
  };

  const handleNameSave = async () => {
    setEditingName(false);
    if (user) {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        username: name,
        updatedAt: new Date()
      });
    }
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

      console.log("Profile image uploaded successfully");
    } catch (error) {
      console.error("Error uploading profile image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
      setUploadProgress(0);
    }
  };

  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    alert("Referral code copied to clipboard!");
  };

  const handleShareReferralCode = () => {
    const shareText = `Join me on AjnabiCam! Use my referral code: ${referralCode} to get 12 hours of Premium FREE! Download: https://ajnabicam.com`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Join AjnabiCam',
        text: shareText,
        url: 'https://ajnabicam.com'
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(shareText);
      alert("Referral message copied to clipboard! Share it with your friends.");
    }
  };

  const handleSettingsClick = (type: 'privacy' | 'notifications' | 'account' | 'general') => {
    setSettingType(type);
    setShowSettingsModal(true);
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

  // Check if user has successfully referred someone (simulate for now)
  const checkReferralSuccess = () => {
    // In a real app, this would check if the referred user has signed up and completed onboarding
    // For now, we'll simulate this by checking if they've shared their code
    const hasShared = localStorage.getItem(`ajnabicam_shared_referral_${user?.uid}`);
    return hasShared === 'true';
  };

  const handleReferralReward = async () => {
    if (!user) return;

    try {
      // Mark as shared
      localStorage.setItem(`ajnabicam_shared_referral_${user.uid}`, 'true');
      
      // Grant 12 hours of premium
      const now = new Date();
      const expiry = new Date(now.getTime() + 12 * 60 * 60 * 1000); // 12 hours
      
      setPremium(true, expiry);
      
      // Update referral count in Firestore
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        referralCount: referralCount + 1,
        lastReferralReward: new Date(),
        updatedAt: new Date()
      });

      alert("🎉 Congratulations! You've earned 12 hours of Premium FREE for referring a friend!");
    } catch (error) {
      console.error("Error processing referral reward:", error);
      alert("Error processing referral reward. Please try again.");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-peach-25 via-cream-50 to-blush-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-coral-600 mb-4">Please log in first</h2>
          <Button onClick={() => navigate("/onboarding")} className="bg-coral-600 text-white">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-peach-25 via-cream-50 to-blush-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral-500 mx-auto mb-4"></div>
          <p className="text-coral-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-peach-25 via-cream-50 to-blush-50 pb-20">
      {/* Header with Back Button */}
      <div className="bg-gradient-to-r from-peach-400 via-coral-400 to-blush-500 text-white p-6 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5"></div>
        <div className="relative z-10 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">{t('profile.title')}</h1>
            <p className="text-sm text-peach-100">Manage your account and preferences</p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-6 space-y-6">


        {/* Profile Card */}
        <Card className="romantic-card shadow-xl">
          <CardHeader className="text-center">
            <div className="relative mx-auto mb-4">
              <div className="jewelry-frame">
                <img
                  src={
                    profileImage ||
                    "https://api.dicebear.com/7.x/thumbs/svg?seed=user"
                  }
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                className="absolute bottom-1 right-1 bg-coral-500 hover:bg-coral-600 text-white rounded-full shadow-lg"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
              >
                <Camera size={16} />
              </Button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />

              {uploadingImage && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-xs mb-1">{Math.round(uploadProgress)}%</div>
                    <div className="w-16 h-1 bg-white/30 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="text-center">
              {editingName ? (
                <div className="flex items-center justify-center gap-2">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border-b border-coral-300 focus:outline-none focus:border-coral-500 px-2 text-lg text-center bg-transparent"
                    autoFocus
                    maxLength={20}
                  />
                  <Button size="sm" onClick={handleNameSave} className="bg-coral-500 text-white">
                    Save
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <h2 className="text-xl font-semibold text-coral-800">
                    {name}
                  </h2>
                  <Button variant="ghost" size="icon" onClick={handleNameEdit}>
                    <Pencil size={16} className="text-coral-600" />
                  </Button>
                </div>
              )}
              <p className="text-sm text-gray-600 mt-1">{t('profile.addPhoto')}</p>
            </div>
          </CardHeader>
        </Card>

        {/* Referral Rewards Card */}
        <Card className="romantic-card shadow-xl border-2 border-green-300">
          <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
            <h3 className="text-lg font-bold text-center">{t('profile.referral.title')}</h3>
            <div className="text-center mt-2">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
                <span className="text-sm font-medium">Successful Referrals: {referralCount}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <div className="text-center mb-3">
                <h4 className="font-semibold text-green-800 mb-1">{t('profile.referral.id')}</h4>
                <div className="bg-white border-2 border-green-300 rounded-lg px-4 py-3 font-mono text-lg font-bold text-green-700 select-all">
                  {referralCode}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleCopyReferralCode}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  {t('profile.referral.copy')}
                </Button>
                <Button
                  onClick={handleShareReferralCode}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Referral Reward Section */}
            <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-xl p-4 border border-orange-200">
              <div className="text-center">
                <div className="text-2xl mb-2">🎁</div>
                <h4 className="font-bold text-orange-800 mb-2">
                  Refer 1 Friend = 12 Hours FREE Premium!
                </h4>
                <p className="text-sm text-orange-700 mb-4">
                  {t('profile.referral.share')}
                </p>
                
                {checkReferralSuccess() ? (
                  <Button
                    onClick={handleReferralReward}
                    className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold py-3"
                  >
                    🎉 Claim 12 Hours Premium!
                  </Button>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-orange-600 mb-2">
                      Share your code to unlock the reward!
                    </p>
                    <Button
                      onClick={() => {
                        handleShareReferralCode();
                        // Simulate successful referral after sharing
                        setTimeout(() => {
                          localStorage.setItem(`ajnabicam_shared_referral_${user.uid}`, 'true');
                          alert("🎉 Referral shared! You can now claim your 12 hours of Premium!");
                        }, 2000);
                      }}
                      className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3"
                    >
                      📱 Share & Unlock Reward
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs text-green-600 leading-relaxed">
                💡 <strong>How it works:</strong> Share your referral code with friends. 
                When they sign up and complete their first video call, you both get premium benefits!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Settings Card */}
        <Card className="romantic-card shadow-xl">
          <CardHeader>
            <h3 className="text-lg font-bold text-coral-800 text-center flex items-center justify-center gap-2">
              <Settings className="h-5 w-5" />
              {t('profile.settings')}
            </h3>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={() => handleSettingsClick('privacy')}
              variant="outline"
              className="w-full justify-start text-left p-4 h-auto border-peach-200 hover:bg-peach-50"
            >
              <Shield className="h-5 w-5 mr-3 text-blue-600" />
              <div>
                <div className="font-medium">{t('profile.settings.privacy')}</div>
                <div className="text-sm text-gray-500">Control who can see your information</div>
              </div>
            </Button>

            <Button
              onClick={() => handleSettingsClick('notifications')}
              variant="outline"
              className="w-full justify-start text-left p-4 h-auto border-peach-200 hover:bg-peach-50"
            >
              <Bell className="h-5 w-5 mr-3 text-purple-600" />
              <div>
                <div className="font-medium">{t('profile.settings.notifications')}</div>
                <div className="text-sm text-gray-500">Manage your notification preferences</div>
              </div>
            </Button>

            <Button
              onClick={() => handleSettingsClick('account')}
              variant="outline"
              className="w-full justify-start text-left p-4 h-auto border-peach-200 hover:bg-peach-50"
            >
              <User className="h-5 w-5 mr-3 text-red-600" />
              <div>
                <div className="font-medium">{t('profile.settings.account')}</div>
                <div className="text-sm text-gray-500">Account security and data management</div>
              </div>
            </Button>

            <Button
              onClick={() => setShowLanguageSelector(true)}
              variant="outline"
              className="w-full justify-start text-left p-4 h-auto border-peach-200 hover:bg-peach-50"
            >
              <Globe className="h-5 w-5 mr-3 text-green-600" />
              <div>
                <div className="font-medium">{t('profile.settings.language')}</div>
                <div className="text-sm text-gray-500">Change app language</div>
              </div>
            </Button>

            <Button
              onClick={() => navigate('/storage-debug')}
              variant="outline"
              className="w-full justify-start text-left p-4 h-auto border-peach-200 hover:bg-peach-50"
            >
              <Database className="h-5 w-5 mr-3 text-indigo-600" />
              <div>
                <div className="font-medium">Storage Debug</div>
                <div className="text-sm text-gray-500">Test Firebase Storage connection</div>
              </div>
            </Button>

            <Button
              onClick={() => navigate('/ad-testing')}
              variant="outline"
              className="w-full justify-start text-left p-4 h-auto border-peach-200 hover:bg-peach-50"
            >
              <TestTube className="h-5 w-5 mr-3 text-green-600" />
              <div>
                <div className="font-medium">AdMob Testing</div>
                <div className="text-sm text-gray-500">Test mobile ads functionality</div>
              </div>
            </Button>

            <Button
              onClick={() => setShowHelpModal(true)}
              variant="outline"
              className="w-full justify-start text-left p-4 h-auto border-peach-200 hover:bg-peach-50"
            >
              <HelpCircle className="h-5 w-5 mr-3 text-orange-600" />
              <div>
                <div className="font-medium">Help & Support</div>
                <div className="text-sm text-gray-500">Get help and contact support</div>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* Premium Upgrade Card - Only for non-premium users */}
        {!isPremium && (
          <Card className="romantic-card border-2 border-coral-300 shadow-xl">
            <CardHeader className="text-center bg-gradient-to-r from-coral-500 to-peach-600 text-white rounded-t-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Crown className="h-6 w-6 text-yellow-300" />
                <h2 className="text-xl font-bold">{t('profile.premium.upgrade')}</h2>
              </div>
              <p className="text-coral-100 mb-4">{t('profile.premium.unlock')}</p>
              <div className="space-y-2 text-sm">
                <p>{t('profile.premium.features.gender')}</p>
                <p>{t('profile.premium.features.voice')}</p>
                <p>{t('profile.premium.features.unlimited')}</p>
              </div>
              <Button
                onClick={() => setShowPremiumPaywall(true)}
                className="mt-4 bg-white text-coral-600 hover:bg-gray-100 font-bold"
              >
                <Crown className="h-4 w-4 mr-2" />
                Upgrade Now
              </Button>
            </CardHeader>
          </Card>
        )}

        {/* Premium Status Card - Only for premium users */}
        {isPremium && (
          <Card className="romantic-card border-2 border-cream-300 shadow-xl">
            <CardHeader className="text-center bg-gradient-to-r from-cream-500 to-peach-600 text-white rounded-t-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Crown className="h-6 w-6 text-yellow-300" />
                <h2 className="text-xl font-bold">{t('profile.premium.active')}</h2>
              </div>
              <p className="text-cream-100">{t('profile.premium.enjoying')}</p>
            </CardHeader>
          </Card>
        )}

        {/* Banner Ad at Bottom - Only for non-premium users */}
        {!isPremium && (
          <div className="mt-6">
            <BannerAd
              size="responsive"
              position="bottom"
              className="shadow-lg rounded-xl overflow-hidden"
            />
          </div>
        )}
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

      <BottomNavBar />
    </div>
  );
}
