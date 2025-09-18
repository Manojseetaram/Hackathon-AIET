// Faculty management utility functions
// Ready to connect with backend APIs using API keys

export interface Faculty {
  id: string
  name: string
  email: string
  facultyId: string
  hodId: string
  assignedSubjects: string[]
  createdAt: Date
}

export interface CreateFacultyData {
  name: string
  email: string
  password: string
  facultyId: string
}

const facultyStorage: Faculty[] = []

// Faculty management functions ready for API integration
export async function createFaculty(
  data: CreateFacultyData,
  hodId: string,
): Promise<{ success: boolean; message: string; faculty?: Faculty }> {
  // TODO: Replace with actual API call using API key
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const existingFaculty = facultyStorage.find(
    (faculty) => faculty.email === data.email || faculty.facultyId === data.facultyId,
  )
  if (existingFaculty) {
    return { success: false, message: "Faculty with this email or ID already exists" }
  }

  const newFaculty: Faculty = {
    id: Date.now().toString(),
    name: data.name,
    email: data.email,
    facultyId: data.facultyId,
    hodId,
    assignedSubjects: [],
    createdAt: new Date(),
  }

  facultyStorage.push(newFaculty)
  return { success: true, message: "Faculty created successfully", faculty: newFaculty }
}

export async function getFacultyByHOD(hodId: string): Promise<Faculty[]> {
  // TODO: Replace with actual API call
  await new Promise((resolve) => setTimeout(resolve, 500))
  return facultyStorage.filter((faculty) => faculty.hodId === hodId)
}

export async function deleteFaculty(facultyId: string): Promise<{ success: boolean; message: string }> {
  // TODO: Replace with actual API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const facultyIndex = facultyStorage.findIndex((faculty) => faculty.id === facultyId)
  if (facultyIndex === -1) {
    return { success: false, message: "Faculty not found" }
  }

  facultyStorage.splice(facultyIndex, 1)
  return { success: true, message: "Faculty deleted successfully" }
}

export async function updateFacultySubjects(
  facultyId: string,
  subjects: string[],
): Promise<{ success: boolean; message: string }> {
  // TODO: Replace with actual API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  const faculty = facultyStorage.find((f) => f.id === facultyId)
  if (!faculty) {
    return { success: false, message: "Faculty not found" }
  }

  faculty.assignedSubjects = subjects
  return { success: true, message: "Faculty subjects updated successfully" }
}

export async function getFacultyById(facultyId: string): Promise<Faculty | null> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return facultyStorage.find((f) => f.id === facultyId) || null
}
