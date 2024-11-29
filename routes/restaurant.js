const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync')
const ExpressErrors = require('../utilities/ExpressErrors')
const Restaurant = require('../models/restaurant')
const {restaurantSchema,reviewSchema} = require('../schemas.js')
const {isLoggedIn} = require('../middleware');

const restaurants = require('../controllers/restaurants')

const {storage} = require('../cloudinary')
const multer = require('multer');
const upload = multer({storage})

 
const validateRestaurant = (req,res,next)=>{
              const {error} = restaurantSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el =>el.message).join(',')
        throw new ExpressErrors(msg,400)
    }else{
        next();
    }
}


router.get('/',catchAsync(restaurants.index))
router.get('/new',isLoggedIn,restaurants.renderNewForm)

router.post('/',isLoggedIn,upload.array('image'),validateRestaurant,catchAsync(restaurants.createRestaurant));

// router.post('/', upload.array('image'),(req,res)=>{
//     console.log(req.body,req.files);
//     res.send('It Worked !!');
      
// })

router.get('/:id',catchAsync(restaurants.showRestaurant))
router.get('/:id/edit',isLoggedIn,catchAsync(restaurants.renderEditPage));
router.put('/:id',upload.array('image'),validateRestaurant,catchAsync(restaurants.updateRestaurant))
router.delete('/:id',catchAsync(restaurants.deleteRestaurant));

module.exports = router;
