"use strict"

var express = require('express');
var router = express.Router();
var session = require('express-session');
var passport = require('../passport');
var flash = require('connect-flash');
var queries = require('../db/queries');

// Submit review
router.post('/new', function (req,res,next) {
  queries.getAllReviews().insert({
    username: req.user,
    truck_id: req.body.truck_id,
    content: req.body.content,
    is_positive: req.body.is_positive
  })
  .then(function(){
    console.log(req.user, req.body.truck_id, req.body.content, req.body.is_positive)
    res.redirect('/truck/'+req.body.truck_id)
  })
})

router.get('/user', function (req, res, next) {
  console.log("getting user");
  let reviews = [];
  let userdata,isowner;
  queries.getAllReviews().where('review.username', req.user)
  .join('truck', 'review.truck_id', 'truck.id')
  .select('review.id as review_id', 'truck_id', 'content', 'is_positive', 'created_at', 'username', 'truck_name', 'genre')
  .then((reviewsdata) => {
    console.log("REVIEW DATA");
    console.log(reviewsdata);
    reviews = reviewsdata;
    console.log(reviews);
    return queries.User().where('username', req.user)
  })
  .then((userdata) => {
    userdata = userdata[0];
    queries.getSingleOwnerByUsername(req.user)
    .then((data) => {
      if(data.length===0){
        res.render('userReviews', {
          loggedIn: "yes",
          reviews: reviews,
          user: userdata
        })
      }
      else{
       isowner = "yes";
       res.render('userReviews', {
         loggedIn: "yes",
         reviews: reviews,
         user: userdata,
         isowner
       })
      }

    })
  })
})

router.get('/delete/:id', function (req, res, next) {
  console.log("deleting review "+req.params.id)
  return queries.getAllReviews()
  .where('id', req.params.id).del()
  .then(() => {
    res.redirect('/review/user');
  })
})

module.exports=router;
