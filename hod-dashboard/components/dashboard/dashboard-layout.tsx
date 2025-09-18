"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { TopNavbar } from "./top-navbar"
import { DashboardOverview } from "./dashboard-overview"
import { FacultyManagement } from "../faculty/faculty-management"
import { SubjectManagement } from "../subjects/subject-management"
import { TimetableManagement } from "../timetable/timetable-management"
import { ProfileSettings } from "../profile/profile-settings"
import { ChatbotWidget } from "../chatbot/chatbot-widget"
import type { HOD } from "@/lib/auth"

interface DashboardLayoutProps {
  user: HOD
  onLogout: () => void
}

const sectionTitles = {
  overview: "Dashboard Overview",
  faculty: "Faculty Management",
  subjects: "Subject Management",
  timetable: "Timetable Management",
  profile: "Profile Settings",
}

export function DashboardLayout({ user, onLogout }: DashboardLayoutProps) {
  const [activeSection, setActiveSection] = useState("overview")

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <DashboardOverview user={user} />
      case "faculty":
        return <FacultyManagement user={user} />
      case "subjects":
        return <SubjectManagement user={user} />
      case "timetable":
        return <TimetableManagement user={user} />
      case "profile":
        return <ProfileSettings user={user} />
      default:
        return <DashboardOverview user={user} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar user={user} activeSection={activeSection} onSectionChange={setActiveSection} onLogout={onLogout} />

      <div className="lg:ml-64">
        <TopNavbar user={user} title={sectionTitles[activeSection as keyof typeof sectionTitles] || "Dashboard"} />

        <main className="p-6">{renderContent()}</main>
      </div>

      <ChatbotWidget user={user} />
    </div>
  )
}
