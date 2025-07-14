// export default function TeamPage() {
//   const team = [
//     { name: "Muhammad Affan Sheikh", role: "CEO", image: "/Affan.jpg" },
//     { name: "Saqlain Zaheer", role: "CTO", image: "/Saqlain.jpg" },
//     { name: "Usman Farooq", role: "Product Lead", image: "/Usman.jpg" },
//   ];

//   return (
//     <div className="min-h-screen px-4 py-20 md:py-28 container mx-auto max-w-5xl animate-fade-in">
//       <h1 className="text-4xl font-bold mb-10 text-center">Our Team</h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
//         {team.map((member, i) => (
//           <div key={i} className="rounded-xl shadow-md p-6 text-center hover:scale-105 transition-transform">
//             <img src={member.image} alt={member.name} className="mx-auto h-24 w-24 rounded-full mb-4 object-cover" />
//             <h3 className="text-xl font-semibold">{member.name}</h3>
//             <p className="text-muted-foreground">{member.role}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

"use client"
import { motion } from "framer-motion"

const team = [
  { name: "Muhammad Affan Sheikh", role: "CEO", image: "/Affan.jpg" },
  { name: "Saqlain Zaheer", role: "CTO", image: "/Saqlain.jpg" },
  { name: "Usman Farooq", role: "Lead Designer", image: "/Usman.jpg" },
]

export default function TeamPage() {
  return (
    <section className="min-h-screen px-4 py-20 bg-muted/50">
      <div className="container mx-auto max-w-6xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold mb-12"
        >
          Meet Our Team
        </motion.h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              className="bg-background rounded-xl p-6 shadow border"
            >
              <img src={member.image} alt={member.name} className="h-24 w-24 mx-auto rounded-full mb-4" />
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-muted-foreground">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
