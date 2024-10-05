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
});

const QuestionSchema = new mongoose.Schema({
  missionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mission', required: true },
  question: { type: String, required: true },
});

const AnswerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  answer: { type: String, required: true },
});

// Create models
const Mission = mongoose.model('Mission', MissionSchema);
const Question = mongoose.model('Question', QuestionSchema);
const Answer = mongoose.model('Answer', AnswerSchema);

const missions = [
  {
    title: 'Operation Desert Storm',
    description: 'A strategic mission in the Middle East',
    type: 'Combat',
    level: 'Advanced',
    situation: 'Hostile forces have taken control of key oil fields...',
    mission: 'Your team must infiltrate and secure the main oil refinery...',
    details: 'The operation will be conducted under the cover of darkness...',
    map: '/maps/desert-storm.jpg',
    questions: [
      'What is the primary objective of this mission?',
      'What are the potential risks associated with this operation?',
      'How would you approach the infiltration phase of the mission?'
    ]
  },
  {
    title: 'Arctic Rescue',
    description: 'Search and rescue operation in extreme conditions',
    type: 'Rescue',
    level: 'Intermediate',
    situation: 'A research team has gone missing in the Arctic tundra...',
    mission: 'Locate and extract the missing research team...',
    details: 'You will be dropped off 10 miles from the last known location...',
    map: '/maps/arctic-rescue.jpg',
    questions: [
      'What are the primary challenges in this Arctic rescue mission?',
      'How would you prepare your team for the extreme weather conditions?',
      'What search patterns would you employ to locate the missing team?'
    ]
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
    await Question.deleteMany({});
    await Answer.deleteMany({});

    for (const missionData of missions) {
      const { questions, ...missionFields } = missionData;
      const mission = await Mission.create(missionFields);

      for (const questionText of questions) {
        const question = await Question.create({
          missionId: mission._id,
          question: questionText,
        });

        // Create a dummy answer for each question
        await Answer.create({
          questionId: question._id,
          answer: 'This is a sample answer. Replace with actual answer key.',
        });
      }
    }

    console.log(`Database populated successfully with ${missions.length} missions and their respective questions and answers.`);
  } catch (error) {
    console.error('Error populating database:', error);
  } finally {
    await mongoose.connection.close();
  }
}

populateDb().then(() => process.exit(0));