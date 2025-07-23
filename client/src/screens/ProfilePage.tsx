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
  Trophy,
  Gift,
  Sparkles
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
  const [name, setName] = useState("Anonymous");
  const [age, setAge] = useState(22);
  const [location, setLocation] = useState("Mumbai, India");
  const [profession, setProfession] = useState("Designer");
  const [bio, setBio] = useState("Living life to the fullest! 🌟");
  const [statusMessage, setStatusMessage] = useState("Ready to make new connections");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileViews, setProfileViews] = useState(147);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");

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
        setName(data.username || data.name || "Anonymous");
        setAge(data.age || 22);
        setLocation(data.location || "Mumbai, India");
        setProfession(data.profession || "Designer");
        setBio(data.bio || "Living life to the fullest! 🌟");
        setStatusMessage(data.statusMessage || "Ready to make new connections");
        setProfileImage(data.profileImage || null);
        setProfileViews(data.profileViews || Math.floor(Math.random() * 200) + 50);
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

  const handleEditField = (field: string, currentValue: string) => {
    setEditingField(field);
    setTempValue(currentValue);
  };

  const handleSaveField = async () => {
    if (!user || !editingField) return;

    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      [editingField]: tempValue,
      updatedAt: new Date()
    });

    // Update local state
    switch (editingField) {
      case 'username':
        setName(tempValue);
        break;
      case 'location':
        setLocation(tempValue);
        break;
      case 'profession':
        setProfession(tempValue);
        break;
      case 'bio':
        setBio(tempValue);
        break;
      case 'statusMessage':
        setStatusMessage(tempValue);
        break;
    }

    setEditingField(null);
    setTempValue("");
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setTempValue("");
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
    <div className="min-h-screen bg-gradient-to-br from-passion-50 via-romance-25 to-bollywood-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-romance-600 via-passion-600 to-royal-600 px-6 py-4 flex items-center justify-between shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-300/20 via-transparent to-transparent"></div>
        
        <div className="relative z-10 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <ArrowLeft size={24} className="text-white" />
          </button>
          <h1 className="text-2xl font-bold text-white tracking-tight">My Profile</h1>
        </div>
        
        <button
          onClick={() => navigate('/premium')}
          className="relative z-10 p-2 rounded-full hover:bg-white/20 transition-colors"
        >
          <Settings size={24} className="text-white" />
        </button>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-4 relative z-10">
        {/* Profile Photo Section */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0 rounded-3xl overflow-hidden mb-6">
          <div className="relative">
            {/* Large Profile Photo */}
            <div className="w-full h-80 bg-gradient-to-br from-romance-100 to-passion-100 relative overflow-hidden">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-romance-200 via-passion-200 to-royal-200">
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-4xl font-bold">{name.charAt(0)}</span>
                    </div>
                    <p className="text-white/80 text-sm">Tap to add photo</p>
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
                className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-colors"
                disabled={uploadingImage}
              >
                <Camera size={20} className="text-romance-600" />
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>
        </Card>

        {/* User Details Card */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0 rounded-3xl mb-6">
          <CardContent className="p-6">
            {/* Name and Age */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                {editingField === 'username' ? (
                  <div className="flex items-center gap-2">
                    <input
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="flex-1 text-2xl font-bold text-gray-800 bg-transparent border-b-2 border-romance-300 focus:outline-none focus:border-romance-500"
                      autoFocus
                    />
                    <button onClick={handleSaveField} className="text-green-600 p-1">
                      ✓
                    </button>
                    <button onClick={handleCancelEdit} className="text-red-500 p-1">
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-gray-800">{name}, {age}</h2>
                    <button
                      onClick={() => handleEditField('username', name)}
                      className="text-romance-500 p-1 hover:bg-romance-50 rounded-full"
                    >
                      <Edit3 size={16} />
                    </button>
                  </div>
                )}
              </div>
              
              {isPremium && (
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-3 py-1 rounded-full flex items-center gap-1">
                  <Crown className="w-4 h-4 text-yellow-800" />
                  <span className="text-yellow-800 text-xs font-bold">PREMIUM</span>
                </div>
              )}
            </div>

            {/* Status Message */}
            <div className="mb-4">
              {editingField === 'statusMessage' ? (
                <div className="flex items-center gap-2">
                  <input
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    className="flex-1 text-romance-600 bg-transparent border-b-2 border-romance-300 focus:outline-none focus:border-romance-500"
                    placeholder="What's on your mind?"
                    autoFocus
                  />
                  <button onClick={handleSaveField} className="text-green-600 p-1">
                    ✓
                  </button>
                  <button onClick={handleCancelEdit} className="text-red-500 p-1">
                    ✕
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-romance-600 italic">{statusMessage}</p>
                  <button
                    onClick={() => handleEditField('statusMessage', statusMessage)}
                    className="text-romance-500 p-1 hover:bg-romance-50 rounded-full"
                  >
                    <Edit3 size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Location */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-romance-100 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-romance-600" />
              </div>
              <div className="flex-1">
                {editingField === 'location' ? (
                  <div className="flex items-center gap-2">
                    <input
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="flex-1 text-gray-700 bg-transparent border-b-2 border-romance-300 focus:outline-none focus:border-romance-500"
                      autoFocus
                    />
                    <button onClick={handleSaveField} className="text-green-600 p-1">
                      ✓
                    </button>
                    <button onClick={handleCancelEdit} className="text-red-500 p-1">
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700 font-medium">{location}</span>
                    <button
                      onClick={() => handleEditField('location', location)}
                      className="text-romance-500 p-1 hover:bg-romance-50 rounded-full"
                    >
                      <Edit3 size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Profession */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-passion-100 rounded-full flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-passion-600" />
              </div>
              <div className="flex-1">
                {editingField === 'profession' ? (
                  <div className="flex items-center gap-2">
                    <input
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="flex-1 text-gray-700 bg-transparent border-b-2 border-romance-300 focus:outline-none focus:border-romance-500"
                      autoFocus
                    />
                    <button onClick={handleSaveField} className="text-green-600 p-1">
                      ✓
                    </button>
                    <button onClick={handleCancelEdit} className="text-red-500 p-1">
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700 font-medium">{profession}</span>
                    <button
                      onClick={() => handleEditField('profession', profession)}
                      className="text-romance-500 p-1 hover:bg-romance-50 rounded-full"
                    >
                      <Edit3 size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="bg-gradient-to-r from-romance-50 to-passion-50 rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">About Me</h3>
              {editingField === 'bio' ? (
                <div className="space-y-2">
                  <textarea
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    className="w-full text-gray-700 bg-transparent border-2 border-romance-300 rounded-lg p-2 focus:outline-none focus:border-romance-500 resize-none"
                    rows={3}
                    placeholder="Tell people about yourself..."
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={handleSaveField}
                      className="bg-green-500 text-white px-3 py-1 rounded-full text-sm"
                    >
                      Save
                    </button>
                    <button 
                      onClick={handleCancelEdit}
                      className="bg-gray-400 text-white px-3 py-1 rounded-full text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  <p className="text-gray-700 leading-relaxed flex-1">{bio}</p>
                  <button
                    onClick={() => handleEditField('bio', bio)}
                    className="text-romance-500 p-1 hover:bg-romance-100 rounded-full"
                  >
                    <Edit3 size={14} />
                  </button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Profile Stats Card */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0 rounded-3xl mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Profile Stats
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Profile Views */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-blue-700">{profileViews.toLocaleString()}</div>
                <div className="text-sm text-blue-600">Profile Views</div>
              </div>

              {/* Coins */}
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-4 text-center">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-yellow-700">{coins}</div>
                <div className="text-sm text-yellow-600">Coins</div>
              </div>

              {/* Friends */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-green-700">23</div>
                <div className="text-sm text-green-600">Friends</div>
              </div>

              {/* Chats */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-purple-700">156</div>
                <div className="text-sm text-purple-600">Chats</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button 
            onClick={() => navigate('/premium')}
            className="bg-gradient-to-r from-romance-500 to-passion-500 hover:from-romance-600 hover:to-passion-600 text-white font-semibold py-3 rounded-2xl"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Upgrade
          </Button>
          
          <Button 
            onClick={() => navigate('/friends')}
            className="bg-gradient-to-r from-royal-500 to-purple-500 hover:from-royal-600 hover:to-purple-600 text-white font-semibold py-3 rounded-2xl"
          >
            <Heart className="w-4 h-4 mr-2" />
            Find Friends
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
}
