import { GoogleGenerativeAI } from '@google/generative-ai';
import { UserProfile } from './types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export class GeminiService {
  private model;

  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
  }

  async generateHarshReminder(userProfile: UserProfile): Promise<string> {
    try {
      const {
        biggestDream,
        biggestSetback,
        emotionalBreakdown,
        whatKeepsGoing,
        motivationStyle = 'tough-love',
        currentBehavior,
      } = userProfile;

      const prompt = `You are a harsh but caring motivational coach in the style of David Goggins. Your job is to create tough-love reminders that push people to overcome their past setbacks and achieve their dreams. Be direct, brutally honest, but ultimately supportive. Reference their specific struggles and dreams to make it personal.

Generate a harsh but motivating reminder for someone with this background:

Dream: ${biggestDream}
Biggest Setback: ${biggestSetback}
Emotional Breakdown: ${emotionalBreakdown}
What Keeps Them Going: ${whatKeepsGoing}
${currentBehavior ? `Current Behavior: ${currentBehavior}` : ''}

The reminder should:
1. Call out their setback directly
2. Remind them of their dream
3. Push them to take action NOW
4. Be ${motivationStyle === 'tough-love' ? 'harsh and direct' : 'encouraging but firm'}
5. Be 2-3 sentences max
6. Feel like it comes from someone who cares but won't let them make excuses

Keep it real, keep it raw. Don't use any asterisks or formatting - just plain text.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return text.trim();
    } catch (error) {
      console.error('Gemini AI Error:', error);
      throw new Error('Failed to generate reminder');
    }
  }

  async generateCheckInPrompt(userProfile: UserProfile): Promise<string> {
    try {
      const prompt = `You are a tough but caring accountability coach. Generate a brief check-in question that challenges the user to reflect on their progress toward their dream.

User's dream: ${userProfile.biggestDream}
User's setback: ${userProfile.biggestSetback}

Generate ONE powerful check-in question (max 15 words) that makes them think about whether they're really doing the work. Don't use any asterisks or formatting - just plain text.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return text.trim();
    } catch (error) {
      console.error('Gemini AI Error:', error);
      throw new Error('Failed to generate check-in prompt');
    }
  }

  getFallbackReminder(userProfile: UserProfile): string {
    const fallbackReminders = [
      `Remember ${userProfile.biggestDream}? ${userProfile.biggestSetback} doesn't define you. Get up and do the work.`,
      `You said you wouldn't let ${userProfile.emotionalBreakdown} stop you again. Prove it. Right now.`,
      `${userProfile.whatKeepsGoing} is counting on you to show up. Don't disappoint yourself.`,
      `Every second you waste thinking about ${userProfile.biggestSetback} is a second stolen from ${userProfile.biggestDream}. Stop thinking. Start doing.`,
      `${userProfile.emotionalBreakdown} broke you once. Will you let it break you again? Or will you get up and fight for ${userProfile.biggestDream}?`,
    ];

    return fallbackReminders[Math.floor(Math.random() * fallbackReminders.length)];
  }

  getFallbackCheckInPrompt(): string {
    const fallbackPrompts = [
      "Did you do everything you could today to get closer to your dream?",
      "Are you making excuses or making progress?",
      "What did you do today that your future self will thank you for?",
      "Did you show up today, or did you let yourself down?",
    ];

    return fallbackPrompts[Math.floor(Math.random() * fallbackPrompts.length)];
  }
}
