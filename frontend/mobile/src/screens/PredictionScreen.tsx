import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { usePrediction } from '../hooks/usePrediction';
import { theme } from '../theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

type PredictionScreenRouteProp = RouteProp<RootStackParamList, 'Prediction'>;

const PredictionScreen = () => {
  const route = useRoute<PredictionScreenRouteProp>();
  const [mode, setMode] = useState<'self' | 'other'>(route.params?.mode || 'self');
  const { prediction, loading, error, notifications, generatePrediction, markNotificationAsRead } = usePrediction();

  const toggleMode = () => {
    setMode(mode === 'self' ? 'other' : 'self');
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const renderPredictionCard = (title: string, data: any) => (
    <View style={styles.predictionCard}>
      <Text style={styles.predictionTitle}>{title}</Text>
      <View style={styles.predictionData}>
        <View style={styles.predictionValue}>
          <Text style={styles.predictionLabel}>Predicted</Text>
          <Text style={styles.predictionNumber}>{data.predicted}</Text>
    </View>
        <View style={styles.predictionValue}>
          <Text style={styles.predictionLabel}>Actual</Text>
          <Text style={styles.predictionNumber}>{data.actual}</Text>
      </View>
        <View style={styles.predictionValue}>
          <Text style={styles.predictionLabel}>Goal</Text>
          <Text style={styles.predictionNumber}>{data.goal}</Text>
    </View>
        </View>
        </View>
  );

  const renderNotifications = () => (
    <View style={styles.notificationsContainer}>
      <Text style={styles.sectionTitle}>Notifications</Text>
      {notifications.map((notification) => (
        <TouchableOpacity
          key={notification._id}
          style={[
            styles.notificationCard,
            !notification.isRead && styles.unreadNotification
          ]}
          onPress={() => markNotificationAsRead(notification._id)}
        >
          <Icon
            name={notification.type === 'goal' ? 'flag' : 'alert'}
            size={24}
            color={theme.colors.primary}
          />
          <View style={styles.notificationContent}>
            <Text style={styles.notificationMessage}>{notification.message}</Text>
            <Text style={styles.notificationTime}>
              {new Date(notification.timestamp).toLocaleString()}
            </Text>
      </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  if (loading) {
            return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Generating predictions...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
  return (
      <SafeAreaView style={styles.errorContainer}>
        <Icon name="alert-circle" size={48} color={theme.colors.error} />
        <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
          style={styles.retryButton}
          onPress={() => generatePrediction()}
          >
          <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <View style={styles.header}>
        <Text style={styles.title}>Health Predictions</Text>
        <TouchableOpacity style={styles.modeToggleContainer} onPress={toggleMode}>
          <View style={[styles.modeToggleButton, mode === 'self' && styles.activeMode]}>
            <Text style={[styles.modeToggleText, mode === 'self' && styles.activeModeText]}>Self Mode</Text>
      </View>
          <View style={[styles.modeToggleButton, mode === 'other' && styles.activeMode]}>
            <Text style={[styles.modeToggleText, mode === 'other' && styles.activeModeText]}>Other Mode</Text>
          </View>
          </TouchableOpacity>
        </View>
      <ScrollView style={styles.content}>
        {prediction && (
          <>
            {renderPredictionCard('Steps', prediction.predictions.steps)}
            {renderPredictionCard('Sleep', {
              ...prediction.predictions.sleep,
              predicted: formatDuration(prediction.predictions.sleep.predicted),
              actual: formatDuration(prediction.predictions.sleep.actual),
              goal: formatDuration(prediction.predictions.sleep.goal),
            })}
            {renderPredictionCard('Heart Rate', prediction.predictions.heartRate)}
          </>
        )}

        {mode === 'self' && renderNotifications()}
        </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: 20,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    zIndex: 1,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 20,
  },
  modeToggleContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderRadius: 25,
    padding: 4,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modeToggleButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeMode: {
    backgroundColor: theme.colors.primary,
  },
  modeToggleText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  activeModeText: {
    color: theme.colors.background,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: theme.colors.text,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.error,
    textAlign: 'center',
    marginTop: 10,
  },
  retryButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: theme.colors.primary,
    borderRadius: 5,
  },
  retryButtonText: {
    color: theme.colors.background,
    fontWeight: 'bold',
  },
  predictionCard: {
    backgroundColor: theme.colors.card,
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  predictionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 10,
  },
  predictionData: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  predictionValue: {
    alignItems: 'center',
  },
  predictionLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  predictionNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  notificationsContainer: {
    margin: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 10,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  notificationContent: {
    flex: 1,
    marginLeft: 10,
  },
  notificationMessage: {
    fontSize: 16,
    color: theme.colors.text,
  },
  notificationTime: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 5,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  removeButton: {
    backgroundColor: theme.colors.error,
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
});

export default PredictionScreen;