"use client"

import { useState, useEffect } from "react"
import { CreateFacultyDialog } from "./create-faculty-dialog"
import { FacultyCard } from "./faculty-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, RefreshCw } from "lucide-react"
import { getFacultyByHOD, type Faculty } from "@/lib/faculty"
import type { HOD } from "@/lib/auth"

interface FacultyManagementProps {
  user: HOD
}

export function FacultyManagement({ user }: FacultyManagementProps) {
  const [faculty, setFaculty] = useState<Faculty[]>([])
  const [filteredFaculty, setFilteredFaculty] = useState<Faculty[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const loadFaculty = async () => {
    setLoading(true)
    try {
      const facultyData = await getFacultyByHOD(user.hodId)
      setFaculty(facultyData)
      setFilteredFaculty(facultyData)
    } catch (error) {
      console.error("Error loading faculty:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFaculty()
  }, [user.hodId])

  useEffect(() => {
    const filtered = faculty.filter(
      (f) =>
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.facultyId.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredFaculty(filtered)
  }, [searchTerm, faculty])

  const handleFacultyClick = (faculty: Faculty) => {
    // TODO: Open faculty details modal or navigate to faculty detail page
    console.log("Faculty clicked:", faculty)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          
          <p className="text-muted-foreground">Manage faculty members in your department</p>
        </div>
        <CreateFacultyDialog hodId={user.hodId} onFacultyCreated={loadFaculty} />
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search faculty by name, email, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={loadFaculty} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Faculty Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg p-4 border">
          <div className="text-2xl font-bold text-foreground">{faculty.length}</div>
          <div className="text-sm text-muted-foreground">Total Faculty</div>
        </div>
        <div className="bg-card rounded-lg p-4 border">
          <div className="text-2xl font-bold text-foreground">
            {faculty.reduce((acc, f) => acc + f.assignedSubjects.length, 0)}
          </div>
          <div className="text-sm text-muted-foreground">Total Assignments</div>
        </div>
        <div className="bg-card rounded-lg p-4 border">
          <div className="text-2xl font-bold text-foreground">
            {faculty.filter((f) => f.assignedSubjects.length > 0).length}
          </div>
          <div className="text-sm text-muted-foreground">Active Faculty</div>
        </div>
      </div>

      {/* Faculty Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-card rounded-lg p-6 border animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-muted rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-24"></div>
                  <div className="h-3 bg-muted rounded w-16"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded w-full"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredFaculty.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFaculty.map((facultyMember) => (
            <FacultyCard
              key={facultyMember.id}
              faculty={facultyMember}
              onFacultyDeleted={loadFaculty}
              onFacultyClick={handleFacultyClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            {searchTerm ? "No faculty found matching your search." : "No faculty members found."}
          </div>
          {!searchTerm && <CreateFacultyDialog hodId={user.hodId} onFacultyCreated={loadFaculty} />}
        </div>
      )}
    </div>
  )
}
