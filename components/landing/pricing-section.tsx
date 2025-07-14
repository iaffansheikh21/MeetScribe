"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for occasional use",
    features: ["5 meetings per month", "30-minute maximum per meeting", "Basic transcription", "7-day storage"],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "per month",
    description: "Ideal for regular users",
    features: [
      "Unlimited meetings",
      "2-hour maximum per meeting",
      "Advanced transcription with 99% accuracy",
      "Speaker identification",
      "AI meeting summaries",
      "30-day storage",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Team",
    price: "$49",
    period: "per month",
    description: "Best for teams and businesses",
    features: [
      "Everything in Pro",
      "Unlimited meeting length",
      "Team collaboration features",
      "Custom vocabulary",
      "Priority support",
      "Unlimited storage",
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that works best for you and your team.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.4 }}
              className={`rounded-xl p-8 border relative ${
                plan.popular ? "border-primary shadow-lg" : "border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-medium shadow-sm">
                  Most Popular
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground ml-2">{plan.period}</span>}
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/auth/sign-up">
                <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
