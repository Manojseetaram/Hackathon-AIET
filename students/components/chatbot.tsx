"use client"

import type React from "react"
import { BarChart3 } from "lucide-react" // Import BarChart3

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, X, Send, Bot, User, Clock, Users, CreditCard } from "lucide-react"

interface Message {
  id: string
  text: string
  isBot: boolean
  timestamp: Date
  type?: "text" | "quick_reply" | "info_card"
  data?: any
}

interface QuickReply {
  text: string
  payload: string
}

// Enhanced mock responses with faculty info and updates
const mockResponses: { [key: string]: string | { text: string; quickReplies?: QuickReply[] } } = {
  greeting: {
    text: "Hello! I'm your virtual assistant. I can help you with attendance, faculty information, fee payments, and general queries. How can I assist you today?",
    quickReplies: [
      { text: "Check Attendance", payload: "attendance" },
      { text: "Faculty Info", payload: "faculty" },
      { text: "Fee Status", payload: "fees" },
      { text: "Help", payload: "help" },
    ],
  },
  attendance: {
    text: "Your current overall attendance is 87%. You've attended 145 out of 165 classes this semester. Would you like to see subject-wise breakdown?",
    quickReplies: [
      { text: "Subject Breakdown", payload: "subject_attendance" },
      { text: "Attendance History", payload: "attendance_history" },
    ],
  },
  subject_attendance:
    "Here's your subject-wise attendance:\n• Data Structures: 93.3% (42/45)\n• DBMS: 87.5% (35/40)\n• Computer Networks: 78.9% (30/38)\n• Software Engineering: 90.5% (38/42)",
  attendance_history:
    "You can view your complete attendance history in the 'Attendance History' section of your dashboard. It shows all your records with dates and times.",
  faculty: {
    text: "Here's faculty information for your subjects:",
    quickReplies: [
      { text: "CS Faculty", payload: "cs_faculty" },
      { text: "Office Hours", payload: "office_hours" },
      { text: "Contact Info", payload: "faculty_contact" },
    ],
  },
  cs_faculty:
    "Computer Science Faculty:\n• Dr. Smith - Data Structures (Room 301)\n• Prof. Johnson - DBMS (Room 205)\n• Dr. Williams - Networks (Room 102)\n• Prof. Brown - Software Eng (Room 404)",
  office_hours:
    "Faculty office hours are typically 2:00 PM - 4:00 PM on weekdays. Please check with individual faculty for specific timings and availability.",
  faculty_contact:
    "You can contact faculty through the college portal or visit them during office hours. For urgent matters, contact the department office.",
  fees: {
    text: "Your fee status: Current semester fees are pending. Total amount: ₹1,00,000 (Due: Jan 15, 2024)",
    quickReplies: [
      { text: "Pay Now", payload: "pay_fees" },
      { text: "Fee Structure", payload: "fee_structure" },
      { text: "Payment History", payload: "payment_history" },
    ],
  },
  pay_fees:
    "You can pay your fees through the 'Fee Payment' section in your dashboard. We accept card payments, UPI, and net banking.",
  fee_structure:
    "Fee structure varies by student type:\n• Hostel: ₹1,60,000/semester\n• Day Scholar: ₹1,05,000/semester\nIncludes tuition, development, and other applicable fees.",
  payment_history: "Check your complete payment history in the 'Fee Payment' section under the 'Payment History' tab.",
  help: {
    text: "I can help you with:\n• Attendance queries and statistics\n• Faculty information and office hours\n• Fee payments and history\n• Absence request status\n• General college information",
    quickReplies: [
      { text: "Technical Support", payload: "tech_support" },
      { text: "Academic Support", payload: "academic_support" },
    ],
  },
  tech_support:
    "For technical issues with the portal, please contact IT support at it-support@college.edu or visit the IT help desk in the main building.",
  academic_support:
    "For academic queries, you can contact your respective faculty during office hours or reach out to the academic office.",
  default:
    "I understand you're asking about that. Let me help you find the right information. You can also try asking about attendance, faculty, fees, or general help.",
}

