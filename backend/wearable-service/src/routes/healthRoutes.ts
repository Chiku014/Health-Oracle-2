import express from 'express';
import { HealthDataService } from '../services/HealthDataService';
import { authenticateToken } from '../middleware/auth';

interface AuthenticatedRequest extends express.Request {
  user?: {
    id: string;
  };
}

const router = express.Router();

// Store daily health data
router.post('/health-data', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const data = req.body;
    const record = await HealthDataService.storeDailyHealthData(userId, data);
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: 'Failed to store health data' });
  }
});

// Add medicine to schedule
router.post('/medicine', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const medicine = req.body;
    const record = await HealthDataService.addMedicine(userId, medicine);
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add medicine' });
  }
});

// Mark medicine as taken
router.put('/medicine/:id/taken', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const medicineId = req.params.id;
    const record = await HealthDataService.markMedicineTaken(userId, medicineId);
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update medicine status' });
  }
});

// Get health averages
router.get('/health-averages', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const days = parseInt(req.query.days as string) || 7;
    const averages = await HealthDataService.getHealthAverages(userId, days);
    res.json(averages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get health averages' });
  }
});

// Get health trends
router.get('/health-trends', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const days = parseInt(req.query.days as string) || 30;
    const trends = await HealthDataService.getHealthTrends(userId, days);
    res.json(trends);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get health trends' });
  }
});

export default router; 