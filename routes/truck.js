"use strict"

var express = require('express');
var router = express.Router();
var session = require('express-session');
var passport = require('../passport');
var flash = require('connect-flash');
var queries = require('../db/queries.js');

function makeTimeNeat(time) {
  let stringTime = String(time);
  let hours, minutes, ampm;
  if (stringTime.length === 3) {
    hours = stringTime.substring(0,1);
    minutes = stringTime.substring(1,3);
  } else {
    hours = stringTime.substring(0,2);
    minutes = stringTime.substring(2,4);
  }
  if (hours > 12) {
    ampm = "PM";
    hours -= 12;
  } else if (hours === 12) {
    ampm = "PM";
  } else {
    ampm = "AM"
  }
  let newStringTime = hours+":"+minutes+" "+ampm;
  return newStringTime;
}

router.get('/picture', function(req, res, next) {
  return queries.User().where('username', req.user)
  .then(function(user) {
      console.log(user[0].image_url);
      //res.render('layout', {user: user[0]});

      //res.render('truck',{loggedIn: "yes", user: user[0]});
    })
   .catch(function(error) {return next(error);
  });
})

// /truck
router.get('/new', function (req, res, next) {
  res.render('newTruck');
})

router.post('/new', function (req, res, next) {
  console.log(req.body);
  res.render('owner')
})

router.get('/:id', function(req,res,next) {
  var data={};
  queries.getScheduleTruck(req.params.id)
  .then(function(result){
    data=result;
    for(var search in data){
      if(data[search].location==="none"){
        data[search].location="Closed";
      }
      if(data[search].open_time===0){
        data[search].open_time="";
      }
      if(data[search].close_time===0){
        data[search].close_time="";
      }
      else{
        data[search].open_time=makeTimeNeat(data[search].open_time);
        data[search].close_time=makeTimeNeat(data[search].close_time);
      }
    }
  })
  .then(() => {
    return queries.GetTruckReviews(req.params.id)
  })
  .then((reviews) => { // Is this correct? Somewhere within this code we need to put in images for our images for every user. Do another query.
    data.reviews=reviews;
    console.log(reviews);
    res.render('truck', {
      truck: data, //
      loggedIn: "yes"
      //user: user[0]
    });
  })
})

router.post('/new/signup', function (req, res, next) {
  var name=req.user;
  var identOwner=0;
  var placeHolder=0;
  var truckName='';
  queries.getOwnerByUsername(name)
  .then(function(owner){
    identOwner=owner[0].id;
    return identOwner
  })
  .then((id) => {
    truckName=req.body.truck_name;
    console.log(truckName)
    queries.getAllTrucks().insert({
      owner_id: id,
      truck_name: req.body.truck_name,
      image_url: req.body.image_url,
      genre: req.body.genre,
      description: req.body.description
    })
  })
  .then(function(){
    console.log('The value of truckName is:'+truckName)
    queries.getTrucksByName(truckName)
    .then(function(truckReturned){
      console.log(truckReturned)
      placeHolder=truckReturned.id;
    })
  })
  .then(function(){
    queries.getAllTruckSchedules().insert({
      truck_id: placeHolder,
      date: req.body.dateSunday,
      location: req.body.SundayLocation,
      open_time: req.body.SundayOpen,
      close_time: req.body.SundayClose,
    })
    .then(function(){
      console.log(req.body.dateSunday, req.body.SundayLocation, req.body.SundayOpen, req.body.SundayClose)
    })
  })
  .then(() => {
    queries.getAllTruckSchedules().insert({
      truck_id: placeHolder,
      date: req.body.dateMonday,
      location: req.body.MondayLocation,
      open_time: req.body.MondayOpen,
      close_time: req.body.MondayClose,
    })
    .then(function(){
      console.log(req.body.dateMonday, req.body.MondayLocation, req.body.MondayOpen, req.body.MondayClose)
    })
  })
  .then(() => {
    queries.getAllTruckSchedules().insert({
      truck_id: placeHolder,
      date: req.body.dateTuesday,
      location: req.body.TuesdayLocation,
      open_time: req.body.TuesdayOpen,
      close_time: req.body.TuesdayClose,
    })
    .then(function(){
      console.log(req.body.dateTuesday, req.body.TuesdayLocation, req.body.TuesdayOpen, req.body.TuesdayClose)
    })
  })
  .then(function(){
    queries.getAllTruckSchedules().insert({
      truck_id: placeHolder,
      date: req.body.dateWednesday,
      location: req.body.WednesdayLocation,
      open_time: req.body.WednesdayOpen,
      close_time: req.body.WednesdayClose,
    })
    .then(function(){
      console.log(req.body.dateWednesday, req.body.WednesdayLocation, req.body.WednesdayOpen, req.body.WednesdayClose)
    })
  })
  .then(function(){
    queries.getAllTruckSchedules().insert({
      truck_id: placeHolder,
      date: req.body.dateThursday,
      location: req.body.ThursdayLocation,
      open_time: req.body.ThursdayOpen,
      close_time: req.body.ThursdayClose,
    })
    .then(function(){
      console.log(req.body.dateThursday, req.body.ThursdayLocation, req.body.ThursdayOpen, req.body.ThursdayClose)
    })
  })
  .then(function(){
    queries.getAllTruckSchedules().insert({
      truck_id: placeHolder,
      date: req.body.dateFriday,
      location: req.body.FridayLocation,
      open_time: req.body.FridayOpen,
      close_time: req.body.FridayClose,
    })
    .then(function(){
      console.log(req.body.dateFriday, req.body.FridayLocation, req.body.FridayOpen, req.body.FridayClose)
    })
  })
  .then(function(){
    return queries.getAllTruckSchedules().insert({
      truck_id: placeHolder,
      date: req.body.dateSaturday,
      location: req.body.SaturdayLocation,
      open_time: req.body.SaturdayOpen,
      close_time: req.body.SaturdayClose,
    }, 'truck_id')
  })
  .then(function(result){
    console.log(req.body.dateSaturday, req.body.SaturdayLocation, req.body.SaturdayOpen, req.body.SaturdayClose)
    res.redirect('/truck/'+result[0]);
  })
});

//Owner Edit page
router.get('/edit/new', function (req, res, next) {
  // var ownerIdent=0;
  queries.getOwnerByUsername(req.user)
  .then(function(username){
    // ownerIdent=username[0].id
    return username[0].id
  })
  .then((username) => {
    console.log(username)
    queries.getTruckByOwnerName(username)
    .then(function(truck){
      console.log('Truck[0] is:',truck[0])
      if(truck[0].owner_id!==username){
        res.render('index');
      }
      else{
        console.log('truck[0] is now',truck[0].id)
        queries.getScheduleTruck(truck[0].id)
        .then(function(showMe){
          console.log('showMe is:',showMe)
          res.render('truckEdit', {
            truck:showMe
            })
          })
        }
      })
    })
  })

router.post('/update/:id', function(req,res,next){
  console.log('Here!')
  queries.getSingleTruck(req.params.id)
  .update({
    truck_name: req.body.truck_name,
    image_url: req.body.image_url,
    genre: req.body.genre,
    description: req.body.description
  },'id')
  .then(function(id){
    res.redirect('/truck/'+id[0])
  })
})

module.exports = router;
