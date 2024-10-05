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
  const [note, setNote] = useState('')
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

  const handleNoteSubmit = async () => {
    try {
      await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ missionId: params.id, note }),
      })
      // Store the note in localStorage
      localStorage.setItem(`missionNote_${params.id}`, note)
      setNote('')
      router.push(`/questions/${params.id}`)
    } catch (error) {
      console.error('Error submitting note:', error)
    }
  }

  if (!mission) {
    return <div className="text-white">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
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
            <Image src={mission.map} alt="Mission Map" width={400} height={300} layout="responsive" />
          </section>
          <section className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Notes</h2>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full h-32 bg-gray-700 text-white p-2 rounded mb-4"
              placeholder="Enter your notes here..."
            />
            <button
              onClick={handleNoteSubmit}
              className="w-full bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Submit Note and Continue
            </button>
          </section>
        </div>
      </div>
    </div>
  )
}