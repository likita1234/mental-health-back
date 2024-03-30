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
  userId: String, // We will set it as string because, it could be null and random date string as well
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
