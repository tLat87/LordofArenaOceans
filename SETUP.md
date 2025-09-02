# Lord of Arena Oceans - Neptune Fitness App

A React Native fitness app with Neptune mythology theme, featuring daily workouts and real-time battle mode.

## Features Implemented

✅ **Daily Neptune Workouts**: Complete push-ups, squats, planks, and more to build power and energy  
✅ **Battle Mode**: Compete with friends on one device in real-time challenges, like the plank endurance duel  
✅ **Progress Profile**: Track your achievements, energy, and rank evolution as you grow stronger every day  
✅ **Epic Ranking System**: Advance through unique stages – Triton, Sailor, Keeper of Waves, Champion of the Ocean, and finally, the Messenger of Neptune  
✅ **Immersive Design**: Dive into a world of ocean-themed visuals with golden armor styling  

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   # For iOS:
   cd ios && pod install && cd ..
   ```

2. **Run the app:**
   ```bash
   # For iOS
   npm run ios
   
   # For Android  
   npm run android
   ```

## App Structure

### Core Features
- **Home Screen**: Greeting, motivation quotes, and quick workout access
- **Workout Screen**: Exercise selection with timer and energy tracking
- **Battle Mode**: Multi-player plank competitions with real-time elimination
- **Profile Screen**: Rank progression, stats, and achievement tracking

### Technical Architecture
- **Redux Store**: Centralized state management for user profile, workouts, and battles
- **Navigation**: Stack and tab navigation with ocean-themed styling
- **Persistence**: AsyncStorage for saving progress between app sessions
- **TypeScript**: Full type safety throughout the application

### Data Flow
1. **Workouts**: Each completed exercise adds energy points (+1 energy per second)
2. **Ranking**: Automatic progression through 5 ranks based on energy levels
3. **Battles**: Real-time plank competitions with player elimination system
4. **Progress**: Persistent tracking of streaks, total workouts, and achievements

## Customization Notes

### Images
Currently using emoji placeholders. To add custom images:
1. Place images in `src/assets/` folders
2. Update component props to use `imageSource` instead of `emoji`
3. Remove emoji fallbacks from components

### Ranks & Thresholds
Modify rank requirements in `src/store/slices/userSlice.ts`:
- Triton: 0 energy
- Sailor: 50 energy  
- Keeper of Waves: 150 energy
- Champion of Ocean: 300 energy
- Messenger of Neptune: 500 energy

### Exercises
Add new workout types in `src/screens/WorkoutScreen.tsx` and update the `ExerciseType` enum in `src/types/index.ts`.

## Battle Mode Usage

1. Navigate to Battle tab
2. Tap "Start Battle" 
3. Configure players (2-6 participants)
4. Assign unique colors to each player
5. Start the plank challenge
6. Eliminate players as they give up
7. Last player standing wins!

## Development Status

All core features are implemented and functional. The app is ready for:
- Native dependency installation (react-native-linear-gradient)
- Custom asset integration
- Additional exercise types
- Achievement system expansion
- Social features (sharing, leaderboards)

Ready to conquer the waves! 🔱


