interface ProfileProps {
  name: string;
  age: number;
  location: string;
  bio: string;
  interests?: string[];
  profilePic: string;
}

export default function Profile({
  name,
  age,
  location,
  bio,
  interests = [],
  profilePic,
}: ProfileProps) {
  return (
    <div className="...">
      {/* ... same content */}
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
      {/* ... */}
    </div>
  );
}