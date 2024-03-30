const mongoose = require('mongoose');
const LanguageSchema = require('./language-schema');
const AppError = require('../utils/app-errors');

const questionSchema = new mongoose.Schema({
  title: {
    type: LanguageSchema,
    required: [true, 'Question title is mandatory'],
  },
  description: LanguageSchema,
  type: {
    type: String,
    required: true,
    enum: [
      'text',
      'longtext',
      'number',
      'dropdown',
      'radio',
      'checkbox',
      'ratings',
    ],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  updatedDate: {
    type: Date,
    default: Date.now,
  },
  options: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'QuestionOption',
    },
  ],
  active: {
    type: Boolean,
    default: true,
  },
  answer: {
    type: String,
    default: null,
  },
});

// ===========> Updated date updated everytime new save
questionSchema.pre('save', function (next) {
  this.updatedDate = new Date();
  this.answer = null;
  next();
});

// ==========>  modify active to false
questionSchema.methods.softDelete = async function () {
  // check if the question is used in any Sections
  const sectionsWithQuestion = await mongoose.model('Section').find({
    'questions.questionId': this._id,
    active: true,
  });

  // Check if there is any sections that exists, if yes then throw error
  if (sectionsWithQuestion.length > 0) {
    const sectionNames = sectionsWithQuestion.map((section) => section.title);
    const errorMessage = `Unable to delete the question because it is being used by following sections: ${sectionNames.join(
      ', '
    )}`;
    throw new AppError(errorMessage, 400);
  }
  //  Otherwise continue soft delete
  this.active = false;
  await this.save();
};

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
