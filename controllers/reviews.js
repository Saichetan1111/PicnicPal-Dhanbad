const Restaurant = require('../models/restaurant')
const Review = require('../models/reviews');

module.exports.createReview = async(req,res)=>{
    const restaurant = await Restaurant.findById(req.params.id);
    const review = new Review(req.body.review);
     review.author = req.user._id;
     restaurant.reviews.push(review);
     await review.save();
     await restaurant.save();
     req.flash('success','Created a new review');
      res.redirect(`/restaurants/${restaurant._id}`);
}


module.exports.deleteReview =  async(req,res)=>{
    const restaurant = await Restaurant.findById(req.params.id);
       await Review.findByIdAndDelete(req.params.reviewId);
       req.flash('success','Successfully deleted review')
       res.redirect(`/restaurants/${restaurant._id}`);
   }