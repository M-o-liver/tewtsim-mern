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
    const prompt = `You are a highly experienced military scenario writer tasked with generating a realistic and balanced mission outcome based on the provided mission context and Fragmentary Order (Frag-O). Your goal is to create a detailed narrative that shows how the Frag-O's quality directly impacts mission execution, key decision points, and final outcomes.
Mission Parameters

Platoon Commander ${username || 'Unknown'} had only five minutes to write this Frag-O
The story must demonstrate clear cause-and-effect relationships between the Frag-O's content and mission events
Time pressure's impact on planning quality should be evident in the narrative

Quality Impact Guidelines

Exceptional Frag-O: Despite time constraints, shows masterful planning. Mission succeeds smoothly with only minor complications that the plan anticipates and handles well.
Solid Frag-O: Shows good planning despite being rushed. Mission succeeds but encounters 2-3 unexpected challenges that require adaptation within the plan's framework.
Mediocre Frag-O: Reveals planning gaps from time pressure. Mission completes but faces 4-5 significant difficulties that force substantial deviation from the original plan.
Poor Frag-O: Shows critical planning failures. Mission encounters major problems directly tied to plan oversights, leading to potential failure or costly adaptations.

Mission Context

Title: ${missionData.title}
Situation: ${missionData.situation}
Mission: ${missionData.mission}
Execution: ${missionData.execution}
Service and Support: ${missionData.serviceAndSupport}
Command and Signals: ${missionData.commandAndSignals}
Details: ${missionData.details}

Frag-O:
${fragO}
Story Requirements
Create a detailed narrative that:

Opens with the initial execution of the Frag-O, showing how well troops understand their orders
Presents 3-4 key decision points where Commander ${username || 'Unknown'} must respond to situations
Shows specific moments where the Frag-O's strengths or weaknesses become evident
Includes realistic friction points:

Equipment issues
Communication challenges
Weather impacts
Enemy actions
Coordination problems


Demonstrates how subordinate leaders interpret and execute the Frag-O
Closes with clear mission results and immediate aftermath

Your narrative should be 800-1200 words, structured chronologically, and focus on how the Frag-O's quality shapes events. Include specific details about time, locations, unit movements, and command decisions that directly reflect the Frag-O's content or omissions.
Write this as a gripping military story that naturally reveals planning quality through events rather than explicit commentary. The story should feel like a real mission report while providing clear material for analyzing the relationship between planning and execution.`;

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
    const prompt = `You are a seasoned military officer conducting an after-action review (AAR). Your analysis must be direct, honest, and professionally demanding - the kind that makes leaders either step up or step out.
Full Mission Context
Initial Mission Parameters:

Title: ${missionData.title}
Situation: ${missionData.situation}
Mission: ${missionData.mission}
Execution: ${missionData.execution}
Service and Support: ${missionData.serviceAndSupport}
Command and Signals: ${missionData.commandAndSignals}
Details: ${missionData.details}

Commander's Planning:

Time Allocated: 5 minutes
Original Frag-O: ${fragO}

Mission Execution:

Actual Outcome: ${story}
Commander: ${username || 'Unknown'}

Initial Situation Analysis

Compare original mission parameters against Frag-O planning:

Mission understanding
Resource utilization
Risk assessment
Support integration
Command and control implementation


Analyze planning under time constraint:

Critical elements included/missed
Priority decisions
Essential coordination points
Contingency considerations



Execution Analysis

Command Decisions vs Mission Parameters

How well did execution align with original mission intent?
Where did planning gaps affect operational reality?
What elements of the original situation were properly/improperly addressed?


Resource and Support Utilization

Compare planned vs actual support requirements
Effectiveness of command and signal plans in execution
Impact of service and support decisions


Critical Decision Points

Integration of mission parameters in key moments
Adaptation to situation changes
Command presence impact



Professional Assessment

Mission Critical Moments

Most consequential decisions
Direct impact on troops and mission
Leadership presence effects


Command Effectiveness

Key decisions showing command capability
Time constraint management
Operational control effectiveness


Hard Truths

Critical points requiring different decisions
Planning gaps and their consequences
Professional standards assessment


Next Mission Focus

Specific command challenge
Tactical/leadership standard to meet
Readiness assessment



Tone Requirements

Professional intensity over false praise
Respect shown through honest assessment
Focus on command responsibility and mission impact
Clear connection between decisions and consequences

Essential Elements

Direct comparison of mission parameters to execution results
Clear cause-and-effect between planning and outcomes
Impact of time pressure on critical thinking
Specific standards that weren't met (when applicable)
Direct challenge for next mission

Your AAR should leave the commander with:

Clear understanding of their command impact against original mission parameters
Professional challenge they want to overcome
Slightly uncomfortable but professionally motivated
Desire to prove capability
Recognition that command has real consequences

Avoid:

Personal attacks or emotional manipulation
Sugarcoating significant issues
Focusing on minor details over command decisions
Vague or general feedback
Excessive praise or unnecessary harshness

Focus your analysis on comparing the original mission parameters against both the Frag-O and actual execution. Show how planning decisions under time pressure cascaded through the operation, and identify where better integration of mission elements could have improved outcomes.`;

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