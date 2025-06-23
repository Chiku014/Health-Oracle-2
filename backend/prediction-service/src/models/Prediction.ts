import mongoose from 'mongoose';

const PredictionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  isSelfUser: {
    type: Boolean,
    required: true,
    default: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  predictions: {
    steps: {
      predicted: Number,
      actual: Number,
      goal: Number
    },
    sleep: {
      predicted: Number, // in minutes
      actual: Number,
      goal: Number
    },
    heartRate: {
      predicted: Number,
      actual: Number,
      goal: Number
    }
  },
  notifications: [{
    type: {
      type: String,
      enum: ['steps', 'sleep', 'heartRate'],
      required: true
    },
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    isRead: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true
});

// Index for faster queries
PredictionSchema.index({ userId: 1, date: 1 });

export const Prediction = mongoose.model('Prediction', PredictionSchema); 