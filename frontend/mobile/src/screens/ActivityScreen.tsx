import React from 'react';
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
import { VictoryLine, VictoryChart, VictoryAxis, VictoryTheme } from 'victory-native';

const { width } = Dimensions.get('window');

export const ActivityScreen = () => {
  const { healthData, loading, error, refreshData } = useHealthData();

  const chartData = [
    { x: 1, y: healthData.steps * 0.8 },
    { x: 2, y: healthData.steps * 0.9 },
    { x: 3, y: healthData.steps * 1.1 },
    { x: 4, y: healthData.steps * 0.95 },
    { x: 5, y: healthData.steps * 1.05 },
    { x: 6, y: healthData.steps * 0.85 },
    { x: 7, y: healthData.steps },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Daily Steps */}
      <View style={styles.stepsCard}>
        <Text style={styles.stepsTitle}>Today's Steps</Text>
        <Text style={styles.stepsValue}>{healthData.steps.toLocaleString()}</Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { width: `${Math.min((healthData.steps / 10000) * 100, 100)}%` }
            ]} 
          />
        </View>
        <Text style={styles.stepsGoal}>Goal: 10,000 steps</Text>
      </View>

      {/* Activity History */}
      <View style={styles.historyCard}>
        <Text style={styles.sectionTitle}>Activity History</Text>
        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : (
          <VictoryChart
            theme={VictoryTheme.material}
            width={width - 40}
            height={220}
            padding={{ top: 10, bottom: 40, left: 40, right: 20 }}
          >
            <VictoryAxis
              tickValues={[1, 2, 3, 4, 5, 6, 7]}
              tickFormat={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
            />
            <VictoryAxis dependentAxis />
            <VictoryLine
              style={{
                data: { stroke: "#4ECDC4" },
                parent: { border: "1px solid #ccc"}
              }}
              data={chartData}
              animate={{
                duration: 2000,
                onLoad: { duration: 1000 }
              }}
            />
          </VictoryChart>
        )}
      </View>

      {/* Activity Types */}
      <View style={styles.typesCard}>
        <Text style={styles.sectionTitle}>Activity Types</Text>
        <View style={styles.activityType}>
          <Icon name="walk" size={24} color="#4ECDC4" />
          <View style={styles.activityInfo}>
            <Text style={styles.activityName}>Walking</Text>
            <Text style={styles.activityDuration}>45 minutes</Text>
          </View>
        </View>
        <View style={styles.activityType}>
          <Icon name="run" size={24} color="#FF6B6B" />
          <View style={styles.activityInfo}>
            <Text style={styles.activityName}>Running</Text>
            <Text style={styles.activityDuration}>30 minutes</Text>
          </View>
        </View>
        <View style={styles.activityType}>
          <Icon name="bike" size={24} color="#6C5CE7" />
          <View style={styles.activityInfo}>
            <Text style={styles.activityName}>Cycling</Text>
            <Text style={styles.activityDuration}>1 hour</Text>
          </View>
        </View>
      </View>

      {/* Start Activity Button */}
      <TouchableOpacity style={styles.startButton}>
        <Icon name="plus-circle" size={24} color="#FFFFFF" />
        <Text style={styles.startButtonText}>Start New Activity</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 16,
  },
  stepsCard: {
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
  stepsTitle: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  stepsValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginVertical: 8,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginVertical: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4ECDC4',
    borderRadius: 4,
  },
  stepsGoal: {
    fontSize: 16,
    color: theme.colors.textSecondary,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 16,
  },
  typesCard: {
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
  activityType: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  activityInfo: {
    marginLeft: 16,
    flex: 1,
  },
  activityName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  activityDuration: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  startButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
}); 