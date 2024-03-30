const Metric = require('../models/metric-model');

exports.validateMetricIds = async (metrics) => {
  // Check if all metrics exists, then verify all the metrics that exists are valid
  if (metrics && metrics.length > 0) {
    //  Check if each metric Id in req.body.metrics exists in the metric model
    const validMetrics = await Metric.find({
      _id: { $in: metrics },
    });
    // Extract only the ids and convert them into string type to make comparisons easier
    const validMetricsIds = validMetrics?.map((metric) =>
      metric._id.toString()
    );

    // Check if all metric Ids are valid
    const metricsValid = metrics.every((metric) => {
      return validMetricsIds.includes(metric.toString());
    });
    return metricsValid;
  }
  return true;
};
