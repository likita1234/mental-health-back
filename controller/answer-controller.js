const mongoose = require('mongoose');

const Answer = require('../models/answer-model');
const AssessmentForm = require('../models/assessment-form-model');
const Question = require('../models/question-model');
const AppError = require('../utils/app-errors');
const catchAsync = require('../utils/catch-async');

// Submit Form answer
exports.submitFormAnswer = catchAsync(async (req, res) => {
  const { formId, userId, answers } = req.body;

  // Check if formId is provided
  if (!formId) {
    return next(new AppError('FormId is required', 400));
  }
  // Check if formId is a valid ObjectId and exists
  if (!mongoose.Types.ObjectId.isValid(formId)) {
    return next(new AppError(`Form ID ${formId} invalid`, 400));
  }
  const existingForm = await AssessmentForm.findById(formId);
  if (!existingForm) {
    return next(new AppError(`Form with ID ${formId} not found`, 400));
  }

  // Check if answers array is provided and not empty
  if (!answers || !Array.isArray(answers) || answers.length === 0) {
    return next(new AppError('Atleast one answer required', 400));
  }

  // Validate each answer in the array
  for (const answer of answers) {
    if (!mongoose.Types.ObjectId.isValid(answer.questionId)) {
      return next(
        new AppError(`Invalid question id ${answer.questionId}`, 400)
      );
    }
    const existingQuestion = await Question.findById(answer.questionId);
    if (!existingQuestion) {
      return next(
        new AppError(`Question with ID ${answer.questionId} not found`, 400)
      );
    }
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

  // After the answers have been mapped out, trigger submission count on the existingForm
  await existingForm.incrementSubmissionCount();

  res.status(201).json({
    status: 'success',
    data: {
      answers: createdAnswers,
    },
  });
});

// Fetch all answers
exports.getAllAnswers = catchAsync(async (req, res, next) => {
  // Execute Query
  // .populate({ path: 'sections', select: '-__v' })
  const features = new APIFeatures(Answer.find({ active: true }), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const answers = await features.query;

  // Create a new APIFeatures instance without pagination to count total documents
  const countFeatures = new APIFeatures(
    Answer.find({ active: true }),
    req.query
  )
    .filter()
    .sort()
    .limitFields();

  // Count the total number of documents without pagination
  const total = await Answer.countDocuments(countFeatures.query.getFilter());

  res.status(200).json({
    status: 'success',
    data: {
      answers,
      total,
    },
  });
});
