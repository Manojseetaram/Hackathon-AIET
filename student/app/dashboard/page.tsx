"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Camera, Calendar, Clock, TrendingUp, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

interface AttendanceData {
  totalClasses: number
  attendedClasses: number
  percentage: number
  recentAttendance: Array<{
    date: string
    subject: string
    status: "present" | "absent"
    time: string
  }>
}

export default function DashboardPage() {
  const [faceRegistered, setFaceRegistered] = useState(false)
  const [attendanceData, setAttendanceData] = useState<AttendanceData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check face registration status
    const registered = localStorage.getItem("faceRegistered") === "true"
    setFaceRegistered(registered)

    // Mock attendance data loading
    setTimeout(() => {
      if (registered) {
        // Mock attendance data
        setAttendanceData({
          totalClasses: 45,
          attendedClasses: 36,
          percentage: 80,
          recentAttendance: [
            { date: "2024-01-15", subject: "Data Structures", status: "present", time: "09:00 AM" },
            { date: "2024-01-15", subject: "Computer Networks", status: "present", time: "11:00 AM" },
            { date: "2024-01-14", subject: "Database Systems", status: "absent", time: "02:00 PM" },
            { date: "2024-01-14", subject: "Software Engineering", status: "present", time: "03:30 PM" },
            { date: "2024-01-13", subject: "Machine Learning", status: "present", time: "10:00 AM" },
          ],
        })
      }
      setLoading(false)
    }, 1500)
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">Dashboard</h1>
          <p className="text-muted-foreground text-pretty">Welcome back to your attendance dashboard</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Face not registered state
  if (!faceRegistered) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">Dashboard</h1>
          <p className="text-muted-foreground text-pretty">Complete your setup to start tracking attendance</p>
        </div>

        <Card className="max-w-2xl">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-balance">Face registration pending</h3>
            <p className="text-muted-foreground mb-6 text-pretty">
              Please capture 5 photos to activate your attendance tracking. This helps our AI system recognize you
              during attendance sessions.
            </p>
            <Button asChild size="lg">
              <Link href="/face-capture">
                <Camera className="w-4 h-4 mr-2" />
                Register Now
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // No attendance data yet
  if (!attendanceData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">Dashboard</h1>
          <p className="text-muted-foreground text-pretty">Your attendance tracking is active</p>
        </div>

        <Card className="max-w-2xl">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-balance">Attendance records are being updated</h3>
            <p className="text-muted-foreground text-pretty">
              Your attendance records are being updated by faculty. Please check back later to view your attendance
              summary and reports.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Main dashboard with attendance data
  const attendancePercentage = attendanceData.percentage
  const isLowAttendance = attendancePercentage < 75

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Dashboard</h1>
        <p className="text-muted-foreground text-pretty">Track your attendance and academic progress</p>
      </div>

      {/* Attendance Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              {attendancePercentage}%
              {isLowAttendance ? (
                <Badge variant="destructive" className="text-xs">
                  Low
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">
                  Good
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {attendanceData.attendedClasses} of {attendanceData.totalClasses} classes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes Attended</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceData.attendedClasses}</div>
            <p className="text-xs text-muted-foreground">Total classes attended</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes Missed</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceData.totalClasses - attendanceData.attendedClasses}</div>
            <p className="text-xs text-muted-foreground">Total classes missed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceData.totalClasses}</div>
            <p className="text-xs text-muted-foreground">This semester</p>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Progress</CardTitle>
          <CardDescription>Your current attendance status and VTU requirement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Current Attendance</span>
                <span className="text-sm text-muted-foreground">{attendancePercentage}%</span>
              </div>
              <Progress value={attendancePercentage} className="h-2" />
            </div>

            {isLowAttendance && (
              <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                <div>
                  <h4 className="font-medium text-destructive">Low Attendance Warning</h4>
                  <p className="text-sm text-destructive/80">
                    Your attendance is below VTU requirements (75%). You need to attend more classes to meet the minimum
                    requirement.
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">VTU Requirement: 75%</span>
              <span className="text-muted-foreground">
                Need {Math.max(0, Math.ceil(attendanceData.totalClasses * 0.75) - attendanceData.attendedClasses)} more
                classes
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Attendance */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Attendance</CardTitle>
          <CardDescription>Your latest attendance records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {attendanceData.recentAttendance.map((record, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${record.status === "present" ? "bg-green-500" : "bg-red-500"}`}
                  />
                  <div>
                    <p className="font-medium">{record.subject}</p>
                    <p className="text-sm text-muted-foreground">{record.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={record.status === "present" ? "secondary" : "destructive"} className="text-xs">
                    {record.status === "present" ? "Present" : "Absent"}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">{record.time}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t">
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/dashboard/attendance">View Full Report</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
