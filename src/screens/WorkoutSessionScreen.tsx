import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { startWorkout, updateTimer, completeWorkout, pauseWorkout, resumeWorkout, cancelWorkout } from '../store/slices/workoutSlice';
import { addEnergy, incrementWorkout } from '../store/slices/userSlice';
import OceanBackground from '../components/OceanBackground';
import Timer from '../components/Timer';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type WorkoutSessionRouteProp = RouteProp<RootStackParamList, 'WorkoutSession'>;

const WorkoutSessionScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<WorkoutSessionRouteProp>();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  
  const { exerciseType } = route.params;
  const { isActive, timer } = useSelector((state: RootState) => state.workout);

  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    // Initialize workout when screen loads
    dispatch(startWorkout(exerciseType as any));
    return () => {
      // Clean up if user leaves without completing
      if (isActive) {
        dispatch(cancelWorkout());
      }
    };
  }, [exerciseType, dispatch]);

  const handleStart = () => {
    setHasStarted(true);
    dispatch(resumeWorkout());
  };

  const handlePause = () => {
    dispatch(pauseWorkout());
  };

  const handleResume = () => {
    dispatch(resumeWorkout());
  };

  const handleComplete = () => {
    Alert.alert(
      'Complete Workout',
      'Are you sure you want to finish this workout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Complete', 
          onPress: () => {
            const energyGained = Math.floor(timer / 1000);
            dispatch(completeWorkout());
            dispatch(addEnergy(energyGained));
            dispatch(incrementWorkout());
            navigation.goBack();
          }
        },
      ]
    );
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Workout',
      'Are you sure you want to cancel this workout? Progress will be lost.',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes', 
          onPress: () => {
            dispatch(cancelWorkout());
            navigation.goBack();
          }
        },
      ]
    );
  };

  const handleTimeUpdate = (time: number) => {
    dispatch(updateTimer(time));
  };

  const getExerciseDisplay = (type: string) => {
    const exercises = {
      'pushups': 'Push-ups',
      'squats': 'Squats',
      'plank': 'Plank',
      'burpees': 'Burpees',
      'mountain-climbers': 'Mountain Climbers',
    };
    return exercises[type as keyof typeof exercises] || type;
  };

  const getEnergyPreview = () => {
    return Math.floor(timer / 1000);
  };

  return (
    <OceanBackground variant="workout">
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.exerciseTitle}>{getExerciseDisplay(exerciseType)}</Text>
          <Text style={styles.instruction}>
            {!hasStarted ? 'Ready to begin?' : isActive ? 'Keep going!' : 'Paused'}
          </Text>
        </View>

        {/* Timer */}
        <Timer
          isActive={isActive}
          onTimeUpdate={handleTimeUpdate}
          variant="workout"
        />

        {/* Energy preview */}
        <View style={styles.energyPreview}>
          <Text style={styles.energyText}>Energy to gain: {getEnergyPreview()}</Text>
        </View>

        {/* Control buttons */}
        <View style={styles.controlsContainer}>
          {!hasStarted ? (
            <TouchableOpacity style={styles.startButton} onPress={handleStart}>
              <Text style={styles.startButtonText}>Start</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.activeControls}>
              <TouchableOpacity 
                style={[styles.controlButton, styles.pauseButton]} 
                onPress={isActive ? handlePause : handleResume}
              >
                <Text style={styles.controlButtonText}>
                  {isActive ? '⏸️' : '▶️'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.controlButton, styles.completeButton]} 
                onPress={handleComplete}
              >
                <Text style={styles.controlButtonText}>✅</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Cancel button */}
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Exercise Instructions:</Text>
          <Text style={styles.instructionsText}>
            Perform the {getExerciseDisplay(exerciseType).toLowerCase()} exercise. 
            The timer will track your session time, and you'll gain 1 energy point per second.
          </Text>
        </View>
      </View>
    </OceanBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginVertical: 30,
  },
  exerciseTitle: {
    color: '#FFD700',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  instruction: {
    color: '#87CEEB',
    fontSize: 18,
    textAlign: 'center',
  },
  energyPreview: {
    alignItems: 'center',
    marginVertical: 20,
  },
  energyText: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: '600',
  },
  controlsContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  startButton: {
    backgroundColor: '#00AA44',
    borderRadius: 50,
    paddingVertical: 20,
    paddingHorizontal: 60,
    shadowColor: '#00AA44',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  activeControls: {
    flexDirection: 'row',
    gap: 30,
  },
  controlButton: {
    borderRadius: 40,
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
  },
  pauseButton: {
    backgroundColor: '#FFD700',
    shadowColor: '#FFD700',
  },
  completeButton: {
    backgroundColor: '#00AA44',
    shadowColor: '#00AA44',
  },
  controlButtonText: {
    fontSize: 28,
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 68, 68, 0.2)',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FF4444',
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignSelf: 'center',
  },
  cancelButtonText: {
    color: '#FF4444',
    fontSize: 16,
    fontWeight: '600',
  },
  instructionsContainer: {
    backgroundColor: 'rgba(135, 206, 235, 0.1)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#87CEEB',
    padding: 20,
    marginBottom: 30,
  },
  instructionsTitle: {
    color: '#87CEEB',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  instructionsText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default WorkoutSessionScreen;


