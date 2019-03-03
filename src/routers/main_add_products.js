const express = require("express");
const mongodb = require("mongodb");
const server = require("../app");
var path = require("path");
const router = express.Router();

router.post('/', async(req, res) =>{
  const posts = await loadPostsCollection();
  await posts.insertOne({
    id_number: req.body.id_number,
    type: req.body.type
  });
  res.status(200).send();
});
router.get('/', async (req, res) => {  
  const posts = await loadPostsCollection();
  //console.log("Life is good")
  const post = await posts.find({}).toArray();
  const posts_corporate = await loadPostsCollection2();
  const posts_consumer = await loadPostsCollection1();
  const posts_production = await loadPostsCollection3();
  let sender = []; 
  //console.log(post)
  //console.log(post.length)
  for (var i = 0; i < post.length; ++i) {
    //console.log(i)
    //console.log("wwwwwwwwwwwwwww")
    if (post[i].type == 1) {
      let give = await posts_consumer.findOne({_id: new mongodb.ObjectID(post[i].id_number) });
      
      sender.push(
        { ...give, type: 1, real_id: post[i]._id} 
          );
    }
    else if(post[i].type == 2) {
      let give = await posts_corporate.findOne({_id: new mongodb.ObjectID(post[i].id_number)})
      sender.push(
        { ...give, type: 2, real_id: post[i]._id}
      )
    }
    else if (post[i].type == 3) {
      let give = await posts_production.findOne({ _id: new mongodb.ObjectID(post[i].id_number) })
      sender.push(
        { ...give, type: 3, real_id: post[i]._id }
      )
    }
  }
  //console.log(sender)
  res.status(200).send(sender)
});
router.delete("/:id", async (req, res) => {
  const posts = await loadPostsCollection();
  await posts.deleteOne({ _id: new mongodb.ObjectID(req.params.id) });
  res.status(200).send();
});

async function loadPostsCollection() {
  return server.mongo.db("Bahtik").collection("main");
};
async function loadPostsCollection2() {
  return server.mongo.db("Bahtik").collection("corporate");
};
async function loadPostsCollection1() {
  return server.mongo.db("Bahtik").collection("consumer");
};
async function loadPostsCollection3() {
  return server.mongo.db("Bahtik").collection("production");
};
module.exports = router;