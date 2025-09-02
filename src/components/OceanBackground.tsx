import React from 'react';
import { View, StyleSheet, ImageBackground, ImageSourcePropType } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { BACKGROUND_IMAGE, BACKGROUND_URI, COLORS } from '../config/theme';

interface OceanBackgroundProps {
  children: React.ReactNode;
  variant?: 'default' | 'battle' | 'workout';
}

const OceanBackground: React.FC<OceanBackgroundProps> = ({ 
  children, 
  variant = 'default' 
}) => {
  // Single global image for all screens; you can set the file in src/config/theme.ts
  const getBackground = (): ImageSourcePropType | null => {
    return BACKGROUND_IMAGE as ImageSourcePropType | null;
  };

  const content = (
    <Animated.View style={styles.content} entering={FadeIn.duration(450)}>
      {children}
    </Animated.View>
  );

  let image: ImageSourcePropType | { uri: string } | null = getBackground();
  if (!image && BACKGROUND_URI) {
    image = BACKGROUND_URI as { uri: string };
  }

  if (!image) {
    // Always use photo background now - no color fallbacks
    return <View style={[styles.container, { backgroundColor: COLORS.oceanDeep }]}>{content}</View>;
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <View style={styles.overlay} />
        {content}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  content: {
    flex: 1,
  },
});

export default OceanBackground;
