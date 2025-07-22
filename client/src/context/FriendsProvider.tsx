import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { usePremium } from "./PremiumProvider";
import {
  getUserFriends,
  listenToFriends,
  sendFriendRequest,
  removeFriend as removeFirestoreFriend,
  updateFriendOnlineStatus,
  getPendingFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  listenToFriendRequests,
  getFriendsStats,
  type Friend as FirestoreFriend,
  type FriendRequest,
  type FriendsStats
} from "../lib/friendsFirestore";

interface Friend {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: Date;
  addedAt: Date;
  isFavorite?: boolean;
  nickname?: string;
}

interface FriendsContextType {
  friends: Friend[];
  friendRequests: FriendRequest[];
  friendsStats: FriendsStats;
  loading: boolean;
  addFriend: (friendId: string, friendName: string, friendAvatar?: string) => Promise<boolean>;
  removeFriend: (friendId: string) => Promise<boolean>;
  updateFriendStatus: (friendId: string, isOnline: boolean) => void;
  sendFriendRequestToUser: (toUserId: string, toUserName: string, message?: string) => Promise<boolean>;
  acceptRequest: (requestId: string) => Promise<boolean>;
  rejectRequest: (requestId: string) => Promise<boolean>;
  toggleFriendFavorite: (friendId: string) => Promise<boolean>;
  canAddMoreFriends: boolean;
  maxFreeLimit: number;
  getFriendById: (friendId: string) => Friend | undefined;
  refreshFriendsData: () => Promise<void>;
}

const FriendsContext = createContext<FriendsContextType | null>(null);

export const useFriends = () => {
  const context = useContext(FriendsContext);
  if (!context) {
    throw new Error("useFriends must be used within a FriendsProvider");
  }
  return context;
};

interface FriendsProviderProps {
  children: ReactNode;
}

export const FriendsProvider = ({ children }: FriendsProviderProps) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [friendsStats, setFriendsStats] = useState<FriendsStats>({
    totalFriends: 0,
    onlineFriends: 0,
    pendingRequests: 0,
    sentRequests: 0,
    mutualConnections: 0
  });
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string>("User");

  const { isPremium } = usePremium();
  const maxFreeLimit = 3;

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
        setCurrentUserName(user.displayName || `User${Math.floor(Math.random() * 1000)}`);
      } else {
        setCurrentUserId(null);
        setCurrentUserName("User");
        setFriends([]);
        setFriendRequests([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Set up real-time friends listener
  useEffect(() => {
    if (!currentUserId) return;

    setLoading(true);

    const unsubscribeFriends = listenToFriends(currentUserId, (firestoreFriends) => {
      const convertedFriends: Friend[] = firestoreFriends.map(f => ({
        id: f.friendId,
        name: f.friendName,
        avatar: f.friendAvatar || '',
        isOnline: f.isOnline,
        lastSeen: f.lastInteraction?.toDate(),
        addedAt: f.addedAt.toDate(),
        isFavorite: f.isFavorite,
        nickname: f.nickname
      }));

      setFriends(convertedFriends);
      setLoading(false);
    });

    const unsubscribeRequests = listenToFriendRequests(currentUserId, (requests) => {
      setFriendRequests(requests);
    });

    // Load friends stats
    refreshFriendsData();

    return () => {
      unsubscribeFriends();
      unsubscribeRequests();
    };
  }, [currentUserId]);

  const addFriend = (newFriend: Omit<Friend, 'addedAt'>): boolean => {
    // Check if user has premium
    const isPremium = localStorage.getItem("premium_status") === "true";
    
    // Check if already at limit for free users
    if (!isPremium && friends.length >= maxFreeLimit) {
      return false; // Cannot add more friends
    }

    // Check if friend already exists
    if (friends.some(friend => friend.id === newFriend.id)) {
      return true; // Already friends
    }

    // Validate friend data
    if (!newFriend.id || !newFriend.name) {
      console.error('Invalid friend data:', newFriend);
      return false;
    }

    const friendWithDate: Friend = {
      ...newFriend,
      addedAt: new Date()
    };

    setFriends(prev => [...prev, friendWithDate]);
    return true;
  };

  const removeFriend = (friendId: string) => {
    setFriends(prev => prev.filter(friend => friend.id !== friendId));
  };

  const updateFriendStatus = (friendId: string, isOnline: boolean) => {
    setFriends(prev => prev.map(friend => 
      friend.id === friendId 
        ? { 
            ...friend, 
            isOnline, 
            lastSeen: isOnline ? undefined : new Date() 
          }
        : friend
    ));
  };

  const getFriendById = (friendId: string): Friend | undefined => {
    return friends.find(friend => friend.id === friendId);
  };

  const isPremium = localStorage.getItem("premium_status") === "true";
  const canAddMoreFriends = isPremium || friends.length < maxFreeLimit;

  return (
    <FriendsContext.Provider
      value={{
        friends,
        addFriend,
        removeFriend,
        updateFriendStatus,
        canAddMoreFriends,
        maxFreeLimit,
        getFriendById,
      }}
    >
      {children}
    </FriendsContext.Provider>
  );
};
