"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SidebarNavigation from "@/components/dashboard/sidebar-navigation"
import { BarChart3, TrendingUp, Users, Clock } from "lucide-react"
import type { User, UserStats, ApiResponse } from "@/types"

export default function AnalyticsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

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

        // Load user stats
        const statsResponse = await fetch(`/api/stats/${userData.user._id}`, {
          credentials: "include",
        })

        if (statsResponse.ok) {
          const statsData: ApiResponse<UserStats> = await statsResponse.json()
          setStats(statsData.data || null)
        }

        setLoading(false)
      } catch (error) {
        console.error("Error loading analytics data:", error)
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

  return (
    <div className="flex h-screen">
      <SidebarNavigation user={user} />

      <div className="flex-1 overflow-auto">
        <div className="p-8 pt-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
            <p className="text-muted-foreground">Insights and metrics for your meetings</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-purple-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Meetings</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalMeetings || 0}</div>
                <p className="text-xs text-muted-foreground">
                  +{stats?.changeFromLastMonth?.meetings || 0} from last month
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hours Recorded</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.hoursRecorded || 0}</div>
                <p className="text-xs text-muted-foreground">
                  +{stats?.changeFromLastMonth?.hours || 0} from last month
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Participants</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.participants || 0}</div>
                <p className="text-xs text-muted-foreground">
                  +{stats?.changeFromLastMonth?.participants || 0} from last month
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.changeFromLastMonth?.meetings
                    ? `+${((stats.changeFromLastMonth.meetings / Math.max(stats.totalMeetings - stats.changeFromLastMonth.meetings, 1)) * 100).toFixed(1)}%`
                    : "+0%"}
                </div>
                <p className="text-xs text-muted-foreground">Meeting frequency increase</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Card className="border-purple-100">
              <CardHeader>
                <CardTitle>Meeting Analytics</CardTitle>
                <CardDescription>Detailed insights about your meeting patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Analytics Dashboard</h3>
                  <p className="text-muted-foreground">
                    Detailed analytics and charts will be available here to track your meeting performance and trends.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
