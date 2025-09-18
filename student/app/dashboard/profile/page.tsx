"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, User, Mail, GraduationCap, AlertTriangle, CheckCircle, Edit } from "lucide-react"
import Link from "next/link"

interface UserProfile {
  name: string
  usn: string
  email: string
  department: string
  avatar?: string
  faceRegistered: boolean
  joinDate: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // Mock profile data loading
    setTimeout(() => {
      const mockProfile: UserProfile = {
        name: "Alex Johnson",
        usn: "1MS21CS001",
        email: "alex.johnson@example.com",
        department: "Computer Science Engineering",
        avatar: "/student-avatar.png",
        faceRegistered: localStorage.getItem("faceRegistered") === "true",
        joinDate: "2024-01-10",
      }
      setProfile(mockProfile)
      setEditForm(mockProfile)
      setLoading(false)
    }, 1000)
  }, [])

  const handleSave = async () => {
    if (!editForm) return

    setSaving(true)
    // Mock save operation
    setTimeout(() => {
      setProfile(editForm)
      setIsEditing(false)
      setSaving(false)
    }, 1500)
  }

  const handleCancel = () => {
    setEditForm(profile)
    setIsEditing(false)
  }

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    if (!editForm) return
    setEditForm({ ...editForm, [field]: value })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">Profile</h1>
          <p className="text-muted-foreground text-pretty">Loading your profile information...</p>
        </div>
        <div className="animate-pulse space-y-6">
          <div className="h-48 bg-muted rounded-lg"></div>
          <div className="h-96 bg-muted rounded-lg"></div>
        </div>
      </div>
    )
  }

  if (!profile) return null

  const faceRecognitionStatus = profile.faceRegistered ? "active" : "pending"
  const canRecognizeFace = Math.random() > 0.3 // 70% success rate for demo

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Profile</h1>
        <p className="text-muted-foreground text-pretty">Manage your account information and settings</p>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
                <AvatarFallback className="text-2xl">
                  {profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <Button size="icon" variant="outline" className="absolute -bottom-2 -right-2 h-8 w-8 bg-transparent">
                <Camera className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 space-y-2">
              <div>
                <h2 className="text-2xl font-bold">{profile.name}</h2>
                <p className="text-muted-foreground">{profile.usn}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{profile.department}</Badge>
                <Badge variant={profile.faceRegistered ? "secondary" : "destructive"}>
                  {profile.faceRegistered ? "Face Registered" : "Face Pending"}
                </Badge>
              </div>
            </div>

            <div className="flex gap-2">
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Face Recognition Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Face Recognition Status
          </CardTitle>
          <CardDescription>Your face recognition setup for attendance tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {profile.faceRegistered ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                )}
                <div>
                  <p className="font-medium">
                    {profile.faceRegistered ? "Face Recognition Active" : "Face Registration Required"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {profile.faceRegistered
                      ? "Your face is registered and ready for attendance tracking"
                      : "Complete face registration to enable attendance tracking"}
                  </p>
                </div>
              </div>
              <Badge variant={profile.faceRegistered ? "secondary" : "destructive"}>
                {faceRecognitionStatus.toUpperCase()}
              </Badge>
            </div>

            {!canRecognizeFace && profile.faceRegistered && (
              <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                <div>
                  <h4 className="font-medium text-destructive">Face Recognition Issue</h4>
                  <p className="text-sm text-destructive/80 mb-3">
                    Your face is not being recognized properly. This might be due to changes in appearance (beard,
                    glasses, etc.). Please update your photos for better recognition.
                  </p>
                  <Button asChild size="sm" variant="destructive">
                    <Link href="/face-capture">
                      <Camera className="w-4 h-4 mr-2" />
                      Update Photos
                    </Link>
                  </Button>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link href="/face-capture">
                  <Camera className="w-4 h-4 mr-2" />
                  {profile.faceRegistered ? "Retake Photos" : "Register Face"}
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Personal Information
          </CardTitle>
          <CardDescription>Your account details and academic information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={editForm?.name || ""}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="usn">USN</Label>
                    <Input
                      id="usn"
                      value={editForm?.usn || ""}
                      onChange={(e) => handleInputChange("usn", e.target.value)}
                      disabled
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editForm?.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={editForm?.department || ""}
                    onValueChange={(value) => handleInputChange("department", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Computer Science Engineering">Computer Science Engineering</SelectItem>
                      <SelectItem value="Electronics & Communication">Electronics & Communication</SelectItem>
                      <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                      <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                      <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                      <SelectItem value="Information Science Engineering">Information Science Engineering</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button onClick={handleCancel} variant="outline" disabled={saving}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                      <p className="text-lg">{profile.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">USN</Label>
                      <p className="text-lg">{profile.usn}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                      <p className="text-lg flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {profile.email}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Department</Label>
                      <p className="text-lg flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        {profile.department}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Member Since</Label>
                  <p className="text-lg">
                    {new Date(profile.joinDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
