import mongoose from 'mongoose'

const ResultSchema = new mongoose.Schema({
  missionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mission', required: true },
  fragO: { type: String, required: true },
  story: { type: String, required: true },
  analysis: { type: String, required: true },
  username: { type: String, required: true }, // New field for username
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

export default mongoose.models.Result || mongoose.model('Result', ResultSchema)