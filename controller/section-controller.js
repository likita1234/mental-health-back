const Question = require('../models/question-model');
const Section = require('../models/section-model');

const APIFeatures = require('../utils/api-features');
const AppError = require('../utils/app-errors');
const catchAsync = require('../utils/catch-async');
const { validateQuestionIds } = require('../validators/section-validators');

// Create a section
exports.addSection = catchAsync(async (req, res, next) => {
  // 1) Check if questions exists, then verify all the questions that exists are valid
  const isValidQuestions = await validateQuestionIds(req.body.questions);
  // 2) If there are any invalid questions then return error
  if (!isValidQuestions) {
    return next(new AppError('Invalid question Id in the request body', 400));
  }
  // 3) Otherwise, Save the section data
  const newSection = await Section.create({
    ...req.body,
  });

  // 4) Format response
  const populatedSection = await Section.populate(newSection, {
    path: 'questions',
    model: 'Question',
    populate: {
      path: 'options',
      model: 'QuestionOption',
    },
  });

  // 5) Return response
  res.status(201).json({
    status: 'success',
    data: {
      section: populatedSection,
    },
  });
});

// Update existing section
exports.updateSection = catchAsync(async (req, res, next) => {
  // 1) Extract sectionId from query parameter
  const sectionId = req.params.sectionId;
  // 2) Check if sectionId exists
  const existingSection = await Section.findById(sectionId);
  if (!existingSection) {
    return next(new AppError('Section with that id doesnt exist', 404));
  }
  // 3) Check if questions exists, then verify all the questions that exists are valid
  const isValidQuestions = await validateQuestionIds(req.body.questions);
  // If there are any invalid questions then return error
  if (!isValidQuestions) {
    return next(new AppError('Invalid question Id in the request body', 400));
  }
  // 4) Update the details extracted from the paramters
  existingSection.name = req.body.name;
  existingSection.title = req.body.title;
  existingSection.description = req.body.description;
  existingSection.questions = req.body.questions;
  await existingSection.save();

  // 5) Return response
  res.status(200).json({
    status: 'success',
    data: {
      section: existingSection,
    },
  });
});

// extract all sections
exports.getAllSections = catchAsync(async (req, res, next) => {
  // Execute Query
  const features = new APIFeatures(
    Section.find().populate({ path: 'questions', select: '-__v' }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const sections = await features.query;
  res.status(200).json({
    status: 'success',
    total: sections.length,
    data: {
      sections,
    },
  });
});

// extract section by id
exports.getSectionDetails = catchAsync(async (req, res, next) => {
  // 1) Check if section with the id exists or not
  const existingSection = await Section.findById(req.params.sectionId)
    .select('-__v')
    .populate({
      path: 'questions',
      select: '-__v',
      populate: {
        path: 'options',
        select: '-__v',
      },
    });

  // 2) If section doesn't exist then return 404
  if (!existingSection) {
    return next(new AppError('No section found with that id', 404));
  }
  // 3) Else return the question details
  else {
    return res.status(200).json({
      status: 'success',
      data: existingSection,
    });
  }
});
