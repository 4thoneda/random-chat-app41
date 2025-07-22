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
  const maxFreeLimit = 3;

  // Load friends from localStorage on mount
  useEffect(() => {
    const savedFriends = localStorage.getItem("ajnabicam_friends");
    if (savedFriends) {
      try {
        const parsedFriends = JSON.parse(savedFriends).map((friend: any) => ({
          ...friend,
          addedAt: new Date(friend.addedAt),
          lastSeen: friend.lastSeen ? new Date(friend.lastSeen) : undefined
        }));
        setFriends(parsedFriends);
      } catch (error) {
        console.error("Error loading friends:", error);
        setFriends([]);
      }
    }
  }, []);

  // Save friends to localStorage whenever friends change
  useEffect(() => {
    if (friends.length >= 0) {
      localStorage.setItem("ajnabicam_friends", JSON.stringify(friends));
    }
  }, [friends]);

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
