'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

interface Result {
  story: string;
  finalSummary: string;
}

interface Answer {
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
}

export default function ResultsPage({ params }: { params: { id: string } }) {
  const [result, setResult] = useState<Result | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const generateResult = useCallback(async (answers: Answer[]): Promise<Result> => {
    const story = await generateStory(answers);
    const finalSummary = await generateFinalSummary(answers);
    return { story, finalSummary };
  }, []);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/results/${params.id}`);
        const data = await response.json();

        if (data.story && data.finalSummary) {
          setResult(data);
        } else {
          // If the result doesn't exist, generate it
          const answersResponse = await fetch(`/api/answers/${params.id}`);
          const answers: Answer[] = await answersResponse.json();

          const generatedResult = await generateResult(answers);
          setResult(generatedResult);

          // Save the generated result
          await fetch(`/api/results/${params.id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(generatedResult),
          });
        }
      } catch (error) {
        console.error('Error fetching or generating result:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResult();
  }, [params.id, generateResult]);

  const generateStory = async (answers: Answer[]): Promise<string> => {
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: `Generate a story based on the following mission answers. Each answer consists of the user's answer and the correct answer. Please create a narrative that incorporates the user's decisions and their outcomes:\n\n${answers.map(a => `User Answer: ${a.userAnswer}\nCorrect Answer: ${a.correctAnswer}\n\n`).join('')}`,
      }),
    });
    const data = await response.json();
    return data.content;
  };

  const generateFinalSummary = async (answers: Answer[]): Promise<string> => {
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: `Provide a final summary and feedback based on the following mission answers. Each answer consists of the user's answer and the correct answer. Please analyze the performance, highlight strengths and areas for improvement, and provide an overall assessment:\n\n${answers.map(a => `User Answer: ${a.userAnswer}\nCorrect Answer: ${a.correctAnswer}\n\n`).join('')}`,
      }),
    });
    const data = await response.json();
    return data.content;
  };

  if (isLoading) {
    return <div className="text-white">Generating mission results...</div>;
  }

  if (!result) {
    return <div className="text-white">Error: Unable to generate mission results.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Mission Results</h1>
      <div className="space-y-8">
        <section className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Story</h2>
          <ReactMarkdown className="prose prose-invert">{result.story}</ReactMarkdown>
        </section>
        <section className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Final Summary</h2>
          <ReactMarkdown className="prose prose-invert">{result.finalSummary}</ReactMarkdown>
        </section>
      </div>
      <button
        onClick={() => router.push('/landing')}
        className="mt-8 w-full bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300"
      >
        Back to Mission Select
      </button>
    </div>
  );
}