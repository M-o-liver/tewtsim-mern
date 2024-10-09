import mongoose from 'mongoose'

const ResultSchema = new mongoose.Schema({
  missionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mission', required: true },
  fragO: { type: String, required: true },
  story: { type: String, required: true },
  analysis: { type: String, required: true },
  username: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  execution: { type: String }, // Optional: Store Execution in Result
  serviceAndSupport: { type: String }, // Optional: Store Service and Support in Result
  commandAndSignals: { type: String }, // Optional: Store Command in Result
  details: { type: String }, // Optional: Store Signals in Result
})

export default mongoose.models.Result || mongoose.model('Result', ResultSchema)