import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import OceanBackground from '../components/OceanBackground';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { withGlobalFont } from '../styles/globalStyles';

type WorkoutScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const EXERCISES = [
  {
    id: 'pushups',
    name: 'Push-ups',
    duration: 120, // 2 minutes
  },
  {
    id: 'squats',
    name: 'Squats',
    duration: 120,
  },
  {
    id: 'plank',
    name: 'Plank',
    duration: 120,
  },
];

const WorkoutScreen: React.FC = () => {
  const navigation = useNavigation<WorkoutScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const user = useSelector((state: RootState) => state.user);

  const handleExerciseSelect = (exercise: any) => {
    navigation.navigate('WorkoutStart', { exercise });
  };

  const handleShuffle = () => {
    // Shuffle exercises logic
    console.log('Shuffle exercises');
  };

  return (
    <OceanBackground>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Greeting Banner */}
        <Animated.View style={styles.greetingBanner} entering={FadeInDown.duration(600)}>
          <View style={styles.avatarContainer}>
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
            ) : (
              <Text style={styles.defaultAvatar}>👤</Text>
            )}
          </View>
          <Text style={styles.greetingText}>Greetings, {user.name}</Text>
        </Animated.View>

        {/* Navigation Buttons */}
        <Animated.View style={styles.navButtons} entering={FadeInDown.delay(200)}>
          <TouchableOpacity style={styles.navButton} onPress={() => navigation.goBack()}>
            <Text style={styles.navButtonText}>←</Text>
          </TouchableOpacity>
          
        </Animated.View>

        {/* Exercise Selection Block */}
        <Animated.View style={styles.exerciseBlock} entering={FadeInDown.delay(400)}>
          <Text style={styles.blockTitle}>Choose an exercise:</Text>
          <View style={styles.exerciseButtons}>
            {EXERCISES.map((exercise) => (
              <TouchableOpacity
                key={exercise.id}
                style={styles.exerciseButton}
                onPress={() => handleExerciseSelect(exercise)}
                activeOpacity={0.8}
              >
                <Text style={styles.exerciseButtonText}>{exercise.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Next Button */}
        <Animated.View style={styles.nextButtonContainer} entering={FadeInDown.delay(600)}>
          <TouchableOpacity style={styles.nextButton}>
            <Image source={require('../assets/Group1.png')} style={{marginTop: 30}}/>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </OceanBackground>
  );
};

const styles = withGlobalFont(StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  greetingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(135, 206, 235, 0.9)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    marginTop: 20,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#FFD700',
    overflow: 'hidden',
    marginRight: 15,
  },
  userAvatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  defaultAvatar: {
    fontSize: 30,
    textAlign: 'center',
    lineHeight: 44,
  },
  greetingText: {
    color: '#001122',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  navButton: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  exerciseBlock: {
    backgroundColor: 'rgba(0, 17, 34, 0.8)',
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#FFD700',
    padding: 20,
    marginBottom: 30,
  },
  blockTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  exerciseButtons: {
    gap: 15,
  },
  exerciseButton: {
    backgroundColor: 'rgba(0, 17, 34, 0.9)',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFD700',
    padding: 15,
    alignItems: 'center',
  },
  exerciseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextButtonContainer: {
    alignItems: 'center',
  },
  nextButton: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
}));

export default WorkoutScreen;

