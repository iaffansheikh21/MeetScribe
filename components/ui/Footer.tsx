'use client';

import React, { useState, useTransition, useEffect } from 'react';
// import { BackgroundBeams } from '../background-beams';
import Footer2 from '@/components/Footer2';
import { toast } from "sonner"
import * as F from 'react-spinners';

export function BackgroundBeamsDemo() {
  const placeholders = [
    "Record your meeting in real-time?",
    "Get instant AI-transcripts?",
    "Capture key insights effortlessly?",
    "Auto-generate meeting minutes?",
    "Quiz yourself on today’s highlights?",
    "Track your learning performance?",
    "Share notes with study groups?"
  ];


  const [email, setEmail] = useState('');
  const [isPending, startTransition] = useTransition();
  const [currentPlaceholder, setCurrentPlaceholder] = useState(placeholders[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => {
        const currentIndex = placeholders.indexOf(prev);
        return placeholders[(currentIndex + 1) % placeholders.length];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;

    startTransition(async () => {
      try {
        const htmlContent = `
  <div style="font-family: sans-serif; margin:0; padding:0; color:#333;">
    <!-- Header -->
    <div style="
      background: #7B3FBD;
      padding: 20px;
      text-align: center;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    ">
      <img
        src="https://res.cloudinary.com/dhn9nlxbb/image/upload/v1752517971/re3tjwvhbsxesey1l7cd.png"
        alt="MeetScribe Logo"
        style="height: 50px; margin-bottom: 10px;"
      />
      <h1 style="
        margin: 0;
        font-size: 24px;
        color: white;
      ">
        Welcome to the MeetScribe Newsletter!
      </h1>
    </div>

    <!-- Body -->
    <div style="padding: 24px; background: #ffffff;">
      <p style="font-size: 16px; line-height: 1.5;">
        Hello there,
      </p>
      <p style="font-size: 16px; line-height: 1.5;">
        Thank you for subscribing to the MeetScribe newsletter. We’re thrilled to have you onboard and can’t wait to share the latest updates, tips, and insights to help you get the most out of our platform.
      </p>
      <p style="font-size: 16px; line-height: 1.5;">
        If you have any questions or feedback, please don’t hesitate to reach out. We’re here to help!
      </p>
      <p style="font-size: 16px; line-height: 1.5;">
        With warm regards,<br />
        <strong>MeetScribe Team</strong>
      </p>
    </div>

    <!-- Footer -->
    <div style="padding: 24px; background: #f0f6fa; text-align: center; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
      <p style="margin: 0 0 8px;">Follow us on</p>
      <a href="https://facebook.com/ntuams" style="margin: 0 8px;">
              <img src="https://res.cloudinary.com/dhn9nlxbb/image/upload/v1751641540/d5fpwatz5ojlajhccgxp.png" width="24" alt="Facebook" />
            </a>
            <a href="https://twitter.com/ntuams" style="margin: 0 8px;">
              <img src="https://res.cloudinary.com/dhn9nlxbb/image/upload/v1751641540/twnvl76xtknpcjw3xz1f.png" width="24" alt="Twitter" />
            </a>
            <a href="https://linkedin.com/company/ntuams" style="margin: 0 8px;">
              <img src="https://res.cloudinary.com/dhn9nlxbb/image/upload/v1751641541/stnvzlqlrpj39by8rj25.png" width="24" alt="LinkedIn" />
            </a>
      <p style="margin-top: 16px; font-size: 12px; color: #777;">
        © 2025 MeetScribe. All rights reserved.
      </p>
    </div>
  </div>
`;

        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: email,
            subject: 'Welcome to MeetScribe!',
            htmlBody: htmlContent,
          }),
        });

        if (response.ok) {
          toast.success('Email sent! Thanks For Joining Us');
          setEmail('');
        } else {
          const err = await response.json();
          toast.error(err.error || 'Failed to send email');
        }
      } catch (error) {
        console.error(error);
        toast.error('Server error');
      }
    });

  };

  return (
    <div className="relative w-full  flex flex-col justify-between min-h-[35rem] md:min-h-[40rem] overflow-hidden antialiased">
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-8 md:py-16">
        <h2 className="text-3xl font-bold mb-4">Reach To Us</h2>

        <form onSubmit={handleSubmit} className="mt-6 w-full max-w-xl">
          <div className="flex">
            <input
              type="email"
              required
              placeholder={currentPlaceholder}
              className="flex-1 rounded-l-lg border border-neutral-300 dark:border-neutral-700 dark:bg-transparent bg  placeholder:text-neutral-500 dark:placeholder:text-neutral-400 placeholder:text-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 !bg-transparent text-black dark:text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              disabled={isPending}
              className="rounded-r-lg px-5 bg-[hsl(255,75%,63%)] hover:bg-[hsl(255,75%,58%)] text-white font-semibold transition"
            >
              {isPending ? <F.CircleLoader color="white" size={20} /> : 'Takeoff'}
            </button>

          </div>
        </form>
      </div>

      {/* Footer below the content */}
      <div className="relative z-10 mt-12">
        <Footer2 />
      </div>
      {/* <BackgroundBeams /> */}
    </div>
  );
}
