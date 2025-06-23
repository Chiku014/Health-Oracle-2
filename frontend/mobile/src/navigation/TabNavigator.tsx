import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { HomeScreen } from '../screens/HomeScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import PredictionScreen from '../screens/PredictionScreen';
import { ModeSelectionScreen } from '../screens/ModeSelectionScreen';
import { MiscScreen } from '../screens/MiscScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TabParamList, RootStackParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { StackNavigationProp } from '@react-navigation/stack';
import { View } from 'react-native';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const PredictionStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="ModeSelection"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: theme.colors.background }
      }}
    >
      <Stack.Screen 
        name="ModeSelection" 
        component={ModeSelectionScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="Prediction" 
        component={PredictionScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View>
              <Ionicons name="home" size={size} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View>
              <Icon name="account" size={size} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Prediction"
        component={PredictionStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View>
              <Ionicons name="analytics" size={size} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Misc"
        component={MiscScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View>
              <Icon name="dots-horizontal" size={size} color={color} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};