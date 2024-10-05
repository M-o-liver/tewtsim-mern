import mongoose from 'mongoose'

const ResultSchema = new mongoose.Schema({
  missionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mission', required: true },
  story: { type: String, required: true },
  finalSummary: { type: String, required: true },
})

export default mongoose.models.Result || mongoose.model('Result', ResultSchema)