"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, BookOpen, Calendar, User, LogOut, Menu, X, GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils"
import type { HOD } from "@/lib/auth"

interface SidebarProps {
  user: HOD
  activeSection: string
  onSectionChange: (section: string) => void
  onLogout: () => void
}

const sidebarItems = [
  { id: "overview", label: "Dashboard", icon: GraduationCap },
  { id: "faculty", label: "Create Faculty", icon: Users },
  { id: "subjects", label: "Create Subject", icon: BookOpen },
  { id: "timetable", label: "Timetable Upload", icon: Calendar },
]

export function Sidebar({ user, activeSection, onSectionChange, onLogout }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsCollapsed(true)} />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-50 h-full bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out lg:translate-x-0",
          isCollapsed ? "-translate-x-full" : "translate-x-0",
          "w-64",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-sidebar-accent" />
            <span className="font-bold text-sidebar-foreground">HOD Dashboard</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(true)} className="lg:hidden">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {sidebarItems.map((item) => (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  activeSection === item.id
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/10",
                )}
                onClick={() => {
                  onSectionChange(item.id)
                  setIsCollapsed(true)
                }}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </div>
        </nav>

        {/* User Profile & Logout */}
        <div className="border-t border-sidebar-border p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/professional-avatar.png" />
              <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
              <p className="text-xs text-sidebar-foreground/70 truncate">{user.department}</p>
            </div>
          </div>

          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent/10"
              onClick={() => onSectionChange("profile")}
            >
              <User className="h-4 w-4" />
              Profile
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10"
              onClick={onLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <Button
        variant="outline"
        size="sm"
        className="fixed top-4 left-4 z-40 lg:hidden bg-transparent"
        onClick={() => setIsCollapsed(false)}
      >
        <Menu className="h-4 w-4" />
      </Button>
    </>
  )
}
