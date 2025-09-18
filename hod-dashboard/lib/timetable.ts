// Timetable management utility functions
// Ready to connect with backend APIs using API keys

export interface Timetable {
  id: string
  semester: number
  fileName: string
  fileUrl: string
  fileSize: number
  uploadedAt: Date
  hodId: string
}

export interface UploadTimetableData {
  semester: number
  file: File
}

// Mock data for development
const mockTimetables: Timetable[] = [
  {
    id: "1",
    semester: 1,
    fileName: "Semester_1_Timetable.pdf",
    fileUrl: "/placeholder-timetable.pdf",
    fileSize: 245760, // 240KB
    uploadedAt: new Date("2024-01-15"),
    hodId: "HOD001",
  },
  {
    id: "2",
    semester: 3,
    fileName: "Semester_3_Schedule.pdf",
    fileUrl: "/placeholder-timetable.pdf",
    fileSize: 189440, // 185KB
    uploadedAt: new Date("2024-02-10"),
    hodId: "HOD001",
  },
  {
    id: "3",
    semester: 5,
    fileName: "Sem5_Timetable_Updated.pdf",
    fileUrl: "/placeholder-timetable.pdf",
    fileSize: 312320, // 305KB
    uploadedAt: new Date("2024-03-05"),
    hodId: "HOD001",
  },
]

// Timetable management functions ready for API integration
export async function uploadTimetable(
  data: UploadTimetableData,
  hodId: string,
): Promise<{ success: boolean; message: string; timetable?: Timetable }> {
  // TODO: Replace with actual API call using API key
  // const formData = new FormData();
  // formData.append('file', data.file);
  // formData.append('semester', data.semester.toString());
  // formData.append('hodId', hodId);
  //
  // const response = await fetch('/api/timetable/upload', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${API_KEY}`
  //   },
  //   body: formData
  // });

  // Mock implementation
  await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate file upload delay

  // Check if timetable already exists for this semester
  const existingTimetable = mockTimetables.find((t) => t.semester === data.semester && t.hodId === hodId)
  if (existingTimetable) {
    // Update existing timetable
    existingTimetable.fileName = data.file.name
    existingTimetable.fileSize = data.file.size
    existingTimetable.uploadedAt = new Date()
    return { success: true, message: "Timetable updated successfully", timetable: existingTimetable }
  }

  // Create new timetable
  const newTimetable: Timetable = {
    id: Date.now().toString(),
    semester: data.semester,
    fileName: data.file.name,
    fileUrl: `/uploads/${data.file.name}`, // Mock URL
    fileSize: data.file.size,
    uploadedAt: new Date(),
    hodId,
  }

  mockTimetables.push(newTimetable)
  return { success: true, message: "Timetable uploaded successfully", timetable: newTimetable }
}

export async function getTimetablesByHOD(hodId: string): Promise<Timetable[]> {
  // TODO: Replace with actual API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  return mockTimetables.filter((timetable) => timetable.hodId === hodId)
}

export async function deleteTimetable(timetableId: string): Promise<{ success: boolean; message: string }> {
  // TODO: Replace with actual API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const timetableIndex = mockTimetables.findIndex((timetable) => timetable.id === timetableId)
  if (timetableIndex === -1) {
    return { success: false, message: "Timetable not found" }
  }

  mockTimetables.splice(timetableIndex, 1)
  return { success: true, message: "Timetable deleted successfully" }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`
}

export function isValidTimetableFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"]

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "Only PDF, JPEG, JPG, and PNG files are allowed" }
  }

  if (file.size > maxSize) {
    return { valid: false, error: "File size must be less than 10MB" }
  }

  return { valid: true }
}
