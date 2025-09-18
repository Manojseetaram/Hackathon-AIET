"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { facultyAPI } from "@/api/faculty"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
  data?: any
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content:
        "Hello! I'm your AI Assistant. I can help you with:\n\n• Check student attendance by USN\n• Get attendance percentage for any student\n• Find students in your classes\n• View attendance statistics\n• Answer questions about attendance records\n\nJust type a student's USN or ask me anything!",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const processUserQuery = async (query: string): Promise<string> => {
    const lowerQuery = query.toLowerCase()

    // Check if query contains USN pattern (alphanumeric, typically 10 characters)
    const usnMatch = query.match(/\b[a-zA-Z0-9]{10}\b/)

    if (usnMatch) {
      const usn = usnMatch[0].toUpperCase()
      try {
        const students = await facultyAPI.getStudents()
        const student = students.find((s) => s.usn === usn)

        if (student) {
          const attendanceHistory = await facultyAPI.getAttendanceHistory()
          const studentAttendance = attendanceHistory.filter((record) => record.students.some((s) => s.usn === usn))

          const totalClasses = studentAttendance.length
          const attendedClasses = studentAttendance.filter(
            (record) => record.students.find((s) => s.usn === usn)?.status === "present",
          ).length

          const percentage = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0

          return (
            `📊 **Student Information for ${usn}**\n\n` +
            `**Name:** ${student.name}\n` +
            `**Email:** ${student.email}\n` +
            `**Department:** ${student.department}\n` +
            `**Semester:** ${student.semester}\n\n` +
            `📈 **Attendance Summary:**\n` +
            `• Total Classes: ${totalClasses}\n` +
            `• Classes Attended: ${attendedClasses}\n` +
            `• Attendance Percentage: ${percentage}%\n` +
            `• Status: ${percentage >= 75 ? "✅ Good" : percentage >= 60 ? "⚠️ Average" : "❌ Poor"}\n\n` +
            `${percentage < 75 ? "⚠️ **Note:** Attendance is below 75%. Student should attend more classes." : "✅ **Great!** Student has good attendance."}`
          )
        } else {
          return `❌ **Student not found**\n\nNo student found with USN: ${usn}\n\nPlease check the USN and try again. Make sure the student is enrolled in your subjects.`
        }
      } catch (error) {
        return `❌ **Error occurred**\n\nSorry, I couldn't fetch student information right now. Please try again later.`
      }
    }

    // Handle general queries
    if (lowerQuery.includes("attendance") && lowerQuery.includes("percentage")) {
      return `📊 **Attendance Percentage Information**\n\nTo check a student's attendance percentage, please provide their USN (University Seat Number).\n\n**Example:** Type "1MS21CS001" or "Check attendance for 1MS21CS001"\n\nI'll show you:\n• Total classes conducted\n• Classes attended\n• Attendance percentage\n• Attendance status`
    }

    if (lowerQuery.includes("student") && (lowerQuery.includes("list") || lowerQuery.includes("all"))) {
      try {
        const students = await facultyAPI.getStudents()
        const studentList = students
          .slice(0, 10)
          .map((s) => `• ${s.name} (${s.usn}) - ${s.department}`)
          .join("\n")
        return `👥 **Your Students (First 10)**\n\n${studentList}\n\n💡 **Tip:** Type any USN to get detailed attendance information for that student.`
      } catch (error) {
        return `❌ **Error occurred**\n\nSorry, I couldn't fetch the student list right now.`
      }
    }

    if (lowerQuery.includes("help") || lowerQuery.includes("what can you do")) {
      return `🤖 **AI Assistant Help**\n\n**I can help you with:**\n\n📊 **Student Attendance**\n• Type any USN to get attendance details\n• Example: "1MS21CS001"\n\n📈 **Attendance Statistics**\n• Ask "show attendance percentage"\n• Ask "list all students"\n\n📋 **General Queries**\n• Ask about attendance policies\n• Get help with attendance management\n\n💡 **Quick Tips:**\n• Just type a 10-character USN for instant results\n• Ask specific questions about students\n• Use "help" anytime for assistance`
    }

    if (lowerQuery.includes("policy") || lowerQuery.includes("rule")) {
      return `📋 **Attendance Policy Information**\n\n**Minimum Attendance Requirements:**\n• 75% attendance is mandatory for exam eligibility\n• 60-74%: Average attendance (may need permission)\n• Below 60%: Poor attendance (requires special approval)\n\n**Attendance Calculation:**\n• Based on total classes conducted vs attended\n• Includes both theory and practical sessions\n• Medical leave may be considered with proper documentation\n\n💡 **Tip:** Type a student's USN to check their current attendance status.`
    }

    // Default response for unrecognized queries
    return `🤔 **I didn't quite understand that.**\n\nHere's what I can help you with:\n\n• **Check Student Attendance:** Type a USN (like "1MS21CS001")\n• **View All Students:** Ask "show all students"\n• **Attendance Help:** Ask "what's the attendance policy"\n• **General Help:** Type "help"\n\n💡 **Quick Tip:** Try typing a 10-character USN for instant student information!`
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await processUserQuery(input.trim())

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content:
          "❌ **Error occurred**\n\nSorry, I encountered an error while processing your request. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
      toast.error("Failed to process your request")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Assistant</h1>
          <p className="text-muted-foreground">Get instant student information and attendance details</p>
        </div>
        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
          <Bot className="w-4 h-4 mr-1" />
          Online
        </Badge>
      </div>

      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-600" />
            Faculty AI Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.type === "bot" && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === "user" ? "bg-blue-600 text-white ml-auto" : "bg-muted text-foreground"
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                    <div
                      className={`text-xs mt-1 ${message.type === "user" ? "text-blue-100" : "text-muted-foreground"}`}
                    >
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  {message.type === "user" && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gray-100 text-gray-600">
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted text-foreground rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a student USN or ask me anything..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              💡 Try typing a USN like "1MS21CS001" for instant student information
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
