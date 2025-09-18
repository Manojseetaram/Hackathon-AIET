"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, Calendar, TrendingUp } from "lucide-react"
import type { HOD } from "@/lib/auth"
import { getFacultyByHOD } from "@/lib/faculty"
import { getSubjectsByHOD } from "@/lib/subjects"

interface DashboardOverviewProps {
  user: HOD
}

export function DashboardOverview({ user }: DashboardOverviewProps) {
  const [stats, setStats] = useState({
    totalFaculty: 0,
    totalSubjects: 0,
    activeTimetables: 0,
    attendanceRate: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [user.hodId])

  const loadStats = async () => {
    try {
      const [facultyData, subjectData] = await Promise.all([getFacultyByHOD(user.hodId), getSubjectsByHOD(user.hodId)])

      const assignedSubjects = subjectData.filter((s) => s.facultyId)

      setStats({
        totalFaculty: facultyData.length,
        totalSubjects: subjectData.length,
        activeTimetables: 0, // Will be updated when timetable data is available
        attendanceRate: 0, // Will be calculated from actual attendance data
      })
    } catch (error) {
      console.error("Error loading dashboard stats:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Welcome back, {user.name}!</h2>
        <p className="text-muted-foreground">Here's what's happening in the {user.department} department today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Faculty</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.totalFaculty}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalFaculty === 0 ? "Add your first faculty" : "Active faculty members"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.totalSubjects}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalSubjects === 0 ? "Create your first subject" : "Across all semesters"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Timetables</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.activeTimetables}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeTimetables === 0 ? "Upload timetables" : "Semester timetables"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.attendanceRate}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.attendanceRate === 0 ? "No data yet" : "Average attendance"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Faculty Activity</CardTitle>
            <CardDescription>Latest updates from your faculty members</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.totalFaculty === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No faculty activity yet</p>
                <p className="text-sm text-muted-foreground">Activity will appear here once you add faculty members</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Activity tracking coming soon</p>
                <p className="text-sm text-muted-foreground">Real-time faculty activity will be displayed here</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you might want to perform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4 hover:bg-accent/5 cursor-pointer transition-colors">
                <div className="text-center">
                  <Users className="h-6 w-6 mx-auto mb-2 text-accent" />
                  <p className="text-sm font-medium">Add Faculty</p>
                </div>
              </Card>
              <Card className="p-4 hover:bg-accent/5 cursor-pointer transition-colors">
                <div className="text-center">
                  <BookOpen className="h-6 w-6 mx-auto mb-2 text-accent" />
                  <p className="text-sm font-medium">Add Subject</p>
                </div>
              </Card>
              <Card className="p-4 hover:bg-accent/5 cursor-pointer transition-colors">
                <div className="text-center">
                  <Calendar className="h-6 w-6 mx-auto mb-2 text-accent" />
                  <p className="text-sm font-medium">Upload Timetable</p>
                </div>
              </Card>
              <Card className="p-4 hover:bg-accent/5 cursor-pointer transition-colors">
                <div className="text-center">
                  <TrendingUp className="h-6 w-6 mx-auto mb-2 text-accent" />
                  <p className="text-sm font-medium">View Reports</p>
                </div>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
