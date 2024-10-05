'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Question {
  _id: string
  question: string
}

export default function QuestionsPage({ params }: { params: { id: string } }) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<{ [key: string]: string }>({})
  const [missionNote, setMissionNote] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`/api/questions/${params.id}`)
        const data = await response.json()
        setQuestions(data)
      } catch (error) {
        console.error('Error fetching questions:', error)
      }
    }

    fetchQuestions()

    // Retrieve the note from localStorage
    const storedNote = localStorage.getItem(`missionNote_${params.id}`)
    if (storedNote) {
      setMissionNote(storedNote)
    }
  }, [params.id])

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }))
  }

  const handleSubmit = async () => {
    try {
      await fetch('/api/answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ missionId: params.id, answers }),
      })
      router.push(`/results/${params.id}`)
    } catch (error) {
      console.error('Error submitting answers:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Mission Questions</h1>
      {missionNote && (
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Mission Notes</h2>
          <p>{missionNote}</p>
        </div>
      )}
      <div className="space-y-6">
        {questions.map((question) => (
          <div key={question._id} className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">{question.question}</h2>
            <textarea
              value={answers[question._id] || ''}
              onChange={(e) => handleAnswerChange(question._id, e.target.value)}
              className="w-full h-32 bg-gray-700 text-white p-2 rounded mb-4"
              placeholder="Enter your answer here..."
            />
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="mt-8 w-full bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300"
      >
        Submit Answers
      </button>
    </div>
  )
}