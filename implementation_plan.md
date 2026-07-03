# Implementation Plan - "Plan B" Social Wellness Platform

"Plan B" is an AI-powered social discovery and wellness platform designed to combat loneliness and build meaningful connections. It includes features inspired by Bumble BFF, Meetup, Discord, Spotify's recommendation engine, and AI wellness companions.

---

## Technical Stack & Architecture

### 1. Frontend
*   **Framework:** React (Vite)
*   **Styling:** Tailwind CSS (v3 or v4) + CSS Variables (Glassmorphism, custom palettes)
*   **Animations:** Framer Motion (page transitions, card hovers, loading skeleton states, modal popups)
*   **Icons:** Lucide React
*   **Charts:** Recharts (Mood trends, weekly activity metrics)
*   **State Management:** React Context API + LocalStorage for seamless local persistence and session handling

### 2. Backend
*   **Framework:** FastAPI (Python) for high-performance, asynchronous endpoints
*   **Database ORM:** SQLAlchemy with SQLite for reliable local data persistence (storing users, profiles, mood check-ins, events, chats, matches, community posts)
*   **AI Integration:** OpenAI API for personalized matching, conversational assistant, and automated icebreaker generation, equipped with a fallback AI simulator if OpenAI keys are not provided
*   **Authentication:** JWT Token Auth with Password hashing (bcrypt)
*   **Server:** Uvicorn

### 3. Database Schema (SQLite)
*   `Users`: ID, Email, Hashed Password, Created At
*   `Profiles`: User ID, Name, Age, Gender, City, Bio, Occupation, University, Interests (JSON array), Hobbies (JSON array), Favorite Activities (JSON array), Languages (JSON array), Profile Picture URL, Latitude, Longitude
*   `Moods`: ID, User ID, Mood emoji/name, Note, Date (Timestamp)
*   `Events`: ID, Title, Description, Date, Time, Location, Host ID, Category (Gaming, Movies, etc.), Max Participants
*   `EventParticipants`: Event ID, User ID, Status (Joined)
*   `Communities`: ID, Name, Description, Cover Image, Category, Creator ID
*   `CommunityMembers`: Community ID, User ID
*   `CommunityPosts`: ID, Community ID, Author ID, Title, Content, Created At, Likes (JSON list of user IDs)
*   `CommunityComments`: ID, Post ID, Author ID, Content, Created At
*   `Chats`: ID, Sender ID, Receiver ID, Message, Timestamp
*   `Matches`: ID, User A ID, User B ID, Score, Mutual Interests (JSON), Distance, Status (Connected, Blocked, Reported)

---

## Design System & Theme

*   **Primary Palette:** Slate Gray (`#0F172A` as slate-900)
*   **Secondary Accent:** Sky Blue (`#60A5FA` as blue-400)
*   **Accent Red/Coral:** Soft Coral (`#FF6B6B`)
*   **Background:** Clean Slate (`#F8FAFC` as slate-50)
*   **Effects:**
    *   *Glassmorphism:* `bg-white/70 backdrop-blur-md border border-white/20`
    *   *Soft Shadows:* `shadow-xl shadow-slate-100/50` or `shadow-2xl shadow-blue-500/5`
    *   *Typography:* Google Fonts "Outfit" or "Inter"
    *   *Dark Mode:* Toggleable theme switching using Tailwind's `dark:` classes (`dark:bg-slate-950 dark:text-slate-100`)

---

## User Review Required

> [!IMPORTANT]
> **Database Structure**: I have designed the platform to run with a local SQLite database managed by FastAPI, which will contain full persistence for profiles, posts, chats, and moods. This ensures the platform can run 100% locally out-of-the-box. If you prefer to integrate directly with a cloud Appwrite instance right away, please provide your Appwrite API Endpoint, Project ID, and API keys. Otherwise, the code will be structured cleanly to transition to Appwrite easily when ready.

> [!NOTE]
> **AI API Keys**: The OpenAI AI Matching, Wellness Assistant, and Icebreaker Generator will utilize OpenAI API. If no `OPENAI_API_KEY` is present in the backend environment, it will automatically fallback to a highly realistic mock generator using structured heuristics (matching shared tags, calculating geographic distance using Haversine formula, and replying to wellness chats using a smart heuristic parser).

---

## Proposed Folder Structure

```
Plan_B/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py             # FastAPI App definition
│   │   ├── config.py           # Settings and ENV variables
│   │   ├── database.py         # SQLAlchemy Setup
│   │   ├── models.py           # Database models
│   │   ├── schemas.py          # Pydantic schemas
│   │   ├── auth.py             # User JWT authentication helpers
│   │   ├── ai.py               # OpenAI service + Heuristic fallback matcher/assistant
│   │   └── routers/
│   │       ├── auth.py         # Login, register, profile
│   │       ├── profile.py      # Location detection + Profile management
│   │       ├── moods.py        # Mood logging and history
│   │       ├── matching.py     # Match algorithm and Icebreaker generation
│   │       ├── events.py       # Creating, joining, browsing events
│   │       ├── community.py    # Group creation, posts, likes, comments
│   │       └── chat.py         # Direct messaging socket or poll endpoints
│   ├── requirements.txt        # Backend dependencies
│   └── run.py                  # Startup script for Backend
├── frontend/
│   ├── src/
│   │   ├── assets/             # Images, static media
│   │   ├── components/         # Reusable premium components (Navbar, Sidebar, GlassCard, Button, etc.)
│   │   ├── context/            # AuthContext, ThemeContext, ChatContext
│   │   ├── pages/              # /landing, /login, /signup, /profile, /dashboard, /discover, /matches, /events, /event-details, /community, /chat, /wellness, /assistant, /settings
│   │   ├── services/           # Axios API connectors
│   │   ├── App.jsx             # React routes definition
│   │   ├── index.css           # Styling directives, gradients, animations
│   │   └── main.jsx            # Entry point
│   ├── package.json            # Frontend node packages
│   ├── vite.config.js          # Vite config
│   └── tailwind.config.js      # Tailwind customization
└── README.md                   # Setup guides
```

