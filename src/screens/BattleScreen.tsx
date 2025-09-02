import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import OceanBackground from '../components/OceanBackground';
import NeptuneCard from '../components/NeptuneCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withGlobalFont } from '../styles/globalStyles';

type BattleScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const BattleScreen: React.FC = () => {
  const navigation = useNavigation<BattleScreenNavigationProp>();
  const insets = useSafeAreaInsets();

  const handleStartBattle = () => {
    navigation.navigate('BattleSetup');
  };

  return (
    <OceanBackground variant="battle">
      <ScrollView 
        style={styles.container}
        contentContainerStyle={[styles.contentContainer, { paddingTop: insets.top }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Battle Mode</Text>
          <Text style={styles.subtitle}>Compete with friends in real-time challenges</Text>
        </View>

        {/* Battle description */}
        <Animated.View style={styles.descriptionContainer} entering={FadeInDown.delay(120)}>
          <Text style={styles.descriptionTitle}>Plank Endurance Duel</Text>
          <Text style={styles.descriptionText}>
            Test your endurance against friends! Who can hold the plank position the longest? 
            Choose your colors, set up players, and let the battle begin!
          </Text>
        </Animated.View>

        {/* Features */}
        <Animated.View style={styles.featuresContainer} entering={FadeInDown.delay(220)}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>👥</Text>
            <Text style={styles.featureText}>Multiple Players</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>⏱️</Text>
            <Text style={styles.featureText}>Real-time Timer</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🏆</Text>
            <Text style={styles.featureText}>Winner Takes All</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🎨</Text>
            <Text style={styles.featureText}>Custom Colors</Text>
          </View>
        </Animated.View>

        {/* Neptune battle card */}
        <NeptuneCard
          title="Enter the Arena"
          description="Challenge your friends to prove who has the strength of Neptune"
          emoji="⚔️"
          variant="large"
          glowing={true}
        />

        {/* Start battle button */}
        <TouchableOpacity 
          style={styles.startBattleButton}
          onPress={handleStartBattle}
          activeOpacity={0.8}
        >
          <Text style={styles.startBattleText}>Start Battle</Text>
        </TouchableOpacity>

        
      </ScrollView>
    </OceanBackground>
  );
};

const styles = withGlobalFont(StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    color: '#FF4444',
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
  descriptionContainer: {
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#FFD700',
    padding: 20,
    marginBottom: 25,
  },
  descriptionTitle: {
    color: '#FF4444',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  descriptionText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  feature: {
    width: '48%',
    backgroundColor: 'rgba(135, 206, 235, 0.1)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFD700',
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  featureText: {
    color: '#87CEEB',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  startBattleButton: {
    backgroundColor: '#FF4444',
    borderRadius: 25,
    paddingVertical: 18,
    paddingHorizontal: 40,
    alignSelf: 'center',
    marginVertical: 20,
    shadowColor: '#FF4444',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
  },
  startBattleText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  backButtonText: {
    fontSize: 24,
  },
}));

export default BattleScreen;
