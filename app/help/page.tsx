"use client"
import { motion } from "framer-motion"
import {
  HelpCircle,
  Mail,
  MessageSquare,
  ShieldCheck,
  User,
  CalendarCheck,
  CreditCard,
  Settings,
  Bot,
  Globe
} from "lucide-react"

export default function HelpPage() {
  return (
    <section className="min-h-screen px-6 py-20 bg-background text-gray-800 dark:text-gray-200">
      <div className="container mx-auto max-w-4xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold mb-6 text-[hsl(255,75%,63%)]"
        >
          <HelpCircle className="inline-block w-8 h-8 mr-2" />
          Help Center
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-muted-foreground text-lg mb-12"
        >
          Have questions? We've got answers. Explore our help topics or reach out to the MeetScribe support team.
        </motion.p>
      </div>

      <div className="mx-auto max-w-6xl grid gap-10 sm:grid-cols-2 lg:grid-cols-3 px-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-[hsl(255,75%,63%)] flex items-center gap-2">
            <User className="w-5 h-5" />
            Account & Login
          </h3>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li>How do I sign up for MeetScribe?</li>
            <li>How can I reset my password?</li>
            <li>How do I change my email or username?</li>
            <li>Can I delete my account permanently?</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-[hsl(255,75%,63%)] flex items-center gap-2">
            <CalendarCheck className="w-5 h-5" />
            Meetings & Transcripts
          </h3>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li>How do I start a meeting?</li>
            <li>Where are transcripts saved?</li>
            <li>Can I share or export meeting summaries?</li>
            <li>How accurate is the transcription engine?</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-[hsl(255,75%,63%)] flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Billing & Subscription
          </h3>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li>What subscription plans are available?</li>
            <li>How do I update my payment details?</li>
            <li>How can I cancel or pause my plan?</li>
            <li>Is there a refund policy?</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-[hsl(255,75%,63%)] flex items-center gap-2">
            <Bot className="w-5 h-5" />
            AI Features & Functionality
          </h3>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li>What AI model powers MeetScribe?</li>
            <li>Can I customize summary outputs?</li>
            <li>How does the AI handle multiple speakers?</li>
            <li>Is my data used to train the model?</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-[hsl(255,75%,63%)] flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Settings & Preferences
          </h3>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li>How can I update my language settings?</li>
            <li>Can I change my meeting timezone?</li>
            <li>How do I enable notifications?</li>
            <li>Is dark mode available?</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-[hsl(255,75%,63%)] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            Security & Privacy
          </h3>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li>How is my data protected?</li>
            <li>Where is my data stored?</li>
            <li>Does MeetScribe comply with GDPR?</li>
            <li>How can I request data deletion?</li>
          </ul>
        </div>
      </div>

      <div className="mt-24 mx-auto max-w-3xl px-4 text-center">
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow">
          <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
            Still Need Help?
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            If you can't find what you're looking for, our support team is happy to help you directly.
          </p>
          <div className="flex justify-center gap-6 flex-wrap">
            <a
              href="mailto:meetscribe0@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-[hsl(255,75%,63%)] text-white font-medium shadow hover:bg-[hsl(255,75%,53%)] transition"
            >
              <Mail className="w-5 h-5" />
              Email Support
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <MessageSquare className="w-5 h-5" />
              Live Chat
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
