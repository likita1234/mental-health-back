const mongoose = require('mongoose');

const QuestionOptionSchema = mongoose.Schema(
  {
    optionName: {
      type: String,
      required: [true, 'Option name is mandatory'],
    },
    optionValue: {
      type: Number,
      required: true,
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
  },
);

const QuestionOption = mongoose.model('QuestionOption', QuestionOptionSchema);

module.exports = QuestionOption;
