const Answer = require('../models/Answer');
const AppError = require('../utils/app-errors');
const catchAsync = require('../utils/catch-async');

// Create operation
exports.createAnswer = catchAsync(async (req, res) => {
  const { formId, userId, answers } = req.body;

  // Check if formId is provided
  if (!formId) {
    return next(new AppError('FormId is required', 400));
  }

  // Check if answers array is provided and not empty
  if (!answers || !Array.isArray(answers) || answers.length === 0) {
    return next(new AppError('Atleast one answer required', 400));
  }

  // Validate each answer in the array
  for (const answer of answers) {
    if (!answer.questionId || answer.answer === undefined) {
      return next(
        new AppError(
          'Each answer must container an answer and a questionId',
          400
        )
      );
    }
  }

  // Create answers in bulk
  const createdAnswers = await Answer.insertMany(
    answers.map((answer) => ({
      formId,
      userId: userId || null, // Set userId to null if not provided
      questionId: answer.questionId,
      answer: answer.answer,
    }))
  );

  res.status(201).json({
    status: 'success',
    data: {
      answers: createdAnswers,
    },
  });
});
