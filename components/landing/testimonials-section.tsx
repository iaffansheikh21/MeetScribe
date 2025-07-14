"use client"
import { motion } from "framer-motion"

const testimonials = [
  {
    quote:
      "MeetScribe has completely transformed how our team handles meetings. The transcriptions are incredibly accurate, and the AI summaries save us hours of work.",
    author: "Sarah Johnson",
    title: "Product Manager at TechCorp",
    avatar: "/professional-woman-short-hair.png",
  },
  {
    quote:
      "As someone who often misses details in meetings, this tool has been a game-changer. I can focus on the conversation and know that everything is being captured.",
    author: "Michael Chen",
    title: "Software Engineer at DevHub",
    avatar: "/asian-professional-glasses.png",
  },
  {
    quote:
      "The speaker identification feature is spot-on, even with our team of 12 people. It's made our remote meetings much more productive and inclusive.",
    author: "Jessica Williams",
    title: "HR Director at GlobalCo",
    avatar: "/professional-black-woman-smiling.png",
  },
]

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 px-4 bg-muted/50">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Thousands of teams are already using MeetScribe to improve their meeting productivity.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-background rounded-xl p-8 shadow-sm border border-border"
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
              title="Real user testimonial"
            >
              <div className="flex flex-col h-full">
                <div className="mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="45"
                    height="36"
                    fill="none"
                    viewBox="0 0 45 36"
                    className="text-primary/20"
                  >
                    <path
                      fill="currentColor"
                      d="M13.304 0C6.027 0 0 6.04 0 13.333c0 7.292 6.027 13.333 13.304 13.333 15.965 0 6.027 9.167 0 9.167V0h13.304zm31.043 0c-7.277 0-13.304 6.04-13.304 13.333 0 7.292 6.027 13.333 13.304 13.333 15.965 0 6.027 9.167 0 9.167V0h13.304z"
                    />
                  </svg>
                </div>
                <p className="text-lg mb-6 flex-grow">{testimonial.quote}</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.author}
                    className="h-12 w-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-medium">{testimonial.author}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
