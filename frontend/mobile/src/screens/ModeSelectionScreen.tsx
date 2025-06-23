import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { theme } from '../theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type ModeSelectionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ModeSelection'>;

export const ModeSelectionScreen = () => {
  const navigation = useNavigation<ModeSelectionScreenNavigationProp>();

  const handleModeSelect = (mode: 'self' | 'other') => {
    navigation.replace('Prediction', { mode });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      <View style={styles.content}>
        <Text style={styles.title}>Select Mode</Text>
        <View style={styles.modeContainer}>
          <TouchableOpacity
            style={styles.modeButton}
            onPress={() => handleModeSelect('self')}
          >
            <Icon name="account" size={40} color={theme.colors.primary} />
            <Text style={styles.modeTitle}>Self Mode</Text>
            <Text style={styles.modeDescription}>
              Track and analyze your personal health data
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modeButton}
            onPress={() => handleModeSelect('other')}
          >
            <Icon name="account-group" size={40} color={theme.colors.primary} />
            <Text style={styles.modeTitle}>Other Mode</Text>
            <Text style={styles.modeDescription}>
              Generate predictions for general health data
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 30,
  },
  modeContainer: {
    gap: 20,
  },
  modeButton: {
    backgroundColor: theme.colors.card,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: 10,
  },
  modeDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 5,
  },
}); 