'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import ResultsCard from '@/components/ResultsCard'
import { useAuth } from '@/hooks/useAuth'
import ReactMarkdown from 'react-markdown'

interface Result {
  _id: string;
  fragO: string;
  story: string;
  analysis: string;
  username: string;
  missionId: {
    _id: string;
    title: string;
  } | null;
}

export default function ResultsPage() {
  const [results, setResults] = useState<Result[]>([])
  const [selectedResult, setSelectedResult] = useState<Result | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { username, isLoading: authLoading } = useAuth()
  const searchParams = useSearchParams()
  const selectedId = searchParams.get('id')

  useEffect(() => {
    const fetchResults = async () => {
      if (!username) return;

      try {
        setIsLoading(true)
        const response = await fetch('/api/results')
        if (!response.ok) {
          throw new Error('Failed to fetch results')
        }
        const data = await response.json()
        const userResults = data.filter((result: Result) => result.username === username)
        setResults(userResults)

        if (selectedId) {
          const selected = userResults.find((result: Result) => result._id === selectedId)
          setSelectedResult(selected || null)
        }
      } catch (error) {
        console.error('Error fetching results:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (!authLoading) {
      fetchResults()
    }
  }, [username, authLoading, selectedId])

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-green-500 flex items-center justify-center">
        <p className="text-2xl">Loading results...</p>
      </div>
    )
  }

  if (!username) {
    router.push('/login')
    return null
  }

  if (selectedResult) {
    return (
      <div className="min-h-screen bg-gray-900 text-green-500 p-8">
        <h1 className="text-3xl font-bold mb-8">
          {selectedResult.missionId ? `${selectedResult.missionId.title} - Mission Results` : 'Mission Results'}
        </h1>
        <div className="space-y-8">
          <section className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Your Frag-O</h2>
            <ReactMarkdown className="prose prose-invert prose-green">{selectedResult.fragO}</ReactMarkdown>
          </section>
          <section className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Mission Outcome</h2>
            <ReactMarkdown className="prose prose-invert prose-green">{selectedResult.story}</ReactMarkdown>
          </section>
          <section className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Analysis</h2>
            <ReactMarkdown className="prose prose-invert prose-green">{selectedResult.analysis}</ReactMarkdown>
          </section>
        </div>
        <button
          onClick={() => {
            setSelectedResult(null)
            router.push('/results')
          }}
          className="mt-8 w-full bg-green-700 hover:bg-green-600 text-black font-bold py-2 px-4 rounded transition duration-300"
        >
          Back to All Results
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-green-500 p-8">
      <h1 className="text-3xl font-bold mb-8">Your Mission Results</h1>
      {results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((result) => (
            <ResultsCard key={result._id} result={result} />
          ))}
        </div>
      ) : (
        <p className="text-xl">You havent completed any missions yet. Start a new mission to see results here!</p>
      )}
      <button
        onClick={() => router.push('/landing')}
        className="mt-8 w-full bg-green-700 hover:bg-green-600 text-black font-bold py-2 px-4 rounded transition duration-300"
      >
        Back to Mission Select
      </button>
    </div>
  )
}