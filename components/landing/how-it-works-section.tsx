"use client"
import { motion } from "framer-motion"

const steps = [
  {
    number: "01",
    title: "Create a Meeting",
    description: "Enter a name for your meeting and click 'Start Meeting' to begin recording.",
  },
  {
    number: "02",
    title: "Record Your Conversation",
    description: "Our system will automatically capture and transcribe everything in real-time.",
  },
  {
    number: "03",
    title: "Review the Transcript",
    description: "After the meeting, review the full transcript with speaker labels and timestamps.",
  },
  {
    number: "04",
    title: "Generate AI Summary",
    description: "Use our AI to create meeting minutes, action items, and key takeaways.",
  },
]

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            MeetScribe makes it easy to capture and understand your meetings in just a few simple steps.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Steps */}
          <motion.div
            className="space-y-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.2 },
              },
            }}
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="flex gap-6 group"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
              >
                <motion.div
                  className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shadow-md relative"
                  animate={{
                    boxShadow: [
                      "0 0 0 rgba(0,0,0,0)",
                      "0 0 8px rgba(59,130,246,0.5)",
                      "0 0 0 rgba(0,0,0,0)",
                    ],
                  }}
                  transition={{
                    repeat: Infinity,
                    repeatDelay: 2,
                    duration: 2,
                  }}
                >
                  {step.number}
                </motion.div>
                <div>
                  <h3 className="text-xl font-medium mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="relative"
          >
            <motion.div
              className="absolute -z-10 inset-0 bg-gradient-to-tr from-secondary/20 to-primary/20 rounded-3xl blur-3xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            />
            <motion.img
              src="/meeting-transcription-process.png"
              alt="How MeetScribe Works"
              className="rounded-xl shadow-xl w-full"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200 }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
