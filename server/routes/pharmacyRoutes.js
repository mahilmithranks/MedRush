import express from 'express';
import Pharmacy from '../models/pharmacy.js';

const router = express.Router();

// GET /api/pharmacies
router.get('/', async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find();
    res.json(pharmacies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pharmacies' });
  }
});

export default router;
