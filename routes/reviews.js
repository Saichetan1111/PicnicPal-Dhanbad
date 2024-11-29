const express = require('express');
const router = express.Router({mergeParams: true});

const Restaurant = require('../models/restaurant')
const Review = require('../models/reviews');
const {restaurantSchema,reviewSchema} = require('../schemas.js')
const {isLoggedIn} = require('../middleware')
const catchAsync = require('../utilities/catchAsync')
const ExpressErrors = require('../utilities/ExpressErrors')

const reviews = require('../controllers/reviews');

const validateReview=(req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);

    if(error){
     const msg = error.details.map(el =>el.message).join(',')
     throw new ExpressErrors(msg,400)
 }else{
     next();
 }

}


router.post('/',isLoggedIn,validateReview,catchAsync(reviews.createReview))
router.delete('/:reviewId',catchAsync(reviews.deleteReview))
 

module.exports = router