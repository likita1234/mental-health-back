const { DateTime } = require('luxon');

exports.createUniqueDateString = () => {
  const currentDate = DateTime.now();

  // Format date and time components
  const uniqueDateString = currentDate.toFormat('yyyyMMdd_HHmmss_SSS');

  return uniqueDateString;
};
