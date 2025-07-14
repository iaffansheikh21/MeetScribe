// export default function HelpPage() {
//   return (
//     <div className="min-h-screen px-4 py-20 md:py-28 container mx-auto max-w-4xl animate-fade-in">
//       <h1 className="text-4xl font-bold mb-6 text-center">Help Center</h1>
//       <p className="text-lg text-muted-foreground text-center">
//         Need help? Browse our documentation or reach out to our support team. We’re here to help you succeed.
//       </p>
//     </div>
//   )
// }

"use client"
import { motion } from "framer-motion"

export default function HelpPage() {
  return (
    <section className="min-h-screen px-4 py-20 bg-background">
      <div className="container mx-auto max-w-4xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold mb-6"
        >
          Help Center
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-muted-foreground text-lg"
        >
          Need assistance? We’re here to help. Browse common issues or contact our support team.
        </motion.p>
      </div>
    </section>
  )
}
