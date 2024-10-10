'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface Mission {
  _id: string;
  title: string;
  situation: string;
  mission: string;
  execution: string;
  serviceAndSupport: string; // Ensure this is included
  commandAndSignals: string; // Ensure this is included
  details: string;
  mapmacro: string;
  mapmicro: string;
  actionPrompt: string;
}

const Spinner = () => (
  <div className="flex flex-col items-center justify-center h-screen">
    <div className="relative w-24 h-24">
      <div className="absolute inset-0 border-t-4 border-green-500 rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </div>
    <p className="text-green-500 mt-4 text-lg font-bold">Loading...</p>
  </div>
);

export default function MissionPage({ params }: { params: { id: string } }) {
  const [mission, setMission] = useState<Mission | null>(null)
  const [fragO, setFragO] = useState('')
  const [step, setStep] = useState('situation')
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds
  const router = useRouter()

  useEffect(() => {
    const fetchMission = async () => {
      try {
        const response = await fetch(`/api/missions/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch mission')
        }
        const data = await response.json()
        console.log('Fetched mission data:', data) // Log the fetched data
        setMission(data)
      } catch (error) {
        console.error('Error fetching mission:', error)
      }
    }

    fetchMission()
  }, [params.id])

  const handleSubmit = useCallback(async () => {
    try {
      const response = await fetch(`/api/frago/${params.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fragO }),
      })
      if (!response.ok) {
        throw new Error('Failed to submit Frag-O')
      }
      router.push(`/results/${params.id}`)
    } catch (error) {
      console.error('Error submitting Frag-O:', error)
    }
  }, [fragO, params.id, router])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (step === 'action' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      handleSubmit()
    }
    return () => clearInterval(timer)
  }, [step, timeLeft, handleSubmit])

  const handleUnderstand = () => {
    setStep('action')
  }

  if (!mission) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-green-500 p-8">
      <title>Tewtsim.ca</title>
      <h1 className="text-3xl font-bold mb-8">{mission.title}</h1>
      {step === 'situation' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
          <section className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Situation</h2>
              <pre className="whitespace-pre-wrap text-sm font-mono">{mission.situation}</pre>
            </section>

            <section className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Mission</h2>
              <pre className="whitespace-pre-wrap text-sm font-mono">{mission.mission}</pre>
            </section>

            <section className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Execution</h2>
              <pre className="whitespace-pre-wrap text-sm font-mono">{mission.execution}</pre>
            </section>

            <section className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Service and Support</h2>
              <pre className="whitespace-pre-wrap text-sm font-mono">{mission.serviceAndSupport}</pre>
            </section>

            <section className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Command and Signals</h2>
              <pre className="whitespace-pre-wrap text-sm font-mono">{mission.commandAndSignals}</pre>
            </section>

            <section className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Details</h2>
              <pre className="whitespace-pre-wrap text-sm font-mono">{mission.details}</pre>
            </section>
          </div>
          <div className="space-y-6">
            <section className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Map</h2>
              <Image src={`/maps/${mission.mapmacro}`} alt="Mission Map" width={400} height={300} layout="responsive" />
            </section>
          </div>
          <button
            onClick={handleUnderstand}
            className="md:col-span-3 w-full bg-green-700 hover:bg-green-600 text-black font-bold py-2 px-4 rounded transition duration-300"
          >
            I have read and understood the orders
          </button>
        </div>
      )}
      {step === 'action' && (
        <div className="space-y-6">
          <section className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Action Prompt</h2>
            <p>{mission.actionPrompt}</p>
          </section>
          <section className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Map</h2>
            <Image src={`/maps/${mission.mapmicro}`} alt="Mission Map" width={400} height={300} layout="responsive" />
          </section>
          <section className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Your Frag-O to Your Team</h2>
            <p className="mb-4">
              Provide your Fragmentary Order (Frag-O) to your team. Include the following:
              <ul className="list-disc list-inside ml-4 mt-2">
                <li>Mission statement</li>
                <li>Courses of Action (COAs) considered</li>
                <li>Selected COA and reasoning</li>
                <li>Key tasks for team members</li>
                <li>Coordination instructions</li>
              </ul>
            </p>
            <textarea
              value={fragO}
              onChange={(e) => setFragO(e.target.value)}
              className="w-full h-64 bg-gray-700 text-green-500 p-2 rounded mb-4"
              placeholder="Enter your Frag-O here..."
              aria-label="Frag-O input"
            />
            <div className="flex justify-between items-center">
              <button
                onClick={handleSubmit}
                className="bg-green-700 hover:bg-green-600 text-black font-bold py-2 px-4 rounded transition duration-300"
              >
                Submit Frag-O and Continue
              </button>
              <div className="text-xl font-bold" aria-live="polite">
                Time left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}