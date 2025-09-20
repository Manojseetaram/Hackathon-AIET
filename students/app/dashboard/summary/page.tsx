"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react"

// Mock subject summary data
const mockSubjectSummary = [
  {
    subject_id: 1,
    subject_name: "Data Structures and Algorithms",
    total_classes: 45,
    attended: 42,
    percentage: 93.33,
  },
  {
    subject_id: 2,
    subject_name: "Database Management Systems",
    total_classes: 40,
    attended: 35,
    percentage: 87.5,
  },
  {
    subject_id: 3,
    subject_name: "Computer Networks",
    total_classes: 38,
    attended: 30,
    percentage: 78.95,
  },
  {
    subject_id: 4,
    subject_name: "Software Engineering",
    total_classes: 42,
    attended: 38,
    percentage: 90.48,
  },
]

const chartData = mockSubjectSummary.map((subject) => ({
  name: subject.subject_name.split(" ").slice(0, 2).join(" "),
  percentage: subject.percentage,
  attended: subject.attended,
  total: subject.total_classes,
}))

const pieData = [
  { name: "Present", value: 145, color: "#3e39cc" },
  { name: "Absent", value: 20, color: "#be123c" },
  { name: "Late", value: 5, color: "#8b5cf6" },
]

export default function AttendanceSummaryPage() {
  const overallAttendance = mockSubjectSummary.reduce(
    (acc, subject) => {
      acc.totalClasses += subject.total_classes
      acc.attendedClasses += subject.attended
      return acc
    },
    { totalClasses: 0, attendedClasses: 0 },
  )

  const overallPercentage = (overallAttendance.attendedClasses / overallAttendance.totalClasses) * 100

  const getAttendanceStatus = (percentage: number) => {
    if (percentage >= 90) return { status: "Excellent", color: "text-green-600", icon: CheckCircle }
    if (percentage >= 80) return { status: "Good", color: "text-blue-600", icon: TrendingUp }
    if (percentage >= 75) return { status: "Warning", color: "text-yellow-600", icon: AlertTriangle }
    return { status: "Critical", color: "text-red-600", icon: TrendingDown }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">Attendance Summary</h1>
          <p className="text-muted-foreground">Overview of your attendance across all subjects</p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallPercentage.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                {overallAttendance.attendedClasses} of {overallAttendance.totalClasses} classes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallAttendance.totalClasses}</div>
              <p className="text-xs text-muted-foreground">Across all subjects</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Classes Attended</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{overallAttendance.attendedClasses}</div>
              <p className="text-xs text-muted-foreground">Present + Late</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Classes Missed</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {overallAttendance.totalClasses - overallAttendance.attendedClasses}
              </div>
              <p className="text-xs text-muted-foreground">Absent</p>
            </CardContent>
          </Card>
        </div>

        {/* Subject-wise Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Subject-wise Attendance</CardTitle>
            <CardDescription>Detailed breakdown of attendance for each subject</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {mockSubjectSummary.map((subject) => {
                const status = getAttendanceStatus(subject.percentage)
                const StatusIcon = status.icon
                return (
                  <div key={subject.subject_id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{subject.subject_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {subject.attended} of {subject.total_classes} classes attended
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={subject.percentage >= 75 ? "default" : "destructive"} className="gap-1">
                          <StatusIcon className="h-3 w-3" />
                          {status.status}
                        </Badge>
                        <span className="text-lg font-semibold">{subject.percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                    <Progress value={subject.percentage} className="h-2" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance by Subject</CardTitle>
              <CardDescription>Percentage comparison across subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="percentage" fill="#3e39cc" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Overall Distribution</CardTitle>
              <CardDescription>Breakdown of attendance status</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
