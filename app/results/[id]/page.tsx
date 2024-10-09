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
    <p className="text-green-500 mt-4 text-lg font-bold">Loading mission results...</p>
  </div>
);

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
    const prompt = `You are a military scenario writer tasked with generating realistic and balanced mission outcomes based on the provided mission context and Frag-O. Your goal is to ensure that the mission's success or failure accurately reflects the quality of the Frag-O. 

**Guidelines:**
- **Exceptional Frag-O:** If the Frag-O demonstrates strong leadership, clear objectives, decisive actions, and effective strategies, the mission should be highly successful with minimal issues.
- **Mediocre Frag-O:** If the Frag-O shows average leadership, some indecision, or unclear directives, the mission should be completed but with notable challenges, delays, or minor setbacks.
- **Poor Frag-O:** If the Frag-O is flawed, unclear, indecisive, or shows poor leadership, the mission must fail or encounter significant difficulties.

**Mission Context:**
- **Title:** ${missionData.title}
- **Situation:** ${missionData.situation}
- **Mission:** ${missionData.mission}
- **Details:** ${missionData.details}

**Frag-O:**
${fragO}

**Task:**
Generate a detailed and realistic story of the mission execution that aligns with the quality of the Frag-O. Ensure that the narrative accurately reflects the strengths or weaknesses present in the Frag-O without exaggeration.`;

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
    const prompt = `You are a senior military officer conducting a harsh and critical after-action review. Your analysis should be directly based on the provided Frag-O and the resulting mission outcome. Provide a brutally honest assessment, highlighting major flaws, critical errors, and any signs of indecision or lack of clear direction. Do not sugarcoat or provide false praise.

**Mission Context:**
- **Title:** ${missionData.title}
- **Situation:** ${missionData.situation}
- **Mission:** ${missionData.mission}
- **Details:** ${missionData.details}

**Frag-O:**
${fragO}

**Mission Outcome:**
${story}

**Platoon Commander:** ${username || 'Unknown'}

**Task:**
Provide a detailed, critical analysis of ${username || 'the platoon commander'}'s performance. Your assessment should include:
- Specific flaws and critical errors in the Frag-O.
- How these issues directly impacted the mission outcome.
- Clear and actionable recommendations for improvement.
- Avoid any form of praise if performance was lacking.`;

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
    return <Spinner />;
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