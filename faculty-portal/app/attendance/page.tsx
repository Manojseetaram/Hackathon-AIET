"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Clock, Users, CheckCircle, XCircle, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Faculty, ClassAttendance, AttendanceWithNames } from "@/lib/types"

// ✅ Predefined time slots in correct format
const timeSlots = [
  { value: "09:00-09:50", label: "09:00 AM - 09:50 AM" },
  { value: "10:00-10:50", label: "10:00 AM - 10:50 AM" },
  { value: "11:00-11:50", label: "11:00 AM - 11:50 AM" },
  { value: "12:00-12:50", label: "12:00 PM - 12:50 PM" },
  { value: "14:00-14:50", label: "02:00 PM - 02:50 PM" },
  { value: "15:00-15:50", label: "03:00 PM - 03:50 PM" },
  { value: "16:00-16:50", label: "04:00 PM - 04:50 PM" },
]

export default function AttendancePage() {
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [faculty, setFaculty] = useState<Faculty | null>(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]) // ✅ YYYY-MM-DD
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("")
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceWithNames[]>([])
  const [loading, setLoading] = useState(false)
  const [assigning, setAssigning] = useState(false)

  const subjectCode = searchParams.get("code")
  const subjectName = searchParams.get("name")

  useEffect(() => {
    const facultyData = localStorage.getItem("faculty")
    if (facultyData) {
      setFaculty(JSON.parse(facultyData))
    }
  }, [])

  // Utility to format date as YYYY-MM-DD
const formatDate = (dateString: string) => {
  const d = new Date(dateString)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

// ---- ASSIGN SUBJECT TO TIMERANGE ----
const handleAssignSubject = async () => {
  if (!faculty || !subjectCode || !selectedTimeSlot || !selectedDate) {
    toast({
      title: "Error",
      description: "Please select all fields before assigning",
      variant: "destructive",
    })
    return
  }

  const [startTime, endTime] = selectedTimeSlot.split("-")
  setAssigning(true)

  try {
    // Prepare payload matching backend expectations
    const payload = {
      subjectCode: subjectCode,          // backend expects this
      class_date: formatDate(selectedDate),
      start: startTime,
      end: endTime,
    }

    console.log("Assigning subject with payload:", payload)

    // Get JWT from localStorage
    const token = localStorage.getItem("token")
    if (!token) throw new Error("No authorization token found")

    // Call backend with correct URL
    const url = "http://localhost:8080/attendance/assignsubject"
    console.log("Calling URL:", url)

  const response = await fetch("http://localhost:8080/attendance/assignsubject", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,  // your JWT
  },
  body: JSON.stringify(payload),
})


    const data = await response.json()
    console.log("Response from backend:", data)

    if (!response.ok) {
      throw new Error(data.error || "Failed to assign subject")
    }

    toast({
      title: "Success",
      description: "Subject assigned to selected time range",
    })
  } catch (error: any) {
    console.error("Error assigning subject:", error)
    toast({
      title: "Error",
      description: error.message || "Failed to assign subject",
      variant: "destructive",
    })
  } finally {
    setAssigning(false)
  }
}



// ---- FETCH ATTENDANCE ----
const handleFetchAttendanceBySubject = async () => {
  if (!subjectCode || !selectedTimeSlot || !selectedDate) return
  const [startTime, endTime] = selectedTimeSlot.split("-")

  setLoading(true)
  try {
    const response = await fetch(
      `http://localhost:8080/attendance/subject?subjectCode=${subjectCode}& date=${formatDate(
        selectedDate,
      )}&start=${startTime}&end=${endTime}`,
    )

    if (!response.ok) throw new Error("Failed to fetch attendance records")

    const data: AttendanceWithNames[] = await response.json()
    setAttendanceRecords(data)

    toast({
      title: "Success",
      description: "Attendance records loaded",
    })
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to fetch attendance records",
      variant: "destructive",
    })
  } finally {
    setLoading(false)
  }
}


  const presentCount = attendanceRecords.filter((a) => a.status === "PRESENT").length
  const absentCount = attendanceRecords.filter((a) => a.status === "ABSENT").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Take Attendance</h1>
        <p className="text-muted-foreground mt-1">Assign subjects and view attendance records</p>
      </div>

      {/* Subject Info */}
      {subjectCode && subjectName && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {subjectCode} - {subjectName}
            </CardTitle>
            <CardDescription>Selected subject for attendance</CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Assignment Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Assign Subject</CardTitle>
          <CardDescription>Assign subject to a specific time slot</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Time Slot</Label>
              <Select value={selectedTimeSlot} onValueChange={setSelectedTimeSlot}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time slot" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot.value} value={slot.value}>
                      {slot.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleAssignSubject} disabled={assigning || !selectedTimeSlot}>
            {assigning ? "Assigning..." : <><Plus className="mr-2 h-4 w-4" /> Assign Subject</>}
          </Button>
        </CardContent>
      </Card>

      {/* Attendance Records */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
          <CardDescription>Fetch attendance for subject and time slot</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleFetchAttendanceBySubject}
            disabled={loading || !selectedTimeSlot}
            className="mb-4"
          >
            {loading ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Fetching Records...
              </>
            ) : (
              <>
                <Users className="mr-2 h-4 w-4" />
                Fetch Records
              </>
            )}
          </Button>

          {attendanceRecords.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{attendanceRecords.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Present</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{presentCount}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Absent</CardTitle>
                    <XCircle className="h-4 w-4 text-red-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">{absentCount}</div>
                  </CardContent>
                </Card>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>USN</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Recorded At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceRecords.map((record) => (
                      <TableRow key={record.attendance_id}>
                        <TableCell>{record.usn}</TableCell>
                        <TableCell>{record.student_name}</TableCell>
                        <TableCell>
                          <Badge variant={record.status === "PRESENT" ? "default" : "destructive"}>
                            {record.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>{new Date(record.recorded_at).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          ) : (
            <Alert>
              <Calendar className="h-4 w-4" />
              <AlertDescription>No attendance records found yet</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
