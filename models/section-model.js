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
      order: Number,
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
      },
    },
  ],
  active: {
    type: Boolean,
    default: true,
  },
});

sectionSchema.pre('save', function (next) {
  this.updatedDate = new Date();
  next();
});

// ==========>  modify active to false
sectionSchema.methods.softDelete = async function () {
  // check if the section is used in any AssessmentForms
  const formsWithSection = await mongoose.model('AssessmentForm').find({
    'sections.sectionId': this._id,
    active: true,
  });

  // Check if there is any sections that exists, if yes then throw error
  if (formsWithSection.length > 0) {
    const formNames = formsWithSection.map(
      (assessmentForm) => assessmentForm.name
    );
    const errorMessage = `Unable to delete the section because it is being used by following assessment forms: ${formNames.join(
      ', '
    )}`;

    throw new AppError(errorMessage, 400);
  }
  //  Otherwise continue
  this.active = false;
  await this.save();
};

const Section = mongoose.model('Section', sectionSchema);

module.exports = Section;
