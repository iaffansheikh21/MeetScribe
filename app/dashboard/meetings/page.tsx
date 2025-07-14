"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SidebarNavigation from "@/components/dashboard/sidebar-navigation"
import MeetingCard from "@/components/dashboard/meeting-card"
import { Search, Plus, Calendar } from "lucide-react"
import type { Meeting, ApiResponse } from "@/types"
import { useUser } from "@/context/UserContext"
import { toast } from "@/lib/toast"

export default function MeetingsPage() {
  const router = useRouter()
  const { user, loading: userLoading } = useUser()
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [filteredMeetings, setFilteredMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "scheduled" | "in-progress">("all")

  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/auth/sign-in")
      return
    }

    if (user) {
      loadMeetings()
    }
  }, [user, userLoading, router])

  useEffect(() => {
    filterMeetings()
  }, [meetings, searchQuery, statusFilter])

  const loadMeetings = async () => {
    if (!user) return

    try {
      setLoading(true)
      const response = await fetch(`/api/meetings?userId=${user._id}`, {
        credentials: "include",
      })

      if (response.ok) {
        const data: ApiResponse<Meeting[]> = await response.json()
        setMeetings(data.data || [])
      } else {
        toast.error("Failed to load meetings")
      }
    } catch (error) {
      console.error("Error loading meetings:", error)
      toast.error("Failed to load meetings")
    } finally {
      setLoading(false)
    }
  }

  const filterMeetings = () => {
    let filtered = meetings

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (meeting) =>
          meeting.title.toLowerCase().includes(query) ||
          meeting.participants.some((participant) => participant.toLowerCase().includes(query)),
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((meeting) => meeting.status === statusFilter)
    }

    setFilteredMeetings(filtered)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  if (userLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <SidebarNavigation user={user} />

      <div className="flex-1 overflow-auto">
        <div className="p-8 pt-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">All Meetings</h1>
                <p className="text-muted-foreground">Manage and search through all your meetings</p>
              </div>
              <Button onClick={() => router.push("/dashboard/new-meeting")} className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                New Meeting
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search meetings by title or participants..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant={statusFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("all")}
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === "completed" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("completed")}
                >
                  Completed
                </Button>
                <Button
                  variant={statusFilter === "scheduled" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("scheduled")}
                >
                  Scheduled
                </Button>
                <Button
                  variant={statusFilter === "in-progress" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("in-progress")}
                >
                  In Progress
                </Button>
              </div>
            </div>
          </div>

          {/* Meetings Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredMeetings.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <CardTitle className="text-xl mb-2">
                  {searchQuery || statusFilter !== "all" ? "No meetings found" : "No meetings yet"}
                </CardTitle>
                <CardDescription className="mb-4">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "Create your first meeting to get started"}
                </CardDescription>
                {!searchQuery && statusFilter === "all" && (
                  <Button onClick={() => router.push("/dashboard/new-meeting")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Meeting
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMeetings.map((meeting) => (
                <MeetingCard key={meeting._id} meeting={meeting} />
              ))}
            </div>
          )}

          {/* Results Summary */}
          {!loading && filteredMeetings.length > 0 && (
            <div className="mt-8 text-center text-sm text-muted-foreground">
              Showing {filteredMeetings.length} of {meetings.length} meetings
              {searchQuery && ` for "${searchQuery}"`}
              {statusFilter !== "all" && ` with status "${statusFilter}"`}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
