const express = require("express");
const mongodb = require("mongodb");
const server = require("../app");
const multer = require('multer');
const upload = multer({ dest: __dirname + '/../assets/Uploads/images' });
var path = require("path");
var fs = require("fs");

const router = express.Router();

router.post('/', upload.single("files"), async (req, res) => {
  const posts = await loadPostsCollection();
  let oldValue = {status:req.body.status};
  let newValue = {$set: {Path: req.file.filename}};
  const ans = await posts.findOne({'status':req.body.status});
  console.log(ans);
  if (ans.Path != "") { 
    fs.unlink(path.resolve("src/assets/Uploads/images/" + ans.Path), function (err) {
      if (err) return console.log(err);
      console.log('write operation complete.');
    });
  }

  console.log(ans);   
  await posts.updateOne(oldValue, newValue);
  res.status(200).send();
  
});
router.get('/', async (req, res)=>{
  const posts = await loadPostsCollection();

  const ans = await posts.findOne({'status':req.query[0]});
  
  res.send(ans.Path);
});

async function loadPostsCollection() {
  return server.mongo.db("Bahtik").collection("page_photo");
};

module.exports = router;