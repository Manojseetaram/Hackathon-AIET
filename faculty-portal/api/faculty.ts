import type {
  Faculty,
  Subject,
  ClassAttendance,
  AttendanceWithNames,
  AttendanceRequest,
  StudentSummary,
  ApiResponse,
} from "@/lib/types"

// Mock data
const mockFaculty: Faculty = {
  faculty_id: 1001,
  name: "Prof. John Smith",
  email: "john.smith@university.edu",
  department: "Computer Science",
}

const mockSubjects: Subject[] = [
  {
    subject_id: 1,
    subject_code: "CS101",
    subject_name: "Data Structures",
    faculty: "Prof. John Smith",
    department: "Computer Science",
    sem: 3,
  },
  {
    subject_id: 2,
    subject_code: "CS201",
    subject_name: "Database Management",
    faculty: "Prof. John Smith",
    department: "Computer Science",
    sem: 4,
  },
  {
    subject_id: 3,
    subject_code: "CS301",
    subject_name: "Machine Learning",
    faculty: "Prof. John Smith",
    department: "Computer Science",
    sem: 5,
  },
]

const mockStudents: ClassAttendance[] = [
  { usn: "1MS21CS001", student_name: "Alice Johnson", date: "2024-01-15", status: "PRESENT" },
  { usn: "1MS21CS002", student_name: "Bob Wilson", date: "2024-01-15", status: "ABSENT" },
  { usn: "1MS21CS003", student_name: "Carol Davis", date: "2024-01-15", status: "PRESENT" },
  { usn: "1MS21CS004", student_name: "David Brown", date: "2024-01-15", status: "PRESENT" },
  { usn: "1MS21CS005", student_name: "Eva Martinez", date: "2024-01-15", status: "ABSENT" },
]

const mockAttendanceHistory: AttendanceWithNames[] = [
  {
    attendance_id: 1,
    usn: "1MS21CS001",
    student_name: "Alice Johnson",
    subject_id: 1,
    subject_name: "Data Structures",
    date: "2024-01-15T10:00:00Z",
    status: "PRESENT",
    recorded_at: "2024-01-15T10:30:00Z",
    created_at: "2024-01-15T10:30:00Z",
  },
  {
    attendance_id: 2,
    usn: "1MS21CS002",
    student_name: "Bob Wilson",
    subject_id: 1,
    subject_name: "Data Structures",
    date: "2024-01-15T10:00:00Z",
    status: "ABSENT",
    recorded_at: "2024-01-15T10:30:00Z",
    created_at: "2024-01-15T10:30:00Z",
  },
]

const mockAttendanceRequests: AttendanceRequest[] = [
  {
    request_id: 1,
    usn: "1MS21CS002",
    student_name: "Bob Wilson",
    subject_id: 1,
    subject_name: "Data Structures",
    date: "2024-01-15",
    current_status: "ABSENT",
    requested_status: "PRESENT",
    reason: "Medical emergency, have doctor's note",
    status: "PENDING",
  },
  {
    request_id: 2,
    usn: "1MS21CS005",
    student_name: "Eva Martinez",
    subject_id: 2,
    subject_name: "Database Management",
    date: "2024-01-14",
    current_status: "ABSENT",
    requested_status: "PRESENT",
    reason: "Family emergency",
    status: "PENDING",
  },
]

const mockStudentSummary: StudentSummary[] = [
  { USN: "1MS21CS001", StudentName: "Alice Johnson", TotalClasses: 20, Attended: 18, Percentage: 90 },
  { USN: "1MS21CS002", StudentName: "Bob Wilson", TotalClasses: 20, Attended: 15, Percentage: 75 },
  { USN: "1MS21CS003", StudentName: "Carol Davis", TotalClasses: 20, Attended: 19, Percentage: 95 },
  { USN: "1MS21CS004", StudentName: "David Brown", TotalClasses: 20, Attended: 17, Percentage: 85 },
  { USN: "1MS21CS005", StudentName: "Eva Martinez", TotalClasses: 20, Attended: 14, Percentage: 70 },
]

