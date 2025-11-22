export interface UserProfile {
  biggestDream: string;
  biggestSetback: string;
  emotionalBreakdown: string;
  whatKeepsGoing: string;
  motivationStyle: 'tough-love' | 'encouraging' | 'balanced';
  currentBehavior?: string;
  inspiringMovies?: string;
  roleModels?: string;
  distractingApps?: string;
  dailyScreenTimeLimit?: number;
}

export interface ReminderRequest {
  userProfile: UserProfile;
}

export interface ReminderResponse {
  reminder: string;
  timestamp: string;
  fallback?: boolean;
}

export interface CheckInPromptRequest {
  userProfile: UserProfile;
}

export interface CheckInPromptResponse {
  prompt: string;
  timestamp: string;
  fallback?: boolean;
}

export interface ErrorResponse {
  error: string;
  message?: string;
}
