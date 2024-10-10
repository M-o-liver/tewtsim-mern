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
  mapmacro: { type: String, required: true },
  mapmicro: { type: String, required: true },
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
    situation: `
1. GROUND
  a. Weather
    Current: 29°C, partly cloudy
    Next 24h: Clear, winds NE 5-10 km/h
    BMNT: 0515hrs
    EENT: 1845hrs
    Moon: Waxing gibbous, 65% illumination
  b. Terrain
    AO: Jalalabad market district
    Grid: 42SWC 8234 5678 to 8238 5678 TBC
    1km x 500m built-up area
    Urban Characteristics:
    Dense urban terrain, 2-3 story buildings
    Narrow streets and alleyways
    Multiple covered positions and routes
    Key Terrain:
      Western mosque and minaret
      Central bazaar
      Eastern market square
      Connecting alleyways
    Obstacles:
      Market stalls
      Narrow passages
      Civilian traffic
    Cover and Concealment:
      Abundant for both friendly and enemy forces
      Multiple elevated positions
      Complex urban shadow areas

2. ENEMY FORCES
  a. General
    Multiple INS cells confirmed
    Strong local support network
    Pattern of complex attacks
  b. Capabilities
    3-4 cells of 4-6 personnel each
    Weapons:
      IED expertise (particularly in choke points)
      Small arms (AKM, PKM)
      RPG teams
      Possible mortars
    Tactics:
      Complex ambushes
      Use of civilian cover
      Coordinated attacks
      Escape routes pre-planned
  c. Most Likely COA
    IED/complex ambush at choke point
    Multiple firing positions
    Civilian use as cover
    Coordinated withdrawal
  d. Most Dangerous COA
    Multiple simultaneous attacks
    Heavy weapons support
    Cut off reinforcement routes
    Civilian casualties as goal

3. FRIENDLY FORCES
  a. Higher (Two Up) - Battalion
    1 RCR conducting Op REASSURANCE
    Intent: Maintain security in Jalalabad
    Supporting:
      Attack aviation on call
      EOD teams available
      ISR assets
  b. Higher (One Up) - Company
    A Coy responsible for market district
    2 Pl securing north sector
    3 Pl securing south sector
    QRF maintained at FOB INDIA
  c. Adjacent
    ANA checkpoint east
    ANP stations north and south
    Coalition forces west

4. ATTACHMENTS/DETACHMENTS
  Weapons Det
  EOD Team (on call)
  JTAC available`,
    mission: `1 Platoon will conduct coordinated presence patrols in Jalalabad market district NLT 1330hrs to deny INS freedom of movement and maintain coalition presence IOT support A Company's security operations.`,
    execution: `
1. CONCEPT OF OPS
  a. Commander's Intent
    Purpose: Deny INS ability to operate in market
    Method: Distributed section patrols with mutual support
    Endstate: Market secured, INS disrupted, intel gathered
  b. Scheme of Manoeuvre
    Phase 1 (DEPLOY): Sections move to start positions
      1 Section: Western market
      2 Section: Central bazaar
      3 Section: Eastern market
    Phase 2 (PATROL): Coordinated movements
      100m spacing maintained
      Mutual support possible
      Local engagement authorized
    Phase 3 (RESPONSE): React to contact
      Immediate action drills
      Support from adjacent sections
      QRF integration
    Phase 4 (CONSOLIDATION): Exploit success
      Site exploitation
      Intel gathering
      BDA

2. GROUPINGS AND TASKS
  a. 1 Section
    Clear western market sector
    Maintain observation of mosque area
    Be prepared to support 2 Section
  b. 2 Section
    Secure central bazaar
    Maintain central position
    Ready to support either flank
  c. 3 Section
    Patrol eastern market
    Monitor eastern approaches
    Be prepared to support 2 Section
  d. Weapons Det
    Establish support positions on order
    Be prepared to reinforce success
    Support casualty evacuation

3. COORDINATING INSTRUCTIONS
  a. Timings
    H-Hour: 1330hrs
    Phase 1 complete: 1345hrs
    Expected duration: 3 hours
  b. Control Measures
    Boundaries: As per overlay
    Phase lines: MAPLE, OAK, BIRCH
    ROE: Card DELTA in effect
  c. Coordination Requirements
    Radio checks every 15 mins
    Section reports at phase lines
    SITREP criteria:
      All contacts
      Pattern changes
      Civilian situations`, // Sample Execution
    serviceAndSupport: `
1. AMMO
  Rifleman:
    7 mags
    2 smokes
    2 frags
  C9 Gunner:
    800 rounds linked
    1 spare barrel
  M203:
    20 HE
    10 smoke
  Per Section:
    2 red flares
    2 green flares
    Emergency resupply with Pl 2IC

2. DRESS AND KIT
    Full fighting order
    Plates in
  Each person:
    2L water
    1 IMP
    5 flex cuffs
  Each Section:
    1 GPS
    1 camera
    Breach kit
    Stretcher

3. MEDICAL
    Casualty Flow:
    Section CCP → Platoon CCP → FOB
  Transport:
    Ambulance at FOB (15 min)
    QRF vehicles backup
  Routes:
    Main: Middle route
    Backup: Bridge route

4. TRANSPORT
  Platoon: Nil
  QRF vehicles at FOB if needed
  Ambulance on standby

5. COMMS
  Section nets on PRCs
  Spare batteries H+3
  Radio checks q15 mins`, // Sample Service and Support
    commandAndSignals: `
1. COMMAND
  Pl HQ with 2 Section
  Pl 2IC with Weapons Det
  Succession: Pl 2IC, 1 Sec Comd, 2 Sec Comd

2. SIGNALS
  Primary: Platoon net
  Alternate: Company net
  Emergency: Battalion net
  Codewords:
    "GRANITE": Section contact
    "MARBLE": QRF required
    "SLATE": Air support needed
    "BEDROCK": Mass casualty event`, // Sample Command
    details: `Nil.`,
    actionPrompt: `
At 1345hrs:
  1 Section reports IED detonation with casualties
  Multiple enemy firing points identified
  Civilians dispersing rapidly
  Reports of enemy movement to east
  Possible additional IEDs in area

Adjacent units report:
  2 Pl: Hearing small arms fire
  ANP: Suspicious vehicles moving south from the north
  ANA: Possible reinforcements coming in, military-style vehicles seen moving southeast in a nearby village

You have 5 minutes to:
  Issue FRAGO
  Deploy remaining forces
  Coordinate support
  Establish C2 measures
Consider:
  Multiple threats
  Civilian presence
  Casualty evacuation
  Support integration
  Adjacent unit coordination
  Follow-on actions`,
    mapmacro: "desertplatoon.png",
    mapmicro: "desertplatoon.png",
    answerKey: `Answer Key`,
  },
  {
    title: "Section Attack in Jalalabad",
    description: "Your flank comes under attack from a well-entrenched enemy position. You must decide how to respond.",
    type: "Combat",
    level: "Section",
    situation: `
1. GROUND
  a. Weather
    Current: 29°C, partly cloudy
    Next 6h: Clear, light winds from NE
    BMNT: 0515hrs
    EENT: 1845hrs
    Moon: Waxing gibbous, 65% illumination
  b. Terrain
    Grid: 42SWC 8234 5678 (Western Market)
    Urban density: High, 2-3 story buildings
    Streets: Primary (6m wide), alleys (2-3m)
    Construction: Mud brick, concrete
  Choke points:
    Market entrance (GR 8234 5679) TBC
    T-junction at bazaar (GR 8235 5678) TBC 
    Narrow passage by mosque (GR 8236 5677) TBC
  Key Terrain:
    Mosque minaret (40m elevation)
    Market rooftops (8-12m elevation)
    Central bazaar square
  LOA: Western market boundary to central bazaar

2. ENEMY FORCES
  a. General
    INS cells active in western sector
    Known for complex ambushes
    Strong local intelligence network
  b. Capabilities
    IED expertise (pressure plate and command det)
    Small arms (AKM, PKM)
    RPG teams
    4-6 fighters per cell
    Local civilians provide early warning
  c. Recent Activity
    IED found at GR 8233 5680 (72h ago)
    Suspicious activity near mosque
    Known RPG cache within 200m
    Local informant warnings of impending attack

3. FRIENDLY FORCES
  a. Higher (Two Up) - Company
    A Coy securing Jalalabad market district
    QRF at 15 min NTM
    EOD team available at FOB INDIA
  b. Higher (One Up) - Platoon
    1 Platoon conducting distributed presence patrol
    2 Section - Central market (100m east)
    3 Section - Eastern market (200m east)
    Pl HQ co-located with 2 Section
  c. Supporting
    Platoon weapons det
    UAV on request
    ANA partnered element

4. ATTACHMENTS/DETACHMENTS
  Nil`,
    mission: `1 Section will conduct presence patrol in western Jalalabad market NLT 1330hrs to deny INS freedom of movement and maintain coalition presence IOT support 1 Platoon's security operations.`,
    execution: `
1. CONCEPT OF OPS
  a. Commander's Intent
    Purpose: Deny INS staging/movement in western sector
    Method: Deliberate presence patrol with maximum signature
    Endstate: Western market secured, INS activity disrupted
  b. Scheme of Manoeuvre
    Phase 1: Move to start line (market entrance)
    Phase 2: Clear through market to mosque
    Phase 3: Establish presence at bazaar
    Phase 4: Return through alternate route

2. GROUPINGS AND TASKS
  a. Alpha Fireteam (Point)
    Lead patrol movement
    Main observation element
    Clear danger areas
  b. Bravo Fireteam (Main Body)
    Command element
    Support Alpha
    Local engagement
  c. Charlie Fireteam (Rear)
    Rear security
    Counter-follow
    Support by fire

3. COORDINATING INSTRUCTIONS
  a. Timings
    H-Hour (Start): 1330hrs
    Phase 1 complete: 1345hrs
    Phase 2 complete: 1400hrs
    Phase 3 complete: 1415hrs
  b. Control Measures
    Boundaries: As per patrol overlay
    Phase lines: MAPLE, OAK, BIRCH
    Checkpoints: 1 through 4
    ROE: Card DELTA in effect
  c. Coordinating Points
    Radio checks: Every 15 mins
    Adjacent section coordination at phase lines
    Report all suspicious activity`, // Sample Execution
    serviceAndSupport: `
1. EQUIPMENT
  Full fighting order
  Section radio set
  C8: 210 rds per rifle
  C9: 800 rds per gun
  Smoke grenades (2 per fireteam)
  Flex cuffs
  Camera

2. MEDICAL
  CCP at start point
  Section medic with Bravo
  Casualty evacuation through Pl HQ`, // Sample Service and Support
    commandAndSignals: `
1. COMMAND
  Sec Comd with Bravo Fireteam
  2IC with Charlie Fireteam

2. SIGNALS
  Primary: Section net (VHF)
  Alternate: Hand signals
  Emergency: Runner, Platoon net
  Codewords:
  "LIGHTNING": Contact
  "THUNDER": Casualty
  "RAINFALL": Suspicious activity
  "SUNSET": IED suspected
  "SUNRISE": Require immediate support`, // Sample Command
    details: `Nil.`,
    actionPrompt: `At 1345hrs, while passing the T-junction near the mosque (GR 8236 5677):

Large explosion engulfs Alpha Fireteam
Immediate small arms fire from mosque minaret
RPG launched from rooftop west
Civilians screaming and running
Multiple casualties from Alpha Fireteam

You have 5 minutes to:

React to contact
Deploy remaining forces
Report to higher
Establish support positions

Consider:

Multiple enemy positions
Civilian presence
Casualties requiring evacuation
Support from adjacent sections
Command and control in chaos`,
    mapmacro: "desertplatoon.png",
    mapmicro: "desertsection.png",
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
    mapmacro: "ukrainianvillage.png",
    mapmicro: "ukrainemicro.png",
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