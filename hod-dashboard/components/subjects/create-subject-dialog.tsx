"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Loader2, Plus } from "lucide-react"
import { createSubject, type CreateSubjectData } from "@/lib/subjects"
import { getFacultyByHOD, type Faculty } from "@/lib/faculty"
import { useToast } from "@/hooks/use-toast"

interface CreateSubjectDialogProps {
  hodId: string
  onSubjectCreated: () => void
}

export function CreateSubjectDialog({ hodId, onSubjectCreated }: CreateSubjectDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [faculty, setFaculty] = useState<Faculty[]>([])
  const [formData, setFormData] = useState<CreateSubjectData>({
    name: "",
    code: "",
    facultyId: null,
    semester: 1,
    credits: 3,
  })
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
    if (open) {
      loadFaculty()
    }
  }, [open, hodId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "semester" || name === "credits" ? Number.parseInt(value) || 0 : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: name === "facultyId" ? (value === "unassigned" ? null : value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await createSubject(formData, hodId)
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        setFormData({ name: "", code: "", facultyId: null, semester: 1, credits: 3 })
        setOpen(false)
        onSubjectCreated()
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError("An error occurred while creating subject")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Subject
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Subject</DialogTitle>
          <DialogDescription>Add a new subject to your department curriculum.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Subject Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter subject name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Subject Code</Label>
            <Input
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Enter subject code (e.g., CS101)"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="facultyId">Assign Faculty</Label>
            <Select
              value={formData.facultyId || "unassigned"}
              onValueChange={(value) => handleSelectChange("facultyId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select faculty member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {faculty.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.name} ({f.facultyId})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <Select
                value={formData.semester.toString()}
                onValueChange={(value) => handleSelectChange("semester", value)}
              >
                <SelectTrigger>
                  <SelectValue />
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
              <Label htmlFor="credits">Credits</Label>
              <Input
                id="credits"
                name="credits"
                type="number"
                min="1"
                max="6"
                value={formData.credits}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Subject
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
