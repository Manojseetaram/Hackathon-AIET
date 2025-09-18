// Faculty Portal Types
export type Faculty = {
  faculty_id: number
  name: string
  email: string
  department: string
  password?: string
}

export type SubjectSummary = {
  subject_id: number
  subject_name: string
  total_classes: number
  attended: number
  percentage: number
}

export type ClassAttendance = {
  usn: string
  student_name: string
  date: string // UTC
  status: "PRESENT" | "ABSENT"
}

export type AttendanceWithNames = {
  attendance_id: number
  usn: string
  student_name: string
  subject_id: number
  subject_name: string
  date: string
  status: string
  recorded_at: string
  created_at: string
}

export type Subject = {
  subject_id: number
  subject_code: string
  subject_name: string
  faculty: string
  department: string
  sem: number
}

export type StudentSummary = {
  USN: string
  StudentName: string
  TotalClasses: number
  Attended: number
  Percentage: number
}

export type AttendanceRequest = {
  request_id: number
  usn: string
  student_name: string
  subject_id: number
  subject_name: string
  date: string
  current_status: "PRESENT" | "ABSENT"
  requested_status: "PRESENT" | "ABSENT"
  reason: string
  status: "PENDING" | "APPROVED" | "REJECTED"
}

export type ApiResponse<T = any> = {
  ok: boolean
  data?: T
  message?: string
}
