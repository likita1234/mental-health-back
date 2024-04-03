const mongoose = require('mongoose');
const Metric = require('../models/metric-model');

const APIFeatures = require('../utils/api-features');
const AppError = require('../utils/app-errors');
const catchAsync = require('../utils/catch-async');

const Answer = require('../models/answer-model');
const QuestionController = require('../controller/question-controller');
const SectionController = require('../controller/section-controller');

const { analyzeKeywordsFrequencyInAnswers } = require('../utils/nlp-handler');
const { validateQuestionIds } = require('../validators/section-validators');
const {
  validateSectionIds,
} = require('../validators/assessment-form-validators');

// Resuable variables
// To filter out unwanted type from the sectionQuestionIds
const unwantedTypes = ['ratings', 'text', 'longtext'];

// =======> Extract all metrics
exports.getAllMetrics = catchAsync(async (req, res, next) => {
  // Execute Query
  const features = new APIFeatures(Metric.find({ active: true }), req.query)
    .filter()
    .sort()
    .limitFields();
  // .paginate();
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

  const metricData = await fetchMetricData(
    {
      formId,
      questionId,
      sectionId,
      title,
      chartType,
      type,
    },
    next
  );

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

// Make table analysis of every sections by a particular formId
exports.getTableAnalysisByFormAndSection = catchAsync(
  async (req, res, next) => {
    const { formId, sectionId } = req.params;
    // Initiate an empty metric data
    let metricData = {};
    // Extract all the questionIds
    const { sectionDetails, sectionQuestionIds } =
      await SectionController.fetchQuestionIdsBySectionId(
        sectionId,
        unwantedTypes
      );
    metricData = await handleSectionTablesByQuestions(
      formId,
      sectionQuestionIds
    );
    res.status(200).json({
      status: 'success',
      data: {
        sectionDetails,
        metricData,
      },
    });
  }
);

// Keywords based Analysis of Questions of type Open end and text type
exports.getKeywordsAnalysisByQuestion = catchAsync(async (req, res, next) => {
  const { formId, questionId } = req.params;
  // Check questionId validity
  if (!questionId) {
    res.status(401).json({
      status: 'fail',
      message: `Invalid question id ${questionId}`,
    });
  }

  // Fetch keywords information
  const response = await getAnswerKeywordsAnalysisByQuestionId(
    formId,
    questionId
  );

  res.status(200).json({
    status: 'success',
    data: response,
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

// =========> Private functions starts ==============>>>>>>>>>>
// Helper to fetch multiple metrics data at once => At the moment it only supports one metric with question type of ratings
exports.fetchMetricsDataByIds = async (metricIds, next) => {
  let overallMetricData = [];
  // Loop through each metric Id and fetch its data
  for (let i = 0; i < metricIds.length; i++) {
    const metricId = metricIds[i];
    // Fetch metric details first
    const existingMetric = await this.fetchMetricDetails(metricId);
    // Fetch metric details
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

    // Now Fetch every metric datadata
    const metricData = await fetchMetricData(
      {
        formId,
        questionId,
        sectionId,
        title,
        chartType,
        type,
      },
      next
    );

    overallMetricData.push({
      id: _id,
      title,
      description,
      metricData,
    });
  }
  return overallMetricData;
};

// Extract metric data
const fetchMetricData = async (
  { formId, questionId, sectionId, type, chartType, title },
  next
) => {
  // Initiate an empty metric data
  let metricData = {};

  // Now check what chart type it is expecting
  // CASE 1: type ==========> question
  if (type === 'question') {
    metricData = await handleQuestionTypeMetricData(
      { formId, questionId, chartType },
      next
    );
  }
  // CASE 2: type =======> section
  else if (type === 'section') {
    metricData = await handleSectionTypeMetricData({
      title,
      formId,
      sectionId,
      chartType,
    });
  }

  return metricData;
};

const handleQuestionTypeMetricData = async (
  { formId, questionId, chartType },
  next
) => {
  // If Type is question, fetch question details first
  const existingQuestion = await QuestionController.fetchQuestionDetailsById(
    questionId
  );
  if (!existingQuestion) {
    return next(new AppError(`Question with ID ${questionId} not found`, 400));
  }
  // CASE 1.1: chartType-> table, bar, pie, line, ratings
  if (['table', 'bar', 'pie', 'line', 'ratings'].includes(chartType)) {
    return await getAggregatedData(formId, questionId, existingQuestion);
  }
  return {};
};

const handleSectionTypeMetricData = async ({
  title,
  formId,
  sectionId,
  chartType,
}) => {
  // In case of section, there are possibilites of requiring to use questionIds so we will fetch it here
  // Extract all the questionIds in string format
  const { sectionQuestionIds } =
    await SectionController.fetchQuestionIdsBySectionId(
      sectionId,
      unwantedTypes
    );
  // CASE 2.1: chartType ===========> question-options-summation (ONLY USED FOR WHO-5 At the moment)
  if (chartType === 'question-options-summation') {
    const data = await getQuestionOptionsSummation(formId, sectionQuestionIds);
    // For percent calculation
    let totalCountSum = 0;
    data?.forEach((dataObj) => (totalCountSum += dataObj.count));
    let labels = [];
    let counts = [];
    let percent = [];
    // let answers = [];
    for (let i = 0; i < data?.length; i++) {
      labels.push(data[i].label);
      counts.push(data[i].count);
      percent.push(((data[i].count / totalCountSum) * 100).toFixed(2));
      // answers = answers.concat(data[i].answers); //for temp
    }
    return {
      data: {
        labels,
        data: [{ label: title, count: counts, percent }],
      },
      // answers, // for temp
    };
  }
  return {};
};

// Helpers for aggregation of data
// Later optimize the questionId and questionDetails
const getAggregatedData = async (formId, questionId, questionDetails) => {
  // Extract all the options from the questionDetails first
  const isCheckboxType = questionDetails?.type === 'checkbox';
  const isRatingsType = questionDetails?.type === 'ratings';
  // Unique scenario for question type of ratings and metric chartType is also ratings (options will be same as values)
  const optionsMappings = isRatingsType
    ? getRatingsOptionsDetails()
    : getOptionsDetails(questionDetails);
  const defaultGroupingLabel = 'Metric grouped by';
  // Construct branches
  const branches = optionsMappings?.map((mapping) => ({
    case: { $eq: ['$_id', mapping.value] },
    then: mapping.label,
  }));
  const response = isCheckboxType
    ? await handleMultipleDataAggregation(formId, questionId, branches)
    : await handleSingleDataAggregation(formId, questionId, branches);
  let sortedData = null;
  if (response) {
    sortedData = sortArrayByOrder(response[0]?.data, optionsMappings);
  }
  return {
    totalCount: response[0]?.totalCount ?? null,
    data: sortedData,
    labels: [defaultGroupingLabel],
  };
};

const getQuestionOptionsSummation = async (formId, sectionQuestionIds) => {
  return await Answer.aggregate([
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
              $in: ['$$answer.questionId', sectionQuestionIds],
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
        // answers: { $addToSet: '$answers' }, // Removed temp
      },
    },
    // Sort by _id in ascending order
    { $sort: { _id: 1 } },
    // Project _id as label
    { $project: { label: '$_id', count: 1, answers: 1 } },
    // Remove the _id key
    { $unset: '_id' },
  ]);
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

// Handler for Section type Questions Table
const handleSectionTablesByQuestions = async (formId, sectionQuestionIds) => {
  const aggregatedData = await Answer.aggregate([
    // Match the condition ======> formId
    {
      $match: {
        formId: mongoose.Types.ObjectId(formId),
      },
    },
    // Project stage to push entire documents into an array
    {
      $group: {
        _id: '$userId',
        answers: { $push: '$$ROOT' }, // Push entire documents into the answers array
      },
    },
    // Filter answers where answer.questionId is in sectionQuestionIds array
    {
      $project: {
        _id: 1,
        answers: {
          $filter: {
            input: '$answers',
            as: 'answer',
            cond: {
              $in: ['$$answer.questionId', sectionQuestionIds],
            },
          },
        },
      },
    },
    // Project stage to keep only questionId and answer fields inside each object of the answers array
    {
      $project: {
        _id: 1,
        answers: {
          $map: {
            input: '$answers',
            as: 'answer',
            in: {
              questionId: '$$answer.questionId',
              answer: '$$answer.answer',
            },
          },
        },
      },
    },
  ]);

  // Step 1: Inititate a questionOptions array and extract options for each questionId and push it in
  const allQuestionOptions =
    await QuestionController.fetchQuestionIdTitleAndOptions(sectionQuestionIds);

  // Step 2: Convert the options from {questionId: "", questionOptions: []} into {questionId: [questionOptions]} format
  const optionsMap = allQuestionOptions.reduce(
    (map, { questionId, questionOptions }) => {
      map[questionId] = {};
      questionOptions.forEach(({ label, value }) => {
        map[questionId][value] = label;
      });
      return map;
    },
    {}
  );

  // Step 3: Group the answers by questionId
  const groupedData = aggregatedData.reduce((acc, obj) => {
    obj.answers.forEach(({ questionId, answer }) => {
      if (!acc[questionId]) {
        acc[questionId] = [];
      }
      acc[questionId].push(answer);
    });
    return acc;
  }, {});

  // Step 3: Calculate sums of answers for each option
  const result = Object.entries(groupedData).map(([questionId, answers]) => {
    const answerCounts = answers.reduce((counts, answer) => {
      counts[answer] = (counts[answer] || 0) + 1;
      return counts;
    }, {});

    // Initialize sums for options 1 to 5
    const sumAnswers = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    Object.entries(sumAnswers).forEach(([option, _]) => {
      sumAnswers[option] = answerCounts[option] || 0;
    });

    return { questionId, answers: [sumAnswers] };
  });

  // Use the mapping object to update answer keys to labels in the result
  const mappedResult = result.map(({ questionId, answers }) => ({
    questionId,
    answers: answers.map((answer) => {
      const mappedAnswer = {};
      Object.entries(answer).forEach(([value, count]) => {
        // Only map keys with non-zero counts
        if (count !== 0) {
          mappedAnswer[optionsMap[questionId][value]] = count;
        }
      });
      return mappedAnswer;
    }),
  }));

  // Replace questionId with questionTitle
  const finalMappedResult = mappedResult.map(({ questionId, answers }) => {
    // console.log(questionId);
    const { questionTitle } = allQuestionOptions.find(
      (question) => question.questionId == questionId
    );
    return {
      questionTitle,
      answers,
    };
  });

  return finalMappedResult;
};

// Function for analysis of keywords
const getAnswerKeywordsAnalysisByQuestionId = async (formId, questionId) => {
  const answersByUserId = await Answer.aggregate([
    // Match the condition ======> formId and questionId
    {
      $match: {
        formId: mongoose.Types.ObjectId(formId),
        questionId: mongoose.Types.ObjectId(questionId),
      },
    },
    // Project stage to push entire documents into an array
    {
      $group: {
        _id: '$userId',
        answer: { $first: '$answer' },
      },
    },
  ]);

  // Extract each answer
  const overallAnswers = answersByUserId?.map((answerObj) => answerObj.answer);
  // Initiate new array to store all details along with keywords info
  const frequentKeywordsByUsers = await analyzeKeywordsFrequencyInAnswers(
    overallAnswers
  );
  return {
    keywords: frequentKeywordsByUsers,
    answers: answersByUserId,
  };
};

// Handler sorting orders by options
const sortArrayByOrder = (originalArray, orderArray) => {
  // Create a map from label to position in orderArray
  const labelToPosition = new Map(
    orderArray.map(({ label }, index) => [label, index])
  );

  // Sort originalArray based on the position of labels in orderArray
  return originalArray?.slice()?.sort((a, b) => {
    const positionA = labelToPosition.get(a.label);
    const positionB = labelToPosition.get(b.label);
    return positionA - positionB;
  });
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
    { label: 'Very Poor (1)', value: 1 },
    { label: 'Poor (2)', value: 2 },
    { label: 'Neutral (3)', value: 3 },
    { label: 'Good (4)', value: 4 },
    { label: 'Very Good (5)', value: 5 },
  ]?.map((obj) => {
    return {
      ...obj,
      value: obj.value.toString(),
    };
  });
};

// =========> Private functions ends =============>>>>>>>>>>
