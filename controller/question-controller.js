const Question = require('../models/question-model');
const QuestionOption = require('../models/question-option-model');
const APIFeatures = require('../utils/api-features');
const AppError = require('../utils/app-errors');
const catchAsync = require('../utils/catch-async');
const { isObjectId } = require('../utils');

// =======> Extract all questions
exports.getAllQuestions = catchAsync(async (req, res, next) => {
  // Execute Query
  // =========> Avoid populating on all questions, you can make them available during question details
  // Question.find().populate({ path: 'options', select: '-__v' })
  const features = new APIFeatures(Question.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const questions = await features.query;

  // Create a new APIFeatures instance without pagination to count total documents
  const countFeatures = new APIFeatures(Question.find(), req.query)
    .filter()
    .sort()
    .limitFields();

  // Count the total number of documents without pagination
  const total = await Question.countDocuments(countFeatures.query.getFilter());

  res.status(200).json({
    status: 'success',
    data: {
      questions,                                                              
      total,
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
      const { title, optionValue } = option;
      const savedOption = await QuestionOption.create({
        title,
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

  res.status(201).json({
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
    })
    .populate({
      path: 'author',
      select: 'name,surname,email,role',
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

// =======> Update Question
exports.updateQuestion = catchAsync(async (req, res, next) => {
  // 1) Extract question ID and fields to update
  const { id } = req.params; // Assuming the question ID is passed as a route parameter
  const { title, description, type, options } = req.body;

  // 2) Check if the question exists
  const question = await Question.findById(id);
  if (!question) {
    return new AppError(404, 'Question not found');
  }

  // 3) Update question fields
  if (title) question.title = title;
  if (description) question.description = description;
  if (type) question.type = type;

  // 4) Update options if provided
  if (options && options.length) {
    const updatedOptionIds = [];
    for (const option of options) {
      let updatedOption;
      // If option has an ID, update the existing option, otherwise create a new one
      if (option._id && isObjectId(option._id)) {
        updatedOption = await QuestionOption.findByIdAndUpdate(
          option._id,
          { title: option.title, optionValue: option.optionValue },
          { new: true } // Return the updated option
        );
      } else {
        updatedOption = await QuestionOption.create({
          title: option.title,
          optionValue: option.optionValue,
        });
      }
      updatedOptionIds.push(updatedOption._id);
    }
    question.options = updatedOptionIds;
  }

  // 5) Save the updated question
  await question.save();

  // 6) Populate the 'options' field to get the updated option documents
  const populatedQuestion = await Question.populate(question, {
    path: 'options',
    model: 'QuestionOption',
  });

  // 7) Send the response
  res.status(200).json({
    status: 'success',
    data: {
      question: populatedQuestion,
    },
  });
});

// =======> Delete question by id
exports.deleteQuestion = catchAsync(async (req, res, next) => {
  const question = await Question.findByIdAndDelete(req.params.id);
  if (!question) {
    return next(new AppError('No question found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: 'Question has been deleted',
  });
});
