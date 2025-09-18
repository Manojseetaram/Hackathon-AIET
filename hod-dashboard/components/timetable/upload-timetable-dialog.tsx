"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, X, Loader2 } from "lucide-react"
import { uploadTimetable, isValidTimetableFile, formatFileSize } from "@/lib/timetable"
import { useToast } from "@/hooks/use-toast"

interface UploadTimetableDialogProps {
  hodId: string
  onTimetableUploaded: () => void
}

export function UploadTimetableDialog({ hodId, onTimetableUploaded }: UploadTimetableDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [semester, setSemester] = useState<number | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = isValidTimetableFile(file)
    if (!validation.valid) {
      setError(validation.error || "Invalid file")
      setSelectedFile(null)
      return
    }

    setSelectedFile(file)
    setError("")
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (!file) return

    const validation = isValidTimetableFile(file)
    if (!validation.valid) {
      setError(validation.error || "Invalid file")
      setSelectedFile(null)
      return
    }

    setSelectedFile(file)
    setError("")
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile || !semester) {
      setError("Please select a file and semester")
      return
    }

    setLoading(true)
    setError("")
    setUploadProgress(0)

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      const result = await uploadTimetable({ semester, file: selectedFile }, hodId)
      clearInterval(progressInterval)
      setUploadProgress(100)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        setSelectedFile(null)
        setSemester(null)
        setUploadProgress(0)
        setOpen(false)
        onTimetableUploaded()
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      } else {
        setError(result.message)
        setUploadProgress(0)
      }
    } catch (err) {
      clearInterval(progressInterval)
      setError("An error occurred while uploading timetable")
      setUploadProgress(0)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setSelectedFile(null)
    setSemester(null)
    setError("")
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen)
        if (!newOpen) {
          resetForm()
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Timetable
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Timetable</DialogTitle>
          <DialogDescription>Upload a timetable image or PDF for a specific semester.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="semester">Semester</Label>
            <Select value={semester?.toString() || ""} onValueChange={(value) => setSemester(Number.parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <SelectItem key={sem} value={sem.toString()}>
                    Semester {sem}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Timetable File</Label>
            <div
              className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent/50 transition-colors cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                className="hidden"
              />

              {selectedFile ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <FileText className="h-8 w-8 text-accent" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedFile(null)
                        if (fileInputRef.current) {
                          fileInputRef.current.value = ""
                        }
                      }}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-sm font-medium">{selectedFile.name}</div>
                  <div className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
                  <div className="text-sm font-medium">Click to upload or drag and drop</div>
                  <div className="text-xs text-muted-foreground">PDF, JPEG, JPG, PNG (max 10MB)</div>
                </div>
              )}
            </div>
          </div>

          {loading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !selectedFile || !semester}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Upload Timetable
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
