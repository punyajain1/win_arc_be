import { GoogleGenerativeAI } from '@google/generative-ai';
import { UserProfile } from './types';

export class GeminiService {
  private model;

  constructor() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
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

      const prompt = `You are a Winter Arc big brother - a ruthless accountability partner who genuinely cares but refuses to let people make excuses. You know their entire story, their pain, their dreams, and you're here to slap them back to reality when they're slipping.

Your communication style:
- Direct, raw, no sugarcoating
- Call out bullshit immediately
- Use their own story against their excuses
- Make them feel the gap between who they are and who they want to be
- Short, punchy, memorable (like a text from an older brother)
- Sound human, not like a motivational poster

USER'S STORY:
Dream: ${biggestDream}
Past Failure: ${biggestSetback}
Lowest Point: ${emotionalBreakdown}
Why They Keep Fighting: ${whatKeepsGoing}
${currentBehavior ? `What They're Doing RIGHT NOW: ${currentBehavior}` : ''}

Generate a harsh wake-up call that:
1. Calls them out on wasting time or slipping
2. Throws their own story back at them
3. Makes them feel accountable to ${whatKeepsGoing}
4. Reminds them ${biggestSetback} already happened - do they want it to happen again?
5. Ends with a direct command to take action NOW

Style: ${motivationStyle === 'tough-love' ? 'Brutal and unfiltered like David Goggins' : 'Firm but encouraging like a drill sergeant who cares'}

Keep it 2-3 sentences MAX. Sound like a real person texting, not an AI. No asterisks, no formatting, no fluff.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return text.trim();
    } catch (error) {
      console.error('Gemini AI Error:', error);
      throw new Error('Failed to generate reminder');
    }
  }

  async generateScreenTimeWarning(userProfile: UserProfile, screenTimeMinutes: number, appName: string): Promise<string> {
    try {
      const prompt = `You are their Winter Arc big brother. They've been wasting ${screenTimeMinutes} minutes on ${appName} today.

Their dream: ${userProfile.biggestDream}
Their past failure: ${userProfile.biggestSetback}
What keeps them going: ${userProfile.whatKeepsGoing}

Generate a SHORT, BRUTAL wake-up call (1-2 sentences) that:
- Calls out the screen time waste directly
- Connects it to their bigger failure pattern
- Makes them feel the opportunity cost (what they COULD be doing instead)
- Sounds like an angry but caring older brother texting them

No asterisks, no formatting. Just raw truth.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return text.trim();
    } catch (error) {
      console.error('Gemini AI Error:', error);
      throw new Error('Failed to generate screen time warning');
    }
  }

  async generateCheckInPrompt(userProfile: UserProfile): Promise<string> {
    try {
      const prompt = `You are their Winter Arc big brother checking in. They've had a full day.

Their dream: ${userProfile.biggestDream}
Their past failure: ${userProfile.biggestSetback}

Generate ONE powerful question (10-15 words max) that:
- Challenges them to be honest about their day
- Makes them think about whether they actually did the work
- Feels personal, not generic
- Sounds like a real person asking, not a corporate wellness app

No asterisks, no formatting.`;

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
    const harsh = [
      `You already failed once at ${userProfile.biggestSetback}. Are you really gonna let it happen again? ${userProfile.whatKeepsGoing} deserves better than this version of you.`,
      `${userProfile.emotionalBreakdown} broke you. Now you're here, wasting time again. Your dream of ${userProfile.biggestDream} is slipping away while you scroll. Get up.`,
      `You told yourself ${userProfile.whatKeepsGoing} was worth fighting for. Then why are you here instead of working? Move. Now.`,
      `Every minute you waste is another step away from ${userProfile.biggestDream} and another step closer to ${userProfile.biggestSetback} happening again. Choose.`,
      `${userProfile.whatKeepsGoing} is watching. ${userProfile.biggestDream} is waiting. ${userProfile.biggestSetback} is laughing. What are you gonna do about it?`,
    ];

    return harsh[Math.floor(Math.random() * harsh.length)];
  }

  getFallbackCheckInPrompt(): string {
    const prompts = [
      "Did you actually do the work today or just think about it?",
      "Be honest - did today get you closer or did you waste it?",
      "Would your future self be proud of what you did today?",
      "Did you show up or did you make excuses?",
      "What did you do today that actually moved the needle?",
    ];

    return prompts[Math.floor(Math.random() * prompts.length)];
  }

  getFallbackScreenTimeWarning(screenTimeMinutes: number, appName: string): string {
    const warnings = [
      `${screenTimeMinutes} minutes on ${appName}? That's ${screenTimeMinutes} minutes you'll never get back. Was it worth it?`,
      `You've been on ${appName} for ${screenTimeMinutes} minutes. Your dreams don't scroll themselves into reality. Get off.`,
      `${screenTimeMinutes} minutes wasted on ${appName}. Meanwhile, your competition is working. Think about that.`,
      `Stop. ${screenTimeMinutes} minutes on ${appName} is ${screenTimeMinutes} minutes you're not grinding. This is how you fail again.`,
    ];

    return warnings[Math.floor(Math.random() * warnings.length)];
  }
  async generateDailyQuote(userProfile: UserProfile): Promise<string> {
    try {
      const moviesAndModels = `${userProfile.inspiringMovies || ''}, ${userProfile.roleModels || ''}`.trim();
      
      const prompt = `Generate a powerful, motivational quote that feels like it came from one of these sources: ${moviesAndModels}.

The quote should:
- Sound authentic to the movie/person mentioned
- Be 1-2 sentences maximum
- Include attribution (e.g., "- Rocky Balboa" or "- David Goggins")
- Be brutally honest and motivating
- Relate to overcoming challenges and pushing through adversity

User's context:
Dream: ${userProfile.biggestDream}
Past setback: ${userProfile.biggestSetback}

Just return the quote with attribution. Nothing else.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Error generating daily quote:', error);
      throw error;
    }
  }

  getFallbackQuote(): string {
    const quotes = [
      "It ain't about how hard you hit. It's about how hard you can get hit and keep moving forward. - Rocky Balboa",
      "You want something, go get it. Period. - Chris Gardner",
      "The only person who was going to turn my life around was me. - David Goggins",
      "Get busy living, or get busy dying. - Andy Dufresne",
      "What we do in life echoes in eternity. - Maximus",
      "Every man dies, not every man really lives. - William Wallace",
      "Why do we fall? So we can learn to pick ourselves up. - Alfred",
      "I hated every minute of training, but I said, 'Don't quit. Suffer now and live the rest of your life as a champion.' - Muhammad Ali",
    ];
    
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    return quotes[dayOfYear % quotes.length];
  }
}
