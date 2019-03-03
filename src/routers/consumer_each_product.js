const express = require("express");
const mongodb = require("mongodb");
const server = require("../app");
var path = require("path");
const router = express.Router();


router.get('/', async (req, res) => {  
  let id_number = req.headers.referer.split('/');
  id_number = id_number[id_number.length - 1];
  console.log(id_number);
  const posts = await loadPostsCollection();
  const sender = await posts.find({}).toArray();
  let left = -1;
  let right = left;  
  for (let i = 0; i < sender.length; ++i) {
    if (sender[i]._id == id_number) {
      if (i > 0) {
        left = sender[i - 1]._id
      }
      if (i < sender.length - 1) {
        right = sender[i + 1]._id
      }
    }
  }  
  res.send({left:left, right: right});
});

router.get('/post', async (req, res) => {
  const posts = await loadPostsCollection();
  let id_number = req.headers.referer.split('/');
  id_number = id_number[id_number.length - 1];
  console.log(id_number)
  const obj = await posts.findOne({_id: new mongodb.ObjectID(id_number)} );
  res.send(obj.Path);
 })
async function loadPostsCollection() {
  return server.mongo.db("Bahtik").collection("consumer");
};
module.exports = router;