"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HelpCircle, ChevronDown, Mail } from "lucide-react"

const faqs = [
  {
    question: "How does MeetScribe work?",
    answer:
      "MeetScribe uses cutting-edge AI to record, transcribe, and summarize meetings in real time. You simply start a meeting, and the platform handles the rest — delivering organized notes and follow-up actions instantly."
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. MeetScribe ensures top-tier security by encrypting all data both in transit and at rest. We are GDPR-compliant and never share your meeting data with third parties."
  },
  {
    question: "Can I use MeetScribe with a team?",
    answer:
      "Absolutely. Our Team plan allows multiple users to collaborate, share transcripts, comment, and assign actions across a shared dashboard."
  },
  {
    question: "Does MeetScribe support Zoom or Google Meet?",
    answer:
      "Yes. MeetScribe integrates directly with Zoom and Google Meet. With browser permissions, you can capture any web-based meeting effortlessly."
  },
  {
    question: "Can I export summaries and transcripts?",
    answer:
      "Of course. You can export notes in various formats including PDF, DOCX, and TXT. Our export includes timestamps, speaker labels, and AI highlights."
  },
  {
    question: "Do you offer a free trial?",
    answer:
      "Yes! MeetScribe offers a 7-day free trial with full access to transcription, summary, and export tools. No credit card is required."
  }
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="min-h-screen px-6 py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black text-gray-800 dark:text-gray-200">
      <div className="max-w-5xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-3 text-4xl sm:text-5xl font-extrabold text-[hsl(255,75%,63%)] mb-4"
        >
          <HelpCircle className="w-9 h-9" />
          Frequently Asked Questions
        </motion.h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Get answers to common questions about how MeetScribe works, security, integrations, and more.
        </p>
      </div>

      <div className="mt-16 max-w-4xl mx-auto space-y-6 px-2 sm:px-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-5 flex items-center justify-between text-left text-lg font-semibold text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900 transition"
            >
              {faq.question}
              <ChevronDown
                className={`w-5 h-5 transform transition-transform ${
                  openIndex === index ? "rotate-180 text-[hsl(255,75%,63%)]" : "rotate-0"
                }`}
              />
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 pb-6 text-gray-600 dark:text-gray-300 text-sm leading-relaxed"
                >
                  {faq.answer}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="mt-24 mx-auto max-w-2xl text-center px-4">
        <div className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-sm">
          <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
            Still have a question?
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            If you didn’t find what you were looking for, our team is ready to help.
          </p>
          <a
            href="mailto:meetscribe0@gmail.com"
            className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-[hsl(255,75%,63%)] text-white font-medium shadow hover:bg-[hsl(255,75%,53%)] transition"
          >
            <Mail className="w-5 h-5" />
            Email Support
          </a>
        </div>
      </div>
    </section>
  )
}
