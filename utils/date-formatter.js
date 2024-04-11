const { DateTime } = require('luxon');

exports.createUniqueDateString = () => {
  const currentDate = DateTime.now();

  // Format date and time components
  const uniqueDateString = currentDate.toFormat('yyyyMMdd_HHmmss_SSS');

  return uniqueDateString;
};

exports.getMonthStartEndDate = () => {
  // Get the current date
  const currentDate = DateTime.now();

  // Get the start date of the current month
  const startDate = currentDate.startOf('month').toISODate();

  // Get the end date of the current month
  const endDate = currentDate.endOf('month').toISODate();

  return { startDate, endDate };
};
