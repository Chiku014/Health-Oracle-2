import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useHealthData } from '../hooks/useHealthData';
import { theme } from '../theme';
import { LineChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

export const HeartRateScreen = () => {
  const { healthData, loading, error, refreshData } = useHealthData();
  const [isMonitoring, setIsMonitoring] = useState(false);

  const chartData = {
    labels: ['6h', '5h', '4h', '3h', '2h', '1h', 'Now'],
    datasets: [
      {
        data: [
          healthData.heartRate.latest * 0.9,
          healthData.heartRate.latest * 0.95,
          healthData.heartRate.latest * 0.98,
          healthData.heartRate.latest,
          healthData.heartRate.latest * 1.02,
          healthData.heartRate.latest * 1.05,
          healthData.heartRate.latest * 1.1,
        ],
      },
    ],
  };

  const startMonitoring = () => {
    setIsMonitoring(true);
    // Here you would typically start a background service to monitor heart rate
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    // Here you would stop the background service
  };

  return (
    <ScrollView style={styles.container}>
      {/* Current Heart Rate */}
      <View style={styles.currentRateCard}>
        <Text style={styles.currentRateTitle}>Current Heart Rate</Text>
        <Text style={styles.currentRateValue}>
          {healthData.heartRate.latest || '--'} BPM
        </Text>
        <Text style={styles.currentRateStatus}>
          {healthData.heartRate.status}
        </Text>
      </View>

      {/* Monitoring Controls */}
      <View style={styles.controlsCard}>
        <Text style={styles.sectionTitle}>Heart Rate Monitoring</Text>
        <TouchableOpacity
          style={[styles.monitorButton, isMonitoring && styles.monitorButtonActive]}
          onPress={isMonitoring ? stopMonitoring : startMonitoring}
        >
          <Icon
            name={isMonitoring ? 'stop-circle' : 'play-circle'}
            size={32}
            color={isMonitoring ? '#FF6B6B' : '#4ECDC4'}
          />
          <Text style={styles.monitorButtonText}>
            {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Heart Rate History */}
      <View style={styles.historyCard}>
        <Text style={styles.sectionTitle}>Heart Rate History</Text>
        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : (
          <LineChart
            data={chartData}
            width={width - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
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

      {/* Heart Rate Zones */}
      <View style={styles.zonesCard}>
        <Text style={styles.sectionTitle}>Heart Rate Zones</Text>
        <View style={styles.zoneItem}>
          <View style={[styles.zoneIndicator, { backgroundColor: '#4ECDC4' }]} />
          <Text style={styles.zoneText}>Resting: 60-100 BPM</Text>
        </View>
        <View style={styles.zoneItem}>
          <View style={[styles.zoneIndicator, { backgroundColor: '#FFD166' }]} />
          <Text style={styles.zoneText}>Light Activity: 101-120 BPM</Text>
        </View>
        <View style={styles.zoneItem}>
          <View style={[styles.zoneIndicator, { backgroundColor: '#FF9F43' }]} />
          <Text style={styles.zoneText}>Moderate: 121-140 BPM</Text>
        </View>
        <View style={styles.zoneItem}>
          <View style={[styles.zoneIndicator, { backgroundColor: '#FF6B6B' }]} />
          <Text style={styles.zoneText}>Intense: 141+ BPM</Text>
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
  currentRateCard: {
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
  currentRateTitle: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  currentRateValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginVertical: 8,
  },
  currentRateStatus: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  controlsCard: {
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
  monitorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4ECDC4',
  },
  monitorButtonActive: {
    borderColor: '#FF6B6B',
  },
  monitorButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
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
  zonesCard: {
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
  zoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  zoneIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  zoneText: {
    fontSize: 16,
    color: theme.colors.text,
  },
}); 