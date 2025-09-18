"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, RotateCcw, Check, AlertCircle } from "lucide-react"

const CAPTURE_POSITIONS = [
  { name: "Front", description: "Look straight at the camera", icon: "📷" },
  { name: "Left", description: "Turn your head to the left", icon: "👈" },
  { name: "Right", description: "Turn your head to the right", icon: "👉" },
  { name: "Up", description: "Tilt your head slightly up", icon: "👆" },
  { name: "Down", description: "Tilt your head slightly down", icon: "👇" },
]

export default function FaceCapturePage() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([])
  const [isCapturing, setIsCapturing] = useState(false)
  const [cameraReady, setCameraReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraReady(true)
        setError(null)
      }
    } catch (err) {
      setError("Camera access denied. Please allow camera permissions and refresh the page.")
    }
  }, [])

  useEffect(() => {
    startCamera()
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [startCamera])

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    setIsCapturing(true)
    const canvas = canvasRef.current
    const video = videoRef.current
    const context = canvas.getContext("2d")

    if (context) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0)

      const photoData = canvas.toDataURL("image/jpeg", 0.8)
      setCapturedPhotos((prev) => [...prev, photoData])

      if (currentStep < CAPTURE_POSITIONS.length - 1) {
        setCurrentStep((prev) => prev + 1)
      }
    }

    setTimeout(() => setIsCapturing(false), 500)
  }, [currentStep])

  const retakePhoto = useCallback(() => {
    setCapturedPhotos((prev) => prev.slice(0, -1))
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }, [currentStep])

  const submitPhotos = useCallback(async () => {
    setIsSubmitting(true)

    // Mock face recognition process
    setTimeout(() => {
      const success = Math.random() > 0.2 // 80% success rate for demo

      if (success) {
        localStorage.setItem("faceRegistered", "true")
        localStorage.removeItem("needsFaceCapture")
        router.push("/dashboard")
      } else {
        setError("Face not recognized, please retake your photos.")
        setCapturedPhotos([])
        setCurrentStep(0)
      }
      setIsSubmitting(false)
    }, 3000)
  }, [router])

  const isComplete = capturedPhotos.length === CAPTURE_POSITIONS.length

  if (error && !cameraReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <CardTitle className="text-xl text-balance">Camera Access Required</CardTitle>
            <CardDescription className="text-pretty">{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={startCamera} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-balance">Face Registration</h1>
          <p className="text-muted-foreground text-pretty">
            Please capture 5 photos from different angles to activate your attendance tracking
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Camera Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Camera Preview
              </CardTitle>
              <CardDescription>
                {isComplete
                  ? "All photos captured successfully!"
                  : `Position ${currentStep + 1} of ${CAPTURE_POSITIONS.length}: ${CAPTURE_POSITIONS[currentStep]?.name}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full rounded-lg bg-muted"
                  style={{ aspectRatio: "4/3" }}
                />
                <canvas ref={canvasRef} className="hidden" />

                {!isComplete && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-background/90 backdrop-blur-sm rounded-lg p-3 text-center">
                      <p className="text-sm font-medium">{CAPTURE_POSITIONS[currentStep]?.description}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                {!isComplete && (
                  <Button onClick={capturePhoto} disabled={!cameraReady || isCapturing} className="flex-1">
                    {isCapturing ? "Capturing..." : "Capture Photo"}
                  </Button>
                )}

                {capturedPhotos.length > 0 && !isComplete && (
                  <Button onClick={retakePhoto} variant="outline" size="icon">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                )}

                {isComplete && (
                  <Button onClick={submitPhotos} disabled={isSubmitting} className="flex-1">
                    {isSubmitting ? "Processing..." : "Submit Photos"}
                  </Button>
                )}
              </div>

              {error && (
                <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Progress Section */}
          <Card>
            <CardHeader>
              <CardTitle>Capture Progress</CardTitle>
              <CardDescription>Complete all 5 positions to proceed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {CAPTURE_POSITIONS.map((position, index) => (
                  <div key={position.name} className="flex items-center gap-3">
                    <div className="text-2xl">{position.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{position.name}</span>
                        {index < capturedPhotos.length && (
                          <Badge variant="secondary" className="text-xs">
                            <Check className="w-3 h-3 mr-1" />
                            Captured
                          </Badge>
                        )}
                        {index === currentStep && !isComplete && (
                          <Badge variant="default" className="text-xs">
                            Current
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{position.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {capturedPhotos.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Captured Photos</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {capturedPhotos.map((photo, index) => (
                      <div key={index} className="relative">
                        <img
                          src={photo || "/placeholder.svg"}
                          alt={`Capture ${index + 1}`}
                          className="w-full aspect-square object-cover rounded-lg border"
                        />
                        <Badge className="absolute top-1 right-1 text-xs">{index + 1}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
