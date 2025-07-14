"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { currentUser } from "@/lib/data"
import { Mic, Home, FileText, Settings, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Transcriptions", href: "/dashboard/transcriptions", icon: FileText },
  { name: "New Meeting", href: "/dashboard/new-meeting", icon: Mic },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export default function DashboardHeader() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Link href="/" className="flex items-center gap-2 md:mr-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6 text-primary"
        >
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" x2="12" y1="19" y2="22" />
        </svg>
        <span className="hidden font-bold sm:inline-block">MeetScribe</span>
      </Link>

      <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      <nav className="hidden md:flex md:flex-1 md:items-center md:gap-4 lg:gap-6">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-2 text-sm font-medium ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {mobileMenuOpen && (
        <div className="absolute inset-x-0 top-16 z-50 bg-background border-b md:hidden">
          <div className="space-y-1 px-4 py-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 py-2 text-sm font-medium ${
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      )}

      <div className="ml-auto flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full overflow-hidden">
              <img
                src={currentUser.avatar || "/placeholder.svg"}
                alt={currentUser.name}
                className="h-8 w-8 rounded-full"
              />
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/dashboard/profile" className="flex w-full">
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/dashboard/settings" className="flex w-full">
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/dashboard/billing" className="flex w-full">
                Billing
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/auth/sign-in" className="flex w-full items-center">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
