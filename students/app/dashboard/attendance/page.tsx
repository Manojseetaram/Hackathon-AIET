"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter } from "lucide-react"

// Types from backend
interface SubjectPayload {
  subject_code: string
  subject_name: string
  faculty_id: number
  department: string
  sem: number
}

interface AttendanceRecord {
  attendance_id: number
  date: string       // ISO string
  status: string     // "Present" / "Absent"
  subject_id: number
  subject_name: string
  recorded_at: string // ISO string
}


export default function AttendanceHistoryPage() {
  const [subjects, setSubjects] = useState<SubjectPayload[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string>("")
 const [attendanceSummary, setAttendanceSummary] = useState<AttendanceRecord[]>([])

  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const studentData = localStorage.getItem("student")
    if (!studentData) {
      router.push("/login")
      return
    }
    fetchSubjects()
  }, [router])
const fetchSubjects = async () => {
  try {
    const token = localStorage.getItem("authToken")
    const response = await fetch("http://localhost:8080/students/subjects", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) throw new Error("Failed to fetch subjects")

    const result = await response.json()
    console.log("Subjects API response:", result)

    // 👇 pick the `data` array
    setSubjects(result.data || [])
  } catch (err: any) {
    setError(err.message || "Error loading subjects")
  }
}

const fetchAttendanceSummary = async (subjectCode: string) => {
  try {
    setLoading(true)
    setError("")
    const token = localStorage.getItem("authToken")
    const response = await fetch(
      `http://localhost:8080/attendance/student/history?subjectCode=${subjectCode}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )

    if (!response.ok) throw new Error("Failed to fetch attendance summary")

    const result = await response.json()
    console.log("Attendance summary response:", result)

    // 👇 take only the data array
    setAttendanceSummary(result.data || [])
  } catch (err: any) {
    setError(err.message || "Error loading attendance summary")
  } finally {
    setLoading(false)
  }
}

 const filteredSummary = attendanceSummary.filter((record) =>
  record.subject_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  record.status.toLowerCase().includes(searchTerm.toLowerCase())
)



  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Attendance History</h1>
          <p className="text-muted-foreground">View your attendance summary by subject</p>
        </div>

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-700">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
            <CardDescription>Select subject and search records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Select
                  value={selectedSubject}
                  onValueChange={(code) => {
                    setSelectedSubject(code)
                    fetchAttendanceSummary(code)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                 <SelectContent>
  {subjects.length === 0 ? (
    <SelectItem disabled value="none">No subjects available</SelectItem>
  ) : (
    subjects.map((subject) => (
      <SelectItem key={subject.subject_code} value={subject.subject_code}>
        {subject.subject_name}
      </SelectItem>
    ))
  )}
</SelectContent>

                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Search Student</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or USN..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Summary Table */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Summary</CardTitle>
            <CardDescription>
              Showing {filteredSummary.length} of {attendanceSummary.length} records
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32 text-gray-600">Loading...</div>
            ) : (
              <div className="rounded-md border">
                <Table>
                 <TableHeader>
  <TableRow>
    <TableHead>Date</TableHead>
    <TableHead>Subject</TableHead>
    <TableHead>Status</TableHead>
    <TableHead>Recorded Time</TableHead>
  </TableRow>
</TableHeader>
<TableBody>
  {filteredSummary.map((record, idx) => (
    <TableRow key={idx}>
      <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
      <TableCell>{record.subject_name}</TableCell>
      <TableCell>{record.status}</TableCell>
      <TableCell>{new Date(record.recorded_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</TableCell>
    </TableRow>
  ))}
</TableBody>

                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
