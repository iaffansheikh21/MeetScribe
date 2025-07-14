"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import SidebarNavigation from "@/components/dashboard/sidebar-navigation"
import MeetingCard from "@/components/dashboard/meeting-card"
import MeetingStats from "@/components/dashboard/meeting-stats"
import { useUser } from "@/context/UserContext"
import { toast } from "sonner"
import type { Meeting, UserStats, ApiResponse } from "@/types"

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading: userLoading } = useUser()
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (userLoading) return

    if (!user) {
      router.push("/auth/sign-in")
      return
    }

    const loadData = async () => {
      try {
        setLoading(true)

        // Load user's meetings and stats in parallel
        const [meetingsResponse, statsResponse] = await Promise.all([
          fetch(`/api/meetings?userId=${user._id}`, {
            credentials: "include",
          }),
          fetch(`/api/stats/${user._id}`, {
            credentials: "include",
          }),
        ])

        if (meetingsResponse.ok) {
          const meetingsData: ApiResponse<Meeting[]> = await meetingsResponse.json()
          setMeetings(meetingsData.data || [])
        } else {
          toast.error("Failed to load meetings")
        }

        if (statsResponse.ok) {
          const statsData: ApiResponse<UserStats> = await statsResponse.json()
          setStats(statsData.data || null)
        } else {
          toast.error("Failed to load statistics")
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error)
        toast.error("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user, userLoading, router])

  const handleSearch = async (query: string) => {
    if (!user) return

    setSearchQuery(query)

    try {
      const searchUrl = query
        ? `/api/meetings?userId=${user._id}&search=${encodeURIComponent(query)}`
        : `/api/meetings?userId=${user._id}`

      const response = await fetch(searchUrl, {
        credentials: "include",
      })

      if (response.ok) {
        const data: ApiResponse<Meeting[]> = await response.json()
        setMeetings(data.data || [])
      }
    } catch (error) {
      console.error("Error searching meetings:", error)
      toast.error("Search failed")
    }
  }

  // Show loading state
  if (userLoading || !user) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="w-64 border-r border-gray-200 bg-white p-4">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
        <div className="flex-1 p-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarNavigation user={user} />

      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
              <p className="text-muted-foreground">Welcome back, {user.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/dashboard/new-meeting">
                <Button>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4"
                  >
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" x2="12" y1="19" y2="22" />
                  </svg>
                  New Meeting
                </Button>
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-32" />
                ))}
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-48" />
                ))}
              </div>
            </div>
          ) : (
            <>
              <MeetingStats stats={stats} />

              <Tabs defaultValue="recent" className="space-y-4 mt-8">
                <div className="flex items-center justify-between">
                  <TabsList className="bg-muted/50">
                    <TabsTrigger value="recent">Recent Meetings</TabsTrigger>
                    <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                    <TabsTrigger value="all">All Meetings</TabsTrigger>
                  </TabsList>
                  <div className="relative w-64">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                    <Input
                      placeholder="Search meetings..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>
                </div>

                <TabsContent value="recent" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {meetings.slice(0, 6).map((meeting) => (
                      <MeetingCard key={meeting._id} meeting={meeting} />
                    ))}
                    {meetings.length === 0 && (
                      <div className="col-span-3 text-center py-10">
                        <p className="text-muted-foreground">No recent meetings found</p>
                        <Link href="/dashboard/new-meeting">
                          <Button className="mt-4">Create Your First Meeting</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="scheduled" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {meetings
                      .filter((meeting) => meeting.status === "scheduled")
                      .map((meeting) => (
                        <MeetingCard key={meeting._id} meeting={meeting} />
                      ))}
                    {meetings.filter((m) => m.status === "scheduled").length === 0 && (
                      <div className="col-span-3 text-center py-10">
                        <p className="text-muted-foreground">No scheduled meetings found</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="all" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {meetings.map((meeting) => (
                      <MeetingCard key={meeting._id} meeting={meeting} />
                    ))}
                    {meetings.length === 0 && (
                      <div className="col-span-3 text-center py-10">
                        <p className="text-muted-foreground">No meetings found</p>
                        <Link href="/dashboard/new-meeting">
                          <Button className="mt-4">Create Your First Meeting</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
