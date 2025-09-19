"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, TrendingUp, Calendar } from "lucide-react"

interface Subject {
  subject_code: string
  subject_name: string
  faculty_id: number
  department: string
  sem: number
}

export default function DashboardPage() {
  const [student, setStudent] = useState<any>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const studentData = localStorage.getItem("student")
    if (!studentData) {
      router.push("/login")
      return
    }
    setStudent(JSON.parse(studentData))
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

      if (!response.ok) {
        throw new Error("Failed to fetch subjects")
      }

      const subjectsData = await response.json()
      setSubjects(subjectsData)
    } catch (err: any) {
      setError(err.message || "Failed to load subjects")
      console.error("Error fetching subjects:", err)
    } finally {
      setLoading(false)
    }
  }

  if (!student) {
    return <div>Loading...</div>
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading dashboard...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Welcome back, {student.name}!</h1>
            <p className="text-muted-foreground">Here's your attendance overview for today</p>
          </div>
          <Avatar className="h-16 w-16">
            <AvatarImage src="/placeholder.svg?height=64&width=64" alt={student.name} />
            <AvatarFallback className="text-lg">
              {student.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </div>

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-700">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{subjects.length}</div>
              <p className="text-xs text-muted-foreground">Active this semester</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Classes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">2 attended, 1 upcoming</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">Above minimum requirement</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92%</div>
              <p className="text-xs text-muted-foreground">15 of 16 classes</p>
            </CardContent>
          </Card>
        </div>

        {/* Subjects Grid */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Subjects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject) => (
              <Card key={subject.subject_code} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{subject.subject_code}</Badge>
                    <Badge variant="outline">Sem {subject.sem}</Badge>
                  </div>
                  <CardTitle className="text-lg">{subject.subject_name}</CardTitle>
                  <CardDescription>Faculty ID: {subject.faculty_id}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Attendance</span>
                    <span className="font-medium text-primary">{Math.floor(Math.random() * 20) + 80}%</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity - Keep mock data as requested */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest attendance records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { subject: "Data Structures", time: "09:00 AM", status: "Present", date: "Today" },
                { subject: "DBMS", time: "11:00 AM", status: "Present", date: "Today" },
                { subject: "Computer Networks", time: "02:00 PM", status: "Absent", date: "Yesterday" },
                { subject: "Software Engineering", time: "04:00 PM", status: "Present", date: "Yesterday" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">{activity.subject}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.date} at {activity.time}
                    </p>
                  </div>
                  <Badge variant={activity.status === "Present" ? "default" : "destructive"}>{activity.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
