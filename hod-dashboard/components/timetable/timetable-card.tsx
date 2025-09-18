"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Calendar, Download, Trash2, FileText, Clock } from "lucide-react"
import { deleteTimetable, formatFileSize, type Timetable } from "@/lib/timetable"
import { useToast } from "@/hooks/use-toast"

interface TimetableCardProps {
  timetable: Timetable
  onTimetableDeleted: () => void
}

export function TimetableCard({ timetable, onTimetableDeleted }: TimetableCardProps) {
  const [deleting, setDeleting] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const result = await deleteTimetable(timetable.id)
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        onTimetableDeleted()
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An error occurred while deleting timetable",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
    }
  }

  const handleDownload = () => {
    // TODO: Implement actual file download
    toast({
      title: "Download",
      description: "Download functionality will be implemented with backend integration",
    })
  }

  const getFileIcon = () => {
    const extension = timetable.fileName.split(".").pop()?.toLowerCase()
    return <FileText className="h-5 w-5 text-accent" />
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg">{getFileIcon()}</div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                Semester {timetable.semester}
                <Badge variant="secondary" className="text-xs">
                  {timetable.fileName.split(".").pop()?.toUpperCase()}
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground truncate max-w-48">{timetable.fileName}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={handleDownload} className="text-accent hover:text-accent">
              <Download className="h-4 w-4" />
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Timetable</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete the timetable for Semester {timetable.semester}? This action cannot
                    be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={deleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>File Size:</span>
          </div>
          <span className="font-medium">{formatFileSize(timetable.fileSize)}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Uploaded:</span>
          </div>
          <span className="font-medium">{timetable.uploadedAt.toLocaleDateString()}</span>
        </div>

        <div className="pt-2 border-t">
          <Button variant="outline" size="sm" onClick={handleDownload} className="w-full gap-2 bg-transparent">
            <Download className="h-3 w-3" />
            Download Timetable
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
