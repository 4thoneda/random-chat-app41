import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProfileData {
  name?: string;
  age?: number;
  location?: string;
  bio?: string;
  interests?: string[];
  profilePic?: string;
}

export default function ProfilePage({
  name = "Mystery Person",
  age = 18,
  location = "Unknown",
  bio = "This person is a little mysterious...",
  interests = ["Travel", "Music", "Movies"],
  profilePic = "https://source.unsplash.com/random/300x300/?face",
}: ProfileData) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-100 p-6">
      <Card className="w-full max-w-md shadow-xl rounded-2xl bg-white border-2 border-purple-200">
        <CardHeader className="text-center">
          <img
            src={profilePic}
            alt="Profile"
            className="w-32 h-32 mx-auto rounded-full border-4 border-purple-300 shadow-md object-cover"
          />
          <h2 className="mt-4 text-2xl font-bold text-purple-800">
            {name}, {age}
          </h2>
          <p className="text-sm text-gray-500">{location}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-1">Bio</h3>
            <p className="text-gray-700 text-sm leading-relaxed">{bio}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-1">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest, index) => (
                <Badge key={index} variant="secondary" className="text-sm bg-purple-100 text-purple-700">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
