# 🚀 Quick Start Guide - Run on Your Laptop

Follow these steps to get the project running on your computer.

## ✅ Prerequisites

Before starting, make sure you have:

1. **Node.js** (version 18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: Open terminal/command prompt and run:
     ```bash
     node --version
     npm --version
     ```

2. **MongoDB** (choose one option)

   **Option A: MongoDB Atlas (Cloud - Easiest, Recommended)**
   - Go to: https://www.mongodb.com/cloud/atlas
   - Sign up for free account
   - Create a free cluster
   - Get your connection string (we'll use this later)

   **Option B: Local MongoDB**
   - Download from: https://www.mongodb.com/try/download/community
   - Install and start MongoDB service
   - Verify: Open terminal and run `mongosh`

## 📦 Step-by-Step Setup

### Step 1: Open Terminal/Command Prompt

- **Windows**: Press `Win + R`, type `cmd` or `powershell`, press Enter
- **Mac**: Press `Cmd + Space`, type `Terminal`, press Enter
- **Linux**: Press `Ctrl + Alt + T`

### Step 2: Navigate to Project Folder

```bash
cd "C:\Users\hv190\OneDrive\Documents\resume analyzer"
```

(Or wherever your project folder is located)

### Step 3: Install Backend Dependencies

```bash
cd backend
npm install
```

Wait for installation to complete (may take 1-2 minutes).

### Step 4: Create Backend Environment File

Create a file named `.env` in the `backend` folder with this content:

**For MongoDB Atlas (Cloud):**
```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/resume_analyzer?retryWrites=true&w=majority"
JWT_SECRET="my-super-secret-jwt-key-change-this-to-something-random-12345"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV=development
OPENAI_API_KEY=""
MAX_FILE_SIZE=5242880
UPLOAD_DIR="./uploads"
```

**For Local MongoDB:**
```env
DATABASE_URL="mongodb://localhost:27017/resume_analyzer"
JWT_SECRET="my-super-secret-jwt-key-change-this-to-something-random-12345"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV=development
OPENAI_API_KEY=""
MAX_FILE_SIZE=5242880
UPLOAD_DIR="./uploads"
```

**Important:**
- Replace `username:password` in DATABASE_URL with your MongoDB Atlas credentials
- Change `JWT_SECRET` to any random string (at least 32 characters)
- Leave `OPENAI_API_KEY` empty for now (optional feature)

### Step 5: Start Backend Server

Keep the terminal open and run:

```bash
npm run dev
```

You should see:
```
✅ MongoDB connected: ...
🚀 Server running on http://localhost:5000
```

**Keep this terminal window open!** The backend needs to keep running.

### Step 6: Open a NEW Terminal Window

Open a second terminal/command prompt window (keep the first one running).

### Step 7: Install Frontend Dependencies

In the new terminal:

```bash
cd "C:\Users\hv190\OneDrive\Documents\resume analyzer\frontend"
npm install
```

Wait for installation to complete.

### Step 8: Start Frontend Server

```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
```

### Step 9: Open in Browser

Open your web browser and go to:
```
http://localhost:3000
```

You should see the login page! 🎉

## 🎯 Testing the Application

1. **Sign Up**: Click "Sign up" and create an account
2. **Login**: Use your credentials to login
3. **Upload Resume**: Go to "Upload Resume" and upload a PDF file
4. **Analyze**: Enter a job description and click "Analyze Resume"
5. **View Results**: See your match percentage and ATS score!

## 🐛 Troubleshooting

### Problem: "Cannot find module" error

**Solution:**
```bash
# Make sure you ran npm install in both folders
cd backend
npm install

cd ../frontend
npm install
```

### Problem: "MongoDB connection error"

**Solution:**
- **For Atlas**: Check your connection string is correct
- **For Local**: Make sure MongoDB is running
  - Windows: Check Services app, look for "MongoDB"
  - Mac/Linux: Run `mongosh` to test connection

### Problem: "Port 5000 already in use"

**Solution:**
- Change PORT in `backend/.env` to another number (e.g., 5001)
- Update `frontend/vite.config.js` proxy target to match

### Problem: "Port 3000 already in use"

**Solution:**
- Vite will automatically use the next available port (3001, 3002, etc.)
- Check the terminal output for the actual port

### Problem: Backend won't start

**Solution:**
- Make sure `.env` file exists in `backend` folder
- Check that all values in `.env` are correct
- Make sure MongoDB connection string is valid

### Problem: Frontend can't connect to backend

**Solution:**
- Make sure backend is running on port 5000
- Check `frontend/vite.config.js` has correct proxy settings
- Make sure both servers are running

## 📝 Quick Commands Reference

**Start Backend:**
```bash
cd backend
npm run dev
```

**Start Frontend:**
```bash
cd frontend
npm run dev
```

**Stop Servers:**
- Press `Ctrl + C` in the terminal window

## 🎓 Next Steps

1. **Add OpenAI API Key** (Optional):
   - Get API key from https://platform.openai.com/
   - Add it to `backend/.env` as `OPENAI_API_KEY="sk-..."`
   - Restart backend server

2. **Test with Real Resume**:
   - Upload your actual resume PDF
   - Try different job descriptions
   - See how the scoring works!

3. **Customize**:
   - Edit skills list in `backend/src/utils/skills.js`
   - Adjust scoring in `backend/src/utils/scoring.js`
   - Modify UI in `frontend/src/App.css`

## 💡 Tips

- **Keep both terminals open** while developing
- **Backend runs on**: http://localhost:5000
- **Frontend runs on**: http://localhost:3000
- **Database**: MongoDB (cloud or local)
- **No need to restart** - Both servers auto-reload on file changes!

---

**Need Help?** Check the error message in the terminal - it usually tells you what's wrong!

