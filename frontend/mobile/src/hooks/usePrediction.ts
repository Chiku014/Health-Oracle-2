import { useState, useEffect, useCallback } from 'react';
import { useHealthData } from './useHealthData';
import api from '../services/api';

interface Prediction {
  predictions: {
    steps: {
      predicted: number;
      actual: number;
      goal: number;
    };
    sleep: {
      predicted: number;
      actual: number;
      goal: number;
    };
    heartRate: {
      predicted: number;
      actual: number;
      goal: number;
    };
  };
  notifications: Array<{
    _id: string;
    type: string;
    message: string;
    timestamp: Date;
    isRead: boolean;
  }>;
}

interface NotificationSettings {
  notificationTime: string;
  enabled: boolean;
  tag?: string;
}

export const usePrediction = () => {
  const { healthData } = useHealthData();
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings | null>(null);

  const generatePrediction = useCallback(async () => {
    if (!healthData) {
      setError('Health data not available');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/prediction/generate', { healthData });
      setPrediction(response.data);
    } catch (err) {
      setError('Failed to generate prediction');
      console.error('Error generating prediction:', err);
    } finally {
      setLoading(false);
    }
  }, [healthData]);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await api.get('/prediction/notifications');
      setPrediction(prev => prev ? { ...prev, notifications: response.data } : null);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  }, []);

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await api.put(`/prediction/notifications/${notificationId}/read`);
      setPrediction(prev => {
        if (!prev) return null;
        return {
          ...prev,
          notifications: prev.notifications.map(n => 
            n._id === notificationId ? { ...n, isRead: true } : n
          )
        };
      });
    } catch (err) {
      console.error('Error marking notification as read:', err);
      throw err;
    }
  };

  const updateNotificationSettings = async (settings: NotificationSettings) => {
    try {
      await api.put('/prediction/notification-settings', settings);
      setNotificationSettings(settings);
    } catch (err) {
      console.error('Error updating notification settings:', err);
      throw err;
    }
  };

  useEffect(() => {
    generatePrediction();
  }, [generatePrediction]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  return {
    prediction,
    loading,
    error,
    notifications: prediction?.notifications || [],
    notificationSettings,
    generatePrediction,
    markNotificationAsRead,
    updateNotificationSettings
  };
}; 