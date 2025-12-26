import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  rawText: {
    type: String,
    required: true,
  },
  extractedSkills: {
    type: [String],
    default: [],
  },
}, {
  timestamps: true,
});

export default mongoose.model('Resume', resumeSchema);

