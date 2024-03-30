const Question = require('../models/question-model');
const QuestionOption = require('../models/question-option-model');
const APIFeatures = require('../utils/api-features');
const AppError = require('../utils/app-errors');
const catchAsync = require('../utils/catch-async');

// =======> Extract all questions
exports.getAllQuestions = catchAsync(async (req, res, next) => {
  // Execute Query
  const features = new APIFeatures(
    Question.find().populate({ path: 'options', select: '-__v' }),
    req.query,
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const questions = await features.query;

  res.status(200).json({
    status: 'success',
    total: questions.length,
    data: {
      questions,
    },
  });
});

// =======> Add Question
exports.addQuestion = catchAsync(async (req, res, next) => {
  //  1) Extract question body and options
  const { title, description, label, type, options } = req.body;
  // console.log(options);
  //  2) Check if there are options
  //  If yes, then save options first
  let optionIds = [];
  if (options && options.length) {
    for (const option of options) {
      const { optionName, optionValue } = option;
      const savedOption = await QuestionOption.create({
        optionName,
        optionValue,
      });
      optionIds.push(savedOption._id);
    }
  }
  // 3) Then save question
  const newQuestion = await Question.create({
    ...req.body,
    options: optionIds,
  });
  // 4) Populate the 'options' field to get the actual option documents
  const populatedQuestion = await Question.populate(newQuestion, {
    path: 'options',
    model: 'QuestionOption',
  });

  res.status(200).json({
    status: 'success',
    data: {
      question: populatedQuestion,
    },
  });
});

// ======> Get question details
exports.getQuestionDetails = catchAsync(async (req, res, next) => {
  // 1) Check if question exists
  const existingQuestion = await Question.findById(req.params.id)
    .select('-__v')
    .populate({
      path: 'options',
      select: '-__v',
    });
  // 2) If question doesn't exists then return 404
  if (!existingQuestion) {
    return next(new AppError('No question found with that id', 404));
  }
  // 3) Else return the question details
  else {
    return res.status(200).json({
      status: 'success',
      data: existingQuestion,
    });
  }
});

// =======> Delete question by id
exports.deleteQuestion = catchAsync(async (req, res, next) => {
  const question = await Question.findByIdAndDelete(req.params.id);
  console.log(question);
  if (!question) {
    return next(new AppError('No question found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: 'Question has been deleted',
  });
});
