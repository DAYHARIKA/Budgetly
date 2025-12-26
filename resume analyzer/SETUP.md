# Setup Guide

## Quick Start

### 1. Database Setup

**Option A: Local MongoDB**

```bash
# Install MongoDB (if not installed)
# macOS: brew install mongodb-community
# Ubuntu: sudo apt-get install mongodb
# Windows: Download from mongodb.com

# Start MongoDB service
# macOS/Linux: brew services start mongodb-community
# Windows: MongoDB runs as a service automatically

# Test connection
mongosh
```

**Option B: MongoDB Atlas (Cloud - Recommended)**

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (free tier available)
4. Get your connection string
5. Add your IP to whitelist (or 0.0.0.0/0 for development)

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
# Copy the example below and fill in your values

# Start development server
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Environment Variables

Create `backend/.env`:

```env
# Database - MongoDB
DATABASE_URL="mongodb://localhost:27017/resume_analyzer"
# Or for MongoDB Atlas:
# DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/resume_analyzer?retryWrites=true&w=majority"

# JWT (generate a strong secret)
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV=development

# OpenAI (optional - for AI feedback)
OPENAI_API_KEY="sk-..."

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR="./uploads"
```

## Troubleshooting

### Database Connection Issues

- Ensure MongoDB is running: `mongosh` (should connect)
- Check DATABASE_URL format
- For MongoDB Atlas: Verify IP is whitelisted
- For local MongoDB: Check if service is running

### Port Already in Use

- Backend (5000): Change PORT in `.env`
- Frontend (3000): Edit `vite.config.js`

### MongoDB Connection Errors

```bash
# Test MongoDB connection
mongosh "mongodb://localhost:27017/resume_analyzer"

# Check MongoDB service status
# Windows: Check Services app
# macOS: brew services list
# Linux: sudo systemctl status mongod
```

### PDF Parsing Errors

- Ensure uploaded files are valid PDFs
- Check file size limits
- Verify pdf-parse package is installed

## Production Deployment

### Backend (Render/Railway)

1. Set environment variables in dashboard
2. Set DATABASE_URL to MongoDB Atlas connection string
3. Start: `npm start`
4. No migrations needed (MongoDB is schema-less)

### Frontend (Vercel/Netlify)

1. Build: `npm run build`
2. Deploy `dist/` folder
3. Set API URL in environment variables

## Testing

### Manual Testing Flow

1. Sign up / Login
2. Upload a PDF resume
3. Enter a job description
4. View analysis results
5. Check AI feedback (if API key provided)

### Test Data

**Sample Job Description:**
```
We are looking for a Full Stack Developer with experience in:
- JavaScript and TypeScript
- React and Node.js
- MongoDB database
- AWS cloud services
- Docker and CI/CD

Requirements:
- 3+ years of experience
- Strong problem-solving skills
- Experience with REST APIs
```

## Next Steps

- Add your OpenAI API key for AI feedback
- Customize skills list in `backend/src/utils/skills.js`
- Adjust scoring algorithm in `backend/src/utils/scoring.js`
- Customize UI styling in `frontend/src/App.css`
