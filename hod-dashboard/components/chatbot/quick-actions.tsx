"use client"

import { Button } from "@/components/ui/button"
import { Users, BookOpen, BarChart3, HelpCircle } from "lucide-react"

interface QuickActionsProps {
  onActionClick: (query: string) => void
}

const quickActions = [
  {
    icon: Users,
    label: "Show Faculty",
    query: "Show all faculty members",
  },
  {
    icon: BookOpen,
    label: "List Subjects",
    query: "Show all subjects",
  },
  {
    icon: BarChart3,
    label: "Dashboard Stats",
    query: "Show dashboard overview",
  },
  {
    icon: HelpCircle,
    label: "Help",
    query: "Help me get started",
  },
]

export function QuickActions({ onActionClick }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 p-4 border-t">
      {quickActions.map((action) => (
        <Button
          key={action.label}
          variant="outline"
          size="sm"
          onClick={() => onActionClick(action.query)}
          className="flex items-center gap-2 text-xs h-8"
        >
          <action.icon className="h-3 w-3" />
          {action.label}
        </Button>
      ))}
    </div>
  )
}
