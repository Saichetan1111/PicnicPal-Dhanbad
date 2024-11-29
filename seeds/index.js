const { captureRejectionSymbol } = require('events')
const express= require('express')
const mongoose = require('mongoose')
const path=require('path')
const Restaurant = require('../models/restaurant')
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const cities = require('./cities');
const {places,descriptors} = require('./seedHelpers')
mongoose.connect('mongodb://127.0.0.1:27017/food')
.then(()=>{
    console.log("MONGO CONNECTION OPPEN !!!");
})
.catch(err =>{
    console.log("OH NO MONGO CONNECTION ERROR!!!!");
    console.log(err);
})


const sample = array=>array[Math.floor(Math.random()*array.length)];


const seedDB = async ()=>{
    await Restaurant.deleteMany({});
    for(let i =0;i<10;i++){
        const randprice = Math.floor(Math.random()*20)+30;
           const random = Math.floor(Math.random()*100);
         const res = new Restaurant({
                  author : '6471050244ee21611212c82f',
                  location : `${cities[random].city},${cities[random].state}`,
                  title : `${sample(descriptors)} ${sample(places)}`,
                //  image :   'https://source.unsplash.com/collection/483251}',
                  description : 'Lorem ipsum dolor sit amet consectetur adipisicing elit. At provident, eius quibusdam iste aliquid vero est, unde molestiae repellat quos impedit dolorem do',
                  price : randprice,
                   images:  [
                    {
                      url: 'https://res.cloudinary.com/dg67jiyxh/image/upload/v1685204021/YelpCamp/snaelfpdupyxwutgnxqi.png',
                      filename: 'YelpCamp/snaelfpdupyxwutgnxqi',
                     
                    },
                    {
                      url: 'https://res.cloudinary.com/dg67jiyxh/image/upload/v1685204025/YelpCamp/hn9oyctxjsmejolojzut.png',
                      filename: 'YelpCamp/hn9oyctxjsmejolojzut',
                     
                    }
                  ]
         });   

           await res.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
})
