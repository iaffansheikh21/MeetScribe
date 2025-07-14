"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Clock, Users, FileText } from "lucide-react"
import type { UserStats } from "@/types"

interface MeetingStatsProps {
  stats: UserStats | null
}

export default function MeetingStats({ stats }: MeetingStatsProps) {
  if (!stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-purple-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-1" />
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const statsData = [
    {
      title: "Total Meetings",
      value: stats.totalMeetings,
      change: stats.changeFromLastMonth.meetings,
      icon: BarChart3,
      color: "text-blue-600",
    },
    {
      title: "Hours Recorded",
      value: Math.round(stats.hoursRecorded * 10) / 10,
      change: Math.round(stats.changeFromLastMonth.hours * 10) / 10,
      icon: Clock,
      color: "text-green-600",
    },
    {
      title: "Participants",
      value: stats.participants,
      change: stats.changeFromLastMonth.participants,
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Transcriptions",
      value: stats.transcriptions,
      change: stats.changeFromLastMonth.transcriptions,
      icon: FileText,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => (
        <Card key={index} className="border-purple-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.change > 0 ? "+" : ""}
              {stat.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
