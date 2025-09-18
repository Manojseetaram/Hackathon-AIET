"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Mail, Trash2, User, BookOpen, BarChart3 } from "lucide-react"
import { deleteFaculty, type Faculty } from "@/lib/faculty"
import { useToast } from "@/hooks/use-toast"
import { FacultyDetailsModal } from "@/components/faculty/faculty-details-modal"

interface FacultyCardProps {
  faculty: Faculty
  onFacultyDeleted: () => void
  onFacultyClick: (faculty: Faculty) => void
}

export function FacultyCard({ faculty, onFacultyDeleted, onFacultyClick }: FacultyCardProps) {
  const [deleting, setDeleting] = useState(false)
  const [facultyDetailsOpen, setFacultyDetailsOpen] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const result = await deleteFaculty(faculty.id)
      if (result.success) {
        toast({
          title: "Faculty Deleted",
          description: `${faculty.name} has been successfully removed from the system.`,
        })
        onFacultyDeleted()
      } else {
        toast({
          title: "Delete Failed",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting faculty",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
    }
  }

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setFacultyDetailsOpen(true)
  }

  return (
    <>
      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleCardClick}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/professional-avatar.png" />
                <AvatarFallback className="bg-accent text-accent-foreground">
                  {faculty.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{faculty.name}</CardTitle>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {faculty.facultyId}
                </p>
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
                  <AlertDialogTitle>Delete Faculty Member</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to permanently delete <strong>{faculty.name}</strong>? This will remove all
                    their subject assignments and cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={deleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {deleting ? "Deleting..." : "Delete Permanently"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-3 w-3" />
            {faculty.email}
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm font-medium mb-2">
              <BookOpen className="h-3 w-3" />
              Assigned Subjects ({faculty.assignedSubjects.length})
            </div>
            <div className="flex flex-wrap gap-1">
              {faculty.assignedSubjects.length > 0 ? (
                faculty.assignedSubjects.map((subject) => (
                  <Badge key={subject} variant="secondary" className="text-xs">
                    {subject}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">No subjects assigned</span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="text-xs text-muted-foreground">Created: {faculty.createdAt.toLocaleDateString()}</div>
            <div className="flex items-center gap-1 text-xs text-accent">
              <BarChart3 className="h-3 w-3" />
              View Records
            </div>
          </div>
        </CardContent>
      </Card>

      <FacultyDetailsModal open={facultyDetailsOpen} onOpenChange={setFacultyDetailsOpen} facultyId={faculty.id} />
    </>
  )
}
