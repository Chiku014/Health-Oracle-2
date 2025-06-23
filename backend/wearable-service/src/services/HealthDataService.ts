import { HealthRecord } from '../models/HealthRecord';
import { Types } from 'mongoose';

export class HealthDataService {
  // Store daily health data
  static async storeDailyHealthData(userId: string, data: any) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const record = await HealthRecord.findOneAndUpdate(
      { userId, date: today },
      {
        $set: {
          steps: {
            count: data.steps,
            hourlyBreakdown: data.hourlySteps || []
          },
          sleep: {
            durationMinutes: data.sleep.durationMinutes,
            quality: data.sleep.quality || 0,
            startTime: data.sleep.startTime,
            endTime: data.sleep.endTime
          },
          heartRate: {
            average: data.heartRate.average,
            min: data.heartRate.min,
            max: data.heartRate.max,
            readings: data.heartRate.readings
          }
        }
      },
      { upsert: true, new: true }
    );

    return record;
  }

  // Add medicine to schedule
  static async addMedicine(userId: string, medicine: any) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return await HealthRecord.findOneAndUpdate(
      { userId, date: today },
      {
        $push: {
          medicine: {
            name: medicine.name,
            dosage: medicine.dosage,
            time: medicine.time,
            taken: false
          }
        }
      },
      { upsert: true, new: true }
    );
  }

  // Mark medicine as taken
  static async markMedicineTaken(userId: string, medicineId: string) {
    return await HealthRecord.findOneAndUpdate(
      { 
        userId,
        'medicine._id': new Types.ObjectId(medicineId)
      },
      {
        $set: {
          'medicine.$.taken': true
        }
      }
    );
  }

  // Get health averages
  static async getHealthAverages(userId: string, days: number = 7) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const records = await HealthRecord.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 });

    return {
      steps: this.calculateAverages(records, 'steps.count'),
      sleep: this.calculateAverages(records, 'sleep.durationMinutes'),
      heartRate: this.calculateAverages(records, 'heartRate.average')
    };
  }

  // Get health trends
  static async getHealthTrends(userId: string, days: number = 30) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const records = await HealthRecord.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 });

    return {
      steps: this.calculateTrends(records, 'steps.count'),
      sleep: this.calculateTrends(records, 'sleep.durationMinutes'),
      heartRate: this.calculateTrends(records, 'heartRate.average')
    };
  }

  // Helper method to calculate averages
  private static calculateAverages(records: any[], field: string) {
    const values = records.map(r => this.getNestedValue(r, field));
    const validValues = values.filter(v => v !== null && v !== undefined);
    
    if (validValues.length === 0) return null;

    const sum = validValues.reduce((a, b) => a + b, 0);
    return {
      average: sum / validValues.length,
      min: Math.min(...validValues),
      max: Math.max(...validValues)
    };
  }

  // Helper method to calculate trends
  private static calculateTrends(records: any[], field: string) {
    const values = records.map(r => ({
      date: r.date,
      value: this.getNestedValue(r, field)
    }));

    // Calculate daily averages
    const dailyAverages = this.calculateDailyAverages(values);
    
    // Calculate trend line using simple linear regression
    const trend = this.calculateLinearRegression(dailyAverages);

    return {
      daily: dailyAverages,
      trend: trend
    };
  }

  // Helper method to get nested object value
  private static getNestedValue(obj: any, path: string) {
    return path.split('.').reduce((o, p) => o?.[p], obj);
  }

  // Helper method to calculate daily averages
  private static calculateDailyAverages(data: any[]) {
    const dailyGroups = data.reduce((acc, curr) => {
      const date = curr.date.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(curr.value);
      return acc;
    }, {} as Record<string, number[]>);

    return (Object.entries(dailyGroups) as [string, number[]][]).map(([date, values]) => ({
      date,
      average: values.reduce((a, b) => a + b, 0) / values.length
    }));
  }

  // Helper method to calculate linear regression
  private static calculateLinearRegression(data: any[]) {
    const n = data.length;
    const x = data.map((_, i) => i);
    const y = data.map(d => d.average);

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((a, b, i) => a + b * y[i], 0);
    const sumXX = x.reduce((a, b) => a + b * b, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return {
      slope,
      intercept,
      predict: (x: number) => slope * x + intercept
    };
  }
} 