// Subject management utility functions
// Ready to connect with backend APIs using API keys

export interface Subject {
  id: string
  name: string
  code: string
  facultyId: string | null
  facultyName?: string
  semester: number
  credits: number
  hodId: string
  createdAt: Date
}

export interface CreateSubjectData {
  name: string
  code: string
  facultyId: string | null
  semester: number
  credits: number
}

const subjectsStorage: Subject[] = []

// Subject management functions ready for API integration
export async function createSubject(
  data: CreateSubjectData,
  hodId: string,
): Promise<{ success: boolean; message: string; subject?: Subject }> {
  // TODO: Replace with actual API call using API key
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const existingSubject = subjectsStorage.find((subject) => subject.code === data.code)
  if (existingSubject) {
    return { success: false, message: "Subject with this code already exists" }
  }

  const newSubject: Subject = {
    id: Date.now().toString(),
    name: data.name,
    code: data.code,
    facultyId: data.facultyId,
    facultyName: data.facultyId ? "Faculty Member" : undefined, // Will be updated when faculty is assigned
    semester: data.semester,
    credits: data.credits,
    hodId,
    createdAt: new Date(),
  }

  subjectsStorage.push(newSubject)
  return { success: true, message: "Subject created successfully", subject: newSubject }
}

export async function getSubjectsByHOD(hodId: string): Promise<Subject[]> {
  // TODO: Replace with actual API call
  await new Promise((resolve) => setTimeout(resolve, 500))
  return subjectsStorage.filter((subject) => subject.hodId === hodId)
}

export async function deleteSubject(subjectId: string): Promise<{ success: boolean; message: string }> {
  // TODO: Replace with actual API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const subjectIndex = subjectsStorage.findIndex((subject) => subject.id === subjectId)
  if (subjectIndex === -1) {
    return { success: false, message: "Subject not found" }
  }

  subjectsStorage.splice(subjectIndex, 1)
  return { success: true, message: "Subject deleted successfully" }
}

export async function assignFacultyToSubject(
  subjectId: string,
  facultyId: string | null,
  facultyName?: string,
): Promise<{ success: boolean; message: string }> {
  // TODO: Replace with actual API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  const subject = subjectsStorage.find((s) => s.id === subjectId)
  if (!subject) {
    return { success: false, message: "Subject not found" }
  }

  subject.facultyId = facultyId
  subject.facultyName = facultyName
  return { success: true, message: "Faculty assignment updated successfully" }
}

export async function getSubjectsBySemester(hodId: string): Promise<Record<number, Subject[]>> {
  const subjects = await getSubjectsByHOD(hodId)
  const subjectsBySemester: Record<number, Subject[]> = {}

  subjects.forEach((subject) => {
    if (!subjectsBySemester[subject.semester]) {
      subjectsBySemester[subject.semester] = []
    }
    subjectsBySemester[subject.semester].push(subject)
  })

  return subjectsBySemester
}

export async function getSubjectById(subjectId: string): Promise<Subject | null> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return subjectsStorage.find((s) => s.id === subjectId) || null
}
