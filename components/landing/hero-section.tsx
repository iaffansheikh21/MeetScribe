"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function HeroSection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-secondary/10 to-transparent blur-3xl rounded-xl" />

      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
              Transform Your Meetings with <span className="text-primary">AI-Powered</span> Transcripts
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Transcribe, summarize, and capture key insights from every meeting effortlessly and accurately.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link href="/auth/sign-up">
                  <Button size="lg" className="w-full sm:w-auto shadow-md">
                    Get Started for Free
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link href="#how-it-works">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    See How It Works
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <motion.div
              className="absolute -z-10 inset-0 bg-gradient-to-tr from-primary/30 to-secondary/30 rounded-3xl blur-3xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            />
            <motion.img
              src="/meeting-transcription-dashboard.png"
              alt="MeetScribe Dashboard"
              className="rounded-xl shadow-xl w-full"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200 }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
