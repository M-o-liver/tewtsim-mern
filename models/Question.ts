import mongoose from 'mongoose'

const QuestionSchema = new mongoose.Schema({
  missionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mission', required: true },
  question: { type: String, required: true },
  correctAnswer: { type: String, required: true },
})

export default mongoose.models.Question || mongoose.model('Question', QuestionSchema)