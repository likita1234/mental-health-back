const Question = require('../models/question-model');
const QuestionOption = require('../models/question-option-model');
// const AppError = require('../utils/app-errors');
const catchAsync = require('../utils/catch-async');

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
