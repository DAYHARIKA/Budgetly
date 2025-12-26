import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pdf from 'pdf-parse';
import Resume from '../models/Resume.js';
import { authenticate } from '../middleware/auth.js';
import { extractSkills } from '../utils/skills.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `resume-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB default
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
});

// Upload and parse resume
router.post('/upload', authenticate, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Read and parse PDF
    const fileBuffer = fs.readFileSync(req.file.path);
    let resumeText;

    try {
      const pdfData = await pdf(fileBuffer);
      resumeText = pdfData.text;
    } catch (error) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Failed to parse PDF file' });
    }

    // Validate resume text
    if (!resumeText || resumeText.trim().length < 50) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Resume text is too short or empty' });
    }

    // Extract skills
    const extractedSkills = extractSkills(resumeText);

    // Save resume to database
    const resume = await Resume.create({
      userId: req.userId,
      fileName: req.file.originalname,
      filePath: req.file.path,
      rawText: resumeText,
      extractedSkills,
    });

    res.status(201).json({
      message: 'Resume uploaded and parsed successfully',
      resume: {
        id: resume._id.toString(),
        fileName: resume.fileName,
        extractedSkills: resume.extractedSkills,
        createdAt: resume.createdAt,
      },
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ error: 'Failed to upload resume' });
  }
});

// Get user's resumes
router.get('/', authenticate, async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const resumes = await Resume.find({ userId: req.userId })
      .select('_id fileName extractedSkills createdAt updatedAt')
      .sort({ createdAt: -1 })
      .lean();

    const formattedResumes = resumes.map(resume => ({
      id: resume._id.toString(),
      fileName: resume.fileName,
      extractedSkills: resume.extractedSkills,
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt,
    }));

    res.json({ resumes: formattedResumes });
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({ error: 'Failed to fetch resumes' });
  }
});

// Get single resume
router.get('/:id', authenticate, async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.userId,
    }).select('_id fileName extractedSkills rawText createdAt updatedAt').lean();

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.json({
      resume: {
        id: resume._id.toString(),
        fileName: resume.fileName,
        extractedSkills: resume.extractedSkills,
        rawText: resume.rawText,
        createdAt: resume.createdAt,
        updatedAt: resume.updatedAt,
      },
    });
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({ error: 'Failed to fetch resume' });
  }
});

// Delete resume
router.delete('/:id', authenticate, async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Delete file from filesystem
    if (fs.existsSync(resume.filePath)) {
      fs.unlinkSync(resume.filePath);
    }

    // Delete from database
    await Resume.deleteOne({ _id: resume._id });

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ error: 'Failed to delete resume' });
  }
});

export default router;

