import React, { createContext, useContext } from 'react';
import { usePrediction } from '../hooks/usePrediction';

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

interface PredictionContextType {
  prediction: Prediction | null;
  loading: boolean;
  error: string | null;
  notifications: Prediction['notifications'];
  notificationSettings: NotificationSettings | null;
  generatePrediction: () => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  updateNotificationSettings: (settings: NotificationSettings) => Promise<void>;
}

const PredictionContext = createContext<PredictionContextType | undefined>(undefined);

export const usePredictionContext = () => {
  const context = useContext(PredictionContext);
  if (!context) {
    throw new Error('usePredictionContext must be used within a PredictionProvider');
  }
  return context;
};

export const PredictionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const prediction = usePrediction();

  return (
    <PredictionContext.Provider value={prediction}>
      {children}
    </PredictionContext.Provider>
  );
}; 