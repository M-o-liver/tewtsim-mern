'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../../../hooks/useAuth'; // Adjust the import path as necessary

interface Result {
  fragO: string;
  story: string;
  analysis: string;
}

interface MissionData {
  title: string;
  situation: string;
  mission: string;
  details: string;
}

export default function ResultsPage({ params }: { params: { id: string } }) {
  const [result, setResult] = useState<Result | null>(null);
  const [mission, setMission] = useState<MissionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { username, isLoading: isAuthLoading } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (isAuthLoading) return;

      try {
        setIsLoading(true);
        
        // Fetch the fragO
        const fragOResponse = await fetch(`/api/answers/${params.id}`);
        const fragOData = await fragOResponse.json();
        
        // Fetch the mission data
        const missionResponse = await fetch(`/api/missions/${params.id}`);
        const missionData: MissionData = await missionResponse.json();
        
        setMission(missionData);

        // Generate the story
        const story = await generateStory(fragOData.fragO, missionData);
        
        // Generate the analysis
        const analysis = await generateAnalysis(fragOData.fragO, missionData, story, username);
        
        setResult({ fragO: fragOData.fragO, story, analysis });
      } catch (error) {
        console.error('Error fetching or generating result:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id, username, isAuthLoading]);

  const generateStory = async (fragO: string, missionData: MissionData): Promise<string> => {
    const prompt = `You are a military scenario writer. Based on the following mission context and Frag-O, generate a realistic story of how the mission unfolded. Be extremely critical and honest - if the Frag-O is flawed, unclear, or indecisive, the mission MUST fail or encounter significant difficulties. Do not beautify a bad plan. If the Frag-O shows poor leadership, indecision, or lack of clear direction, the story should reflect these issues prominently.

Mission Context:
Title: ${missionData.title}
Situation: ${missionData.situation}
Mission: ${missionData.mission}
Details: ${missionData.details}

Frag-O:
${fragO}

Generate a detailed, realistic story of the mission execution, ensuring that any flaws, indecision, or lack of clear direction in the Frag-O are accurately reflected in the mission's outcome:`;

    console.log('Story Generation Prompt:', prompt);

    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });
    const data = await response.json();
    return data.content;
  };

  const generateAnalysis = async (fragO: string, missionData: MissionData, story: string, username: string | null): Promise<string> => {
    const prompt = `You are a senior military officer conducting a harsh and critical after-action review. Analyze the performance of the platoon commander based on their Frag-O and the resulting mission outcome. Provide a brutally honest assessment, highlighting major flaws, critical errors, and any signs of indecision or lack of clear direction. Do not sugarcoat or provide false praise. If the Frag-O is terrible, unclear, or shows poor leadership, the analysis MUST reflect that harshly. Be direct and uncompromising in your feedback.

Mission Context:
Title: ${missionData.title}
Situation: ${missionData.situation}
Mission: ${missionData.mission}
Details: ${missionData.details}

Frag-O:
${fragO}

Mission Outcome:
${story}

Platoon Commander: ${username || 'Unknown'}

Provide a detailed, critical analysis of ${username || 'the platoon commander'}'s performance and specific recommendations for improvement. If the performance was poor, state it clearly and explain why. Focus on any indecision, lack of clear direction, or poor leadership shown in the Frag-O and how it affected the mission outcome:`;

    console.log('Analysis Generation Prompt:', prompt);

    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });
    const data = await response.json();
    return data.content;
  };

  if (isLoading || isAuthLoading) {
    return <div className="text-green-500">Loading mission results...</div>;
  }

  if (!result || !mission) {
    return <div className="text-green-500">Error: Unable to load mission results.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-green-500 p-8">
      <h1 className="text-3xl font-bold mb-8">Mission Results</h1>
      <div className="space-y-8">
        <section className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Mission Details</h2>
          <p><strong>Title:</strong> {mission.title}</p>
          <p><strong>Situation:</strong> {mission.situation}</p>
          <p><strong>Mission:</strong> {mission.mission}</p>
          <p><strong>Details:</strong> {mission.details}</p>
        </section>
        <section className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Your Frag-O</h2>
          <ReactMarkdown className="prose prose-invert prose-green">{result.fragO}</ReactMarkdown>
        </section>
        <section className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Mission Outcome</h2>
          <ReactMarkdown className="prose prose-invert prose-green">{result.story}</ReactMarkdown>
        </section>
        <section className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Performance Analysis and Recommendations</h2>
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