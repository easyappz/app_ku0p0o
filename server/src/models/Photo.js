const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageData: { type: String, required: true }, // Base64 encoded image
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  age: { type: Number, required: true },
  ratings: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      score: { type: Number, min: 1, max: 10 },
    },
  ],
  averageScore: { type: Number, default: 0 },
  isActive: { type: Boolean, default: false }, // Whether photo is in rating pool
  uploadDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Photo', photoSchema);
