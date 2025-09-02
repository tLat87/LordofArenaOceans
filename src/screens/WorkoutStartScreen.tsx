import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import OceanBackground from '../components/OceanBackground';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { withGlobalFont } from '../styles/globalStyles';

type WorkoutStartScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;
type WorkoutStartScreenRouteProp = RouteProp<RootStackParamList, 'WorkoutStart'>;

const WorkoutStartScreen: React.FC = () => {
  const navigation = useNavigation<WorkoutStartScreenNavigationProp>();
  const route = useRoute<WorkoutStartScreenRouteProp>();
  const insets = useSafeAreaInsets();
  const { exercise } = route.params;

  const handleNext = () => {
    navigation.navigate('WorkoutCountdown', { exercise });
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

        {/* Instruction Banner */}
        <Animated.View style={styles.instructionBanner} entering={FadeInDown.delay(400)}>
          <View style={styles.neptuneAvatar}>
            <Text style={styles.neptuneEmoji}>👑</Text>
          </View>
          <Text style={styles.instructionText}>
            You have {Math.floor(exercise.duration / 60)} minutes for this exercise, get ready!
          </Text>
        </Animated.View>

        {/* Next Button */}
        <Animated.View style={styles.nextButtonContainer} entering={FadeInDown.delay(600)}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Image source={require('../assets/Group1.png')} style={{marginBottom: 30}}/>
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
  instructionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(135, 206, 235, 0.9)',
    borderRadius: 15,
    padding: 20,
    marginVertical: 50,
  },
  neptuneAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#FFD700',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  neptuneEmoji: {
    fontSize: 30,
  },
  instructionText: {
    color: '#001122',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    lineHeight: 24,
  },
  nextButtonContainer: {
    alignItems: 'center',
    marginBottom: 50,
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

export default WorkoutStartScreen;
