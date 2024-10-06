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
    title: "Operation Eastern Shield",
    description: "CAF Platoon defense against Russian advance in Eastern Europe",
    type: "Combat",
    level: "Advanced",
    situation: "As a platoon commander in the Canadian Armed Forces, you are deployed to Eastern Europe as part of NATO's enhanced Forward Presence. Intelligence reports indicate that Russian forces are massing near the border and an incursion is imminent. Your platoon has been tasked with defending a strategic crossroads that is vital for the movement of NATO reinforcements.",
    mission: "Your mission is to establish a defensive position at Grid 123456 to deny enemy forces access to the crossroads and maintain it for 48 hours until reinforcements arrive.",
    details: "You have a full infantry platoon with 3 sections, each equipped with C7 rifles, C9 LMGs, and Carl Gustav recoilless rifles. You also have a weapons detachment with a C6 GPMG and 60mm mortar. Attached to your platoon is an ATGM team with Javelin missiles. The terrain is mostly wooded with some open fields. The crossroads is on a small hill that provides good observation of the surrounding area. You have a limited amount of time to prepare your defenses before the expected Russian attack.",
    map: "/maps/eastern-europe-crossroads.jpg",
    answerKey: "An ideal Frag-O for this situation would include:\n\n1. Intent: Hold the crossroads for 48 hours, denying enemy access while preserving combat power.\n\n2. Concept of Operations:\n   a. Establish a 360-degree defense on the hill overlooking the crossroads.\n   b. Position two sections forward to cover likely enemy approaches, with the third in reserve.\n   c. Place the weapons detachment to provide overlapping fields of fire.\n   d. Use the ATGM team to cover the most likely avenue for armored approach.\n   e. Establish observation posts forward of the main defensive position.\n   f. Prepare alternate and supplementary positions.\n   g. Create obstacles and minefields to channel enemy movement.\n\n3. Tasks:\n   1 Section: Defend the northern approach, establish OP1.\n   2 Section: Defend the eastern approach, establish OP2.\n   3 Section: Act as reserve, prepare counterattack plans.\n   Weapons Det: Support forward sections, be prepared to reinforce as needed.\n   ATGM Team: Orient to the east, engage any armored threats.\n\n4. Coordinating Instructions:\n   - Priorities of work: fighting positions, fields of fire, camouflage, obstacles.\n   - Rehearse withdrawal to alternate positions.\n   - Establish comms check every 30 minutes.\n   - Report all enemy sightings immediately.\n\n5. Service Support:\n   - Resupply of ammunition and water at last light.\n   - Casualty collection point established behind the hill.\n\n6. Command and Signals:\n   - Platoon HQ co-located with 3 Section.\n   - Platoon commander to rotate between positions.\n   - Use company net for reports, platoon net for internal comms.\n   - Pyrotechnics: Green flare for withdrawal, Red for enemy sighting."
  },
  {
    title: "Operation Sahel Stability",
    description: "CAF Platoon conducting stability operations in an African village",
    type: "Stability",
    level: "Intermediate",
    situation: "Your CAF platoon is deployed to a UN peacekeeping mission in the Sahel region of Africa. You are operating in an area where an insurgency has been destabilizing local communities. Your platoon has been tasked with providing security to a village that has recently pledged support to the government but is now facing threats from the insurgents.",
    mission: "Establish a presence in and around Village Alpha (Grid 789012) to protect the civilian population from insurgent intimidation and attacks while fostering positive relationships with local leaders and gathering intelligence on insurgent activities.",
    details: "Your platoon is at full strength with three sections. You have been provided with two Light Armored Vehicles (LAVs) for mobility and fire support. The village has approximately 500 inhabitants and is situated near a critical water source. Local leaders have reported insurgent activity in the nearby hills. You are to maintain your presence for two weeks before being relieved by another platoon. Rules of Engagement are restrictive, emphasizing minimum necessary force and protection of civilians.",
    map: "/maps/sahel-village-alpha.jpg",
    answerKey: "An ideal Frag-O for this situation would include:\n\n1. Intent: Establish a secure environment in and around Village Alpha, build trust with the local population, and disrupt insurgent activities.\n\n2. Concept of Operations:\n   a. Conduct regular patrols in and around the village.\n   b. Establish observation posts on key terrain features.\n   c. Engage with local leaders and population to build rapport and gather information.\n   d. Conduct targeted operations based on intelligence to disrupt insurgent activities.\n   e. Provide security for vital infrastructure, particularly the water source.\n\n3. Tasks:\n   1 Section: Conduct day patrols in the village and immediate surroundings.\n   2 Section: Establish and man OPs on high ground to the north and east of the village.\n   3 Section: Conduct night patrols and act as Quick Reaction Force (QRF).\n   LAV 1: Support 1 Section operations and provide overwatch for the water source.\n   LAV 2: Support 2 Section operations and conduct wider area patrols.\n\n4. Coordinating Instructions:\n   - Maintain a low profile and respectful demeanor when interacting with locals.\n   - Report all interactions with local population and suspected insurgent activities.\n   - Conduct daily key leader engagements.\n   - Establish local pattern of life and report any anomalies.\n   - Be prepared to provide humanitarian assistance if required.\n\n5. Service Support:\n   - Establish a secure platoon harbor outside the village.\n   - Conduct resupply operations every three days.\n   - Maintain 72 hours of supplies at all times.\n\n6. Command and Signals:\n   - Platoon HQ to be mobile, rotating between sections.\n   - Daily situation report to company HQ at 1800hrs.\n   - Use interpreters for all interactions with local population.\n   - Codewords: \"Sunray\" for insurgent sighting, \"Moonbeam\" for request QRF."
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