const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Please add question text']
  },
  options: [{
    type: String,
    required: [true, 'Please add options']
  }],
  correctAnswer: {
    type: String,
    required: [true, 'Please add the correct answer']
  },
  imageUrl: {
    type: String,
    default: ''
  }
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a quiz title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  timeLimit: {
    type: Number,
    required: [true, 'Please add a time limit in minutes']
  },
  questions: [questionSchema],
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
