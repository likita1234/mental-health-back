const mongoose = require('mongoose');
const Metric = require('../models/metric-model');

const APIFeatures = require('../utils/api-features');
const AppError = require('../utils/app-errors');
const catchAsync = require('../utils/catch-async');

const Answer = require('../models/answer-model');
const QuestionController = require('../controller/question-controller');
const SectionController = require('../controller/section-controller');

const { validateQuestionIds } = require('../validators/section-validators');
const {
  validateSectionIds,
} = require('../validators/assessment-form-validators');

// =======> Extract all metrics
exports.getAllMetrics = catchAsync(async (req, res, next) => {
  // Execute Query
  const features = new APIFeatures(Metric.find({ active: true }), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const metrics = await features.query;

  // Create a new APIFeatures instance without pagination to count total documents
  const countFeatures = new APIFeatures(
    Metric.find({ active: true }),
    req.query
  )
    .filter()
    .sort()
    .limitFields();

  // Count the total number of documents without pagination
  const total = await Metric.countDocuments(countFeatures.query.getFilter());

  res.status(200).json({
    status: 'success',
    data: {
      metrics,
      total,
    },
  });
});

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

// Make data analysis on the basis of individual question representing a particular form
// questionId, formId and chartType mandatory
// passing id as well so as to utilize this function from somewhere else
exports.getMetricData = catchAsync(async (req, res, next) => {
  // Extract metricId from params
  const { metricId } = req.params;
  // Fetch metric details first
  const existingMetric = await this.fetchMetricDetails(metricId);

  if (!existingMetric) {
    return next(
      new AppError(`Metric details with ID ${metricId} not found`, 400)
    );
  }
  // Now, extract the required information from metric details
  const {
    _id,
    title,
    type,
    description,
    formId,
    questionId,
    sectionId,
    chartType,
  } = existingMetric;

  // Initiate an empty metric data
  let metricData = {};

  // Now check what chart type it is expecting
  // CASE 1: type ==========> question
  if (type === 'question') {
    // If Type is question, fetch question details first
    const existingQuestion = await QuestionController.fetchQuestionDetailsById(
      questionId
    );
    if (!existingQuestion) {
      return next(
        new AppError(`Question with ID ${questionId} not found`, 400)
      );
    }
    // CASE 1.1: chartType-> table, bar, pie, line
    if (['table', 'bar', 'pie', 'line', 'ratings'].includes(chartType)) {
      metricData = await this.getAggregatedData(
        formId,
        questionId,
        existingQuestion
      );
    }
    // ========> CASE 1.2:- NLP included where its only for text area type or text types
  }
  // CASE 2: type =======> section
  else if (type === 'section') {
    // CASE 2.1: chartType ===========> question-ratings-summation
    if (chartType === 'question-ratings-summation') {
      const data = await this.getQuestionRatingsSummation(formId, sectionId);
      let labels = [];
      let counts = [];
      let answers = [];
      for (let i = 0; i < data?.length; i++) {
        labels.push(data[i].label);
        counts.push(data[i].count);
        answers = answers.concat(data[i].answers);
      }
      metricData = {
        data: {
          labels,
          data: [{ label: title, count: counts }],
        },
        answers,
      };
    }
  }
  res.status(200).json({
    status: 'success',
    data: {
      id: _id,
      title,
      description,
      chartType,
      metricData,
    },
  });
});

// Helper to fetch metric details
// ===========> Function to fetch question details
exports.fetchMetricDetails = async (metricId) => {
  try {
    return await Metric.findOne({
      _id: metricId,
      active: true,
    }).select('-__v');
  } catch (error) {
    throw new Error('Error fetching metric details');
  }
};

// Helpers for aggregation of data
// Later optimize the questionId and questionDetails
exports.getAggregatedData = async (formId, questionId, questionDetails) => {
  // Extract all the options from the questionDetails first
  const isCheckboxType = questionDetails?.type === 'checkbox';
  const isRatingsType = questionDetails?.type === 'ratings';
  // Unique scenario for question type of ratings and metric chartType is also ratings (options will be same as values)
  const optionsMappings = isRatingsType
    ? getRatingsOptionsDetails()
    : getOptionsDetails(questionDetails);
  console.log(optionsMappings);
  const defaultGroupingLabel = 'Group by ' + questionDetails?.title?.english;
  // Construct branches
  const branches = optionsMappings?.map((mapping) => ({
    case: { $eq: ['$_id', mapping.value] },
    then: mapping.label,
  }));

  const responseData = isCheckboxType
    ? await handleMultipleDataAggregation(formId, questionId, branches)
    : await handleSingleDataAggregation(formId, questionId, branches);
  return { ...responseData[0], labels: [defaultGroupingLabel] };
};

exports.getQuestionRatingsSummation = async (formId, sectionId) => {
  // First fetch the section details
  // const sectionDetails = await SectionController.fetchSectionDetailsById(
  //   sectionId
  // );
  // Extract all the questionIds in mongoose.Types.ObjectId format
  // const allQuestionIds = sectionDetails?.questions.map((question) => {
  //   return mongoose.Types.ObjectId(question._id);
  //   // return question._id;
  // });
  // Your aggregation pipeline
  const responseData = await Answer.aggregate([
    // Match the condition ======> formId
    {
      $match: {
        formId: mongoose.Types.ObjectId(formId),
      },
    },
    // Group by userId and push all answers inside
    {
      $group: {
        _id: '$userId',
        answers: { $push: '$$ROOT' }, // Push entire documents into the answers array
      },
    },
    {
      $project: {
        _id: 1,
        answers: {
          $filter: {
            input: '$answers',
            as: 'answer',
            cond: {
              $in: [
                '$$answer.questionId',
                // allQuestionIds,
                // allQuestionIds.map((id) => mongoose.Types.ObjectId(id)),
                [
                  mongoose.Types.ObjectId('65d5ee0a9180ec34b4a0b845'),
                  mongoose.Types.ObjectId('65d5ef029180ec34b4a0b8ac'),
                  mongoose.Types.ObjectId('65d5efdd9180ec34b4a0b8dc'),
                  mongoose.Types.ObjectId('65d5f0cc9180ec34b4a0b90e'),
                  mongoose.Types.ObjectId('65d5f1709180ec34b4a0b942'),
                ],
              ],
            },
          },
        },
      },
    },
    // Convert answer field to integer format for each document in the answers array
    {
      $addFields: {
        answers: {
          $map: {
            input: '$answers',
            as: 'answer',
            in: {
              $mergeObjects: [
                '$$answer',
                {
                  answer: {
                    $toInt: { $multiply: [{ $toInt: '$$answer.answer' }, 4] }, // Multiply answer by 4 and convert to integer
                  },
                },
              ],
            },
          },
        },
      },
    },
    // Calculate the sum of answers for each document
    {
      $addFields: {
        WHOIndexTotalSum: {
          $reduce: {
            input: '$answers',
            initialValue: 0,
            in: {
              $add: ['$$value', '$$this.answer'], // sum of answer field
            },
          },
        },
      },
    },
    // Calculation summation part,
    {
      $group: {
        _id: '$WHOIndexTotalSum',
        count: { $sum: 1 },
        answers: { $addToSet: '$answers' },
      },
    },
    // Sort by _id in ascending order
    { $sort: { _id: 1 } },
    // Project _id as label
    { $project: { label: '$_id', count: 1, answers: 1 } },
    // Remove the _id key
    { $unset: '_id' },
  ]);

  return responseData;
};

const handleSingleDataAggregation = async (formId, questionId, branches) => {
  return await Answer.aggregate([
    // Match only the documents where the answer is within the valid range (1-4)
    {
      $match: {
        formId: mongoose.Types.ObjectId(formId),
        questionId: mongoose.Types.ObjectId(questionId),
      },
    },
    // Group the documents by the answer value and count occurrences
    {
      $group: {
        _id: '$answer',
        count: { $sum: 1 },
      },
    },
    // Project to rename the answer values with their corresponding gender labels
    {
      $project: {
        label: {
          $switch: {
            branches,
            default: 'Unknown',
          },
        },
        count: 1,
        _id: 0,
      },
    },
    // Group again to calculate the total count
    {
      $group: {
        _id: null,
        data: { $push: { label: '$label', count: '$count' } },
        totalCount: { $sum: '$count' },
      },
    }, // Project to calculate percentage
    {
      $project: {
        data: {
          $map: {
            input: '$data',
            as: 'item',
            in: {
              label: '$$item.label',
              count: '$$item.count',
              percent: {
                $round: [
                  {
                    $multiply: [
                      { $divide: ['$$item.count', '$totalCount'] },
                      100,
                    ],
                  },
                  2,
                ],
              },
            },
          },
        },
        totalCount: 1,
        _id: 0,
      },
    },
  ]);
};

const handleMultipleDataAggregation = async (formId, questionId, branches) => {
  return await Answer.aggregate([
    // Match only the documents where the answer is within the valid range (1-4)
    {
      $match: {
        formId: mongoose.Types.ObjectId(formId),
        questionId: mongoose.Types.ObjectId(questionId),
      },
    },
    // Split the answer array and treat each value as a separate document
    {
      $addFields: {
        answers: { $split: ['$answer', ', '] }, // Assuming values are separated by ', '
      },
    },
    {
      $unwind: '$answers',
    },
    // Group the documents by the answer value and count occurrences
    {
      $group: {
        _id: '$answers',
        count: { $sum: 1 },
      },
    },
    // Project to rename the answer values with their corresponding gender labels
    {
      $project: {
        label: {
          $switch: {
            branches,
            default: 'Unknown',
          },
        },
        count: 1,
        _id: 0,
      },
    },
    // Group again to calculate the total count
    {
      $group: {
        _id: null,
        data: { $push: { label: '$label', count: '$count' } },
        totalCount: { $sum: '$count' },
      },
    }, // Project to calculate percentage
    {
      $project: {
        data: {
          $map: {
            input: '$data',
            as: 'item',
            in: {
              label: '$$item.label',
              count: '$$item.count',
              percent: {
                $round: [
                  {
                    $multiply: [
                      { $divide: ['$$item.count', '$totalCount'] },
                      100,
                    ],
                  },
                  2,
                ],
              },
            },
          },
        },
        totalCount: 1,
        _id: 0,
      },
    },
  ]);
};

// Extract options details in formatted manner
const getOptionsDetails = (questionDetails) => {
  return questionDetails?.options?.map((option) => {
    return {
      label: option?.title?.english,
      value: option?.optionValue?.toString(),
    };
  });
};

// Extract options labelings for ratings
const getRatingsOptionsDetails = () => {
  return [
    { label: 'Very Poor', value: 1 },
    { label: 'Poor', value: 2 },
    { label: 'Neutral', value: 3 },
    { label: 'Good', value: 4 },
    { label: 'Very Good', value: 5 },
  ]?.map((obj) => {
    return {
      ...obj,
      value: obj.value.toString(),
    };
  });
};
