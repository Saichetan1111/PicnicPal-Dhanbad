const mongoose= require('mongoose');
const Campground=require('../models/campground');
const cities=require('./cities');
const { places, descriptors } = require('./seedHelpers');
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price=Math.floor(Math.random()*20)+10;
        const camp = new Campground({
            author: '65a92eee5bf7b14731b8da24',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)}${sample(places)}`,
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed, accusantium ad tenetur sit autem illo ipsa unde nobis aut distinctio dignissimos maxime similique, incidunt omnis id non corrupti excepturi ab?',
            price,
            images: [
                {
                  url: 'https://res.cloudinary.com/dnxuodqta/image/upload/v1705829049/YelpCamp/izbcqge2q9gwqzkulukz.avif',
                  filename: 'YelpCamp/izbcqge2q9gwqzkulukz',
               
                },
                {
                  url: 'https://res.cloudinary.com/dnxuodqta/image/upload/v1705829050/YelpCamp/eoiey8tx4rx27hkd0bdl.jpg',
                  filename: 'YelpCamp/eoiey8tx4rx27hkd0bdl',
                 
                }
              ]
        })
        await camp.save();
}}

seedDB().then(()=>{
    mongoose.connection.close();
})