const express=require('express');
const router=express.Router({ mergeParams:true });
const catchAsync = require('../utils/catchAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const {reviewSchema}=require('../schemas.js');
const Campground =require('../models/campground.js');
const Review=require('../models/review.js');
const reviews=require('../controllers/reviews');
const {validateReview,isLoggedIn,isReviewAuthor}=require('../middleware.js');



router.post('/',isLoggedIn,validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId',isLoggedIn,isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;