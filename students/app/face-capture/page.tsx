"use client"

import { Input } from "@/components/ui/input"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

const capturePositions = [
  { id: "front", label: "Front", instruction: "Look straight at the camera" },
  { id: "left", label: "Left", instruction: "Turn your head to the left" },
  { id: "right", label: "Right", instruction: "Turn your head to the right" },
  { id: "up", label: "Up", instruction: "Tilt your head slightly up" },
  { id: "down", label: "Down", instruction: "Tilt your head slightly down" },
]

export default function FaceCapturePage() {
    const [usn, setUsn] = useState("")  // new state for manual USN
  const [currentStep, setCurrentStep] = useState(0)
  const [capturedPhotos, setCapturedPhotos] = useState<{ [key: string]: string }>({})
  const [isCapturing, setIsCapturing] = useState(false)
  const [error, setError] = useState("")
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()

  useEffect(() => {
    startCamera()
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
        audio: false,
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      setError("Unable to access camera. Please ensure camera permissions are granted.")
    }
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    setIsCapturing(true)
    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (context) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0)

      // Convert to base64
      const photoData = canvas.toDataURL("image/jpeg", 0.8)
      const currentPosition = capturePositions[currentStep]

      setCapturedPhotos((prev) => ({
        ...prev,
        [currentPosition.id]: photoData,
      }))

      // Move to next step or finish
      if (currentStep < capturePositions.length - 1) {
        setCurrentStep(currentStep + 1)
      }
    }

    setIsCapturing(false)
  }

  const retakePhoto = () => {
    const currentPosition = capturePositions[currentStep]
    setCapturedPhotos((prev) => {
      const updated = { ...prev }
      delete updated[currentPosition.id]
      return updated
    })
  }
  const submitPhotos = async () => {
    if (!usn.trim()) {
      setError("Please enter your USN")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("usn", usn)

      const base64ToBlob = (base64: string) => {
        const [header, data] = base64.split(";base64,")
        const contentType = header.split(":")[1]
        const binary = window.atob(data)
        const array = new Uint8Array(binary.length)
        for (let i = 0; i < binary.length; i++) {
          array[i] = binary.charCodeAt(i)
        }
        return new Blob([array], { type: contentType })
      }

      for (const [key, base64] of Object.entries(capturedPhotos)) {
        const blob = base64ToBlob(base64)
        formData.append("images", blob, `${key}.jpg`)
      }

      console.log("FormData contents:")
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1])
      }

      const response = await fetch("http://localhost:5000/upload_photos", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.message || "Upload failed")

      alert(result.message)
      if (stream) stream.getTracks().forEach((track) => track.stop())
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Face registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  const currentPosition = capturePositions[currentStep]
  const isCurrentPhotoCaptured = capturedPhotos[currentPosition?.id]
  const allPhotosCaptured = capturePositions.every((pos) => capturedPhotos[pos.id])
  const progress = (Object.keys(capturedPhotos).length / capturePositions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="container mx-auto max-w-4xl">
         <div className="mb-6 text-center">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="usn">
            Enter your USN
          </label>
          <Input
            id="usn"
            value={usn}
            onChange={(e) => setUsn(e.target.value)}
            placeholder="e.g. 1BCS102"
            className="max-w-xs mx-auto"
          />
        </div>
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 text-gray-700 hover:text-gray-900 hover:bg-gray-100"
          >
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2 text-gray-900">Face Registration</h1>
            <p className="text-gray-600 mb-4">
              Please capture 5 photos from different angles to complete your registration
            </p>
            <Progress value={progress} className="max-w-md mx-auto" />
            <p className="text-sm text-gray-500 mt-2">
              {Object.keys(capturedPhotos).length} of {capturePositions.length} photos captured
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Camera Section */}
          <Card className="bg-white border-2 border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Live Camera
              </CardTitle>
              <CardDescription className="text-gray-600">
                {currentPosition ? currentPosition.instruction : "All photos captured!"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-4 border-2 border-gray-300">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-64 object-cover" />
                <canvas ref={canvasRef} className="hidden" />

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="border-2 border-primary/70 rounded-full w-48 h-48 flex items-center justify-center bg-white/10">
                    <div className="text-white bg-primary/80 px-3 py-1 rounded-full text-sm font-medium">
                      {currentPosition?.label}
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="mb-4 border-red-300 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                {!allPhotosCaptured && (
                  <>
                    <Button
                      onClick={capturePhoto}
                      disabled={isCapturing || !stream}
                      className="flex-1 bg-primary hover:bg-primary/90 text-white border border-primary"
                    >
                      {isCapturing ? "Capturing..." : "Capture Photo"}
                    </Button>
                    {isCurrentPhotoCaptured && (
                      <Button
                        variant="outline"
                        onClick={retakePhoto}
                        className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                      </Button>
                    )}
                  </>
                )}

                {allPhotosCaptured && (
                  <Button
                    onClick={submitPhotos}
                    disabled={isLoading}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isLoading ? "Processing..." : "Complete Registration"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Photos Grid */}
          <Card className="bg-white border-2 border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Captured Photos</CardTitle>
              <CardDescription className="text-gray-600">
                Review your captured photos from different angles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {capturePositions.map((position, index) => (
                  <div
                    key={position.id}
                    className={`relative aspect-square rounded-lg border-2 overflow-hidden ${
                      capturedPhotos[position.id]
                        ? "border-green-400 bg-green-50"
                        : index === currentStep
                          ? "border-primary border-dashed bg-primary/5"
                          : "border-gray-300 bg-gray-50"
                    }`}
                  >
                    {capturedPhotos[position.id] ? (
                      <>
                        <img
                          src={capturedPhotos[position.id] || "/placeholder.svg"}
                          alt={`${position.label} photo`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <svg className="h-8 w-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">{position.label}</span>
                      </div>
                    )}

                    {index === currentStep && !capturedPhotos[position.id] && (
                      <div className="absolute inset-0 bg-primary/10 flex items-center justify-center border border-primary">
                        <div className="text-primary text-xs font-medium bg-white px-2 py-1 rounded">Current</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
