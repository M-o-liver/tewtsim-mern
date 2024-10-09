import mongoose from 'mongoose';

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

export default mongoose.models.Mission || mongoose.model('Mission', MissionSchema);