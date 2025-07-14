"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import SidebarNavigation from "@/components/dashboard/sidebar-navigation"
import { ChevronLeft, ChevronRight, Plus, CalendarIcon } from "lucide-react"
import Link from "next/link"
import type { User, Meeting, ApiResponse } from "@/types"

export default function CalendarPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentView, setCurrentView] = useState<"month" | "week" | "day">("month")

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get current user from auth API
        const userResponse = await fetch("/api/auth/me", {
          credentials: "include",
        })

        if (!userResponse.ok) {
          router.push("/auth/sign-in")
          return
        }

        const userData: ApiResponse<User> = await userResponse.json()
        if (!userData.user) {
          router.push("/auth/sign-in")
          return
        }

        setUser(userData.user)

        // Get meetings for the current user
        const meetingsResponse = await fetch(`/api/meetings?userId=${userData.user._id}`, {
          credentials: "include",
        })

        if (meetingsResponse.ok) {
          const meetingsData: ApiResponse<Meeting[]> = await meetingsResponse.json()
          setMeetings(meetingsData.data || [])
        }

        setLoading(false)
      } catch (error) {
        console.error("Error loading calendar data:", error)
        router.push("/auth/sign-in")
      }
    }

    loadData()
  }, [router])

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  // Calendar navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Get calendar data
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()
  const startingDayOfWeek = firstDayOfMonth.getDay()

  // Generate calendar days
  const calendarDays = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push({ day: null, isCurrentMonth: false })
  }

  // Add days of the current month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({ day, isCurrentMonth: true })
  }

  // Add empty cells for days after the last day of the month to complete the grid
  const remainingCells = 42 - calendarDays.length // 6 rows of 7 days
  for (let i = 0; i < remainingCells; i++) {
    calendarDays.push({ day: null, isCurrentMonth: false })
  }

  // Group meetings by date
  const meetingsByDate: Record<string, Meeting[]> = {}

  meetings.forEach((meeting) => {
    const meetingDate = new Date(meeting.date)
    const dateKey = `${meetingDate.getFullYear()}-${meetingDate.getMonth()}-${meetingDate.getDate()}`

    if (!meetingsByDate[dateKey]) {
      meetingsByDate[dateKey] = []
    }

    meetingsByDate[dateKey].push(meeting)
  })

  // Check if a day has meetings
  const getMeetingsForDay = (day: number | null) => {
    if (!day) return []

    const dateKey = `${currentYear}-${currentMonth}-${day}`
    return meetingsByDate[dateKey] || []
  }

  return (
    <div className="flex h-screen">
      <SidebarNavigation user={user} />

      <div className="flex-1 overflow-auto">
        <div className="p-8 pt-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>
              <p className="text-muted-foreground">Manage your meetings and schedule</p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/dashboard/new-meeting">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Meeting
                </Button>
              </Link>
            </div>
          </div>

          <Card className="border-purple-100">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <CardTitle className="text-xl">
                    {monthNames[currentMonth]} {currentYear}
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={goToToday}>
                      Today
                    </Button>
                    <Button variant="outline" size="icon" onClick={goToNextMonth}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={currentView}
                    onValueChange={(value: "month" | "week" | "day") => setCurrentView(value)}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="View" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">Month</SelectItem>
                      <SelectItem value="week">Week</SelectItem>
                      <SelectItem value="day">Day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map((day, index) => (
                  <div key={index} className="text-center text-sm font-medium py-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 auto-rows-fr">
                {calendarDays.map((day, index) => {
                  const dayMeetings = getMeetingsForDay(day.day)
                  const isToday =
                    day.isCurrentMonth &&
                    day.day === new Date().getDate() &&
                    currentMonth === new Date().getMonth() &&
                    currentYear === new Date().getFullYear()

                  return (
                    <div
                      key={index}
                      className={`min-h-[100px] border rounded-md p-1 ${
                        day.isCurrentMonth ? "bg-white" : "bg-gray-50"
                      } ${isToday ? "border-primary" : "border-border"}`}
                    >
                      {day.day && (
                        <>
                          <div className={`text-right text-sm font-medium p-1 ${isToday ? "text-primary" : ""}`}>
                            {day.day}
                          </div>
                          <div className="space-y-1 mt-1">
                            {dayMeetings.slice(0, 3).map((meeting, idx) => {
                              const meetingDate = new Date(meeting.date)
                              const time = meetingDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

                              return (
                                <Link
                                  key={idx}
                                  href={
                                    meeting.transcriptionAvailable
                                      ? `/dashboard/transcriptions/${meeting._id}`
                                      : `/dashboard/new-meeting?id=${meeting._id}`
                                  }
                                >
                                  <div
                                    className={`text-xs p-1 rounded truncate ${
                                      meeting.status === "completed"
                                        ? "bg-green-100 text-green-800"
                                        : meeting.status === "in-progress"
                                          ? "bg-blue-100 text-blue-800"
                                          : "bg-purple-100 text-purple-800"
                                    }`}
                                  >
                                    {time} - {meeting.title}
                                  </div>
                                </Link>
                              )
                            })}
                            {dayMeetings.length > 3 && (
                              <div className="text-xs text-center text-muted-foreground">
                                +{dayMeetings.length - 3} more
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Upcoming Meetings</h3>
            <div className="space-y-2">
              {meetings
                .filter((meeting) => new Date(meeting.date) >= new Date())
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(0, 5)
                .map((meeting, index) => {
                  const meetingDate = new Date(meeting.date)
                  const formattedDate = meetingDate.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })
                  const formattedTime = meetingDate.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })

                  return (
                    <Card key={index} className="border-purple-100">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <CalendarIcon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{meeting.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {formattedDate} at {formattedTime} • {meeting.duration} minutes
                            </p>
                          </div>
                        </div>
                        <Link
                          href={
                            meeting.transcriptionAvailable
                              ? `/dashboard/transcriptions/${meeting._id}`
                              : `/dashboard/new-meeting?id=${meeting._id}`
                          }
                        >
                          <Button variant="outline">
                            {meeting.status === "scheduled" ? "Join Meeting" : "View Details"}
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  )
                })}
              {meetings.filter((meeting) => new Date(meeting.date) >= new Date()).length === 0 && (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No upcoming meetings</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
