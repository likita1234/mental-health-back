const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const SwaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./utils/swagger');

// Routes
const authRouter = require('./routes/auth-routes');
const answerRouter = require('./routes/answer-routes');
const assessmentFormRouter = require('./routes/assessment-form-routes');
const dashboardRouter = require('./routes/dashboard-routes');
const metricRouter = require('./routes/metric-routes');
const questionRouter = require('./routes/question-routes');
const sectionRouter = require('./routes/section-routes');
const surveyRouter = require('./routes/survey-routes');
const userRouter = require('./routes/user-routes');

const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');

const globalErrorHandler = require('./controller/error-controller');
// 1) MIDDLEWARES
// Security HTTP headers
app.use(helmet());

// CORS Policy
app.use(cors());

// Development logging
// Middleware morgan has been added as it is simply a HTTP request logger middleware for node.js
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Middleware for Limit requests from the same API
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: 'Too many requests at the moment. Please try again in an hour',
// });
// app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent paramter pollution :- Clears up query string
// Make some changes here in the whitelist in the near future
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// This will serve your public folder where you can put your static files and use throughout the application
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Add routes here
// Root route for index.html file
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: './' });
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/answer', answerRouter);
app.use('/api/v1/assessmentForm', assessmentFormRouter);
app.use('/api/v1/dashboard', dashboardRouter);
app.use('/api/v1/metric', metricRouter);
app.use('/api/v1/question', questionRouter);
app.use('/api/v1/section', sectionRouter);
app.use('/api/v1/survey', surveyRouter);
app.use('/api/v1/user', userRouter);

// Swagger By Default in the begining
app.use('/docs', SwaggerUI.serve, SwaggerUI.setup(swaggerSpec));
// Docs in JSON format
app.get('/docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use(globalErrorHandler);

module.exports = app;
