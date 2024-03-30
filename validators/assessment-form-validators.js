const Section = require('../models/section-model');

exports.validateSectionIds = async (sections) => {
  // Check if all sections exists, then verify all the sections that exists are valid
  if (sections && sections.length > 0) {
    //  Check if each section Id in req.body.sections exists in the Section model
    const validSections = await Section.find({
      _id: { $in: sections },
    });
    // Extract only the ids and convert them into string type to make comparisons easier
    const validSectionsIds = validSections?.map((section) =>
      section._id.toString()
    );

    // Check if all section Ids are valid
    const sectionsValid = sections.every((section) => {
      return validSectionsIds.includes(section.toString());
    });
    return sectionsValid;
  }
  return true;
};
