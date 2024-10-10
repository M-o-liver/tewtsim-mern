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
  _id: string;
  title: string;
  situation: string;
  mission: string;
  execution: string;
  serviceAndSupport: string;
  commandAndSignals: string;
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
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { username, isLoading: isAuthLoading } = useAuth();

  useEffect(() => {
    const fetchDataAndPost = async () => {
      if (isAuthLoading) return;

      try {
        setIsLoading(true);
        
        // Fetch the fragO
        const fragOResponse = await fetch(`/api/frago/${params.id}`);
        const fragOData = await fragOResponse.json();
        
        // Fetch the mission data
        const missionResponse = await fetch(`/api/missions/${params.id}`);
        const missionData: MissionData = await missionResponse.json();
        
        setMission(missionData);

        // Generate the story
        const story = await generateStory(fragOData.fragO, missionData, username);
        
        // Generate the analysis
        const analysis = await generateAnalysis(fragOData.fragO, missionData, story, username);
        
        const resultData = { fragO: fragOData.fragO, story, analysis };
        setResult(resultData);

        // Post the results to the database
        await postResultsToDatabase(params.id, username, story, analysis);

      } catch (error) {
        console.error('Error fetching or generating result:', error);
        setError('An error occurred while processing the mission results. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataAndPost();
  }, [params.id, username, isAuthLoading]);

  const generateStory = async (fragO: string, missionData: MissionData, username: string | null): Promise<string> => {
    const prompt = `You are a highly experienced military scenario writer tasked with generating a realistic and balanced mission outcome based on the provided mission context and Fragmentary Order (Frag-O). Your goal is to create a compelling narrative that accurately reflects the quality of the Frag-O and its impact on the mission's success or failure.

**Key Points:**
1. The platoon commander, last name, ${username || 'Unknown'}, wrote the Frag-O in just five minutes to accomplish their task.
2. The story should realistically depict how the mission unfolds based on the Frag-O's strengths and weaknesses.
3. Consider the time constraint under which the Frag-O was written and how this might affect its quality and completeness.

**Guidelines:**
- Exceptional Frag-O: If the Frag-O demonstrates strong leadership, clear objectives, decisive actions, and effective strategies despite the time constraint, the mission should be highly successful with minimal issues.
- Good Frag-O: If the Frag-O is solid but shows some signs of being rushed, the mission should be successful but with some minor challenges or unexpected situations.
- Mediocre Frag-O: If the Frag-O shows average leadership, some indecision, or unclear directives, possibly due to time pressure, the mission should be completed but with notable challenges, delays, or setbacks.
- Poor Frag-O: If the Frag-O is severely flawed, unclear, indecisive, or shows poor leadership, likely due to the time constraint, the mission must fail or encounter significant difficulties.

**Mission Context:**
- Title: ${missionData.title}
- Situation: ${missionData.situation}
- Mission: ${missionData.mission}
- Execution: ${missionData.execution}
- Service and Support: ${missionData.serviceAndSupport}
- Command and Signals: ${missionData.commandAndSignals}
- Details: ${missionData.details}

**Frag-O:**
${fragO}

**Task:**
Generate a detailed and realistic story of the mission execution that aligns with the quality of the Frag-O. Ensure that the narrative:
1. Accurately reflects the strengths and weaknesses present in the Frag-O.
2. Considers the time pressure under which the Frag-O was written.
3. Includes specific examples of how the Frag-O's content (or lack thereof) directly impacts the mission's outcome.
4. Describes the actions and decisions of Platoon Commander ${username || 'Unknown'} throughout the mission.
5. Incorporates realistic challenges, unexpected events, or enemy actions that test the effectiveness of the Frag-O.
6. Concludes with a clear outcome that logically follows from the events of the story and the quality of the Frag-O.

Your story should be engaging, realistic, and provide valuable insights into the relationship between the Frag-O's quality and the mission's success or failure.`;

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
    const prompt = `You are a senior military officer conducting a comprehensive after-action review (AAR). Your analysis should be based on the provided Frag-O, mission context, and the resulting mission outcome. Your goal is to provide a fair but challenging assessment that will motivate the platoon commander to improve their skills.

**Mission Context:**
- Title: ${missionData.title}
- Situation: ${missionData.situation}
- Mission: ${missionData.mission}
- Execution: ${missionData.execution}
- Service and Support: ${missionData.serviceAndSupport}
- Command and Signals: ${missionData.commandAndSignals}
- Details: ${missionData.details}

**Frag-O:**
${fragO}

**Mission Outcome:**
${story}

**Platoon Commander, last name,:** ${username || 'Unknown'}

**Task:**
Provide a detailed, critical analysis of ${username || 'the platoon commander'}'s performance. Your assessment should:

1. Offer a balanced view of the commander's performance, acknowledging both strengths and weaknesses.
2. Identify specific elements of the Frag-O that contributed to the mission's success or failure.
3. Analyze the commander's decision-making process, considering the 5-minute time constraint for creating the Frag-O.
4. Evaluate the commander's ability to adapt to unexpected situations during the mission.
5. Assess the overall effectiveness of the commander's leadership and communication.
6. Provide clear, actionable recommendations for improvement, focusing on key areas that would have the most significant impact.
7. Include constructive criticism that challenges the commander to strive for excellence in future missions.
8. Conclude with a motivational statement that encourages the commander to learn from this experience and continue developing their skills.

Your analysis should be thorough, fair, and designed to push the commander to improve while also recognizing their efforts and potential. The goal is to create an engaging experience that motivates the commander to challenge themselves and strive for better performance in future missions.`;

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

  const postResultsToDatabase = async (missionId: string, username: string | null, story: string, analysis: string) => {
    try {
      const response = await fetch(`/api/results/${missionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, story, analysis }),
      });

      if (!response.ok) {
        throw new Error('Failed to post results to database');
      }

      console.log('Results posted successfully');
    } catch (error) {
      console.error('Error posting results to database:', error);
      setError('Failed to save results. Please try again.');
    }
  };

  if (isLoading || isAuthLoading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-red-500 p-8 flex items-center justify-center">
        <title>Tewtsim.ca</title>
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p>{error}</p>
          <button
            onClick={() => router.push('/landing')}
            className="mt-4 bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Return to Mission Select
          </button>
        </div>
      </div>
    );
  }

  if (!result || !mission) {
    return <div className="text-green-500">Error: Unable to load mission results.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-green-500 p-8">
      <title>Tewtsim.ca</title>
      <h1 className="text-3xl font-bold mb-8">Mission Results</h1>
      <div className="space-y-8">
        <section className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Story</h2>
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