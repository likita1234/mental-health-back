const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AssessmentForm',
  },
  type: {
    type: String,
    enum: ['private', 'public'],
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
  },
  answer: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

answerSchema.pre('save', function (next) {
  this.updatedDate = new Date();
  next();
});

const Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;
