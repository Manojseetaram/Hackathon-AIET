"use client"

import { useState, useEffect } from "react"
import { CreateSubjectDialog } from "./create-subject-dialog"
import { SubjectCard } from "./subject-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, RefreshCw, BookOpen, Users, GraduationCap } from "lucide-react"
import { getSubjectsByHOD, getSubjectsBySemester, type Subject } from "@/lib/subjects"
import type { HOD } from "@/lib/auth"

interface SubjectManagementProps {
  user: HOD
}

export function SubjectManagement({ user }: SubjectManagementProps) {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [subjectsBySemester, setSubjectsBySemester] = useState<Record<number, Subject[]>>({})
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeView, setActiveView] = useState("all")

  const loadSubjects = async () => {
    setLoading(true)
    try {
      const [subjectsData, semesterData] = await Promise.all([
        getSubjectsByHOD(user.hodId),
        getSubjectsBySemester(user.hodId),
      ])
      setSubjects(subjectsData)
      setSubjectsBySemester(semesterData)
      setFilteredSubjects(subjectsData)
    } catch (error) {
      console.error("Error loading subjects:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSubjects()
  }, [user.hodId])

  useEffect(() => {
    const filtered = subjects.filter(
      (s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.facultyName && s.facultyName.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    setFilteredSubjects(filtered)
  }, [searchTerm, subjects])

  const stats = {
    total: subjects.length,
    assigned: subjects.filter((s) => s.facultyId).length,
    unassigned: subjects.filter((s) => !s.facultyId).length,
    totalCredits: subjects.reduce((acc, s) => acc + s.credits, 0),
  }

  const renderSubjectGrid = (subjectsToRender: Subject[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {subjectsToRender.map((subject) => (
        <SubjectCard
          key={subject.id}
          subject={subject}
          hodId={user.hodId}
          onSubjectDeleted={loadSubjects}
          onSubjectUpdated={loadSubjects}
        />
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Subject Management</h2>
          <p className="text-muted-foreground">Manage subjects and faculty assignments</p>
        </div>
        <CreateSubjectDialog hodId={user.hodId} onSubjectCreated={loadSubjects} />
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search subjects by name, code, or faculty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={loadSubjects} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Subject Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg p-4 border">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium">Total Subjects</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{stats.total}</div>
        </div>
        <div className="bg-card rounded-lg p-4 border">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Assigned</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{stats.assigned}</div>
        </div>
        <div className="bg-card rounded-lg p-4 border">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium">Unassigned</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{stats.unassigned}</div>
        </div>
        <div className="bg-card rounded-lg p-4 border">
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium">Total Credits</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{stats.totalCredits}</div>
        </div>
      </div>

      {/* Subject Views */}
      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList>
          <TabsTrigger value="all">All Subjects</TabsTrigger>
          <TabsTrigger value="semester">By Semester</TabsTrigger>
          <TabsTrigger value="unassigned">Unassigned</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card rounded-lg p-6 border animate-pulse">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 bg-muted rounded-lg"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-32"></div>
                      <div className="h-3 bg-muted rounded w-20"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded w-full"></div>
                    <div className="h-3 bg-muted rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredSubjects.length > 0 ? (
            renderSubjectGrid(filteredSubjects)
          ) : (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                {searchTerm ? "No subjects found matching your search." : "No subjects found."}
              </div>
              {!searchTerm && <CreateSubjectDialog hodId={user.hodId} onSubjectCreated={loadSubjects} />}
            </div>
          )}
        </TabsContent>

        <TabsContent value="semester" className="mt-6">
          <div className="space-y-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((semester) => {
              const semesterSubjects = subjectsBySemester[semester] || []
              if (semesterSubjects.length === 0) return null

              return (
                <div key={semester}>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-accent" />
                    Semester {semester} ({semesterSubjects.length} subjects)
                  </h3>
                  {renderSubjectGrid(semesterSubjects)}
                </div>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="unassigned" className="mt-6">
          {(() => {
            const unassignedSubjects = subjects.filter((s) => !s.facultyId)
            return unassignedSubjects.length > 0 ? (
              renderSubjectGrid(unassignedSubjects)
            ) : (
              <div className="text-center py-12">
                <div className="text-muted-foreground">All subjects have been assigned to faculty members.</div>
              </div>
            )
          })()}
        </TabsContent>
      </Tabs>
    </div>
  )
}
