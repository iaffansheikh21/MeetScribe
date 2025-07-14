# MongoDB Atlas Setup and Commands

## Database Information
- **Database Name**: `meetscribe`
- **Collections**: `users`, `meetings`, `aichatsummaries`

## MongoDB Atlas Shell Commands

### 1. Connect to your cluster
\`\`\`bash
mongosh "mongodb+srv://cluster0.xxxxx.mongodb.net/meetscribe" --apiVersion 1 --username <username>
\`\`\`

### 2. Switch to the meetscribe database
\`\`\`javascript
use meetscribe
\`\`\`

### 3. Insert Users Collection
\`\`\`javascript
db.users.insertMany([
  {
    name: "Alex Johnson",
    email: "alex@example.com",
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qK", // password123
    avatar: "/professional-man-glasses.png",
    stats: {
      totalMeetings: 24,
      hoursRecorded: 18.5,
      participants: 42,
      transcriptions: 18,
      changeFromLastMonth: {
        meetings: 3,
        hours: 2.5,
        participants: 8,
        transcriptions: 5
      }
    },
    createdAt: new Date("2024-01-15T10:00:00Z"),
    updatedAt: new Date("2024-05-20T14:30:00Z")
  },
  {
    name: "Sarah Lee",
    email: "sarah@example.com",
    password: "$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // securepass
    avatar: "/professional-woman-short-hair.png",
    stats: {
      totalMeetings: 31,
      hoursRecorded: 23.2,
      participants: 58,
      transcriptions: 27,
      changeFromLastMonth: {
        meetings: 2,
        hours: 1.8,
        participants: 4,
        transcriptions: 3
      }
    },
    createdAt: new Date("2024-01-20T09:00:00Z"),
    updatedAt: new Date("2024-05-19T16:45:00Z")
  }
])
\`\`\`

### 4. Get User IDs for reference
\`\`\`javascript
const users = db.users.find().toArray()
const alexId = users[0]._id
const sarahId = users[1]._id
\`\`\`

### 5. Insert Meetings Collection
\`\`\`javascript
db.meetings.insertMany([
  {
    userId: alexId,
    title: "Project Kickoff",
    date: new Date("2024-05-10T09:00:00Z"),
    duration: 60,
    participants: ["Emma", "David", "Priya"],
    status: "completed",
    transcriptionAvailable: true,
    audioUrl: "/audio/project-kickoff.mp3",
    transcript: {
      speakers: [
        { name: "Alex", color: "#4F46E5" },
        { name: "Emma", color: "#A855F7" },
        { name: "David", color: "#F59E0B" }
      ],
      segments: [
        {
          speakerId: ObjectId(),
          text: "Welcome everyone to our project kickoff",
          startTime: 0,
          endTime: 5
        },
        {
          speakerId: ObjectId(),
          text: "Excited to be working on this",
          startTime: 5,
          endTime: 10
        },
        {
          speakerId: ObjectId(),
          text: "Let me share the timeline",
          startTime: 12,
          endTime: 18
        }
      ]
    },
    createdAt: new Date("2024-05-10T09:00:00Z"),
    updatedAt: new Date("2024-05-10T10:00:00Z")
  },
  {
    userId: sarahId,
    title: "Marketing Strategy Review",
    date: new Date("2024-05-12T14:00:00Z"),
    duration: 45,
    participants: ["Sarah", "Tom", "Linda"],
    status: "completed",
    transcriptionAvailable: true,
    audioUrl: "/audio/marketing-strategy-review.mp3",
    transcript: {
      speakers: [
        { name: "Sarah", color: "#10B981" },
        { name: "Tom", color: "#3B82F6" },
        { name: "Linda", color: "#EF4444" }
      ],
      segments: [
        {
          speakerId: ObjectId(),
          text: "Let's begin the strategy review",
          startTime: 0,
          endTime: 4
        },
        {
          speakerId: ObjectId(),
          text: "Q2 campaign results exceeded goals",
          startTime: 4,
          endTime: 9
        },
        {
          speakerId: ObjectId(),
          text: "Social media engagement doubled",
          startTime: 10,
          endTime: 14
        }
      ]
    },
    createdAt: new Date("2024-05-12T14:00:00Z"),
    updatedAt: new Date("2024-05-12T14:45:00Z")
  },
  {
    userId: alexId,
    title: "Sprint Planning",
    date: new Date("2024-05-15T11:00:00Z"),
    duration: 90,
    participants: ["Emma", "David", "Jordan"],
    status: "completed",
    transcriptionAvailable: true,
    audioUrl: "/audio/sprint-planning.mp3",
    createdAt: new Date("2024-05-15T11:00:00Z"),
    updatedAt: new Date("2024-05-15T12:30:00Z")
  },
  {
    userId: alexId,
    title: "Client Review",
    date: new Date("2024-05-20T14:00:00Z"),
    duration: 45,
    participants: ["Client A", "Client B", "David"],
    status: "scheduled",
    transcriptionAvailable: false,
    createdAt: new Date("2024-05-18T10:00:00Z"),
    updatedAt: new Date("2024-05-18T10:00:00Z")
  }
])
\`\`\`

### 6. Get Meeting IDs for AI Chat Summaries
\`\`\`javascript
const meetings = db.meetings.find().toArray()
const meeting1Id = meetings[0]._id
const meeting2Id = meetings[1]._id
\`\`\`

### 7. Insert AI Chat Summaries Collection
\`\`\`javascript
db.aichatsummaries.insertMany([
  {
    meetingId: meeting1Id,
    summary: {
      title: "Project Kickoff Meeting",
      date: "May 10, 2024",
      duration: "60 minutes",
      participants: ["Alex", "Emma", "David", "Priya"],
      keyPoints: ["Project scope approved", "Timeline set for 3 months", "Emma leads frontend"],
      actionItems: [
        {
          assignee: "David",
          task: "Send requirements doc",
          dueDate: "May 12"
        }
      ],
      decisions: ["Proceed with current scope", "Weekly check-ins scheduled", "Emma to lead frontend development"]
    },
    aiChat: [
      { 
        sender: "user", 
        text: "Summarize the key decisions", 
        timestamp: new Date("2024-05-10T10:30:00Z") 
      },
      {
        sender: "ai",
        text: "1. Project scope approved\n2. 3 month timeline\n3. Emma leads frontend",
        timestamp: new Date("2024-05-10T10:30:05Z")
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    meetingId: meeting2Id,
    summary: {
      title: "Marketing Strategy Review",
      date: "May 12, 2024",
      duration: "45 minutes",
      participants: ["Sarah", "Tom", "Linda"],
      keyPoints: ["Q2 goals exceeded", "High-performing social campaigns", "Budget reallocation discussed"],
      actionItems: [
        {
          assignee: "Tom",
          task: "Prepare Q3 plan",
          dueDate: "May 15"
        }
      ],
      decisions: ["Increase ad budget", "Focus on influencer outreach", "Double content frequency"]
    },
    aiChat: [
      { 
        sender: "user", 
        text: "What were the action items?", 
        timestamp: new Date("2024-05-12T15:00:00Z") 
      },
      { 
        sender: "ai", 
        text: "1. Tom to prepare Q3 plan by May 15", 
        timestamp: new Date("2024-05-12T15:00:03Z") 
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
])
\`\`\`

### 8. Verify Data Insertion
\`\`\`javascript
// Check collections
db.users.countDocuments()
db.meetings.countDocuments()
db.aichatsummaries.countDocuments()

// View sample data
db.users.findOne()
db.meetings.findOne()
db.aichatsummaries.findOne()
\`\`\`

### 9. Create Indexes for Better Performance
\`\`\`javascript
// User indexes
db.users.createIndex({ email: 1 }, { unique: true })

// Meeting indexes
db.meetings.createIndex({ userId: 1 })
db.meetings.createIndex({ date: -1 })
db.meetings.createIndex({ title: "text", participants: "text" })

// AI Chat Summary indexes
db.aichatsummaries.createIndex({ meetingId: 1 }, { unique: true })
\`\`\`

## Setup Instructions

1. **Install Dependencies**:
   \`\`\`bash
   npm install mongoose bcryptjs @types/bcryptjs
   \`\`\`

2. **Environment Setup**:
   - Copy the `.env.local` file and update with your MongoDB Atlas connection string
   - Replace `username`, `password`, and cluster details

3. **Database Connection Test**:
   \`\`\`bash
   npm run dev
   \`\`\`
   Check console for "✅ MongoDB connected successfully"

4. **Seed Database** (Alternative to manual insertion):
   \`\`\`bash
   npm run db:seed
   \`\`\`

## Demo Login Credentials
- **Email**: alex@example.com | **Password**: password123
- **Email**: sarah@example.com | **Password**: securepass
\`\`\`

\`\`\`typescriptreact file="app/auth/sign-in/page.tsx"
[v0-no-op-code-block-prefix]"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { APIClient } from "@/lib/api-client"

export default function SignInPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Authenticate user using the new API
      const user = await APIClient.authenticateUser(email, password)

      if (user) {
        // Store the user ID in localStorage
        localStorage.setItem("currentUserId", user._id)
        router.push("/dashboard")
      } else {
        setError("Invalid email or password. Try alex@example.com / password123 or sarah@example.com / securepass")
      }
    } catch (error) {
      console.error("Authentication error:", error)
      setError("An error occurred during sign in. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
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
            <span className="text-xl font-bold">MeetScribe</span>
          </Link>
        </div>

        <Card className="border-purple-100 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm font-normal">
                  Remember me for 30 days
                </Label>
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <Button variant="outline" type="button" className="w-full">
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </Button>
                <Button variant="outline" type="button" className="w-full">
                  <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                  Facebook
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/auth/sign-up" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Demo Accounts:</p>
          <p>alex@example.com / password123</p>
          <p>sam@example.com / password123</p>
        </div>
      </div>
    </div>
  )
}
