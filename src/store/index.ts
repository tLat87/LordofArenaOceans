import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';
import userSlice from './slices/userSlice';
import workoutSlice from './slices/workoutSlice';
import battleSlice from './slices/battleSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['user', 'workout'], // Only persist user and workout data
};

const rootReducer = combineReducers({
  user: userSlice,
  workout: workoutSlice,
  battle: battleSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

// Typing note: use the pre-persisted rootReducer to avoid PersistPartial leakage in selectors
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
