"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Building, Save, Edit } from "lucide-react"
import { updateProfile } from "@/api/faculty"
import { useToast } from "@/hooks/use-toast"
import type { Faculty } from "@/lib/types"

export default function ProfilePage() {
  const { toast } = useToast()

  const [faculty, setFaculty] = useState<Faculty | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
  })

  useEffect(() => {
    const facultyData = localStorage.getItem("faculty")
    if (facultyData) {
      const parsedFaculty = JSON.parse(facultyData)
      setFaculty(parsedFaculty)
      setFormData({
        name: parsedFaculty.name,
        email: parsedFaculty.email,
        department: parsedFaculty.department,
      })
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = async () => {
    if (!faculty) return

    setSaving(true)
    try {
      const response = await updateProfile(faculty.faculty_id, formData)

      if (response.ok && response.data) {
        const updatedFaculty = response.data
        setFaculty(updatedFaculty)
        localStorage.setItem("faculty", JSON.stringify(updatedFaculty))
        setIsEditing(false)

        toast({
          title: "Success",
          description: "Profile updated successfully",
        })
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update profile",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating profile",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (faculty) {
      setFormData({
        name: faculty.name,
        email: faculty.email,
        department: faculty.department,
      })
    }
    setIsEditing(false)
  }

  if (!faculty) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your faculty profile information</p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                  {faculty.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{faculty.name}</CardTitle>
                <CardDescription className="text-base">{faculty.department}</CardDescription>
                <Badge variant="outline" className="mt-2">
                  Faculty ID: {faculty.faculty_id}
                </Badge>
              </div>
            </div>
            <Button
              variant={isEditing ? "outline" : "default"}
              onClick={() => setIsEditing(!isEditing)}
              disabled={saving}
            >
              <Edit className="mr-2 h-4 w-4" />
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Profile Details */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            {isEditing ? "Update your profile information below" : "Your current profile information"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </Label>
              {isEditing ? (
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                />
              ) : (
                <p className="text-lg font-medium">{faculty.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              {isEditing ? (
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                />
              ) : (
                <p className="text-lg font-medium">{faculty.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="department" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Department
              </Label>
              {isEditing ? (
                <Input
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  placeholder="Enter your department"
                />
              ) : (
                <p className="text-lg font-medium">{faculty.department}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Faculty ID
              </Label>
              <p className="text-lg font-medium text-muted-foreground">{faculty.faculty_id}</p>
              <p className="text-sm text-muted-foreground">Faculty ID cannot be changed</p>
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-4 pt-4">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Save className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleCancel} disabled={saving}>
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Additional details about your faculty account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Account Type</Label>
              <p className="text-lg font-medium">Faculty Member</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Portal Access</Label>
              <p className="text-lg font-medium">Full Access</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Last Login</Label>
              <p className="text-lg font-medium">Today</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Account Status</Label>
              <Badge variant="default">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
