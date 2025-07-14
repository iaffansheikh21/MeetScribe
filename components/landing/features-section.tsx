// "use client"
// import { motion } from "framer-motion"

// const features = [
//   {
//     title: "Real-time Transcription",
//     description: "Instantly convert speech to text with high accuracy across multiple speakers.",
//     icon: "mic",
//   },
//   {
//     title: "Speaker Identification",
//     description: "Automatically detect and label different speakers in your meetings.",
//     icon: "users",
//   },
//   {
//     title: "AI Meeting Minutes",
//     description: "Generate concise meeting summaries and action items with a single click.",
//     icon: "file-text",
//   },
//   {
//     title: "Searchable Archives",
//     description: "Easily search through past meetings to find exactly what you need.",
//     icon: "search",
//   },
//   {
//     title: "Secure Storage",
//     description: "All your meeting data is encrypted and stored securely in the cloud.",
//     icon: "shield",
//   },
//   {
//     title: "Easy Sharing",
//     description: "Share transcripts and summaries with team members who couldn't attend.",
//     icon: "share",
//   },
// ]

// export default function FeaturesSection() {
//   return (
//     <section id="features" className="py-20 px-4 bg-muted/50">
//       <div className="container mx-auto max-w-6xl">
//         <motion.div
//           className="text-center mb-16"
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           viewport={{ once: true }}
//         >
//           <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
//           <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
//             Everything you need to capture, understand, and share the valuable information from your meetings.
//           </p>
//         </motion.div>

//         <motion.div
//           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
//           initial="hidden"
//           whileInView="visible"
//           variants={{
//             hidden: {},
//             visible: {
//               transition: {
//                 staggerChildren: 0.15,
//               },
//             },
//           }}
//           viewport={{ once: true }}
//         >
//           {features.map((feature, index) => (
//             <motion.div
//               key={index}
//               className="bg-background rounded-lg p-6 shadow-sm border border-border transition-transform"
//               whileHover={{ scale: 1.03 }}
//               variants={{
//                 hidden: { opacity: 0, y: 40 },
//                 visible: { opacity: 1, y: 0 },
//               }}
//               transition={{ duration: 0.4 }}
//               title="AI Powered Meeting Assistant"
//             >
//               <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   className="h-6 w-6 text-primary"
//                 >
//                   {feature.icon === "mic" && (
//                     <>
//                       <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
//                       <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
//                       <line x1="12" x2="12" y1="19" y2="22" />
//                     </>
//                   )}
//                   {feature.icon === "users" && (
//                     <>
//                       <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
//                       <circle cx="9" cy="7" r="4" />
//                       <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
//                       <path d="M16 3.13a4 4 0 0 1 0 7.75" />
//                     </>
//                   )}
//                   {feature.icon === "file-text" && (
//                     <>
//                       <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
//                       <polyline points="14 2 14 8 20 8" />
//                       <line x1="16" x2="8" y1="13" y2="13" />
//                       <line x1="16" x2="8" y1="17" y2="17" />
//                       <line x1="10" x2="8" y1="9" y2="9" />
//                     </>
//                   )}
//                   {feature.icon === "search" && (
//                     <>
//                       <circle cx="11" cy="11" r="8" />
//                       <line x1="21" x2="16.65" y1="21" y2="16.65" />
//                     </>
//                   )}
//                   {feature.icon === "shield" && (
//                     <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
//                   )}
//                   {feature.icon === "share" && (
//                     <>
//                       <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
//                       <polyline points="16 6 12 2 8 6" />
//                       <line x1="12" x2="12" y1="2" y2="15" />
//                     </>
//                   )}
//                 </svg>
//               </div>
//               <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
//               <p className="text-muted-foreground">{feature.description}</p>
//             </motion.div>
//           ))}
//         </motion.div>
//       </div>
//     </section>
//   )
// }

"use client"
import { motion } from "framer-motion"

const features = [
  {
    title: "Real-time Transcription",
    description: "Instantly convert speech to text with high accuracy across multiple speakers.",
    icon: "mic",
  },
  {
    title: "Speaker Identification",
    description: "Automatically detect and label different speakers in your meetings.",
    icon: "users",
  },
  {
    title: "AI Meeting Minutes",
    description: "Generate concise meeting summaries and action items with a single click.",
    icon: "file-text",
  },
  {
    title: "Searchable Archives",
    description: "Easily search through past meetings to find exactly what you need.",
    icon: "search",
  },
  {
    title: "Secure Storage",
    description: "All your meeting data is encrypted and stored securely in the cloud.",
    icon: "shield",
  },
  {
    title: "Easy Sharing",
    description: "Share transcripts and summaries with team members who couldn't attend.",
    icon: "share",
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-4 bg-muted/50">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to capture, understand, and share the valuable information from your meetings.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-background rounded-lg p-6 shadow-sm border border-border transition-all duration-300 hover:scale-105 hover:border-primary hover:shadow-md"
              whileHover={{ scale: 1.03 }}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4 }}
              title="AI Powered Meeting Assistant"
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary"
                >
                  {feature.icon === "mic" && (
                    <>
                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" x2="12" y1="19" y2="22" />
                    </>
                  )}
                  {feature.icon === "users" && (
                    <>
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </>
                  )}
                  {feature.icon === "file-text" && (
                    <>
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" x2="8" y1="13" y2="13" />
                      <line x1="16" x2="8" y1="17" y2="17" />
                      <line x1="10" x2="8" y1="9" y2="9" />
                    </>
                  )}
                  {feature.icon === "search" && (
                    <>
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" x2="16.65" y1="21" y2="16.65" />
                    </>
                  )}
                  {feature.icon === "shield" && (
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  )}
                  {feature.icon === "share" && (
                    <>
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                      <polyline points="16 6 12 2 8 6" />
                      <line x1="12" x2="12" y1="2" y2="15" />
                    </>
                  )}
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
