# 🏫 Learning Curve Preschool Chatbot

Complete lead-capture chatbot system for **Learning Curve School, Viman Nagar, Pune**.

## Architecture

```
learning-curve-chatbot/
├── backend/         Node.js + Express API
├── widget/          React chatbot widget (embeddable)
├── dashboard/       React admin panel
└── README.md
```

## Quick Start

### 1. Backend

```bash
cd backend
copy .env.example .env       # Edit with your real keys
npm install
node server.js               # Runs on http://localhost:3001
```

### 2. Chat Widget

```bash
cd widget
npm install
npm run dev                  # Runs on http://localhost:5173
```

### 3. Admin Dashboard

```bash
cd dashboard
npm install
npm run dev                  # Runs on http://localhost:5174
```

Default admin password: `admin123` (change via `VITE_ADMIN_PASSWORD` env var)

---

## Database Setup (Supabase)

Run this SQL in your Supabase SQL Editor:

```sql
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  child_age_group TEXT,
  program_interest TEXT,
  visit_preference TEXT,
  inquiry_type TEXT DEFAULT 'visit',
  status TEXT DEFAULT 'new',
  conversation JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for filtering
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_program ON leads(program_interest);
CREATE INDEX idx_leads_created ON leads(created_at DESC);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow all operations via service key
CREATE POLICY "Allow all for service" ON leads
  FOR ALL USING (true) WITH CHECK (true);
```

---

## Environment Variables

### Backend (`backend/.env`)
| Variable | Description |
|---|---|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_KEY` | Supabase anon/service key |
| `RESEND_API_KEY` | Resend email API key |
| `ADMIN_EMAIL` | Email to receive lead notifications |
| `ADMIN_API_KEY` | Secret key to protect admin endpoints |
| `ADMIN_PASSWORD` | Admin dashboard login password |
| `PORT` | Server port (default: 3001) |
| `ALLOWED_ORIGINS` | Comma-separated allowed CORS origins |
| `OLLAMA_BASE_URL` | Optional: Ollama URL for AI responses |
| `OLLAMA_MODEL` | Optional: Ollama model name (default: llama3) |

### Widget (`widget/.env`)
```
VITE_API_URL=http://localhost:3001
```

### Dashboard (`dashboard/.env`)
```
VITE_API_URL=http://localhost:3001
VITE_ADMIN_API_KEY=your-secret-admin-api-key
VITE_ADMIN_PASSWORD=admin123
```

---

## Embed on Any Website

Build the widget and host the output:

```bash
cd widget
npm run build
```

Then add to any website:
```html
<script src="https://your-domain.com/widget.js"></script>
```

---

## Deployment

### Frontend (Vercel)
1. Push `widget/` and `dashboard/` to GitHub
2. Import each into Vercel as separate projects
3. Set environment variables in Vercel dashboard

### Backend (Railway)
1. Push `backend/` to GitHub
2. Import into Railway
3. Set environment variables
4. Railway auto-detects Node.js and runs `npm start`

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/chat` | Process chat step | None |
| `POST` | `/api/leads` | Create new lead | None |
| `GET` | `/api/leads` | List leads (filters) | API Key |
| `PUT` | `/api/leads/:id` | Update lead status | API Key |
| `GET` | `/api/analytics` | Dashboard analytics | API Key |
| `GET` | `/api/health` | Health check | None |

---

## Optional: AI Responses with Ollama

For free-form parent questions, install [Ollama](https://ollama.com):

```bash
ollama pull llama3
ollama serve
```

The chatbot will auto-detect Ollama and use it for questions outside the guided flow. If Ollama isn't running, it gracefully falls back to "Our team will call you."
