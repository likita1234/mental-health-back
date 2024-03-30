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
    enum: ['text', 'number', 'dropdown', 'radio', 'checkbox', 'ratings'],
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
});

// ===========> Updated date updated everytime new save
questionSchema.pre('save', function (next) {
  this.updatedDate = new Date();
  next();
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
