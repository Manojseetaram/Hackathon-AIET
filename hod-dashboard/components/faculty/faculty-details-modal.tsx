"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Mail,
  Key,
  BookOpen,
  Calendar,
  Clock,
  TrendingUp,
  BarChart3,
  Eye,
  EyeOff,
  Copy,
  CheckCircle,
  GraduationCap,
  Award,
} from "lucide-react"
import { getFacultyById, type Faculty } from "@/lib/faculty"
import { getAttendanceStats, type AttendanceStats } from "@/lib/attendance"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface FacultyDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  facultyId: string
}

export function FacultyDetailsModal({ open, onOpenChange, facultyId }: FacultyDetailsModalProps) {
  const [loading, setLoading] = useState(true)
  const [faculty, setFaculty] = useState<Faculty | null>(null)
  const [stats, setStats] = useState<AttendanceStats | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (open && facultyId) {
      loadFacultyData()
    }
  }, [open, facultyId])

  const loadFacultyData = async () => {
    setLoading(true)
    try {
      const [facultyData, statsData] = await Promise.all([getFacultyById(facultyId), getAttendanceStats(facultyId)])
      setFaculty(facultyData)
      setStats(statsData)
    } catch (error) {
      console.error("Error loading faculty data:", error)
      toast({
        title: "Error",
        description: "Failed to load faculty details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      toast({
        title: "Copied!",
        description: `${field} copied to clipboard`,
      })
      setTimeout(() => setCopiedField(null), 2000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[95vh] sm:max-h-[90vh]">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!faculty) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[95vh] sm:max-h-[90vh]">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Faculty not found</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-w-[98vw] w-full max-h-[98vh] h-full overflow-hidden flex flex-col",
          "sm:max-w-6xl sm:w-[95vw] sm:max-h-[95vh] sm:h-auto",
          "md:max-w-5xl lg:max-w-6xl",
          "bg-gradient-to-br from-background via-background to-accent/5",
          "border-2 border-accent/20 shadow-2xl",
        )}
      >
        <DialogHeader className="flex-shrink-0 pb-4 border-b border-accent/20">
          <DialogTitle className="flex items-center gap-4 flex-wrap">
            <Avatar className="h-12 w-12 sm:h-14 sm:w-14 ring-2 ring-accent/30">
              <AvatarImage src="/professional-avatar.png" />
              <AvatarFallback className="bg-gradient-to-br from-accent to-accent/80 text-accent-foreground text-lg font-bold">
                {faculty.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
                {faculty.name}
              </h2>
              <div className="flex items-center gap-2 flex-wrap mt-1">
                <Badge variant="secondary" className="text-xs">
                  <GraduationCap className="h-3 w-3 mr-1" />
                  Faculty Member
                </Badge>
                <Badge variant="outline" className="text-xs">
                  ID: {faculty.facultyId}
                </Badge>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="details" className="w-full h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 flex-shrink-0 mb-4 bg-accent/10">
              <TabsTrigger value="details" className="text-xs sm:text-sm font-medium">
                <User className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Personal </span>Details
              </TabsTrigger>
              <TabsTrigger value="subjects" className="text-xs sm:text-sm font-medium">
                <BookOpen className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Subjects & </span>Classes
              </TabsTrigger>
              <TabsTrigger value="performance" className="text-xs sm:text-sm font-medium">
                <BarChart3 className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Performance </span>Analytics
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto pr-2">
              <TabsContent value="details" className="space-y-6 mt-0">
                <Card className="border-2 border-accent/20 bg-gradient-to-br from-card to-accent/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-accent">
                      <User className="h-5 w-5" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-muted/50 to-accent/10 rounded-lg border border-accent/20">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="p-2 bg-accent/20 rounded-full">
                              <User className="h-4 w-4 text-accent flex-shrink-0" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm text-muted-foreground font-medium">Faculty ID</p>
                              <p className="font-mono font-bold text-foreground truncate">{faculty.facultyId}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(faculty.facultyId, "Faculty ID")}
                            className="flex-shrink-0 hover:bg-accent/20"
                          >
                            {copiedField === "Faculty ID" ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-muted/50 to-accent/10 rounded-lg border border-accent/20">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="p-2 bg-accent/20 rounded-full">
                              <Mail className="h-4 w-4 text-accent flex-shrink-0" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm text-muted-foreground font-medium">Email Address</p>
                              <p className="font-medium text-foreground truncate">{faculty.email}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(faculty.email, "Email")}
                            className="flex-shrink-0 hover:bg-accent/20"
                          >
                            {copiedField === "Email" ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-muted/50 to-accent/10 rounded-lg border border-accent/20">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="p-2 bg-accent/20 rounded-full">
                              <Key className="h-4 w-4 text-accent flex-shrink-0" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm text-muted-foreground font-medium">Password</p>
                              <p className="font-mono font-bold text-foreground truncate">
                                {showPassword ? faculty.password : "••••••••"}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowPassword(!showPassword)}
                              className="hover:bg-accent/20"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(faculty.password, "Password")}
                              className="hover:bg-accent/20"
                            >
                              {copiedField === "Password" ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="p-4 bg-gradient-to-r from-muted/50 to-accent/10 rounded-lg border border-accent/20">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-accent/20 rounded-full">
                              <Calendar className="h-4 w-4 text-accent flex-shrink-0" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground font-medium">Joined Date</p>
                              <p className="font-medium text-foreground">{faculty.createdAt.toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <Card className="text-center bg-gradient-to-br from-card to-accent/5 border-accent/20">
                    <CardContent className="pt-4 sm:pt-6">
                      <div className="p-2 bg-accent/20 rounded-full w-fit mx-auto mb-2">
                        <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-accent" />
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-accent">{faculty.assignedSubjects.length}</div>
                      <p className="text-xs sm:text-sm text-muted-foreground font-medium">Subjects</p>
                    </CardContent>
                  </Card>
                  <Card className="text-center bg-gradient-to-br from-card to-accent/5 border-accent/20">
                    <CardContent className="pt-4 sm:pt-6">
                      <div className="p-2 bg-accent/20 rounded-full w-fit mx-auto mb-2">
                        <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-accent" />
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-accent">{stats?.totalClasses || 0}</div>
                      <p className="text-xs sm:text-sm text-muted-foreground font-medium">Classes</p>
                    </CardContent>
                  </Card>
                  <Card className="text-center bg-gradient-to-br from-card to-accent/5 border-accent/20">
                    <CardContent className="pt-4 sm:pt-6">
                      <div className="p-2 bg-accent/20 rounded-full w-fit mx-auto mb-2">
                        <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-accent" />
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-accent">
                        {Math.round(stats?.totalHours || 0)}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground font-medium">Hours</p>
                    </CardContent>
                  </Card>
                  <Card className="text-center bg-gradient-to-br from-card to-accent/5 border-accent/20">
                    <CardContent className="pt-4 sm:pt-6">
                      <div className="p-2 bg-accent/20 rounded-full w-fit mx-auto mb-2">
                        <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-accent" />
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-accent">
                        {Math.round(stats?.averageAttendance || 0)}%
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground font-medium">Attendance</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="subjects" className="space-y-6 mt-0">
                <Card className="bg-gradient-to-br from-card to-accent/5 border-accent/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-accent">
                      <BookOpen className="h-5 w-5" />
                      Assigned Subjects ({faculty.assignedSubjects.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {faculty.assignedSubjects.length > 0 ? (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {faculty.assignedSubjects.map((subject, index) => (
                          <div
                            key={index}
                            className="p-4 border-2 border-accent/20 rounded-lg bg-gradient-to-br from-muted/30 to-accent/10"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <Badge variant="secondary" className="bg-accent/20 text-accent font-medium">
                                {subject}
                              </Badge>
                              <div className="text-sm text-muted-foreground font-medium">
                                {stats?.subjectWiseStats[subject]?.classes || 0} classes
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground font-medium">Hours Taught</p>
                                <p className="font-bold text-accent">
                                  {Math.round(stats?.subjectWiseStats[subject]?.hours || 0)}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground font-medium">Avg Attendance</p>
                                <p className="font-bold text-accent">
                                  {Math.round(stats?.subjectWiseStats[subject]?.avgAttendance || 0)}%
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="p-4 bg-accent/20 rounded-full w-fit mx-auto mb-4">
                          <BookOpen className="h-12 w-12 text-accent" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">No Subjects Assigned</h3>
                        <p className="text-muted-foreground">This faculty member has no subjects assigned yet.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="performance" className="space-y-6 mt-0">
                {stats && stats.totalClasses > 0 ? (
                  <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card className="bg-gradient-to-br from-card to-accent/5 border-accent/20">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-accent">
                            <BarChart3 className="h-5 w-5" />
                            Teaching Performance
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                            <span className="text-sm font-medium">Total Classes</span>
                            <span className="font-bold text-accent">{stats.totalClasses}</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                            <span className="text-sm font-medium">Total Hours</span>
                            <span className="font-bold text-accent">{Math.round(stats.totalHours)}</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                            <span className="text-sm font-medium">This Month</span>
                            <span className="font-bold text-accent">{stats.classesThisMonth}</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-accent/10 rounded-lg border border-accent/20">
                            <span className="text-sm font-medium">Average Attendance</span>
                            <span className="font-bold text-accent text-lg">
                              {Math.round(stats.averageAttendance)}%
                            </span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-card to-accent/5 border-accent/20">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-accent">
                            <Award className="h-5 w-5" />
                            Performance Rating
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                          <div className="p-6 bg-gradient-to-br from-accent/20 to-accent/10 rounded-full w-fit mx-auto mb-4">
                            <div className="text-4xl sm:text-5xl font-bold text-accent">
                              {stats.averageAttendance >= 90
                                ? "A+"
                                : stats.averageAttendance >= 80
                                  ? "A"
                                  : stats.averageAttendance >= 70
                                    ? "B+"
                                    : stats.averageAttendance >= 60
                                      ? "B"
                                      : "C"}
                            </div>
                          </div>
                          <p className="text-sm font-medium text-muted-foreground">
                            {stats.averageAttendance >= 90
                              ? "Excellent Performance"
                              : stats.averageAttendance >= 80
                                ? "Very Good Performance"
                                : stats.averageAttendance >= 70
                                  ? "Good Performance"
                                  : stats.averageAttendance >= 60
                                    ? "Average Performance"
                                    : "Needs Improvement"}
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {Object.keys(stats.subjectWiseStats).length > 0 && (
                      <Card className="bg-gradient-to-br from-card to-accent/5 border-accent/20">
                        <CardHeader>
                          <CardTitle className="text-accent">Subject-wise Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {Object.entries(stats.subjectWiseStats).map(([subject, subjectStats]) => (
                              <div
                                key={subject}
                                className="p-4 border-2 border-accent/20 rounded-lg bg-gradient-to-r from-muted/30 to-accent/10"
                              >
                                <div className="flex justify-between items-center mb-3">
                                  <h4 className="font-medium text-foreground">{subject}</h4>
                                  <Badge
                                    variant={subjectStats.avgAttendance >= 75 ? "default" : "destructive"}
                                    className="font-bold"
                                  >
                                    {Math.round(subjectStats.avgAttendance)}%
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                  <div className="text-center p-2 bg-muted/50 rounded">
                                    <p className="text-muted-foreground font-medium">Classes</p>
                                    <p className="font-bold text-accent">{subjectStats.classes}</p>
                                  </div>
                                  <div className="text-center p-2 bg-muted/50 rounded">
                                    <p className="text-muted-foreground font-medium">Hours</p>
                                    <p className="font-bold text-accent">{Math.round(subjectStats.hours)}</p>
                                  </div>
                                  <div className="text-center p-2 bg-muted/50 rounded">
                                    <p className="text-muted-foreground font-medium">Performance</p>
                                    <p className="font-bold text-accent">
                                      {subjectStats.avgAttendance >= 90
                                        ? "Excellent"
                                        : subjectStats.avgAttendance >= 75
                                          ? "Good"
                                          : "Needs Attention"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </>
                ) : (
                  <Card className="bg-gradient-to-br from-card to-accent/5 border-accent/20">
                    <CardContent className="py-12 text-center">
                      <div className="p-4 bg-accent/20 rounded-full w-fit mx-auto mb-4">
                        <BarChart3 className="h-12 w-12 text-accent" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No Performance Data</h3>
                      <p className="text-muted-foreground">
                        Performance analytics will be available once this faculty starts conducting classes.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
