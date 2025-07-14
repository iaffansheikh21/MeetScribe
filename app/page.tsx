// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import HeroSection from "@/components/landing/hero-section"
// import FeaturesSection from "@/components/landing/features-section"
// import HowItWorksSection from "@/components/landing/how-it-works-section"
// import PricingSection from "@/components/landing/pricing-section"
// import TestimonialsSection from "@/components/landing/testimonials-section"

// export default function LandingPage() {
//   return (
//     <div className="min-h-screen">
//       <header className="container mx-auto py-4 px-4 flex justify-between items-center">
//         <div className="flex items-center gap-2">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             className="h-6 w-6 text-primary"
//           >
//             <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
//             <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
//             <line x1="12" x2="12" y1="19" y2="22" />
//           </svg>
//           <span className="text-xl font-bold">MeetScribe</span>
//         </div>
//         <nav className="hidden md:flex items-center gap-6">
//           <Link href="#features" className="text-sm hover:text-primary">
//             Features
//           </Link>
//           <Link href="#how-it-works" className="text-sm hover:text-primary">
//             How It Works
//           </Link>
//           <Link href="#pricing" className="text-sm hover:text-primary">
//             Pricing
//           </Link>
//           <Link href="#testimonials" className="text-sm hover:text-primary">
//             Testimonials
//           </Link>
//         </nav>
//         <div className="flex items-center gap-4">
//           <Link href="/auth/sign-in">
//             <Button variant="outline" size="sm">
//               Sign In
//             </Button>
//           </Link>
//           <Link href="/auth/sign-up">
//             <Button size="sm">Sign Up</Button>
//           </Link>
//         </div>
//       </header>

//       <main>
//         <HeroSection />
//         <FeaturesSection />
//         <HowItWorksSection />
//         <PricingSection />
//         <TestimonialsSection />
//       </main>

//       <footer className="bg-muted py-12 mt-20">
//         <div className="container mx-auto px-4">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//             <div>
//               <div className="flex items-center gap-2 mb-4">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   className="h-6 w-6 text-primary"
//                 >
//                   <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
//                   <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
//                   <line x1="12" x2="12" y1="19" y2="22" />
//                 </svg>
//                 <span className="text-xl font-bold">MeetScribe</span>
//               </div>
//               <p className="text-sm text-muted-foreground">
//                 Transforming meetings into actionable insights with AI-powered transcription.
//               </p>
//             </div>
//             <div>
//               <h3 className="font-medium mb-4">Product</h3>
//               <ul className="space-y-2 text-sm text-muted-foreground">
//                 <li>
//                   <Link href="#features" className="hover:text-primary">
//                     Features
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#pricing" className="hover:text-primary">
//                     Pricing
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="hover:text-primary">
//                     Integrations
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//             <div>
//               <h3 className="font-medium mb-4">Resources</h3>
//               <ul className="space-y-2 text-sm text-muted-foreground">
//                 <li>
//                   <Link href="#" className="hover:text-primary">
//                     Documentation
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="hover:text-primary">
//                     Blog
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="hover:text-primary">
//                     Support
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//             <div>
//               <h3 className="font-medium mb-4">Company</h3>
//               <ul className="space-y-2 text-sm text-muted-foreground">
//                 <li>
//                   <Link href="#" className="hover:text-primary">
//                     About
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="hover:text-primary">
//                     Careers
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="hover:text-primary">
//                     Contact
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//           </div>
//           <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
//             <p>© 2024 MeetScribe. All rights reserved.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   )
// }

import Link from "next/link";
import { Button } from "@/components/ui/button";
import HeroSection from "@/components/landing/hero-section";
import FeaturesSection from "@/components/landing/features-section";
import HowItWorksSection from "@/components/landing/how-it-works-section";
import PricingSection from "@/components/landing/pricing-section";
import TestimonialsSection from "@/components/landing/testimonials-section";
import { BackgroundBeamsDemo } from "@/components/ui/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <header className="container mx-auto py-4 px-4 flex justify-between items-center sticky top-0 z-50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-500 shadow-sm">
        <div className="flex items-center gap-2 transition-transform duration-300 hover:scale-105">
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="MeetScribe Logo"
              className="h-10 w-auto"
            />
          </div>
        </div>
        {/* <nav className="hidden md:flex items-center gap-6">
          <Link href="#features" className="text-sm transition-colors duration-300 hover:text-primary">
            Features
          </Link>
          <Link href="#how-it-works" className="text-sm transition-colors duration-300 hover:text-primary">
            How It Works
          </Link>
          <Link href="#pricing" className="text-sm transition-colors duration-300 hover:text-primary">
            Pricing
          </Link>
          <Link href="#testimonials" className="text-sm transition-colors duration-300 hover:text-primary">
            Testimonials
          </Link>
        </nav> */}
        <nav className="hidden md:flex items-center gap-6">
          {[
            { label: "Features", href: "#features" },
            { label: "How It Works", href: "#how-it-works" },
            { label: "Pricing", href: "#pricing" },
            { label: "Testimonials", href: "#testimonials" },
          ].map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="relative text-lg text-muted-foreground transition-colors duration-300 hover:text-primary group"
            >
              {item.label}
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* <div className="flex items-center gap-4">
          <Link href="/auth/sign-in">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/auth/sign-up">
            <Button size="sm">Sign Up</Button>
          </Link>
        </div> */}
        <div className="flex items-center gap-4">
          <Link href="/auth/sign-in" className="group">
            <Button
              variant="outline"
              size="sm"
              className="transition-all duration-300 group-hover:scale-105 group-hover:border-primary group-hover:text-primary"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/auth/sign-up" className="group">
            <Button
              size="sm"
              className="transition-all duration-300 group-hover:scale-105 group-hover:shadow-md"
            >
              Sign Up
            </Button>
          </Link>
        </div>
      </header>

      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />
        <TestimonialsSection />
      </main>

  

      <BackgroundBeamsDemo/>
    </div>
  );
}
