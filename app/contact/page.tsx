// export default function ContactPage() {
//   return (
//     <div className="min-h-screen px-4 py-20 md:py-28 container mx-auto max-w-3xl animate-fade-in">
//       <h1 className="text-4xl font-bold mb-6 text-center">Get in Touch</h1>
//       <form className="grid gap-6">
//         <input type="text" placeholder="Your Name" className="input input-bordered w-full" />
//         <input type="email" placeholder="Your Email" className="input input-bordered w-full" />
//         <textarea placeholder="Your Message" className="textarea textarea-bordered w-full h-32" />
//         <button type="submit" className="btn btn-primary w-full md:w-fit mx-auto">Send Message</button>
//       </form>
//     </div>
//   )
// }

"use client"
import { motion } from "framer-motion"

export default function ContactPage() {
  return (
    <section className="min-h-screen px-4 py-20 bg-background">
      <div className="container mx-auto max-w-3xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold mb-6 text-center"
        >
          Contact Us
        </motion.h1>
        <form className="space-y-6">
          <input type="text" placeholder="Name" className="w-full px-4 py-2 border border-border rounded-md" />
          <input type="email" placeholder="Email" className="w-full px-4 py-2 border border-border rounded-md" />
          <textarea placeholder="Message" rows="5" className="w-full px-4 py-2 border border-border rounded-md" />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary text-white px-6 py-2 rounded-md shadow-md"
          >
            Send Message
          </motion.button>
        </form>
      </div>
    </section>
  )
}
