import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Define schemas
const MissionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  level: { type: String, required: true },
  situation: { type: String, required: true },
  mission: { type: String, required: true },
  details: { type: String, required: true },
  map: { type: String, required: true },
  answerKey: { type: String, required: true },
});

const AnswerSchema = new mongoose.Schema({
  missionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mission', required: true },
  fragO: { type: String, required: true },
});

// Create models
const Mission = mongoose.model('Mission', MissionSchema);
const Answer = mongoose.model('Answer', AnswerSchema);

const missions = [
  {
    title: "Platoon Attack in Jalalabad",
    description: "Your flank comes under attack from a well-entrenched enemy position. You must decide how to respond.",
    type: "Combat",
    level: "Platoon",
    situation: `
    You are the 2d Platoon Commander, Company F, BLT 2/1, 11th MEU. Your company has recently taken over the area of responsibility (AOR) of Jalalabad, Afghanistan. After initial operations, organized resistance has ceased. However, insurgent and tribal fighters remain as active combatants.

    Your AOR is in an urban environment characterized by densely but haphazardly arranged mud brick houses of one and two stories with flat roofs, with the occasional taller building—usually a mosque or other religiously associated structure.

    The enemy you face wears no standardized military uniform and often appears in civilian dress, uses Soviet-era infantry weapons (AK–47s, light machine guns, and rocket propelled grenades), and has the occasional command of 82mm mortars and 12.7mm machine guns. Their main tactic is the ambush, initiated by RPG attack or improvised explosive device.

    The BLT has been relatively successful in matters of civil affairs and civil-military relations, initiating a "weapons buy back program." Of the seven major clans in the AO, the BLT has secured the support of one smaller clan but still faces resistance from several of the larger clans in the city and surrounding area.
  `,
    mission: `
    Your platoon is on its second patrol. After crossing the Rt 6 bridge, you enter the area controlled by the smaller clan that supports coalition forces. You are moving from south to north, 1st squad on the left flank, you are with 2d Squad in the center, and 3d Squad is on the right.

    Approximately 20 minutes after crossing the bridge, you hear and see an explosion where you expect 1st Squad to be, followed by automatic weapons fire and semi-automatic weapons fire. 2nd Squad leader executes halt in place and 360 security. Firing continues for 30 seconds before you receive 1st Squad report:

    "Enemy squad with AKs, RPG, mortar IED. Watson and Perez are down. Need CASEVAC. Break. Recommend 2nd Squad move north of my position and cut off retreating enemy elements. Over."

    Requirement: What now, Lieutenant? In a time limit of 5 minutes, determine what actions you would take, what orders you would issue, and what reports, if any, you would make.
  `,
    details: `
    - Main roads are paved and two lanes wide
    - Side roads are paved but only one and a half lanes wide
    - Numerous narrow dirt alleyways only suitable for foot traffic
    - You have only your organic weapons
    - Radio contact with other squads and Battalion COC, though not always 100% due to urban environment
    - Enemy rarely stands to fight, even after ambushes
    - S-2 believes major engagements often center around religious sites
  `,
    map: "desertplatoon.png",
    answerKey: `Answer Key for "Platoon Attack in Jalalabad"
Objective Evaluation Criteria
Situational Awareness and Threat Assessment
Evaluate the student's understanding of the tactical environment, including the urban terrain and enemy capabilities.
Assess the student's ability to identify potential threats and opportunities based on the provided situation.
Consider how well the student anticipates enemy actions, particularly the likelihood of ambushes and the use of IEDs.
Decision-Making and Planning
Analyze the student's decision-making process, focusing on their ability to quickly develop a plan under pressure.
Evaluate the clarity and feasibility of the orders given to subordinates.
Assess whether the student considers all available resources, including support from allied clans and civil-military relations.
Execution of Orders
Review the student's ability to execute a coordinated response, including maneuvering squads effectively.
Evaluate how well the student integrates 360-degree security measures and maintains communication with all elements.
Assess the use of organic weapons and tactical positioning to cut off enemy retreat.
Communication and Reporting
Evaluate the student's ability to communicate effectively with their squad leaders and higher command.
Assess how well the student prioritizes information in reports, such as requesting CASEVAC for casualties.
Consider how effectively the student maintains situational updates to ensure command awareness.
Adaptability and Flexibility
Assess the student's ability to adapt their plan based on changing circumstances or new intelligence.
Evaluate how well they adjust tactics if initial plans encounter unforeseen obstacles or resistance.
Risk Management
Analyze how well the student identifies and mitigates risks to personnel and mission success.
Evaluate their consideration of collateral damage, especially in urban environments with civilian presence.
General Guidance
Encourage students to maintain a balance between aggressive action and caution, considering both mission objectives and troop safety.
Emphasize the importance of maintaining situational awareness at all times, especially in complex urban environments.
Highlight the need for clear, concise communication to ensure all units are informed and coordinated effectively.
By using these criteria, instructors can provide a comprehensive evaluation of each student's tactical decision-making skills in this scenario.`,
  },
  {
    title: "Section Attack in Jalalabad",
    description: "Suddenly, gunfire erupts from behind you. What will you do?",
    type: "Combat",
    level: "Section",
    situation: `Scenario
You are the 1st Squad leader, 2d Platoon, Company F, BLT 2/1, 11th MEU. Your company has recently taken over the area of responsibility (AOR) of Jalalabad, Afghanistan. After initial operations, organized resistance has ceased. However, insurgent and tribal fighters remain as active combatants.

Your AOR is in an urban environment characterized by densely but haphazardly arranged mud brick houses of one and two stories with flat roofs, with the occasional taller building—usually a mosque or other religiously associated structure.

The enemy you face wears no standardized military uniform and often appears in civilian dress, uses Soviet-era infantry weapons (AK–47s, light machine guns, and rocket propelled grenades), and has the occasional command of 82mm mortars and 12.7mm machine guns. Their main tactic is the ambush, initiated by RPG attack or improvised explosive device.

The BLT has been relatively successful in matters of civil affairs and civil-military relations, initiating a "weapons buy back program." Of the seven major clans in the AO, the BLT has secured the support of one smaller clan but still faces resistance from several of the larger clans in the city and surrounding area.`,
    mission: `Mission
Your platoon is on its second patrol. After crossing the Rt 6 bridge, you enter the area controlled by the smaller clan that supports coalition forces. You are moving from south to north, your squad on the left flank, 2d Squad in the center with the command element, and 3d Squad on the right.

Approximately 20 minutes after crossing the bridge, the patrol is broken by the sound of yelling and screaming kids coming at you from your left through an alley. You see four young boys, 8 to 10 years old, each with different types of ammunition:
- One boy has a belt of 12.7mm around his neck
- Two boys hold 82mm mortar rounds like dead fish, from their fin-tails (you note one is fused)
- The fourth clasps a grenade, spoon in place, like a dead frog, but from your angle you cannot see signs of the pin

At this instant, there is the sound of an explosion, and a large dust cloud forms to your front. Your 1st Fire Team leader reports:
"Sergeant, Watson is down hard. Perez is hit too, but maybe not as bad."

One kid drops his mortar round and flees, followed by the kid with the 12.7mm. Then, AK–47 fire erupts from a nearby building behind you.

Requirement: What now, Sergeant? In a time limit of 5 minutes, determine what actions you would take, what orders you would issue, and what reports, if any, you would make.`,
    details: `Details
- Main roads are paved and two lanes wide
- Side roads are paved but only one and a half lanes wide
- Numerous narrow dirt alleyways only suitable for foot traffic
- You have only your organic weapons
- Radio contact with other squads and command element, though not always 100% due to urban environment
- Enemy rarely stands to fight, even after ambushes
- S-2 believes major engagements often center around religious sites`,
    map: "desertsection.png",
    answerKey: `Answer Key for "Section Attack in Jalalabad"
Objective Evaluation Criteria
Situational Awareness and Threat Assessment
- Evaluate the student's understanding of the tactical environment, including the urban terrain and enemy capabilities.
- Assess the student's ability to identify potential threats and opportunities based on the provided situation.
- Consider how well the student anticipates enemy actions, particularly the likelihood of ambushes and the use of IEDs.

Decision-Making and Planning
- Analyze the student's decision-making process, focusing on their ability to quickly develop a plan under pressure.
- Evaluate the clarity and feasibility of the orders given to subordinates.
- Assess whether the student considers all available resources, including support from allied clans and civil-military relations.

Execution of Orders
- Review the student's ability to execute a coordinated response, including maneuvering squads effectively.
- Evaluate how well the student integrates 360-degree security measures and maintains communication with all elements.
- Assess the use of organic weapons and tactical positioning to cut off enemy retreat.

Communication and Reporting
- Evaluate the student's ability to communicate effectively with their squad leaders and higher command.
- Assess how well the student prioritizes information in reports, such as requesting CASEVAC for casualties.
- Consider how effectively the student maintains situational updates to ensure command awareness.

Adaptability and Flexibility
- Assess the student's ability to adapt their plan based on changing circumstances or new intelligence.
- Evaluate how well they adjust tactics if initial plans encounter unforeseen obstacles or resistance.

Risk Management
- Analyze how well the student identifies and mitigates risks to personnel and mission success.
- Evaluate their consideration of collateral damage, especially in urban environments with civilian presence.

General Guidance
- Encourage students to maintain a balance between aggressive action and caution, considering both mission objectives and troop safety.
- Emphasize the importance of maintaining situational awareness at all times, especially in complex urban environments.
- Highlight the need for clear, concise communication to ensure all units are informed and coordinated effectively.

By using these criteria, instructors can provide a comprehensive evaluation of each student's tactical decision-making skills in this scenario.`
  },
];

async function populateDb() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clear existing data
    await Mission.deleteMany({});
    await Answer.deleteMany({});

    for (const missionData of missions) {
      const mission = await Mission.create(missionData);

      // Create a placeholder answer for each mission
      await Answer.create({
        missionId: mission._id,
        fragO: "This is a placeholder for the user's Frag-O. It will be replaced when the user submits their answer.",
      });
    }

    console.log(`Database populated successfully with ${missions.length} missions and placeholder answers.`);
  } catch (error) {
    console.error('Error populating database:', error);
  } finally {
    await mongoose.connection.close();
  }
}

populateDb().then(() => process.exit(0));