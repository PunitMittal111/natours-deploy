// Creating and Getting Reviews //
const Review = require('./../models/reviewModel');
// const catchAsync = require('./../utiles/catchAsync');
const factory = require('./handlerFactory');

// exports.getAllReviews = catchAsync(async (req, res, next) => {
//   // Adding a Nested GET Endpoint //
//   let filter = {};
//   if (req.params.tourId) filter = { tour: req.params.tourId };

//   const reviews = await Review.find(filter);

//   res.status(200).json({
//     status: 'success',
//     results: reviews.length,
//     data: {
//       reviews,
//     },
//   });
// });

exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

// Factory Functions: Reading //
exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);

// Create Review //
exports.createReviews = factory.createOne(Review);

// Factory Functions: Update and Create //
exports.updateReview = factory.updateOne(Review);

// Building Handler Factory Functions: Delete //
exports.deleteReview = factory.deleteOne(Review);
