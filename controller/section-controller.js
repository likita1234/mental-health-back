const Section = require('../models/section-model');

const APIFeatures = require('../utils/api-features');
const AppError = require('../utils/app-errors');
const catchAsync = require('../utils/catch-async');
const { validateQuestionIds } = require('../validators/section-validators');

// Create a section
exports.addSection = catchAsync(async (req, res, next) => {
  // 1) Check if questions exists, then verify all the questions that exists are valid
  const allQuestions = req.body.questions?.map(
    (questionObj) => questionObj.questionId
  );
  const isValidQuestions = await validateQuestionIds(allQuestions);
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
  // 1) Check if id exists
  const existingSection = await Section.findOne({
    _id: req.params.id,
    active: true,
  });
  if (!existingSection) {
    return next(new AppError('Section with that id doesnt exist', 404));
  }
  // 2) Check if questions exists, then verify all the questions that exists are valid
  const allQuestions = req.body.questions?.map((obj) => obj.questionId);
  const isValidQuestions = await validateQuestionIds(allQuestions);
  // If there are any invalid questions then return error
  if (!isValidQuestions) {
    return next(new AppError('Invalid question Id in the request body', 400));
  }
  // 3) Update the details extracted from the paramters
  existingSection.title = req.body.title;
  existingSection.description = req.body.description;
  existingSection.questions = req.body.questions;
  await existingSection.save();

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
  // .populate({
  //   path: 'questions',
  //   select: '-__v',
  // }
  const features = new APIFeatures(Section.find({ active: true }), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const sections = await features.query;

  // Create a new APIFeatures instance without pagination to count total documents
  const countFeatures = new APIFeatures(
    Section.find({ active: true }),
    req.query
  )
    .filter()
    .sort()
    .limitFields();

  // Count the total number of documents without pagination
  const total = await Section.countDocuments(countFeatures.query.getFilter());

  res.status(200).json({
    status: 'success',
    data: {
      sections,
      total,
    },
  });
});

// extract section by id
exports.getSectionDetails = catchAsync(async (req, res, next) => {
  // 1) Check if section with the id exists or not
  const existingSection = await Section.findOne({
    _id: req.params.id,
    active: true,
  })
    .select('-__v')
    .populate({
      path: 'questions.questionId',
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
  // 3) Else return the section details
  else {
    return res.status(200).json({
      status: 'success',
      data: existingSection,
    });
  }
});

// delete section by id
exports.deleteSection = catchAsync(async (req, res, next) => {
  // 1) Check if section exists, If section doesnt exist, return error
  const section = await Section.findOne({ _id: req.params.id, active: true });
  if (!section) {
    return next(new AppError('Section with that id doesnt exist', 404));
  }

  // Soft delete
  await section.softDelete();

  res.status(204).json({
    status: 'success',
    data: 'Section has been deleted',
  });
});
