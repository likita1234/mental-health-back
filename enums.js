const AppError = require('./utils/app-errors');

// Make sure to keep the values always as string format
// Genders
const MentalHealthFormEnums = {
  Gender: Object.freeze({
    MALE: '1',
    FEMALE: '2',
    OTHERS: '3',
    PREFER_NOT_TO_SAY: '4',
  }),
};

// Enum helper
const getCategoryArray = (enumTitle) => {
  const formattedTitle = capitalizeFirstLetter(enumTitle);
  const enumObj = MentalHealthFormEnums[formattedTitle];
  // console.log(enumObj);
  if (!enumObj) {
    return new AppError(400, `Enum with title "${enumTitle}" not found.`);
  }
  const enumArray = [];
  for (const key in enumObj) {
    if (enumObj.hasOwnProperty(key)) {
      enumArray.push({
        id: enumObj[key],
        label: capitalizeFirstLetter(key?.replace(/_/g, ' ')?.toLowerCase()),
      });
    }
  }
  // console.log(enumArray);
  return enumArray;
};

// helper functions
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = {
  // Enums
  MentalHealthFormEnums,
  // Enum helper
  getCategoryArray,
};