const getSmartResponse = (message: string): string | { text: string; quickReplies?: QuickReply[] } => {
  const lowerMessage = message.toLowerCase()

  // Greeting patterns
  if (lowerMessage.match(/^(hi|hello|hey|good morning|good afternoon)/)) {
    return mockResponses.greeting
  }

  // Attendance patterns
  if (lowerMessage.includes("attendance") || lowerMessage.includes("present") || lowerMessage.includes("absent")) {
    return mockResponses.attendance
  }

  // Faculty patterns
  if (lowerMessage.includes("faculty") || lowerMessage.includes("teacher") || lowerMessage.includes("professor")) {
    return mockResponses.faculty
  }

  // Fee patterns
  if (lowerMessage.includes("fee") || lowerMessage.includes("payment") || lowerMessage.includes("pay")) {
    return mockResponses.fees
  }

  // Help patterns
  if (lowerMessage.includes("help") || lowerMessage.includes("support")) {
    return mockResponses.help
  }

  // Check for specific payloads
  if (mockResponses[lowerMessage]) {
    return mockResponses[lowerMessage]
  }

  return mockResponses.default
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your virtual assistant. How can I help you today?",
      isBot: true,
      timestamp: new Date(),
      type: "quick_reply",
      data: {
        quickReplies: [
          { text: "Check Attendance", payload: "attendance" },
          { text: "Faculty Info", payload: "faculty" },
          { text: "Fee Status", payload: "fees" },
          { text: "Help", payload: "help" },
        ],
      },
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = (text?: string) => {
    const messageText = text || inputValue
    if (!messageText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isBot: false,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate bot response
    setTimeout(() => {
      const response = getSmartResponse(messageText)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: typeof response === "string" ? response : response.text,
        isBot: true,
        timestamp: new Date(),
        type: typeof response === "object" && response.quickReplies ? "quick_reply" : "text",
        data: typeof response === "object" ? { quickReplies: response.quickReplies } : undefined,
      }
      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  }

  const handleQuickReply = (payload: string, text: string) => {
    sendMessage(text)
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 animate-pulse"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-80 h-[500px] shadow-xl z-50 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-primary/10 rounded-full">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-sm">Virtual Assistant</CardTitle>
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id}>
                    <div className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}>
                      <div className="flex items-start gap-2 max-w-[85%]">
                        {message.isBot && (
                          <div className="p-1 bg-primary/10 rounded-full mt-1">
                            <Bot className="h-3 w-3 text-primary" />
                          </div>
                        )}
                        <div
                          className={`rounded-lg px-3 py-2 text-sm ${
                            message.isBot
                              ? "bg-muted text-muted-foreground"
                              : "bg-primary text-primary-foreground ml-auto"
                          }`}
                        >
                          <div className="whitespace-pre-line">{message.text}</div>
                          <div className="flex items-center gap-1 mt-1 opacity-70">
                            <Clock className="h-2 w-2" />
                            <span className="text-xs">
                              {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                        </div>
                        {!message.isBot && (
                          <div className="p-1 bg-primary/10 rounded-full mt-1">
                            <User className="h-3 w-3 text-primary" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quick Replies */}
                    {message.type === "quick_reply" && message.data?.quickReplies && (
                      <div className="flex flex-wrap gap-2 mt-2 ml-8">
                        {message.data.quickReplies.map((reply: QuickReply, index: number) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="text-xs h-7 bg-transparent"
                            onClick={() => handleQuickReply(reply.payload, reply.text)}
                          >
                            {reply.text}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-primary/10 rounded-full">
                        <Bot className="h-3 w-3 text-primary" />
                      </div>
                      <div className="bg-muted rounded-lg px-3 py-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button size="icon" onClick={() => sendMessage()} disabled={!inputValue.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex gap-1 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-6 px-2"
                  onClick={() => sendMessage("attendance")}
                >
                  <BarChart3 className="h-3 w-3 mr-1" />
                  Attendance
                </Button>
                <Button variant="ghost" size="sm" className="text-xs h-6 px-2" onClick={() => sendMessage("faculty")}>
                  <Users className="h-3 w-3 mr-1" />
                  Faculty
                </Button>
                <Button variant="ghost" size="sm" className="text-xs h-6 px-2" onClick={() => sendMessage("fees")}>
                  <CreditCard className="h-3 w-3 mr-1" />
                  Fees
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
