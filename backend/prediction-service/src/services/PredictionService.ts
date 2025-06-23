import { Prediction } from '../models/Prediction';
import { HealthDataService } from '../../wearable-service/src/services/HealthDataService';

export class PredictionService {
  private healthDataService: HealthDataService;

  constructor() {
    this.healthDataService = new HealthDataService();
  }

  async generatePrediction(userId: string, isSelfUser: boolean, healthData: any) {
    // For self users, store data and generate predictions
    if (isSelfUser) {
      const prediction = await this.generateSelfPrediction(userId, healthData);
      await this.checkGoalsAndNotify(userId, prediction);
      return prediction;
    } else {
      // For other users, only generate predictions without storing
      return this.generateOtherPrediction(healthData);
    }
  }

  private async generateSelfPrediction(userId: string, healthData: any) {
    // Get historical data for better prediction
    const historicalData = await this.healthDataService.getHealthTrends(userId, 7);
    
    // Generate predictions based on historical data and current trends
    const predictions = {
      steps: this.calculatePrediction(historicalData.steps, healthData.steps),
      sleep: this.calculatePrediction(historicalData.sleep, healthData.sleep.durationMinutes),
      heartRate: this.calculatePrediction(historicalData.heartRate, healthData.heartRate.latest)
    };

    // Set goals based on predictions
    const goals = {
      steps: Math.round(predictions.steps * 1.1), // 10% above prediction
      sleep: Math.round(predictions.sleep * 1.05), // 5% above prediction
      heartRate: Math.round(predictions.heartRate * 0.95) // 5% below prediction
    };

    // Create new prediction record
    const prediction = new Prediction({
      userId,
      isSelfUser: true,
      predictions: {
        steps: { predicted: predictions.steps, actual: healthData.steps, goal: goals.steps },
        sleep: { predicted: predictions.sleep, actual: healthData.sleep.durationMinutes, goal: goals.sleep },
        heartRate: { predicted: predictions.heartRate, actual: healthData.heartRate.latest, goal: goals.heartRate }
      }
    });

    await prediction.save();
    return prediction;
  }

  private generateOtherPrediction(healthData: any) {
    // Simple prediction for other users without historical data
    return {
      steps: Math.round(healthData.steps * 1.1),
      sleep: Math.round(healthData.sleep.durationMinutes * 1.05),
      heartRate: Math.round(healthData.heartRate.latest * 0.95)
    };
  }

  private async checkGoalsAndNotify(userId: string, prediction: any) {
    const { predictions } = prediction;
    const notifications = [];

    // Check steps goal
    if (predictions.steps.actual < predictions.steps.goal) {
      notifications.push({
        type: 'steps',
        message: this.generateMotivationalMessage('steps', predictions.steps.actual, predictions.steps.goal)
      });
    }

    // Check sleep goal
    if (predictions.sleep.actual < predictions.sleep.goal) {
      notifications.push({
        type: 'sleep',
        message: this.generateMotivationalMessage('sleep', predictions.sleep.actual, predictions.sleep.goal)
      });
    }

    // Check heart rate goal
    if (predictions.heartRate.actual > predictions.heartRate.goal) {
      notifications.push({
        type: 'heartRate',
        message: this.generateMotivationalMessage('heartRate', predictions.heartRate.actual, predictions.heartRate.goal)
      });
    }

    if (notifications.length > 0) {
      await Prediction.findByIdAndUpdate(prediction._id, {
        $push: { notifications: { $each: notifications } }
      });
    }
  }

  private calculatePrediction(historicalData: any[], currentValue: number) {
    if (!historicalData || historicalData.length === 0) {
      return currentValue;
    }

    // Simple moving average with trend
    const sum = historicalData.reduce((acc, val) => acc + val, 0);
    const avg = sum / historicalData.length;
    const trend = (currentValue - historicalData[0]) / historicalData.length;
    
    return Math.round(avg + trend);
  }

  private generateMotivationalMessage(type: string, actual: number, goal: number) {
    const messages = {
      steps: [
        `You're doing great! Just ${goal - actual} more steps to reach your goal. Keep going!`,
        `Almost there! Just a few more steps and you'll hit your target.`,
        `You've got this! Every step counts towards your goal.`
      ],
      sleep: [
        `Remember, quality sleep is key to your health. Try to get ${Math.round((goal - actual) / 60)} more hours of rest.`,
        `Your body needs rest to perform at its best. Aim for a bit more sleep tonight.`,
        `A good night's sleep is the best investment in your health.`
      ],
      heartRate: [
        `Take a moment to relax and breathe. Your heart rate is a bit high.`,
        `A few deep breaths can help bring your heart rate down.`,
        `Your heart is working hard. Let's give it a break with some relaxation.`
      ]
    };

    const typeMessages = messages[type];
    return typeMessages[Math.floor(Math.random() * typeMessages.length)];
  }
} 