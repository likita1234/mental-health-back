const Dashboard = require('../models/dashboard-model');

const metricController = require('../controller/metric-controller');
const {
  fetchQuestionDetailsById,
} = require('../controller/question-controller');

const AppError = require('../utils/app-errors');
const catchAsync = require('../utils/catch-async');

const { validateMetricIds } = require('../validators/dashboard-validators');

// Create an dashboard form
exports.createDashboard = catchAsync(async (req, res, next) => {
  // 1) Check if metrics exists, then verify all the metrics that exists are valid,
  const allMetrics = req.body.metrics?.map((metricObj) => metricObj.metricId);
  //   If there are any invalid metrics then return error
  const isValidMetrics = await validateMetricIds(allMetrics);
  if (!isValidMetrics) {
    return next(new AppError('Invalid metric Id in the request body', 400));
  }
  // 2) Otherwise, Save the Dashboard  data
  const newDashboard = await Dashboard.create({
    ...req.body,
  });

  // 3) Format response
  const populatedDashboard = await Dashboard.populate(newDashboard, {
    path: 'metrics',
    model: 'Metric',
  });

  // 4) Return response
  res.status(201).json({
    status: 'success',
    data: {
      dashboard: populatedDashboard,
    },
  });
});

// Fetch dashboard details
exports.getDashboardDetails = catchAsync(async (req, res, next) => {
  const { dashboardId } = req.params;
  // Check if dashboardId is valid or not
  const existingDashboard = await fetchDashboardDetailsById(dashboardId);

  if (!existingDashboard) {
    return next(new AppError('Invalid dashbard id in the request', 400));
  }
  // Extract basic dashboard details
  const { _id, title, description } = existingDashboard;
  // Extract metrics first
  const metrics = existingDashboard.metrics?.map((metricObj) => {
    return {
      order: metricObj.order,
      metricId: metricObj.metricId,
    };
  });

  res.status(200).json({
    status: 'success',
    data: {
      _id,
      title,
      description,
      metrics,
    },
  });
});

// Helper to fetch metric details
// ===========> Function to fetch question details
const fetchDashboardDetailsById = async (id) => {
  try {
    return await Dashboard.findOne({
      _id: id,
      active: true,
    }).select('-__v');
  } catch (error) {
    throw new Error('Error fetching dashboard details');
  }
};
