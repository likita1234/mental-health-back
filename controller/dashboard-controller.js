const Dashboard = require('../models/dashboard-model');

const AppError = require('../utils/app-errors');
const catchAsync = require('../utils/catch-async');

const { validateMetricIds } = require('../validators/dashboard-validators');
// Create an assessment form
exports.createDashboard = catchAsync(async (req, res, next) => {
  // 1) Check if metrics exists, then verify all the metrics that exists are valid,
  const allMetrics = req.body.metrics?.map((metricObj) => metricObj.metricId);
  //   If there are any invalid metrics then return error
  const isValidMetrics = await validateMetricIds(allMetrics);
  if (!isValidMetrics) {
    return next(new AppError('Invalid metric Id in the request body', 400));
  }
  // 2) Otherwise, Save the ASsessment Form data
  const newForm = await Dashboard.create({
    ...req.body,
  });

  // 3) Format response
  const populatedForm = await Dashboard.populate(newForm, {
    path: 'metrics',
    model: 'Metric',
  });

  // 4) Return response
  res.status(201).json({
    status: 'success',
    data: {
      metric: populatedForm,
    },
  });
});
