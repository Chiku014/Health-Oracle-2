import { Schema, model, Document } from 'mongoose';

interface IHealthRecord extends Document {
  userId: string;
  date: Date;
  steps: {
    count: number;
    hourlyBreakdown: number[];
  };
  sleep: {
    durationMinutes: number;
    quality: number;
    startTime: Date;
    endTime: Date;
  };
  heartRate: {
    average: number;
    min: number;
    max: number;
    readings: Array<{
      timestamp: Date;
      bpm: number;
    }>;
  };
  medicine: Array<{
    name: string;
    dosage: string;
    time: Date;
    taken: boolean;
  }>;
}

const HealthRecordSchema = new Schema({
  userId: { type: String, required: true },
  date: { type: Date, required: true },
  steps: {
    count: { type: Number, default: 0 },
    hourlyBreakdown: [{ type: Number }]
  },
  sleep: {
    durationMinutes: { type: Number, default: 0 },
    quality: { type: Number, min: 0, max: 100, default: 0 },
    startTime: { type: Date },
    endTime: { type: Date }
  },
  heartRate: {
    average: { type: Number, default: 0 },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
    readings: [{
      timestamp: { type: Date },
      bpm: { type: Number }
    }]
  },
  medicine: [{
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    time: { type: Date, required: true },
    taken: { type: Boolean, default: false }
  }]
}, {
  timestamps: true
});

// Index for faster queries
HealthRecordSchema.index({ userId: 1, date: 1 });

export const HealthRecord = model<IHealthRecord>('HealthRecord', HealthRecordSchema); 