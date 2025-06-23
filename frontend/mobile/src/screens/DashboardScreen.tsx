import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';

export const DashboardScreen = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Predictions</Text>
          <View style={styles.predictionCards}>
            <View style={styles.predictionCard}>
              <Text style={styles.cardTitle}>Diabetes Risk</Text>
              <Text style={styles.cardValue}>Low</Text>
            </View>
            <View style={styles.predictionCard}>
              <Text style={styles.cardTitle}>Heart Disease Risk</Text>
              <Text style={styles.cardValue}>Moderate</Text>
            </View>
            <View style={styles.predictionCard}>
              <Text style={styles.cardTitle}>Sleep Quality</Text>
              <Text style={styles.cardValue}>Good</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Activity</Text>
          <View style={styles.activityCards}>
            <View style={styles.activityCard}>
              <Text style={styles.cardTitle}>Steps</Text>
              <Text style={styles.cardValue}>8,432</Text>
            </View>
            <View style={styles.activityCard}>
              <Text style={styles.cardTitle}>Sleep</Text>
              <Text style={styles.cardValue}>7h 30m</Text>
            </View>
            <View style={styles.activityCard}>
              <Text style={styles.cardTitle}>Heart Rate</Text>
              <Text style={styles.cardValue}>72 bpm</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Alerts</Text>
          <View style={styles.alertCard}>
            <Text style={styles.alertTitle}>High Heart Rate Detected</Text>
            <Text style={styles.alertDescription}>
              Your heart rate was above normal during rest. Consider checking with your doctor.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutText: {
    color: '#4a90e2',
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  predictionCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  predictionCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activityCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  activityCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  alertCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#ff6b6b',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  alertDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
}); 