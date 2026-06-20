const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  quiz: {
    type: mongoose.Schema.ObjectId,
    ref: 'Quiz',
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  answers: [{
    questionId: {
      type: mongoose.Schema.ObjectId,
      required: true
    },
    providedAnswer: {
      type: String,
      default: null
    },
    isCorrect: {
      type: Boolean,
      required: true
    }
  }],
  completedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Prevent multiple attempts for the same quiz by the same user
attemptSchema.index({ user: 1, quiz: 1 }, { unique: true });

module.exports = mongoose.model('Attempt', attemptSchema);
