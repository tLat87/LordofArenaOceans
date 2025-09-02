import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, Easing } from 'react-native-reanimated';
import { withGlobalFont } from '../styles/globalStyles';

interface TimerProps {
  isActive: boolean;
  onTimeUpdate: (time: number) => void;
  initialTime?: number;
  variant?: 'workout' | 'battle';
}

const Timer: React.FC<TimerProps> = ({
  isActive,
  onTimeUpdate,
  initialTime = 0,
  variant = 'workout',
}) => {
  const [time, setTime] = useState(initialTime);
  const glow = useSharedValue(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      glow.value = withRepeat(withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }), -1, true);
      interval = setInterval(() => {
        setTime(prevTime => {
          const newTime = prevTime + 10; // Update every 10ms for smooth animation
          onTimeUpdate(newTime);
          return newTime;
        });
      }, 10);
    } else if (!isActive && time !== 0) {
      glow.value = withTiming(0, { duration: 300 });
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, time, onTimeUpdate]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);

    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const timerStyle = [
    styles.timer,
    variant === 'battle' && styles.battleTimer,
  ];

  const textStyle = [
    styles.timerText,
    variant === 'battle' && styles.battleTimerText,
  ];

  const animatedGlow = useAnimatedStyle(() => ({
    shadowOpacity: 0.4 + glow.value * 0.4,
    shadowRadius: 8 + glow.value * 12,
  }));

  return (
    <Animated.View style={[timerStyle, animatedGlow]}>
      <Text style={textStyle}>{formatTime(time)}</Text>
    </Animated.View>
  );
};

const styles = withGlobalFont(StyleSheet.create({
  timer: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderWidth: 2,
    borderColor: '#FFD700',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  battleTimer: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderColor: '#FF4444',
  },
  timerText: {
    color: '#FFD700',
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  battleTimerText: {
    color: '#FF4444',
    fontSize: 28,
  },
}));

export default Timer;