---

## Proposed Changes

### Backend Component

Implement a comprehensive FastAPI application that handles:
1.  **Authentication**: Register, login, parse JWT, handle Google OAuth mock/login.
2.  **Profiles**: Edit name, age, gender, occupation, interests, bio, location detection (via IP geo api or browser coords mock).
3.  **Mood Engine**: Save daily mood metrics, calculate historic averages, output mood history chart arrays.
4.  **AI Assistant**: Contextual chatbot replying with matching nearby events/people/suggestions based on mood text.
5.  **AI Matcher**: Distance calculations (Haversine formula), shared tags check, mood compatibility score.
6.  **Events & Communities**: Database crud for post creations, event creation/joining, post comments/likes.
7.  **Chat**: Simple REST poll or WebSockets for real-time connection chat.
8.  **Safety**: Moderation filter on posts, blocking profile API, reporting event/profile API.

#### [NEW] [main.py](file:///c:/Users/Ishan/OneDrive/Desktop/Plan_B/backend/app/main.py)
#### [NEW] [models.py](file:///c:/Users/Ishan/OneDrive/Desktop/Plan_B/backend/app/models.py)
#### [NEW] [database.py](file:///c:/Users/Ishan/OneDrive/Desktop/Plan_B/backend/app/database.py)
#### [NEW] [auth.py](file:///c:/Users/Ishan/OneDrive/Desktop/Plan_B/backend/app/auth.py)
#### [NEW] [ai.py](file:///c:/Users/Ishan/OneDrive/Desktop/Plan_B/backend/app/ai.py)
#### [NEW] [requirements.txt](file:///c:/Users/Ishan/OneDrive/Desktop/Plan_B/backend/requirements.txt)

---

### Frontend Component

1.  **Design Tokens & CSS**: Configure Tailwind CSS with the brand colors (`slate-900`, `blue-400`, `accent-coral`), custom glassmorphic utilities (`bg-white/70 backdrop-blur-md`), and import the google font.
2.  **Navigation**: Implement a consistent sidebar/navbar layout. On desktop, a sleek floating glass sidebar. On mobile, a bottom navigation bar.
3.  **Routing**: Establish all 14 screens:
    *   `/` - Cinematic Landing page with floating nodes, interactive cards, pricing, reviews, stats.
    *   `/login` / `/signup` - Elegant glass login with Google auth option.
    *   `/profile` - Wizard flow for setting bio, interests list tags, photo (with nice default placeholders), and current location detection.
    *   `/dashboard` - Metric panels (connections, attended events, score out of 100), interactive mood charts (Recharts) and recent activities.
    *   `/discover` / `/matches` - Tinder-like or grid cards showing compatibilities, distance, tags, with buttons to generate AI Icebreakers and start chats.
    *   `/events` / `/event-details` - Filter events by category (gaming, football, cafe) and click to view host, attendees, maps.
    *   `/community` - Discord-like text feeds where users can switch between channels (Gamers, Fitness, Books), create posts, comment, and like.
    *   `/chat` - Split screen listing active friends on the left and full conversation chat panel on the right.
    *   `/wellness` - Mood log history, weekly wellness charts, and daily suggestions.
    *   `/assistant` - A beautiful chat UI interface where users talk to their AI Social Companion.
    *   `/settings` - Edit parameters, switch Dark Mode, toggle Safety/Block filters.

#### [NEW] [package.json](file:///c:/Users/Ishan/OneDrive/Desktop/Plan_B/frontend/package.json)
#### [NEW] [tailwind.config.js](file:///c:/Users/Ishan/OneDrive/Desktop/Plan_B/frontend/tailwind.config.js)
#### [NEW] [index.css](file:///c:/Users/Ishan/OneDrive/Desktop/Plan_B/frontend/src/index.css)
#### [NEW] [App.jsx](file:///c:/Users/Ishan/OneDrive/Desktop/Plan_B/frontend/src/App.jsx)
#### [NEW] [All Page Components](file:///c:/Users/Ishan/OneDrive/Desktop/Plan_B/frontend/src/pages/)

---

## Verification Plan

### Automated Verification
*   We will run a script to start the FastAPI server on port `8000` and the React frontend on port `5173`.
*   We will write basic test requests (using python or shell curl) to verify backend auth, match, and assistant responses.
*   We can use the `browser_subagent` to navigate through key application paths: Registering a user, configuring a profile, checking in a mood, browsing matches, talking to the assistant, and joining an event.

### Manual Verification
*   We will provide the user with commands to run the project locally (e.g. standard `npm install` and `npm run dev`, and backend setup).
*   The dashboard graphs will render mock database content using `recharts` for visual confirmation.
