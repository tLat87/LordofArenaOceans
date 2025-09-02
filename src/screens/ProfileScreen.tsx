import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { BattleSession, WorkoutSession } from '../types';
import { resetProfile } from '../store/slices/userSlice';
import OceanBackground from '../components/OceanBackground';
import NeptuneCard from '../components/NeptuneCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withGlobalFont } from '../styles/globalStyles';

const ProfileScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const user = useSelector((state: RootState) => state.user);
  const workoutHistory = useSelector((state: RootState) => state.workout.completedSessions);
  const battleHistory = useSelector((state: RootState) => state.battle.completedBattles);
  const dispatch = useDispatch();

  const getRankInfo = (rank: string) => {
    const ranks = {
      'triton': {
        name: 'Triton',
        description: 'Novice of the Seas',
        nextRank: 'Sailor',
        energyRequired: 50,
        color: '#87CEEB',
      },
      'sailor': {
        name: 'Sailor',
        description: 'Navigator of Ocean Currents',
        nextRank: 'Keeper of Waves',
        energyRequired: 150,
        color: '#4169E1',
      },
      'keeper-of-waves': {
        name: 'Keeper of Waves',
        description: 'Guardian of Ocean Depths',
        nextRank: 'Champion of the Ocean',
        energyRequired: 300,
        color: '#6A5ACD',
      },
      'champion-of-ocean': {
        name: 'Champion of the Ocean',
        description: 'Master of Aquatic Power',
        nextRank: 'Messenger of Neptune',
        energyRequired: 500,
        color: '#FFD700',
      },
      'messenger-of-neptune': {
        name: 'Messenger of Neptune',
        description: 'Ultimate Ocean Warrior',
        nextRank: null,
        energyRequired: null,
        color: '#FF6347',
      },
    };
    return ranks[rank as keyof typeof ranks] || ranks.triton;
  };

  const handleResetProfile = () => {
    Alert.alert(
      'Reset Profile',
      'Are you sure you want to reset all progress? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => dispatch(resetProfile())
        },
      ]
    );
  };

  const rankInfo = getRankInfo(user.rank);
  const progressToNext = rankInfo.energyRequired 
    ? Math.min((user.energy / rankInfo.energyRequired) * 100, 100)
    : 100;

  const totalBattlesWon = battleHistory.filter((battle: BattleSession) => {
    const winner = battle.players.find((p) => p.id === battle.winner);
    return winner?.name === user.name;
  }).length;

  return (
    <OceanBackground>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={[styles.contentContainer, { paddingTop: insets.top }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileCard}>
            <View style={styles.profileAvatarContainer}>
              {user.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.profileAvatar} />
              ) : (
                <Text style={styles.profileDefaultAvatar}>👤</Text>
              )}
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user.name}</Text>
              <Text style={styles.profileDescription}>{rankInfo.description}</Text>
            </View>
          </View>
        </View>

        {/* Rank Progress */}
        <Animated.View style={styles.rankContainer} entering={FadeInDown.delay(120)}>
          <View style={styles.rankHeader}>
            <Text style={[styles.rankTitle, { color: rankInfo.color }]}>
              {rankInfo.name}
            </Text>
            {rankInfo.nextRank && (
              <Text style={styles.nextRank}>
                Next: {rankInfo.nextRank}
              </Text>
            )}
          </View>
          
          {rankInfo.energyRequired && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${progressToNext}%`, backgroundColor: rankInfo.color }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {user.energy} / {rankInfo.energyRequired} Energy
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Stats Grid */}
        <Animated.View style={styles.statsGrid} entering={FadeInDown.delay(220)}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{user.energy}</Text>
            <Text style={styles.statLabel}>Total Energy</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{user.totalWorkouts}</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{user.streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalBattlesWon}</Text>
            <Text style={styles.statLabel}>Battles Won</Text>
          </View>
        </Animated.View>

        {/* Recent Activity */}
        <View style={styles.activityContainer}>
          <Text style={styles.activityTitle}>Recent Activity</Text>
          
          {workoutHistory.length === 0 && battleHistory.length === 0 ? (
            <View style={styles.noActivity}>
              <Text style={styles.noActivityText}>
                No activity yet. Start training with Neptune!
              </Text>
            </View>
          ) : (
            <View style={styles.activityList}>
              {workoutHistory.slice(-3).reverse().map((session: WorkoutSession, index: number) => (
                <View key={session.id} style={styles.activityItem}>
                  <Text style={styles.activityIcon}>💪</Text>
                  <View style={styles.activityDetails}>
                    <Text style={styles.activityText}>
                      {session.exerciseType} workout
                    </Text>
                    <Text style={styles.activitySubtext}>
                      +{session.energyGained} energy • {Math.floor(session.duration / 1000)}s
                    </Text>
                  </View>
                </View>
              ))}
              
              {battleHistory.slice(-2).reverse().map((battle: BattleSession, index: number) => {
                const winner = battle.players.find((p) => p.id === battle.winner);
                const isWinner = winner?.name === user.name;
                
                return (
                  <View key={battle.id} style={styles.activityItem}>
                    <Text style={styles.activityIcon}>
                      {isWinner ? '🏆' : '⚔️'}
                    </Text>
                    <View style={styles.activityDetails}>
                      <Text style={styles.activityText}>
                        Battle {isWinner ? 'Won' : 'Participated'}
                      </Text>
                      <Text style={styles.activitySubtext}>
                        {battle.players.length} players • {Math.floor(battle.duration / 1000)}s
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Achievements (placeholder) */}
        <View style={styles.achievementsContainer}>
          <Text style={styles.achievementsTitle}>Achievements</Text>
          <View style={styles.achievementsList}>
            <View style={styles.achievementPlaceholder}>
              <Text style={styles.achievementText}>🏆 First Workout</Text>
              <Text style={styles.achievementStatus}>
                {user.totalWorkouts > 0 ? '✅ Unlocked' : '🔒 Locked'}
              </Text>
            </View>
            <View style={styles.achievementPlaceholder}>
              <Text style={styles.achievementText}>⚡ Energy Master</Text>
              <Text style={styles.achievementStatus}>
                {user.energy >= 100 ? '✅ Unlocked' : '🔒 Locked'}
              </Text>
            </View>
            <View style={styles.achievementPlaceholder}>
              <Text style={styles.achievementText}>🔥 Week Warrior</Text>
              <Text style={styles.achievementStatus}>
                {user.streak >= 7 ? '✅ Unlocked' : '🔒 Locked'}
              </Text>
            </View>
          </View>
        </View>

        {/* Reset Button */}
        <TouchableOpacity style={styles.resetButton} onPress={handleResetProfile}>
          <Text style={styles.resetButtonText}>Reset Progress</Text>
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#FFD700',
    padding: 20,
    width: '100%',
  },
  profileAvatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FFD700',
    overflow: 'hidden',
    marginRight: 20,
  },
  profileAvatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  profileDefaultAvatar: {
    fontSize: 50,
    textAlign: 'center',
    lineHeight: 74,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  profileDescription: {
    color: '#87CEEB',
    fontSize: 14,
    lineHeight: 20,
  },
  rankContainer: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#FFD700',
    padding: 20,
    marginBottom: 25,
  },
  rankHeader: {
    alignItems: 'center',
    marginBottom: 15,
  },
  rankTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  nextRank: {
    color: '#87CEEB',
    fontSize: 14,
  },
  progressContainer: {
    marginTop: 10,
  },
  progressBar: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statCard: {
    width: '48%',
    backgroundColor: 'rgba(135, 206, 235, 0.1)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFD700',
    padding: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    color: '#87CEEB',
    fontSize: 12,
    textAlign: 'center',
  },
  activityContainer: {
    marginBottom: 25,
  },
  activityTitle: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  noActivity: {
    alignItems: 'center',
    padding: 30,
  },
  noActivityText: {
    color: '#87CEEB',
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 34, 68, 0.6)',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFD700',
    padding: 15,
  },
  activityIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  activityDetails: {
    flex: 1,
  },
  activityText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  activitySubtext: {
    color: '#87CEEB',
    fontSize: 12,
    marginTop: 2,
  },
  achievementsContainer: {
    marginBottom: 30,
  },
  achievementsTitle: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  achievementsList: {
    gap: 10,
  },
  achievementPlaceholder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFD700',
    padding: 15,
  },
  achievementText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  achievementStatus: {
    color: '#87CEEB',
    fontSize: 12,
  },
  resetButton: {
    backgroundColor: 'rgba(255, 68, 68, 0.2)',
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#FFD700',
    paddingVertical: 15,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#FF4444',
    fontSize: 16,
    fontWeight: '600',
  },
}));

export default ProfileScreen;
