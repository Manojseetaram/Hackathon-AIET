"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Search, Filter, Download, Clock } from "lucide-react"

interface AttendanceRecord {
  id: string
  date: string
  subject: string
  faculty: string
  status: "present" | "absent"
  time: string
}

const mockAttendanceData: AttendanceRecord[] = [
  {
    id: "1",
    date: "2024-01-15",
    subject: "Data Structures",
    faculty: "Dr. Smith",
    status: "present",
    time: "09:00 AM",
  },
  {
    id: "2",
    date: "2024-01-15",
    subject: "Computer Networks",
    faculty: "Prof. Johnson",
    status: "present",
    time: "11:00 AM",
  },
  {
    id: "3",
    date: "2024-01-14",
    subject: "Database Systems",
    faculty: "Dr. Brown",
    status: "absent",
    time: "02:00 PM",
  },
  {
    id: "4",
    date: "2024-01-14",
    subject: "Software Engineering",
    faculty: "Prof. Davis",
    status: "present",
    time: "03:30 PM",
  },
  {
    id: "5",
    date: "2024-01-13",
    subject: "Machine Learning",
    faculty: "Dr. Wilson",
    status: "present",
    time: "10:00 AM",
  },
  {
    id: "6",
    date: "2024-01-13",
    subject: "Web Technologies",
    faculty: "Prof. Miller",
    status: "absent",
    time: "01:00 PM",
  },
  {
    id: "7",
    date: "2024-01-12",
    subject: "Data Structures",
    faculty: "Dr. Smith",
    status: "present",
    time: "09:00 AM",
  },
  {
    id: "8",
    date: "2024-01-12",
    subject: "Computer Networks",
    faculty: "Prof. Johnson",
    status: "present",
    time: "11:00 AM",
  },
  {
    id: "9",
    date: "2024-01-11",
    subject: "Database Systems",
    faculty: "Dr. Brown",
    status: "present",
    time: "02:00 PM",
  },
  {
    id: "10",
    date: "2024-01-11",
    subject: "Software Engineering",
    faculty: "Prof. Davis",
    status: "absent",
    time: "03:30 PM",
  },
]

export default function AttendanceReportPage() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [subjectFilter, setSubjectFilter] = useState<string>("all")

  useEffect(() => {
    // Mock data loading
    setTimeout(() => {
      setAttendanceRecords(mockAttendanceData)
      setFilteredRecords(mockAttendanceData)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = attendanceRecords

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (record) =>
          record.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.faculty.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((record) => record.status === statusFilter)
    }

    // Subject filter
    if (subjectFilter !== "all") {
      filtered = filtered.filter((record) => record.subject === subjectFilter)
    }

    setFilteredRecords(filtered)
  }, [attendanceRecords, searchTerm, statusFilter, subjectFilter])

  const subjects = Array.from(new Set(attendanceRecords.map((record) => record.subject)))
  const totalPresent = attendanceRecords.filter((record) => record.status === "present").length
  const totalAbsent = attendanceRecords.filter((record) => record.status === "absent").length
  const attendancePercentage = attendanceRecords.length > 0 ? (totalPresent / attendanceRecords.length) * 100 : 0

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">Attendance Report</h1>
          <p className="text-muted-foreground text-pretty">Loading your attendance records...</p>
        </div>
        <div className="animate-pulse">
          <div className="h-32 bg-muted rounded-lg mb-6"></div>
          <div className="h-96 bg-muted rounded-lg"></div>
        </div>
      </div>
    )
  }

  if (attendanceRecords.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">Attendance Report</h1>
          <p className="text-muted-foreground text-pretty">Your detailed attendance records</p>
        </div>

        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-balance">No attendance records yet</h3>
            <p className="text-muted-foreground text-pretty">
              Your attendance records will appear here once faculty starts marking attendance for your classes.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Attendance Report</h1>
        <p className="text-muted-foreground text-pretty">Your detailed attendance records and statistics</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceRecords.length}</div>
            <p className="text-xs text-muted-foreground">Classes conducted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalPresent}</div>
            <p className="text-xs text-muted-foreground">Classes attended</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalAbsent}</div>
            <p className="text-xs text-muted-foreground">Classes missed</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Records</CardTitle>
          <CardDescription>Search and filter your attendance records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by subject or faculty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
              </SelectContent>
            </Select>
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
          <CardDescription>
            Showing {filteredRecords.length} of {attendanceRecords.length} records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Faculty</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">
                      {new Date(record.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell>{record.subject}</TableCell>
                    <TableCell>{record.faculty}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {record.time}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={record.status === "present" ? "secondary" : "destructive"}>
                        {record.status === "present" ? "Present" : "Absent"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredRecords.length === 0 && (
            <div className="text-center py-8">
              <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No records found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
