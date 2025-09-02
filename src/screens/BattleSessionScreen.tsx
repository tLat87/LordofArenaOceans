import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Animated, { FadeInDown, withTiming, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { BattlePlayer } from '../types';
import { startBattle, updateBattleTimer, eliminatePlayer, pauseBattle, resumeBattle, completeBattle, cancelBattle } from '../store/slices/battleSlice';
import OceanBackground from '../components/OceanBackground';
import Timer from '../components/Timer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withGlobalFont } from '../styles/globalStyles';

const BattleSessionScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  
  const { currentBattle, isActive, timer } = useSelector((state: RootState) => state.battle);
  const [hasStarted, setHasStarted] = useState(false);
  const [localTimer, setLocalTimer] = useState(0);

  // Initialize local timer when battle starts
  useEffect(() => {
    if (hasStarted && isActive) {
      const interval = setInterval(() => {
        setLocalTimer(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [hasStarted, isActive]);

  // Update Redux timer every second
  useEffect(() => {
    if (hasStarted && isActive) {
      const interval = setInterval(() => {
        dispatch(updateBattleTimer(localTimer * 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [hasStarted, isActive, localTimer, dispatch]);

  // Check if battle exists
  useEffect(() => {
    if (!currentBattle) {
      navigation.goBack();
    }
  }, [currentBattle, navigation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isActive) {
        dispatch(cancelBattle());
      }
    };
  }, [isActive, dispatch]);

  const handleStart = useCallback(() => {
    setHasStarted(true);
    setLocalTimer(0);
    dispatch(startBattle());
  }, [dispatch]);

  const handlePause = useCallback(() => {
    dispatch(pauseBattle());
  }, [dispatch]);

  const handleResume = useCallback(() => {
    dispatch(resumeBattle());
  }, [dispatch]);

  const handlePlayerEliminated = useCallback((playerId: string) => {
    Alert.alert(
      'Player Eliminated',
      'Confirm that this player has given up?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Eliminate', 
          onPress: () => dispatch(eliminatePlayer(playerId))
        },
      ]
    );
  }, [dispatch]);

  const handleComplete = useCallback(() => {
    dispatch(completeBattle());
    
    if (currentBattle?.winner) {
      const winner = currentBattle.players.find((p: BattlePlayer) => p.id === currentBattle.winner);
      Alert.alert(
        'Battle Complete!',
        `🏆 ${winner?.name} wins with ${Math.floor(localTimer)} seconds!`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } else {
      navigation.goBack();
    }
  }, [dispatch, currentBattle, localTimer, navigation]);

  const handleCancel = useCallback(() => {
    Alert.alert(
      'Cancel Battle',
      'Are you sure you want to cancel the battle?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes', 
          onPress: () => {
            dispatch(cancelBattle());
            navigation.goBack();
          }
        },
      ]
    );
  }, [dispatch, navigation]);

  const handleTimeUpdate = useCallback((time: number) => {
    // This is handled by local timer now
  }, []);

  const getPlayerColor = useCallback((color: string) => {
    const colorMap = {
      blue: '#4169E1',
      red: '#FF4444',
      green: '#00AA44',
      yellow: '#FFD700',
      purple: '#8A2BE2',
      orange: '#FF8C00',
    };
    return colorMap[color as keyof typeof colorMap] || '#87CEEB';
  }, []);

  // Check if battle is finished
  useEffect(() => {
    if (currentBattle?.winner && isActive) {
      dispatch(pauseBattle());
      setTimeout(() => {
        handleComplete();
      }, 2000);
    }
  }, [currentBattle?.winner, isActive, dispatch, handleComplete]);

  const headerOpacity = useSharedValue(0);
  const headerStyle = useAnimatedStyle(() => ({ 
    opacity: withTiming(headerOpacity.value, { duration: 500 }) 
  }));

  useEffect(() => {
    headerOpacity.value = 1;
  }, [headerOpacity]);

  if (!currentBattle) {
    return null;
  }

  const activePlayers = currentBattle.players.filter((p: BattlePlayer) => p.isActive);
  const eliminatedPlayers = currentBattle.players.filter((p: BattlePlayer) => !p.isActive);

  return (
    <OceanBackground variant="battle">
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <Animated.View style={[styles.header, headerStyle]}>
          <Text style={styles.title}>Plank Battle</Text>
          <Text style={styles.subtitle}>
            {currentBattle.winner 
              ? `🏆 ${currentBattle.players.find((p: BattlePlayer) => p.id === currentBattle.winner)?.name} Wins!`
              : !hasStarted ? 'Ready to battle?' 
              : isActive ? 'Battle in progress...' 
              : 'Paused'
            }
          </Text>
        </Animated.View>

        {/* Timer */}
        <Timer
          isActive={isActive}
          onTimeUpdate={handleTimeUpdate}
          variant="battle"
        />

        {/* Active Players */}
        <Animated.View style={styles.playersContainer} entering={FadeInDown.delay(150)}>
          <Text style={styles.playersTitle}>Active Players ({activePlayers.length})</Text>
          <View style={styles.playersList}>
            {activePlayers.map((player: BattlePlayer) => (
              <View key={player.id} style={styles.playerCard}>
                <View style={[styles.playerColor, { backgroundColor: getPlayerColor(player.color) }]} />
                <View style={styles.playerInfo}>
                  <Text style={styles.playerName}>{player.name}</Text>
                  <Text style={styles.playerTime}>
                    {Math.floor(localTimer)}s
                  </Text>
                </View>
                {hasStarted && !currentBattle.winner && (
                  <TouchableOpacity 
                    style={styles.eliminateButton}
                    onPress={() => handlePlayerEliminated(player.id)}
                  >
                    <Text style={styles.eliminateButtonText}>❌</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Eliminated Players */}
        {eliminatedPlayers.length > 0 && (
          <Animated.View style={styles.eliminatedContainer} entering={FadeInDown.delay(250)}>
            <Text style={styles.eliminatedTitle}>Eliminated</Text>
            <View style={styles.eliminatedList}>
              {eliminatedPlayers.map((player: BattlePlayer) => (
                <View key={player.id} style={styles.eliminatedPlayer}>
                  <View style={[styles.playerColor, { backgroundColor: getPlayerColor(player.color) }]} />
                  <Text style={styles.eliminatedPlayerName}>{player.name}</Text>
                  <Text style={styles.eliminatedPlayerTime}>
                    {Math.floor(localTimer)}s
                  </Text>
                </View>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Control buttons */}
        <View style={styles.controlsContainer}>
          {!hasStarted ? (
            <TouchableOpacity style={styles.startButton} onPress={handleStart}>
              <Text style={styles.startButtonText}>Start Battle!</Text>
            </TouchableOpacity>
          ) : currentBattle.winner ? (
            <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
              <Text style={styles.completeButtonText}>Finish</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.activeControls}>
              <TouchableOpacity 
                style={[styles.controlButton, styles.pauseButton]} 
                onPress={isActive ? handlePause : handleResume}
              >
                <Text style={styles.controlButtonText}>
                  {isActive ? '⏸️' : '▶️'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Cancel button */}
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel Battle</Text>
        </TouchableOpacity>
      </View>
    </OceanBackground>
  );
};

const styles = withGlobalFont(StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginVertical: 20,
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
  playersContainer: {
    marginVertical: 20,
  },
  playersTitle: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  playersList: {
    gap: 10,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 34, 68, 0.8)',
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#FFD700',
    padding: 15,
  },
  playerColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 15,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  playerTime: {
    color: '#87CEEB',
    fontSize: 14,
    marginTop: 2,
  },
  eliminateButton: {
    padding: 5,
  },
  eliminateButtonText: {
    fontSize: 18,
  },
  eliminatedContainer: {
    marginBottom: 20,
  },
  eliminatedTitle: {
    color: '#FF4444',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  eliminatedList: {
    gap: 8,
  },
  eliminatedPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFD700',
    padding: 10,
  },
  eliminatedPlayerName: {
    color: '#FF4444',
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
  eliminatedPlayerTime: {
    color: '#FF4444',
    fontSize: 12,
  },
  controlsContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  startButton: {
    backgroundColor: '#FF4444',
    borderRadius: 25,
    paddingVertical: 18,
    paddingHorizontal: 50,
    shadowColor: '#FF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  completeButton: {
    backgroundColor: '#00AA44',
    borderRadius: 25,
    paddingVertical: 18,
    paddingHorizontal: 50,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  activeControls: {
    flexDirection: 'row',
  },
  controlButton: {
    borderRadius: 40,
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
  },
  pauseButton: {
    backgroundColor: '#FFD700',
    shadowColor: '#FFD700',
  },
  controlButtonText: {
    fontSize: 32,
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
    paddingVertical: 12,
    paddingHorizontal: 25,
    alignSelf: 'center',
  },
  cancelButtonText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
}));

export default BattleSessionScreen;