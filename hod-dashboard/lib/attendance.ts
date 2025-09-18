export interface AttendanceRecord {
  id: string
  facultyId: string
  subjectId: string
  subjectCode: string
  subjectName: string
  date: Date
  classType: "lecture" | "practical" | "tutorial"
  duration: number // in minutes
  studentsPresent: number
  totalStudents: number
  attendancePercentage: number
  notes?: string
}

export interface AttendanceStats {
  totalClasses: number
  totalHours: number
  averageAttendance: number
  classesThisMonth: number
  hoursThisMonth: number
  subjectWiseStats: Record<
    string,
    {
      classes: number
      hours: number
      avgAttendance: number
    }
  >
}

// Storage for attendance records
const attendanceStorage: AttendanceRecord[] = []

export async function getAttendanceByFaculty(facultyId: string): Promise<AttendanceRecord[]> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return attendanceStorage.filter((record) => record.facultyId === facultyId)
}

export async function getAttendanceBySubject(subjectId: string): Promise<AttendanceRecord[]> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return attendanceStorage.filter((record) => record.subjectId === subjectId)
}

export async function getAttendanceStats(facultyId: string): Promise<AttendanceStats> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const records = attendanceStorage.filter((record) => record.facultyId === facultyId)
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  const thisMonthRecords = records.filter(
    (record) => record.date.getMonth() === currentMonth && record.date.getFullYear() === currentYear,
  )

  const subjectWiseStats: Record<string, { classes: number; hours: number; avgAttendance: number }> = {}

  records.forEach((record) => {
    if (!subjectWiseStats[record.subjectCode]) {
      subjectWiseStats[record.subjectCode] = { classes: 0, hours: 0, avgAttendance: 0 }
    }
    subjectWiseStats[record.subjectCode].classes++
    subjectWiseStats[record.subjectCode].hours += record.duration / 60
  })

  // Calculate average attendance for each subject
  Object.keys(subjectWiseStats).forEach((subjectCode) => {
    const subjectRecords = records.filter((r) => r.subjectCode === subjectCode)
    const avgAttendance = subjectRecords.reduce((sum, r) => sum + r.attendancePercentage, 0) / subjectRecords.length
    subjectWiseStats[subjectCode].avgAttendance = avgAttendance || 0
  })

  return {
    totalClasses: records.length,
    totalHours: records.reduce((sum, r) => sum + r.duration / 60, 0),
    averageAttendance: records.reduce((sum, r) => sum + r.attendancePercentage, 0) / records.length || 0,
    classesThisMonth: thisMonthRecords.length,
    hoursThisMonth: thisMonthRecords.reduce((sum, r) => sum + r.duration / 60, 0),
    subjectWiseStats,
  }
}

export async function addAttendanceRecord(
  record: Omit<AttendanceRecord, "id">,
): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 800))

  const newRecord: AttendanceRecord = {
    ...record,
    id: Date.now().toString(),
  }

  attendanceStorage.push(newRecord)
  return { success: true, message: "Attendance record added successfully" }
}
