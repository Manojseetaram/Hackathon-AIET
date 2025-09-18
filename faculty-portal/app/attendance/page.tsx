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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar, Clock, Users, Save, Eye, CheckCircle, XCircle } from "lucide-react"
import { fetchClassAttendance, saveAttendance } from "@/api/faculty"
import { useToast } from "@/hooks/use-toast"
import type { Faculty, ClassAttendance } from "@/lib/types"

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
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [attendanceLoaded, setAttendanceLoaded] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<ClassAttendance | null>(null)

  // Get subject info from URL params
  const subjectId = searchParams.get("subject")
  const subjectCode = searchParams.get("code")
  const subjectName = searchParams.get("name")

  useEffect(() => {
    const facultyData = localStorage.getItem("faculty")
    if (facultyData) {
      setFaculty(JSON.parse(facultyData))
    }
  }, [])

  const handleFetchAttendance = async () => {
    if (!faculty || !subjectId || !selectedTimeSlot) return

    setLoading(true)
    try {
      const [startTime, endTime] = selectedTimeSlot.split("-")
      const response = await fetchClassAttendance(
        faculty.faculty_id,
        Number.parseInt(subjectId),
        selectedDate,
        `${startTime}:00`,
        `${endTime}:00`,
      )

      if (response.ok && response.data) {
        setStudents(response.data)
        setAttendanceLoaded(true)
        toast({
          title: "Success",
          description: "Student list loaded successfully",
        })
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to fetch attendance",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while fetching attendance",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAttendanceToggle = (usn: string, isPresent: boolean) => {
    setStudents((prev) =>
      prev.map((student) => (student.usn === usn ? { ...student, status: isPresent ? "PRESENT" : "ABSENT" } : student)),
    )
  }

  const handleSaveAttendance = async () => {
    if (!faculty || !subjectId || !selectedTimeSlot) return

    setSaving(true)
    try {
      const [startTime, endTime] = selectedTimeSlot.split("-")
      const attendanceData = students.map((student) => ({
        usn: student.usn,
        status: student.status,
      }))

      const response = await saveAttendance({
        faculty_id: faculty.faculty_id,
        subject_id: Number.parseInt(subjectId),
        class_date: selectedDate,
        start: `${startTime}:00`,
        end: `${endTime}:00`,
        attendance: attendanceData,
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Attendance saved successfully",
        })
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to save attendance",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while saving attendance",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const formatDateToIST = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const presentCount = students.filter((s) => s.status === "PRESENT").length
  const absentCount = students.filter((s) => s.status === "ABSENT").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Take Attendance</h1>
        <p className="text-muted-foreground mt-1">Mark attendance for your classes</p>
      </div>

      {/* Subject Info */}
      {subjectCode && subjectName && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {subjectCode} - {subjectName}
            </CardTitle>
            <CardDescription>Selected subject for attendance marking</CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Class Details</CardTitle>
          <CardDescription>Select date and time slot to fetch student list</CardDescription>
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
                max={new Date().toISOString().split("T")[0]}
              />
              <p className="text-sm text-muted-foreground">{formatDateToIST(selectedDate)}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeSlot">Time Slot</Label>
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

          <Button onClick={handleFetchAttendance} disabled={loading || !selectedTimeSlot} className="w-full md:w-auto">
            {loading ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Fetching Students...
              </>
            ) : (
              <>
                <Users className="mr-2 h-4 w-4" />
                Fetch Attendance
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Attendance Summary */}
      {attendanceLoaded && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
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
      )}

      {/* Student Attendance Table */}
      {attendanceLoaded && (
        <Card>
          <CardHeader>
            <CardTitle>Student Attendance</CardTitle>
            <CardDescription>Mark students as present or absent</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>USN</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Toggle</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.usn}>
                      <TableCell className="font-medium">{student.usn}</TableCell>
                      <TableCell>{student.student_name}</TableCell>
                      <TableCell>
                        <Badge variant={student.status === "PRESENT" ? "default" : "destructive"}>
                          {student.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={student.status === "PRESENT"}
                          onCheckedChange={(checked) => handleAttendanceToggle(student.usn, checked)}
                        />
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedStudent(student)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Student Details</DialogTitle>
                              <DialogDescription>Full information about the student</DialogDescription>
                            </DialogHeader>
                            {selectedStudent && (
                              <div className="space-y-4">
                                <div>
                                  <Label>USN</Label>
                                  <p className="font-medium">{selectedStudent.usn}</p>
                                </div>
                                <div>
                                  <Label>Name</Label>
                                  <p className="font-medium">{selectedStudent.student_name}</p>
                                </div>
                                <div>
                                  <Label>Current Status</Label>
                                  <Badge variant={selectedStudent.status === "PRESENT" ? "default" : "destructive"}>
                                    {selectedStudent.status}
                                  </Badge>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {students.length > 0 && (
              <div className="mt-6 flex justify-end">
                <Button onClick={handleSaveAttendance} disabled={saving}>
                  {saving ? (
                    <>
                      <Save className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Attendance
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!attendanceLoaded && (
        <Alert>
          <Calendar className="h-4 w-4" />
          <AlertDescription>
            Select a date and time slot, then click "Fetch Attendance" to load the student list for marking attendance.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
