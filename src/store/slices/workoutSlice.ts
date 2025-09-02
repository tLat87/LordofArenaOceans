import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WorkoutSession, ExerciseType } from '../../types';

interface WorkoutState {
  currentSession?: WorkoutSession;
  isActive: boolean;
  timer: number;
  completedSessions: WorkoutSession[];
}

const initialState: WorkoutState = {
  isActive: false,
  timer: 0,
  completedSessions: [],
};

const workoutSlice = createSlice({
  name: 'workout',
  initialState,
  reducers: {
    startWorkout: (state, action: PayloadAction<ExerciseType>) => {
      state.currentSession = {
        id: Date.now().toString(),
        exerciseType: action.payload,
        duration: 0,
        completedAt: new Date().toISOString(),
        energyGained: 0,
      };
      state.isActive = true;
      state.timer = 0;
    },
    updateTimer: (state, action: PayloadAction<number>) => {
      state.timer = action.payload;
      if (state.currentSession) {
        state.currentSession.duration = action.payload;
      }
    },
    completeWorkout: (state) => {
      if (state.currentSession) {
        const energyGained = Math.floor(state.timer / 1000); // 1 energy per second
        state.currentSession.energyGained = energyGained;
        state.currentSession.completedAt = new Date().toISOString();
        state.completedSessions.push(state.currentSession);
      }
      state.isActive = false;
      state.timer = 0;
      state.currentSession = undefined;
    },
    pauseWorkout: (state) => {
      state.isActive = false;
    },
    resumeWorkout: (state) => {
      state.isActive = true;
    },
    cancelWorkout: (state) => {
      state.isActive = false;
      state.timer = 0;
      state.currentSession = undefined;
    },
  },
});

export const {
  startWorkout,
  updateTimer,
  completeWorkout,
  pauseWorkout,
  resumeWorkout,
  cancelWorkout,
} = workoutSlice.actions;

export default workoutSlice.reducer;

