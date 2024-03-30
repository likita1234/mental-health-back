const mongoose = require('mongoose');

const metricSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Metric title id required'],
  },
  description: {
    type: String,
    required: [true, 'Metric description required'],
  },
  type: {
    type: String,
    required: [true, 'Select either of the options'],
    enum: ['question', 'section'],
    default: 'question',
  },
  chartType: {
    type: String,
    required: [true, 'Select either of the options'],
    enum: ['table', 'bar', 'pie', 'line', 'combo', 'ratings'],
    default: 'table',
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AssessmentForm',
    required: [true, 'Must specify particular assessment form'],
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
  },
  sectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  updatedDate: {
    type: Date,
    default: Date.now,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

metricSchema.pre('save', function (next) {
  this.updatedDate = new Date();
  next();
});

// ==========>  modify active to false
metricSchema.methods.softDelete = async function () {
  this.active = false;
  await this.save();
};

const Metric = mongoose.model('Metric', metricSchema);

module.exports = Metric;
