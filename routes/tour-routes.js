const express = require('express');
const tourController = require('../controller/tour-controller');
const authController = require('../controller/auth-controller');

const router = express.Router();

router
  .route('/top-5-tours')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(
    authController.validateToken,
    authController.restrictTo('admin', 'superadmin'),
    tourController.getAllTours,
  )
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(authController.validateToken, tourController.deleteTour);

module.exports = router;
