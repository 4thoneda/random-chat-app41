import { Heart, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileProps {
  name: string;
  age: number;
  location: string;
  bio: string;
  interests: string[];
  profilePic: string;
}

export default function Profile({
  name,
  age,
  location,
  bio,
  interests,
  profilePic,
}: ProfileProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-4 relative bg-gradient-to-b from-pink-100 to-white">
      <div className="w-full max-w-md mx-auto rounded-3xl overflow-hidden shadow-xl bg-white">
        <img
          src={profilePic}
          alt={`${name}'s profile`}
          className="w-full h-96 object-cover"
        />
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {name}, <span className="text-lg font-medium text-gray-600">{age}</span>
            </h2>
            <span className="text-sm text-gray-500">{location}</span>
          </div>
          <p className="mt-2 text-gray-700 text-sm">{bio}</p>

          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-600 mb-1">Interests</h4>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest, i) => (
                <span
                  key={i}
                  className="bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 mt-6">
        <Button
          variant="ghost"
          className="bg-red-100 hover:bg-red-200 p-4 rounded-full shadow-md"
        >
          <X className="text-red-500 h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          className="bg-blue-100 hover:bg-blue-200 p-6 rounded-full shadow-lg scale-110"
        >
          <Star className="text-blue-500 h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          className="bg-green-100 hover:bg-green-200 p-4 rounded-full shadow-md"
        >
          <Heart className="text-green-500 h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
