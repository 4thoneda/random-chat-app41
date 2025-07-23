import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Camera, 
  ArrowLeft, 
  MapPin, 
  Briefcase, 
  Eye, 
  Star, 
  Edit3, 
  Settings,
  Crown,
  Heart,
  Users,
  MessageCircle,
  Calendar,
  Coffee,
  Music,
  Book,
  Plane,
  Camera as CameraIcon,
  Plus
} from "lucide-react";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  increment
} from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { uploadProfileImage } from "../lib/storageUtils";
import { usePremium } from "../context/PremiumProvider";
import { useCoin } from "../context/CoinProvider";
import BottomNavBar from "../components/BottomNavBar";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [name, setName] = useState("Love");
  const [age, setAge] = useState(25);
  const [location, setLocation] = useState("Beverly Hills, CA");
  const [profession, setProfession] = useState("Model & Influencer");
  const [bio, setBio] = useState("Life is an adventure, let's explore it together! ✨");
  const [interests, setInterests] = useState(["Often", "Sociale drinker", "Never", "Pisces"]);
  const [profileImage, setProfileImage] = useState<string | null>("https://cdn.builder.io/api/v1/image/assets%2Fe142673ab78f4d70a642f0b5825a4793%2F9ca3a7221ed04dfaaa8b4de10c2f495e?format=webp&width=800");
  const [profileViews, setProfileViews] = useState(247);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { isPremium } = usePremium();
  const { coins } = useCoin();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);

    // Real-time listener
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setName(data.username || data.name || "Love");
        setAge(data.age || 25);
        setLocation(data.location || "Beverly Hills, CA");
        setProfession(data.profession || "Model & Influencer");
        setBio(data.bio || "Life is an adventure, let's explore it together! ✨");
        setInterests(data.interests || ["Often", "Sociale drinker", "Never", "Pisces"]);
        if (data.profileImage) {
          setProfileImage(data.profileImage);
        }
        setProfileViews(data.profileViews || Math.floor(Math.random() * 300) + 100);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Increment profile views for the current user (simulate views)
  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        const userRef = doc(db, "users", user.uid);
        updateDoc(userRef, {
          profileViews: increment(1)
        }).catch(() => {
          // Silently fail if document doesn't exist
        });
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [user]);

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

      console.log("Profile image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading profile image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
      setUploadProgress(0);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-passion-50 via-romance-25 to-bollywood-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-600 mb-4">Please log in first</h2>
          <Button onClick={() => navigate("/onboarding")} className="bg-romance-500 text-white">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-passion-50 via-romance-25 to-bollywood-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-romance-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100 sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        
        <h1 className="text-lg font-semibold text-gray-900">Profile</h1>
        
        <button
          onClick={() => navigate('/premium')}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Settings size={24} className="text-gray-700" />
        </button>
      </div>

      <div className="max-w-sm mx-auto px-4 py-6">
        {/* Profile Image Section */}
        <Card className="bg-white shadow-xl border-0 overflow-hidden mb-6 relative">
          <div className="relative h-[50vh] overflow-hidden">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-romance-200 via-passion-200 to-royal-200 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-bold">{name.charAt(0)}</span>
                  </div>
                  <p className="text-white/80">Tap to add photo</p>
                </div>
              </div>
            )}

            {/* Upload overlay */}
            {uploadingImage && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                  <p className="text-sm">Uploading... {uploadProgress}%</p>
                </div>
              </div>
            )}

            {/* Camera button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute top-4 right-4 bg-black/20 backdrop-blur-sm p-2 rounded-full hover:bg-black/30 transition-colors"
              disabled={uploadingImage}
            >
              <Camera size={18} className="text-white" />
            </button>

            {/* Profile Views Badge */}
            <div className="absolute top-4 left-4 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2">
              <Eye size={14} className="text-white" />
              <span className="text-white text-sm font-medium">{profileViews.toLocaleString()}</span>
            </div>

            {/* Premium Badge */}
            {isPremium && (
              <div className="absolute top-14 left-4 bg-gradient-to-r from-yellow-400 to-yellow-500 px-2 py-1 rounded-full flex items-center gap-1">
                <Crown className="w-3 h-3 text-yellow-800" />
                <span className="text-yellow-800 text-xs font-bold">PREMIUM</span>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </Card>

        {/* User Information Section */}
        <Card className="bg-white shadow-lg border-0 mb-6">
          <CardContent className="p-6">
            {/* Name and Age */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-gray-900 text-3xl font-bold mb-1">{name}, {age}</h2>
                <div className="flex items-center gap-2 text-gray-600 mb-3">
                  <MapPin size={16} />
                  <span className="text-sm">{location}</span>
                </div>
              </div>

              <button className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors">
                <Edit3 size={16} className="text-gray-600" />
              </button>
            </div>

            {/* Bio */}
            <p className="text-gray-700 text-sm leading-relaxed mb-4">{bio}</p>

            {/* Profession */}
            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <Briefcase size={16} />
              <span className="text-sm font-medium">{profession}</span>
            </div>

            {/* Interest Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {interests.map((interest, index) => (
                <span
                  key={index}
                  className="bg-gray-100 px-3 py-1 text-gray-700 text-xs font-medium"
                >
                  {interest}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  // Edit profile functionality
                  alert('Edit profile feature coming soon!');
                }}
                className="flex-1 bg-gradient-to-r from-romance-500 to-passion-500 hover:from-romance-600 hover:to-passion-600 text-white font-semibold py-3 border-0"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>

              <Button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'My Profile',
                      text: `Check out my profile on AjnabiCam!`,
                      url: window.location.href
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Profile link copied to clipboard!');
                  }
                }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-3 border-0"
              >
                <Users className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Profile Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="bg-white shadow-sm border-0 rounded-2xl">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-lg font-bold text-gray-800">{profileViews}</div>
              <div className="text-xs text-gray-500">Views</div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-0 rounded-2xl">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-lg font-bold text-gray-800">23</div>
              <div className="text-xs text-gray-500">Friends</div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-0 rounded-2xl">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="text-lg font-bold text-gray-800">{coins}</div>
              <div className="text-xs text-gray-500">Coins</div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Actions */}
        <div className="space-y-3">
          <Button
            onClick={() => navigate('/premium')}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-yellow-900 font-semibold py-4 rounded-2xl"
          >
            <Crown className="w-5 h-5 mr-2" />
            Upgrade to Premium
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => navigate('/chat')}
              variant="outline"
              className="py-3 rounded-xl border-gray-200 hover:bg-gray-50"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Messages
            </Button>
            
            <Button
              onClick={() => navigate('/')}
              variant="outline" 
              className="py-3 rounded-xl border-gray-200 hover:bg-gray-50"
            >
              <Users className="w-4 h-4 mr-2" />
              Discover
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
}
