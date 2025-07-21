import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Camera } from "lucide-react";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

export default function ProfilePage() {
  const [name, setName] = useState("Mystery Person");
  const [editingName, setEditingName] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);

    // Real-time listener (optional)
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setName(data.name || "Mystery Person");
        setProfileImage(data.profileImage || null);
        setReferralCode(data.referralCode || generateReferralCode(user.uid));
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
        name,
      });
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64data = reader.result as string;
      setProfileImage(base64data);

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        profileImage: base64data,
      });
    };
    reader.readAsDataURL(file);
  };

  if (!user) {
    return <div className="text-center mt-20">Please log in first.</div>;
  }

  if (loading) {
    return <div className="text-center mt-20">Loading profile...</div>;
  }

  return (
    <div className="p-6 flex justify-center items-center min-h-screen bg-gradient-to-br from-pink-50 to-purple-100">
      <Card className="w-full max-w-md shadow-xl border border-purple-200">
        <CardHeader className="flex flex-col items-center space-y-4">
          <div className="relative">
            <img
              src={
                profileImage ||
                "https://api.dicebear.com/7.x/thumbs/svg?seed=user"
              }
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute bottom-1 right-1 bg-white rounded-full shadow-sm"
              onClick={() => fileInputRef.current?.click()}
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
          </div>

          <div className="text-center">
            {editingName ? (
              <div className="flex items-center space-x-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-b border-gray-300 focus:outline-none focus:border-purple-500 px-2 text-lg"
                  autoFocus
                />
                <Button size="sm" onClick={handleNameSave}>
                  Save
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-xl font-semibold text-purple-800">
                  {name}
                </h2>
                <Button variant="ghost" size="icon" onClick={handleNameEdit}>
                  <Pencil size={16} />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4 text-center">
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <p className="text-sm text-purple-800 font-medium">
              Your Referral Code
            </p>
            <p className="text-lg font-bold text-purple-700 mt-1">
              {referralCode}
            </p>
          </div>

          <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-md hover:from-purple-700 hover:to-pink-700">
            Invite Friends
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
