import mongoose from 'mongoose'

const AnswerSchema = new mongoose.Schema({
  missionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mission', required: true },
  fragO: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.models.Answer || mongoose.model('Answer', AnswerSchema)