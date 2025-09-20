"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Users,
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Faculty, Subject, StudentSummary } from "@/lib/types"

export default function StudentsPage() {
  const { toast } = useToast()

  const [faculty, setFaculty] = useState<Faculty | null>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [students, setStudents] = useState<StudentSummary[]>([])
  const [filteredStudents, setFilteredStudents] = useState<StudentSummary[]>([])
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)

  // helper to get token headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token")
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  }

  useEffect(() => {
    loadFaculty()
  }, [])

  const loadFaculty = async () => {
    try {
      // fetch faculty profile
      const facultyRes = await fetch("http://localhost:8080/faculty", {
        headers: getAuthHeaders(),
      })
      if (!facultyRes.ok) throw new Error("Failed to load faculty")
      const facultyData: Faculty = await facultyRes.json()
      setFaculty(facultyData)

      // fetch subjects
     const subjectsRes = await fetch(
  "http://localhost:8080/subjects/faculty",
  { headers: getAuthHeaders() }
)
if (!subjectsRes.ok) throw new Error("Failed to load subjects")

const subjectsJson = await subjectsRes.json()
// Ensure we get an array
const subjectsArray: Subject[] = Array.isArray(subjectsJson)
  ? subjectsJson
  : subjectsJson.data || []

setSubjects(subjectsArray)

      setLoading(false)
    } catch (error) {
      console.error("Error loading faculty/subjects:", error)
      setLoading(false)
    }
  }

const loadStudentSummary = async (subjectCode: string) => {
  try {
    setLoading(true)
    const res = await fetch(
      `http://localhost:8080/attendance/summary/subject?subjectCode=${encodeURIComponent(
        subjectCode
      )}`,
      { headers: getAuthHeaders() }
    )
    if (!res.ok) throw new Error("Failed to load student summary")

    // Get JSON from response
    const resJson = await res.json()

    // Map backend snake_case fields to frontend camelCase fields
    const summaryData: StudentSummary[] = (resJson.data || []).map((s: any) => ({
      USN: s.usn,
      StudentName: s.student_name,
      TotalClasses: s.total_classes,
      Attended: s.attended,
      Percentage: s.percentage,
    }))

    // Set state
    setStudents(summaryData)
    setFilteredStudents(summaryData)
  } catch (error) {
    console.error("Error loading student summary:", error)
  } finally {
    setLoading(false)
  }
}



  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredStudents(students)
      return
    }

    const q = searchQuery.toLowerCase()
    const result = students.filter(
      (s) =>
        s.StudentName.toLowerCase().includes(q) ||
        s.USN.toLowerCase().includes(q)
    )

    if (result.length > 0) {
      setFilteredStudents(result)
      toast({
        title: "Student Found",
        description: `Found ${result.length} result(s)`,
      })
    } else {
      setFilteredStudents([])
      toast({
        title: "No Results",
        description: "No student found matching your search",
        variant: "destructive",
      })
    }
  }

  const handleSubjectFilter = (subjectId: string) => {
    setSelectedSubject(subjectId)
    if (subjectId === "all") {
      setFilteredStudents(students)
    } else {
      const subject = subjects.find(
        (s) => s.subject_id.toString() === subjectId
      )
      if (subject) {
        loadStudentSummary(subject.subject_code)
      }
    }
  }

  const clearFilters = () => {
    setSelectedSubject("all")
    setSearchQuery("")
    setFilteredStudents(students)
  }

  const getAttendanceIcon = (percentage: number) => {
    if (percentage >= 85)
      return <TrendingUp className="h-4 w-4 text-green-600" />
    if (percentage >= 75)
      return <Minus className="h-4 w-4 text-yellow-600" />
    return <TrendingDown className="h-4 w-4 text-red-600" />
  }

  const getAttendanceBadge = (percentage: number) => {
    if (percentage >= 85) return "default"
    if (percentage >= 75) return "secondary"
    return "destructive"
  }

  const averageAttendance =
    filteredStudents.length > 0
      ? Math.round(
          filteredStudents.reduce(
            (sum, student) => sum + student.Percentage,
            0
          ) / filteredStudents.length
        )
      : 0

  const excellentStudents = filteredStudents.filter(
    (s) => s.Percentage >= 85
  ).length
  const lowAttendanceStudents = filteredStudents.filter(
    (s) => s.Percentage < 75
  ).length

  if (!faculty) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Student Summary
        </h1>
        <p className="text-muted-foreground mt-1">
          View and analyze student attendance across all subjects
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredStudents.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Attendance
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {averageAttendance}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Excellent (≥85%)
            </CardTitle>
            <div className="h-4 w-4 bg-green-600 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {excellentStudents}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Low Attendance (&lt;75%)
            </CardTitle>
            <div className="h-4 w-4 bg-red-600 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {lowAttendanceStudents}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter Students
          </CardTitle>
          <CardDescription>
            Search by USN or name, and filter by subject
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Student</Label>
              <div className="flex gap-2">
                <Input
                  id="search"
                  placeholder="Enter USN or student name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleSearch()
                  }
                />
                <Button onClick={handleSearch} disabled={searching}>
                  {searching ? (
                    <Search className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Filter by Subject</Label>
              <Select
                value={selectedSubject}
                onValueChange={handleSubjectFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem
                      key={subject.subject_id}
                      value={subject.subject_id.toString()}
                    >
                      {subject.subject_code} - {subject.subject_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {(searchQuery || selectedSubject !== "all") && (
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Attendance Summary</CardTitle>
          <CardDescription>
            {filteredStudents.length > 0
              ? `Showing ${filteredStudents.length} students`
              : "No students found matching your criteria"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-muted animate-pulse rounded-lg"
                />
              ))}
            </div>
          ) : filteredStudents.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>USN</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Total Classes</TableHead>
                    <TableHead>Attended</TableHead>
                    <TableHead>Percentage</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents
                    .sort((a, b) => b.Percentage - a.Percentage)
                    .map((student) => (
                      <TableRow key={student.USN}>
                        <TableCell className="font-medium">
                          {student.USN}
                        </TableCell>
                        <TableCell>{student.StudentName}</TableCell>
                        <TableCell>{student.TotalClasses}</TableCell>
                        <TableCell>{student.Attended}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getAttendanceIcon(student.Percentage)}
                            <span className="font-medium">
                              {student.Percentage}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getAttendanceBadge(
                              student.Percentage
                            )}
                          >
                            {student.Percentage >= 85
                              ? "Excellent"
                              : student.Percentage >= 75
                              ? "Good"
                              : "Low"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <Alert>
              <Users className="h-4 w-4" />
              <AlertDescription>
                No students found matching your search criteria. Try
                adjusting your search terms or clearing the filters.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
