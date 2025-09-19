"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, BookOpen, Users } from "lucide-react"
import type { Faculty, Subject } from "@/lib/types"

export default function SubjectsPage() {
  const [faculty, setFaculty] = useState<Faculty | null>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // For now: fake faculty data until JWT decoding is added
    const fakeFaculty: Faculty = {
      faculty_id: 123, // must be a number
      name: "John Doe",
      email: "john@example.com",
      department: "CSE",
    }

    setFaculty(fakeFaculty)
    loadSubjects(fakeFaculty.faculty_id)
  }, [])

  const loadSubjects = async (facultyId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/subjects/faculty/${facultyId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer <your-token-here>`, // temporary manual token
        },
      })

      if (!response.ok) throw new Error("Failed to fetch subjects")

      const data: Subject[] = await response.json()
      setSubjects(data)
    } catch (error) {
      console.error("Error loading subjects:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!faculty) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Offered Subjects</h1>
        <p className="text-muted-foreground mt-1">Manage subjects assigned to you this semester</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subjects.length}</div>
            <p className="text-xs text-muted-foreground">Assigned this semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(subjects.map((s) => s.department)).size}</div>
            <p className="text-xs text-muted-foreground">Different departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Semesters</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(subjects.map((s) => s.sem)).size}</div>
            <p className="text-xs text-muted-foreground">Different semesters</p>
          </CardContent>
        </Card>
      </div>

      {/* Subjects Table */}
      <Card>
        <CardHeader>
          <CardTitle>Subject Details</CardTitle>
          <CardDescription>Complete list of subjects assigned to you</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject Code</TableHead>
                    <TableHead>Subject Name</TableHead>
                    <TableHead>Semester</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subjects.map((subject) => (
                    <TableRow key={subject.subject_id}>
                      <TableCell className="font-medium">{subject.subject_code}</TableCell>
                      <TableCell>{subject.subject_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">Sem {subject.sem}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{subject.department}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link
                          href={`/attendance?subject=${subject.subject_id}&code=${subject.subject_code}&name=${encodeURIComponent(subject.subject_name)}`}
                        >
                          <Button size="sm">Take Attendance</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
