"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Users, TrendingUp, BookOpen, BarChart3 } from "lucide-react"
import {
  getAttendanceByFaculty,
  getAttendanceStats,
  type AttendanceRecord,
  type AttendanceStats,
} from "@/lib/attendance"
import { getFacultyById, type Faculty } from "@/lib/faculty"
import { getSubjectById, type Subject } from "@/lib/subjects"

interface AttendanceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  facultyId?: string
  subjectId?: string
  type: "faculty" | "subject"
}

export function AttendanceModal({ open, onOpenChange, facultyId, subjectId, type }: AttendanceModalProps) {
  const [loading, setLoading] = useState(true)
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [stats, setStats] = useState<AttendanceStats | null>(null)
  const [faculty, setFaculty] = useState<Faculty | null>(null)
  const [subject, setSubject] = useState<Subject | null>(null)

  useEffect(() => {
    if (open && (facultyId || subjectId)) {
      loadData()
    }
  }, [open, facultyId, subjectId])

  const loadData = async () => {
    setLoading(true)
    try {
      if (type === "faculty" && facultyId) {
        const [records, statsData, facultyData] = await Promise.all([
          getAttendanceByFaculty(facultyId),
          getAttendanceStats(facultyId),
          getFacultyById(facultyId),
        ])
        setAttendanceRecords(records)
        setStats(statsData)
        setFaculty(facultyData)
      } else if (type === "subject" && subjectId) {
        const [subjectData] = await Promise.all([getSubjectById(subjectId)])
        setSubject(subjectData)
        // For subjects, we'll show a different view
        setAttendanceRecords([])
        setStats(null)
      }
    } catch (error) {
      console.error("Error loading attendance data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getClassTypeColor = (type: string) => {
    switch (type) {
      case "lecture":
        return "bg-blue-100 text-blue-800"
      case "practical":
        return "bg-green-100 text-green-800"
      case "tutorial":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === "faculty" ? (
              <>
                <Users className="h-5 w-5" />
                {faculty?.name} - Class Records & Attendance
              </>
            ) : (
              <>
                <BookOpen className="h-5 w-5" />
                {subject?.code}: {subject?.name} - Subject Details
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
          </div>
        ) : type === "faculty" ? (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="records">Class Records</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Total Classes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalClasses || 0}</div>
                    <p className="text-xs text-muted-foreground">All time</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Total Hours
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{Math.round(stats?.totalHours || 0)}</div>
                    <p className="text-xs text-muted-foreground">Teaching hours</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Avg Attendance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{Math.round(stats?.averageAttendance || 0)}%</div>
                    <p className="text-xs text-muted-foreground">Student attendance</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      This Month
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.classesThisMonth || 0}</div>
                    <p className="text-xs text-muted-foreground">Classes taken</p>
                  </CardContent>
                </Card>
              </div>

              {attendanceRecords.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">No Class Records Yet</h3>
                    <p className="text-muted-foreground">
                      This faculty member hasn't conducted any classes yet. Records will appear here once classes are
                      taken.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Classes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {attendanceRecords.slice(0, 5).map((record) => (
                        <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Badge className={getClassTypeColor(record.classType)}>{record.classType}</Badge>
                            <div>
                              <p className="font-medium">
                                {record.subjectCode}: {record.subjectName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {record.date.toLocaleDateString()} • {record.duration} mins
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{record.attendancePercentage}%</p>
                            <p className="text-sm text-muted-foreground">
                              {record.studentsPresent}/{record.totalStudents}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="records" className="space-y-4">
              {attendanceRecords.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">No Class Records</h3>
                    <p className="text-muted-foreground">No class records found for this faculty member.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {attendanceRecords.map((record) => (
                    <Card key={record.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Badge className={getClassTypeColor(record.classType)}>{record.classType}</Badge>
                            <h3 className="font-medium">
                              {record.subjectCode}: {record.subjectName}
                            </h3>
                          </div>
                          <div className="text-sm text-muted-foreground">{record.date.toLocaleDateString()}</div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Duration</p>
                            <p className="font-medium">{record.duration} minutes</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Students Present</p>
                            <p className="font-medium">
                              {record.studentsPresent}/{record.totalStudents}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Attendance</p>
                            <p className="font-medium">{record.attendancePercentage}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Status</p>
                            <Badge variant={record.attendancePercentage >= 75 ? "default" : "destructive"}>
                              {record.attendancePercentage >= 75 ? "Good" : "Low"}
                            </Badge>
                          </div>
                        </div>

                        {record.notes && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-sm text-muted-foreground">Notes: {record.notes}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              {stats && Object.keys(stats.subjectWiseStats).length > 0 ? (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Subject-wise Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Object.entries(stats.subjectWiseStats).map(([subjectCode, subjectStats]) => (
                          <div key={subjectCode} className="border rounded-lg p-4">
                            <h4 className="font-medium mb-3">{subjectCode}</h4>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Classes</p>
                                <p className="text-xl font-bold">{subjectStats.classes}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Hours</p>
                                <p className="text-xl font-bold">{Math.round(subjectStats.hours)}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Avg Attendance</p>
                                <p className="text-xl font-bold">{Math.round(subjectStats.avgAttendance)}%</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">No Analytics Data</h3>
                    <p className="text-muted-foreground">Analytics will be available once class records are added.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          // Subject view
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Subject Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Subject Code</p>
                    <p className="font-medium">{subject?.code}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Subject Name</p>
                    <p className="font-medium">{subject?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Semester</p>
                    <p className="font-medium">{subject?.semester}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Credits</p>
                    <p className="font-medium">{subject?.credits}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Assigned Faculty</p>
                  <p className="font-medium">{subject?.facultyName || "Not assigned"}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Created Date</p>
                  <p className="font-medium">{subject?.createdAt.toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Class Records Coming Soon</h3>
                <p className="text-muted-foreground">
                  Subject-specific attendance and class records will be available once faculty starts conducting
                  classes.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
