import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useHealthData } from '../hooks/useHealthData';
import { theme } from '../theme';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const SleepScreen = () => {
  const { healthData, loading, error, refreshData } = useHealthData();

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Sleep Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Last Night's Sleep</Text>
        <Text style={styles.summaryValue}>
          {formatDuration(healthData.sleep.durationMinutes)}
        </Text>
        <Text style={styles.summaryQuality}>
          Quality: {healthData.sleep.quality || 'Good'}
        </Text>
      </View>

      {/* Sleep Stages */}
      <View style={styles.stagesCard}>
        <Text style={styles.sectionTitle}>Sleep Stages</Text>
        <View style={styles.stageItem}>
          <View style={[styles.stageIndicator, { backgroundColor: '#4ECDC4' }]} />
          <View style={styles.stageInfo}>
            <Text style={styles.stageName}>Deep Sleep</Text>
            <Text style={styles.stageDuration}>2h 15m</Text>
          </View>
        </View>
        <View style={styles.stageItem}>
          <View style={[styles.stageIndicator, { backgroundColor: '#6C5CE7' }]} />
          <View style={styles.stageInfo}>
            <Text style={styles.stageName}>Light Sleep</Text>
            <Text style={styles.stageDuration}>4h 30m</Text>
          </View>
        </View>
        <View style={styles.stageItem}>
          <View style={[styles.stageIndicator, { backgroundColor: '#FF6B6B' }]} />
          <View style={styles.stageInfo}>
            <Text style={styles.stageName}>REM Sleep</Text>
            <Text style={styles.stageDuration}>1h 45m</Text>
          </View>
        </View>
        <View style={styles.stageItem}>
          <View style={[styles.stageIndicator, { backgroundColor: '#FFD166' }]} />
          <View style={styles.stageInfo}>
            <Text style={styles.stageName}>Awake</Text>
            <Text style={styles.stageDuration}>30m</Text>
          </View>
        </View>
      </View>

      {/* Sleep History */}
      <View style={styles.historyCard}>
        <Text style={styles.sectionTitle}>Sleep History</Text>
        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : (
          <LineChart
            data={{
              labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              datasets: [{
                data: [
                  healthData.sleep.durationMinutes * 0.8,
                  healthData.sleep.durationMinutes * 0.9,
                  healthData.sleep.durationMinutes * 1.1,
                  healthData.sleep.durationMinutes * 0.95,
                  healthData.sleep.durationMinutes * 1.05,
                  healthData.sleep.durationMinutes * 0.85,
                  healthData.sleep.durationMinutes,
                ]
              }]
            }}
            width={width - 40}
            height={220}
            chartConfig={{
              backgroundColor: theme.colors.background,
              backgroundGradientFrom: theme.colors.background,
              backgroundGradientTo: theme.colors.background,
              decimalPlaces: 0,
              color: () => '#6C5CE7',
              labelColor: () => theme.colors.text,
              style: {
                borderRadius: 16,
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        )}
      </View>

      {/* Sleep Tips */}
      <View style={styles.tipsCard}>
        <Text style={styles.sectionTitle}>Sleep Tips</Text>
        <View style={styles.tipItem}>
          <Icon name="bed" size={24} color="#6C5CE7" />
          <Text style={styles.tipText}>Maintain a consistent sleep schedule</Text>
        </View>
        <View style={styles.tipItem}>
          <Icon name="coffee" size={24} color="#6C5CE7" />
          <Text style={styles.tipText}>Avoid caffeine 6 hours before bedtime</Text>
        </View>
        <View style={styles.tipItem}>
          <Icon name="phone-off" size={24} color="#6C5CE7" />
          <Text style={styles.tipText}>Limit screen time before bed</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 16,
  },
  summaryCard: {
    backgroundColor: theme.colors.background,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginVertical: 8,
  },
  summaryQuality: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  stagesCard: {
    backgroundColor: theme.colors.background,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 16,
  },
  stageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  stageIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  stageInfo: {
    flex: 1,
  },
  stageName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  stageDuration: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  historyCard: {
    backgroundColor: theme.colors.background,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipsCard: {
    backgroundColor: theme.colors.background,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tipText: {
    marginLeft: 16,
    fontSize: 16,
    color: theme.colors.text,
    flex: 1,
  },
}); 