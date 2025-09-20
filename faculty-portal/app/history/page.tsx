// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Badge } from "@/components/ui/badge"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { History, Search, Calendar, Clock } from "lucide-react"
// import { fetchAssignedSubjects, fetchAttendanceHistory } from "@/api/faculty"
// import { useToast } from "@/hooks/use-toast"
// import type { Faculty, Subject, AttendanceWithNames } from "@/lib/types"

// export default function AttendanceHistoryPage() {
//   const { toast } = useToast()

//   const [faculty, setFaculty] = useState<Faculty | null>(null)
//   const [subjects, setSubjects] = useState<Subject[]>([])
//   const [selectedSubject, setSelectedSubject] = useState("")
//   const [selectedDate, setSelectedDate] = useState("")
//   const [attendanceHistory, setAttendanceHistory] = useState<AttendanceWithNames[]>([])
//   const [loading, setLoading] = useState(false)
//   const [historyLoaded, setHistoryLoaded] = useState(false)

//   useEffect(() => {
//     const facultyData = localStorage.getItem("faculty")
//     if (facultyData) {
//       const parsedFaculty = JSON.parse(facultyData)
//       setFaculty(parsedFaculty)
//       loadSubjects(parsedFaculty)
//     }
//   }, [])

//   const loadSubjects = async (facultyData: Faculty) => {
//     try {
//       const response = await fetchAssignedSubjects(facultyData.faculty_id)
//       if (response.ok && response.data) {
//         setSubjects(response.data)
//       }
//     } catch (error) {
//       console.error("Error loading subjects:", error)
//     }
//   }

//   const handleSearchHistory = async () => {
//     if (!selectedSubject || !selectedDate) {
//       toast({
//         title: "Missing Information",
//         description: "Please select both subject and date",
//         variant: "destructive",
//       })
//       return
//     }

//     setLoading(true)
//     try {
//       const response = await fetchAttendanceHistory(Number.parseInt(selectedSubject), selectedDate)

//       if (response.ok && response.data) {
//         setAttendanceHistory(response.data)
//         setHistoryLoaded(true)
//         toast({
//           title: "Success",
//           description: "Attendance history loaded successfully",
//         })
//       } else {
//         toast({
//           title: "Error",
//           description: response.message || "Failed to fetch attendance history",
//           variant: "destructive",
//         })
//         setAttendanceHistory([])
//         setHistoryLoaded(true)
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "An error occurred while fetching attendance history",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const formatDateToIST = (dateString: string) => {
//     const date = new Date(dateString)
//     return date.toLocaleDateString("en-IN", {
//       weekday: "short",
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     })
//   }

//   const formatTimeToIST = (dateString: string) => {
//     const date = new Date(dateString)
//     return date.toLocaleTimeString("en-IN", {
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     })
//   }

//   const selectedSubjectInfo = subjects.find((s) => s.subject_id === Number.parseInt(selectedSubject))
//   const presentCount = attendanceHistory.filter((a) => a.status === "PRESENT").length
//   const absentCount = attendanceHistory.filter((a) => a.status === "ABSENT").length

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div>
//         <h1 className="text-3xl font-bold text-foreground">Attendance History</h1>
//         <p className="text-muted-foreground mt-1">View past attendance records for your subjects</p>
//       </div>

//       {/* Search Controls */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Search className="h-5 w-5" />
//             Search Attendance History
//           </CardTitle>
//           <CardDescription>Select subject and date to view attendance records</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="subject">Subject</Label>
//               <Select value={selectedSubject} onValueChange={setSelectedSubject}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select subject" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {subjects.map((subject) => (
//                     <SelectItem key={subject.subject_id} value={subject.subject_id.toString()}>
//                       {subject.subject_code} - {subject.subject_name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="date">Date</Label>
//               <Input
//                 id="date"
//                 type="date"
//                 value={selectedDate}
//                 onChange={(e) => setSelectedDate(e.target.value)}
//                 max={new Date().toISOString().split("T")[0]}
//               />
//             </div>
//           </div>

//           <Button onClick={handleSearchHistory} disabled={loading || !selectedSubject || !selectedDate}>
//             {loading ? (
//               <>
//                 <History className="mr-2 h-4 w-4 animate-spin" />
//                 Searching...
//               </>
//             ) : (
//               <>
//                 <Search className="mr-2 h-4 w-4" />
//                 Search History
//               </>
//             )}
//           </Button>
//         </CardContent>
//       </Card>

