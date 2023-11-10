const express = require('express');
const tourController = require('../controllers/tourController');
const tourMiddleware = require('../middlewares/tourMiddleware');

const router = express.Router();

router.param('id', tourController.checkID);

router.route('/')
    .get(tourController.getAllTours)
    .post( tourMiddleware.storeTour, tourController.createTour );

router.route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports = router;