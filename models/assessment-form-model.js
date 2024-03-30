const mongoose = require('mongoose');

const assessmentFormSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  updatedDate: {
    type: Date,
    default: Date.now,
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

const AssessmentForm = mongoose.model('AssessmentForm', assessmentFormSchema);

module.exports = AssessmentForm;
