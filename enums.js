const _ = require('lodash');

const AppError = require('./utils/app-errors');

const QuestionId = Object.freeze({
  Gender: '65d3a8780306fa10a0e60964',
  Age: '65d3ac2f0306fa10a0e609d0',
});

// Make sure to keep the values always as string format
const MentalHealthFormEnums = {
  Gender: Object.freeze({
    MALE: '1',
    FEMALE: '2',
    OTHERS: '3',
    PREFER_NOT_TO_SAY: '4',
  }),

  Age: Object.freeze({
    BELOW_20_YEARS: '1',
    '20-30 years': '2',
    '30-40 years': '3',
    'Above 40 years': '4',
  }),
};

// Enum helper
const getCategoryArray = (enumTitle) => {
  const enumObj = MentalHealthFormEnums[enumTitle];
  // console.log(enumObj);
  if (!enumObj) {
    return new AppError(400, `Enum with title "${enumTitle}" not found.`);
  }
  const enumArray = [];
  for (const key in enumObj) {
    if (enumObj.hasOwnProperty(key)) {
      enumArray.push({
        id: enumObj[key],
        label: _.capitalize(_.toLower(key.replace(/_/g, ' '))),
      });
    }
  }
  // console.log(enumArray);
  return enumArray;
};

module.exports = {
  // Enums
  QuestionId,
  MentalHealthFormEnums,
  // Enum helper
  getCategoryArray,
};
