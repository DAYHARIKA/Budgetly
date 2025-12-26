# AI-Assisted Resume Screening Platform

A full-stack, AI-assisted resume screening system where **core scoring is rule-based and explainable**, and AI is used only for feedback and suggestions. This system is designed to be defendable in technical interviews.

## 🎯 Problem Statement

Recruiters and job seekers need a tool to:
- Quickly assess resume-to-job-description match
- Understand why a resume scored a certain way (explainable scoring)
- Get actionable feedback to improve resumes
- Have confidence in the scoring algorithm (not a black box)

## 🏗️ System Architecture

### Tech Stack

**Backend:**
- Node.js + Express (JavaScript)
- MongoDB + Mongoose
- JWT Authentication
- PDF parsing (pdf-parse)
- OpenAI API (for feedback only)

**Frontend:**
- React
- Vite
- React Router
- Axios

### Architecture Overview

```
┌─────────────┐
│   Frontend  │ (React + Vite)
│  (Port 3000)│
└──────┬──────┘
       │ HTTP/REST
       │
┌──────▼──────┐
│   Backend   │ (Express + JavaScript)
│  (Port 5000)│
└──────┬──────┘
       │
   ┌───┴───┐
   │       │
┌──▼──┐ ┌──▼──┐
│MongoDB│ │OpenAI│
│Database│ │ API  │
└────────┘ └──────┘
```

## 📊 Scoring Logic (Rule-Based & Explainable)

### Match Percentage Calculation

```
Match % = (Matched Skills / Required Skills) × 100
```

**Where:**
- **Matched Skills**: Skills that appear in both resume and job description
- **Required Skills**: Skills extracted from job description

**Example:**
- Job requires: `["JavaScript", "React", "Node.js", "Python"]`
- Resume has: `["JavaScript", "React", "TypeScript"]`
- Match: `2 / 4 = 50%`

### ATS Score Calculation

```
ATS Score = Match % + Bonus (capped at 100)
Bonus = min(Extra Skills × 1%, 10%)
```

**Where:**
- **Extra Skills**: Skills in resume but not required by job
- **Bonus**: Up to 10% for having additional relevant skills

**Example:**
- Match %: 50%
- Extra skills: 3 (TypeScript, Docker, AWS)
- Bonus: min(3 × 1%, 10%) = 3%
- ATS Score: 50% + 3% = 53%

### Why This Approach?

1. **Explainable**: Every score can be traced to specific skill matches
2. **Defendable**: Simple formula that can be explained in interviews
3. **Transparent**: Users see exactly which skills matched/missing
4. **Fair**: No hidden biases or complex ML models

## 🔄 API Flow

### 1. Authentication
```
POST /api/auth/signup
POST /api/auth/login
```

### 2. Resume Upload
```
POST /api/resumes/upload
- Uploads PDF file
- Extracts plain text
- Extracts skills (rule-based keyword matching)
- Stores in database
```

### 3. Analysis
```
POST /api/analyses
Body: { resumeId, jobDescription }
- Extracts skills from job description
- Calculates match % and ATS score (rule-based)
- Generates AI feedback (async, non-blocking)
- Returns analysis results
```

### 4. Results
```
GET /api/analyses/:id
- Returns complete analysis with scores and feedback
```

## 🧠 AI Integration (Feedback Only)

**Important**: AI is **NOT** used for scoring. It's only used for:
- Resume improvement suggestions
- Weak section identification
- Bullet-point phrasing tips
- Actionable recommendations

**Implementation:**
- Uses OpenAI GPT-3.5-turbo
- 10-second timeout
- Graceful degradation if API fails
- Non-blocking (analysis completes even if AI fails)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or MongoDB Atlas)
- OpenAI API key (optional, for AI feedback)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd resume-analyzer
```

2. **Install dependencies**
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

3. **Set up database**

**Option A: Local MongoDB**
```bash
# Make sure MongoDB is running locally
mongosh  # Test connection
```

**Option B: MongoDB Atlas (Cloud)**
- Create a free account at https://www.mongodb.com/cloud/atlas
- Create a cluster and get connection string

4. **Configure environment variables**

Create `backend/.env`:
```env
DATABASE_URL="mongodb://localhost:27017/resume_analyzer"
# Or for MongoDB Atlas:
# DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/resume_analyzer?retryWrites=true&w=majority"

