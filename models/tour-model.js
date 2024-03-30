const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: ['true', 'A tour must have a name'],
      unique: true,
      trim: true,
      maxLength: [
        40,
        'A tour name must have less or equal than 40 characters max',
      ],
      minLength: [
        10,
        'A tour name must have atleast minimum 10 characters max',
      ],
    },
    slug: {
      type: String,
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulties can be either: easy,medium, difficult only',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating value must be equal or greater than 1.0'],
      max: [5, 'Rating value cannot be more than 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        message:
          'Discount price ({VALUE}) cannot be equal or greater than regular price',
        validator: function (val) {
          //  this(which represents the document we are creating ) keyword will work only on create but not on update
          return val < this.price;
        },
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have an image cover'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    active: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Document Middlewares

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', function(next) {
//   console.log('Saving the document now');
//   next();
// });

// tourSchema.post('save', function(doc, next) {
//   console.log('Document has already been saved');
//   // the saved document will be populated in the doc and we can see it in console as follow
//   console.log(doc);
//   next();
// });

// Query Middleware
// filtering out the query in the basis of certain condition
tourSchema.pre(/^find/, function (next) {
  // add a timer to check the time taken
  this.start = Date.now();
  this.find({ active: { $ne: true } });
  next();
});
tourSchema.post(/^find/, function (docs, next) {
  // check the difference in time taken from previous start time
  console.log(`Time taken to execute ${Date.now() - this.start} ms !!`);
  next();
});

// Aggregation Middleware
// filtering out our aggregated data from a middleware
tourSchema.pre('aggregate', function (next) {
  // console.log(this.pipeline);
  this.pipeline().unshift({ $match: { active: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
