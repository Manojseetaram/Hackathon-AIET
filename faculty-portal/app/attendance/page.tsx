"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Clock, Users, Save, Eye, CheckCircle, XCircle, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Faculty, ClassAttendance, AttendanceWithNames } from "@/lib/types"

const timeSlots = [
  { value: "10-11", label: "10:00 AM - 11:00 AM" },
  { value: "11-12", label: "11:00 AM - 12:00 PM" },
  { value: "12-1", label: "12:00 PM - 1:00 PM" },
  { value: "2-3", label: "2:00 PM - 3:00 PM" },
  { value: "3-4", label: "3:00 PM - 4:00 PM" },
  { value: "4-5", label: "4:00 PM - 5:00 PM" },
]

export default function AttendancePage() {
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [faculty, setFaculty] = useState<Faculty | null>(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("")
  const [students, setStudents] = useState<ClassAttendance[]>([])
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

  // ---- ASSIGN SUBJECT TO TIMERANGE ----
  const handleAssignSubject = async () => {
    if (!faculty || !subjectCode || !selectedTimeSlot) return
    const [startTime, endTime] = selectedTimeSlot.split("-")

    setAssigning(true)
    try {
      const payload = {
        facultyId: faculty.faculty_id,
        subjectCode,
        classDate: selectedDate,
        start: `${startTime}:00`,
        end: `${endTime}:00`,
      }

      const response = await fetch("http://localhost:8080/attendance/assignsubject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error("Failed to assign subject")

      toast({
        title: "Success",
        description: "Subject assigned to selected time range",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign subject",
        variant: "destructive",
      })
    } finally {
      setAssigning(false)
    }
  }

  // ---- FETCH ATTENDANCE BY SUBJECTCODE + TIME ----
  const handleFetchAttendanceBySubject = async () => {
    if (!subjectCode || !selectedTimeSlot) return
    const [startTime, endTime] = selectedTimeSlot.split("-")

    setLoading(true)
    try {
      const response = await fetch(
        `http://localhost:8080/attendance/subject?subjectCode=${subjectCode}&date=${selectedDate}&start=${startTime}:00&end=${endTime}:00`,
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
