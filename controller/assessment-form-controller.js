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
  const allSections = req.body.sections?.map(
    (sectionObj) => sectionObj.sectionId
  );
  //   If there are any invalid sections then return error
  const isValidSections = await validateSectionIds(allSections);
  if (!isValidSections) {
    return next(new AppError('Invalid section Id in the request body', 400));
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
  const existingForm = await AssessmentForm.findOne({
    _id: req.params.id,
    active: true,
  });
  if (!existingForm) {
    return next(new AppError('Assessment Form with that id doesnt exist', 404));
  }
  // 2) Check if sections exists, then verify all the sections that exists are valid
  const allSections = req.body.sections?.map((obj) => obj.sectionId);
  const isValidSections = await validateSectionIds(allSections);
  // If there are any invalid sections then return error
  if (!isValidSections) {
    return next(new AppError('Invalid section Id in the request body', 400));
  }
  // 3) Update the details extracted from the parameters
  existingForm.title = req.body.title;
  existingForm.description = req.body.description;
  existingForm.type = req.body.type;
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
  // .populate({ path: 'sections', select: '-__v' })
  const features = new APIFeatures(
    AssessmentForm.find({ active: true }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const forms = await features.query;

  // Create a new APIFeatures instance without pagination to count total documents
  const countFeatures = new APIFeatures(
    AssessmentForm.find({ active: true }),
    req.query
  )
    .filter()
    .sort()
    .limitFields();

  // Count the total number of documents without pagination
  const total = await AssessmentForm.countDocuments(
    countFeatures.query.getFilter()
  );

  res.status(200).json({
    status: 'success',
    data: {
      forms,
      total,
    },
  });
});

// extract assessment form by id
exports.getAssessmentFormDetails = catchAsync(async (req, res, next) => {
  // 1) Check if assessment form with the id exists or not
  const existingForm = await AssessmentForm.findOne({
    _id: req.params.id,
    active: true,
  })
    .select('-__v')
    .populate({
      path: 'sections.sectionId',
      select: '-__v',
      populate: {
        path: 'questions.questionId',
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
  const existingForm = await AssessmentForm.findOne({
    _id: req.params.id,
    active: true,
  });
  if (!existingForm) {
    return next(new AppError('Assessment Form with that id doesnt exist', 404));
  }

  // Soft delete
  await existingForm.softDelete();

  res.status(204).json({
    status: 'success',
    data: 'Assessment Form has been deleted',
  });
});

// toggle assessment form poll activeness
exports.toggleAssessmentPoll = catchAsync(async (req, res, next) => {
  // Check if assessment form exists with that id
  const existingForm = await AssessmentForm.findOne({
    _id: req.params.id,
    active: true,
  });

  if (!existingForm) {
    return next(new AppError('Assessment Form with that id doesnt exist', 404));
  }

  // Toggle Assessment Form Poll
  await existingForm.togglePoll();

  res.status(204).json({
    status: 'success',
    data: 'Assessment Form poll status have been switched',
  });
});
