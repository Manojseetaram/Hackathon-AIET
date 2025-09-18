"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, Upload, Loader2 } from "lucide-react"
import { uploadAvatar, isValidAvatarFile } from "@/lib/profile"
import { useToast } from "@/hooks/use-toast"

interface AvatarUploadProps {
  userId: string
  currentAvatarUrl?: string
  userName: string
  onAvatarUpdated: (newAvatarUrl: string) => void
}

export function AvatarUpload({ userId, currentAvatarUrl, userName, onAvatarUpdated }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState("")
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = isValidAvatarFile(file)
    if (!validation.valid) {
      setError(validation.error || "Invalid file")
      return
    }

    setError("")

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload file
    setUploading(true)
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
      const result = await uploadAvatar(userId, file)
      clearInterval(progressInterval)
      setUploadProgress(100)

      if (result.success && result.avatarUrl) {
        toast({
          title: "Success",
          description: result.message,
        })
        onAvatarUpdated(result.avatarUrl)
        setPreviewUrl(null)
      } else {
        setError(result.message)
      }
    } catch (err) {
      clearInterval(progressInterval)
      setError("An error occurred while uploading avatar")
    } finally {
      setUploading(false)
      setUploadProgress(0)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const getInitials = () => {
    return userName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage src={previewUrl || currentAvatarUrl} />
          <AvatarFallback className="bg-accent text-accent-foreground text-lg">{getInitials()}</AvatarFallback>
        </Avatar>

        <Button
          variant="outline"
          size="icon"
          className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-background border-2"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Camera className="h-3 w-3" />}
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {error && (
        <Alert variant="destructive" className="w-full">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {uploading && (
        <div className="w-full space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Uploading avatar...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="w-full" />
        </div>
      )}

      <div className="text-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="gap-2"
        >
          <Upload className="h-3 w-3" />
          Change Avatar
        </Button>
        <p className="text-xs text-muted-foreground mt-2">JPEG, PNG, WebP (max 5MB)</p>
      </div>
    </div>
  )
}
