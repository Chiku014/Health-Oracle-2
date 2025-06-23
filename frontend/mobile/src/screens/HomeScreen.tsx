import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useProfile } from '../context/ProfileContext';
import { useHealthData } from '../hooks/useHealthData';
import { theme } from '../theme';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import HealthConnectButton from '../components/HealthConnectButton';
import { HealthInsights } from '../components/HealthInsights';

const { width } = Dimensions.get('window');

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { profile, loading: profileLoading } = useProfile();
  const { healthData, loading: healthLoading, error, refreshData } = useHealthData();

  const handleQuickAction = (screen: keyof RootStackParamList) => {
    navigation.navigate(screen as any);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={healthLoading}
            onRefresh={refreshData}
          />
        }
      >
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.accountButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Icon name="account-circle-outline" size={32} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Health Score Card */}
        <View style={styles.healthScoreCard}>
          <Text style={styles.healthScoreTitle}>Your Health Score</Text>
          <Text style={styles.healthScoreValue}>{healthData.heartRate.latest || '--'}</Text>
          <Text style={styles.healthScoreText}>{healthData.heartRate.status}</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleQuickAction('HeartRate')}
            >
              <Icon name="heart-pulse" size={24} color="#FF6B6B" />
              <Text style={styles.actionText}>Heart Rate</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleQuickAction('Activity')}
            >
              <Icon name="run" size={24} color="#4ECDC4" />
              <Text style={styles.actionText}>Activity</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleQuickAction('Sleep')}
            >
              <Icon name="sleep" size={24} color="#6C5CE7" />
              <Text style={styles.actionText}>Sleep</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleQuickAction('Medicine')}
            >
              <Icon name="pill" size={24} color="#FF9F43" />
              <Text style={styles.actionText}>Medicine</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Health Insights */}
        <View style={styles.insightsContainer}>
          <Text style={styles.sectionTitle}>Health Insights</Text>
          <HealthInsights 
            averages={{
              steps: {
                average: healthData.steps,
                min: healthData.steps * 0.8, // Example values, replace with actual data
                max: healthData.steps * 1.2
              },
              sleep: {
                average: healthData.sleep.durationMinutes,
                min: healthData.sleep.durationMinutes * 0.8,
                max: healthData.sleep.durationMinutes * 1.2
              },
              heartRate: {
                average: healthData.heartRate.latest || 0,
                min: (healthData.heartRate.latest || 0) * 0.9,
                max: (healthData.heartRate.latest || 0) * 1.1
              }
            }}
            trends={{
              steps: {
                daily: Array(7).fill(0).map((_, i) => ({
                  date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                  average: healthData.steps * (0.9 + Math.random() * 0.2)
                })),
                trend: {
                  slope: 0,
                  intercept: healthData.steps,
                  predict: (x) => healthData.steps
                }
              },
              sleep: {
                daily: Array(7).fill(0).map((_, i) => ({
                  date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                  average: healthData.sleep.durationMinutes * (0.9 + Math.random() * 0.2)
                })),
                trend: {
                  slope: 0,
                  intercept: healthData.sleep.durationMinutes,
                  predict: (x) => healthData.sleep.durationMinutes
                }
              },
              heartRate: {
                daily: Array(7).fill(0).map((_, i) => ({
                  date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                  average: (healthData.heartRate.latest || 0) * (0.9 + Math.random() * 0.2)
                })),
                trend: {
                  slope: 0,
                  intercept: healthData.heartRate.latest || 0,
                  predict: (x) => healthData.heartRate.latest || 0
                }
              }
            }}
          />
        </View>

        {/* Health Connect Button */}
        <View style={styles.healthConnectContainer}>
          <HealthConnectButton />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
    paddingBottom: 80, // Add padding to prevent content from being hidden behind the button
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: theme.colors.background,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
    zIndex: 1000,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  accountButton: {
    padding: 8,
  },
  healthScoreCard: {
    backgroundColor: '#4A90E2',
    borderRadius: 20,
    padding: 20,
    margin: 20,
    alignItems: 'center',
  },
  healthScoreTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  healthScoreValue: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  healthScoreText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  quickActionsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 15,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    width: (width - 60) / 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    marginTop: 8,
    fontSize: 12,
    color: '#2D3436',
    textAlign: 'center',
  },
  insightsContainer: {
    padding: 20,
  },
  insightCard: {
    padding: 20,
    borderRadius: 16,
    marginRight: 15,
    width: width * 0.6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginTop: 10,
  },
  insightText: {
    fontSize: 14,
    color: '#636E72',
    marginTop: 5,
  },
  appointmentsContainer: {
    padding: 20,
    paddingBottom: 30,
  },
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appointmentIcon: {
    backgroundColor: '#F0F7FF',
    padding: 12,
    borderRadius: 12,
  },
  appointmentDetails: {
    flex: 1,
    marginLeft: 15,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
  },
  appointmentTime: {
    fontSize: 14,
    color: '#636E72',
    marginTop: 4,
  },
  healthConnectContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginTop: 10
  },
});