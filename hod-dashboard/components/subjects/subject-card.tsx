"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { BookOpen, User, Trash2, GraduationCap, Clock, BarChart3 } from "lucide-react"
import { deleteSubject, assignFacultyToSubject, type Subject } from "@/lib/subjects"
import { getFacultyByHOD, type Faculty } from "@/lib/faculty"
import { useToast } from "@/hooks/use-toast"
import { useEffect } from "react"
import { AttendanceModal } from "@/components/attendance/attendance-modal"

interface SubjectCardProps {
  subject: Subject
  hodId: string
  onSubjectDeleted: () => void
  onSubjectUpdated: () => void
}

export function SubjectCard({ subject, hodId, onSubjectDeleted, onSubjectUpdated }: SubjectCardProps) {
  const [deleting, setDeleting] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [faculty, setFaculty] = useState<Faculty[]>([])
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const loadFaculty = async () => {
      try {
        const facultyData = await getFacultyByHOD(hodId)
        setFaculty(facultyData)
      } catch (error) {
        console.error("Error loading faculty:", error)
      }
    }
    loadFaculty()
  }, [hodId])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const result = await deleteSubject(subject.id)
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        onSubjectDeleted()
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
        description: "An error occurred while deleting subject",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
    }
  }

  const handleFacultyChange = async (facultyId: string) => {
    setUpdating(true)
    try {
      const selectedFaculty = faculty.find((f) => f.id === facultyId)
      const result = await assignFacultyToSubject(
        subject.id,
        facultyId === "unassigned" ? null : facultyId,
        selectedFaculty?.name,
      )
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        onSubjectUpdated()
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
        description: "An error occurred while updating faculty assignment",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on interactive elements
    if ((e.target as HTMLElement).closest('button, select, [role="combobox"]')) {
      return
    }
    setAttendanceModalOpen(true)
  }

  return (
    <>
      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleCardClick}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <BookOpen className="h-5 w-5 text-accent" />
              </div>
              <div>
                <CardTitle className="text-lg">{subject.name}</CardTitle>
                <p className="text-sm text-muted-foreground font-mono">{subject.code}</p>
              </div>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Subject</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete {subject.name} ({subject.code})? This action cannot be undone.
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
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-sm">
                <GraduationCap className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Sem {subject.semester}</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">{subject.credits} Credits</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Assigned Faculty:</span>
            </div>

            <Select value={subject.facultyId || "unassigned"} onValueChange={handleFacultyChange} disabled={updating}>
              <SelectTrigger className="w-full" onClick={(e) => e.stopPropagation()}>
                <SelectValue placeholder="Select faculty member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">
                  <span className="text-muted-foreground">Unassigned</span>
                </SelectItem>
                {faculty.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.name} ({f.facultyId})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {subject.facultyName && (
              <Badge variant="secondary" className="text-xs">
                Currently: {subject.facultyName}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="text-xs text-muted-foreground">Created: {subject.createdAt.toLocaleDateString()}</div>
            <div className="flex items-center gap-1 text-xs text-accent">
              <BarChart3 className="h-3 w-3" />
              View Details
            </div>
          </div>
        </CardContent>
      </Card>

      <AttendanceModal
        open={attendanceModalOpen}
        onOpenChange={setAttendanceModalOpen}
        subjectId={subject.id}
        type="subject"
      />
    </>
  )
}
