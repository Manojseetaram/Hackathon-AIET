// "use client"

// import { useState, useEffect } from "react"
// import Link from "next/link"
// import { usePathname, useRouter } from "next/navigation"
// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
// import { Home, BookOpen, Calendar, History, Mail, Users, User, LogOut, Menu, MessageCircle } from "lucide-react"
// import type { Faculty } from "@/lib/types"

// const navigation = [
//   { name: "Dashboard", href: "/dashboard", icon: Home },
//   { name: "Offered Subjects", href: "/subjects", icon: BookOpen },
//   { name: "Take Attendance", href: "/attendance", icon: Calendar },
//   { name: "Attendance History", href: "/history", icon: History },
//   { name: "Attendance Requests", href: "/requests", icon: Mail },
//   { name: "Student Summary", href: "/students", icon: Users },
//   { name: "AI Assistant", href: "/chatbot", icon: MessageCircle }, // Added chatbot navigation
//   { name: "Profile", href: "/profile", icon: User },
// ]

// interface FacultySidebarProps {
//   isOpen?: boolean
//   onToggle?: () => void
// }

// export function FacultySidebar({ isOpen = false, onToggle }: FacultySidebarProps) {
//   const pathname = usePathname()
//   const router = useRouter()
//   const [faculty, setFaculty] = useState<Faculty | null>(null)

//   useEffect(() => {
//     const facultyData = localStorage.getItem("faculty")
//     if (facultyData) {
//       setFaculty(JSON.parse(facultyData))
//     } else {
//       router.push("/")
//     }
//   }, [router])

//   const handleLogout = () => {
//     localStorage.removeItem("faculty")
//     router.push("/")
//   }

//   if (!faculty) return null

//   const SidebarContent = () => (
//     <div className="flex flex-col h-full">
//       {/* Header */}
//       <div className="flex items-center gap-3 p-6 border-b border-sidebar-border">
//         <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
//           <span className="text-white font-bold text-lg">FP</span>
//         </div>
//         <div>
//           <h2 className="font-semibold text-sidebar-foreground">Faculty Portal</h2>
//           <p className="text-sm text-sidebar-foreground/60">Smart Attendance</p>
//         </div>
//       </div>

//       {/* Faculty Info */}
//       <div className="p-4 border-b border-sidebar-border">
//         <div className="flex items-center gap-3">
//           <Avatar>
//             <AvatarFallback className="bg-blue-100 text-blue-600">
//               {faculty.name
//                 .split(" ")
//                 .map((n) => n[0])
//                 .join("")}
//             </AvatarFallback>
//           </Avatar>
//           <div className="flex-1 min-w-0">
//             <p className="font-medium text-sidebar-foreground truncate">{faculty.name}</p>
//             <p className="text-sm text-sidebar-foreground/60 truncate">{faculty.department}</p>
//           </div>
//         </div>
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 p-4 space-y-2">
//         {navigation.map((item) => {
//           const isActive = pathname === item.href
//           return (
//             <Link
//               key={item.name}
//               href={item.href}
//               className={cn(
//                 "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
//                 isActive
//                   ? "bg-sidebar-accent text-sidebar-accent-foreground"
//                   : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
//               )}
//             >
//               <item.icon className="h-4 w-4" />
//               {item.name}
//             </Link>
//           )
//         })}
//       </nav>

//       {/* Logout */}
//       <div className="p-4 border-t border-sidebar-border">
//         <Button
//           variant="ghost"
//           className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-sidebar-foreground"
//           onClick={handleLogout}
//         >
//           <LogOut className="h-4 w-4" />
//           Logout
//         </Button>
//       </div>
//     </div>
//   )

//   return (
//     <>
//       {/* Desktop Sidebar - Improved sliding animation and z-index */}
//       <div
//         className={cn(
//           "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border transform transition-all duration-300 ease-in-out hidden lg:block",
//           isOpen ? "translate-x-0" : "-translate-x-full",
//         )}
//       >
//         <SidebarContent />
//       </div>

//       {/* Mobile Sidebar using Sheet - Using shadcn Sheet component for better mobile experience */}
//       <Sheet>
//         <SheetTrigger asChild className="lg:hidden">
//           <Button variant="outline" size="icon" className="fixed top-4 left-4 z-50 bg-transparent">
//             <Menu className="h-4 w-4" />
//           </Button>
//         </SheetTrigger>
//         <SheetContent side="left" className="w-64 p-0 bg-sidebar border-sidebar-border">
//           <SidebarContent />
//         </SheetContent>
//       </Sheet>

//       {/* Desktop Toggle Button - Added toggle button for desktop sidebar */}
//       <Button
//         variant="outline"
//         size="icon"
//         className={cn("fixed top-4 z-50 hidden lg:flex transition-all duration-300", isOpen ? "left-72" : "left-4")}
//         onClick={onToggle}
//       >
//         <Menu className="h-4 w-4" />
//       </Button>
//     </>
//   )
// }



"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Home, BookOpen, Calendar, History, Mail, Users, User, LogOut, Menu, MessageCircle } from "lucide-react"
import type { Faculty } from "@/lib/types"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Offered Subjects", href: "/subjects", icon: BookOpen },
  { name: "Take Attendance", href: "/attendance", icon: Calendar },
  { name: "Attendance History", href: "/history", icon: History },
  { name: "Attendance Requests", href: "/requests", icon: Mail },
  { name: "Student Summary", href: "/students", icon: Users },
  { name: "AI Assistant", href: "/chatbot", icon: MessageCircle },
  { name: "Profile", href: "/profile", icon: User },
]

interface FacultySidebarProps {
  isOpen?: boolean
  onToggle?: () => void
}

export function FacultySidebar({ isOpen = false, onToggle }: FacultySidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [faculty, setFaculty] = useState<Faculty | null>(null)

  useEffect(() => {
    const fetchFaculty = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/")
        return
      }

      try {
        const response = await fetch("http://localhost:8080/faculty/getfaculty", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (response.ok) {
          const result = await response.json()
          setFaculty(result.data) // backend sends faculty struct inside `data`
        } else {
          router.push("/") // unauthorized → back to login
        }
      } catch (err) {
        router.push("/")
      }
    }

    fetchFaculty()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/")
  }

  if (!faculty) return null

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-6 border-b border-sidebar-border">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">FP</span>
        </div>
        <div>
          <h2 className="font-semibold text-sidebar-foreground">Faculty Portal</h2>
          <p className="text-sm text-sidebar-foreground/60">Smart Attendance</p>
        </div>
      </div>

      {/* Faculty Info */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {faculty.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sidebar-foreground truncate">{faculty.name}</p>
            <p className="text-sm text-sidebar-foreground/60 truncate">{faculty.department}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-sidebar-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border transform transition-all duration-300 ease-in-out hidden lg:block",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="outline" size="icon" className="fixed top-4 left-4 z-50 bg-transparent">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-sidebar border-sidebar-border">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Toggle */}
      <Button
        variant="outline"
        size="icon"
        className={cn("fixed top-4 z-50 hidden lg:flex transition-all duration-300", isOpen ? "left-72" : "left-4")}
        onClick={onToggle}
      >
        <Menu className="h-4 w-4" />
      </Button>
    </>
  )
}
