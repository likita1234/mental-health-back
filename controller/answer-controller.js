const mongoose = require('mongoose');
const _ = require('lodash');

const APIFeatures = require('../utils/api-features');

const Answer = require('../models/answer-model');
const AssessmentForm = require('../models/assessment-form-model');
const Question = require('../models/question-model');

const QuestionController = require('./question-controller');

const AppError = require('../utils/app-errors');
const catchAsync = require('../utils/catch-async');

const { QuestionId, getCategoryArray } = require('../enums');
const { createUniqueDateString } = require('../utils/date-formatter');

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

  // Create a unique identifier
  const uniqueDateString = createUniqueDateString();
  // Create answers in bulk
  const createdAnswers = await Answer.insertMany(
    answers.map((answer) => ({
      formId,
      userId: userId || uniqueDateString, // Set userId to uniqueDateString if not provided
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
  const features = new APIFeatures(Answer.find(), req.query)
    .filter()
    .sort()
    .limitFields();
  // .paginate(); //No pagination required here, we will fetch everything

  const answers = await features.query;

  res.status(200).json({
    status: 'success',
    data: {
      answers,
      total: answers.length,
    },
  });
});

// This is not supported at the moment, dont use this and delete it later in future of make changes
// Aggregate the gender information and display the data
// At the moment, there is a limitation on its support only on mental health assessment form
// This function is useful for question type radio at the moment
exports.aggregateGenderData = catchAsync(async (req, res, next) => {
  // Extract the category
  const category = _.capitalize(req.params.category);
  // Get the questionId based on the category, we use this on matching questionId below
  const questionId = QuestionId[category];
  // Now get the arrays for data category wise
  const mappingsData = getCategoryArray(category);

  // Construct $switch branches dynamically based on mappingsData
  const branches = mappingsData.map((mapping) => ({
    case: { $eq: ['$_id', mapping.id] },
    then: mapping.label,
  }));

  // Execute Query
  const responseData = await Answer.aggregate([
    // Match only the documents where the answer is within the valid range (1-4)
    {
      $match: {
        formId: mongoose.Types.ObjectId('65e4c1b053ac8d0d48982869'),
        questionId: mongoose.Types.ObjectId(questionId),
      },
    },
    // Group the documents by the answer value and count occurrences
    {
      $group: {
        _id: '$answer',
        count: { $sum: 1 },
      },
    },
    // Project to rename the answer values with their corresponding gender labels
    {
      $project: {
        label: {
          $switch: {
            branches, //Already setup above
            default: 'Unknown',
          },
        },
        count: 1,
        _id: 0,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: responseData,
      total: responseData.length,
    },
  });
});
