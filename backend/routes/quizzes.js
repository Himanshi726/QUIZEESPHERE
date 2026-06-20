const express = require('express');
const Quiz = require('../models/Quiz');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

const router = express.Router();

// @desc    Get all quizzes
// @route   GET /api/quizzes
// @access  Private (Users & Admins)
router.get('/', protect, async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate('createdBy', 'name');
    res.status(200).json({ success: true, count: quizzes.length, data: quizzes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @desc    Get single quiz
// @route   GET /api/quizzes/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ success: false, error: 'Quiz not found' });
    }
    // Don't send correct answers to the client before they submit
    const sanitizedQuiz = quiz.toObject();
    sanitizedQuiz.questions.forEach(q => {
       delete q.correctAnswer;
    });

    res.status(200).json({ success: true, data: sanitizedQuiz });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @desc    Create new quiz
// @route   POST /api/quizzes
// @access  Private (Admin only)
// Note: In a real scenario, handling multiple file uploads for questions in one request is tricky.
// We'll assume the frontend sends JSON with imageUrls (after uploading them separately) or we handle a simple single array.
// For simplicity, let's just accept the full JSON body. If image uploads are needed, they can be done via a separate /api/upload endpoint.
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    req.body.createdBy = req.user.id;
    const quiz = await Quiz.create(req.body);
    res.status(201).json({ success: true, data: quiz });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// @desc    Upload image to cloudinary (helper route for quiz creation)
// @route   POST /api/quizzes/upload
// @access  Private (Admin only)
router.post('/upload', protect, authorize('admin'), upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'Please upload a file' });
  }
  res.status(200).json({ success: true, url: req.file.path });
});

module.exports = router;
