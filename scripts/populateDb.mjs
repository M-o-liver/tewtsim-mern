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
  {
    title: "Buzz of Babayaga",
    description: "Canadian Forces defending a Ukrainian village against Denovian drone attacks",
    type: "Defense",
    level: "Platoon",
    situation: `
 1. Ground
   a. Weather
      - Current temperature: 2°C, overcast with light drizzle
      - Visibility: 3-5 km
      - Light easterly wind: 10-15 km/h
      - Sunset in 6 hours
   b. Terrain
      - Small Ukrainian town with approximately 80 Soviet-style houses
      - Mix of wooden and brick construction, mostly intact
      - Main road: paved, 6m wide, runs north-south through town center
      - Side streets: mix of paved and unpaved, 3-4m wide
      - Scattered debris from previous 3 days of combat
      - Open fields to east and west, forested area to the north
      - Terrain shows signs of recent artillery impacts

2. Enemy Forces
   a. General
      - Denovian 6442 RECON BN operating in the area
      - Emphasis on drone warfare and reconnaissance
   b. Composition and Strength
      - Estimated company-sized element (100-150 personnel)
      - Mix of infantry and drone operators
   c. Weapons/Equipment
      - Standard infantry weapons (AK-pattern rifles, PKM machine guns)
      - Medium-sized drones (1m wide) carrying 10 lbs of C4
      - Possible electronic warfare capabilities
   d. Recent Activities
      - Probing attacks along town perimeter in last 24 hours
      - Increased drone activity observed in last 12 hours
      - No confirmed presence within town, main force in northern treeline

3. Friendly Forces
   a. Higher
      - 3 Company, 6 Battalion PPCLI defending town center
      - 1 Platoon responsible for eastern outskirts
   b. Adjacent
      - 2 Platoon defending southern approach
      - 3 Platoon holding western flank
   c. Supporting
      - Company weapons detachment with 84mm Carl Gustav
      - Anti-drone team attached to platoon
   d. Civilians
      - Town evacuated, no civilian presence expected

4. Attachments/Detachments
   a. Anti-drone team (2 operators) attached to platoon`,
    mission: `1 Platoon will defend the eastern outskirts of Vyshkovo against Denovian forces to prevent enemy infiltration and maintain the integrity of 3 Company's defensive line.`,
    execution: `1. Concept of Operations
   a. General Outline
      - Three-point defense with mutually supporting sections
      - Mobile QRF to reinforce threatened sectors
      - Aggressive counter-drone measures

   b. Scheme of Manoeuvre
      - Phase 1: Establish defensive positions
      - Phase 2: Disrupt enemy reconnaissance efforts
      - Phase 3: Repel main Denovian assault

   c. Main Effort 
     Maintaining early warning and preventing enemy infiltration

2. Groupings and Tasks 
   a. 1 Section 
     Occupy northern defensive position 
     Maintain observation of northern treeline 
     Be prepared to reinforce 2 or 3 Section 

   b. 2 Section 
     Occupy central defensive position 
     Establish anti-drone early warning post 
     Coordinate with attached anti-drone team 

   c. 3 Section 
     Occupy southern defensive position 
     Maintain contact with 2 Platoon on right flank 
     Prepare counter-attack force if required 

   d. Weapons Detachment 
     Establish C6 GPMG positions to cover likely enemy avenues of approach 
     Prepare 84mm Carl Gustav for anti-vehicle defense 

   e. Anti-Drone Team 
     Set up mobile anti-drone system with 2 Section 
     Provide early warning of drone activity 
     Engage enemy drones on order

3. Coordinating Instructions 
   a. Timings 
     H-Hour (defensive positions established): 1400hrs 
     Expected duration of operation: 72 hours 

   b. Control Measures 
     Platoon boundaries: As per defensive overlay 
     Fire control lines: GREEN (100m), AMBER (200m), RED (400m) 

   c. ROE (Rules of Engagement) 
     Current ROE card in effect 
     Positive identification required before engagement 
     Minimize collateral damage to civilian infrastructure 

   d. Force Protection 
     100% weapon readiness 
     Helmets and fragmentation vests mandatory 
     Maintain 50% watch at all times 
     Implement random movement patterns to avoid drone targeting 

   e. Drone Defense 
     Report all drone sightings immediately 
     Use cover and concealment when drone presence suspected 
     Avoid bunching up to minimize casualties from drone strikes`,
    serviceAndSupport: `1. Ammunition 
   a. Each Rifleman  
       - 300 rounds 5.56mm (10 magazines)  
       - 2 x Smoke grenades  
       - 2 x Frag grenades  

   b. C6 GPMG  
       - 1000 rounds linked per gun  

   c. 84mm Carl Gustav  
       - 10 HEAT rounds  
       - 5 Illumination rounds  

   d. Additional Ammunition  
       Emergency resupply at Company HQ  

2. Equipment  
   a. Individual  
       Full Fighting Order  
       CBRN gear readily available  
       NVGs for 50% of personnel  
       Entrenching tool  

   b. Platoon  
       Spare barrel for C6 GPMG  
       DAGR GPS units for each section  
       Counter-drone equipment (with attached team)  

3. CASEVAC  
   a. Platoon Medical  
       Each section has one TCCC-trained member  
       Platoon medic with HQ element  

   b. Evacuation  
       Primary: Wheeled ambulance from Coy HQ  
       Alternate: Armored vehicle  
       CCP at Platoon HQ location  

4. Sustenance  
    - 72 hours of rations per person  
    Water resupply daily from Company HQ`,
    commandAndSignals: `
1. Command  
    a. Location of Commander  
        Platoon Commander with 2 Section initially  
        Platoon 2IC with 3 Section  

    b. Succession of Command  
        Platoon 2IC  
        Senior Section Commander  
        1 Section 2IC  

2. Signals  
    a. Radio  
        Platoon net: PRC-152  
        Company net: PRC-117F  
        Emergency: Company net  

    b. Codewords   
        "Thunderbolt" – Enemy drone spotted   
        "Avalanche" – Incoming artillery   
        "Scarecrow" – Request anti-drone support   
        "Wolfpack" – Enemy infantry spotted   

    c. Report Schedules   
        Situation report: Every 30 minutes   
        Spot report: Immediate upon contact   
        ACE report: Every four hours   

    d. Passwords   
        Running password: "Maple"   
        Challenge: "Poutine", Response: "Beaver"`,
    details: "Additional mission-specific details go here.",
    map: "ukrainianvillage.png",
    actionPrompt: `
  At 1530hrs, 2 Section reports multiple medium-sized drones approaching from the northeast.
  Moments later, an explosion rocks the northern defensive position.
  1 Section reports: "Contact north! Two casualties, one critical. Drone strike on our position. Break. Three more drones inbound, no visual on ground forces yet."
  2 Section confirms visual on the approaching drones, estimated 45 seconds from reaching the defensive line.
  The anti-drone team reports their system will be operational in 5 minutes due to a technical issue they're resolving.
  You have 5 minutes to issue a FRAGO addressing the evolving drone threat.
  Consider your use of assets, including the temporarily unavailable anti-drone team and company-level support.`,
    answerKey: "The answer key for this mission would go here."
  }
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