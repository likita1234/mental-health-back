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
  const features = new APIFeatures(Question.find({ active: true }), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const questions = await features.query;

  // Create a new APIFeatures instance without pagination to count total documents
  const countFeatures = new APIFeatures(
    Question.find({ active: true }),
    req.query
  )
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
  const { title, description, label, type, options, required } = req.body;
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
    options: type === 'checkbox' || type === 'radio' ? optionIds : null,
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
  // req.params.id
  const existingQuestion = await this.fetchQuestionDetailsById(req.params.id);
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
  const { title, description, type, options, required } = req.body;
  // 2) Check if the question exists
  const question = await Question.findOne({ _id: id, active: true });
  if (!question) {
    return new AppError(404, 'Question not found');
  }

  // 3) Update question fields
  if (title) question.title = title;
  if (description) question.description = description;
  if (type) question.type = type;
  question.required = required;

  // 4) Update options if provided
  if (type === 'radio' || type === 'checkbox')
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
    } else {
      question.options = null;
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
  const question = await Question.findOne({ _id: req.params.id, active: true });
  if (!question) {
    return next(new AppError('No question found with that ID', 404));
  }

  // soft delete
  await question.softDelete();

  res.status(204).json({
    status: 'success',
    data: 'Question has been deleted',
  });
});

// ===========> Function to fetch question details
exports.fetchQuestionDetailsById = async (questionId) => {
  try {
    return await Question.findOne({
      _id: questionId,
      active: true,
    })
      .select('-__v')
      .populate({
        path: 'author',
        select: 'username email role',
      })
      .then(async (question) => {
        if (question.type === 'radio' || question.type === 'checkbox') {
          return await question
            .populate({
              path: 'options',
              select: '-__v',
            })
            .execPopulate();
        } else {
          return question;
        }
      });
  } catch (error) {
    throw new Error('Error fetching question details');
  }
};

// ============> Helper to fetch question options only
exports.fetchQuestionOptionsByQuestionId = async (questionId) => {
  try {
    const questionDetails = await this.fetchQuestionDetailsById(questionId);
    const questionOptions = questionDetails?.options?.map((option) => {
      return {
        label: option?.title?.english,
        value: option?.optionValue?.toString(), //Comparision will be in string later so
      };
    });
    return {
      questionDetails,
      questionOptions,
    };
  } catch (error) {
    throw new Error('Error fetching question details');
  }
};

// ============> Given an array of question ids, generate id, title and options
exports.fetchQuestionIdTitleAndOptions = async (questionIds) => {
  try {
    return await Promise.all(
      questionIds.map(async (currQuestionId) => {
        const { questionOptions, questionDetails } =
          await this.fetchQuestionOptionsByQuestionId(currQuestionId);
        const questionTitle = questionDetails?.title?.english;

        return {
          questionId: currQuestionId,
          questionTitle,
          questionOptions,
        };
      })
    );
  } catch (error) {
    throw new Error('Error fetching all questions details');
  }
};
