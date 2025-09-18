"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Send, X, User, Sparkles, Zap, Brain } from "lucide-react"
import { fetchChatbotResponse, createChatMessage, formatMessageTime, type ChatMessage } from "@/lib/chatbot"
import { cn } from "@/lib/utils"
import type { HOD } from "@/lib/auth"

interface ChatbotWidgetProps {
  user: HOD
}

export function ChatbotWidget({ user }: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    createChatMessage(
      "🎓 Hello! I'm your intelligent HOD Dashboard assistant powered by advanced AI. I can help you with:\n\n🧑‍🏫 Faculty analytics and insights\n📚 Subject management and assignments\n📊 Performance tracking and reports\n🔍 Smart search and recommendations\n\nTry asking me anything in natural language!",
      false,
    ),
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: "smooth",
        })
      }
    }
  }, [messages, isLoading])

  // Focus input when chatbot opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage = createChatMessage(inputValue.trim(), true)
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)
    setIsTyping(true)

    try {
      const response = await fetchChatbotResponse(userMessage.content, user.hodId)

      // Simulate typing delay for better UX
      setTimeout(() => {
        const botMessage = createChatMessage(response.message, false)
        setMessages((prev) => [...prev, botMessage])
        setIsTyping(false)
      }, 500)
    } catch (error) {
      const errorMessage = createChatMessage(
        "🚨 I encountered an error while processing your request. Please try again or contact support if the issue persists.",
        false,
      )
      setMessages((prev) => [...prev, errorMessage])
      setIsTyping(false)
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

  const quickActions = ["Show all faculty", "Department overview", "Subject statistics", "Faculty performance"]

  const handleQuickAction = (action: string) => {
    setInputValue(action)
    setTimeout(() => handleSendMessage(), 100)
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-2xl transition-all duration-300 z-50",
          "bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground",
          "hover:scale-110 active:scale-95 animate-pulse",
          isOpen && "scale-0 opacity-0 pointer-events-none",
        )}
        size="icon"
      >
        <div className="relative">
          <MessageCircle className="h-7 w-7" />
          <Sparkles className="h-3 w-3 absolute -top-1 -right-1 text-yellow-400" />
        </div>
      </Button>

      <Card
        className={cn(
          "fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-3rem)] shadow-2xl transition-all duration-300 z-50 flex flex-col",
          "border-accent/20 bg-gradient-to-b from-background to-background/95 backdrop-blur-sm",
          "sm:w-96 sm:h-[600px]", // Full size on larger screens
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none",
        )}
      >
        <CardHeader className="pb-3 border-b bg-gradient-to-r from-accent/10 to-accent/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 bg-gradient-to-r from-accent to-accent/80">
                <AvatarFallback className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground">
                  <Brain className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm">AI HOD Assistant</CardTitle>
                  <Badge variant="secondary" className="text-xs px-2 py-0">
                    <Zap className="h-2 w-2 mr-1" />
                    Smart
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                  Online & Learning
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {/* Chat Messages */}
        <CardContent className="flex-1 p-0 overflow-hidden">
          <ScrollArea ref={scrollAreaRef} className="h-full p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={cn("flex gap-3", message.isUser ? "justify-end" : "justify-start")}>
                  {!message.isUser && (
                    <Avatar className="h-7 w-7 bg-gradient-to-r from-accent to-accent/80">
                      <AvatarFallback className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground">
                        <Brain className="h-3 w-3" />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={cn(
                      "max-w-[85%] rounded-lg px-4 py-3 text-sm shadow-sm",
                      message.isUser
                        ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground ml-auto"
                        : "bg-muted/50 text-foreground border",
                    )}
                  >
                    <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                    <div
                      className={cn(
                        "text-xs mt-2 opacity-70",
                        message.isUser ? "text-primary-foreground/70" : "text-muted-foreground/70",
                      )}
                    >
                      {formatMessageTime(message.timestamp)}
                    </div>
                  </div>

                  {message.isUser && (
                    <Avatar className="h-7 w-7 bg-primary">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <User className="h-3 w-3" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {(isLoading || isTyping) && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="h-7 w-7 bg-gradient-to-r from-accent to-accent/80">
                    <AvatarFallback className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground">
                      <Brain className="h-3 w-3" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted/50 text-foreground rounded-lg px-4 py-3 text-sm border">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-accent rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-accent rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-muted-foreground">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>

        <div className="border-t bg-muted/20 p-4 space-y-3">
          {/* Quick Actions */}
          {messages.length <= 1 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Quick actions:</p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action) => (
                  <Button
                    key={action}
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 bg-transparent"
                    onClick={() => handleQuickAction(action)}
                    disabled={isLoading}
                  >
                    {action}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your department..."
              disabled={isLoading}
              className="flex-1 bg-background"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              size="icon"
              className="bg-accent hover:bg-accent/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-xs text-muted-foreground text-center">
            💡 Try: "Show faculty analytics" or "Which subjects need assignment?"
          </div>
        </div>
      </Card>
    </>
  )
}
