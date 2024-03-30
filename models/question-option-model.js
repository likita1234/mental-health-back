const mongoose = require('mongoose');
const LanguageSchema = require('./language-schema');
const QuestionOptionSchema = mongoose.Schema(
  {
    title: {
      type: LanguageSchema,
      required: [true, 'Option title is mandatory'],
    },
    optionValue: {
      type: Number,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    select: '_id, optionName,optionValue',
  }
);

const QuestionOption = mongoose.model('QuestionOption', QuestionOptionSchema);

module.exports = QuestionOption;
