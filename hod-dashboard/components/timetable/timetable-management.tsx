"use client"

import { useState, useEffect } from "react"
import { UploadTimetableDialog } from "./upload-timetable-dialog"
import { TimetableCard } from "./timetable-card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RefreshCw, Calendar, Upload, FileText } from "lucide-react"
import { getTimetablesByHOD, type Timetable } from "@/lib/timetable"
import type { HOD } from "@/lib/auth"
import { Card } from "@/components/ui/card" // Import Card component

interface TimetableManagementProps {
  user: HOD
}

export function TimetableManagement({ user }: TimetableManagementProps) {
  const [timetables, setTimetables] = useState<Timetable[]>([])
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState("grid")

  const loadTimetables = async () => {
    setLoading(true)
    try {
      const timetableData = await getTimetablesByHOD(user.hodId)
      setTimetables(timetableData)
    } catch (error) {
      console.error("Error loading timetables:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTimetables()
  }, [user.hodId])

  const timetablesBySemester = timetables.reduce(
    (acc, timetable) => {
      if (!acc[timetable.semester]) {
        acc[timetable.semester] = []
      }
      acc[timetable.semester].push(timetable)
      return acc
    },
    {} as Record<number, Timetable[]>,
  )

  const stats = {
    total: timetables.length,
    totalSize: timetables.reduce((acc, t) => acc + t.fileSize, 0),
    coverage: `${timetables.length}/8 semesters`,
  }

  const renderTimetableGrid = (timetablesToRender: Timetable[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {timetablesToRender.map((timetable) => (
        <TimetableCard key={timetable.id} timetable={timetable} onTimetableDeleted={loadTimetables} />
      ))}
    </div>
  )

  const renderSemesterView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((semester) => {
        const semesterTimetable = timetablesBySemester[semester]?.[0]
        const hasTimetable = !!semesterTimetable // Corrected variable declaration

        return (
          <Card
            key={semester}
            className={`p-4 text-center transition-all cursor-pointer ${
              hasTimetable
                ? "bg-accent/5 border-accent/20 hover:bg-accent/10"
                : "bg-muted/30 border-dashed hover:bg-muted/50"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-center">
                {hasTimetable ? (
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <FileText className="h-6 w-6 text-accent" />
                  </div>
                ) : (
                  <div className="p-2 bg-muted rounded-lg">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold">Semester {semester}</h3>
                {hasTimetable ? (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground truncate">{semesterTimetable.fileName}</p>
                    <p className="text-xs text-accent">Uploaded</p>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No timetable</p>
                )}
              </div>

              {!hasTimetable && <UploadTimetableDialog hodId={user.hodId} onTimetableUploaded={loadTimetables} />}
            </div>
          </Card>
        )
      })}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>

          <p className="text-muted-foreground">Upload and manage timetables for all semesters</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={loadTimetables} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <UploadTimetableDialog hodId={user.hodId} onTimetableUploaded={loadTimetables} />
        </div>
      </div>

      {/* Timetable Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg p-4 border">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium">Total Timetables</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{stats.total}</div>
        </div>
        <div className="bg-card rounded-lg p-4 border">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium">Coverage</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{stats.coverage}</div>
        </div>
        <div className="bg-card rounded-lg p-4 border">
          <div className="flex items-center gap-2 mb-2">
            <Upload className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium">Total Size</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{(stats.totalSize / (1024 * 1024)).toFixed(1)} MB</div>
        </div>
      </div>

      {/* Timetable Views */}
      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList>
          <TabsTrigger value="grid">All Timetables</TabsTrigger>
          <TabsTrigger value="semester">Semester View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="mt-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card rounded-lg p-6 border animate-pulse">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 bg-muted rounded-lg"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-24"></div>
                      <div className="h-3 bg-muted rounded w-32"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded w-full"></div>
                    <div className="h-3 bg-muted rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : timetables.length > 0 ? (
            renderTimetableGrid(timetables)
          ) : (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">No timetables uploaded yet.</div>
              <UploadTimetableDialog hodId={user.hodId} onTimetableUploaded={loadTimetables} />
            </div>
          )}
        </TabsContent>

        <TabsContent value="semester" className="mt-6">
          {renderSemesterView()}
        </TabsContent>
      </Tabs>
    </div>
  )
}
