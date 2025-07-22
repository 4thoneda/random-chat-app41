/**
 * User management utilities for AjnabiCam
 */

// Generate a unique user ID if one doesn't exist
export function generateUserId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `user_${timestamp}_${random}`;
}

// Get or create user ID
export function getUserId(): string {
  let userId = localStorage.getItem("ajnabicam_user_id");

  if (!userId) {
    userId = generateUserId();
    localStorage.setItem("ajnabicam_user_id", userId);
  }

  return userId;
}

// Get user profile data
export function getUserProfile() {
  const userId = getUserId();
  const username = localStorage.getItem("ajnabicam_username") || "User";
  const profileImage = localStorage.getItem("ajnabicam_profile_image");
  const gender = localStorage.getItem("ajnabicam_gender") || "male";

  return {
    userId,
    username,
    profileImage,
    gender,
  };
}

// Save user profile data
export function saveUserProfile(profile: {
  username?: string;
  profileImage?: string;
  gender?: string;
}) {
  if (profile.username) {
    localStorage.setItem("ajnabicam_username", profile.username);
  }
  if (profile.profileImage) {
    localStorage.setItem("ajnabicam_profile_image", profile.profileImage);
  }
  if (profile.gender) {
    localStorage.setItem("ajnabicam_gender", profile.gender);
  }
}

// Clear user data (for logout)
export function clearUserData() {
  const keysToRemove = [
    "ajnabicam_user_id",
    "ajnabicam_username",
    "ajnabicam_profile_image",
    "ajnabicam_profile_path",
    "ajnabicam_gender",
  ];

  keysToRemove.forEach((key) => localStorage.removeItem(key));
}
