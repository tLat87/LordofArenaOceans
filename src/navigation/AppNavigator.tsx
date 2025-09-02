import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Text, StyleSheet, Image } from 'react-native';
import { withGlobalFont } from '../styles/globalStyles';

// Screens
import HomeScreen from '../screens/HomeScreen';
import WorkoutScreen from '../screens/WorkoutScreen';
import WorkoutStartScreen from '../screens/WorkoutStartScreen';
import WorkoutCountdownScreen from '../screens/WorkoutCountdownScreen';
import WorkoutTimerScreen from '../screens/WorkoutTimerScreen';
import WorkoutPausedScreen from '../screens/WorkoutPausedScreen';
import BattleScreen from '../screens/BattleScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BattleSetupScreen from '../screens/BattleSetupScreen';
import BattleSessionScreen from '../screens/BattleSessionScreen';
import WorkoutSessionScreen from '../screens/WorkoutSessionScreen';

export type RootStackParamList = {
  MainTabs: undefined;
  Workout: undefined;
  WorkoutStart: { exercise: any };
  WorkoutCountdown: { exercise: any };
  WorkoutTimer: { exercise: any; timeLeft?: number };
  WorkoutPaused: { exercise: any; timeLeft: number };
  WorkoutSession: { exerciseType: string };
  BattleSetup: undefined;
  BattleSession: undefined;
};

export type TabParamList = {
  Home: undefined;
  Battle: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const TabIcon = ({ imageSource, focused, fallbackEmoji }: { imageSource?: any; focused: boolean; fallbackEmoji: string }) => {
  if (imageSource) {
    return (
      <Image 
        source={imageSource} 
        style={[
          styles.tabIcon,
          { opacity: focused ? 1 : 0.6 }
        ]}
        resizeMode="contain"
      />
    );
  }
  
  return (
    <Text style={[
      styles.tabIconText,
      { opacity: focused ? 1 : 0.6 }
    ]}>
      {fallbackEmoji}
    </Text>
  );
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false, // Убираем названия экранов
        tabBarActiveTintColor: '#FFD700',
        tabBarInactiveTintColor: '#87CEEB',
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon 
              imageSource={require('../assets/bottom/3.png')} // Замените на require('../assets/tab-icons/home.png') когда добавите изображение
              focused={focused} 
              fallbackEmoji="🏠"
            />
          ),
        }}
      />
      <Tab.Screen 
        name="Battle" 
        component={BattleScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon 
            imageSource={require('../assets/bottom/2.png')} // Замените на require('../assets/tab-icons/home.png') когда добавите изображение
            focused={focused} 
              fallbackEmoji="⚔️"
            />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon 
            imageSource={require('../assets/bottom/1.png')} // Замените на require('../assets/tab-icons/home.png') когда добавите изображение
            focused={focused} 
              fallbackEmoji="👤"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="Workout" component={WorkoutScreen} />
        <Stack.Screen name="WorkoutStart" component={WorkoutStartScreen} />
        <Stack.Screen name="WorkoutCountdown" component={WorkoutCountdownScreen} />
        <Stack.Screen name="WorkoutTimer" component={WorkoutTimerScreen} />
        <Stack.Screen name="WorkoutPaused" component={WorkoutPausedScreen} />
        <Stack.Screen name="WorkoutSession" component={WorkoutSessionScreen} />
        <Stack.Screen name="BattleSetup" component={BattleSetupScreen} />
        <Stack.Screen name="BattleSession" component={BattleSessionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = withGlobalFont(StyleSheet.create({
  tabBar: {
    backgroundColor: '#001122',
    borderTopWidth: 2,
    borderTopColor: '#FFD700',
    height: 80,
    paddingBottom: 20,
    paddingTop: 10,
  },
  tabIcon: {
    width: 24,
    height: 24,
  },
  tabIconText: {
    fontSize: 20,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
}));
