const mongoose = require('mongoose');

const dashboardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Dashboard title is mandatory'],
  },
  description: String,
  metrics: [
    {
      order: Number,
      metricId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Metric',
      },
    },
  ],
  type: {
    type: String,
    enum: ['normal', 'comparitive'],
    default: 'normal',
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
  active: {
    type: Boolean,
    default: true,
  },
});

dashboardSchema.pre('save', function (next) {
  this.updatedDate = new Date();
  next();
});

// ==========>  Soft Delete Methods
dashboardSchema.methods.softDelete = async function () {
  //  Otherwise continue
  this.active = false;
  await this.save();
};

const Dashboard = mongoose.model('Dashboard', dashboardSchema);

module.exports = Dashboard;
