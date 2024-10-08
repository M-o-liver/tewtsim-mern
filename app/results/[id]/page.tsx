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
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  const generateResult = useCallback(async (fragO: string, answerKey: string, username: string, mission: string, details: string, situation: string): Promise<Result> => {
    const story = await generateStory(fragO, username, mission, details, situation);
    const analysis = await generateAnalysis(fragO, answerKey, username, story);
    return { fragO, story, analysis };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const userData = await response.json();
        setUsername(userData.username);
      }
    };

    const fetchResult = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/results/${params.id}`);
        const data = await response.json();

        if (data.fragO && data.story && data.analysis) {
          setResult(data);
        } else {
          const fragOResponse = await fetch(`/api/answers/${params.id}`);
          const fragOData = await fragOResponse.json();
          const missionResponse = await fetch(`/api/missions/${params.id}`);
          const missionData = await missionResponse.json();

          // Only generate a new result if the username is available
          if (username) {
            const generatedResult = await generateResult(fragOData.fragO, missionData.answerKey, username, missionData.mission, missionData.details, missionData.situation);
            setResult(generatedResult);

            // Save the generated result
            await fetch(`/api/results/${params.id}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ ...generatedResult, username }),
            });
          }
        }
      } catch (error) {
        console.error('Error fetching or generating result:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
    fetchResult();
  }, [params.id, username, generateResult]);

  const generateStory = async (fragO: string, username: string, mission: string, details: string, situation: string): Promise<string> => {
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: `You are a military strategist. Based on the following Frag-O and the situation, generate a detailed narrative that describes the mission's execution. Include key events, decisions made, and the outcome of the mission. Name the officer Second Lieutenant ${username}.\n\nFrag-O: ${fragO}\nSituation: ${situation}\nMission: ${mission}\nDetails: ${details}\n\nNarrative:`,
      }),
    });
    const data = await response.json();
    return data.content;
  };

  const generateAnalysis = async (fragO: string, answerKey: string, username: string, story: string): Promise<string> => {
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: `As a military analyst, evaluate the following Frag-O and the generated story. Provide a detailed assessment of the effectiveness of the plan, highlighting strengths, weaknesses, and areas for improvement. Include comparisons to the answer key where applicable.\n\nFrag-O: ${fragO}\nStory: ${story}\nAnswer Key: ${answerKey}\n\nAnalysis:`,
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