import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true,
    index: true,
  },
  jobDescription: {
    type: String,
    required: true,
  },
  requiredSkills: {
    type: [String],
    default: [],
  },
  matchPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  atsScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  missingSkills: {
    type: [String],
    default: [],
  },
  aiFeedback: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Analysis', analysisSchema);

