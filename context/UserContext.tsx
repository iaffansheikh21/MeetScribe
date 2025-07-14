"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "@/types"

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  loading: boolean
  updateUser: (updates: Partial<User>) => void
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        // First try to get user from localStorage
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }

        // Then verify with server
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        })

        if (response.ok) {
          const userData = await response.json()
          // Handle both possible response formats
          const userObj = userData.user || userData.data
          if (userObj) {
            setUser(userObj)
            localStorage.setItem("user", JSON.stringify(userObj))
          } else {
            // Clear invalid session
            setUser(null)
            localStorage.removeItem("user")
          }
        } else {
          // Clear invalid session
          setUser(null)
          localStorage.removeItem("user")
        }
      } catch (error) {
        console.error("Error loading user:", error)
        setUser(null)
        localStorage.removeItem("user")
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const value = {
    user,
    setUser: (newUser: User | null) => {
      setUser(newUser)
      if (newUser) {
        localStorage.setItem("user", JSON.stringify(newUser))
      } else {
        localStorage.removeItem("user")
      }
    },
    loading,
    updateUser,
    logout,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
