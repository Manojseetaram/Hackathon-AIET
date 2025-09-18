// Profile management utility functions
// Ready to connect with backend APIs using API keys

export interface UserProfile {
  id: string
  name: string
  email: string
  department: string
  hodId: string
  phone?: string
  bio?: string
  avatarUrl?: string
  joinedDate: Date
  lastLogin: Date
}

export interface UpdateProfileData {
  name?: string
  phone?: string
  bio?: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

// Mock profile data
const mockProfile: UserProfile = {
  id: "",
  name: "",
  email: "",
  department: "",
  hodId: "",
  phone: "",
  bio: "",
  avatarUrl: "/professional-avatar.png",
  joinedDate: new Date("2020-08-15"),
  lastLogin: new Date(),
}

// Profile management functions ready for API integration
export async function getProfile(
  userId: string,
): Promise<{ success: boolean; profile?: UserProfile; message: string }> {
  // TODO: Replace with actual API call
  // const response = await fetch(`/api/profile/${userId}`, {
  //   headers: { 'Authorization': `Bearer ${API_KEY}` }
  // });

  await new Promise((resolve) => setTimeout(resolve, 500))
  return { success: true, profile: mockProfile, message: "Profile loaded successfully" }
}

export async function updateProfile(
  userId: string,
  data: UpdateProfileData,
): Promise<{ success: boolean; message: string; profile?: UserProfile }> {
  // TODO: Replace with actual API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Update mock profile
  if (data.name) mockProfile.name = data.name
  if (data.phone) mockProfile.phone = data.phone
  if (data.bio) mockProfile.bio = data.bio

  return { success: true, message: "Profile updated successfully", profile: mockProfile }
}

export async function uploadAvatar(
  userId: string,
  file: File,
): Promise<{ success: boolean; message: string; avatarUrl?: string }> {
  // TODO: Replace with actual API call for file upload
  // const formData = new FormData();
  // formData.append('avatar', file);
  // const response = await fetch(`/api/profile/${userId}/avatar`, {
  //   method: 'POST',
  //   headers: { 'Authorization': `Bearer ${API_KEY}` },
  //   body: formData
  // });

  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Mock avatar URL
  const avatarUrl = `/uploads/avatars/${userId}_${Date.now()}.${file.name.split(".").pop()}`
  mockProfile.avatarUrl = avatarUrl

  return { success: true, message: "Avatar updated successfully", avatarUrl }
}

export async function changePassword(
  userId: string,
  data: ChangePasswordData,
): Promise<{ success: boolean; message: string }> {
  // TODO: Replace with actual API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  if (data.newPassword !== data.confirmPassword) {
    return { success: false, message: "New passwords do not match" }
  }

  if (data.newPassword.length < 6) {
    return { success: false, message: "Password must be at least 6 characters long" }
  }

  // Mock password validation
  if (data.currentPassword !== "password123") {
    return { success: false, message: "Current password is incorrect" }
  }

  return { success: true, message: "Password changed successfully" }
}

export function isValidAvatarFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "Only JPEG, PNG, and WebP images are allowed" }
  }

  if (file.size > maxSize) {
    return { valid: false, error: "Image size must be less than 5MB" }
  }

  return { valid: true }
}
