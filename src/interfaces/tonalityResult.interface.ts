export interface TonalityResult {
  id?: number; // Optional for creation, required for responses
  user?: any; // User relationship - can be User entity or user ID
  dominantTone: string; // e.g., "happy", "sad", "angry", "neutral"
  confidenceScore: number; // 0.0 to 1.0
  toneDescription: string; // Detailed description of the tone
  emotionalRange: string; // e.g., "high", "medium", "low"
  musicalKey?: string; // e.g., "C major", "A minor" (if applicable) - optional
  additionalNotes?: string; // Any other observations - optional
}
