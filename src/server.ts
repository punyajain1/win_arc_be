import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GeminiService } from './gemini.service';
import {
  ReminderRequest,
  ReminderResponse,
  CheckInPromptRequest,
  CheckInPromptResponse,
  ErrorResponse,
} from './types';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini Service
const geminiService = new GeminiService();

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Winter Arc AI Backend is running' });
});

// Generate harsh motivational reminder
app.post('/api/generate-reminder', async (req: Request<{}, {}, ReminderRequest>, res: Response<ReminderResponse | ErrorResponse>) => {
  try {
    const { userProfile } = req.body;

    if (!userProfile) {
      res.status(400).json({ error: 'User profile is required' });
      return;
    }

    let reminder: string;
    let fallback = false;

    try {
      reminder = await geminiService.generateHarshReminder(userProfile);
    } catch (error) {
      console.error('AI generation failed, using fallback');
      reminder = geminiService.getFallbackReminder(userProfile);
      fallback = true;
    }

    res.json({
      reminder,
      timestamp: new Date().toISOString(),
      ...(fallback && { fallback: true }),
    });
  } catch (error) {
    console.error('Error generating reminder:', error);
    res.status(500).json({
      error: 'Failed to generate reminder',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Generate daily check-in prompt based on user's story
app.post('/api/generate-checkin-prompt', async (req: Request<{}, {}, CheckInPromptRequest>, res: Response<CheckInPromptResponse | ErrorResponse>) => {
  try {
    const { userProfile } = req.body;

    if (!userProfile) {
      res.status(400).json({ error: 'User profile is required' });
      return;
    }

    let prompt: string;
    let fallback = false;

    try {
      prompt = await geminiService.generateCheckInPrompt(userProfile);
    } catch (error) {
      console.error('AI generation failed, using fallback');
      prompt = geminiService.getFallbackCheckInPrompt();
      fallback = true;
    }

    res.json({
      prompt,
      timestamp: new Date().toISOString(),
      ...(fallback && { fallback: true }),
    });
  } catch (error) {
    console.error('Error generating check-in prompt:', error);
    res.status(500).json({
      error: 'Failed to generate check-in prompt',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.listen(PORT, () => {
  console.log(`🔥 Winter Arc AI Backend running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