//       {/* Selected Subject Info */}
//       {selectedSubjectInfo && (
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Calendar className="h-5 w-5" />
//               {selectedSubjectInfo.subject_code} - {selectedSubjectInfo.subject_name}
//             </CardTitle>
//             <CardDescription>
//               {selectedSubjectInfo.department} • Semester {selectedSubjectInfo.sem}
//               {selectedDate && ` • ${formatDateToIST(selectedDate)}`}
//             </CardDescription>
//           </CardHeader>
//         </Card>
//       )}

//       {/* Attendance Summary */}
//       {historyLoaded && attendanceHistory.length > 0 && (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">Total Students</CardTitle>
//               <History className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{attendanceHistory.length}</div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">Present</CardTitle>
//               <div className="h-4 w-4 bg-green-600 rounded-full" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-green-600">{presentCount}</div>
//               <p className="text-xs text-muted-foreground">
//                 {attendanceHistory.length > 0 ? Math.round((presentCount / attendanceHistory.length) * 100) : 0}%
//               </p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">Absent</CardTitle>
//               <div className="h-4 w-4 bg-red-600 rounded-full" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-red-600">{absentCount}</div>
//               <p className="text-xs text-muted-foreground">
//                 {attendanceHistory.length > 0 ? Math.round((absentCount / attendanceHistory.length) * 100) : 0}%
//               </p>
//             </CardContent>
//           </Card>
//         </div>
//       )}

