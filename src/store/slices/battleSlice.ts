import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BattleSession, BattlePlayer, ExerciseType, PlayerColor } from '../../types';

interface BattleState {
  currentBattle?: BattleSession;
  isActive: boolean;
  timer: number;
  completedBattles: BattleSession[];
}

const initialState: BattleState = {
  isActive: false,
  timer: 0,
  completedBattles: [],
};

const battleSlice = createSlice({
  name: 'battle',
  initialState,
  reducers: {
    createBattle: (state, action: PayloadAction<{ 
      players: { name: string; color: PlayerColor }[]; 
      exerciseType: ExerciseType; 
    }>) => {
      const { players, exerciseType } = action.payload;
      state.currentBattle = {
        id: Date.now().toString(),
        players: players.map((player, index) => ({
          id: `player-${index}`,
          name: player.name,
          avatar: 'default-avatar',
          color: player.color,
          timeHeld: 0,
          isActive: true,
        })),
        exerciseType,
        duration: 0,
        completedAt: new Date().toISOString(),
      };
      state.isActive = false;
      state.timer = 0;
    },
    startBattle: (state) => {
      state.isActive = true;
      state.timer = 0;
    },
    updateBattleTimer: (state, action: PayloadAction<number>) => {
      state.timer = action.payload;
      if (state.currentBattle) {
        state.currentBattle.duration = action.payload;
        // Update time for active players
        state.currentBattle.players.forEach(player => {
          if (player.isActive) {
            player.timeHeld = action.payload;
          }
        });
      }
    },
    eliminatePlayer: (state, action: PayloadAction<string>) => {
      if (state.currentBattle) {
        const player = state.currentBattle.players.find(p => p.id === action.payload);
        if (player) {
          player.isActive = false;
        }
        
        // Check if only one player remains
        const activePlayers = state.currentBattle.players.filter(p => p.isActive);
        if (activePlayers.length === 1) {
          state.currentBattle.winner = activePlayers[0].id;
          state.isActive = false;
        }
      }
    },
    pauseBattle: (state) => {
      state.isActive = false;
    },
    resumeBattle: (state) => {
      state.isActive = true;
    },
    completeBattle: (state) => {
      if (state.currentBattle) {
        // Create a new object to avoid mutation issues
        const completedBattle: BattleSession = {
          ...state.currentBattle,
          completedAt: new Date().toISOString(),
        };
        state.completedBattles.push(completedBattle);
      }
      state.isActive = false;
      state.timer = 0;
      state.currentBattle = undefined;
    },
    cancelBattle: (state) => {
      state.isActive = false;
      state.timer = 0;
      state.currentBattle = undefined;
    },
  },
});

export const {
  createBattle,
  startBattle,
  updateBattleTimer,
  eliminatePlayer,
  pauseBattle,
  resumeBattle,
  completeBattle,
  cancelBattle,
} = battleSlice.actions;

export default battleSlice.reducer;