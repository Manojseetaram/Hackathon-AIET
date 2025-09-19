"use client"

import type React from "react"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileUpload } from "@/components/file-upload"
import { Upload, FileText, Calendar, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface AbsenceRequest {
  id: string
  type: "medical" | "sports" | "hackathon" | "other"
  reason: string
  startDate: string
  endDate: string
  documents: File[]
  status: "pending" | "approved" | "rejected"
  submittedAt: Date
  reviewedAt?: Date
  reviewerComments?: string
}

const mockRequests: AbsenceRequest[] = [
  {
    id: "1",
    type: "medical",
    reason: "Fever and flu symptoms",
    startDate: "2024-01-10",
    endDate: "2024-01-12",
    documents: [],
    status: "approved",
    submittedAt: new Date("2024-01-09"),
    reviewedAt: new Date("2024-01-09"),
    reviewerComments: "Medical certificate verified. Request approved.",
  },
  {
    id: "2",
    type: "sports",
    reason: "Inter-college basketball tournament",
    startDate: "2024-01-15",
    endDate: "2024-01-17",
    documents: [],
    status: "pending",
    submittedAt: new Date("2024-01-08"),
  },
  {
    id: "3",
    type: "hackathon",
    reason: "National level hackathon participation",
    startDate: "2024-01-20",
    endDate: "2024-01-22",
    documents: [],
    status: "rejected",
    submittedAt: new Date("2024-01-05"),
    reviewedAt: new Date("2024-01-06"),
    reviewerComments: "Insufficient documentation provided.",
  },
]

export default function AbsenceRequestsPage() {
  const [requests, setRequests] = useState<AbsenceRequest[]>(mockRequests)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    type: "",
    reason: "",
    startDate: "",
    endDate: "",
    documents: [] as File[],
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsSubmitting(true)

    // Validation
    if (!formData.type || !formData.reason || !formData.startDate || !formData.endDate) {
      setError("Please fill in all required fields")
      setIsSubmitting(false)
      return
    }

    if (formData.documents.length === 0) {
      setError("Please upload at least one supporting document")
      setIsSubmitting(false)
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newRequest: AbsenceRequest = {
        id: Date.now().toString(),
        type: formData.type as any,
        reason: formData.reason,
        startDate: formData.startDate,
        endDate: formData.endDate,
        documents: formData.documents,
        status: "pending",
        submittedAt: new Date(),
      }

      setRequests((prev) => [newRequest, ...prev])
      setSuccess("Absence request submitted successfully!")
      setFormData({
        type: "",
        reason: "",
        startDate: "",
        endDate: "",
        documents: [],
      })
      setShowForm(false)
    } catch (err) {
      setError("Failed to submit request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "default"
      case "rejected":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "medical":
        return "Medical"
      case "sports":
        return "Sports"
      case "hackathon":
        return "Hackathon"
      default:
        return "Other"
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Absence Requests</h1>
            <p className="text-muted-foreground">Submit and track your absence requests with supporting documents</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Upload className="h-4 w-4" />
            New Request
          </Button>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* New Request Form */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Submit New Absence Request</CardTitle>
              <CardDescription>Fill in the details and upload supporting documents</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Request Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select request type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="medical">Medical</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="hackathon">Hackathon</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Absence *</Label>
                  <Textarea
                    id="reason"
                    placeholder="Provide detailed reason for your absence..."
                    value={formData.reason}
                    onChange={(e) => setFormData((prev) => ({ ...prev, reason: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Supporting Documents *</Label>
                  <FileUpload
                    onFilesChange={(files) => setFormData((prev) => ({ ...prev, documents: files }))}
                    acceptedTypes={[".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"]}
                    maxFiles={5}
                    maxSize={10 * 1024 * 1024} // 10MB
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload medical certificates, event invitations, or other supporting documents (PDF, Images, Word
                    docs, max 10MB each)
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Requests History */}
        <Card>
          <CardHeader>
            <CardTitle>Request History</CardTitle>
            <CardDescription>Track the status of your submitted absence requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Documents</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <Badge variant="outline">{getTypeLabel(request.type)}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={request.reason}>
                          {request.reason}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {new Date(request.startDate).toLocaleDateString()} -{" "}
                          {new Date(request.endDate).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(request.status)}
                          <Badge variant={getStatusBadgeVariant(request.status)}>{request.status}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {request.submittedAt.toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <FileText className="h-3 w-3" />
                          {request.documents.length} files
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
