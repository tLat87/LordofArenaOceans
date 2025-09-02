import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import OceanBackground from '../components/OceanBackground';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { withGlobalFont } from '../styles/globalStyles';

type WorkoutTimerScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;
type WorkoutTimerScreenRouteProp = RouteProp<RootStackParamList, 'WorkoutTimer'>;

const WorkoutTimerScreen: React.FC = () => {
  const navigation = useNavigation<WorkoutTimerScreenNavigationProp>();
  const route = useRoute<WorkoutTimerScreenRouteProp>();
  const insets = useSafeAreaInsets();
  const { exercise } = route.params;
  
  const [timeLeft, setTimeLeft] = useState(exercise.duration);
  const [isActive, setIsActive] = useState(true);
  
  const glow = useSharedValue(0);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            // Navigate to completion screen or back to home
            navigation.navigate('Home');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isActive, timeLeft, navigation]);

  useEffect(() => {
    if (isActive) {
      glow.value = withRepeat(
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else {
      glow.value = withTiming(0, { duration: 300 });
    }
  }, [isActive]);

  const animatedGlowStyle = useAnimatedStyle(() => ({
    shadowOpacity: glow.value * 0.8,
    shadowRadius: glow.value * 15,
  }));

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePause = () => {
    navigation.navigate('WorkoutPaused', { exercise, timeLeft });
  };

  return (
    <OceanBackground>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Back Button */}
        <Animated.View style={styles.backButtonContainer} entering={FadeInDown.duration(600)}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Timer Display */}
        <Animated.View 
          style={[styles.timerContainer, animatedGlowStyle]} 
          entering={FadeInDown.delay(200)}
        >
          <View style={styles.timerBox}>
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
          </View>
        </Animated.View>

        {/* Pause Button */}
        <Animated.View style={styles.pauseButtonContainer} entering={FadeInDown.delay(400)}>
          <TouchableOpacity style={styles.pauseButton} onPress={handlePause}>
            <Text style={styles.pauseButtonText}>⏸</Text>
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
    justifyContent: 'space-between',
  },
  backButtonContainer: {
    alignItems: 'flex-start',
    marginTop: 20,
  },
  backButton: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
  },
  timerBox: {
    width: 200,
    height: 200,
    backgroundColor: 'rgba(0, 17, 34, 0.9)',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  pauseButtonContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  pauseButton: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(0, 17, 34, 0.9)',
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseButtonText: {
    fontSize: 30,
    color: '#FFFFFF',
  },
}));

export default WorkoutTimerScreen;
