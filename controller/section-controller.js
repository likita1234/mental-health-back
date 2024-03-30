const Section = require('../models/section-model');

const APIFeatures = require('../utils/api-features');
const AppError = require('../utils/app-errors');
const catchAsync = require('../utils/catch-async');

// Create a section
exports.addSection = catchAsync(async (req, res, next) => {
  // 1) Save the section data
  console.log(req.body)
  const newSection = await Section.create({
    ...req.body,
  });

  const populatedSection = await Section.populate(newSection, {
    path: 'questions',
    model: 'Question',
    populate:{
        path: 'options',
        model: 'QuestionOption'
    }
  });

  res.status(201).json({
    status: 'success',
    data: {
      section: populatedSection,
    },
  });
});

// Update existing section
exports.updateSection = catchAsync(async(req,res,next)=>{
    // 1) Extract sectionId from query parameter
    const sectionId = req.query.sectionId
    // 2) Check if sectionId exists
    const existingSection = await Section.findById(sectionId)
    console.log(existingSection)
})

// extract all sections
exports.getAllSections = catchAsync(async (req, res, next) => {
  // Execute Query
  const features = new APIFeatures(
    Section.find().populate({ path: 'questions', select: '-__v' }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const sections = await features.query;
  res.status(200).json({
    status: 'success',
    total: sections.length,
    data: {
      sections,
    },
  });
});

