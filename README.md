# NexCode — AI-Powered Code Editor

> A full-stack MERN application featuring Monaco Editor (VS Code's engine), Claude AI integration, real-time code execution, and a Copilot-style chat sidebar.

## ✦ Features

| Feature | Description |
|---|---|
| **Monaco Editor** | The same editor engine as VS Code, with syntax highlighting, IntelliSense, and line numbers |
| **AI Code Completion** | Press `Ctrl+Shift+Space` to get an AI-generated completion at your cursor |
| **Bug Detection** | Select code → click "Debug" → get a full bug analysis with fixes |
| **Code Explanation** | Highlight any snippet and get a plain-English explanation |
| **Code Optimization** | Get refactored, optimized versions of your code with explanations |
| **AI Chat Sidebar** | Copilot-style chat that's aware of your current file's code |
| **Live Code Execution** | Run Python, JS, TypeScript, Java, C++, Go, Rust in the browser via Piston API |
| **Multi-file Projects** | Create projects with multiple files and switch between them |
| **Auto-save** | Code saves automatically 2 seconds after you stop typing |
| **User Authentication** | Secure JWT-based register/login system |
| **Cloud Projects** | All projects saved to MongoDB |

## 🚀 Tech Stack

- **Frontend**: React + TypeScript
- **Editor**: Monaco Editor (`@monaco-editor/react`)
- **Backend**: Node.js + Express
- **Database**: MongoDB + Mongoose
- **AI**: Anthropic Claude API (`claude-sonnet-4-6`)
- **Code Execution**: Piston API (free, no key needed)
- **Auth**: JWT + bcrypt

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas)
- Anthropic API key (get one at [console.anthropic.com](https://console.anthropic.com))

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd nexcode-ai-editor
npm run install:all
```

### 2. Configure Environment

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nexcode
JWT_SECRET=your_very_long_random_secret_key_here
ANTHROPIC_API_KEY=sk-ant-api03-...your-key-here
CLIENT_URL=http://localhost:3000
```

### 3. Run Development Servers

From the root directory:
```bash
npm run dev
```

This starts both the backend (port 5000) and frontend (port 3000) concurrently.

Or run them separately:
```bash
# Terminal 1 - Backend
npm run dev:server

# Terminal 2 - Frontend  
npm run dev:client
```

### 4. Open the App

Navigate to **http://localhost:3000**

---

## 🏗️ Project Structure

```
nexcode-ai-editor/
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
    │   ├── ai.js             # All AI endpoints (Claude)
    │   └── execute.js        # Code execution (Piston)
    └── middleware/
        └── auth.js           # JWT verification
```

---

## 🤖 AI Endpoints

| Endpoint | Description |
|---|---|
| `POST /api/ai/explain` | Explain selected code |
| `POST /api/ai/debug` | Find bugs and suggest fixes |
| `POST /api/ai/optimize` | Refactor and optimize code |
| `POST /api/ai/generate` | Generate code from a description |
| `POST /api/ai/complete` | Get cursor-position completion |
| `POST /api/ai/chat` | Multi-turn chat with code context |

---

## 🎯 Resume Description

> "Developed NexCode, an AI-powered code editor web application featuring Monaco Editor (VS Code engine), real-time code execution across 7 languages, and Claude AI integration for code completion, bug detection, and natural language explanations. Built with React/TypeScript frontend, Node.js/Express REST API, MongoDB for cloud project storage, and JWT authentication."

---

## 📦 Deployment

### Backend (Render / Railway)
1. Set environment variables in your platform
2. Set build command: `npm install`
3. Set start command: `node index.js`

### Frontend (Vercel / Netlify)
1. Build: `cd client && npm run build`
2. Set `REACT_APP_API_URL` if not using proxy
3. Deploy the `client/build` folder

---

## 🔑 Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl+S` | Save project |
| `Ctrl+Shift+Space` | AI complete at cursor |
