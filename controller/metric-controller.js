const Metric = require('../models/metric-model');

const APIFeatures = require('../utils/api-features');
const AppError = require('../utils/app-errors');
const catchAsync = require('../utils/catch-async');
const { validateQuestionIds } = require('../validators/section-validators');
const {
  validateSectionIds,
} = require('../validators/assessment-form-validators');

// Create a new metric
exports.addMetric = catchAsync(async (req, res, next) => {
  // Fetch the type of metric
  const { type, questionId, sectionId } = req.body;

  const questionType = type === 'question';
  /** On the basis of type, verify if the questionId or sectionId is valid or not
   *  We already have validators so we will utilize them,
   *  but since they support array form, we will convert it into array
   */

  const isValid = questionType
    ? validateQuestionIds([questionId])
    : validateSectionIds([sectionId]);

  // Respond error if its invalid
  if (!isValid) {
    return next(new AppError('Invalid question Id in the request body', 400));
  }
  //   Otherwise create a new metric

  const newMetric = await Metric.create({
    ...req.body,
  });

  res.status(201).json({
    status: 'success',
    data: {
      metric: newMetric,
    },
  });
});
