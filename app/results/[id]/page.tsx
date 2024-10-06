'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

interface Result {
  fragO: string;
  story: string;
  analysis: string;
}

export default function ResultsPage({ params }: { params: { id: string } }) {
  const [result, setResult] = useState<Result | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const generateResult = useCallback(async (fragO: string, answerKey: string, username: string): Promise<Result> => {
    const story = await generateStory(fragO, answerKey, username);
    const analysis = await generateAnalysis(fragO, answerKey, username);
    return { fragO, story, analysis };
  }, []);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/results/${params.id}`);
        const data = await response.json();

        if (data.fragO && data.story && data.analysis) {
          setResult(data);
        } else {
          // If the result doesn't exist, generate it
          const fragOResponse = await fetch(`/api/answers/${params.id}`);
          const fragOData = await fragOResponse.json();
          const missionResponse = await fetch(`/api/missions/${params.id}`);
          const missionData = await missionResponse.json();
          const userResponse = await fetch('/api/user'); // Assuming you have an endpoint to get the current user
          const userData = await userResponse.json();

          const generatedResult = await generateResult(fragOData.fragO, missionData.answerKey, userData.username);
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

  const generateStory = async (fragO: string, answerKey: string, username: string): Promise<string> => {
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: `Generate a detailed story based on the following Fragmentary Order (Frag-O) submitted by Captain ${username} for a military mission. Compare the Frag-O to the provided answer key and create a narrative that incorporates the decisions made and their outcomes. Include both positive and negative consequences of the decisions:\n\nFrag-O:\n${fragO}\n\nAnswer Key:\n${answerKey}\n\nStory:`,
      }),
    });
    const data = await response.json();
    return data.content;
  };

  const generateAnalysis = async (fragO: string, answerKey: string, username: string): Promise<string> => {
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: `Analyze the following Fragmentary Order (Frag-O) submitted by Captain ${username} for a military mission. Compare it to the provided answer key and provide a detailed assessment of the plan. Highlight strengths, potential weaknesses, and areas for improvement. Consider factors such as clarity of mission statement, appropriateness of chosen course of action, completeness of key tasks, and effectiveness of coordination instructions:\n\nFrag-O:\n${fragO}\n\nAnswer Key:\n${answerKey}\n\nAnalysis:`,
      }),
    });
    const data = await response.json();
    return data.content;
  };

  if (isLoading) {
    return <div className="text-green-500">Generating mission results...</div>;
  }

  if (!result) {
    return <div className="text-green-500">Error: Unable to generate mission results.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-green-500 p-8">
      <h1 className="text-3xl font-bold mb-8">Mission Results</h1>
      <div className="space-y-8">
        <section className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Your Frag-O</h2>
          <ReactMarkdown className="prose prose-invert prose-green">{result.fragO}</ReactMarkdown>
        </section>
        <section className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Mission Outcome</h2>
          <ReactMarkdown className="prose prose-invert prose-green">{result.story}</ReactMarkdown>
        </section>
        <section className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Analysis</h2>
          <ReactMarkdown className="prose prose-invert prose-green">{result.analysis}</ReactMarkdown>
        </section>
      </div>
      <button
        onClick={() => router.push('/landing')}
        className="mt-8 w-full bg-green-700 hover:bg-green-600 text-black font-bold py-2 px-4 rounded transition duration-300"
      >
        Back to Mission Select
      </button>
    </div>
  );
}