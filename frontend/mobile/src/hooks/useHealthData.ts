import { useState, useEffect } from 'react';
import HealthConnectService from '../services/healthConnect';

interface HealthData {
  steps: number;
  sleep: {
    durationMinutes: number;
  };
  heartRate: {
    latest: number;
    status: string;
  };
}

export const useHealthData = () => {
  const [healthData, setHealthData] = useState<HealthData>({
    steps: 0,
    sleep: {
      durationMinutes: 0,
    },
    heartRate: {
      latest: 0,
      status: 'Loading...',
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealthData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check and request permissions if needed
      const hasPermissions = await HealthConnectService.checkPermissions();
      if (!hasPermissions) {
        await HealthConnectService.requestPermissions();
      }

      // Get today's date range
      const now = new Date();
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));
      const endOfDay = new Date(now.setHours(23, 59, 59, 999));

      // Fetch steps data
      const steps = await HealthConnectService.getStepsData(startOfDay, endOfDay);

      // Fetch sleep data for last night
      const yesterdayStart = new Date(startOfDay);
      yesterdayStart.setDate(yesterdayStart.getDate() - 1);
      const sleepSessions = await HealthConnectService.getSleepData(yesterdayStart, endOfDay);
      const lastSleepSession = sleepSessions[sleepSessions.length - 1] || { durationMinutes: 0 };

      // Fetch heart rate data
      const heartRateData = await HealthConnectService.getHeartRateData(startOfDay, endOfDay);
      const latestHeartRate = heartRateData[heartRateData.length - 1] || { beatsPerMinute: 0 };
      
      // Determine heart rate status
      const getHeartRateStatus = (bpm: number) => {
        if (bpm === 0) return 'No data';
        if (bpm < 60) return 'Low';
        if (bpm > 100) return 'High';
        return 'Normal';
      };

      setHealthData({
        steps,
        sleep: {
          durationMinutes: lastSleepSession.durationMinutes,
        },
        heartRate: {
          latest: latestHeartRate.beatsPerMinute,
          status: getHeartRateStatus(latestHeartRate.beatsPerMinute),
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch health data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthData();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchHealthData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { healthData, loading, error, refreshData: fetchHealthData };
};