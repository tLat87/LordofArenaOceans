import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import OceanBackground from '../components/OceanBackground';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { withGlobalFont } from '../styles/globalStyles';

type WorkoutPausedScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;
type WorkoutPausedScreenRouteProp = RouteProp<RootStackParamList, 'WorkoutPaused'>;

const WorkoutPausedScreen: React.FC = () => {
  const navigation = useNavigation<WorkoutPausedScreenNavigationProp>();
  const route = useRoute<WorkoutPausedScreenRouteProp>();
  const insets = useSafeAreaInsets();
  const { exercise, timeLeft } = route.params;

  const handleResume = () => {
    navigation.navigate('WorkoutTimer', { exercise, timeLeft });
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

        {/* Pause Indicator */}
        <Animated.View style={styles.pauseContainer} entering={FadeInDown.delay(200)}>
          <View style={styles.pauseBox}>
            <Text style={styles.pauseText}>Pause</Text>
          </View>
        </Animated.View>

        {/* Play Button */}
        <Animated.View style={styles.playButtonContainer} entering={FadeInDown.delay(400)}>
          <TouchableOpacity style={styles.playButton} onPress={handleResume}>
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
  pauseContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseBox: {
    width: 200,
    height: 200,
    backgroundColor: 'rgba(0, 17, 34, 0.9)',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  playButtonContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  playButton: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(0, 17, 34, 0.9)',
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonText: {
    fontSize: 30,
    color: '#FFFFFF',
  },
}));

export default WorkoutPausedScreen;
