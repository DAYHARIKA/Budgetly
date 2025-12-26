import express from 'express';
import Resume from '../models/Resume.js';
import Analysis from '../models/Analysis.js';
import { authenticate } from '../middleware/auth.js';
import { extractSkillsFromJD } from '../utils/skills.js';
import { calculateScore, validateScoringInputs } from '../utils/scoring.js';
import { generateAIFeedbackWithTimeout } from '../utils/ai.js';
import mongoose from 'mongoose';

const router = express.Router();

// Create analysis
router.post('/', authenticate, async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { resumeId, jobDescription } = req.body;

    // Validation
    if (!resumeId || !mongoose.Types.ObjectId.isValid(resumeId)) {
      return res.status(400).json({ error: 'Invalid resume ID' });
    }

    if (!jobDescription || jobDescription.trim().length < 50) {
      return res.status(400).json({ error: 'Job description must be at least 50 characters' });
    }

    // Get resume
    const resume = await Resume.findOne({
      _id: resumeId,
      userId: req.userId,
    });

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Extract skills from job description
    const requiredSkills = extractSkillsFromJD(jobDescription);

    if (requiredSkills.length === 0) {
      return res.status(400).json({ 
        error: 'No skills found in job description. Please provide a more detailed job description.' 
      });
    }

    // Validate scoring inputs
    const validation = validateScoringInputs(resume.extractedSkills, requiredSkills);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    // Calculate scores
    const scoringResult = calculateScore(resume.extractedSkills, requiredSkills);

    // Generate AI feedback (async, non-blocking)
    let aiFeedback = null;
    try {
      aiFeedback = await generateAIFeedbackWithTimeout(
        resume.rawText,
        jobDescription,
        scoringResult.missingSkills,
        scoringResult.matchPercentage,
        10000
      );
    } catch (error) {
      console.error('AI feedback error (non-blocking):', error);
    }

    // Save analysis to database
    const analysis = await Analysis.create({
      userId: req.userId,
      resumeId: resume._id,
      jobDescription,
      requiredSkills,
      matchPercentage: scoringResult.matchPercentage,
      atsScore: scoringResult.atsScore,
      missingSkills: scoringResult.missingSkills,
      aiFeedback,
    });

    // Populate resume data for response
    const analysisWithResume = await Analysis.findById(analysis._id)
      .populate('resumeId', '_id fileName extractedSkills')
      .lean();

    const resumeData = analysisWithResume?.resumeId;

    res.status(201).json({
      message: 'Analysis completed successfully',
      analysis: {
        id: analysis._id.toString(),
        matchPercentage: analysis.matchPercentage,
        atsScore: analysis.atsScore,
        missingSkills: analysis.missingSkills,
        requiredSkills: analysis.requiredSkills,
        matchedSkills: scoringResult.matchedSkills,
        aiFeedback: analysis.aiFeedback,
        resume: {
          id: resumeData?._id?.toString() || resume._id.toString(),
          fileName: resumeData?.fileName || resume.fileName,
          extractedSkills: resumeData?.extractedSkills || resume.extractedSkills,
        },
        createdAt: analysis.createdAt,
      },
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Failed to create analysis' });
  }
});

// Get user's analyses
router.get('/', authenticate, async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const analyses = await Analysis.find({ userId: req.userId })
      .populate('resumeId', '_id fileName extractedSkills')
      .sort({ createdAt: -1 })
      .lean();

    const formattedAnalyses = analyses.map((analysis) => ({
      id: analysis._id.toString(),
      matchPercentage: analysis.matchPercentage,
      atsScore: analysis.atsScore,
      missingSkills: analysis.missingSkills,
      requiredSkills: analysis.requiredSkills,
      aiFeedback: analysis.aiFeedback,
      resume: {
        id: analysis.resumeId?._id?.toString() || analysis.resumeId?.toString(),
        fileName: analysis.resumeId?.fileName,
        extractedSkills: analysis.resumeId?.extractedSkills || [],
      },
      createdAt: analysis.createdAt,
    }));

    res.json({ analyses: formattedAnalyses });
  } catch (error) {
    console.error('Get analyses error:', error);
    res.status(500).json({ error: 'Failed to fetch analyses' });
  }
});

// Get single analysis
router.get('/:id', authenticate, async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const analysis = await Analysis.findOne({
      _id: req.params.id,
      userId: req.userId,
    })
      .populate('resumeId', '_id fileName extractedSkills')
      .lean();

    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    res.json({
      analysis: {
        id: analysis._id.toString(),
        matchPercentage: analysis.matchPercentage,
        atsScore: analysis.atsScore,
        missingSkills: analysis.missingSkills,
        requiredSkills: analysis.requiredSkills,
        aiFeedback: analysis.aiFeedback,
        resume: {
          id: analysis.resumeId?._id?.toString() || analysis.resumeId?.toString(),
          fileName: analysis.resumeId?.fileName,
          extractedSkills: analysis.resumeId?.extractedSkills || [],
        },
        createdAt: analysis.createdAt,
      },
    });
  } catch (error) {
    console.error('Get analysis error:', error);
    res.status(500).json({ error: 'Failed to fetch analysis' });
  }
});

export default router;