JWT_SECRET="your-super-secret-jwt-key-change-this"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV=development
OPENAI_API_KEY="your-openai-api-key-here"  # Optional
MAX_FILE_SIZE=5242880
UPLOAD_DIR="./uploads"
```

5. **Run the application**

**Development (both frontend and backend):**
```bash
npm run dev
```

**Or separately:**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

6. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Project Structure

```
resume-analyzer/
├── backend/
│   ├── src/
│   │   ├── index.js             # Express server entry
│   │   ├── config/
│   │   │   └── database.js      # MongoDB connection
│   │   ├── models/              # Mongoose models
│   │   │   ├── User.js
│   │   │   ├── Resume.js
│   │   │   └── Analysis.js
│   │   ├── routes/               # API routes
│   │   │   ├── auth.js          # Authentication
│   │   │   ├── resume.js        # Resume upload/management
│   │   │   └── analysis.js      # Analysis endpoints
│   │   ├── middleware/
│   │   │   └── auth.js          # JWT authentication middleware
│   │   └── utils/
│   │       ├── skills.js        # Rule-based skill extraction
│   │       ├── scoring.js        # ATS scoring algorithm
│   │       └── ai.js            # OpenAI integration
│   └── uploads/                  # Uploaded resume files
├── frontend/
│   ├── src/
│   │   ├── pages/               # React pages
│   │   │   ├── Login.tsx
│   │   │   ├── Signup.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Analyze.tsx
│   │   │   └── Results.tsx
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx  # Authentication state
│   │   └── components/
│   │       └── ProtectedRoute.tsx
│   └── public/
└── README.md
```

## 🧪 Edge Cases Handled

1. **Empty/Invalid Inputs**
   - Resume text too short (< 50 chars)
   - Job description too short (< 50 chars)
   - No skills found in job description

2. **File Handling**
   - Only PDF files accepted
   - File size limits (5MB default)
   - Invalid PDF format handling
   - File cleanup on errors

3. **AI API Failures**
   - Timeout handling (10s)
   - Rate limit handling
   - Invalid API key handling
   - Graceful degradation (analysis completes without AI)

4. **Authentication**
   - Invalid/expired tokens
   - Missing authentication
   - User authorization checks

5. **Database**
   - Duplicate email handling
   - ObjectId validation
   - Data consistency checks

## 🔒 Security Features

- Password hashing (bcrypt)
- JWT token authentication
- Protected routes
- File upload validation
- NoSQL injection prevention (Mongoose)
- Input validation

## 📈 Future Improvements (Phase 5)

### High-Value Improvements
- Resume versioning
- Job description history
- Skill weighting (core vs optional skills)
- Cached analysis results

### Optional Advanced Features
- Recruiter dashboard
- Resume ranking for multiple candidates
- Multi-JD comparison
- Export analysis reports (PDF)

## 🎓 Interview Defense Points

### Core Scoring
- **Q: How does the scoring work?**
  - A: Rule-based keyword matching. Match % = (matched skills / required skills) × 100. ATS score adds bonus for extra skills.

### AI Usage
- **Q: Why use AI if scoring is rule-based?**
  - A: AI is only for feedback/suggestions, not scoring. This ensures explainable scores while providing value-added insights.

### Scalability
- **Q: How would you scale this?**
  - A: Add caching for analyses, use job queues for AI processing, implement CDN for file storage, add database indexing.

### Explainability
- **Q: Can you explain any score?**
  - A: Yes. Every score shows: matched skills, missing skills, exact calculation. No black box.

## 📝 License

MIT License

## 👤 Author

Built as a defendable, interview-ready project demonstrating:
- Full-stack development
- Rule-based algorithms
- AI integration (appropriate use)
- Clean architecture
- Production-ready code

---

**Note**: This project is designed to be explainable and defendable in technical interviews. All scoring logic is transparent and rule-based.

