import express from 'express';
import { PredictionService } from '../services/PredictionService';
import { authMiddleware } from '../../auth-service/src/middleware/auth';

const router = express.Router();
const predictionService = new PredictionService();

// Generate prediction for self user
router.post('/self', authMiddleware, async (req, res) => {
  try {
    const { healthData } = req.body;
    const userId = req.user.id;
    
    const prediction = await predictionService.generatePrediction(userId, true, healthData);
    res.json(prediction);
  } catch (error) {
    console.error('Error generating self prediction:', error);
    res.status(500).json({ error: 'Failed to generate prediction' });
  }
});

// Generate prediction for other user (no data storage)
router.post('/other', authMiddleware, async (req, res) => {
  try {
    const { healthData } = req.body;
    const userId = req.user.id;
    
    const prediction = await predictionService.generatePrediction(userId, false, healthData);
    res.json(prediction);
  } catch (error) {
    console.error('Error generating other prediction:', error);
    res.status(500).json({ error: 'Failed to generate prediction' });
  }
});

// Get user's predictions history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const predictions = await Prediction.find({ userId, isSelfUser: true })
      .sort({ date: -1 })
      .limit(7);
    
    res.json(predictions);
  } catch (error) {
    console.error('Error fetching prediction history:', error);
    res.status(500).json({ error: 'Failed to fetch prediction history' });
  }
});

// Get unread notifications
router.get('/notifications', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const predictions = await Prediction.find({
      userId,
      isSelfUser: true,
      'notifications.isRead': false
    })
      .sort({ date: -1 })
      .limit(10);
    
    const notifications = predictions.flatMap(prediction => 
      prediction.notifications.filter(n => !n.isRead)
    );
    
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Mark notification as read
router.put('/notifications/:id/read', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await Prediction.updateOne(
      { 'notifications._id': id },
      { $set: { 'notifications.$.isRead': true } }
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

export default router; 