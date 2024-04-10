const Dashboard = require('../models/dashboard-model');

const formController = require('../controller/assessment-form-controller');
const metricController = require('../controller/metric-controller');

const APIFeatures = require('../utils/api-features');
const AppError = require('../utils/app-errors');
const catchAsync = require('../utils/catch-async');

const { validateMetricIds } = require('../validators/dashboard-validators');

// =======> Extract all dashboards
exports.getAllDashboards = catchAsync(async (req, res, next) => {
  // Execute Query
  const features = new APIFeatures(Dashboard.find({ active: true }), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const dashboards = await features.query;

  // Create a new APIFeatures instance without pagination to count total documents
  const countFeatures = new APIFeatures(
    Dashboard.find({ active: true }),
    req.query
  )
    .filter()
    .sort()
    .limitFields();

  // Count the total number of documents without pagination
  const total = await Dashboard.countDocuments(countFeatures.query.getFilter());

  res.status(200).json({
    status: 'success',
    data: {
      dashboards,
      total,
    },
  });
});

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

// Update dashboard details
exports.updateDashboardDetails = catchAsync(async (req, res, next) => {
  const { dashboardId } = req.params;

  // Check if dashboardId is valid
  const existingDashboard = await fetchDashboardDetailsById(dashboardId);
  if (!existingDashboard) {
    return next(new AppError('Invalid dashboard id in the request', 400));
  }

  // Update the dashboard properties
  existingDashboard.title = req.body.title || existingDashboard.title;
  existingDashboard.description =
    req.body.description || existingDashboard.description;

  // Update metrics if provided
  if (req.body.metrics) {
    const allMetrics = req.body.metrics?.map((metricObj) => metricObj.metricId);
    const isValidMetrics = await validateMetricIds(allMetrics);
    if (!isValidMetrics) {
      return next(new AppError('Invalid metric Id in the request body', 400));
    }
    existingDashboard.metrics = req.body.metrics;
  }

  // Save the updated dashboard
  await existingDashboard.save();

  // Format and return the response
  const { _id, title, description } = existingDashboard;
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

// Get dashboard data
exports.getDashboardData = catchAsync(async (req, res, next) => {
  const { dashboardId } = req.params;
  // Check if dashboardId is valid or not
  const existingDashboard = await fetchDashboardDetailsById(dashboardId);
  if (!existingDashboard) {
    return next(new AppError('Invalid dashbard id in the request', 400));
  }
  // Extract basic dashboard details
  const { _id, title, description, metrics } = existingDashboard;
  // Extract metrics first
  const metricIds = existingDashboard.metrics?.map(
    (metricObj) => metricObj.metricId
  );

  const allMetricsData = await metricController.fetchMetricsDataByIds(
    metricIds,
    next
  );

  res.status(200).json({
    status: 'success',
    data: allMetricsData,
  });
});

// Get overall personal dashboard related data
exports.getOverallPersonalData = catchAsync(async (req, res, next) => {
  // For now hard code the form id :-660ed11ce890ed380ca89c14
  const formId = '660ed11ce890ed380ca89c14';
  // First fetch the assessment details by Id
  const existingForm = await formController.fetchFormDetailsById(formId);
  // Check if form exists
  if (!existingForm) {
    return next(new AppError('No assessment form found with that id', 404));
  }

// Initiate variable to store allQuestions
  let allQuestions = [];
  let allTitles = [];
  existingForm?.sections?.map((sectionObj) => {
    const sectionData = sectionObj.sectionId;
    const sectionTitle = sectionData?.title.english;
    const questions = sectionData?.questions?.map((questionObj) => {
      const questionData = questionObj.questionId;
      allTitles.push({
        questionId: questionData._id,
        title: sectionTitle,
      });
      return {
        _id: questionData._id,
        type: questionData.type,
      };
    });
    // Push all questions into one
    allQuestions = allQuestions.concat(questions);
  });

  // Filter out questions by ratings and longtext types
  const ratingTypeQuestions = allQuestions
    ?.filter((question) => question.type === 'ratings')
    ?.map((question) => question._id);

  // We are not using longtextTypeQuestion analysis atm
  // const longtextTypeQuestions = allQuestions
  //   ?.filter((question) => question.type === 'longtext')
  //   ?.map((question) => question._id);

  const data = await metricController.getPersonalRatingsData(
    formId,
    ratingTypeQuestions
  );

  res.status(200).json({
    status: 'success',
    data: {
      total: data.length,
      allTitles,
      data,
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
