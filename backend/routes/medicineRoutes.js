const express = require('express');
const router = express.Router();
const { addMedicine, getMyMedicines } = require('../controllers/medicineController');
const { protect, isPharmacist } = require('../middleware/authMiddleware');

// We can chain our middleware like this.
// The request will first go through 'protect', then 'isPharmacist'.
router.route('/')
  .post(protect, isPharmacist, addMedicine)
  .get(protect, isPharmacist, getMyMedicines);

module.exports = router;