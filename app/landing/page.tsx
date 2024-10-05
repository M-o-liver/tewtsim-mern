'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import MissionCard from '@/components/MissionCard'

interface Mission {
  _id: string
  title: string
  description: string
  type: string
  level: string
}

export default function LandingPage() {
  const [missions, setMissions] = useState<Mission[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const response = await fetch('/api/missions')
        const data = await response.json()
        setMissions(data)
      } catch (error) {
        console.error('Error fetching missions:', error)
      }
    }

    fetchMissions()
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Available Missions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {missions.map((mission) => (
          <MissionCard
            key={mission._id}
            id={mission._id}
            title={mission.title}
            description={mission.description}
            type={mission.type}
            level={mission.level}
          />
        ))}
      </div>
    </div>
  )
}