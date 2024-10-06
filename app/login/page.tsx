"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MainPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isSignUp ? '/api/register' : '/api/login';
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Success:', data);
      router.push('/landing'); // Redirect to landing page
    } else {
      console.error('Error:', data.error);
      // Handle error
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100 dark:bg-gray-900">
      <header className="mb-8">
        <Image
          src="/tewtsim-logo.svg"
          alt="Tewtsim Logo"
          width={150}
          height={50}
          priority
        />
      </header>
      <main className="bg-[#333333] text-[#f2f2f2] shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-4">
          {isSignUp ? "Sign Up for Tewtsim" : "Welcome to Tewtsim"}
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-2 border rounded-md bg-[#444444] text-[#f2f2f2] focus:outline-none focus:ring focus:border-[#6b8e23]"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border rounded-md bg-[#444444] text-[#f2f2f2] focus:outline-none focus:ring focus:border-[#6b8e23]"
            required
          />
          <button
            type="submit"
            className="bg-[#6b8e23] text-[#333333] py-2 rounded-md hover:bg-[#556b2f] transition-colors"
          >
            {isSignUp ? "Sign Up" : "Log In"}
          </button>
        </form>
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="mt-4 text-sm underline hover:text-[#6b8e23]"
        >
          {isSignUp ? "Already have an account? Log In" : "Need an account? Sign Up"}
        </button>
      </main>
      <footer className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>
          Need help? Visit our{" "}
          <a href="/support" className="text-[#6b8e23] hover:underline">
            support page
          </a>
          .
        </p>
      </footer>
    </div>
  );
}