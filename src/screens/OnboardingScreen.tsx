import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { launchImageLibrary, ImagePickerResponse, MediaType } from 'react-native-image-picker';
import { useDispatch } from 'react-redux';
import { setUserName, setUserAvatar } from '../store/slices/userSlice';
import OceanBackground from '../components/OceanBackground';
import NeptuneCard from '../components/NeptuneCard';
import OnboardingStoryScreen from './OnboardingStoryScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { withGlobalFont } from '../styles/globalStyles';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  
  const [currentScreen, setCurrentScreen] = useState(0);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Story screens data - you can replace imageSource with your actual image paths
  const storyScreens = [
    {
      title: "Welcome to my Arena, mortal!",
      description: "I am Neptune, the lord of the seas and your personal trainer. Together we will temper body and spirit.",
      imageSource: require('../assets/man/1.png'), // Replace with your image path: require('../assets/onboarding/neptune-welcome.png')
    },
    {
      title: "Every day I will give you exercises:",
      description: "Do them and pump up your profile, gain the power of the ocean!",
      imageSource: require('../assets/man/2.png'),  // Replace with your image path: require('../assets/onboarding/neptune-exercises.png')
    },
    {
      title: "Want to test your strength?",
      description: "Challenge your friends to a battle! Whoever holds the plank the longest will conquer the wave and earn my respect.",
      imageSource:  require('../assets/man/3.png'), // Replace with your image path: require('../assets/onboarding/neptune-battle.png')
    },
    {
      title: "Your progress shapes your legend.",
      description: "With each workout, you become stronger. Begin your journey and prove that you are a worthy warrior of the ocean!",
      imageSource:  require('../assets/man/4.png'), // Replace with your image path: require('../assets/onboarding/neptune-progress.png')
    },
  ];

  const handleNext = () => {
    if (currentScreen < storyScreens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      setCurrentScreen(storyScreens.length); // Move to profile setup
    }
  };

  const handleComplete = () => {
    if (!name.trim()) {
      Alert.alert('Name Required', 'Please enter your name to continue.');
      return;
    }
    
    if (!agreedToTerms) {
      Alert.alert('Terms Required', 'Please agree to the terms to continue.');
      return;
    }

    // Always update name and avatar, even if they're the same
    dispatch(setUserName(name.trim()));
    dispatch(setUserAvatar(avatar));
    onComplete();
  };

  const handleImagePicker = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets[0]) {
        const source = { uri: response.assets[0].uri };
        setAvatar(response.assets[0].uri || null);
      }
    });
  };

  // Show story screens first
  if (currentScreen < storyScreens.length) {
    const story = storyScreens[currentScreen];
    return (
      <OnboardingStoryScreen
        title={story.title}
        description={story.description}
        imageSource={story.imageSource}
        onNext={handleNext}
        isLast={currentScreen === storyScreens.length - 1}
      />
    );
  }

  // Show profile setup screen
  return (
    <OceanBackground>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Animated.View style={styles.content} entering={FadeInDown.duration(600)}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Welcome to Neptune's Arena</Text>
            <Text style={styles.subtitle}>Set up your warrior profile</Text>
          </View>

          {/* Profile Picture Section */}
          <Animated.View style={styles.profileSection} entering={FadeInDown.delay(200)}>
            <Text style={styles.sectionTitle}>Choose Your Photo</Text>
            <TouchableOpacity style={styles.avatarFrame} onPress={handleImagePicker}>
              {avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarPlaceholderText}>📷</Text>
                  <Text style={styles.avatarPlaceholderSubtext}>Tap to add photo</Text>
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* Name Input */}
          <Animated.View style={styles.inputSection} entering={FadeInDown.delay(400)}>
            <Text style={styles.sectionTitle}>Your Warrior Name</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.nameInput}
                placeholder="Enter your name"
                placeholderTextColor="#87CEEB"
                value={name}
                onChangeText={setName}
                maxLength={20}
              />
            </View>
          </Animated.View>

          {/* Terms Agreement */}
          <Animated.View style={styles.termsSection} entering={FadeInDown.delay(600)}>
            <TouchableOpacity 
              style={styles.checkboxContainer}
              onPress={() => setAgreedToTerms(!agreedToTerms)}
            >
              <View style={[styles.checkbox, agreedToTerms && styles.checkedBox]}>
                {agreedToTerms && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.termsText}>
                I agree that the application is not responsible for any possible damages
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Complete Button */}
          <Animated.View style={styles.buttonSection} entering={FadeInDown.delay(800)}>
            <TouchableOpacity 
              style={[styles.completeButton, (!name.trim() || !agreedToTerms) && styles.disabledButton]}
              onPress={handleComplete}
              disabled={!name.trim() || !agreedToTerms}
            >
              <Text style={styles.completeButtonText}>Begin Your Journey</Text>
            </TouchableOpacity>
          </Animated.View>
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
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    color: '#FFD700',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    color: '#87CEEB',
    fontSize: 16,
    textAlign: 'center',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  sectionTitle: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  avatarFrame: {
    width: 120,
    height: 120,
    borderWidth: 3,
    borderColor: '#FFD700',
    borderRadius: 15,
    backgroundColor: 'rgba(0, 17, 34, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPlaceholderText: {
    fontSize: 40,
    marginBottom: 5,
  },
  avatarPlaceholderSubtext: {
    color: '#87CEEB',
    fontSize: 12,
    textAlign: 'center',
  },
  inputSection: {
    marginBottom: 30,
  },
  inputContainer: {
    borderWidth: 2,
    borderColor: '#FFD700',
    borderRadius: 12,
    backgroundColor: 'rgba(0, 17, 34, 0.8)',
  },
  nameInput: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  termsSection: {
    marginBottom: 40,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#FFD700',
    borderRadius: 4,
    backgroundColor: 'rgba(0, 17, 34, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkedBox: {
    backgroundColor: '#FFD700',
  },
  checkmark: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  termsText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  buttonSection: {
    alignItems: 'center',
  },
  completeButton: {
    backgroundColor: '#FFD700',
    borderRadius: 25,
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderWidth: 2,
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    borderColor: 'rgba(255, 215, 0, 0.5)',
  },
  completeButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
}));

export default OnboardingScreen;
