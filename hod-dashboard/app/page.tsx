
"use client"

import { useState } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import type { HOD } from "@/lib/auth"

type AuthView = "login" | "register" | "forgot-password"

export default function HomePage() {
  // 👇 Start with "register" instead of "login"
  const [currentView, setCurrentView] = useState<AuthView>("register")
  const [user, setUser] = useState<HOD | null>(null)

  const handleAuthSuccess = (userData: HOD) => {
    setUser(userData)
  }

  const handleForgotPasswordSuccess = () => {
    setCurrentView("login")
  }

  const handleLogout = () => {
    setUser(null)
    setCurrentView("login")
  }

  if (user) {
    return <DashboardLayout user={user} onLogout={handleLogout} />
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {currentView === "login" && (
          <LoginForm
            onSuccess={handleAuthSuccess}
            onForgotPassword={() => setCurrentView("forgot-password")}
            onRegister={() => setCurrentView("register")}
          />
        )}

        {currentView === "register" && (
          <RegisterForm
            onSuccess={handleAuthSuccess}
            onLogin={() => setCurrentView("login")}
          />
        )}

        {currentView === "forgot-password" && (
          <ForgotPasswordForm
            onSuccess={handleForgotPasswordSuccess}
            onBack={() => setCurrentView("login")}
          />
        )}
      </div>
    </div>
  )
}