// Utility function to simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// API Functions
export async function loginFaculty(faculty_id: number, email: string, password: string): Promise<ApiResponse<Faculty>> {
  await delay(1000)

  // Mock validation
  if (faculty_id === 1001 && email === "john.smith@university.edu" && password === "password123") {
    return {
      ok: true,
      data: mockFaculty,
      message: "Login successful",
    }
  }

  return {
    ok: false,
    message: "Invalid credentials",
  }
}

export async function fetchAssignedSubjects(faculty_id: number): Promise<ApiResponse<Subject[]>> {
  await delay(800)

  return {
    ok: true,
    data: mockSubjects,
    message: "Subjects fetched successfully",
  }
}

export async function fetchClassAttendance(
  faculty_id: number,
  subject_id: number,
  class_date: string,
  start: string,
  end: string,
): Promise<ApiResponse<ClassAttendance[]>> {
  await delay(1200)

  return {
    ok: true,
    data: mockStudents,
    message: "Class attendance fetched successfully",
  }
}

export async function saveAttendance(req: {
  faculty_id: number
  subject_id: number
  class_date: string
  start: string
  end: string
  attendance: { usn: string; status: "PRESENT" | "ABSENT" }[]
}): Promise<ApiResponse> {
  await delay(1500)

  return {
    ok: true,
    message: "Attendance saved successfully",
  }
}

export async function fetchAttendanceHistory(
  subject_id: number,
  date: string,
): Promise<ApiResponse<AttendanceWithNames[]>> {
  await delay(1000)

  return {
    ok: true,
    data: mockAttendanceHistory,
    message: "Attendance history fetched successfully",
  }
}

export async function fetchAttendanceRequests(faculty_id: number): Promise<ApiResponse<AttendanceRequest[]>> {
  await delay(900)

  return {
    ok: true,
    data: mockAttendanceRequests,
    message: "Attendance requests fetched successfully",
  }
}

export async function resolveAttendanceRequest(request_id: number, approve: boolean): Promise<ApiResponse> {
  await delay(1000)

  return {
    ok: true,
    message: approve ? "Request approved successfully" : "Request rejected successfully",
  }
}

export async function updateProfile(faculty_id: number, updates: Partial<Faculty>): Promise<ApiResponse<Faculty>> {
  await delay(800)

  const updatedFaculty = { ...mockFaculty, ...updates }

  return {
    ok: true,
    data: updatedFaculty,
    message: "Profile updated successfully",
  }
}

export async function fetchStudentSummary(subject_id?: number): Promise<ApiResponse<StudentSummary[]>> {
  await delay(1100)

  return {
    ok: true,
    data: mockStudentSummary,
    message: "Student summary fetched successfully",
  }
}

export async function searchStudent(query: string): Promise<ApiResponse<StudentSummary>> {
  await delay(600)

  const student = mockStudentSummary.find(
    (s) =>
      s.USN.toLowerCase().includes(query.toLowerCase()) || s.StudentName.toLowerCase().includes(query.toLowerCase()),
  )

  if (student) {
    return {
      ok: true,
      data: student,
      message: "Student found",
    }
  }

  return {
    ok: false,
    message: "Student not found",
  }
}

export const facultyAPI = {
  loginFaculty,
  fetchAssignedSubjects,
  fetchClassAttendance,
  saveAttendance,
  fetchAttendanceHistory,
  fetchAttendanceRequests,
  resolveAttendanceRequest,
  updateProfile,
  fetchStudentSummary,
  searchStudent,

  async getStudents() {
    const response = await fetchStudentSummary()
    if (response.ok && response.data) {
      return response.data.map((student) => ({
        usn: student.USN,
        name: student.StudentName,
        email: `${student.USN.toLowerCase()}@university.edu`,
        department: "Computer Science",
        semester: 5,
        totalClasses: student.TotalClasses,
        attendedClasses: student.Attended,
        percentage: student.Percentage,
      }))
    }
    return []
  },

  async getAttendanceHistory() {
    const response = await fetchAttendanceHistory(1, "")
    if (response.ok && response.data) {
      return response.data.map((record) => ({
        id: record.attendance_id,
        subject: record.subject_name,
        date: record.date,
        students: [
          {
            usn: record.usn,
            name: record.student_name,
            status: record.status.toLowerCase(),
          },
        ],
      }))
    }
    return []
  },
}
