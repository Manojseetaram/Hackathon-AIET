"use client"

import type React from "react"
import { useState } from "react"
import { FacultySidebar } from "@/components/faculty-sidebar"
import { FloatingChatbot } from "@/components/floating-chatbot"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-background">
      <FacultySidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <main className={`flex-1 overflow-auto transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-0"}`}>
        <div className="p-6 lg:p-8 pt-16 lg:pt-8">{children}</div>
      </main>
      <FloatingChatbot />
    </div>
  )
}
