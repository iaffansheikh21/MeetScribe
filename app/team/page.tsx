"use client"

import { motion } from "framer-motion"
import {
  User2Icon,
  InfinityIcon,
  Users,
  Crown,
  Cpu,
  PenTool,
  Megaphone,
  Code,
  ClipboardList
} from "lucide-react"

const team = [
  {
    name: "Muhammad Affan Sheikh",
    role: "CEO",
    image: "/Affan.jpg",
    description:
      "As Chief Executive Officer, Affan drives MeetScribe’s vision and oversees company-wide operations. He leads strategic planning, investor relations, and organizational growth while fostering a culture of innovation and accountability."
  },
  {
    name: "Saqlain Zaheer",
    role: "CTO",
    image: "/Saqlain.jpg",
    description:
      "As Chief Technology Officer, Saqlain leads the engineering and AI research teams. He is responsible for architecting scalable solutions, optimizing infrastructure, and ensuring that MeetScribe stays at the forefront of technology."
  },
  {
    name: "Usman Farooq",
    role: "Lead Designer",
    image: "/Usman.jpg",
    description:
      "Usman directs all aspects of user interface and experience design. He creates intuitive product flows and visual systems that enhance accessibility, usability, and brand identity across all platforms."
  }
]

export default function TeamPage() {
  return (
    <section className="min-h-screen px-4 sm:px-6 lg:px-12 py-20 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-3 text-4xl sm:text-5xl font-extrabold text-[hsl(255,75%,63%)] mb-6"
        >
          <User2Icon className="w-10 h-10 sm:w-12 sm:h-12" />
          Meet Our Team
        </motion.h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-16 italic leading-relaxed">
          A group of professionals dedicated to driving innovation and excellence.<br />
          MeetScribe is an AI-driven meeting assistant designed to transform every spoken word into clear, precise transcripts and action-focused summaries. By leveraging advanced natural language understanding and Gemini API models, MeetScribe empowers teams to revisit key decisions, assign tasks seamlessly, and maintain complete alignment long after the call ends.
        </p>
      </div>

      <div className="mx-auto max-w-7xl grid gap-10 sm:grid-cols-2 lg:grid-cols-3 mb-20 px-4 sm:px-0">
        {team.map((m, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -4, boxShadow: "0 20px 25px rgba(0,0,0,0.1)" }}
            className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 pt-20 border border-transparent hover:border-[hsl(255,75%,63%)] transition duration-300"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <img
                src={m.image}
                alt={m.name}
                className="h-24 w-24 sm:h-28 sm:w-28 rounded-full object-cover ring-4 ring-white dark:ring-gray-900"
              />
            </div>
            <h3 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white text-center">
              {m.name}
            </h3>
            <p className="text-sm uppercase text-[hsl(255,75%,63%)] text-center tracking-wider mt-1 mb-3">
              {m.role}
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {m.description}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mx-auto max-w-6xl mt-10 text-left px-4 sm:px-0 space-y-10">
        <h2 className="inline-flex items-center gap-3 text-3xl font-bold text-gray-900 dark:text-white">
          <InfinityIcon className="w-8 h-8 text-[hsl(255,75%,63%)]" />
          In-Depth Role Insights in Tech
        </h2>

        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <Crown className="min-w-[2.5rem] h-10 text-[hsl(255,75%,63%)] mt-1" />
            <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
              <strong>Chief Executive Officer (CEO):</strong> The CEO is the strategic anchor of MeetScribe, responsible for defining long-term goals, fostering a high-performing leadership culture, and ensuring each department aligns with the company’s mission. As the face of the organization, the CEO also oversees partnerships, financial health, and investor relations to ensure sustainable and ethical growth.
            </p>
          </div>

          <div className="flex items-start gap-4">
            <Cpu className="min-w-[2.5rem] h-10 text-[hsl(255,75%,63%)] mt-1" />
            <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
              <strong>Chief Technology Officer (CTO):</strong> The CTO leads innovation by architecting AI models, managing backend systems, and ensuring scalable infrastructure. They work across teams to guarantee secure, high-performance systems that support continuous improvement.
            </p>
          </div>

          <div className="flex items-start gap-4">
            <PenTool className="min-w-[2.5rem] h-10 text-[hsl(255,75%,63%)] mt-1" />
            <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
              <strong>Lead Designer:</strong> The design lead defines visual standards and ensures user journeys are simple, accessible, and beautiful. They collaborate closely with product and dev teams to deliver consistent, branded user experiences.
            </p>
          </div>

          <div className="flex items-start gap-4">
            <Megaphone className="min-w-[2.5rem] h-10 text-[hsl(255,75%,63%)] mt-1" />
            <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
              <strong>Head of Marketing:</strong> Responsible for shaping the brand voice, driving campaigns, and using data analytics to convert leads into loyal users. They coordinate across SEO, social, and PR to boost visibility.
            </p>
          </div>

          <div className="flex items-start gap-4">
            <Code className="min-w-[2.5rem] h-10 text-[hsl(255,75%,63%)] mt-1" />
            <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
              <strong>Senior Developer:</strong> Owns the codebase, sets coding standards, and ensures system performance. Works on everything from API integration to deployment and security, turning design into production-ready features.
            </p>
          </div>

          <div className="flex items-start gap-4">
            <ClipboardList className="min-w-[2.5rem] h-10 text-[hsl(255,75%,63%)] mt-1" />
            <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
              <strong>Product Manager:</strong> Gathers insights, defines priorities, and aligns product development with business goals. Acts as a central point between users, developers, and leadership to ensure continuous value delivery.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
