import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image } from 'react-native';
import OceanBackground from '../components/OceanBackground';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withGlobalFont } from '../styles/globalStyles';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface OnboardingStoryScreenProps {
  title: string;
  description: string;
  imageSource: any;
  onNext: () => void;
  isLast?: boolean;
}

const OnboardingStoryScreen: React.FC<OnboardingStoryScreenProps> = ({
  title,
  description,
  imageSource,
  onNext,
  isLast = false,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {imageSource ? (
        <ImageBackground 
          source={imageSource} 
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.overlay} />
          <View style={[styles.content]}>
            <Animated.View style={styles.textContainer} entering={FadeInDown.delay(400)}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.description}>{description}</Text>
            </Animated.View>

            <Animated.View style={styles.buttonContainer} entering={FadeInDown.delay(600)}>
              <TouchableOpacity style={styles.nextButton} onPress={onNext}>
              <Image source={require('../assets/Group1.png')}  />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </ImageBackground>
      ) : (
        <OceanBackground>
          <View style={[styles.content, { paddingTop: insets.top }]}>
            <Animated.View style={styles.placeholderContainer} entering={FadeInDown.delay(200)}>
              <Text style={styles.placeholderText}>🔱</Text>
              <Text style={styles.placeholderSubtext}>Neptune's Image</Text>
            </Animated.View>

            <Animated.View style={styles.textContainer} entering={FadeInDown.delay(400)}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.description}>{description}</Text>
            </Animated.View>

            <Animated.View style={styles.buttonContainer} entering={FadeInDown.delay(600)}>
              <TouchableOpacity style={styles.nextButton} onPress={onNext}>
                <Image source={require('../assets/Group1.png')}  />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </OceanBackground>
      )}
    </View>
  );
};

const styles = withGlobalFont(StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    // backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  content: {
    // flex: 1,
    position: 'absolute',
    
    bottom: 100,
    // justifyContent: 'space-between',
    // paddingHorizontal: 20,
    paddingVertical: 40,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 80,
    marginBottom: 10,
  },
  placeholderSubtext: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
  },
  textContainer: {
    backgroundColor: 'rgba(4, 25, 46, 0.61)',
    // borderRadius: 20,

    borderTopWidth: 3,
    borderBottomWidth: 3,
    borderColor: '#FFD700',
    padding: 25,
    // marginHorizontal: 10,
  },
  title: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 30,
  },
  description: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'SuezOne-Regular',
  },
  buttonContainer: {
    alignItems: 'center',
    paddingTop: 20,
  },
  nextButton: {


    alignItems: 'center',

    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
  },
  nextButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  arrowIcon: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
}));

export default OnboardingStoryScreen;
