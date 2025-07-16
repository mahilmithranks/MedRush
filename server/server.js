import express from 'express';
import mongoose from 'mongoose';
import pharmacyRoutes from './routes/pharmacyRoutes.js';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/pharmacies', pharmacyRoutes);


mongoose.connect('mongodb://localhost:27017/medrush')
  .then(() => {
    console.log('MongoDB connected');
    app.listen(5000, () => console.log('Server running on port 5000'));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
