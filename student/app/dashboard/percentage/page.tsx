"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, TrendingUp, TrendingDown, Calendar } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface AttendanceData {
  month: string
  percentage: number
  present: number
  total: number
}

interface SubjectAttendance {
  subject: string
  percentage: number
  present: number
  total: number
}

const mockMonthlyData: AttendanceData[] = [
  { month: "Aug", percentage: 85, present: 17, total: 20 },
  { month: "Sep", percentage: 78, present: 23, total: 30 },
  { month: "Oct", percentage: 82, present: 28, total: 34 },
  { month: "Nov", percentage: 75, present: 21, total: 28 },
  { month: "Dec", percentage: 88, present: 22, total: 25 },
  { month: "Jan", percentage: 80, present: 16, total: 20 },
]

const mockSubjectData: SubjectAttendance[] = [
  { subject: "Data Structures", percentage: 85, present: 17, total: 20 },
  { subject: "Computer Networks", percentage: 78, present: 14, total: 18 },
  { subject: "Database Systems", percentage: 90, present: 18, total: 20 },
  { subject: "Software Engineering", percentage: 72, present: 13, total: 18 },
  { subject: "Machine Learning", percentage: 88, present: 15, total: 17 },
  { subject: "Web Technologies", percentage: 65, present: 11, total: 17 },
]

export default function AttendancePercentagePage() {
  const [monthlyData, setMonthlyData] = useState<AttendanceData[]>([])
  const [subjectData, setSubjectData] = useState<SubjectAttendance[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data loading
    setTimeout(() => {
      setMonthlyData(mockMonthlyData)
      setSubjectData(mockSubjectData)
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">Attendance Percentage</h1>
          <p className="text-muted-foreground text-pretty">Loading your attendance analytics...</p>
        </div>
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-muted rounded-lg"></div>
          <div className="h-96 bg-muted rounded-lg"></div>
        </div>
      </div>
    )
  }

  const currentPercentage = monthlyData[monthlyData.length - 1]?.percentage || 0
  const previousPercentage = monthlyData[monthlyData.length - 2]?.percentage || 0
  const trend = currentPercentage - previousPercentage
  const isLowAttendance = currentPercentage < 75
  const lowAttendanceSubjects = subjectData.filter((subject) => subject.percentage < 75)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Attendance Percentage</h1>
        <p className="text-muted-foreground text-pretty">Track your attendance trends and subject-wise performance</p>
      </div>

      {/* Current Status */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Percentage</CardTitle>
            {trend >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              {currentPercentage}%
              <Badge variant={trend >= 0 ? "secondary" : "destructive"} className="text-xs">
                {trend >= 0 ? "+" : ""}
                {trend.toFixed(1)}%
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">From last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">VTU Requirement</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75%</div>
            <p className="text-xs text-muted-foreground">Minimum required</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <div className={`w-3 h-3 rounded-full ${isLowAttendance ? "bg-red-500" : "bg-green-500"}`}></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLowAttendance ? "Below" : "Above"}</div>
            <p className="text-xs text-muted-foreground">VTU requirement</p>
          </CardContent>
        </Card>
      </div>

      {/* Warning for low attendance */}
      {isLowAttendance && (
        <Card className="border-destructive/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
              <div>
                <h4 className="font-medium text-destructive mb-1">Low Attendance Warning</h4>
                <p className="text-sm text-destructive/80">
                  Your attendance is below VTU requirements (75%). You need to improve your attendance to meet the
                  minimum requirement for semester eligibility.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Monthly Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Attendance Trend</CardTitle>
          <CardDescription>Your attendance percentage over the past 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="percentage"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey={75}
                  stroke="hsl(var(--destructive))"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Subject-wise Attendance */}
      <Card>
        <CardHeader>
          <CardTitle>Subject-wise Attendance</CardTitle>
          <CardDescription>Attendance percentage for each subject</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            {subjectData.map((subject) => (
              <div key={subject.subject} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{subject.subject}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {subject.present}/{subject.total}
                    </span>
                    <Badge variant={subject.percentage < 75 ? "destructive" : "secondary"} className="text-xs">
                      {subject.percentage}%
                    </Badge>
                  </div>
                </div>
                <Progress value={subject.percentage} className="h-2" />
              </div>
            ))}
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="subject" className="text-muted-foreground" angle={-45} textAnchor="end" height={100} />
                <YAxis className="text-muted-foreground" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="percentage" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Low Attendance Subjects Warning */}
      {lowAttendanceSubjects.length > 0 && (
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Subjects Below 75%</CardTitle>
            <CardDescription>These subjects need immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowAttendanceSubjects.map((subject) => (
                <div
                  key={subject.subject}
                  className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{subject.subject}</p>
                    <p className="text-sm text-muted-foreground">
                      {subject.present} of {subject.total} classes attended
                    </p>
                  </div>
                  <Badge variant="destructive">{subject.percentage}%</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
