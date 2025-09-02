import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, Image } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootState } from '../store';
import { RootStackParamList } from '../navigation/AppNavigator';
import OceanBackground from '../components/OceanBackground';
import NeptuneCard from '../components/NeptuneCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withGlobalFont } from '../styles/globalStyles';

const MOTIVATIONAL_QUOTES = [
  "Today you are stronger than yesterday.",
  "The ocean's power flows through you.",
  "Neptune believes in your strength.",
  "Each workout brings you closer to greatness.",
  "Channel the fury of the waves.",
];

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const user = useSelector((state: RootState) => state.user);
  
  const todayQuote = MOTIVATIONAL_QUOTES[new Date().getDay() % MOTIVATIONAL_QUOTES.length];

  const handleShare = async () => {
    try {
      await Share.share({
        message: `I'm training with Neptune and reached ${user.energy} energy points! Join me in Lord of Arena Oceans!`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const getRankDisplay = (rank: string) => {
    const rankNames = {
      'triton': 'Triton',
      'sailor': 'Sailor', 
      'keeper-of-waves': 'Keeper of Waves',
      'champion-of-ocean': 'Champion of the Ocean',
      'messenger-of-neptune': 'Messenger of Neptune',
    };
    return rankNames[rank as keyof typeof rankNames] || 'Triton';
  };

  return (
    <OceanBackground>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={[styles.contentContainer, { paddingTop: insets.top }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with greeting */}
        <View style={styles.header}>
          <View style={styles.greetingContainer}>
            <View style={styles.greetingCard}>
              <View style={styles.avatarContainer}>
                {user.avatar ? (
                  <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
                ) : (
                  <Text style={styles.defaultAvatar}>👤</Text>
                )}
              </View>
              <Text style={styles.greetingText}>Greetings, {user.name}</Text>
            </View>
            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <Text style={styles.shareIcon}>📤</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* User stats */}
        <Animated.View style={styles.statsContainer} entering={FadeInDown.delay(120)}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.energy}</Text>
            <Text style={styles.statLabel}>Energy</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{getRankDisplay(user.rank)}</Text>
            <Text style={styles.statLabel}>Rank</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.streak}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
        </Animated.View>

        {/* Motivation for the day */}
        <Animated.View style={styles.motivationContainer} entering={FadeInDown.delay(220)}>
          <Text style={styles.motivationTitle}>Motivation for the day:</Text>
          <Text style={styles.motivationText}>{todayQuote}</Text>
          <TouchableOpacity style={styles.shareMotivationButton} onPress={handleShare}>
            <Text style={styles.shareIcon}>📤</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Neptune training card */}
        <NeptuneCard
          title="Start training with Neptune now."
          emoji="🔱"
          variant="large"
          glowing={true}
        />

        {/* Quick action button */}
        <TouchableOpacity 
          style={styles.startButton}
          onPress={() => navigation.navigate('Workout')}
        >
          <Image source={require('../assets/Group1.png')}/>
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
    marginBottom: 20,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greetingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#FFD700',
    padding: 15,
    flex: 1,
    marginRight: 15,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FFD700',
    overflow: 'hidden',
    marginRight: 15,
  },
  userAvatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  defaultAvatar: {
    fontSize: 30,
    textAlign: 'center',
    lineHeight: 46,
  },
  greetingText: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  shareButton: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  shareIcon: {
    fontSize: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#FFD700',
    padding: 20,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#87CEEB',
    fontSize: 12,
    marginTop: 5,
  },
  motivationContainer: {
    backgroundColor: 'rgba(135, 206, 235, 0.1)',
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#FFD700',
    padding: 20,
    marginBottom: 20,
    position: 'relative',
  },
  motivationTitle: {
    color: '#87CEEB',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  motivationText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 26,
  },
  shareMotivationButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(135, 206, 235, 0.2)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 35,
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderWidth: 3,
    borderColor: '#FFD700',
    marginTop: 20,
  },
  startButtonIcon: {
    fontSize: 24,
  },
}));

export default HomeScreen;
