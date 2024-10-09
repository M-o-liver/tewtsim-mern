'use client'

import { useState, useEffect, useCallback } from 'react'
import MissionCard from '@/components/MissionCard'
import ResultsCard from '@/components/ResultsCard'
import { useAuth } from '@/hooks/useAuth' // Assume we've created this custom hook

interface Mission {
  _id: string
  title: string
  description: string
  type: string
  level: string
}

interface Result {
  _id: string;
  fragO: string;
  story: string;
  analysis: string;
  username: string;
  missionId: {
    _id: string;
    title: string;
  };
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
    <p className="text-green-500 mt-4 text-lg font-bold">Welcome to Tewtsim, Loading...</p>
  </div>
);

export default function LandingPage() {
  const [missions, setMissions] = useState<Mission[]>([])
  const [results, setResults] = useState<Result[]>([])
  const { username, isLoading } = useAuth() // Custom hook for authentication

  const fetchMissions = useCallback(async () => {
    try {
      const response = await fetch('/api/missions')
      if (!response.ok) throw new Error('Failed to fetch missions')
      const data = await response.json()
      setMissions(data)
    } catch (error) {
      console.error('Error fetching missions:', error)
      // Here you might want to set an error state and display it to the user
    }
  }, [])

  const fetchResults = useCallback(async () => {
    try {
      const response = await fetch('/api/results');
      if (!response.ok) throw new Error('Failed to fetch results')
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error fetching results:', error);
      // Here you might want to set an error state and display it to the user
    }
  }, [])

  useEffect(() => {
    fetchMissions();
    fetchResults();
  }, [fetchMissions, fetchResults])

  // Filter results based on the current username
  const userResults = results.filter(result => result.username === username);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {username && <h1 className="text-2xl mb-4 text-green-400">Good Morning, Commander {username}</h1>}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-8">Available Missions</h2>
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
      </section>
      <section>
        <h2 className="text-3xl font-bold mb-4">Your Results</h2>
        {userResults.length > 0 ? (
          userResults.map(result => (
            <ResultsCard key={result._id} result={result} />
          ))
        ) : (
          <p className="text-gray-400">No results found for your username.</p>
        )}
      </section>
    </div>
  )
}