# Winter Arc AI Backend

AI-powered harsh motivational reminders backend using Google Gemini AI.

## Features

- Generate personalized harsh motivational reminders based on user's story
- Create tailored daily check-in prompts
- TypeScript for type safety
- Express.js REST API
- Google Gemini AI integration
- Fallback responses when AI fails

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Add your Gemini API key to `.env`:
```
GEMINI_API_KEY=your_api_key_here
PORT=3000
```

Get your Gemini API key from: https://makersuite.google.com/app/apikey

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Production

```bash
npm start
```

## API Endpoints

### GET `/health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "Winter Arc AI Backend is running"
}
```

### POST `/api/generate-reminder`
Generate a personalized harsh motivational reminder.

**Request Body:**
```json
{
  "userProfile": {
    "biggestDream": "To build a successful startup",
    "biggestSetback": "Lost everything in 2024",
    "emotionalBreakdown": "Everyone left me alone",
    "whatKeepsGoing": "I need to prove them wrong",
    "motivationStyle": "tough-love",
    "currentBehavior": "Wasting time on social media"
  }
}
```

**Response:**
```json
{
  "reminder": "Lost everything in 2024 and now you're scrolling Instagram? Your dream of building a successful startup won't happen while you're wasting time. Everyone left you alone - prove them wrong by doing the work, not by scrolling.",
  "timestamp": "2025-11-22T10:30:00.000Z",
  "fallback": false
}
```

### POST `/api/generate-checkin-prompt`
Generate a personalized daily check-in question.

**Request Body:**
```json
{
  "userProfile": {
    "biggestDream": "To build a successful startup",
    "biggestSetback": "Lost everything in 2024"
  }
}
```

**Response:**
```json
{
  "prompt": "Did you build your startup today or make more excuses?",
  "timestamp": "2025-11-22T10:30:00.000Z",
  "fallback": false
}
```

## Deployment

### Vercel

```bash
vercel deploy
```

### Railway

```bash
railway up
```

### Render

Connect your GitHub repo and deploy.

## Environment Variables

- `GEMINI_API_KEY` - Your Google Gemini AI API key
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
