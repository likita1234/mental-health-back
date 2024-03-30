const mongoose = require('mongoose');

const LanguageSchema = require('./language-schema');

const sectionSchema = new mongoose.Schema({
  title: {
    type: LanguageSchema,
    required: [true, 'Section title is mandatory'],
  },
  description: LanguageSchema,
  createdDate: {
    type: Date,
    default: Date.now,
  },
  updatedDate: {
    type: Date,
    default: Date.now,
  },
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
    },
  ],
});

sectionSchema.pre('save', function (next) {
  this.updatedDate = new Date();
  next();
});

// ===========> Pre-remove hook to check if the section is used in any AssessmentForms
sectionSchema.pre('remove', async function (next) {
  const formsWithSection = await mongoose.model('AssessmentForm').find({
    sections: this._id,
  });

  // Check if there is any sections that exists, if yes then throw error
  if (formsWithSection.length > 0) {
    const formNames = formsWithSection.map(
      (assessmentForm) => assessmentForm.name
    );
    const errorMessage = `Unable to delete the section because it is being used by following assessment forms: ${formNames.join(
      ', '
    )}`;

    return next(new AppError(errorMessage, 400));
  }
  //  Otherwise continue
  next();
});

const Section = mongoose.model('Section', sectionSchema);

module.exports = Section;
