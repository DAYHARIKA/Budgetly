# Backend API Documentation

## Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/resume_analyzer?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV=development

# OpenAI (for AI feedback only)
OPENAI_API_KEY="your-openai-api-key-here"

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR="./uploads"
```

## API Endpoints

### Authentication

#### POST /api/auth/signup
Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe" // optional
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt-token"
}
```

#### POST /api/auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt-token"
}
```

### Resumes

#### POST /api/resumes/upload
Upload a PDF resume.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `resume`: PDF file

**Response:**
```json
{
  "message": "Resume uploaded and parsed successfully",
  "resume": {
    "id": "uuid",
    "fileName": "resume.pdf",
    "extractedSkills": ["JavaScript", "React", "Node.js"],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET /api/resumes
Get all resumes for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "resumes": [
    {
      "id": "uuid",
      "fileName": "resume.pdf",
      "extractedSkills": ["JavaScript", "React"],
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### GET /api/resumes/:id
Get a specific resume.

**Headers:**
```
Authorization: Bearer <token>
```

#### DELETE /api/resumes/:id
Delete a resume.

**Headers:**
```
Authorization: Bearer <token>
```

### Analysis

#### POST /api/analyses
Create a new analysis.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "resumeId": "uuid",
  "jobDescription": "We are looking for a Full Stack Developer..."
}
```

**Response:**
```json
{
  "message": "Analysis completed successfully",
  "analysis": {
    "id": "uuid",
    "matchPercentage": 75,
    "atsScore": 80,
    "missingSkills": ["Docker"],
    "requiredSkills": ["JavaScript", "React", "Node.js", "Docker"],
    "matchedSkills": ["JavaScript", "React", "Node.js"],
    "aiFeedback": "AI-generated feedback...",
    "resume": {
      "id": "uuid",
      "fileName": "resume.pdf",
      "extractedSkills": ["JavaScript", "React", "Node.js"]
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET /api/analyses
Get all analyses for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

#### GET /api/analyses/:id
Get a specific analysis.

**Headers:**
```
Authorization: Bearer <token>
```

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message"
}
```

**Status Codes:**
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (authentication required)
- `404`: Not Found
- `500`: Internal Server Error

## Development

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

