const mongoose = require('mongoose');

const LanguageSchema = require('./language-schema');

const assessmentFormSchema = new mongoose.Schema({
  title: {
    type: LanguageSchema,
    required: [true, 'Form title is mandatory'],
  },
  description: {
    type: LanguageSchema,
  },
  sections: [
    {
      order: Number,
      sectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
      },
    },
  ],
  type: {
    type: String,
    enum: ['private', 'public'],
    default: 'public',
  },
  active: {
    type: Boolean,
    default: true,
  },
  pollActive: {
    type: Boolean,
    default: true,
  },
  submissions: {
    type: Number,
    default: 0,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  updatedDate: {
    type: Date,
    default: Date.now,
  },
});

assessmentFormSchema.pre('save', function (next) {
  this.updatedDate = new Date();
  next();
});

// ==========>  Soft Delete Methods
assessmentFormSchema.methods.softDelete = async function () {
  //  Otherwise continue
  this.active = false;
  await this.save();
};

// ==========>  Poll Toggle Methods
assessmentFormSchema.methods.togglePoll = async function () {
  //  Otherwise continue
  this.pollActive = !this.pollActive;
  await this.save();
};

// ==========>  Increment submission count everytime a form have been submitted
assessmentFormSchema.methods.incrementSubmissionCount = async function () {
  this.submissions += 1;
  await this.save();
};

const AssessmentForm = mongoose.model('AssessmentForm', assessmentFormSchema);

module.exports = AssessmentForm;
