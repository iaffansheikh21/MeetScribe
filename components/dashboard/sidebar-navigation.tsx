"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Home, FileText, Calendar, BarChart3, Settings, Users, LogOut, ChevronDown, Mic } from "lucide-react"
import { useUser } from "@/context/UserContext"
import { toast } from "sonner"
import type { User } from "@/types"

interface SidebarNavigationProps {
  user: User
}

export default function SidebarNavigation({ user }: SidebarNavigationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { logout } = useUser()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })

      if (response.ok) {
        logout()
        toast.success("Logged out successfully")
        router.push("/auth/sign-in")
      } else {
        toast.error("Logout failed")
      }
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("Logout failed")
    } finally {
      setIsLoggingOut(false)
    }
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Transcriptions", href: "/dashboard/transcriptions", icon: FileText },
    { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Team", href: "/dashboard/team", icon: Users },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ]

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Mic className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">MeetScribe</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start ${
                    isActive
                      ? "bg-primary/10 text-primary hover:bg-primary/20"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Button>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* User Menu */}
      <div className="border-t border-gray-200 p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start p-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
              <LogOut className="mr-2 h-4 w-4" />
              {isLoggingOut ? "Logging out..." : "Log out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
