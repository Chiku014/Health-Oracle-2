import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

interface HealthInsightsProps {
  averages: {
    steps: {
      average: number;
      min: number;
      max: number;
    };
    sleep: {
      average: number;
      min: number;
      max: number;
    };
    heartRate: {
      average: number;
      min: number;
      max: number;
    };
  };
  trends: {
    steps: {
      daily: Array<{ date: string; average: number }>;
      trend: {
        slope: number;
        intercept: number;
        predict: (x: number) => number;
      };
    };
    sleep: {
      daily: Array<{ date: string; average: number }>;
      trend: {
        slope: number;
        intercept: number;
        predict: (x: number) => number;
      };
    };
    heartRate: {
      daily: Array<{ date: string; average: number }>;
      trend: {
        slope: number;
        intercept: number;
        predict: (x: number) => number;
      };
    };
  };
}

const { width } = Dimensions.get('window');

export const HealthInsights: React.FC<HealthInsightsProps> = ({ averages, trends }) => {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const renderChart = (data: Array<{ date: string; average: number }>, color: string) => {
    const chartData = {
      labels: data.map(d => d.date.split('-')[2]), // Show only day
      datasets: [{
        data: data.map(d => d.average),
        color: () => color,
      }],
    };

    return (
      <LineChart
        data={chartData}
        width={width - 40}
        height={200}
        chartConfig={{
          backgroundColor: theme.colors.background,
          backgroundGradientFrom: theme.colors.background,
          backgroundGradientTo: theme.colors.background,
          decimalPlaces: 0,
          color: () => color,
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
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Averages</Text>
        
        <View style={styles.insightCard}>
          <Icon name="walk" size={32} color="#4ECDC4" />
          <Text style={styles.insightTitle}>Steps</Text>
          <Text style={styles.insightValue}>{averages.steps.average.toLocaleString()}</Text>
          <Text style={styles.insightRange}>
            Min: {averages.steps.min.toLocaleString()} | Max: {averages.steps.max.toLocaleString()}
          </Text>
        </View>

        <View style={styles.insightCard}>
          <Icon name="moon-waning-crescent" size={32} color="#6C5CE7" />
          <Text style={styles.insightTitle}>Sleep</Text>
          <Text style={styles.insightValue}>{formatDuration(averages.sleep.average)}</Text>
          <Text style={styles.insightRange}>
            Min: {formatDuration(averages.sleep.min)} | Max: {formatDuration(averages.sleep.max)}
          </Text>
        </View>

        <View style={styles.insightCard}>
          <Icon name="heart" size={32} color="#FF6B6B" />
          <Text style={styles.insightTitle}>Heart Rate</Text>
          <Text style={styles.insightValue}>{Math.round(averages.heartRate.average)} BPM</Text>
          <Text style={styles.insightRange}>
            Min: {Math.round(averages.heartRate.min)} | Max: {Math.round(averages.heartRate.max)}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trends</Text>
        
        <View style={styles.trendCard}>
          <Text style={styles.trendTitle}>Steps Trend</Text>
          {renderChart(trends.steps.daily, '#4ECDC4')}
        </View>

        <View style={styles.trendCard}>
          <Text style={styles.trendTitle}>Sleep Trend</Text>
          {renderChart(trends.sleep.daily, '#6C5CE7')}
        </View>

        <View style={styles.trendCard}>
          <Text style={styles.trendTitle}>Heart Rate Trend</Text>
          {renderChart(trends.heartRate.daily, '#FF6B6B')}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: theme.colors.text,
  },
  insightCard: {
    backgroundColor: theme.colors.background,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: 12,
  },
  insightValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginVertical: 8,
  },
  insightRange: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  trendCard: {
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
  trendTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
  },
}); 