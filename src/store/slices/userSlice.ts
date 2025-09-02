import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, Achievement, UserRank } from '../../types';

const initialState: User = {
  name: '',
  avatar: null,
  energy: 0,
  rank: 'triton',
  totalWorkouts: 0,
  streak: 0,
  achievements: [],
};

const RANK_THRESHOLDS = {
  triton: 0,
  sailor: 50,
  'keeper-of-waves': 150,
  'champion-of-ocean': 300,
  'messenger-of-neptune': 500,
};

const getRankFromEnergy = (energy: number): UserRank => {
  if (energy >= RANK_THRESHOLDS['messenger-of-neptune']) return 'messenger-of-neptune';
  if (energy >= RANK_THRESHOLDS['champion-of-ocean']) return 'champion-of-ocean';
  if (energy >= RANK_THRESHOLDS['keeper-of-waves']) return 'keeper-of-waves';
  if (energy >= RANK_THRESHOLDS.sailor) return 'sailor';
  return 'triton';
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setUserAvatar: (state, action: PayloadAction<string>) => {
      state.avatar = action.payload;
    },
    addEnergy: (state, action: PayloadAction<number>) => {
      state.energy += action.payload;
      state.rank = getRankFromEnergy(state.energy);
    },
    incrementWorkout: (state) => {
      state.totalWorkouts += 1;
    },
    updateStreak: (state, action: PayloadAction<number>) => {
      state.streak = action.payload;
    },
    unlockAchievement: (state, action: PayloadAction<Achievement>) => {
      const existing = state.achievements.find(a => a.id === action.payload.id);
      if (!existing) {
        state.achievements.push({
          ...action.payload,
          unlocked: true,
          unlockedAt: new Date().toISOString(),
        });
      }
    },
    resetProfile: () => initialState,
    checkOnboarding: (state) => {
      // This will be used to check if user needs onboarding
      return state;
    },
  },
});

export const {
  setUserName,
  setUserAvatar,
  addEnergy,
  incrementWorkout,
  updateStreak,
  unlockAchievement,
  resetProfile,
  checkOnboarding,
} = userSlice.actions;

export default userSlice.reducer;

