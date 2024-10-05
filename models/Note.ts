import mongoose from 'mongoose'

const NoteSchema = new mongoose.Schema({
  missionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mission', required: true },
  note: { type: String, required: true },
})

export default mongoose.models.Note || mongoose.model('Note', NoteSchema)