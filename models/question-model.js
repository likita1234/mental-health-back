const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: [true, 'Question label is mandatory'],
    trim: true,
  },
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
