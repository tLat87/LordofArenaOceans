import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Animated, { FadeInUp, FadeOutDown, withTiming, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { withGlobalFont } from '../styles/globalStyles';

interface NeptuneCardProps {
  title: string;
  description?: string;
  imageSource?: any; // Made optional for now
  onPress?: () => void;
  variant?: 'default' | 'large' | 'compact';
  glowing?: boolean;
  emoji?: string; // Added emoji prop as placeholder for images
}

const NeptuneCard: React.FC<NeptuneCardProps> = ({
  title,
  description,
  imageSource,
  onPress,
  variant = 'default',
  glowing = false,
  emoji = '🔱', // Default Neptune emoji
}) => {
  const containerStyle = [
    styles.container,
    variant === 'large' && styles.largeContainer,
    variant === 'compact' && styles.compactContainer,
    glowing && styles.glowing,
  ];

  const imageStyle = [
    styles.image,
    variant === 'large' && styles.largeImage,
    variant === 'compact' && styles.compactImage,
  ];

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(scale.value, { duration: 120 }) }],
  }));

  const Card = (
    <Animated.View style={[containerStyle, animatedStyle]} entering={FadeInUp.duration(400)} exiting={FadeOutDown.duration(250)}>
      <View style={styles.border}>
        <View style={styles.innerContainer}>
          <View style={imageStyle}>
            <Image source={require('../assets/man/1.png')} style={styles.image}/>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            {description && (
              <Text style={styles.description}>{description}</Text>
            )}
          </View>
        </View>
      </View>
    </Animated.View>
  );

  if (onPress) {
    return (
      <TouchableOpacity 
        onPress={() => {
          scale.value = 0.97;
          setTimeout(() => {
            scale.value = 1;
            onPress?.();
          }, 100);
        }} 
        activeOpacity={0.9}
      >
        {Card}
      </TouchableOpacity>
    );
  }

  return Card;
};

const styles = withGlobalFont(StyleSheet.create({
  container: {
    margin: 10,
  },
  largeContainer: {
    margin: 15,
  },
  compactContainer: {
    margin: 5,
  },
  border: {
    borderWidth: 3,
    borderColor: '#FFD700',
    borderRadius: 15,
    padding: 3,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  glowing: {
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 15,
  },
  innerContainer: {
    backgroundColor: 'rgba(0, 17, 34, 0.9)',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
    // marginBottom: 10,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  largeImage: {
    width: 120,
    height: 120,
    marginBottom: 15,
  },
  compactImage: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  emoji: {
    fontSize: 40,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  description: {
    color: '#87CEEB',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
}));

export default NeptuneCard;
