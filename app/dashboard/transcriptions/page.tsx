"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SidebarNavigation from "@/components/dashboard/sidebar-navigation"
import { Search, FileText, Clock, Calendar } from "lucide-react"
import type { User, Meeting, ApiResponse } from "@/types"

export default function TranscriptionsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

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

        // Get meetings with transcriptions
        const meetingsResponse = await fetch(`/api/meetings?userId=${userData.user._id}`, {
          credentials: "include",
        })

        if (meetingsResponse.ok) {
          const meetingsData: ApiResponse<Meeting[]> = await meetingsResponse.json()
          const transcribedMeetings = (meetingsData.data || []).filter(
            (meeting: Meeting) => meeting.transcriptionAvailable,
          )
          setMeetings(transcribedMeetings)
        }

        setLoading(false)
      } catch (error) {
        console.error("Error loading transcriptions:", error)
        router.push("/auth/sign-in")
      }
    }

    loadData()
  }, [router])

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
        const transcribedResults = (data.data || []).filter((meeting: Meeting) => meeting.transcriptionAvailable)
        setMeetings(transcribedResults)
      }
    } catch (error) {
      console.error("Error searching meetings:", error)
    }
  }

  if (loading || !user) {
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
        <div className="flex-1 space-y-8 p-8 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Transcriptions</h2>
            <div className="flex items-center gap-4">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transcriptions..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <Link href="/dashboard/new-meeting">
                <Button>
                  <FileText className="mr-2 h-4 w-4" />
                  New Transcription
                </Button>
              </Link>
            </div>
          </div>

          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="all">All Transcriptions</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="shared">Shared with Me</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="grid gap-4">
                {meetings.map((meeting) => (
                  <TranscriptionListItem key={meeting._id} meeting={meeting} />
                ))}
                {meetings.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">No transcriptions found</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="recent" className="space-y-4">
              <div className="grid gap-4">
                {meetings.slice(0, 3).map((meeting) => (
                  <TranscriptionListItem key={meeting._id} meeting={meeting} />
                ))}
                {meetings.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">No recent transcriptions found</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="shared" className="space-y-4">
              <div className="grid gap-4">
                {/* In a real app, you would filter for shared meetings */}
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No shared transcriptions found</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

interface TranscriptionListItemProps {
  meeting: Meeting
}

function TranscriptionListItem({ meeting }: TranscriptionListItemProps) {
  // Format date
  const date = new Date(meeting.date)
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <Card className="border-purple-100 hover:border-primary transition-colors">
      <CardContent className="p-0">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">{meeting.title}</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  {formattedDate}
                </div>
                <div className="flex items-center">
                  <Clock className="mr-1 h-3 w-3" />
                  {meeting.duration} minutes
                </div>
              </div>
            </div>
          </div>
          <Link href={`/dashboard/transcriptions/${meeting._id}`}>
            <Button variant="outline" className="hover:bg-primary/10 hover:text-primary">
              View Transcription
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
