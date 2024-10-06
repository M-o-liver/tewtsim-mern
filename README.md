# TEWTSIM: Tactical Exercise Without Troops Simulator

## Project Overview

TEWTSIM is a web-based application developed to support Canadian Armed Forces training initiatives, with a focus on providing a platform for tactical decision-making at the Infantry School in a low-stakes environment. This tool digitizes Tactical Decision Games (TDGs), offering an interactive platform for CAF personnel to sharpen their critical thinking skills in simulated combat scenarios.

🎖️ **Developed under the guidance of WO Outar, Platoon Warrant of Officer Preparation Platoon, Infantry School**

🚀 **Current Status:** MERN Stack Implementation

🔐 **Classification:** UNCLASSIFIED

### Try It Out

Visit [tewtsim.ca](https://tewtsim.ca) and log in with:

- Username: "Oliver"
- Password: "123"

To see some examples of completed missions!

Feel free to create your own account!

(Note: OAuth2 implementation is planned for enhanced security upon wider adoption.)

## Key Features

### 🏁 Mission Start

- Choose your challenge:
  - 🔵 Platoon-level operations
  - 🟢 Section-level tactics
- Review your mission history

### 📋 Mission Brief

- Comprehensive mission briefing
- Interactive tools for note-taking and combat estimate preparation

### ❓ Tactical Decision Point

- Time-constrained situational questions integrated into the mission page
- FRAG-O creation exercise

### 🏆 Mission Debrief

- AI-generated outcome based on your decisions
- Constructive feedback on performance
- Final assessment and mission summary

## Technical Stack

- **Frontend:** React.js for dynamic and responsive user interfaces
- **Backend:** Node.js with Express.js for robust API development
- **Database:** MongoDB for flexible and scalable data storage
- **State Management:** Redux for efficient application state management
- **API Integration:** RESTful APIs for seamless client-server communication
- **Authentication:** JSON Web Tokens (JWT) for secure user authentication

## Future Enhancements

- 🚀 Continuous improvement of the MERN stack implementation
- ☁️ Potential migration to serverless architecture for improved scalability
- 📚 Expand TDG library in collaboration with CAF SMEs
- 🤖 Integrate Protected B AI models for scenario generation
- 🧠 Implement advanced reasoning capabilities

## Training Benefits

TEWTSIM aims to enhance:

1. Critical thinking in tactical scenarios
2. Decision-making under pressure
3. Strategic approach exploration
4. Preparation for field exercises
5. Tactical textual scenario data collection for organizational analysis and future development

## Installation Guide (Local Development Environment)

1. Clone the TEWTSIM repository
   `git clone https://github.com/M-o-liver/tewtsim-mern`
   `cd tewtsim-mern`

2. Install dependencies
   `npm install
   cd client
   npm install
   cd ..`

3. Set up environment variables
   - Create a .env file in the root directory
   - Add necessary environment variables (e.g., MONGODB_URI, JWT_SECRET)

4. Start the development server
   npm run dev

5. Access the application
   - Open a web browser and navigate to `http://localhost:3000`

Note: Ensure you have Node.js, npm, and MongoDB installed on your system before proceeding with the installation.

## Scenario Management

TEWTSIM scenarios are now managed through MongoDB. To add a new scenario:

1. Develop the Tactical Decision Game (TDG) content as before

2. Use the provided API endpoints to create new missions

   - POST /api/missions to create a new mission
   - Include all necessary mission data in the request body

3. Test the new scenario

   - Access the new scenario through the frontend interface
   - Verify all content displays correctly
   - Ensure the mission flow functions as intended

Best Practices:

- Maintain consistency in data structure across scenarios
- Regularly backup the database
- Consider version control for scenario content to track changes over time

For assistance with scenario development or technical implementation, please consult me at `oliver.cross@forces.gc.ca`

## Contribution Guidelines

We welcome contributions that enhance TEWTSIM's training value. However, remember:

1. Maintain OPSEC at all times
2. Follow CAF standards
3. Submit pull requests for review before merging

For assistance with scenario development or technical implementation, please contact `oliver.cross@forces.gc.ca`

## Acknowledgments

This project is being developed to support the training initiatives of the Canadian Armed Forces, with particular focus on the needs of the Infantry School. Special thanks to Warrant Outar, Platoon Warrant of OPP at the Infantry School, for providing invaluable guidance and expertise throughout the development process.

## Disclaimer

TEWTSIM is a training tool and does not replace official Canadian Armed Forces doctrine or training programs. All users must adhere to proper security protocols and handling of military information.

---

Developed with pride in support of the Canadian Armed Forces.

🍁
