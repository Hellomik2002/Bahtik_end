const express = require("express");
const mongodb = require("mongodb");
const server = require("../app");
var path = require("path");
const router = express.Router();

router.post('/',   async (req, res) => {
  const posts = await loadPostsCollection();
  
  //await posts.insertOne(req.body);
  
  let oldValue = { name: req.body.name};
  let newValue = { $set: req.body};
  //console.log("happend1")
  await posts.updateOne(oldValue, newValue);
  //console.log("happend2")
  ////console.log(req.body)
  res.status(200).send();
});

router.get('/', async (req, res) => {
  const posts = await loadPostsCollection();
  console.log(req.query);
  const sender = await posts.findOne(req.query); 
  console.log(sender)
  res.send(sender);
});

async function loadPostsCollection() {
  return server.mongo.db("Bahtik").collection("footer");
};

module.exports = router;