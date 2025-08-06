const Medicine = require('../models/Medicine');

// @desc    Add a new medicine
// @route   POST /api/medicines
// @access  Private/Pharmacist
const addMedicine = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;

    const medicine = new Medicine({
      name,
      description,
      price,
      stock,
      pharmacist: req.user.id, // Link to the logged-in pharmacist
    });

    const createdMedicine = await medicine.save();
    res.status(201).json(createdMedicine);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get medicines for the logged-in pharmacist
// @route   GET /api/medicines
// @access  Private/Pharmacist
const getMyMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({ pharmacist: req.user.id });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { addMedicine, getMyMedicines };