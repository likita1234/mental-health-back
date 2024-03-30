const AssessmentForm = require('../models/assessment-form-model');
const APIFeatures = require('../utils/api-features');
const AppError = require('../utils/app-errors');
const catchAsync = require('../utils/catch-async');
const {
  validateSectionIds,
} = require('../validators/assessment-form-validators');

// Create an assessment form
exports.addAssessmentForm = catchAsync(async (req, res, next) => {
  // 1) Check if section exists, then verify all the sections that exists are valid,
  //   If there are any invalid sections then return error
  const isValidSections = await validateSectionIds(req.body.sections);
  if (!isValidSections) {
    return next(new AppError('Invalid question Id in the request body', 400));
  }
  // 2) Otherwise, Save the ASsessment Form data
  const newForm = await AssessmentForm.create({
    ...req.body,
  });

  // 3) Format response
  const populatedForm = await AssessmentForm.populate(newForm, {
    path: 'sections',
    model: 'Section',
    populate: {
      path: 'questions',
      model: 'Question',
      populate: {
        path: 'options',
        model: 'QuestionOption',
      },
    },
  });

  // 4) Return response
  res.status(201).json({
    status: 'success',
    data: {
      section: populatedForm,
    },
  });
});

// Update existing form
exports.updateAssessmentForm = catchAsync(async (req, res, next) => {
  // 1) Check if id exists
  const existingForm = await AssessmentForm.findById(req.params.id);
  if (!existingForm) {
    return next(new AppError('Assessment Form with that id doesnt exist', 404));
  }
  // 2) Check if sections exists, then verify all the sections that exists are valid
  const isValidSections = await validateSectionIds(req.body.sections);
  // If there are any invalid sections then return error
  if (!isValidSections) {
    return next(new AppError('Invalid section Id in the request body', 400));
  }
  // 3) Update the details extracted from the parameters
  existingForm.name = req.body.name;
  existingForm.title = req.body.title;
  existingForm.description = req.body.description;
  existingForm.sections = req.body.sections;
  await existingForm.save();

  res.status(200).json({
    status: 'success',
    data: {
      section: existingForm,
    },
  });
});

// extract all assessment forms
exports.getAllAssessmentForms = catchAsync(async (req, res, next) => {
  // Execute Query
  const features = new APIFeatures(
    AssessmentForm.find().populate({ path: 'sections', select: '-__v' }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const forms = await features.query;
  res.status(200).json({
    status: 'success',
    total: forms.length,
    data: {
      forms,
    },
  });
});

// extract assessment form by id
exports.getAssessmentFormDetails = catchAsync(async (req, res, next) => {
  // 1) Check if assessment form with the id exists or not
  const existingForm = await AssessmentForm.findById(req.params.id)
    .select('-__v')
    .populate({
      path: 'sections',
      select: '-__v',
      populate: {
        path: 'questions',
        select: '-__v',
        populate: {
          path: 'options',
          select: '-__v',
        },
      },
    });

  // 2) If assessment form doesn't exist then return 404
  if (!existingForm) {
    return next(new AppError('No assessment form found with that id', 404));
  }
  // 3) Else return the assessment form details
  else {
    return res.status(200).json({
      status: 'success',
      data: existingForm,
    });
  }
});

// delete assessment form by id
exports.deleteAssessmentForm = catchAsync(async (req, res, next) => {
  // 1) Check if assessment form exists, If assessment form doesnt exist, return error
  const existingForm = await AssessmentForm.findByIdAndDelete(req.params.id);
  if (!existingForm) {
    return next(new AppError('Assessment Form with that id doesnt exist', 404));
  }

  res.status(204).json({
    status: 'success',
    data: 'Assessment Form has been deleted',
  });
});
