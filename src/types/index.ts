export interface User {
  name: string;
  avatar: string | null; // Can be emoji string or photo URI
  energy: number;
  rank: UserRank;
  totalWorkouts: number;
  streak: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string; // Changed from Date to string (ISO string)
}

export interface WorkoutSession {
  id: string;
  exerciseType: ExerciseType;
  duration: number;
  completedAt: string; // Changed from Date to string (ISO string)
  energyGained: number;
}

export interface BattleSession {
  id: string;
  players: BattlePlayer[];
  exerciseType: ExerciseType;
  duration: number;
  winner?: string;
  completedAt: string; // Changed from Date to string (ISO string)
}

export interface BattlePlayer {
  id: string;
  name: string;
  avatar: string;
  color: PlayerColor;
  timeHeld: number;
  isActive: boolean;
}

export type ExerciseType = 'pushups' | 'squats' | 'plank' | 'burpees' | 'mountain-climbers';

export type UserRank = 'triton' | 'sailor' | 'keeper-of-waves' | 'champion-of-ocean' | 'messenger-of-neptune';

export type PlayerColor = 'blue' | 'red' | 'green' | 'yellow' | 'purple' | 'orange';

export interface MotivationalQuote {
  text: string;
  author?: string;
}

export interface AppState {
  user: User;
  currentWorkout?: WorkoutSession;
  currentBattle?: BattleSession;
  motivationQuote: MotivationalQuote;
  isFirstLaunch: boolean;
}

