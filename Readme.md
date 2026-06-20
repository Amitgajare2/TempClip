# TempClip

A realtime clipboard sharing tool. Create a temporary room, get a 6-digit code, and instantly sync text, links, and code snippets across any device or browser — no account required.

![TempClip Demo](https://dl.dropbox.com/scl/fi/uqluo37pfcbbh3mi1mokz/unnamed.gif?rlkey=bxk9aj2f99q1t444nyop5pfwn&st=1cdh1nas&dl=0)

---

## How It Works

1. Open the app and click **Start Sharing** to create a new session
2. A unique 6-digit code is generated for your room
3. Share that code with anyone — they enter it in the **Join** tab
4. Everyone in the room sees live updates as you type or paste
5. The session auto-expires after **10 minutes** and all content is wiped

---

## Features

- **No login** — completely anonymous, zero friction
- **Realtime sync** — powered by WebSockets (Socket.IO), updates appear instantly for all connected users
- **Live user count** — see how many people are currently in your session
- **Countdown timer** — each session shows exactly how much time is left
- **Auto-expiry** — sessions are deleted from the database after expiry, keeping data ephemeral
- **Exit button** — leave a session cleanly at any time
- **Responsive** — works on desktop, tablet, and mobile

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, React Router v7 |
| Realtime | Socket.IO (client + server) |
| HTTP Client | Axios |
| Backend | Node.js, Express 5 |
| Database | MongoDB (Mongoose) |
| Dev Server | Nodemon |

---

## Project Structure

```
├── backend/                  # Express + Socket.IO server
│   ├── models/
│   │   └── Session.js        # Mongoose session schema
│   ├── routes/
│   │   └── sessionRoutes.js  # REST API routes
│   ├── sockets/
│   │   └── socket.js         # Socket.IO event handlers
│   ├── utils/
│   │   ├── cleanup.js        # Periodic expired session cleanup
│   │   └── sessionHelpers.js # Shared session lookup logic
│   ├── server.js             # App entry point
│   ├── test-integration.js   # Integration tests
│   └── .env                  # Backend environment variables
│
└── TempClip/                 # React frontend (Vite)
    └── src/
        ├── pages/
        │   ├── Home.jsx       # Landing page with FAQ
        │   ├── Code.jsx       # Create / Join tabs
        │   └── Session.jsx    # Live clipboard session
        ├── components/
        │   ├── Navbar.jsx
        │   └── Footer.jsx
        └── services/
            ├── api.js         # Axios instance
            └── socket.js      # Socket.IO client instance
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB](https://www.mongodb.com/) running locally (or a connection URI)

---

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/Amitgajare2/TempClip.git
cd tempclip
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder:

```env
MONGO_URI=mongodb://localhost:27017/clipboard
PORT=5000
```

### 3. Set up the frontend

```bash
cd ../TempClip
npm install
```

The frontend proxies API and socket requests to `http://localhost:5000` via the Vite config — no additional frontend `.env` needed for local development.

---

## Running the App

You need two terminals running at the same time.

**Terminal 1 — Backend:**

```bash
cd backend
npm run dev
```

The server starts on `http://localhost:5000`.

**Terminal 2 — Frontend:**

```bash
cd TempClip
npm run dev
```

The frontend starts on `http://localhost:5173` (or the next available port). Open that URL in your browser.

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/session/create` | Creates a new session, returns session data with a 6-digit code |
| `POST` | `/api/session/join` | Validates a session code exists and hasn't expired |
| `GET` | `/api/session/:code` | Fetches session data by code |

### Socket.IO Events

**Client → Server**

| Event | Payload | Description |
|---|---|---|
| `join-session` | `code` | Join a session room |
| `leave-session` | `code` | Leave a session room cleanly |
| `clipboard-change` | `{ code, data }` | Broadcast a clipboard update |

**Server → Client**

| Event | Payload | Description |
|---|---|---|
| `clipboard-update` | `data` | New clipboard content from the room |
| `online-users` | `count` | Updated user count in the session |
| `error-message` | `message` | Session not found or other errors |

---

## Running Tests

Integration tests spin up real HTTP and socket connections against a running backend. Make sure the backend is running on port `5000`, then:

```bash
cd backend
npm test
```

Tests cover:
- Creating a session and verifying the returned code
- Joining an existing session
- Fetching session data by code
- Rejecting an invalid or expired code (404)
- Live clipboard sync between two socket clients

---

## Production Build

To build the frontend for production:

```bash
cd TempClip
npm run build
```

The output is in `TempClip/dist/`. Serve it with any static host or configure your Express server to serve it directly. Make sure `MONGO_URI` and `PORT` are set in the backend environment.

---

## Author

Built by **Amit Gajare** and **Coffee**