//       {/* Attendance History Table */}
//       {historyLoaded && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Attendance Records</CardTitle>
//             <CardDescription>
//               {attendanceHistory.length > 0
//                 ? `Showing ${attendanceHistory.length} attendance records`
//                 : "No attendance records found for the selected criteria"}
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             {attendanceHistory.length > 0 ? (
//               <div className="rounded-md border">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Student Name</TableHead>
//                       <TableHead>USN</TableHead>
//                       <TableHead>Date (IST)</TableHead>
//                       <TableHead>Status</TableHead>
//                       <TableHead>Recorded At (IST)</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {attendanceHistory.map((record) => (
//                       <TableRow key={record.attendance_id}>
//                         <TableCell className="font-medium">{record.student_name}</TableCell>
//                         <TableCell>{record.usn}</TableCell>
//                         <TableCell>{formatDateToIST(record.date)}</TableCell>
//                         <TableCell>
//                           <Badge variant={record.status === "PRESENT" ? "default" : "destructive"}>
//                             {record.status}
//                           </Badge>
//                         </TableCell>
//                         <TableCell className="flex items-center gap-2">
//                           <Clock className="h-4 w-4 text-muted-foreground" />
//                           {formatTimeToIST(record.recorded_at)}
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </div>
//             ) : (
//               <Alert>
//                 <History className="h-4 w-4" />
//                 <AlertDescription>
//                   No attendance records found for the selected subject and date. Try selecting a different date or
//                   subject.
//                 </AlertDescription>
//               </Alert>
//             )}
//           </CardContent>
//         </Card>
//       )}

//       {!historyLoaded && (
//         <Alert>
//           <Search className="h-4 w-4" />
//           <AlertDescription>
//             Select a subject and date, then click "Search History" to view past attendance records.
//           </AlertDescription>
//         </Alert>
//       )}
//     </div>
//   )
// }
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { History, Search, Calendar, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Faculty, Subject, AttendanceWithNames } from "@/lib/types"

export default function AttendanceHistoryPage() {
  const { toast } = useToast()

  const [faculty, setFaculty] = useState<Faculty | null>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceWithNames[]>([])
  const [loading, setLoading] = useState(false)
  const [historyLoaded, setHistoryLoaded] = useState(false)

  const API_BASE = "http://localhost:8080"

  // Load faculty from localStorage and fetch subjects
  useEffect(() => {
    const facultyData = localStorage.getItem("faculty")
    const token = localStorage.getItem("token")
    if (facultyData && token) {
      const parsedFaculty = JSON.parse(facultyData)
      setFaculty(parsedFaculty)
      fetchSubjects(token)
    }
  }, [])

  // Fetch subjects for faculty
const fetchSubjects = async (token: string) => {
  try {
    const res = await fetch(`${API_BASE}/subjects/faculty`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) throw new Error("Failed to fetch subjects")

    const data = await res.json()
    console.log("Subjects fetched:", data)

    // If backend wraps in "data", extract it:
    setSubjects(Array.isArray(data) ? data : data.data || [])
  } catch (error) {
    console.error(error)
    toast({
      title: "Error",
      description: "Unable to load subjects",
      variant: "destructive",
    })
  }
}




  // Fetch attendance for selected subject and date
const handleSearchHistory = async () => {
  if (!selectedSubject || !selectedDate) {
    toast({
      title: "Missing Information",
      description: "Please select both subject and date",
      variant: "destructive",
    })
    return
  }

  setLoading(true)
  setHistoryLoaded(false)
  try {
    const token = localStorage.getItem("token")
    const res = await fetch(
      `${API_BASE}/attendance/subject?subjectCode=${selectedSubject}&date=${selectedDate}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    const json = await res.json()
    if (!res.ok) throw new Error(json.error || "Failed to fetch attendance history")

    // Ensure array
    const attendanceArray = Array.isArray(json) ? json : json.data || []
    setAttendanceHistory(attendanceArray)
    setHistoryLoaded(true)

    toast({ title: "Success", description: "Attendance history loaded successfully" })
  } catch (error: any) {
    console.error(error)
    setAttendanceHistory([]) // fallback to empty array
    setHistoryLoaded(true)
    toast({
      title: "Error",
      description: error.message || "Failed to fetch attendance history",
      variant: "destructive",
    })
  } finally {
    setLoading(false)
  }
}


  const formatDateToIST = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", { weekday: "short", year: "numeric", month: "short", day: "numeric" })
  }

  const formatTimeToIST = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })
  }

  const selectedSubjectInfo = subjects.find((s) => s.subject_code === selectedSubject)
  const presentCount = attendanceHistory.filter((a) => a.status === "PRESENT").length
  const absentCount = attendanceHistory.filter((a) => a.status === "ABSENT").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Attendance History</h1>
        <p className="text-muted-foreground mt-1">View past attendance records for your subjects</p>
      </div>

      {/* Search Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Search className="h-5 w-5" /> Search Attendance History</CardTitle>
          <CardDescription>Select subject and date to view attendance records</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.subject_id} value={subject.subject_code}>
                      {subject.subject_code} - {subject.subject_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} max={new Date().toISOString().split("T")[0]} />
            </div>
          </div>

          <Button onClick={handleSearchHistory} disabled={loading || !selectedSubject || !selectedDate}>
            {loading ? <><History className="mr-2 h-4 w-4 animate-spin" /> Searching...</> : <><Search className="mr-2 h-4 w-4" /> Search History</>}
          </Button>
        </CardContent>
      </Card>

      {/* Selected Subject Info */}
      {selectedSubjectInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" /> {selectedSubjectInfo.subject_code} - {selectedSubjectInfo.subject_name}</CardTitle>
            <CardDescription>{selectedSubjectInfo.department} • Semester {selectedSubjectInfo.sem} {selectedDate && `• ${formatDateToIST(selectedDate)}`}</CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Attendance Summary */}
      {historyLoaded && attendanceHistory.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <History className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{attendanceHistory.length}</div></CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Present</CardTitle>
              <div className="h-4 w-4 bg-green-600 rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{presentCount}</div>
              <p className="text-xs text-muted-foreground">{Math.round((presentCount / attendanceHistory.length) * 100)}%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Absent</CardTitle>
              <div className="h-4 w-4 bg-red-600 rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{absentCount}</div>
              <p className="text-xs text-muted-foreground">{Math.round((absentCount / attendanceHistory.length) * 100)}%</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Attendance Table */}
      {historyLoaded && (
        <Card>
          <CardHeader>
            <CardTitle>Attendance Records</CardTitle>
            <CardDescription>{attendanceHistory.length > 0 ? `Showing ${attendanceHistory.length} records` : "No attendance records found"}</CardDescription>
          </CardHeader>
          <CardContent>
            {attendanceHistory.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>USN</TableHead>
                      <TableHead>Date (IST)</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Recorded At (IST)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceHistory.map((record) => (
                      <TableRow key={record.attendance_id}>
                        <TableCell>{record.student_name}</TableCell>
                        <TableCell>{record.usn}</TableCell>
                        <TableCell>{formatDateToIST(record.date)}</TableCell>
                        <TableCell><Badge variant={record.status === "PRESENT" ? "default" : "destructive"}>{record.status}</Badge></TableCell>
                        <TableCell className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" /> {formatTimeToIST(record.recorded_at)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <Alert>
                <History className="h-4 w-4" />
                <AlertDescription>No attendance records found for the selected subject and date.</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {!historyLoaded && (
        <Alert>
          <Search className="h-4 w-4" />
          <AlertDescription>Select a subject and date, then click "Search History" to view past attendance records.</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
