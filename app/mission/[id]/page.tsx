'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface Mission {
  _id: string
  title: string
  situation: string
  mission: string
  details: string
  map: string
}

export default function MissionPage({ params }: { params: { id: string } }) {
  const [mission, setMission] = useState<Mission | null>(null)
  const [fragO, setFragO] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchMission = async () => {
      try {
        const response = await fetch(`/api/missions/${params.id}`)
        const data = await response.json()
        setMission(data)
      } catch (error) {
        console.error('Error fetching mission:', error)
      }
    }

    fetchMission()
  }, [params.id])

  const handleSubmit = async () => {
    try {
      await fetch('/api/answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ missionId: params.id, fragO }), // Ensure fragO is included
      })
      router.push(`/results/${params.id}`)
    } catch (error) {
      console.error('Error submitting Frag-O:', error)
    }
  }

  if (!mission) {
    return <div className="text-green-500">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-900 text-green-500 p-8">
      <h1 className="text-3xl font-bold mb-8">{mission.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <section className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Situation</h2>
            <p>{mission.situation}</p>
          </section>
          <section className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Mission</h2>
            <p>{mission.mission}</p>
          </section>
          <section className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Details</h2>
            <p>{mission.details}</p>
          </section>
        </div>
        <div className="space-y-6">
          <section className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Map</h2>
            <Image src={`/maps/${mission.map}`} alt="Mission Map" width={400} height={300} layout="responsive" />
          </section>
        </div>
      </div>
      <section className="bg-gray-800 p-6 rounded-lg mt-8">
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
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-green-700 hover:bg-green-600 text-black font-bold py-2 px-4 rounded transition duration-300"
        >
          Submit Frag-O and Continue
        </button>
      </section>
    </div>
  )
}