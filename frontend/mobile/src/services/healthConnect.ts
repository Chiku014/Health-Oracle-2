import { NativeModules, Platform } from 'react-native';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import app from '../config/firebase';

const { HealthConnect } = NativeModules;
const db = getFirestore(app);

interface SleepSession {
  startTime: number;
  endTime: number;
  durationMinutes: number;
}

interface HeartRateMeasurement {
  timestamp: number;
  beatsPerMinute: number;
}

class HealthConnectService {
  static async checkPermissions(): Promise<boolean> {
    if (Platform.OS !== 'android') return false;
    return await HealthConnect.checkPermissions();
  }

  static async requestPermissions(): Promise<void> {
    if (Platform.OS !== 'android') return;
    await HealthConnect.requestPermissions();
  }

  static async getStepsData(startTime: Date, endTime: Date): Promise<number> {
    if (Platform.OS !== 'android') return 0;
    const steps = await HealthConnect.getStepsData(
      startTime.getTime(),
      endTime.getTime()
    );
    
    // Store steps data in Firebase
    try {
      await addDoc(collection(db, 'healthData'), {
        type: 'steps',
        count: steps,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Error storing steps data:', error);
    }

    return steps;
  }

  static async getSleepData(startTime: Date, endTime: Date): Promise<SleepSession[]> {
    if (Platform.OS !== 'android') return [];
    const response = await HealthConnect.getSleepData(
      startTime.getTime(),
      endTime.getTime()
    );

    // Store sleep data in Firebase
    try {
      await addDoc(collection(db, 'healthData'), {
        type: 'sleep',
        sessions: response.sessions,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Error storing sleep data:', error);
    }

    return response.sessions;
  }

  static async getHeartRateData(startTime: Date, endTime: Date): Promise<HeartRateMeasurement[]> {
    if (Platform.OS !== 'android') return [];
    const response = await HealthConnect.getHeartRateData(
      startTime.getTime(),
      endTime.getTime()
    );

    // Store heart rate data in Firebase
    try {
      await addDoc(collection(db, 'healthData'), {
        type: 'heartRate',
        measurements: response.measurements,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Error storing heart rate data:', error);
    }

    return response.measurements;
  }
}

export default HealthConnectService;