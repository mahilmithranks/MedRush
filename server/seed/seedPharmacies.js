import mongoose from 'mongoose'
import Pharmacy from '../models/pharmacy.js'

const seed = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/medrush')
    await Pharmacy.deleteMany()

    await Pharmacy.insertMany([
      {
        name: 'Apollo',
        pinCode: '600001',
        isOpen: true,
        pharmacistPhoto: '',
        location: { lat: 1, lng: 1 },
      },
      {
        name: 'MedLife',
        pinCode: '600002',
        isOpen: false,
        pharmacistPhoto: '',
        location: { lat: -2, lng: 2 },
      },
      {
        name: 'PharmaPlus',
        pinCode: '600003',
        isOpen: true,
        pharmacistPhoto: '',
        location: { lat: 3, lng: -1 },
      },
    ])

    console.log('✅ Dummy pharmacies added')
    process.exit()
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

seed()
