import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import OceanBackground from '../components/OceanBackground';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut, useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { withGlobalFont } from '../styles/globalStyles';

type WorkoutCountdownScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;
type WorkoutCountdownScreenRouteProp = RouteProp<RootStackParamList, 'WorkoutCountdown'>;

const WorkoutCountdownScreen: React.FC = () => {
  const navigation = useNavigation<WorkoutCountdownScreenNavigationProp>();
  const route = useRoute<WorkoutCountdownScreenRouteProp>();
  const insets = useSafeAreaInsets();
  const { exercise } = route.params;
  
  const [countdown, setCountdown] = useState(3);
  const scale = useSharedValue(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigation.navigate('WorkoutTimer', { exercise });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigation, exercise]);

  useEffect(() => {
    scale.value = withSpring(1.2, { damping: 8, stiffness: 100 });
    scale.value = withTiming(1, { duration: 800 });
  }, [countdown]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <OceanBackground>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Animated.View style={[styles.countdownContainer, animatedStyle]}>
          <Animated.Text 
            key={countdown}
            style={styles.countdownText}
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
          >
            {countdown}
          </Animated.Text>
        </Animated.View>
      </View>
    </OceanBackground>
  );
};

const styles = withGlobalFont(StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownText: {
    fontSize: 120,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
}));

export default WorkoutCountdownScreen;
