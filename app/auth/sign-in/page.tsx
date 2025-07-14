// // "use client"

// // import type React from "react"

// // import { useState } from "react"
// // import { useRouter } from "next/navigation"
// // import Link from "next/link"
// // import { Button } from "@/components/ui/button"
// // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// // import { Input } from "@/components/ui/input"
// // import { Label } from "@/components/ui/label"
// // import { useUser } from "@/context/UserContext"
// // import { toast } from "sonner"

// // export default function SignInPage() {
// //   const router = useRouter()
// //   const { setUser } = useUser()
// //   const [isLoading, setIsLoading] = useState(false)
// //   const [formData, setFormData] = useState({
// //     email: "",
// //     password: "",
// //   })

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault()
// //     setIsLoading(true)

// //     try {
// //       const response = await fetch("/api/auth/login", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         credentials: "include",
// //         body: JSON.stringify(formData),
// //       })

// //       const result = await response.json()

// //       if (result.success) {
// //         setUser(result.data)
// //         toast.success("Signed in successfully")
// //         router.push("/dashboard")
// //       } else {
// //         toast.error(result.error || "Invalid credentials")
// //       }
// //     } catch (error) {
// //       console.error("Sign in error:", error)
// //       toast.error("Failed to sign in")
// //     } finally {
// //       setIsLoading(false)
// //     }
// //   }

// //   const handleInputChange = (field: string, value: string) => {
// //     setFormData((prev) => ({ ...prev, [field]: value }))
// //   }

// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
// //       <Card className="w-full max-w-md">
// //         <CardHeader className="space-y-1">
// //           <CardTitle className="text-2xl font-bold text-center">Sign in</CardTitle>
// //           <CardDescription className="text-center">
// //             Enter your email and password to access your account
// //           </CardDescription>
// //         </CardHeader>
// //         <CardContent>
// //           <form onSubmit={handleSubmit} className="space-y-4">
// //             <div className="space-y-2">
// //               <Label htmlFor="email">Email</Label>
// //               <Input
// //                 id="email"
// //                 type="email"
// //                 value={formData.email}
// //                 onChange={(e) => handleInputChange("email", e.target.value)}
// //                 required
// //                 placeholder="Enter your email"
// //               />
// //             </div>
// //             <div className="space-y-2">
// //               <Label htmlFor="password">Password</Label>
// //               <Input
// //                 id="password"
// //                 type="password"
// //                 value={formData.password}
// //                 onChange={(e) => handleInputChange("password", e.target.value)}
// //                 required
// //                 placeholder="Enter your password"
// //               />
// //             </div>
// //             <Button type="submit" className="w-full" disabled={isLoading}>
// //               {isLoading ? "Signing in..." : "Sign in"}
// //             </Button>
// //           </form>
// //           <div className="mt-4 text-center text-sm">
// //             Don't have an account?{" "}
// //             <Link href="/auth/sign-up" className="text-primary hover:underline">
// //               Sign up
// //             </Link>
// //           </div>
// //         </CardContent>
// //       </Card>
// //     </div>
// //   )
// // }

// "use client"

// import type React from "react"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { useUser } from "@/context/UserContext"
// import { toast } from "sonner"

// export default function SignInPage() {
//   const router = useRouter()
//   const { setUser } = useUser()
//   const [isLoading, setIsLoading] = useState(false)
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   })

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)

//     try {
//       const response = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify(formData),
//       })

//       const result = await response.json()

//       if (result.success) {
//         setUser(result.data)
//         toast.success("Signed in successfully")
//         router.push("/dashboard")
//       } else {
//         toast.error(result.error || "Invalid credentials")
//       }
//     } catch (error) {
//       console.error("Sign in error:", error)
//       toast.error("Failed to sign in")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleInputChange = (field: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }))
//   }

//   return (
//     <div
//       className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
//       style={{ backgroundImage: 'url("/landing_page.png")' }}
//     >
//       <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-0"></div>
//       <Card className="w-full max-w-md z-10 shadow-lg animate-fade-in-up">
//         <CardHeader className="space-y-1 text-center">
//           <Link href="/" className="inline-block">
//             <img src="/logo.png" alt="MeetScribe Logo" className="h-12 mx-auto mb-2 hover:scale-105 transition-transform duration-300" />
//           </Link>
//           <CardTitle className="text-3xl font-bold">Sign in</CardTitle>
//           <CardDescription>
//             Enter your email and password to access your account
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={(e) => handleInputChange("email", e.target.value)}
//                 required
//                 placeholder="Enter your email"
//                 className="transition-shadow focus:shadow-md"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 type="password"
//                 value={formData.password}
//                 onChange={(e) => handleInputChange("password", e.target.value)}
//                 required
//                 placeholder="Enter your password"
//                 className="transition-shadow focus:shadow-md"
//               />
//             </div>
//             <Button
//               type="submit"
//               className="w-full transition-all duration-300 hover:scale-[1.02] hover:shadow"
//               disabled={isLoading}
//             >
//               {isLoading ? "Signing in..." : "Sign in"}
//             </Button>
//           </form>
//           <div className="mt-4 text-center text-sm">
//             Don't have an account?{' '}
//             <Link href="/auth/sign-up" className="text-primary hover:underline">
//               Sign up
//             </Link>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUser } from "@/context/UserContext"
import { toast } from "sonner"
import { Eye, EyeOff } from "lucide-react"

export default function SignInPage() {
  const router = useRouter()
  const { setUser } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        setUser(result.data)
        toast.success("Signed in successfully")
        router.push("/dashboard")
      } else {
        toast.error(result.error || "Invalid credentials")
      }
    } catch (error) {
      console.error("Sign in error:", error)
      toast.error("Failed to sign in")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative p-4"
      style={{ backgroundImage: 'url("/landing_page.png")' }}
    >
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-0"></div>
      <Card className="w-full max-w-md z-10 shadow-lg animate-fade-in-up">
        <CardHeader className="space-y-1 text-center">
          <Link href="/" className="inline-block">
            <img
              src="/logo.png"
              alt="MeetScribe Logo"
              className="h-12 mx-auto mb-2 hover:scale-105 transition-transform duration-300"
            />
          </Link>
          <CardTitle className="text-3xl font-bold">Sign in</CardTitle>
          <CardDescription>
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                placeholder="Enter your email"
                className="transition-shadow focus:shadow-md"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="transition-shadow focus:shadow-md pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full transition-all duration-300 hover:scale-[1.02] hover:shadow"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link href="/auth/sign-up" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
