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
  execution: { type: String, required: true }, // New field for Execution
  serviceAndSupport: { type: String, required: true }, // New field for Service and Support
  commandAndSignals: { type: String, required: true }, // New field for Command
  details: { type: String, required: true },
  map: { type: String, required: true },
  actionPrompt: { type: String, required: true },
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
    situation: `You are the 2d Platoon Commander...`,
    mission: `Your platoon is on its second patrol...`,
    execution: `Execute the plan by moving north...`, // Sample Execution
    serviceAndSupport: `Support will be provided by...`, // Sample Service and Support
    commandAndSignals: `Command will be maintained through...`, // Sample Command
    details: `Main roads are paved...`,
    actionPrompt: `Approximately 20 minutes after crossing the bridge...`,
    map: "desertplatoon.png",
    answerKey: `Answer Key for "Platoon Attack in Jalalabad"...`,
  },
  {
    title: "Section Attack in Jalalabad",
    description: "Your flank comes under attack from a well-entrenched enemy position. You must decide how to respond.",
    type: "Combat",
    level: "Section",
    situation: `You are the 2d Platoon Commander...`,
    mission: `Your platoon is on its second patrol...`,
    execution: `Execute the plan by moving north...`, // Sample Execution
    serviceAndSupport: `Support will be provided by...`, // Sample Service and Support
    commandAndSignals: `Command will be maintained through...`, // Sample Command
    details: `Main roads are paved...`,
    actionPrompt: `Approximately 20 minutes after crossing the bridge...`,
    map: "desertsection.png",
    answerKey: `Answer Key for "Platoon Attack in Jalalabad"...`,
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