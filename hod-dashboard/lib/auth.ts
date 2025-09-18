// Authentication utility functions for HOD Dashboard
// Ready to connect with backend APIs using API keys

export interface HOD {
  id: string
  name: string
  email: string
  department: string
  hodId: string
  role: "HOD"
}

export interface Faculty {
  id: string
  name: string
  email: string
  hodId: string
  assignedSubjects: string[]
}

export interface Subject {
  id: string
  name: string
  code: string
  facultyId: string
  semester: number
}

// Mock data for development
const mockHODs: HOD[] = [
  {
    id: "1",
    name: "Dr. John Smith",
    email: "john.smith@university.edu",
    department: "Computer Science",
    hodId: "HOD001",
    role: "HOD",
  },
]

// Authentication functions ready for API integration
export async function registerHOD(data: {
  name: string
  email: string
  password: string
  department: string
  hodId: string
}): Promise<{ success: boolean; message: string; user?: HOD }> {
  // TODO: Replace with actual API call using API key
  // const response = await fetch('/api/auth/register', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${API_KEY}`
  //   },
  //   body: JSON.stringify(data)
  // });

  // Mock implementation
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay

  const existingUser = mockHODs.find((hod) => hod.email === data.email)
  if (existingUser) {
    return { success: false, message: "User already exists" }
  }

  const newUser: HOD = {
    id: Date.now().toString(),
    name: data.name,
    email: data.email,
    department: data.department,
    hodId: data.hodId,
    role: "HOD",
  }

  mockHODs.push(newUser)
  return { success: true, message: "Registration successful", user: newUser }
}

export async function loginHOD(
  email: string,
  password: string,
): Promise<{ success: boolean; message: string; user?: HOD }> {
  // TODO: Replace with actual API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const user = mockHODs.find((hod) => hod.email === email)
  if (!user) {
    return { success: false, message: "Invalid credentials" }
  }

  return { success: true, message: "Login successful", user }
}

export async function resetPassword(
  email: string,
  otp: string,
  newPassword: string,
): Promise<{ success: boolean; message: string }> {
  // TODO: Replace with actual API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const user = mockHODs.find((hod) => hod.email === email)
  if (!user) {
    return { success: false, message: "User not found" }
  }

  // Mock OTP validation (in real implementation, validate against sent OTP)
  if (otp !== "1234") {
    return { success: false, message: "Invalid OTP" }
  }

  return { success: true, message: "Password reset successful" }
}

export async function sendOTP(email: string): Promise<{ success: boolean; message: string }> {
  // TODO: Replace with actual API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const user = mockHODs.find((hod) => hod.email === email)
  if (!user) {
    return { success: false, message: "User not found" }
  }

  // Mock OTP sending (in real implementation, send actual OTP via email/SMS)
  console.log("Mock OTP sent: 1234")
  return { success: true, message: "OTP sent successfully" }
}
