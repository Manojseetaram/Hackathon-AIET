"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, BookOpen, Users, Clock } from "lucide-react"
import type { Faculty, Subject, StudentSummary } from "@/lib/types"

export default function DashboardPage() {
  const [faculty, setFaculty] = useState<Faculty | null>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [studentSummary, setStudentSummary] = useState<StudentSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const facultyData = localStorage.getItem("faculty")
    if (facultyData) {
      const parsedFaculty: Faculty = JSON.parse(facultyData)
      setFaculty(parsedFaculty)
      loadDashboardData(parsedFaculty.faculty_id)
    }
  }, [])

  const loadDashboardData = async (facultyId: number) => {
    try {
      // 1. Fetch assigned subjects
      const subjectsResponse = await fetch(`http://localhost:8080/subjects/faculty?faculty_id=${facultyId}`)
      const subjectsData: Subject[] = await subjectsResponse.json()
      setSubjects(subjectsData)

      // 2. Fetch student summaries for each subject
      const allSummaries: StudentSummary[] = []
      for (const subject of subjectsData) {
        const studentsResponse = await fetch(
          `http://localhost:8080/attendance/summary/subject?subject_id=${subject.subject_id}`
        )
        const studentsData: StudentSummary[] = await studentsResponse.json()
        allSummaries.push(...studentsData)
      }

      setStudentSummary(allSummaries)
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!faculty) return null

  const totalStudents = studentSummary.length
  const averageAttendance =
    studentSummary.length > 0
      ? Math.round(studentSummary.reduce((sum, student) => sum + student.Percentage, 0) / studentSummary.length)
      : 0

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome Prof. {faculty.name.split(" ").slice(-1)[0]} 👋</h1>
        <p className="text-muted-foreground mt-1">Here's an overview of your teaching activities</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Subjects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subjects.length}</div>
            <p className="text-xs text-muted-foreground">Assigned this semester</p>
          </CardContent>
        </Card>

        {/* Total Students */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">Across all subjects</p>
          </CardContent>
        </Card>

        {/* Average Attendance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageAttendance}%</div>
            <p className="text-xs text-muted-foreground">Overall class average</p>
          </CardContent>
        </Card>

        {/* Last Attendance (placeholder) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Attendance</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Today</div>
            <p className="text-xs text-muted-foreground">10:00 AM - CS101</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assigned Subjects */}
        <Card>
          <CardHeader>
            <CardTitle>Assigned Subjects</CardTitle>
            <CardDescription>Subjects you're teaching this semester</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {loading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : (
                subjects.map((subject) => (
                  <div key={subject.subject_id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{subject.subject_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {subject.subject_code} • Semester {subject.sem}
                      </p>
                    </div>
                    <Badge variant="secondary">{subject.department}</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Student Performance Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Student Performance</CardTitle>
            <CardDescription>Top performing students across all subjects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {loading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-12 bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : (
                studentSummary
                  .sort((a, b) => b.Percentage - a.Percentage)
                  .slice(0, 5)
                  .map((student) => (
                    <div key={student.USN} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{student.StudentName}</p>
                        <p className="text-sm text-muted-foreground">{student.USN}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{student.Percentage}%</p>
                        <p className="text-sm text-muted-foreground">
                          {student.Attended}/{student.TotalClasses}
                        </p>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
