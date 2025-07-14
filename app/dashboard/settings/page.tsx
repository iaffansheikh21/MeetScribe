"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useUser } from "@/context/UserContext"
import { toast } from "sonner"

export default function SettingsPage() {
  const { user, updateUser } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/users/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        // Update user context with new data
        updateUser(result.data)
        toast.success("Profile updated successfully")
      } else {
        toast.error(result.error || "Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal information and profile picture</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={formData.avatar || "/placeholder.svg"} alt={formData.name} />
                  <AvatarFallback className="text-lg">{formData.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Label htmlFor="avatar">Profile Picture URL</Label>
                  <Input
                    id="avatar"
                    type="url"
                    value={formData.avatar}
                    onChange={(e) => handleInputChange("avatar", e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="mt-1"
                  />
                </div>
              </div>

              <Separator />

              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              <Separator />

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Profile"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>View your account details and statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-900">Member Since</p>
                <p className="text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Total Meetings</p>
                <p className="text-gray-600">{user.stats?.totalMeetings || 0}</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Hours Recorded</p>
                <p className="text-gray-600">{user.stats?.hoursRecorded || 0}</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Transcriptions</p>
                <p className="text-gray-600">{user.stats?.transcriptions || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
