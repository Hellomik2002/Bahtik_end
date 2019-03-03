const express = require("express");
const mongodb = require("mongodb");
const server = require("../app");
const multer = require('multer');
const upload = multer({ dest: __dirname + '/../assets/Uploads/images' });
var path = require("path");

const router = express.Router();

router.post('/', upload.single("image"), async (req, res) => {
  const posts = await loadPostsCollection();

  console.log(req.file.filename)
  await posts.insertOne({    
    main_path: req.file.filename
  });

  res.status(200).send();
});

router.get('/', async (req, res) => {
  const posts = await loadPostsCollection();
  res.send(await posts.find({}).toArray());
});
router.delete("/:id", async (req, res) => {
  const posts = await loadPostsCollection();
  let obj = await posts.findOne({ _id: new mongodb.ObjectID(req.params.id)});
  fs.unlink(path.resolve("src/assets/Uploads/images/" + obj.main_path), function () {
    console.log('write operation complete.');
  });
  await posts.deleteOne({ _id: new mongodb.ObjectID(req.params.id) });
  res.status(200).send(); 
  
});


async function loadPostsCollection() {
  return server.mongo.db("Bahtik").collection("clients");
};

module.exports = router;