const Section = require('../models/section-model');

exports.validateSectionIds = async (sections) => {
  // Check if all sections exists, then verify all the sections that exists are valid
  if (sections && sections.length > 0) {
    //  Check if each question Id in req.body.sections exists in the Question model
    const invalidSectionIds = await Section.find({
      _id: { $in: sections },
    }).select('_id');

    // Check if all section Ids are valid
    const isValidSections = sections.every((sectionId) =>
      invalidSectionIds.includes(sectionId.toString())
    );
    return isValidSections;
  }
  return true;
};
