'use client'

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Mail, ArrowLeft } from "lucide-react"

export default function SupportPage() {
  const [copied, setCopied] = useState(false)

  const copyEmail = () => {
    navigator.clipboard.writeText("oliver.cross@forces.gc.ca")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100 dark:bg-gray-900">
      <header className="mb-8">
      <title>Tewtsim.ca</title>
        <Image
          src="/tewtsim-logo.svg"
          alt="Tewtsim Logo"
          width={150}
          height={50}
          priority
        />
      </header>
      <main className="bg-[#333333] text-[#f2f2f2] shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Tewtsim Support</h1>
        <p className="mb-6 text-center">
          For any questions, issues, or feedback regarding Tewtsim, please contact our support team directly:
        </p>
        <div className="flex items-center justify-center mb-6">
          <Mail className="mr-2" size={20} />
          <button
            onClick={copyEmail}
            className="text-[#6b8e23] hover:underline focus:outline-none"
          >
            oliver.cross@forces.gc.ca
          </button>
          {copied && (
            <span className="ml-2 text-sm text-green-500">Copied!</span>
          )}
        </div>
        <p className="text-center text-sm mb-6">
          We strive to respond to all inquiries within 24-48 hours.
        </p>
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center text-[#6b8e23] hover:underline"
          >
            <ArrowLeft className="mr-2" size={16} />
            Return to Home
          </Link>
        </div>
      </main>
      <footer className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>
          &copy; {new Date().getFullYear()} Tewtsim. No rights reserved.
        </p>
      </footer>
    </div>
  )
}