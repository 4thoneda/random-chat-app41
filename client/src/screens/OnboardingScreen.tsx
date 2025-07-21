import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firebaseApp, db, storage } from '../firebaseConfig';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { useLanguage, languages } from '../context/LanguageProvider';
import { Globe, User, Users, ChevronDown, Camera, Upload } from 'lucide-react';

export default function OnboardingScreen() {
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>('');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const auth = getAuth(firebaseApp);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setProfileImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setProfileImagePreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToFirebase = async (file: File, userId: string): Promise<string | null> => {
    try {
      const imageRef = ref(storage, `profile-images/${userId}_${Date.now()}`);
      const snapshot = await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleContinue = async () => {
    if (!username.trim()) {
      alert('Please enter a username');
      return;
    }
    
    if (!gender) {
      alert('Please select your gender');
      return;
    }

    if (!profileImage) {
      alert('Please upload a profile picture');
      return;
    }
    
    if (!isLoading) {
      setIsLoading(true);
      setUploadProgress(0);
      
      try {
        const user = auth.currentUser;
        if (!user) {
          throw new Error('No authenticated user found');
        }

        // Upload profile image
        setUploadProgress(30);
        const imageUrl = await uploadImageToFirebase(profileImage, user.uid);
        
        if (!imageUrl) {
          throw new Error('Failed to upload profile image');
        }
        
        setUploadProgress(70);

        // Save user data to Firestore and mark onboarding as complete
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, {
          username: username.trim(),
          gender,
          profileImageUrl: imageUrl,
          language,
          onboardingComplete: true,
          coins: 100, // Initialize with coins
          createdAt: new Date(),
          updatedAt: new Date()
        }, { merge: true });

        setUploadProgress(100);
        console.log('User onboarding data saved to Firestore');
        
        // Small delay to show completion
        setTimeout(() => {
          navigate('/');
        }, 500);
      } catch (error) {
        console.error('Error saving onboarding data:', error);
        alert('Error saving your information. Please try again.');
      } finally {
        setIsLoading(false);
        setUploadProgress(0);
      }
    }
  };

  const handleSkip = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No authenticated user found');
      }

      // Save minimal data to Firestore and mark onboarding as complete
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        username: 'User',
        gender: 'other',
        profileImageUrl: '', // No image for skipped onboarding
        language,
        onboardingComplete: true,
        coins: 100, // Initialize with coins
        createdAt: new Date(),
        updatedAt: new Date()
      }, { merge: true });

      console.log('User skipped onboarding, minimal data saved to Firestore');
      navigate('/');
    } catch (error) {
      console.error('Error saving skip data:', error);
      alert('Error completing setup. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const genderOptions = [
    { value: 'male', label: t('onboarding.gender.male'), emoji: '👨' },
    { value: 'female', label: t('onboarding.gender.female'), emoji: '👩' },
    { value: 'other', label: t('onboarding.gender.other'), emoji: '🧑' },
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <div className="min-h-screen bg-gradient-to-br from-peach-100 via-cream-50 to-blush-100 flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 relative">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">💕</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-peach-600 to-coral-600 bg-clip-text text-transparent mb-2">
            {t('onboarding.welcome')}
          </h1>
          <p className="text-gray-600">{t('onboarding.subtitle')}</p>
        </div>

        <div className="space-y-6">
          {/* Profile Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Profile Picture
            </label>
            <div className="flex flex-col items-center">
              <div className="relative w-24 h-24 mb-4">
                {profileImagePreview ? (
                  <img
                    src={profileImagePreview}
                    alt="Profile preview"
                    className="w-full h-full rounded-full object-cover border-4 border-peach-200 shadow-lg"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-peach-200 to-coral-200 flex items-center justify-center border-4 border-peach-200 shadow-lg">
                    <Camera className="h-8 w-8 text-peach-600" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
                  disabled={isLoading}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-peach-600 border-peach-300 hover:bg-peach-50"
              onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
                disabled={isLoading}
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose Photo
              </Button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Max 5MB • JPG, PNG, GIF
              </p>
            </div>
          </div>

          {/* Language Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Globe className="h-4 w-4" />
              {t('onboarding.language')}
            </label>
            <div className="relative">
              <button
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-peach-500 focus:border-transparent bg-white flex items-center justify-between hover:border-peach-300 transition-colors"
                disabled={isLoading}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{currentLanguage?.flag}</span>
                  <span className="font-medium">{currentLanguage?.name}</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showLanguageDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setShowLanguageDropdown(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-peach-50 flex items-center gap-3 transition-colors ${
                        language === lang.code ? 'bg-peach-100 text-peach-700' : 'text-gray-700'
                      }`}
                      disabled={isLoading}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <span className="font-medium">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Username Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <User className="h-4 w-4" />
              {t('onboarding.username')}
            </label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t('onboarding.username.placeholder')}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-peach-500 focus:border-transparent"
              maxLength={20}
              disabled={isLoading}
            />
          </div>

          {/* Gender Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t('onboarding.gender')}
            </label>
            <div className="grid grid-cols-1 gap-3">
              {genderOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setGender(option.value)}
                  className={`py-3 px-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                    gender === option.value 
                      ? 'border-peach-500 bg-peach-50 text-peach-700' 
                      : 'border-gray-300 text-gray-700 hover:border-peach-300 hover:bg-peach-25'
                  }`}
                  disabled={isLoading}
                >
                  <span className="text-2xl">{option.emoji}</span>
                  <span className="font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Progress Bar (shown during upload) */}
          {isLoading && uploadProgress > 0 && (
            <div className="w-full">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-peach-500 to-coral-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <Button
              onClick={handleContinue}
              disabled={!username.trim() || !gender || !profileImage || isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-peach-500 via-coral-500 to-blush-600 hover:from-peach-600 hover:via-coral-600 hover:to-blush-700 text-white font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {uploadProgress > 0 ? `Uploading... ${uploadProgress}%` : 'Saving...'}
                </div>
              ) : (
                t('onboarding.continue')
              )}
            </Button>
            
            <Button
              onClick={handleSkip}
              variant="outline"
              disabled={isLoading}
              className="w-full py-3 rounded-xl border-2 border-peach-300 text-peach-700 hover:bg-peach-50 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : t('onboarding.skip')}
            </Button>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            🔒 Your information is kept private and secure
          </p>
        </div>
      </Card>
    </div>
  );
}
