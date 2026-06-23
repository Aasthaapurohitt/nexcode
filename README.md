NexCode — AI-Powered Code Editor


A full-stack MERN application featuring Monaco Editor (VS Code's engine), Google Gemini AI integration, real-time code execution, and a Copilot-style chat sidebar.



✦ Features

FeatureDescriptionMonaco EditorThe same editor engine as VS Code, with syntax highlighting, IntelliSense, and line numbersAI Code CompletionPress Ctrl+Shift+Space to get an AI-generated completion at your cursorBug DetectionSelect code → click "Debug" → get a full bug analysis with fixesCode ExplanationHighlight any snippet and get a plain-English explanationCode OptimizationGet refactored, optimized versions of your code with explanationsAI Chat SidebarCopilot-style chat that's aware of your current file's codeLive Code ExecutionRun Python, JS, TypeScript, Java, C++, Go, Rust in the browser via Piston APIMulti-file ProjectsCreate projects with multiple files and switch between themAuto-saveCode saves automatically 2 seconds after you stop typingUser AuthenticationSecure JWT-based register/login systemCloud ProjectsAll projects saved to MongoDB

🚀 Tech Stack


Frontend: React + TypeScript
Editor: Monaco Editor (@monaco-editor/react)
Backend: Node.js + Express
Database: MongoDB Atlas + Mongoose
AI: Google Gemini API (@google/generative-ai)
Code Execution: Piston API (free, no key needed)
Auth: JWT + bcrypt



⚙️ Setup Instructions

Prerequisites


Node.js 18+
A MongoDB Atlas account (free tier) — mongodb.com/cloud/atlas/register
A Google Gemini API key (free) — aistudio.google.com/apikey


1. Clone & Install

bashgit clone https://github.com/YOUR_USERNAME/nexcode.git
cd nexcode
npm run install:all

2. Set up MongoDB Atlas


Create a free M0 cluster on MongoDB Atlas.
Under Database Access, create a database user with a username/password. Prefer a password with only letters and numbers — symbols like @ or # need URL-encoding (@ → %40) and frequently cause connection errors.
Under Network Access, add 0.0.0.0/0 (allow access from anywhere) for local development.
Click Connect → Drivers and copy the connection string. It looks like:


   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority


Replace <username>/<password> with your real credentials (no angle brackets) and add a database name after .net/, e.g. .net/nexcode?retryWrites=true&w=majority.


3. Get a Gemini API key

Go to aistudio.google.com/apikey, sign in with a Google account, and click Create API key. Copy the key (starts with AIza...).


Note: Google's free tier sometimes shows a quota of 0 requests for brand-new projects until a billing account is linked at console.cloud.google.com/billing. Linking billing does not mean you'll be charged — it's only required by Google to unlock free-tier access on some accounts. You can set a $0 budget alert for peace of mind.



4. Configure Environment Variables

bashcd server
cp .env.example .env

Edit server/.env with your real values:

PORT=5000
MONGODB_URI=mongodb+srv://your_user:your_password@cluster0.xxxxx.mongodb.net/nexcode?retryWrites=true&w=majority
JWT_SECRET=any_long_random_string_you_make_up
GEMINI_API_KEY=AIza...your_real_key
CLIENT_URL=http://localhost:3000

5. Run Development Servers

From the project root:

bashnpm run dev

This starts the backend (port 5000) and frontend (port 3000) concurrently. You should see:

✅ MongoDB connected
🚀 Server running on port 5000

Or run them separately in two terminals:

bashnpm run dev:server
npm run dev:client

6. Open the App

Navigate to http://localhost:3000, sign up for an account, create a project, and start coding.


🏗️ Project Structure

nexcode/
├── client/                   # React frontend
│   └── src/
│       ├── pages/
│       │   ├── Landing.tsx   # Marketing homepage
│       │   ├── AuthPage.tsx  # Login/Register
│       │   ├── Dashboard.tsx # Project management
│       │   └── Editor.tsx    # Main editor page
│       ├── components/
│       │   ├── AIChatSidebar.tsx  # Copilot-style AI chat
│       │   ├── OutputPanel.tsx    # Code execution output
│       │   └── FileTree.tsx       # File browser sidebar
│       ├── context/
│       │   └── AuthContext.tsx    # Auth state management
│       └── types/index.ts         # TypeScript types
│
└── server/                   # Node.js backend
    ├── index.js              # Express app entry
    ├── models/
    │   ├── User.js           # User schema
    │   └── Project.js        # Project & file schema
    ├── routes/
    │   ├── auth.js           # Register, login, me
    │   ├── projects.js       # CRUD for projects
    │   ├── ai.js             # All AI endpoints (Gemini)
    │   └── execute.js        # Code execution (Piston)
    └── middleware/
        └── auth.js           # JWT verification


🤖 AI Endpoints

EndpointDescriptionPOST /api/ai/explainExplain selected codePOST /api/ai/debugFind bugs and suggest fixesPOST /api/ai/optimizeRefactor and optimize codePOST /api/ai/generateGenerate code from a descriptionPOST /api/ai/completeGet cursor-position completionPOST /api/ai/chatMulti-turn chat with code context

All endpoints use the gemini-2.0-flash model via the @google/generative-ai SDK. The model name can be swapped in server/routes/ai.js if you want to try gemini-2.5-flash, gemini-2.0-flash-lite-001, or another available model — run this to see what your API key currently has access to:

bashcurl "https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_KEY"


🎯 Resume Description


"Developed NexCode, an AI-powered code editor with Monaco Editor (VS Code engine), Google Gemini integration for real-time code completion, bug detection, and natural-language code explanations, plus live multi-language code execution — built with React/TypeScript, Node.js/Express, MongoDB Atlas, and JWT authentication."




📦 Deployment

Backend (Render / Railway)


Set the same environment variables from .env in your platform's dashboard.
Build command: npm install
Start command: node index.js
Make sure MongoDB Atlas's Network Access allows connections from your hosting provider's IPs (or keep 0.0.0.0/0 for simplicity).


Frontend (Vercel / Netlify)


Build command: cd client && npm run build
Set REACT_APP_API_URL to your deployed backend URL if not using the dev proxy.
Deploy the client/build folder.



🔑 Keyboard Shortcuts

ShortcutActionCtrl+SSave projectCtrl+Shift+SpaceAI complete at cursor


🛠️ Troubleshooting

ErrorLikely CauseMongooseServerSelectionError: ECONNREFUSED ::1:27017.env still points to localhost instead of your Atlas connection stringquerySrv ECONNREFUSEDDNS can't resolve the Atlas SRV record — try adding require('dns').setServers(['8.8.8.8','1.1.1.1']) near the top of server/index.jsMongoServerError: bad authWrong database username/password, or special characters in the password aren't URL-encodedMongoParseError: option is not supportedMalformed connection string — check for stray ?= or extra & characters[429 Too Many Requests] ... limit: 0Gemini free-tier quota not yet unlocked for your Google Cloud project — link a billing account at console.cloud.google.com/billing (you won't be charged within free limits)First content should be with role 'user', got modelThe chat history sent to Gemini started with an assistant message — server/routes/ai.js strips leading assistant messages before building history
