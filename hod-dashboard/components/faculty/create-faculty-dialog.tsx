"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { createFaculty, type CreateFacultyData } from "@/lib/faculty"
import { useToast } from "@/hooks/use-toast"

interface CreateFacultyDialogProps {
  hodId: string
  onFacultyCreated: () => void
}

export function CreateFacultyDialog({ hodId, onFacultyCreated }: CreateFacultyDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState<CreateFacultyData>({
    name: "",
    email: "",
    password: "",
    facultyId: "",
  })
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await createFaculty(formData, hodId)
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        setFormData({ name: "", email: "", password: "", facultyId: "" })
        setOpen(false)
        onFacultyCreated()
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError("An error occurred while creating faculty")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Faculty
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle> Faculty</DialogTitle>
          <DialogDescription>Add a new faculty member to your department.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter faculty name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter faculty email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create password for faculty"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="facultyId">Faculty ID</Label>
            <Input
              id="facultyId"
              name="facultyId"
              value={formData.facultyId}
              onChange={handleChange}
              placeholder="Enter unique faculty ID"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Faculty
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
