"use client";

import { useState } from "react";

export default function SupportPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Support request submitted by", name, email, message);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100 dark:bg-gray-900">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[#f2f2f2]">Support</h1>
      </header>
      <main className="bg-[#333333] text-[#f2f2f2] shadow-lg rounded-lg p-8 max-w-md w-full">
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
          <ul className="list-disc pl-5">
            <li className="mb-2">
              <strong>How do I reset my password?</strong>
              <p>Click on the `Forgot Password` link on the login page and follow the instructions.</p>
            </li>
            <li className="mb-2">
              <strong>Can I change my username?</strong>
              <p>Currently, changing your username is not supported. Please contact support for assistance.</p>
            </li>
            <li className="mb-2">
              <strong>How do I contact support?</strong>
              <p>You can fill out the form below or email us at{" "}
                <a href="mailto:support@tewtsim.com" className="text-[#6b8e23] hover:underline">
                  support@tewtsim.com
                </a>.
              </p>
            </li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-4">Contact Us</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-2 border rounded-md bg-[#444444] text-[#f2f2f2] focus:outline-none focus:ring focus:border-[#6b8e23]"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 border rounded-md bg-[#444444] text-[#f2f2f2] focus:outline-none focus:ring focus:border-[#6b8e23]"
              required
            />
            <textarea
              placeholder="Your Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="p-2 border rounded-md bg-[#444444] text-[#f2f2f2] focus:outline-none focus:ring focus:border-[#6b8e23]"
              rows={5}
              required
            />
            <button
              type="submit"
              className="bg-[#6b8e23] text-[#333333] py-2 rounded-md hover:bg-[#556b2f] transition-colors"
            >
              Submit
            </button>
          </form>
        </section>
      </main>
      <footer className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>Thank you for reaching out to us. We will get back to you shortly.</p>
      </footer>
    </div>
  );
}