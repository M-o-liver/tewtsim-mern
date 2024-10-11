'use client'

import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function MainPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const timer = setInterval(() => {
      setIsVisible((v) => !v)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isSignUp ? '/api/register' : '/api/login';
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        if (!isSignUp) { // Only for login
          localStorage.setItem('token', data.token); // Store the token
        }
        console.log('Success:', data);
        router.push('/landing');
      } else {
        console.error('Error:', data.error);
        // Handle error - maybe set an error state to show to the user
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100 dark:bg-gray-900">
      <title>Tewtsim.ca</title>
      <header className="mb-4">
        <Image
          src="/tewtsim-logo.svg"
          alt="Tewtsim Logo"
          width={150}
          height={50}
          priority
        />
      </header>
      <div className={`mb-8 p-4 rounded-lg bg-gradient-to-r from-[#6b8e23] to-[#556b2f] text-white text-center transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-70'}`}>
        <p className="text-lg font-semibold">
          Now with timed missions: section level, platoon level.
        </p>
        <p className="text-sm mt-1">
          View your results at any time!
        </p>
      </div>
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
  )
}