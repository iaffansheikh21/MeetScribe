// export default function AboutPage() {
//   return (
//     <div className="min-h-screen px-4 py-20 md:py-28 container mx-auto max-w-4xl animate-fade-in">
//       <h1 className="text-4xl font-bold mb-4 text-center">About MeetScribe</h1>
//       <p className="text-lg text-muted-foreground text-center">
//         MeetScribe transforms your meetings into clear, actionable insights using AI. With real-time transcription,
//         smart summaries, and seamless sharing productivity has never been this effortless.
//       </p>
//     </div>
//   )
// }
"use client";

import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <section className="min-h-screen px-4 py-20 bg-muted">
      <div className="container mx-auto max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold mb-6 text-center"
        >
          About MeetScribe
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-lg text-muted-foreground text-center"
        >
          MeetScribe helps teams turn conversations into clear, actionable
          insights using smart AI transcription and summaries.
        </motion.p>
      </div>
    </section>
  );
}
