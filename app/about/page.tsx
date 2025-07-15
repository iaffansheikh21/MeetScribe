"use client";

import React from "react";
import { Info, ShieldCheck } from "lucide-react";

export default function PrivacyPolicy() {

  return (
    <section className="bg-white text-gray-700 dark:text-gray-300 max-w-5xl mx-auto px-6 py-12 text-sm sm:text-base">
      {/* About Us Badge */}
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-[hsl(255,75%,63%)] p-2 rounded-full shadow-md">
          <Info className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          About US
        </h1>
      </div>
      <p className="mb-10 leading-relaxed">
        MeetScribe is your AI-powered meeting assistant, transforming spoken conversations into precise, actionable transcripts and summaries. Leveraging advanced Gemini API models, we help teams save time, align on decisions, and boost productivity. Our mission is to make every meeting matter by capturing key insights and empowering collaboration.
      </p>

      <div className="flex items-center gap-4 mb-8">
        <div className="bg-[hsl(255,75%,63%)] p-2 rounded-full shadow-md">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          Privacy Policy
        </h1>
      </div>

      <p className="mb-6 leading-relaxed">
        At <span className="text-[hsl(255,75%,63%)] font-semibold">MeetScribe</span>, your privacy and trust are our highest priority. This policy outlines how we collect, store, and handle your personal data when using our services. By using MeetScribe, you consent to the practices outlined below.
      </p>

      <hr className="my-8 border-gray-200 dark:border-gray-700" />

      <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
        1. Information We Collect
      </h2>
      <ul className="list-disc pl-6 space-y-2 mb-8">
        <li>Full Name, Email Address, and Contact Information</li>
        <li>Technical data (e.g. browser, device, IP address)</li>
        <li>Communications and interactions on the MeetScribe platform</li>
        <li>Usage activity and preferences through cookies</li>
      </ul>

      <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
        2. How We Use Your Information
      </h2>
      <ul className="list-disc pl-6 space-y-2 mb-8">
        <li>To provide accurate AI transcription and summaries</li>
        <li>To improve Gemini API integration and performance</li>
        <li>To respond to your inquiries and support requests</li>
        <li>To comply with legal obligations where applicable</li>
      </ul>

      <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
        3. Data Protection & Disclosure
      </h2>
      <p className="mb-4">
        We employ encryption, firewalls, and secure storage to protect your data. Data is never sold or rented. We only disclose personal data:
      </p>
      <ul className="list-disc pl-6 space-y-2 mb-8">
        <li>To trusted service providers under strict confidentiality</li>
        <li>To government bodies when legally required</li>
        <li>To investigate suspected misuse or threats</li>
      </ul>

      <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
        4. Your Data Rights
      </h2>
      <p className="mb-4">
        You can access, update, or delete your personal data by submitting a request. You have rights to:
      </p>
      <ul className="list-disc pl-6 space-y-2 mb-8">
        <li>Access data we store about you</li>
        <li>Request correction or deletion</li>
        <li>Withdraw consent at any time</li>
        <li>Submit a complaint to your local data authority</li>
      </ul>

      <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
        5. Policy Changes
      </h2>
      <p className="mb-8">
        We may update this policy to reflect changes in law or operations. Updates will be posted on this page with the revised date.
      </p>

      <hr className="my-8 border-gray-200 dark:border-gray-700" />

      <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          📨 Contact Us
        </h3>
        <p className="mb-2"><strong>MeetScribe</strong></p>
        <p className="mb-2">Operated by: <strong>MeetScribe Team</strong></p>
        <p className="mb-4">
          Contact Email: <a href="mailto:meetscribe0@gmail.com" className="underline text-[hsl(255,75%,63%)] hover:text-[hsl(255,75%,53%)]">
            meetscribe0@gmail.com
          </a>
        </p>
        <button
          onClick={() => {
            window.location.assign("mailto:meetscribe0@gmail.com");
          }}
          className="mt-2 inline-block px-6 py-2 bg-[hsl(255,75%,63%)] text-white font-medium rounded-lg shadow hover:bg-[hsl(255,75%,53%)] transition"
        >
          Email Support
        </button>

      </div>
    </section>
  );
}
