const express = require('express');
const Attempt = require('../models/Attempt');
const Quiz = require('../models/Quiz');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Submit quiz attempt
// @route   POST /api/attempts/submit
// @access  Private
router.post('/submit', protect, async (req, res) => {
  try {
    const { quizId, answers } = req.body;

    // Check if attempt already exists
    const existingAttempt = await Attempt.findOne({ user: req.user.id, quiz: quizId });
    if (existingAttempt) {
      return res.status(400).json({ success: false, error: 'You have already attempted this quiz.' });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, error: 'Quiz not found' });
    }

    let score = 0;
    const evaluatedAnswers = answers.map(ans => {
      const question = quiz.questions.id(ans.questionId);
      const isCorrect = question.correctAnswer === ans.providedAnswer;
      if (isCorrect) score += 1;
      return {
        questionId: ans.questionId,
        providedAnswer: ans.providedAnswer,
        isCorrect
      };
    });

    const attempt = await Attempt.create({
      user: req.user.id,
      quiz: quizId,
      score: (score / quiz.questions.length) * 100, // percentage
      answers: evaluatedAnswers
    });

    res.status(201).json({ success: true, data: attempt });
  } catch (err) {
    // Handle duplicate key error manually just in case
    if (err.code === 11000) {
      return res.status(400).json({ success: false, error: 'You have already attempted this quiz.' });
    }
    res.status(500).json({ success: false, error: err.message });
  }
});

// @desc    Get logged in user's attempts
// @route   GET /api/attempts/user
// @access  Private
router.get('/user', protect, async (req, res) => {
  try {
    const attempts = await Attempt.find({ user: req.user.id }).populate('quiz', 'title description timeLimit');
    res.status(200).json({ success: true, count: attempts.length, data: attempts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @desc    Get leaderboard for a specific quiz
// @route   GET /api/attempts/quiz/:quizId
// @access  Private (Admin only)
router.get('/quiz/:quizId', protect, authorize('admin'), async (req, res) => {
  try {
    const attempts = await Attempt.find({ quiz: req.params.quizId })
      .populate('user', 'name email')
      .sort({ score: -1, completedAt: 1 }); // highest score first, then earliest time
    res.status(200).json({ success: true, count: attempts.length, data: attempts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
