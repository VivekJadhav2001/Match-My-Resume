# ⚡ Match My Resume — Chrome Extension

A Chrome Extension that scores your resume against any Job Description on the web in real time, powered by **Groq (LLaMA 3.1)** and a local Node.js backend.

---

## How It Works

1. **Upload your resume** (PDF) once via the extension popup.
2. **Highlight any Job Description** text on any webpage (LinkedIn, Naukri, etc.).
3. A **"⚡ Check Score"** tooltip appears — click it.
4. Within seconds, you get an **ATS Match Score (%)** and a list of **missing keywords** to improve your resume.

---

## Project Structure

```
├── chrome-extension/         # The Chrome Extension (Manifest V3)
│   ├── manifest.json         # Extension config & permissions
│   ├── content.js            # Injected into web pages — handles text selection & tooltip UI
│   ├── background.js         # Service worker — communicates with the backend API
│   └── src/
│       └── App.jsx           # React popup UI (upload resume, view score & keywords)
│
└── server/                   # Local Node.js backend
    └── server.js               # Groq API integration (LLaMA 3.1 scoring logic)
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Extension | Chrome MV3, Vanilla JS, React (Popup) |
| Backend | Node.js, Express |
| AI Model | Groq API — `llama-3.1-8b-instant` |
| Storage | `chrome.storage.local` (resume + score cache) |

---

## Setup & Installation

### Prerequisites

- Node.js (v18+)
- A [Groq API Key](https://console.groq.com/)
- Chrome browser

---

### 1. Clone the Repository

```bash
git clone https://github.com/VivekJadhav2001/Match-My-Resume.git
cd resume-jd-matcher
```

---

### 2. Set Up the Backend Server

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Start the server:

```bash
node index.js
```

The server runs on **`http://localhost:3000`** by default.

> Make sure the server is running whenever you use the extension.

---

### 3. Load the Chrome Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer Mode** (toggle in the top right)
3. Click **"Load unpacked"**
4. Select the `chrome-extension/` folder

The ⚡ Resume Matcher icon will appear in your toolbar.

---

### 4. Build the Popup (React)

If you've made changes to `App.jsx`, rebuild the popup:

```bash
cd chrome-extension
npm install
npm run build
```

---

## Usage

1. Click the ⚡ extension icon in your toolbar.
2. Upload your resume PDF using the **"📄 Upload Resume"** button.
3. Navigate to any job listing (LinkedIn, Indeed, company careers page, etc.).
4. **Select / highlight** the job description text on the page.
5. Click the **"⚡ Check Score"** tooltip that appears.
6. View your **ATS score** and **missing keywords** — both in the tooltip and the popup.

---

## Scoring Logic

The AI evaluates your resume with an **encouraging, holistic approach**:

- **Foundation over exact match** — Knowing JavaScript implies React/Vue potential.
- **Synonym-aware** — "Team Lead" = "Management", "Frontend" = "UI Development".
- **55% floor** — Candidates with relevant experience are never unfairly penalized.
- **Missing Keywords** — 3–5 specific terms that would improve your ranking.

Score color coding in the popup:

| Score | Color | Meaning |
|---|---|---|
| > 75% | 🟢 Green | Strong match |
| 50–75% | 🟡 Yellow | Moderate match |
| < 50% | 🔴 Red | Low match |

---

## API Reference

### `POST /getResumeScore`

**Request** — `multipart/form-data`

| Field | Type | Description |
|---|---|---|
| `resume` | File (PDF) | Your resume file |
| `jd` | String | The job description text |

**Response** — JSON

```json
{
  "score": 78,
  "missingKeywords": ["Docker", "CI/CD", "System Design"],
  "encouragement": "Your strong backend experience is a great foundation for this role."
}
```

---

## Permissions

| Permission | Reason |
|---|---|
| `storage` | Persist resume PDF and last ATS score locally |
| `activeTab` | Access the current tab for content script injection |
| `scripting` | Inject `content.js` into job listing pages |
| `https://*/*` | Run on all HTTPS websites |
| `http://localhost:3000/*` | Communicate with the local backend server |

---

## Notes

- Your resume is stored **locally** in `chrome.storage.local` — it never leaves your machine except when sent to your own local server.
- The backend calls the **Groq API** (external), so an internet connection is required for scoring.
- The tooltip auto-dismisses after **15 seconds** following a successful score.

---

## License

MIT
