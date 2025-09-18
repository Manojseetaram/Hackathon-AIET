"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Check, X, Mail, Eye, Clock, AlertCircle } from "lucide-react"
import { fetchAttendanceRequests, resolveAttendanceRequest } from "@/api/faculty"
import { useToast } from "@/hooks/use-toast"
import type { Faculty, AttendanceRequest } from "@/lib/types"

export default function AttendanceRequestsPage() {
  const { toast } = useToast()

  const [faculty, setFaculty] = useState<Faculty | null>(null)
  const [requests, setRequests] = useState<AttendanceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [processingRequest, setProcessingRequest] = useState<number | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<AttendanceRequest | null>(null)

  useEffect(() => {
    const facultyData = localStorage.getItem("faculty")
    if (facultyData) {
      const parsedFaculty = JSON.parse(facultyData)
      setFaculty(parsedFaculty)
      loadRequests(parsedFaculty)
    }
  }, [])

  const loadRequests = async (facultyData: Faculty) => {
    try {
      const response = await fetchAttendanceRequests(facultyData.faculty_id)
      if (response.ok && response.data) {
        setRequests(response.data)
      }
    } catch (error) {
      console.error("Error loading requests:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleResolveRequest = async (requestId: number, approve: boolean) => {
    setProcessingRequest(requestId)
    try {
      const response = await resolveAttendanceRequest(requestId, approve)

      if (response.ok) {
        // Update the request status in the local state
        setRequests((prev) =>
          prev.map((req) =>
            req.request_id === requestId ? { ...req, status: approve ? "APPROVED" : "REJECTED" } : req,
          ),
        )

        toast({
          title: "Success",
          description: `Request ${approve ? "approved" : "rejected"} successfully`,
        })
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to process request",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while processing the request",
        variant: "destructive",
      })
    } finally {
      setProcessingRequest(null)
    }
  }

  const formatDateToIST = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const pendingRequests = requests.filter((req) => req.status === "PENDING")
  const approvedRequests = requests.filter((req) => req.status === "APPROVED")
  const rejectedRequests = requests.filter((req) => req.status === "REJECTED")

  if (!faculty) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Attendance Requests</h1>
        <p className="text-muted-foreground mt-1">Review and manage student attendance change requests</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requests.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingRequests.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <Check className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedRequests.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <X className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{rejectedRequests.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Change Requests</CardTitle>
          <CardDescription>
            {requests.length > 0 ? `Showing ${requests.length} attendance requests` : "No attendance requests found"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : requests.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>USN</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Current Status</TableHead>
                    <TableHead>Requested Status</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.request_id}>
                      <TableCell className="font-medium">{request.usn}</TableCell>
                      <TableCell>{request.student_name}</TableCell>
                      <TableCell>{request.subject_name}</TableCell>
                      <TableCell>{formatDateToIST(request.date)}</TableCell>
                      <TableCell>
                        <Badge variant={request.current_status === "PRESENT" ? "default" : "destructive"}>
                          {request.current_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={request.requested_status === "PRESENT" ? "default" : "destructive"}>
                          {request.requested_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            request.status === "PENDING"
                              ? "outline"
                              : request.status === "APPROVED"
                                ? "default"
                                : "destructive"
                          }
                        >
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {/* View Details Dialog */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedRequest(request)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Request Details</DialogTitle>
                                <DialogDescription>Full information about the attendance request</DialogDescription>
                              </DialogHeader>
                              {selectedRequest && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground">Student</p>
                                      <p className="font-medium">{selectedRequest.student_name}</p>
                                      <p className="text-sm text-muted-foreground">{selectedRequest.usn}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground">Subject</p>
                                      <p className="font-medium">{selectedRequest.subject_name}</p>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground">Date</p>
                                      <p className="font-medium">{formatDateToIST(selectedRequest.date)}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                                      <Badge
                                        variant={
                                          selectedRequest.status === "PENDING"
                                            ? "outline"
                                            : selectedRequest.status === "APPROVED"
                                              ? "default"
                                              : "destructive"
                                        }
                                      >
                                        {selectedRequest.status}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground">Current Status</p>
                                      <Badge
                                        variant={
                                          selectedRequest.current_status === "PRESENT" ? "default" : "destructive"
                                        }
                                      >
                                        {selectedRequest.current_status}
                                      </Badge>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground">Requested Status</p>
                                      <Badge
                                        variant={
                                          selectedRequest.requested_status === "PRESENT" ? "default" : "destructive"
                                        }
                                      >
                                        {selectedRequest.requested_status}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Reason</p>
                                    <p className="mt-1 p-3 bg-muted rounded-lg">{selectedRequest.reason}</p>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          {/* Action Buttons */}
                          {request.status === "PENDING" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleResolveRequest(request.request_id, true)}
                                disabled={processingRequest === request.request_id}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleResolveRequest(request.request_id, false)}
                                disabled={processingRequest === request.request_id}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No attendance requests found. Students can submit requests for attendance changes which will appear here
                for your review.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
