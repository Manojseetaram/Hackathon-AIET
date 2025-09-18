"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"
import { facultyAPI } from "@/api/faculty"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
}

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content:
        "Hello! I'm your Faculty AI Assistant. I can help you with:\n• Student attendance lookup by USN\n• Attendance percentages and statistics\n• Class information and student details\n• General queries about your subjects\n\nHow can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI processing
    setTimeout(async () => {
      const botResponse = await processUserQuery(inputValue)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: botResponse,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1000)
  }

  const processUserQuery = async (query: string): Promise<string> => {
    const lowerQuery = query.toLowerCase()

    // Check if query contains USN pattern
    const usnMatch = query.match(/\b[A-Z0-9]{10}\b/i) || query.match(/usn[:\s]*([A-Z0-9]{10})/i)
    if (usnMatch) {
      const usn = usnMatch[1] || usnMatch[0]
      return await getStudentInfo(usn.toUpperCase())
    }

    // Check for attendance-related queries
    if (lowerQuery.includes("attendance") || lowerQuery.includes("percentage")) {
      return "Please provide a student USN (e.g., 1MS21CS001) to check their attendance details."
    }

    // Check for subject-related queries
    if (lowerQuery.includes("subject") || lowerQuery.includes("class")) {
      const subjects = await facultyAPI.getOfferedSubjects()
      return `You are currently teaching ${subjects.length} subjects:\n${subjects.map((s) => `• ${s.name} (${s.code}) - ${s.students} students`).join("\n")}`
    }

    // Check for student count queries
    if (lowerQuery.includes("student") && (lowerQuery.includes("total") || lowerQuery.includes("count"))) {
      const students = await facultyAPI.getStudents()
      return `You have a total of ${students.length} students across all your subjects.`
    }

    // Default responses for common queries
    if (lowerQuery.includes("hello") || lowerQuery.includes("hi")) {
      return "Hello! How can I help you with attendance management today?"
    }

    if (lowerQuery.includes("help")) {
      return "I can help you with:\n• Student attendance lookup (provide USN)\n• Attendance statistics and percentages\n• Subject and class information\n• Student details and performance\n\nJust ask me anything!"
    }

    // Default response
    return (
      "I understand you're asking about: \"" +
      query +
      '"\n\nI can help you with student attendance queries. Please provide a student USN (like 1MS21CS001) or ask about subjects, attendance percentages, or student information.'
    )
  }

  const getStudentInfo = async (usn: string): Promise<string> => {
    try {
      const students = await facultyAPI.getStudents()
      const student = students.find((s) => s.usn.toUpperCase() === usn)

      if (!student) {
        return `Student with USN ${usn} not found in your classes. Please check the USN and try again.`
      }

      const attendanceHistory = await facultyAPI.getAttendanceHistory()
      const studentAttendance = attendanceHistory.filter((record) => record.students.some((s) => s.usn === usn))

      const totalClasses = studentAttendance.length
      const attendedClasses = studentAttendance.filter(
        (record) => record.students.find((s) => s.usn === usn)?.status === "present",
      ).length

      const attendancePercentage = totalClasses > 0 ? ((attendedClasses / totalClasses) * 100).toFixed(1) : "0"

      return `📊 **Student Information**\n\n**Name:** ${student.name}\n**USN:** ${student.usn}\n**Email:** ${student.email}\n**Phone:** ${student.phone}\n\n**Attendance Summary:**\n• Total Classes: ${totalClasses}\n• Classes Attended: ${attendedClasses}\n• Attendance Percentage: ${attendancePercentage}%\n• Status: ${Number.parseFloat(attendancePercentage) >= 75 ? "✅ Good Standing" : "⚠️ Below Required (75%)"}\n\n${Number.parseFloat(attendancePercentage) < 75 ? `⚠️ **Alert:** Student needs to attend ${Math.ceil((75 * totalClasses - 100 * attendedClasses) / 25)} more classes to reach 75% attendance.` : ""}`
    } catch (error) {
      return `Sorry, I encountered an error while fetching student information. Please try again.`
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90 z-50"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-2xl z-50 flex flex-col animate-in slide-in-from-bottom-2 duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-primary text-primary-foreground rounded-t-lg">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Faculty AI Assistant
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.type === "bot" && (
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"
                      }`}
                    >
                      <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                      <div className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                    {message.type === "user" && (
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about student attendance, USN lookup..."
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button onClick={handleSendMessage} size="icon" disabled={!inputValue.trim() || isTyping}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Try: "Check attendance for 1MS21CS001" or "How many students do I have?"
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
