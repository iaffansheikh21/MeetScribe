import type React from "react"
import type { Metadata } from "next"
import { Toaster } from "sonner"
import { UserProvider } from "@/context/UserContext"
import "./globals.css"

export const metadata: Metadata = {
  title: "MeetScribe - AI Meeting Transcription",
  description: "Transform your meetings with AI-powered transcription and insights",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          {children}
          <Toaster position="top-right" richColors closeButton duration={4000} />
        </UserProvider>
      </body>
    </html>
  )
}
