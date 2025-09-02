import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { createBattle } from '../store/slices/battleSlice';
import OceanBackground from '../components/OceanBackground';
import { PlayerColor } from '../types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type BattleSetupNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const PLAYER_COLORS: { color: PlayerColor; display: string; background: string }[] = [
  { color: 'blue', display: 'Blue', background: '#4169E1' },
  { color: 'red', display: 'Red', background: '#FF4444' },
  { color: 'green', display: 'Green', background: '#00AA44' },
  { color: 'yellow', display: 'Yellow', background: '#FFD700' },
  { color: 'purple', display: 'Purple', background: '#8A2BE2' },
  { color: 'orange', display: 'Orange', background: '#FF8C00' },
];

interface Player {
  name: string;
  color: PlayerColor;
}

const BattleSetupScreen: React.FC = () => {
  const navigation = useNavigation<BattleSetupNavigationProp>();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const [players, setPlayers] = useState<Player[]>([
    { name: '', color: 'blue' },
    { name: '', color: 'red' },
  ]);

  const addPlayer = () => {
    if (players.length < 6) {
      const availableColors = PLAYER_COLORS.filter(
        colorOption => !players.some(player => player.color === colorOption.color)
      );
      
      if (availableColors.length > 0) {
        setPlayers([...players, { name: '', color: availableColors[0].color }]);
      }
    }
  };

  const removePlayer = (index: number) => {
    if (players.length > 2) {
      setPlayers(players.filter((_, i) => i !== index));
    }
  };

  const updatePlayerName = (index: number, name: string) => {
    const updatedPlayers = [...players];
    updatedPlayers[index].name = name;
    setPlayers(updatedPlayers);
  };

  const updatePlayerColor = (index: number, color: PlayerColor) => {
    // Check if color is already taken
    if (players.some((player, i) => i !== index && player.color === color)) {
      Alert.alert('Color Taken', 'This color is already chosen by another player.');
      return;
    }

    const updatedPlayers = [...players];
    updatedPlayers[index].color = color;
    setPlayers(updatedPlayers);
  };

  const startBattle = () => {
    // Validate all players have names
    const emptyNames = players.filter(player => !player.name.trim());
    if (emptyNames.length > 0) {
      Alert.alert('Missing Names', 'Please enter names for all players.');
      return;
    }

    // Create battle and navigate to battle session
    dispatch(createBattle({
      players: players.map(player => ({ name: player.name.trim(), color: player.color })),
      exerciseType: 'plank', // Default to plank for now
    }));

    navigation.navigate('BattleSession');
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
          <Text style={styles.title}>Battle Setup</Text>
          <Text style={styles.subtitle}>Configure players for the plank challenge</Text>
        </View>

        {/* Player setup */}
        <View style={styles.playersContainer}>
          {players.map((player, index) => (
            <View key={index} style={styles.playerCard}>
              <View style={styles.playerHeader}>
                <Text style={styles.playerNumber}>Player {index + 1}</Text>
                {players.length > 2 && (
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => removePlayer(index)}
                  >
                    <Text style={styles.removeButtonText}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Player name input */}
              <TextInput
                style={styles.nameInput}
                placeholder={`Enter Player ${index + 1} name`}
                placeholderTextColor="#87CEEB"
                value={player.name}
                onChangeText={(text) => updatePlayerName(index, text)}
                maxLength={15}
              />

              {/* Color selection */}
              <View style={styles.colorContainer}>
                <Text style={styles.colorLabel}>Choose color:</Text>
                <View style={styles.colorOptions}>
                  {PLAYER_COLORS.map((colorOption) => (
                    <TouchableOpacity
                      key={colorOption.color}
                      style={[
                        styles.colorOption,
                        { backgroundColor: colorOption.background },
                        player.color === colorOption.color && styles.selectedColor,
                        players.some((p, i) => i !== index && p.color === colorOption.color) && styles.disabledColor,
                      ]}
                      onPress={() => updatePlayerColor(index, colorOption.color)}
                      disabled={players.some((p, i) => i !== index && p.color === colorOption.color)}
                    />
                  ))}
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Add player button */}
        {players.length < 6 && (
          <TouchableOpacity style={styles.addPlayerButton} onPress={addPlayer}>
            <Text style={styles.addPlayerText}>+ Add Player</Text>
          </TouchableOpacity>
        )}

        {/* Exercise info */}
        <View style={styles.exerciseInfo}>
          <Text style={styles.exerciseTitle}>Exercise: Plank Challenge</Text>
          <Text style={styles.exerciseDescription}>
            Hold the plank position as long as possible. Last player standing wins!
          </Text>
        </View>

        {/* Action buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.startButton} onPress={startBattle}>
            <Text style={styles.startButtonText}>Start Battle!</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </OceanBackground>
  );
};

const styles = StyleSheet.create({
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
  playersContainer: {
    marginBottom: 20,
  },
  playerCard: {
    backgroundColor: 'rgba(0, 34, 68, 0.8)',
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#FFD700',
    padding: 20,
    marginBottom: 15,
  },
  playerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  playerNumber: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
  },
  removeButton: {
    backgroundColor: '#FF4444',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nameInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFD700',
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 15,
  },
  colorContainer: {
    marginTop: 10,
  },
  colorLabel: {
    color: '#87CEEB',
    fontSize: 14,
    marginBottom: 10,
  },
  colorOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#FFFFFF',
    borderWidth: 3,
  },
  disabledColor: {
    opacity: 0.3,
  },
  addPlayerButton: {
    backgroundColor: 'rgba(135, 206, 235, 0.2)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#87CEEB',
    borderStyle: 'dashed',
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 25,
  },
  addPlayerText: {
    color: '#87CEEB',
    fontSize: 16,
    fontWeight: '600',
  },
  exerciseInfo: {
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#FFD700',
    padding: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  exerciseTitle: {
    color: '#FF4444',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  exerciseDescription: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  actionButtons: {
    gap: 15,
  },
  startButton: {
    backgroundColor: '#FF4444',
    borderRadius: 25,
    paddingVertical: 18,
    alignItems: 'center',
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
  cancelButton: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FFD700',
    paddingVertical: 15,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BattleSetupScreen;

