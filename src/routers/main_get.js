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
  res.send({ left: left, right: right });
});

router.get('/post', async (req, res) => {
  const posts = await loadPostsCollection();
  const posts_cons = await loadPostsCollection1();
  const posts_corp = await loadPostsCollection2();
  const posts_prod = await loadPostsCollection3();

  let id_number = req.headers.referer.split('/');
  id_number = id_number[id_number.length - 1];
  console.log(id_number)
  console.log("beret")
  let obj = await posts.findOne({ _id: new mongodb.ObjectID(id_number) });
  console.log(obj)
  if (obj.type == 1) {
    obj = await posts_cons.findOne({ _id: new mongodb.ObjectID(obj.id_number) });
  }
  else if (obj.type == 2){
    obj = await posts_corp.findOne({ _id: new mongodb.ObjectID(obj.id_number) });
  }
  else {
    obj = await posts_prod.findOne({ _id: new mongodb.ObjectID(obj.id_number) });
  }
  console.log(obj)
  res.send(obj.Path);
})

async function loadPostsCollection() {
  return server.mongo.db("Bahtik").collection("main");
};
async function loadPostsCollection1() {
  return server.mongo.db("Bahtik").collection("consumer");
};
async function loadPostsCollection2() {
  return server.mongo.db("Bahtik").collection("corporate");
};
async function loadPostsCollection3() {
  return server.mongo.db("Bahtik").collection("production");
};
module.exports = router;