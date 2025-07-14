// export default function FaqsPage() {
//   const faqs = [
//     {
//       question: "How accurate is the transcription?",
//       answer: "Our AI provides up to 99% accurate transcription depending on audio quality."
//     },
//     {
//       question: "Can I export transcripts?",
//       answer: "Yes, you can export your transcripts in TXT, PDF, or DOCX format."
//     },
//     {
//       question: "Is my data secure?",
//       answer: "All your data is encrypted in transit and at rest."
//     }
//   ];

//   return (
//     <div className="min-h-screen px-4 py-20 md:py-28 container mx-auto max-w-3xl animate-fade-in">
//       <h1 className="text-4xl font-bold mb-10 text-center">FAQs</h1>
//       <div className="space-y-6">
//         {faqs.map((faq, i) => (
//           <div key={i} className="border-b pb-4">
//             <h3 className="text-xl font-medium mb-2">{faq.question}</h3>
//             <p className="text-muted-foreground">{faq.answer}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const faqs = [
  {
    question: "How does MeetScribe work?",
    answer: "MeetScribe records your meetings, transcribes them in real-time, and generates summaries using AI."
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. All your meeting data is encrypted and stored securely in the cloud."
  },
  {
    question: "Can I use MeetScribe for team collaboration?",
    answer: "Yes! Our Team plan includes collaboration tools and shared access."
  },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <section className="min-h-screen px-4 py-20 bg-muted">
      <div className="container mx-auto max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold mb-8 text-center"
        >
          Frequently Asked Questions
        </motion.h1>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left px-4 py-3 font-medium bg-background hover:bg-muted transition-colors"
              >
                {faq.question}
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-4 py-3 text-muted-foreground text-sm"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
